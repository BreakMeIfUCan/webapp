"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  Eye, 
  Brain, 
  Play, 
  Settings, 
  Upload,
  FileText,
  Image,
  Code,
  Zap
} from "lucide-react"

type TestType = "vision" | "nlp"
type TestCategory = "black" | "gray" | "white"

interface TestConfig {
  type: TestType
  category: TestCategory
  name: string
  description: string
  parameters: Record<string, any>
}

const testCategories = {
  black: {
    title: "Black Box Testing",
    description: "Test with no knowledge of internal structure",
    color: "bg-black text-white",
    icon: "⚫"
  },
  gray: {
    title: "Gray Box Testing", 
    description: "Test with partial knowledge of internal structure",
    color: "bg-gray-600 text-white",
    icon: "⚪"
  },
  white: {
    title: "White Box Testing",
    description: "Test with full knowledge of internal structure", 
    color: "bg-white text-black border-2 border-gray-300",
    icon: "⚪"
  }
}

const visionParameters = {
  black: [
    { key: "image_url", label: "Image URL", type: "url", required: true },
    { key: "prompt", label: "Test Prompt", type: "text", required: true },
    { key: "expected_output", label: "Expected Output", type: "text", required: false },
    { key: "confidence_threshold", label: "Confidence Threshold", type: "number", min: 0, max: 1, step: 0.1, required: true }
  ],
  gray: [
    { key: "image_url", label: "Image URL", type: "url", required: true },
    { key: "prompt", label: "Test Prompt", type: "text", required: true },
    { key: "model_architecture", label: "Model Architecture", type: "select", options: ["CNN", "Transformer", "ResNet", "ViT"], required: true },
    { key: "layer_depth", label: "Layer Depth", type: "number", min: 1, max: 100, required: true },
    { key: "attention_heads", label: "Attention Heads", type: "number", min: 1, max: 32, required: false }
  ],
  white: [
    { key: "image_url", label: "Image URL", type: "url", required: true },
    { key: "prompt", label: "Test Prompt", type: "text", required: true },
    { key: "model_weights", label: "Model Weights", type: "file", required: true },
    { key: "layer_config", label: "Layer Configuration", type: "json", required: true },
    { key: "gradient_check", label: "Gradient Check", type: "boolean", required: true },
    { key: "activation_function", label: "Activation Function", type: "select", options: ["ReLU", "Sigmoid", "Tanh", "GELU"], required: true }
  ]
}

const nlpParameters = {
  black: [
    { key: "text_input", label: "Text Input", type: "textarea", required: true },
    { key: "task_type", label: "Task Type", type: "select", options: ["Classification", "Generation", "Translation", "Summarization"], required: true },
    { key: "expected_output", label: "Expected Output", type: "text", required: false },
    { key: "max_tokens", label: "Max Tokens", type: "number", min: 1, max: 4096, required: true }
  ],
  gray: [
    { key: "text_input", label: "Text Input", type: "textarea", required: true },
    { key: "task_type", label: "Task Type", type: "select", options: ["Classification", "Generation", "Translation", "Summarization"], required: true },
    { key: "model_size", label: "Model Size", type: "select", options: ["Small", "Medium", "Large", "XL"], required: true },
    { key: "vocabulary_size", label: "Vocabulary Size", type: "number", min: 1000, max: 100000, required: true },
    { key: "context_length", label: "Context Length", type: "number", min: 128, max: 8192, required: true }
  ],
  white: [
    { key: "text_input", label: "Text Input", type: "textarea", required: true },
    { key: "task_type", label: "Task Type", type: "select", options: ["Classification", "Generation", "Translation", "Summarization"], required: true },
    { key: "model_weights", label: "Model Weights", type: "file", required: true },
    { key: "tokenizer_config", label: "Tokenizer Configuration", type: "json", required: true },
    { key: "attention_mask", label: "Attention Mask", type: "boolean", required: true },
    { key: "position_encoding", label: "Position Encoding", type: "select", options: ["Absolute", "Relative", "Rotary"], required: true },
    { key: "dropout_rate", label: "Dropout Rate", type: "number", min: 0, max: 1, step: 0.1, required: true }
  ]
}

export default function CreateTestPage() {
  const [selectedType, setSelectedType] = useState<TestType>("vision")
  const [selectedCategory, setSelectedCategory] = useState<TestCategory>("black")
  const [testConfig, setTestConfig] = useState<TestConfig>({
    type: "vision",
    category: "black", 
    name: "",
    description: "",
    parameters: {}
  })

  const handleParameterChange = (key: string, value: any) => {
    setTestConfig(prev => ({
      ...prev,
      parameters: {
        ...prev.parameters,
        [key]: value
      }
    }))
  }

  const handleSubmit = async () => {
    const config = {
      ...testConfig,
      type: selectedType,
      category: selectedCategory
    }
    
    console.log("Test Configuration:", config)
    // TODO: Send to Python backend for sandboxing and testing
  }

  const getParameters = () => {
    if (selectedType === "vision") {
      return visionParameters[selectedCategory]
    } else {
      return nlpParameters[selectedCategory]
    }
  }

  const renderParameterInput = (param: any) => {
    const { key, label, type, required, ...props } = param

    switch (type) {
      case "select":
        return (
          <select
            className="w-full p-2 border rounded-md"
            value={testConfig.parameters[key] || ""}
            onChange={(e) => handleParameterChange(key, e.target.value)}
            required={required}
          >
            <option value="">Select {label}</option>
            {param.options?.map((option: string) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        )
      case "textarea":
        return (
          <textarea
            className="w-full p-2 border rounded-md min-h-[100px]"
            value={testConfig.parameters[key] || ""}
            onChange={(e) => handleParameterChange(key, e.target.value)}
            placeholder={`Enter ${label.toLowerCase()}`}
            required={required}
          />
        )
      case "file":
        return (
          <input
            type="file"
            className="w-full p-2 border rounded-md"
            onChange={(e) => handleParameterChange(key, e.target.files?.[0])}
            required={required}
          />
        )
      case "boolean":
        return (
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={testConfig.parameters[key] || false}
              onChange={(e) => handleParameterChange(key, e.target.checked)}
              required={required}
            />
            <span>Enable {label}</span>
          </div>
        )
      case "json":
        return (
          <textarea
            className="w-full p-2 border rounded-md min-h-[100px] font-mono text-sm"
            value={testConfig.parameters[key] || ""}
            onChange={(e) => handleParameterChange(key, e.target.value)}
            placeholder={`Enter ${label.toLowerCase()} as JSON`}
            required={required}
          />
        )
      default:
        return (
          <Input
            type={type}
            value={testConfig.parameters[key] || ""}
            onChange={(e) => handleParameterChange(key, e.target.value)}
            placeholder={`Enter ${label.toLowerCase()}`}
            required={required}
            {...props}
          />
        )
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Create New Test</h1>
        <p className="text-muted-foreground">
          Configure and run tests against AI models with different levels of access
        </p>
      </div>

      {/* Test Type Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Test Type
          </CardTitle>
          <CardDescription>
            Choose the type of AI model you want to test
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              variant={selectedType === "vision" ? "default" : "outline"}
              className="h-20 flex flex-col items-center gap-2"
              onClick={() => setSelectedType("vision")}
            >
              <Eye className="h-6 w-6" />
              <span>Vision Models</span>
              <span className="text-xs opacity-70">Image processing, object detection</span>
            </Button>
            <Button
              variant={selectedType === "nlp" ? "default" : "outline"}
              className="h-20 flex flex-col items-center gap-2"
              onClick={() => setSelectedType("nlp")}
            >
              <Brain className="h-6 w-6" />
              <span>NLP Models</span>
              <span className="text-xs opacity-70">Text processing, language understanding</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Test Category Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Test Category</CardTitle>
          <CardDescription>
            Select the level of access you have to the model
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            {selectedType === "vision" ? <Eye className="h-5 w-5" /> : <Brain className="h-5 w-5" />}
            {selectedType.toUpperCase()} Test Configuration
          </CardTitle>
          <CardDescription>
            Configure parameters for {testCategories[selectedCategory].title.toLowerCase()}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
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
            <h3 className="text-lg font-semibold">Test Parameters</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {getParameters().map((param) => (
                <div key={param.key} className="space-y-2">
                  <Label htmlFor={param.key} className="flex items-center gap-2">
                    {param.label}
                    {param.required && <Badge variant="destructive" className="text-xs">Required</Badge>}
                  </Label>
                  {renderParameterInput(param)}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button 
          size="lg" 
          className="flex items-center gap-2"
          onClick={handleSubmit}
          disabled={!testConfig.name}
        >
          <Play className="h-4 w-4" />
          Run Test
        </Button>
      </div>
    </div>
  )
}