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
import { getUserTests, getTestStats, getAttackCategoryStats } from "@/data-access/tests"

export default async function DashboardPage() {
  // Fetch real data from server actions
  const [stats, recentTests, attackCategories] = await Promise.all([
    getTestStats(),
    getUserTests(),
    getAttackCategoryStats()
  ])

  // Get recent tests (limit to 5)
  const recentTestsData = recentTests.slice(0, 5).map(test => ({
    id: test.id,
    name: test.name,
    type: test.category,
    status: test.status,
    createdAt: test.createdAt,
    duration: test.completedAt ? 
      `${Math.round((new Date(test.completedAt).getTime() - new Date(test.createdAt).getTime()) / 60000)}m` : 
      "Running",
    asr: test.asr ? Math.round(parseFloat(test.asr) * 100) : null,
    attackCategory: test.attackCategory,
    modelId: test.modelId,
  }))
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
              {recentTestsData.map((test) => (
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
