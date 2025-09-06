// Simple Python Backend Integration

export interface PythonTestRequest {
  testId: string
  category: 'white' | 'black'
  modelId?: string
  customDatasetPath?: string
  curlEndpoint?: string
  attackCategory?: string
}

export interface PythonTestResponse {
  success: boolean
  testId: string
  status: 'completed' | 'failed'
  results?: {
    // White box results
    asr?: number
    accuracy?: number
    recall?: number
    precision?: number
    f1?: number
    
    // Black box results
    latency?: number
    tokenUsage?: number
    categoryWiseASR?: Record<string, number>
  }
  error?: string
}

export interface AvailableModelsResponse {
  models: string[]
  count: number
}

class PythonBackendService {
  private baseUrl: string

  constructor() {
    this.baseUrl = process.env.PYTHON_BACKEND_URL || 'http://localhost:8000'
  }

  // Get available models from Python backend
  async getAvailableModels(): Promise<AvailableModelsResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/models`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error fetching available models:', error)
      // Return fallback models if backend is not available
      return {
        models: ['vicuna-13b-v1.5', 'llama-2-7b-chat-hf', 'gpt-3.5-turbo-1106', 'gpt-4-0125-preview'],
        count: 4
      }
    }
  }

  // Submit test to Python backend
  async submitTest(request: PythonTestRequest): Promise<PythonTestResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/tests/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error submitting test to Python backend:', error)
      return {
        success: false,
        testId: request.testId,
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  // Get test status from Python backend
  async getTestStatus(testId: string): Promise<PythonTestResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/tests/${testId}/status`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error getting test status from Python backend:', error)
      return {
        success: false,
        testId,
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }
}

export const pythonBackend = new PythonBackendService()
