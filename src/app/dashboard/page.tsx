import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  TestTube, 
  BarChart3, 
  Clock, 
  CheckCircle, 
  XCircle, 
  PlayCircle,
  TrendingUp,
  Activity,
  Users,
  Zap
} from "lucide-react"
import Link from "next/link"

// Placeholder data - replace with server actions later
const stats = {
  totalTests: 24,
  completedTests: 18,
  runningTests: 3,
  failedTests: 3,
  successRate: 75,
  avgDuration: "2m 34s",
  totalUsers: 12,
  activeTests: 3,
}

const recentTests = [
  {
    id: "test-001",
    name: "GPT-4 Adversarial Test",
    status: "completed",
    createdAt: "2024-01-15T10:30:00Z",
    duration: "2m 34s",
    successRate: 85,
  },
  {
    id: "test-002", 
    name: "Vision Model Robustness",
    status: "running",
    createdAt: "2024-01-15T11:15:00Z",
    duration: "1m 12s",
    successRate: null,
  },
  {
    id: "test-003",
    name: "BERT Sentiment Analysis",
    status: "failed",
    createdAt: "2024-01-15T09:45:00Z",
    duration: "0m 45s",
    successRate: 0,
  },
  {
    id: "test-004",
    name: "DALL-E Image Generation",
    status: "completed",
    createdAt: "2024-01-14T16:20:00Z",
    duration: "5m 15s",
    successRate: 92,
  },
]


const modelPerformance = [
  { model: "GPT-4", tests: 8, successRate: 85 },
  { model: "CLIP", tests: 5, successRate: 78 },
  { model: "BERT", tests: 6, successRate: 72 },
  { model: "DALL-E 3", tests: 3, successRate: 92 },
  { model: "Codex", tests: 2, successRate: 78 },
]

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening with your tests.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button asChild>
            <Link href="/dashboard/create">
              <TestTube className="mr-2 h-4 w-4" />
              Create Test
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tests</CardTitle>
            <TestTube className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTests}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12%</span> from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.successRate}%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+5%</span> from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Tests</CardTitle>
            <Activity className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeTests}</div>
            <p className="text-xs text-muted-foreground">
              Currently running
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Duration</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgDuration}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">-15%</span> faster than last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">

        {/* Model Performance */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Model Performance</CardTitle>
            <CardDescription>
              Success rates by model
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {modelPerformance.map((model) => (
                <div key={model.model} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{model.model}</span>
                    <span className="text-sm text-muted-foreground">
                      {model.successRate}%
                    </span>
                  </div>
                  <Progress value={model.successRate} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    {model.tests} tests
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Tests and Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Recent Tests */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Recent Tests</CardTitle>
            <CardDescription>
              Your latest test executions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTests.map((test) => (
                <div key={test.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {test.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(test.createdAt).toLocaleDateString()} • {test.duration}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {test.successRate !== null && (
                      <div className="text-right">
                        <p className="text-sm font-medium">{test.successRate}%</p>
                        <p className="text-xs text-muted-foreground">success</p>
                      </div>
                    )}
                    <Badge 
                      variant={
                        test.status === 'completed' ? 'default' :
                        test.status === 'running' ? 'secondary' :
                        'destructive'
                      }
                    >
                      {test.status === 'completed' && <CheckCircle className="mr-1 h-3 w-3" />}
                      {test.status === 'running' && <PlayCircle className="mr-1 h-3 w-3" />}
                      {test.status === 'failed' && <XCircle className="mr-1 h-3 w-3" />}
                      {test.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks and shortcuts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild className="w-full justify-start">
              <Link href="/dashboard/create">
                <TestTube className="mr-2 h-4 w-4" />
                Create New Test
              </Link>
            </Button>
            <Button variant="outline" asChild className="w-full justify-start">
              <Link href="/dashboard/tests">
                <BarChart3 className="mr-2 h-4 w-4" />
                View All Tests
              </Link>
            </Button>
            <Button variant="outline" asChild className="w-full justify-start">
              <Link href="/dashboard/metrics">
                <TrendingUp className="mr-2 h-4 w-4" />
                View Analytics
              </Link>
            </Button>
            <Button variant="outline" asChild className="w-full justify-start">
              <Link href="/dashboard/settings">
                <Users className="mr-2 h-4 w-4" />
                Settings
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
