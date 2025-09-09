// NLP Backend Integration

export interface WhiteBoxEvaluationRequest {
  model_id: string
  custom_dataset: string
  max_samples: number
  behaviour?: string
  defense?: string
}

export interface BlackBoxEvaluationRequest {
  curl_command: string
  attack_category: string | string[]
  max_samples: number
  behaviour?: string
  defense?: string
}

export interface WhiteBoxEvaluationResponse {
  asr: number
  accuracy: number
  recall: number
  precision: number
  f1: number
  total_attacks: number
  successful_attacks: number
  category_failures: Record<string, number>
}

export interface BlackBoxEvaluationResponse {
  asr: number
  category_wise_asr: Record<string, number>
  latency: number
  token_usage: number
  total_attacks: number
  successful_attacks: number
}

export interface PythonTestRequest {
  testId: string
  category: 'white' | 'black'
  modelId?: string
  customDatasetPath?: string
  curlEndpoint?: string
  attackCategory?: string
  defenseType?: string
  maxSamples?: number
}

export interface PythonTestResponse {
  success: boolean
  testId: string
  status: 'completed' | 'failed'
  results?: WhiteBoxEvaluationResponse | BlackBoxEvaluationResponse
  error?: string
}

export interface AvailableModelsResponse {
  models: string[]
  count: number
}

export interface AvailableDefensesResponse {
  defenses: string[]
  count: number
}

// Attack categories mapping
export const ATTACK_CATEGORIES = [
  'Phishing',           // Maps to Fraud/Deception
  'Prompt Injection',   // Maps to Malware/Hacking
  'Jailbreaking',       // Maps to Physical harm
  'Data Extraction',    // Maps to Privacy
  'Sexual Content',     // Maps to Sexual/Adult content
  'Disinformation',     // Maps to Disinformation
  'Economic Harm',      // Maps to Economic harm
  'Harassment',         // Maps to Harassment/Discrimination
  'Government',         // Maps to Government decision-making
  'Expert Advice'       // Maps to Expert advice
]

// Defense types
export const DEFENSE_TYPES = [
  'SmoothLLM',
  'Perplexity filtering',
  'Removal of non-dictionary words',
  'Synonym substitution'
]

class PythonBackendService {
  private baseUrl: string

  constructor() {
    // Use local API routes to avoid CORS issues
    this.baseUrl = typeof window !== 'undefined' ? '' : (process.env.PYTHON_BACKEND_URL || 'https://e844e56ff06e.ngrok-free.app')
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
        models: ['Qwen/Qwen3-0.6B', 'vicuna-13b-v1.5', 'llama-2-7b-chat-hf', 'gpt-3.5-turbo-1106'],
        count: 4
      }
    }
  }

  // Get available defenses from Python backend
  async getAvailableDefenses(): Promise<AvailableDefensesResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/defenses`, {
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
      console.error('Error fetching available defenses:', error)
      // Return fallback defenses if backend is not available
      return {
        defenses: DEFENSE_TYPES,
        count: DEFENSE_TYPES.length
      }
    }
  }

  // Submit white box evaluation
  async submitWhiteBoxEvaluation(request: WhiteBoxEvaluationRequest): Promise<WhiteBoxEvaluationResponse> {
    try {
      console.log('🔵 WHITE BOX EVALUATION REQUEST:')
      console.log('📤 Input Payload:', JSON.stringify(request, null, 2))
      console.log('🌐 Endpoint:', `${this.baseUrl}/api/nlp/evaluate/whitebox`)
      
      const response = await fetch(`${this.baseUrl}/api/nlp/evaluate/whitebox`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      })

      console.log('📡 Response Status:', response.status, response.statusText)
      console.log('📡 Response Headers:', Object.fromEntries(response.headers.entries()))

      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ HTTP Error Response:', errorText)
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log('📥 Output Payload:', JSON.stringify(data, null, 2))
      console.log('✅ White box evaluation completed successfully')
      
      return data
    } catch (error) {
      console.error('❌ Error submitting white box evaluation:', error)
      throw error
    }
  }

  // Submit black box evaluation
  async submitBlackBoxEvaluation(request: BlackBoxEvaluationRequest): Promise<BlackBoxEvaluationResponse> {
    try {
      console.log('⚫ BLACK BOX EVALUATION REQUEST:')
      console.log('📤 Input Payload:', JSON.stringify(request, null, 2))
      console.log('🌐 Endpoint:', `${this.baseUrl}/api/nlp/evaluate/blackbox`)
      
      const response = await fetch(`${this.baseUrl}/api/nlp/evaluate/blackbox`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      })

      console.log('📡 Response Status:', response.status, response.statusText)
      console.log('📡 Response Headers:', Object.fromEntries(response.headers.entries()))

      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ HTTP Error Response:', errorText)
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log('📥 Output Payload:', JSON.stringify(data, null, 2))
      console.log('✅ Black box evaluation completed successfully')
      
      return data
    } catch (error) {
      console.error('❌ Error submitting black box evaluation:', error)
      throw error
    }
  }

  // Submit white box defense evaluation
  async submitWhiteBoxDefenseEvaluation(request: WhiteBoxEvaluationRequest): Promise<WhiteBoxEvaluationResponse> {
    try {
      console.log('🛡️ WHITE BOX DEFENSE EVALUATION REQUEST:')
      console.log('📤 Input Payload:', JSON.stringify(request, null, 2))
      console.log('🌐 Endpoint:', `${this.baseUrl}/api/nlp/defense/whitebox`)
      
      const response = await fetch(`${this.baseUrl}/api/nlp/defense/whitebox`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      })

      console.log('📡 Response Status:', response.status, response.statusText)
      console.log('📡 Response Headers:', Object.fromEntries(response.headers.entries()))

      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ HTTP Error Response:', errorText)
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log('📥 Output Payload:', JSON.stringify(data, null, 2))
      console.log('✅ White box defense evaluation completed successfully')
      
      return data
    } catch (error) {
      console.error('❌ Error submitting white box defense evaluation:', error)
      throw error
    }
  }

  // Submit black box defense evaluation
  async submitBlackBoxDefenseEvaluation(request: BlackBoxEvaluationRequest): Promise<BlackBoxEvaluationResponse> {
    try {
      console.log('🛡️ BLACK BOX DEFENSE EVALUATION REQUEST:')
      console.log('📤 Input Payload:', JSON.stringify(request, null, 2))
      console.log('🌐 Endpoint:', `${this.baseUrl}/api/nlp/defense/blackbox`)
      
      const response = await fetch(`${this.baseUrl}/api/nlp/defense/blackbox`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      })

      console.log('📡 Response Status:', response.status, response.statusText)
      console.log('📡 Response Headers:', Object.fromEntries(response.headers.entries()))

      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ HTTP Error Response:', errorText)
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log('📥 Output Payload:', JSON.stringify(data, null, 2))
      console.log('✅ Black box defense evaluation completed successfully')
      
      return data
    } catch (error) {
      console.error('❌ Error submitting black box defense evaluation:', error)
      throw error
    }
  }

  // Submit test to Python backend (evaluation only, no defense) - Async workflow
  async submitTest(request: PythonTestRequest): Promise<PythonTestResponse> {
    try {
      console.log('🚀 STARTING TEST EVALUATION:')
      console.log('📋 Test Request:', JSON.stringify(request, null, 2))
      
      const maxSamples = request.maxSamples || 5
      
      if (request.category === 'white') {
        if (!request.modelId || !request.customDatasetPath) {
          throw new Error('White box tests require modelId and customDatasetPath')
        }

        const whiteBoxRequest: WhiteBoxEvaluationRequest = {
          model_id: request.modelId,
          custom_dataset: request.customDatasetPath,
          max_samples: maxSamples,
          behaviour: request.attackCategory,
          defense: undefined // No defense in initial evaluation
        }

        console.log('🔵 Starting white box evaluation...')
        const results = await this.submitWhiteBoxEvaluation(whiteBoxRequest)
        console.log('🔵 White box evaluation completed:', results)

        return {
          success: true,
          testId: request.testId,
          status: 'completed',
          results
        }
      } else if (request.category === 'black') {
        if (!request.curlEndpoint || !request.attackCategory) {
          throw new Error('Black box tests require curlEndpoint and attackCategory')
        }

        const blackBoxRequest: BlackBoxEvaluationRequest = {
          curl_command: request.curlEndpoint,
          attack_category: request.attackCategory,
          max_samples: maxSamples,
          behaviour: request.attackCategory,
          defense: undefined // No defense in initial evaluation
        }

        console.log('⚫ Starting black box evaluation...')
        const results = await this.submitBlackBoxEvaluation(blackBoxRequest)
        console.log('⚫ Black box evaluation completed:', results)

        return {
          success: true,
          testId: request.testId,
          status: 'completed',
          results
        }
      } else {
        throw new Error('Invalid category. Must be "white" or "black"')
      }
    } catch (error) {
      console.error('❌ Error submitting test to Python backend:', error)
      return {
        success: false,
        testId: request.testId,
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  // Submit defense evaluation for an existing test - Async workflow
  async submitDefenseEvaluation(request: PythonTestRequest): Promise<PythonTestResponse> {
    try {
      console.log('🛡️ STARTING DEFENSE EVALUATION:')
      console.log('📋 Defense Request:', JSON.stringify(request, null, 2))
      
      const maxSamples = request.maxSamples || 5
      
      if (request.category === 'white') {
        if (!request.modelId || !request.customDatasetPath || !request.defenseType) {
          throw new Error('White box defense tests require modelId, customDatasetPath, and defenseType')
        }

        const whiteBoxRequest: WhiteBoxEvaluationRequest = {
          model_id: request.modelId,
          custom_dataset: request.customDatasetPath,
          max_samples: maxSamples,
          behaviour: request.attackCategory,
          defense: request.defenseType
        }

        console.log('🛡️ Starting white box defense evaluation...')
        const results = await this.submitWhiteBoxDefenseEvaluation(whiteBoxRequest)
        console.log('🛡️ White box defense evaluation completed:', results)

        return {
          success: true,
          testId: request.testId,
          status: 'completed',
          results
        }
      } else if (request.category === 'black') {
        if (!request.curlEndpoint || !request.attackCategory || !request.defenseType) {
          throw new Error('Black box defense tests require curlEndpoint, attackCategory, and defenseType')
        }

        const blackBoxRequest: BlackBoxEvaluationRequest = {
          curl_command: request.curlEndpoint,
          attack_category: request.attackCategory,
          max_samples: maxSamples,
          behaviour: request.attackCategory,
          defense: request.defenseType
        }

        console.log('🛡️ Starting black box defense evaluation...')
        const results = await this.submitBlackBoxDefenseEvaluation(blackBoxRequest)
        console.log('🛡️ Black box defense evaluation completed:', results)

        return {
          success: true,
          testId: request.testId,
          status: 'completed',
          results
        }
      } else {
        throw new Error('Invalid category. Must be "white" or "black"')
      }
    } catch (error) {
      console.error('❌ Error submitting defense evaluation to Python backend:', error)
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
