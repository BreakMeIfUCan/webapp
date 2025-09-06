import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Brain, 
  Shield, 
  Clock, 
  CheckCircle, 
  XCircle, 
  PlayCircle,
  TrendingUp,
  Activity,
  Target,
  Zap,
  TestTube,
  Users,
  BarChart3
} from "lucide-react"
import Link from "next/link"

// Placeholder data - replace with server actions later
const stats = {
  totalTests: 12,
  completedTests: 8,
  runningTests: 2,
  failedTests: 2,
  avgASR: 68,
  avgLatency: "2.1s",
  totalAttacks: 45,
  activeTests: 2,
}

const recentTests = [
  {
    id: "test-001",
    name: "GPT-2 Phishing Attack",
    type: "black",
    status: "completed",
    createdAt: "2024-01-15T10:30:00Z",
    duration: "2m 34s",
    asr: 75,
    attackCategory: "Phishing",
  },
  {
    id: "test-002", 
    name: "BERT White Box Analysis",
    type: "white",
    status: "running",
    createdAt: "2024-01-15T11:15:00Z",
    duration: "1m 12s",
    asr: null,
    modelId: "bert-base-uncased",
  },
  {
    id: "test-003",
    name: "RoBERTa Prompt Injection",
    type: "black",
    status: "failed",
    createdAt: "2024-01-15T09:45:00Z",
    duration: "0m 45s",
    asr: 0,
    attackCategory: "Prompt Injection",
  },
  {
    id: "test-004",
    name: "DistilBERT Jailbreaking",
    type: "black",
    status: "completed",
    createdAt: "2024-01-14T16:20:00Z",
    duration: "3m 12s",
    asr: 45,
    attackCategory: "Jailbreaking",
  },
  {
    id: "test-005",
    name: "T5 Data Extraction",
    type: "white",
    status: "completed",
    createdAt: "2024-01-14T14:30:00Z",
    duration: "1m 58s",
    asr: 68,
    modelId: "t5-small",
  }
]

const attackCategories = [
  { name: "Phishing", count: 15, asr: 75 },
  { name: "Prompt Injection", count: 12, asr: 60 },
  { name: "Jailbreaking", count: 8, asr: 45 },
  { name: "Data Extraction", count: 10, asr: 55 }
]

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">NLP Attack Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor your NLP security tests and attack results.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button asChild>
            <Link href="/dashboard/create">
              <Brain className="mr-2 h-4 w-4" />
              Create Attack Test
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tests</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTests}</div>
            <p className="text-xs text-muted-foreground">
              NLP attack tests
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg ASR</CardTitle>
            <Target className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgASR}%</div>
            <p className="text-xs text-muted-foreground">
              Attack Success Rate
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
            <CardTitle className="text-sm font-medium">Avg Latency</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgLatency}</div>
            <p className="text-xs text-muted-foreground">
              Response time
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Attack Categories */}
      <Card>
        <CardHeader>
          <CardTitle>Attack Categories</CardTitle>
          <CardDescription>
            Performance by attack type
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {attackCategories.map((category) => (
              <div key={category.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{category.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {category.asr}%
                  </span>
                </div>
                <Progress value={category.asr} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  {category.count} tests
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

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
                <Link key={test.id} href={`/dashboard/results/${test.id}`}>
                  <div className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {test.name}
                      </p>
                      <div className="flex items-center gap-2">
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
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {new Date(test.createdAt).toLocaleDateString()} • {test.duration}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {test.asr !== null && (
                        <div className="text-right">
                          <p className="text-sm font-medium">{test.asr}%</p>
                          <p className="text-xs text-muted-foreground">ASR</p>
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
                </Link>
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
