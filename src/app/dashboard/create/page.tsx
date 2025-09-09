"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { 
  Brain, 
  Play, 
  Settings, 
  Upload,
  FileText,
  Code,
  Zap,
  Shield,
  Target,
  Wand2,
  Loader2
} from "lucide-react"
import { createTest, updateTestStatus } from "@/data-access/tests"
import { pythonBackend, ATTACK_CATEGORIES, DEFENSE_TYPES } from "@/lib/python-backend"

type TestCategory = "black" | "white"

interface TestConfig {
  category: TestCategory
  name: string
  description: string
  parameters: Record<string, any>
}

const testCategories = {
  black: {
    title: "Black Box Testing",
    description: "Test with no knowledge of internal structure - API-based attacks",
    color: "bg-black text-white",
    icon: "⚫"
  },
  white: {
    title: "White Box Testing",
    description: "Test with full knowledge of internal structure - Model-based attacks", 
    color: "bg-white text-black border-2 border-gray-300",
    icon: "⚪"
  }
}

// NLP Attack Parameters based on your specifications
const getNlpParameters = (availableModels: string[], availableDefenses: string[]) => ({
  white: [
    { 
      key: "model_id", 
      label: "Model ID", 
      type: "select", 
      required: true,
      description: "Available Model ID",
      options: availableModels
    },
    { 
      key: "custom_dataset", 
      label: "Custom Dataset", 
      type: "select", 
      required: true,
      description: "SOTA Dataset to use for testing. Learn more about JailbreakBench: https://huggingface.co/datasets/JailbreakBench/JBB-Behaviors",
      options: ["JailBreakBench"]
    },
    { 
      key: "max_samples", 
      label: "Max Samples", 
      type: "number", 
      required: true,
      description: "Maximum number of samples to test",
      placeholder: "5"
    },
    { 
      key: "behaviour", 
      label: "Behaviour/Attack Category", 
      type: "select", 
      required: false,
      description: "Specific attack behavior to test (optional)",
      options: ["None", ...ATTACK_CATEGORIES]
    },
    { 
      key: "defense_type", 
      label: "Defense Type", 
      type: "select", 
      required: false,
      description: "NLP Defense to apply (optional)",
      options: ["None", ...availableDefenses]
    }
  ],
  black: [
    { 
      key: "curl_command", 
      label: "cURL Command", 
      type: "textarea", 
      required: true,
      description: "cURL command for querying the model API",
      placeholder: "curl \"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent\" -H 'Content-Type: application/json' -H 'X-goog-api-key: YOUR_API_KEY' -X POST -d '{\"contents\": [{\"parts\": [{\"text\": \"Explain how AI works in a few words\"}]}]}'"
    },
    { 
      key: "attack_category", 
      label: "Attack Category", 
      type: "select", 
      required: true,
      description: "Type of attack to perform",
      options: ATTACK_CATEGORIES
    },
    { 
      key: "max_samples", 
      label: "Max Samples", 
      type: "number", 
      required: true,
      description: "Maximum number of samples to test",
      placeholder: "10"
    },
    { 
      key: "behaviour", 
      label: "Behaviour", 
      type: "select", 
      required: false,
      description: "Specific attack behavior to test (optional)",
      options: ["None", ...ATTACK_CATEGORIES]
    },
    { 
      key: "defense_type", 
      label: "Defense Type", 
      type: "select", 
      required: false,
      description: "NLP Defense to apply (optional)",
      options: ["None", ...availableDefenses]
    }
  ]
})

export default function CreateTestPage() {
  const [selectedCategory, setSelectedCategory] = useState<TestCategory>("black")
  const [testConfig, setTestConfig] = useState<TestConfig>({
    category: "black",
    name: "",
    description: "",
    parameters: {}
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [availableModels, setAvailableModels] = useState<string[]>([])
  const [modelsLoading, setModelsLoading] = useState(true)
  const [availableDefenses, setAvailableDefenses] = useState<string[]>([])
  const [defensesLoading, setDefensesLoading] = useState(true)

  // Fetch available models and defenses from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [modelsResponse, defensesResponse] = await Promise.all([
          pythonBackend.getAvailableModels(),
          pythonBackend.getAvailableDefenses()
        ])
        setAvailableModels(modelsResponse.models)
        setAvailableDefenses(defensesResponse.defenses)
      } catch (error) {
        console.error('Failed to fetch data:', error)
        // Fallback to hardcoded data
        setAvailableModels(['vicuna-13b-v1.5', 'llama-2-7b-chat-hf', 'gpt-3.5-turbo-1106', 'gpt-4-0125-preview'])
        setAvailableDefenses(['sanitize_text', 'meta-prompt wrapper', 'Llama Guard'])
      } finally {
        setModelsLoading(false)
        setDefensesLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleParameterChange = (key: string, value: any) => {
    setTestConfig(prev => ({
      ...prev,
      parameters: {
        ...prev.parameters,
        [key]: value
      }
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
          // Prepare test data
          const defenseType = testConfig.parameters.defense_type && testConfig.parameters.defense_type !== 'None' 
            ? testConfig.parameters.defense_type 
            : undefined

          const behaviour = testConfig.parameters.behaviour && testConfig.parameters.behaviour !== 'None'
            ? testConfig.parameters.behaviour
            : undefined

          const testData = {
            name: testConfig.name,
            description: testConfig.description,
            category: selectedCategory,
            modelId: selectedCategory === 'white' ? testConfig.parameters.model_id : undefined,
            customDatasetPath: selectedCategory === 'white' ? testConfig.parameters.custom_dataset : undefined,
            curlEndpoint: selectedCategory === 'black' ? testConfig.parameters.curl_command : undefined,
            attackCategory: selectedCategory === 'black' ? testConfig.parameters.attack_category : behaviour,
            defenseType: defenseType,
            maxSamples: parseInt(testConfig.parameters.max_samples) || (selectedCategory === 'white' ? 5 : 10),
          }

      // Create test in database
      const result = await createTest(testData)
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to create test')
      }

      // Submit to Python backend (async workflow - wait for completion)
      const pythonRequest = {
        testId: result.testId!,
        category: selectedCategory,
        modelId: testData.modelId,
        customDatasetPath: testData.customDatasetPath,
        curlEndpoint: testData.curlEndpoint,
        attackCategory: testData.attackCategory,
        defenseType: testData.defenseType,
        maxSamples: testData.maxSamples,
      }

      console.log('🚀 Starting evaluation...')
      console.log('📋 Python Request:', JSON.stringify(pythonRequest, null, 2))
      
      const pythonResponse = await pythonBackend.submitTest(pythonRequest)
      
      console.log('📥 Python Response:', JSON.stringify(pythonResponse, null, 2))
      
      if (!pythonResponse.success) {
        console.error('❌ Evaluation failed:', pythonResponse.error)
        // Update test status to failed
        await updateTestStatus(result.testId!, 'failed', { error: pythonResponse.error })
        throw new Error(pythonResponse.error || 'Evaluation failed')
      }

      console.log('✅ Evaluation completed successfully, updating database...')
      // Update test with results
      await updateTestStatus(result.testId!, 'completed', pythonResponse.results)
      setSuccess("Test created and evaluation completed successfully!")
      
      // Reset form
      setTestConfig({
        category: "black",
        name: "",
        description: "",
        parameters: {}
      })
      setSelectedCategory("black")
      
      setTimeout(() => setSuccess(""), 3000)
    } catch (err) {
      console.error('Error creating test:', err)
      setError(err instanceof Error ? err.message : "Failed to create test. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const getParameters = () => {
    return getNlpParameters(availableModels, availableDefenses)[selectedCategory]
  }

  // Helper function to autofill cURL command
  const handleAutofillCurl = () => {
    const defaultCurl = `curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent" \\
-H 'Content-Type: application/json' \\
-H 'X-goog-api-key: YOUR_API_KEY' \\
-X POST \\
-d '{
  "contents": [
    {
      "parts": [
        {
          "text": "Explain how AI works in a few words"
        }
      ]
    }
  ]
}'`
    
    handleParameterChange("curl_command", defaultCurl)
  }


  const renderParameterInput = (param: any) => {
    const { key, label, type, required, description, placeholder, options, accept } = param

    switch (type) {
      case "select":
        return (
          <Select
            value={testConfig.parameters[key] || ""}
            onValueChange={(value: string) => handleParameterChange(key, value)}
            required={required}
          >
            <SelectTrigger>
              <SelectValue placeholder={
                (modelsLoading && key === "model_id") || (defensesLoading && key === "defense_type") 
                  ? "Loading..." 
                  : `Select ${label}`
              } />
            </SelectTrigger>
            <SelectContent>
              {options?.map((option: string) => (
                <SelectItem key={option} value={option}>{option}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      case "textarea":
        // Special handling for cURL command field
        if (key === "curl_command") {
          return (
            <div className="space-y-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAutofillCurl}
                className="flex items-center gap-2"
              >
                <Wand2 className="h-4 w-4" />
                Autofill
              </Button>
              <Textarea
                value={testConfig.parameters[key] || ""}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleParameterChange(key, e.target.value)}
                placeholder={placeholder || `Enter ${label.toLowerCase()}`}
                required={required}
                className="min-h-[120px] font-mono text-sm"
              />
            </div>
          )
        }
        
        return (
          <Textarea
            value={testConfig.parameters[key] || ""}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleParameterChange(key, e.target.value)}
            placeholder={placeholder || `Enter ${label.toLowerCase()}`}
            required={required}
            className="min-h-[120px]"
          />
        )
      case "file":
        return (
          <div className="space-y-2">
            <div className="flex items-center justify-center w-full">
              <label htmlFor={key} className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/50">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-4 text-muted-foreground" />
                  <p className="mb-2 text-sm text-muted-foreground">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground">{accept?.toUpperCase() || "CSV"}</p>
                </div>
                <input
                  id={key}
                  type="file"
                  className="hidden"
                  accept={accept}
                  onChange={(e) => handleParameterChange(key, e.target.files?.[0])}
                  required={required}
                />
              </label>
            </div>
            {testConfig.parameters[key] && (
              <p className="text-sm text-muted-foreground">
                Selected: {testConfig.parameters[key].name}
              </p>
            )}
          </div>
        )
      default:
        return (
          <Input
            type={type}
            value={testConfig.parameters[key] || ""}
            onChange={(e) => handleParameterChange(key, e.target.value)}
            placeholder={placeholder || `Enter ${label.toLowerCase()}`}
            required={required}
          />
        )
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Create NLP Attack Test</h1>
        <p className="text-muted-foreground">
          Configure and run NLP security tests against language models
        </p>
      </div>

      {/* Test Category Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Attack Type
          </CardTitle>
          <CardDescription>
            Select the type of NLP attack you want to perform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(testCategories).map(([key, category]) => (
              <Button
                key={key}
                variant={selectedCategory === key ? "default" : "outline"}
                className={`h-24 flex flex-col items-center gap-2 ${selectedCategory === key ? category.color : ""}`}
                onClick={() => setSelectedCategory(key as TestCategory)}
              >
                <span className="text-2xl">{category.icon}</span>
                <span className="font-semibold">{category.title}</span>
                <span className="text-xs opacity-70 text-center">{category.description}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Test Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            NLP Attack Configuration
          </CardTitle>
          <CardDescription>
            Configure parameters for {testCategories[selectedCategory].title.toLowerCase()}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Test Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="test-name">Test Name</Label>
                <Input
                  id="test-name"
                  value={testConfig.name}
                  onChange={(e) => setTestConfig(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter test name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="test-description">Description</Label>
                <Input
                  id="test-description"
                  value={testConfig.description}
                  onChange={(e) => setTestConfig(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter test description"
                />
              </div>
            </div>

            <Separator />

            {/* Parameters */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Attack Parameters</h3>
              <div className="grid grid-cols-1 gap-6">
                {getParameters().map((param) => (
                  <div key={param.key} className="space-y-2">
                    <Label htmlFor={param.key} className="flex items-center gap-2">
                      {param.label}
                      {param.required && <Badge variant="destructive" className="text-xs">Required</Badge>}
                    </Label>
                    {param.description && (
                      <p className="text-sm text-muted-foreground">
                        {param.description.split(' ').map((word, index) => {
                          if (word.startsWith('https://')) {
                            return (
                              <span key={index}>
                                <a 
                                  href={word} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-800 underline"
                                >
                                  {word}
                                </a>
                                {index < param.description.split(' ').length - 1 ? ' ' : ''}
                              </span>
                            )
                          }
                          return word + (index < param.description.split(' ').length - 1 ? ' ' : '')
                        })}
                      </p>
                    )}
                    {renderParameterInput(param)}
                  </div>
                ))}
              </div>
            </div>

            {/* Error/Success Messages */}
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                {error}
              </div>
            )}
            {success && (
              <div className="p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded-md">
                {success}
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button 
                type="submit"
                size="lg" 
                className="flex items-center gap-2"
                disabled={!testConfig.name || isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating Test...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    Run Attack Test
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Expected Outputs Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Expected Outputs
          </CardTitle>
          <CardDescription>
            Metrics that will be generated from your attack test
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-foreground">White Box Testing Outputs</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <strong>ASR (Attack Success Rate):</strong> Pie Chart visualization
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <strong>Accuracy:</strong> Percentage (0 to 1)
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <strong>Recall:</strong> Value between 0 to 1
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <strong>Precision:</strong> Value between 0 to 1
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <strong>F1 Score:</strong> Value between 0 to 1
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-foreground">Black Box Testing Outputs</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <strong>ASR (Attack Success Rate):</strong> Pie Chart visualization
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <strong>Category-wise ASR:</strong> Breakdown by attack type
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <strong>Latency:</strong> Response time in seconds
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <strong>Token Usage:</strong> Number of tokens consumed (usually in k)
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}