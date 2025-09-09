import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Return the available models
    const models = [
      'Qwen/Qwen3-0.6B',
      'vicuna-13b-v1.5', 
      'llama-2-7b-chat-hf',
      'gpt-3.5-turbo-1106',
      'gpt-4-0125-preview'
    ]
    
    return NextResponse.json({
      models,
      count: models.length
    })
  } catch (error) {
    console.error('Error fetching models:', error)
    return NextResponse.json(
      { error: 'Failed to fetch models' },
      { status: 500 }
    )
  }
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}
