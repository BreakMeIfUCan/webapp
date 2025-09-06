"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Brain, 
  Shield, 
  Target, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Activity,
  Zap,
  FileText,
  Calendar,
  ArrowLeft,
  Download,
  RefreshCw
} from "lucide-react"
import Link from "next/link"

// Mock data - replace with actual data from your backend
const mockTestData = {
  "test-001": {
    id: "test-001",
    name: "GPT-2 Phishing Attack",
    type: "black",
    status: "completed",
    createdAt: "2024-01-15T10:30:00Z",
    completedAt: "2024-01-15T10:45:00Z",
    attackCategory: "Phishing",
    description: "Comprehensive phishing attack test against GPT-2 model using various social engineering techniques.",
    results: {
      asr: 0.75,
      categoryWiseASR: {
        "Phishing": 0.75,
        "Prompt Injection": 0.60,
        "Jailbreaking": 0.45
      },
      latency: 2.3,
      tokenUsage: 1250,
      totalRequests: 100,
      successfulAttacks: 75,
      failedAttacks: 25
    }
  },
  "test-002": {
    id: "test-002", 
    name: "BERT White Box Analysis",
    type: "white",
    status: "completed",
    createdAt: "2024-01-14T14:20:00Z",
    completedAt: "2024-01-14T14:35:00Z",
    modelId: "bert-base-uncased",
    description: "White box security analysis of BERT model with full access to internal weights and architecture.",
    results: {
      asr: 0.68,
      accuracy: 0.92,
      recall: 0.88,
      precision: 0.85,
      f1: 0.86,
      totalSamples: 1000,
      truePositives: 680,
      falsePositives: 120,
      falseNegatives: 80
    }
  },
  "test-003": {
    id: "test-003",
    name: "RoBERTa Prompt Injection",
    type: "black", 
    status: "running",
    createdAt: "2024-01-15T11:00:00Z",
    attackCategory: "Prompt Injection",
    description: "Testing prompt injection vulnerabilities in RoBERTa model through various injection techniques.",
    progress: 65
  },
  "test-004": {
    id: "test-004",
    name: "DistilBERT Jailbreaking",
    type: "black",
    status: "failed",
    createdAt: "2024-01-15T09:15:00Z",
    completedAt: "2024-01-15T09:20:00Z",
    attackCategory: "Jailbreaking",
    description: "Attempting to jailbreak DistilBERT model to bypass safety mechanisms.",
    error: "API endpoint unreachable - connection timeout after 30 seconds"
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "completed":
      return <CheckCircle className="h-5 w-5 text-green-500" />
    case "running":
      return <Activity className="h-5 w-5 text-blue-500 animate-pulse" />
    case "failed":
      return <XCircle className="h-5 w-5 text-red-500" />
    default:
      return <Clock className="h-5 w-5 text-gray-500" />
  }
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "completed":
      return <Badge className="bg-green-100 text-green-800">Completed</Badge>
    case "running":
      return <Badge className="bg-blue-100 text-blue-800">Running</Badge>
    case "failed":
      return <Badge variant="destructive">Failed</Badge>
    default:
      return <Badge variant="secondary">Pending</Badge>
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString()
}

const formatDuration = (start: string, end?: string) => {
  const startTime = new Date(start)
  const endTime = end ? new Date(end) : new Date()
  const duration = Math.round((endTime.getTime() - startTime.getTime()) / 1000)
  return `${duration}s`
}

export default function TestResultPage() {
  const params = useParams()
  const testId = params.id as string
  const [test, setTest] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const testData = mockTestData[testId as keyof typeof mockTestData]
      setTest(testData || null)
      setIsLoading(false)
    }, 500)
  }, [testId])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/results">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Results
            </Link>
          </Button>
        </div>
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    )
  }

  if (!test) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/results">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Results
            </Link>
          </Button>
        </div>
        <Card>
          <CardContent className="p-8 text-center">
            <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Test Not Found</h3>
            <p className="text-muted-foreground">The test you're looking for doesn't exist or has been deleted.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const renderWhiteBoxResults = () => {
    const { results } = test
    return (
      <div className="space-y-6">
        {/* Main Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">ASR</p>
                  <p className="text-2xl font-bold">{(results.asr * 100).toFixed(1)}%</p>
                </div>
                <Target className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Accuracy</p>
                  <p className="text-2xl font-bold">{(results.accuracy * 100).toFixed(1)}%</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Precision</p>
                  <p className="text-2xl font-bold">{(results.precision * 100).toFixed(1)}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">F1 Score</p>
                  <p className="text-2xl font-bold">{(results.f1 * 100).toFixed(1)}%</p>
                </div>
                <Activity className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Detailed Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Recall</span>
                  <span>{(results.recall * 100).toFixed(1)}%</span>
                </div>
                <Progress value={results.recall * 100} className="h-2" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Test Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Total Samples</span>
                <span className="font-medium">{results.totalSamples.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">True Positives</span>
                <span className="font-medium text-green-600">{results.truePositives}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">False Positives</span>
                <span className="font-medium text-red-600">{results.falsePositives}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">False Negatives</span>
                <span className="font-medium text-orange-600">{results.falseNegatives}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const renderBlackBoxResults = () => {
    const { results } = test
    return (
      <div className="space-y-6">
        {/* Main Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">ASR</p>
                  <p className="text-2xl font-bold">{(results.asr * 100).toFixed(1)}%</p>
                </div>
                <Target className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Latency</p>
                  <p className="text-2xl font-bold">{results.latency}s</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Token Usage</p>
                  <p className="text-2xl font-bold">{results.tokenUsage.toLocaleString()}</p>
                </div>
                <Zap className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Duration</p>
                  <p className="text-2xl font-bold">{formatDuration(test.createdAt, test.completedAt)}</p>
                </div>
                <Activity className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Detailed Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Category-wise ASR</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {Object.entries(results.categoryWiseASR).map(([category, asr]: [string, any]) => (
                <div key={category}>
                  <div className="flex justify-between text-sm mb-2">
                    <span>{category}</span>
                    <span>{(asr * 100).toFixed(1)}%</span>
                  </div>
                  <Progress value={asr * 100} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Attack Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Total Requests</span>
                <span className="font-medium">{results.totalRequests}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Successful Attacks</span>
                <span className="font-medium text-green-600">{results.successfulAttacks}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Failed Attacks</span>
                <span className="font-medium text-red-600">{results.failedAttacks}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/results">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Results
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{test.name}</h1>
            <p className="text-muted-foreground">{test.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {getStatusBadge(test.status)}
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Test Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getStatusIcon(test.status)}
            Test Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Test Type</p>
              <Badge variant="outline" className="mt-1">
                {test.type === "white" ? "White Box" : "Black Box"}
              </Badge>
            </div>
            {test.attackCategory && (
              <div>
                <p className="text-sm text-muted-foreground">Attack Category</p>
                <Badge variant="secondary" className="mt-1">
                  {test.attackCategory}
                </Badge>
              </div>
            )}
            {test.modelId && (
              <div>
                <p className="text-sm text-muted-foreground">Model ID</p>
                <p className="font-medium">{test.modelId}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-muted-foreground">Created</p>
              <p className="font-medium">{formatDate(test.createdAt)}</p>
            </div>
            {test.completedAt && (
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="font-medium">{formatDate(test.completedAt)}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Running State */}
      {test.status === "running" && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Activity className="h-8 w-8 text-blue-500 animate-pulse" />
              <div className="flex-1">
                <h3 className="font-semibold">Test in Progress</h3>
                <p className="text-sm text-muted-foreground">Your test is currently running...</p>
                <div className="mt-3">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Progress</span>
                    <span>{test.progress}%</span>
                  </div>
                  <Progress value={test.progress} className="h-2" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Failed State */}
      {test.status === "failed" && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <XCircle className="h-8 w-8 text-red-500" />
              <div className="flex-1">
                <h3 className="font-semibold text-red-600">Test Failed</h3>
                <p className="text-sm text-muted-foreground mt-1">{test.error}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {test.status === "completed" && test.results && (
        <div>
          {test.type === "white" ? renderWhiteBoxResults() : renderBlackBoxResults()}
        </div>
      )}
    </div>
  )
}
