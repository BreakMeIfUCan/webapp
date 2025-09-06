"use client"

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
import ASRPieChart from "@/components/charts/asr-pie-chart"
import SingleCategoryASR from "@/components/charts/single-category-asr"

interface TestData {
  id: string
  name: string
  type: string
  status: string
  createdAt: string
  completedAt?: string
  attackCategory?: string
  modelId?: string
  description?: string
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

interface TestResultClientProps {
  testData: TestData
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "completed":
      return <Badge variant="default" className="flex items-center gap-1">
        <CheckCircle className="h-3 w-3" />
        Completed
      </Badge>
    case "running":
      return <Badge variant="secondary" className="flex items-center gap-1">
        <Activity className="h-3 w-3" />
        Running
      </Badge>
    case "failed":
      return <Badge variant="destructive" className="flex items-center gap-1">
        <XCircle className="h-3 w-3" />
        Failed
      </Badge>
    default:
      return <Badge variant="secondary" className="flex items-center gap-1">
        <Clock className="h-3 w-3" />
        Pending
      </Badge>
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString()
}

const formatDuration = (start: string, end?: string) => {
  const startTime = new Date(start)
  const endTime = end ? new Date(end) : new Date()
  const durationMs = endTime.getTime() - startTime.getTime()
  const minutes = Math.floor(durationMs / 60000)
  const seconds = Math.floor((durationMs % 60000) / 1000)
  return `${minutes}m ${seconds}s`
}

export default function TestResultClient({ testData }: TestResultClientProps) {
  const { results } = testData

  const renderWhiteBoxResults = () => {
    return (
      <div className="space-y-6">
        {/* ASR Pie Chart */}
        {results?.asr && (
          <Card>
            <CardContent className="pt-6">
              <ASRPieChart asr={results.asr} size="lg" />
            </CardContent>
          </Card>
        )}

        {/* Main Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Target className="h-4 w-4" />
                ASR
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {results?.asr ? `${Math.round(results.asr * 100)}%` : "N/A"}
              </div>
              <p className="text-xs text-muted-foreground">Attack Success Rate</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Accuracy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {results?.accuracy ? `${Math.round(results.accuracy * 100)}%` : "N/A"}
              </div>
              <p className="text-xs text-muted-foreground">Model Accuracy</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Precision
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {results?.precision ? `${Math.round(results.precision * 100)}%` : "N/A"}
              </div>
              <p className="text-xs text-muted-foreground">Precision Score</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Zap className="h-4 w-4" />
                F1 Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {results?.f1 ? `${Math.round(results.f1 * 100)}%` : "N/A"}
              </div>
              <p className="text-xs text-muted-foreground">F1 Score</p>
            </CardContent>
          </Card>
        </div>

        {/* Defense Results */}
        {testData.defenseType && results?.defenseASR && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-500" />
              <h3 className="text-lg font-semibold">Defense Results ({testData.defenseType})</h3>
            </div>
            
            {/* Defense ASR Pie Chart */}
            <Card>
              <CardContent className="pt-6">
                <ASRPieChart asr={results.defenseASR} size="lg" title="ASR with Defense" />
              </CardContent>
            </Card>

            {/* Defense Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Defense ASR
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {results?.defenseASR ? `${Math.round(results.defenseASR * 100)}%` : "N/A"}
                  </div>
                  <p className="text-xs text-muted-foreground">ASR with Defense</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <TrendingDown className="h-4 w-4" />
                    Defense Accuracy
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {results?.defenseAccuracy ? `${Math.round(results.defenseAccuracy * 100)}%` : "N/A"}
                  </div>
                  <p className="text-xs text-muted-foreground">Accuracy with Defense</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Defense Recall
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {results?.defenseRecall ? `${Math.round(results.defenseRecall * 100)}%` : "N/A"}
                  </div>
                  <p className="text-xs text-muted-foreground">Recall with Defense</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    Defense F1
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {results?.defenseF1 ? `${Math.round(results.defenseF1 * 100)}%` : "N/A"}
                  </div>
                  <p className="text-xs text-muted-foreground">F1 with Defense</p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Detailed Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Performance Metrics</CardTitle>
              <CardDescription>
                Detailed performance analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Recall</span>
                <span className="text-sm">
                  {results?.recall ? `${Math.round(results.recall * 100)}%` : "N/A"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Precision</span>
                <span className="text-sm">
                  {results?.precision ? `${Math.round(results.precision * 100)}%` : "N/A"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">F1 Score</span>
                <span className="text-sm">
                  {results?.f1 ? `${Math.round(results.f1 * 100)}%` : "N/A"}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Attack Analysis</CardTitle>
              <CardDescription>
                Attack success rate breakdown
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Overall ASR</span>
                  <div className="flex items-center space-x-2">
                    <Progress value={results?.asr ? results.asr * 100 : 0} className="w-20 h-2" />
                    <span className="text-sm font-medium">
                      {results?.asr ? `${Math.round(results.asr * 100)}%` : "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const renderBlackBoxResults = () => {
    return (
      <div className="space-y-6">
        {/* ASR Pie Chart */}
        {results?.asr && (
          <Card>
            <CardContent className="pt-6">
              <ASRPieChart asr={results.asr} size="lg" />
            </CardContent>
          </Card>
        )}

        {/* Main Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Target className="h-4 w-4" />
                ASR
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {results?.asr ? `${Math.round(results.asr * 100)}%` : "N/A"}
              </div>
              <p className="text-xs text-muted-foreground">Attack Success Rate</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Latency
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {results?.latency ? `${results.latency}s` : "N/A"}
              </div>
              <p className="text-xs text-muted-foreground">Response Time</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Tokens
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {results?.tokenUsage ? `${results.tokenUsage.toLocaleString()}` : "N/A"}
              </div>
              <p className="text-xs text-muted-foreground">Token Usage</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Brain className="h-4 w-4" />
                Category
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold">
                {testData.attackCategory || "N/A"}
              </div>
              <p className="text-xs text-muted-foreground">Attack Type</p>
            </CardContent>
          </Card>
        </div>

        {/* Single Category ASR */}
        {results?.categoryWiseASR && (
          <SingleCategoryASR categoryWiseASR={results.categoryWiseASR} />
        )}

        {/* Defense Results */}
        {testData.defenseType && results?.defenseASR && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-500" />
              <h3 className="text-lg font-semibold">Defense Results ({testData.defenseType})</h3>
            </div>
            
            {/* Defense ASR Pie Chart */}
            <Card>
              <CardContent className="pt-6">
                <ASRPieChart asr={results.defenseASR} size="lg" title="ASR with Defense" />
              </CardContent>
            </Card>

            {/* Defense Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Defense ASR
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {results?.defenseASR ? `${Math.round(results.defenseASR * 100)}%` : "N/A"}
                  </div>
                  <p className="text-xs text-muted-foreground">ASR with Defense</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Defense Latency
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {results?.defenseLatency ? `${results.defenseLatency}s` : "N/A"}
                  </div>
                  <p className="text-xs text-muted-foreground">Latency with Defense</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    Defense Tokens
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {results?.defenseTokenUsage ? `${results.defenseTokenUsage.toLocaleString()}` : "N/A"}
                  </div>
                  <p className="text-xs text-muted-foreground">Tokens with Defense</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Defense Category
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {testData.attackCategory || "N/A"}
                  </div>
                  <p className="text-xs text-muted-foreground">Attack Type</p>
                </CardContent>
              </Card>
            </div>

            {/* Defense Category ASR */}
            {results?.defenseCategoryWiseASR && (
              <SingleCategoryASR categoryWiseASR={results.defenseCategoryWiseASR} />
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/results">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Results
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{testData.name}</h1>
            <p className="text-muted-foreground">
              {testData.description || "NLP Attack Test Results"}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {getStatusBadge(testData.status)}
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Test Information */}
      <Card>
        <CardHeader>
          <CardTitle>Test Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="space-y-1">
              <p className="font-medium">Test Type</p>
              <Badge variant="outline">
                {testData.type === "white" ? "White Box" : "Black Box"}
              </Badge>
            </div>
            <div className="space-y-1">
              <p className="font-medium">Model</p>
              <p className="text-muted-foreground">
                {testData.modelId || testData.attackCategory || "N/A"}
              </p>
            </div>
            {testData.defenseType && (
              <div className="space-y-1">
                <p className="font-medium">Defense</p>
                <Badge variant="secondary">
                  {testData.defenseType}
                </Badge>
              </div>
            )}
            <div className="space-y-1">
              <p className="font-medium">Created</p>
              <p className="text-muted-foreground">
                {formatDate(testData.createdAt)}
              </p>
            </div>
            <div className="space-y-1">
              <p className="font-medium">Duration</p>
              <p className="text-muted-foreground">
                {testData.completedAt 
                  ? formatDuration(testData.createdAt, testData.completedAt)
                  : testData.status === "running" ? "Running..." : "N/A"
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress Bar for Running Tests */}
      {testData.status === "running" && testData.progress !== undefined && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Test Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Progress</span>
                <span>{testData.progress}%</span>
              </div>
              <Progress value={testData.progress} className="h-2" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error Display */}
      {testData.error && (
        <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <AlertTriangle className="h-5 w-5" />
              Test Failed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-600 dark:text-red-400">{testData.error}</p>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {testData.status === "completed" && results && (
        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
            <CardDescription>
              Detailed analysis of the {testData.type === "white" ? "white box" : "black box"} attack test
            </CardDescription>
          </CardHeader>
          <CardContent>
            {testData.type === "white" ? renderWhiteBoxResults() : renderBlackBoxResults()}
          </CardContent>
        </Card>
      )}

      {/* No Results */}
      {testData.status !== "completed" && !testData.error && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Activity className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Test in Progress</h3>
            <p className="text-muted-foreground text-center">
              This test is currently running. Results will appear here once completed.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
