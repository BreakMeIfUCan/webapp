import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Return the available defense types
    const defenses = [
      'SmoothLLM',
      'Perplexity filtering',
      'Removal of non-dictionary words',
      'Synonym substitution'
    ]
    
    return NextResponse.json({
      defenses,
      count: defenses.length
    })
  } catch (error) {
    console.error('Error fetching defenses:', error)
    return NextResponse.json(
      { error: 'Failed to fetch defenses' },
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
