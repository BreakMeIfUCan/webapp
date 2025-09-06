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
  categoryWiseASR?: any
  error?: string
}) {
  try {
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
    if (data?.categoryWiseASR !== undefined) updateData.categoryWiseASR = data.categoryWiseASR
    if (data?.error) updateData.error = data.error
    if (status === 'completed' || status === 'failed') {
      updateData.completedAt = new Date()
    }
    
    await db
      .update(tests)
      .set(updateData)
      .where(and(eq(tests.id, testId), eq(tests.userId, user.id)))
    
    revalidatePath('/dashboard')
    revalidatePath('/dashboard/results')
    revalidatePath(`/dashboard/results/${testId}`)
    
    return { success: true }
  } catch (error) {
    console.error('Error updating test status:', error)
    return { success: false, error: 'Failed to update test status' }
  }
}

// Update test status from webhook (no user authentication required)
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