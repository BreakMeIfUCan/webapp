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
  Calendar,
  TestTube
} from "lucide-react"
import Link from "next/link"
import ASRPieChart from "@/components/charts/asr-pie-chart"
import SingleCategoryASR from "@/components/charts/single-category-asr"

interface TestResult {
  id: string
  name: string
  type: string
  status: string
  createdAt: string
  completedAt?: string
  attackCategory?: string
  modelId?: string
  progress?: number
  error?: string
  defenseType?: string
  results?: {
    asr?: number
    accuracy?: number
    recall?: number
    precision?: number
    f1?: number
    latency?: number
    tokenUsage?: number
    categoryWiseASR?: any
    defenseASR?: number
    defenseAccuracy?: number
    defenseRecall?: number
    defensePrecision?: number
    defenseF1?: number
    defenseLatency?: number
    defenseTokenUsage?: number
    defenseCategoryWiseASR?: any
  }
}

interface TestResultsClientProps {
  testResults: TestResult[]
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "completed":
      return <Badge variant="default">Completed</Badge>
    case "running":
      return <Badge variant="secondary">Running</Badge>
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

export default function TestResultsClient({ testResults }: TestResultsClientProps) {
  const [selectedTest, setSelectedTest] = useState<string | null>(null)

  const completedTests = testResults.filter(test => test.status === "completed")
  const runningTests = testResults.filter(test => test.status === "running")
  const failedTests = testResults.filter(test => test.status === "failed")

  const renderWhiteBoxResults = (test: TestResult) => {
    const { results } = test
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">ASR</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {results?.asr ? `${Math.round(results.asr * 100)}%` : "N/A"}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Accuracy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {results?.accuracy ? `${Math.round(results.accuracy * 100)}%` : "N/A"}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Precision</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {results?.precision ? `${Math.round(results.precision * 100)}%` : "N/A"}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">F1 Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {results?.f1 ? `${Math.round(results.f1 * 100)}%` : "N/A"}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const renderBlackBoxResults = (test: TestResult) => {
    const { results } = test
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">ASR</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {results?.asr ? `${Math.round(results.asr * 100)}%` : "N/A"}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Latency</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {results?.latency ? `${results.latency}s` : "N/A"}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Token Usage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {results?.tokenUsage ? `${results.tokenUsage}` : "N/A"}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm font-medium">
                {test.attackCategory || "N/A"}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {results?.categoryWiseASR && (
          <SingleCategoryASR categoryWiseASR={results.categoryWiseASR} />
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Test Results</h1>
          <p className="text-muted-foreground">
            View and analyze your NLP attack test results
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/create">
            <Brain className="mr-2 h-4 w-4" />
            Create New Test
          </Link>
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tests</CardTitle>
            <TestTube className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{testResults.length}</div>
            <p className="text-xs text-muted-foreground">
              All time tests
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedTests.length}</div>
            <p className="text-xs text-muted-foreground">
              {testResults.length > 0 ? Math.round((completedTests.length / testResults.length) * 100) : 0}% success rate
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Running</CardTitle>
            <Activity className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{runningTests.length}</div>
            <p className="text-xs text-muted-foreground">
              Currently active
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{failedTests.length}</div>
            <p className="text-xs text-muted-foreground">
              Need attention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Test Results List */}
      <div className="space-y-4">
        {testResults.map((test) => (
          <Card key={test.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{test.name}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      {test.type === "white" ? "White Box" : "Black Box"}
                    </Badge>
                    {test.attackCategory && (
                      <Badge variant="secondary">{test.attackCategory}</Badge>
                    )}
                    {test.modelId && (
                      <Badge variant="secondary">{test.modelId}</Badge>
                    )}
                    {test.defenseType && (
                      <Badge variant="default" className="bg-blue-500">{test.defenseType}</Badge>
                    )}
                    {getStatusBadge(test.status)}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedTest(selectedTest === test.id ? null : test.id)}
                  >
                    {selectedTest === test.id ? "Hide Details" : "Show Details"}
                  </Button>
                  <Button asChild size="sm">
                    <Link href={`/dashboard/results/${test.id}`}>
                      View Full Report
                    </Link>
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>Created: {formatDate(test.createdAt)}</span>
                </div>
                {test.completedAt && (
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <span>Duration: {formatDuration(test.createdAt, test.completedAt)}</span>
                  </div>
                )}
                {test.status === "running" && test.progress !== undefined && (
                  <div className="flex items-center space-x-2">
                    <Activity className="h-4 w-4" />
                    <span>Progress: {test.progress}%</span>
                  </div>
                )}
                {test.error && (
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    <span className="text-red-500">Error: {test.error}</span>
                  </div>
                )}
              </div>

              {test.status === "running" && test.progress !== undefined && (
                <div className="mt-4">
                  <Progress value={test.progress} className="h-2" />
                </div>
              )}

              {selectedTest === test.id && test.results && (
                <div className="mt-6 pt-6 border-t">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* ASR Pie Chart */}
                    {test.results.asr && (
                      <div className="flex justify-center">
                        <ASRPieChart asr={test.results.asr} size="md" />
                      </div>
                    )}
                    
                    {/* Results Details */}
                    <div>
                      {test.type === "white" ? renderWhiteBoxResults(test) : renderBlackBoxResults(test)}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {testResults.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Brain className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No tests found</h3>
            <p className="text-muted-foreground text-center mb-4">
              You haven't created any tests yet. Start by creating your first NLP attack test.
            </p>
            <Button asChild>
              <Link href="/dashboard/create">
                <Brain className="mr-2 h-4 w-4" />
                Create Your First Test
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
