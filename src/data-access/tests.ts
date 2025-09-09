"use server"

import { db, tests, users } from '@/db'
import { eq, desc, and } from 'drizzle-orm'
import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

// Get current user
async function getCurrentUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('User not authenticated')
  }
  
  // Get or create user in our database
  const existingUser = await db.select().from(users).where(eq(users.email, user.email!)).limit(1)
  
  if (existingUser.length === 0) {
    const [newUser] = await db.insert(users).values({
      email: user.email!,
      firstName: user.user_metadata?.first_name || null,
      lastName: user.user_metadata?.last_name || null,
    }).returning()
    return newUser
  }
  
  return existingUser[0]
}

// Create a new test
export async function createTest(data: {
  name: string
  description?: string
  category: 'black' | 'white'
  modelId?: string
  customDatasetPath?: string
  curlEndpoint?: string
  attackCategory?: string
  defenseType?: string
  maxSamples?: number
}) {
  try {
    const user = await getCurrentUser()
    
    const [test] = await db.insert(tests).values({
      userId: user.id,
      name: data.name,
      description: data.description,
      category: data.category,
      modelId: data.modelId || null,
      customDatasetPath: data.customDatasetPath || null,
      curlEndpoint: data.curlEndpoint || null,
      attackCategory: data.attackCategory || null,
      defenseType: data.defenseType || null,
      maxSamples: data.maxSamples || 5,
      status: 'pending',
    }).returning()
    
    revalidatePath('/dashboard')
    revalidatePath('/dashboard/results')
    
    return { success: true, testId: test.id }
  } catch (error) {
    console.error('Error creating test:', error)
    return { success: false, error: 'Failed to create test' }
  }
}

// Get all tests for current user
export async function getUserTests() {
  try {
    const user = await getCurrentUser()
    
    const userTests = await db
      .select()
      .from(tests)
      .where(eq(tests.userId, user.id))
      .orderBy(desc(tests.createdAt))
    
    return userTests.map(test => ({
      ...test,
      createdAt: test.createdAt.toISOString(),
      completedAt: test.completedAt?.toISOString(),
    }))
  } catch (error) {
    console.error('Error fetching tests:', error)
    return []
  }
}

// Get a specific test by ID
export async function getTestById(testId: string) {
  try {
    const user = await getCurrentUser()
    
    const [test] = await db
      .select()
      .from(tests)
      .where(and(eq(tests.id, testId), eq(tests.userId, user.id)))
      .limit(1)
    
    if (!test) return null
    
    console.log('🔍 getTestById - Raw test from DB:', test)
    console.log('🔍 getTestById - defenseType from DB:', test.defenseType)
    
    return {
      ...test,
      createdAt: test.createdAt.toISOString(),
      completedAt: test.completedAt?.toISOString(),
    }
  } catch (error) {
    console.error('Error fetching test:', error)
    return null
  }
}

// Update test status and results (for authenticated users)
export async function updateTestStatus(testId: string, status: 'pending' | 'running' | 'completed' | 'failed', data?: {
  progress?: number
  asr?: number
  accuracy?: number
  recall?: number
  precision?: number
  f1?: number
  latency?: number
  tokenUsage?: number
  token_usage?: number
  categoryWiseASR?: any
  category_wise_asr?: Record<string, number>
  total_attacks?: number
  successful_attacks?: number
  category_failures?: Record<string, number>
  error?: string
}) {
  try {
    console.log('💾 UPDATING TEST STATUS:')
    console.log('🆔 Test ID:', testId)
    console.log('📊 Status:', status)
    console.log('📋 Data:', JSON.stringify(data, null, 2))
    
    const user = await getCurrentUser()
    
    const updateData: any = {
      status,
      updatedAt: new Date(),
    }
    
    if (data?.progress !== undefined) updateData.progress = data.progress
    if (data?.asr !== undefined) updateData.asr = data.asr
    if (data?.accuracy !== undefined) updateData.accuracy = data.accuracy
    if (data?.recall !== undefined) updateData.recall = data.recall
    if (data?.precision !== undefined) updateData.precision = data.precision
    if (data?.f1 !== undefined) updateData.f1 = data.f1
    if (data?.latency !== undefined) updateData.latency = data.latency
    if (data?.tokenUsage !== undefined) updateData.tokenUsage = data.tokenUsage
    if (data?.token_usage !== undefined) updateData.tokenUsage = data.token_usage
    if (data?.categoryWiseASR !== undefined) updateData.categoryWiseASR = data.categoryWiseASR
    if (data?.category_wise_asr !== undefined) updateData.categoryWiseASR = data.category_wise_asr
    if (data?.error) updateData.error = data.error
    if (status === 'completed' || status === 'failed') {
      updateData.completedAt = new Date()
    }
    
    console.log('💾 Database Update Data:', JSON.stringify(updateData, null, 2))
    
    await db
      .update(tests)
      .set(updateData)
      .where(and(eq(tests.id, testId), eq(tests.userId, user.id)))
    
    console.log('✅ Test status updated successfully')
    
    revalidatePath('/dashboard')
    revalidatePath('/dashboard/results')
    revalidatePath(`/dashboard/results/${testId}`)
    
    return { success: true }
  } catch (error) {
    console.error('Error updating test status:', error)
    return { success: false, error: 'Failed to update test status' }
  }
}

// Submit defense evaluation for an existing test - Async workflow
export async function submitDefenseEvaluation(testId: string, defenseType: string, results: any) {
  try {
    console.log('💾 UPDATING DATABASE WITH DEFENSE RESULTS:')
    console.log('🆔 Test ID:', testId)
    console.log('🛡️ Defense Type:', defenseType)
    console.log('📊 Results:', JSON.stringify(results, null, 2))
    
    const user = await getCurrentUser()
    
    // Get the existing test
    const [test] = await db
      .select()
      .from(tests)
      .where(and(eq(tests.id, testId), eq(tests.userId, user.id)))
      .limit(1)
    
    if (!test) {
      throw new Error('Test not found')
    }

    // Update test with defense results
    const updateData: any = {
      defenseType: defenseType,
      status: 'completed',
      updatedAt: new Date(),
    }

    // Map defense results to database fields
    if (results) {
      console.log('🔍 Defense results.defense_applied:', results.defense_applied)
      console.log('🔍 Defense parameter defenseType:', defenseType)
      
      if (results.defense_applied) {
        updateData.defenseType = results.defense_applied
        console.log('✅ Using defense_applied:', results.defense_applied)
      } else {
        // Fallback: use the defenseType parameter if defense_applied is not available
        updateData.defenseType = defenseType
        console.log('⚠️ Using fallback defenseType:', defenseType)
      }
      if (results.asr !== undefined) {
        updateData.defenseASR = results.asr
      }
      if (results.accuracy !== undefined) {
        updateData.defenseAccuracy = results.accuracy
      }
      if (results.recall !== undefined) {
        updateData.defenseRecall = results.recall
      }
      if (results.precision !== undefined) {
        updateData.defensePrecision = results.precision
      }
      if (results.f1 !== undefined) {
        updateData.defenseF1 = results.f1
      }
      if (results.latency !== undefined) {
        updateData.defenseLatency = results.latency
      }
      if (results.token_usage !== undefined) {
        updateData.defenseTokenUsage = results.token_usage
      }
      if (results.category_wise_asr) {
        updateData.defenseCategoryWiseASR = results.category_wise_asr
      }
    }

    console.log('💾 Database Update Data:', JSON.stringify(updateData, null, 2))
    
    await db
      .update(tests)
      .set(updateData)
      .where(and(eq(tests.id, testId), eq(tests.userId, user.id)))
    
    console.log('✅ Database updated successfully')
    
    revalidatePath('/dashboard')
    revalidatePath('/dashboard/results')
    revalidatePath(`/dashboard/results/${testId}`)
    
    return { success: true, testId }
  } catch (error) {
    console.error('Error submitting defense evaluation:', error)
    return { success: false, error: 'Failed to submit defense evaluation' }
  }
}

// Update test status from webhook (no user authentication required) - DEPRECATED: Using async/await workflow now
/*
export async function updateTestStatusFromWebhook(testId: string, status: 'pending' | 'running' | 'completed' | 'failed', data?: {
  progress?: number
  asr?: number
  accuracy?: number
  recall?: number
  precision?: number
  f1?: number
  latency?: number
  tokenUsage?: number
  categoryWiseASR?: any
  defenseASR?: number
  defenseAccuracy?: number
  defenseRecall?: number
  defensePrecision?: number
  defenseF1?: number
  defenseLatency?: number
  defenseTokenUsage?: number
  defenseCategoryWiseASR?: any
  error?: string
}) {
  try {
    const updateData: any = {
      status,
      updatedAt: new Date(),
    }
    
    if (data?.progress !== undefined) updateData.progress = data.progress
    if (data?.asr !== undefined) updateData.asr = data.asr
    if (data?.accuracy !== undefined) updateData.accuracy = data.accuracy
    if (data?.recall !== undefined) updateData.recall = data.recall
    if (data?.precision !== undefined) updateData.precision = data.precision
    if (data?.f1 !== undefined) updateData.f1 = data.f1
    if (data?.latency !== undefined) updateData.latency = data.latency
    if (data?.tokenUsage !== undefined) updateData.tokenUsage = data.tokenUsage
    if (data?.categoryWiseASR !== undefined) updateData.categoryWiseASR = data.categoryWiseASR
    if (data?.defenseASR !== undefined) updateData.defenseASR = data.defenseASR
    if (data?.defenseAccuracy !== undefined) updateData.defenseAccuracy = data.defenseAccuracy
    if (data?.defenseRecall !== undefined) updateData.defenseRecall = data.defenseRecall
    if (data?.defensePrecision !== undefined) updateData.defensePrecision = data.defensePrecision
    if (data?.defenseF1 !== undefined) updateData.defenseF1 = data.defenseF1
    if (data?.defenseLatency !== undefined) updateData.defenseLatency = data.defenseLatency
    if (data?.defenseTokenUsage !== undefined) updateData.defenseTokenUsage = data.defenseTokenUsage
    if (data?.defenseCategoryWiseASR !== undefined) updateData.defenseCategoryWiseASR = data.defenseCategoryWiseASR
    if (data?.error) updateData.error = data.error
    if (status === 'completed' || status === 'failed') {
      updateData.completedAt = new Date()
    }
    
    await db
      .update(tests)
      .set(updateData)
      .where(eq(tests.id, testId))
    
    revalidatePath('/dashboard')
    revalidatePath('/dashboard/results')
    revalidatePath(`/dashboard/results/${testId}`)
    
    return { success: true }
  } catch (error) {
    console.error('Error updating test status from webhook:', error)
    return { success: false, error: 'Failed to update test status' }
  }
}
*/

// Get test statistics for dashboard
export async function getTestStats() {
  try {
    const user = await getCurrentUser()
    
    const userTests = await db
      .select({
        status: tests.status,
        asr: tests.asr,
        latency: tests.latency,
      })
      .from(tests)
      .where(eq(tests.userId, user.id))
    
    const totalTests = userTests.length
    const completedTests = userTests.filter(t => t.status === 'completed').length
    const runningTests = userTests.filter(t => t.status === 'running').length
    const failedTests = userTests.filter(t => t.status === 'failed').length
    
    // Calculate average ASR
    const completedWithASR = userTests.filter(t => t.status === 'completed' && t.asr)
    const avgASR = completedWithASR.length > 0 
      ? Math.round(completedWithASR.reduce((sum, t) => sum + (parseFloat(t.asr!) * 100), 0) / completedWithASR.length)
      : 0
    
    // Calculate average latency
    const testsWithLatency = userTests.filter(t => t.status === 'completed' && t.latency)
    const avgLatency = testsWithLatency.length > 0
      ? (testsWithLatency.reduce((sum, t) => sum + parseFloat(t.latency!), 0) / testsWithLatency.length).toFixed(1) + 's'
      : '0.0s'
    
    return {
      totalTests,
      completedTests,
      runningTests,
      failedTests,
      avgASR,
      avgLatency,
      totalAttacks: completedTests, // Simple count
      activeTests: runningTests,
    }
  } catch (error) {
    console.error('Error fetching test stats:', error)
    return {
      totalTests: 0,
      completedTests: 0,
      runningTests: 0,
      failedTests: 0,
      avgASR: 0,
      avgLatency: '0.0s',
      totalAttacks: 0,
      activeTests: 0,
    }
  }
}

// Get attack category statistics
export async function getAttackCategoryStats() {
  try {
    const user = await getCurrentUser()
    
    const userTests = await db
      .select({
        attackCategory: tests.attackCategory,
        asr: tests.asr,
      })
      .from(tests)
      .where(and(eq(tests.userId, user.id), eq(tests.status, 'completed')))
    
    const categoryMap = new Map<string, { count: number, totalASR: number }>()
    
    userTests.forEach(test => {
      if (test.attackCategory && test.asr) {
        const category = test.attackCategory
        const current = categoryMap.get(category) || { count: 0, totalASR: 0 }
        categoryMap.set(category, {
          count: current.count + 1,
          totalASR: current.totalASR + (parseFloat(test.asr) * 100)
        })
      }
    })
    
    return Array.from(categoryMap.entries()).map(([name, data]) => ({
      name,
      count: data.count,
      asr: Math.round(data.totalASR / data.count)
    }))
  } catch (error) {
    console.error('Error fetching attack category stats:', error)
    return []
  }
}