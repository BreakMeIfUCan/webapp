"use client"

import { useState } from "react"
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
  Calendar
} from "lucide-react"

// Mock data - replace with actual data from your backend
const mockTestResults = [
  {
    id: "test-001",
    name: "GPT-2 Phishing Attack",
    type: "black",
    status: "completed",
    createdAt: "2024-01-15T10:30:00Z",
    completedAt: "2024-01-15T10:45:00Z",
    attackCategory: "Phishing",
    results: {
      asr: 0.75,
      categoryWiseASR: {
        "Phishing": 0.75,
        "Prompt Injection": 0.60,
        "Jailbreaking": 0.45
      },
      latency: 2.3,
      tokenUsage: 1250
    }
  },
  {
    id: "test-002", 
    name: "BERT White Box Analysis",
    type: "white",
    status: "completed",
    createdAt: "2024-01-14T14:20:00Z",
    completedAt: "2024-01-14T14:35:00Z",
    modelId: "bert-base-uncased",
    results: {
      asr: 0.68,
      accuracy: 0.92,
      recall: 0.88,
      precision: 0.85,
      f1: 0.86
    }
  },
  {
    id: "test-003",
    name: "RoBERTa Prompt Injection",
    type: "black", 
    status: "running",
    createdAt: "2024-01-15T11:00:00Z",
    attackCategory: "Prompt Injection",
    progress: 65
  },
  {
    id: "test-004",
    name: "DistilBERT Jailbreaking",
    type: "black",
    status: "failed",
    createdAt: "2024-01-15T09:15:00Z",
    completedAt: "2024-01-15T09:20:00Z",
    attackCategory: "Jailbreaking",
    error: "API endpoint unreachable"
  }
]

const getStatusIcon = (status: string) => {
  switch (status) {
    case "completed":
      return <CheckCircle className="h-4 w-4 text-green-500" />
    case "running":
      return <Activity className="h-4 w-4 text-blue-500 animate-pulse" />
    case "failed":
      return <XCircle className="h-4 w-4 text-red-500" />
    default:
      return <Clock className="h-4 w-4 text-gray-500" />
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

export default function TestResultsPage() {
  const [selectedTest, setSelectedTest] = useState<string | null>(null)

  const completedTests = mockTestResults.filter(test => test.status === "completed")
  const runningTests = mockTestResults.filter(test => test.status === "running")
  const failedTests = mockTestResults.filter(test => test.status === "failed")

  const renderWhiteBoxResults = (test: any) => {
    const { results } = test
    return (
      <div className="space-y-4">
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
      </div>
    )
  }

  const renderBlackBoxResults = (test: any) => {
    const { results } = test
    return (
      <div className="space-y-4">
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
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Test Results</h1>
        <p className="text-muted-foreground">
          View and analyze your NLP attack test results
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Tests</p>
                <p className="text-2xl font-bold">{mockTestResults.length}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">{completedTests.length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Running</p>
                <p className="text-2xl font-bold">{runningTests.length}</p>
              </div>
              <Activity className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Failed</p>
                <p className="text-2xl font-bold">{failedTests.length}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Test Results List */}
      <div className="space-y-4">
        {mockTestResults.map((test) => (
          <Card key={test.id} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getStatusIcon(test.status)}
                  <div>
                    <CardTitle className="text-lg">{test.name}</CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {test.type === "white" ? "White Box" : "Black Box"}
                      </Badge>
                      {test.attackCategory && (
                        <Badge variant="secondary" className="text-xs">
                          {test.attackCategory}
                        </Badge>
                      )}
                      {test.modelId && (
                        <Badge variant="secondary" className="text-xs">
                          {test.modelId}
                        </Badge>
                      )}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(test.status)}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedTest(selectedTest === test.id ? null : test.id)}
                  >
                    {selectedTest === test.id ? "Hide Details" : "View Details"}
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            {selectedTest === test.id && (
              <CardContent className="pt-0">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Created:</span>
                      <span className="ml-2">{formatDate(test.createdAt)}</span>
                    </div>
                    {test.completedAt && (
                      <div>
                        <span className="text-muted-foreground">Completed:</span>
                        <span className="ml-2">{formatDate(test.completedAt)}</span>
                      </div>
                    )}
                  </div>
                  
                  {test.status === "running" && (
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Progress</span>
                        <span>{test.progress}%</span>
                      </div>
                      <Progress value={test.progress} className="h-2" />
                    </div>
                  )}
                  
                  {test.status === "failed" && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                      <div className="flex items-center gap-2 text-red-600">
                        <AlertTriangle className="h-4 w-4" />
                        <span className="font-medium">Error:</span>
                        <span>{test.error}</span>
                      </div>
                    </div>
                  )}
                  
                  {test.status === "completed" && test.results && (
                    <div>
                      {test.type === "white" ? renderWhiteBoxResults(test) : renderBlackBoxResults(test)}
                    </div>
                  )}
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}
