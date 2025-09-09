import { NextRequest, NextResponse } from 'next/server'

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

// Map frontend defense names to backend expected names
const mapDefenseType = (frontendDefense: string): string => {
  const defenseMap: Record<string, string> = {
    'SmoothLLM': 'SmoothLLM',
    'Perplexity filtering': 'PerplexityFilter',
    'Removal of non-dictionary words': 'RemoveNonDictionary',
    'Synonym substitution': 'SynonymSubstitution'
  }
  return defenseMap[frontendDefense] || frontendDefense
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('Request body:', body)
    
    // Transform the request body to match backend expectations
    const transformedBody = {
      cURL: body.curl_command, // Backend expects 'cURL', we send 'curl_command'
      attack_category: body.attack_category,
      max_samples: body.max_samples,
      behaviour: body.behaviour,
      defense: mapDefenseType(body.defense) // Map defense type to backend format
    }
    console.log('Transformed body:', transformedBody)
    
    // Try the defense endpoint first, fallback to regular evaluation if not available
    let response = await fetch(`${process.env.PYTHON_BACKEND_URL}/defense/evaluate/blackbox`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(transformedBody),
      signal: AbortSignal.timeout(30000), // 30 second timeout
    })

    console.log('Defense endpoint response status:', response.status)
    console.log('Defense endpoint response headers:', response.headers)

    // If defense endpoint doesn't exist (404) or is unavailable (503), fallback to regular evaluation
    if (response.status === 404 || response.status === 503 || response.status >= 500) {
      console.log(`Defense endpoint not available (status: ${response.status}), falling back to regular evaluation`)
      console.log('Fallback URL:', `${process.env.PYTHON_BACKEND_URL}/nlp/evaluate/blackbox`)
      
      // Remove defense parameter for fallback
      const { defense, ...fallbackBody } = transformedBody
      
      response = await fetch(`${process.env.PYTHON_BACKEND_URL}/nlp/evaluate/blackbox`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(fallbackBody),
        signal: AbortSignal.timeout(30000), // 30 second timeout
      })
      console.log('Fallback response status:', response.status)
      console.log('Fallback response headers:', response.headers)
    }

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Response not ok:', response.status, errorText)
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`)
    }

    const data = await response.json()
    console.log('Response data:', data)
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error in blackbox defense evaluation proxy:', error)
    
    // Handle timeout errors
    if (error instanceof Error && error.name === 'TimeoutError') {
      return NextResponse.json(
        { error: 'Request timeout - defense endpoint took too long to respond', details: 'The defense endpoint is not responding within 30 seconds' },
        { status: 408 }
      )
    }
    
    // Handle network errors
    if (error instanceof Error && (error.message.includes('fetch') || error.message.includes('network'))) {
      return NextResponse.json(
        { error: 'Network error - unable to reach defense endpoint', details: error.message },
        { status: 503 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to process blackbox defense evaluation', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
