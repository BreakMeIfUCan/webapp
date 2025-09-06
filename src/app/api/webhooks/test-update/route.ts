import { NextRequest, NextResponse } from 'next/server'
import { updateTestStatusFromWebhook } from '@/data-access/tests'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('Webhook received:', body)
    
    const { testId, status, progress, results, error } = body

    // Validate required fields
    if (!testId || !status) {
      console.error('Missing required fields:', { testId, status })
      return NextResponse.json(
        { error: 'Missing required fields: testId and status' },
        { status: 400 }
      )
    }

    // Validate status
    if (!['pending', 'running', 'completed', 'failed'].includes(status)) {
      console.error('Invalid status:', status)
      return NextResponse.json(
        { error: 'Invalid status. Must be one of: pending, running, completed, failed' },
        { status: 400 }
      )
    }

    console.log('Updating test status:', { testId, status, progress, results, error })

    // Update test status
    const result = await updateTestStatusFromWebhook(testId, status, {
      progress,
      ...results,
      error
    })

    if (!result.success) {
      console.error('Failed to update test status:', result.error)
      return NextResponse.json(
        { error: result.error || 'Failed to update test status' },
        { status: 500 }
      )
    }

    console.log('Test status updated successfully:', testId)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
