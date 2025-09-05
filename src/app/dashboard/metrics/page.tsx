import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Calendar, TrendingUp, TrendingDown, Activity } from "lucide-react"

// Placeholder data - replace with server actions later
const metrics = {
  totalTests: 24,
  successRate: 78.5,
  averageDuration: "3m 24s",
  totalPrompts: 12500,
  modelsTested: 8,
  lastWeekTests: 6,
  lastWeekSuccessRate: 82.3,
}

const modelPerformance = [
  { model: "GPT-4", tests: 8, successRate: 85.2, avgDuration: "2m 45s" },
  { model: "CLIP", tests: 5, successRate: 78.4, avgDuration: "4m 12s" },
  { model: "BERT", tests: 6, successRate: 72.1, avgDuration: "1m 58s" },
  { model: "DALL-E 3", tests: 3, successRate: 92.8, avgDuration: "5m 15s" },
  { model: "Codex", tests: 2, successRate: 78.5, avgDuration: "2m 45s" },
]

const testTypes = [
  { type: "Adversarial", count: 8, successRate: 75.2 },
  { type: "Robustness", count: 6, successRate: 82.1 },
  { type: "Sentiment", count: 4, successRate: 68.5 },
  { type: "Generation", count: 3, successRate: 92.8 },
  { type: "Code Generation", count: 2, successRate: 78.5 },
  { type: "Classification", count: 1, successRate: 85.0 },
]


export default function MetricsPage() {
  const successRateChange = metrics.successRate - metrics.lastWeekSuccessRate
  const testsChange = metrics.totalTests - metrics.lastWeekTests

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics & Metrics</h1>
          <p className="text-muted-foreground">
            Comprehensive insights into your testing performance
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Calendar className="mr-2 h-4 w-4" />
            Last 30 days
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tests</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalTests}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {testsChange > 0 ? (
                <TrendingUp className="mr-1 h-3 w-3 text-green-600" />
              ) : (
                <TrendingDown className="mr-1 h-3 w-3 text-red-600" />
              )}
              {Math.abs(testsChange)} from last week
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.successRate}%</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {successRateChange > 0 ? (
                <TrendingUp className="mr-1 h-3 w-3 text-green-600" />
              ) : (
                <TrendingDown className="mr-1 h-3 w-3 text-red-600" />
              )}
              {Math.abs(successRateChange).toFixed(1)}% from last week
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Duration</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.averageDuration}</div>
            <p className="text-xs text-muted-foreground">
              Per test execution
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Prompts</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalPrompts.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Across all tests
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Model Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Model Performance</CardTitle>
            <CardDescription>
              Success rates and performance by model
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {modelPerformance.map((model) => (
                <div key={model.model} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{model.model}</span>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">{model.tests} tests</Badge>
                      <span className="text-sm text-muted-foreground">
                        {model.successRate}%
                      </span>
                    </div>
                  </div>
                  <Progress value={model.successRate} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    Avg duration: {model.avgDuration}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Test Types */}
        <Card>
          <CardHeader>
            <CardTitle>Test Types</CardTitle>
            <CardDescription>
              Distribution and success rates by test type
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {testTypes.map((type) => (
                <div key={type.type} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{type.type}</span>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{type.count}</Badge>
                      <span className="text-sm text-muted-foreground">
                        {type.successRate}%
                      </span>
                    </div>
                  </div>
                  <Progress value={type.successRate} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  )
}
