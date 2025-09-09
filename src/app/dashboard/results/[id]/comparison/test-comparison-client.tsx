"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
  RefreshCw,
  Play,
  BarChart3,
  ShieldCheck,
  ShieldX
} from "lucide-react"
import Link from "next/link"
import ASRPieChart from "@/components/charts/asr-pie-chart"
import SingleCategoryASR from "@/components/charts/single-category-asr"

interface TestData {
  id: string
  name: string
  type: string
  status: string
  modelId?: string | null
  attackCategory?: string | null
  defenseType?: string | null
  maxSamples?: number | null
  createdAt: Date | string
  updatedAt: Date | string
  completedAt?: Date | string | null
  error?: string | null
  
  // Attack results
  asr?: number | null
  accuracy?: number | null
  recall?: number | null
  precision?: number | null
  f1?: number | null
  latency?: number | null
  tokenUsage?: number | null
  categoryWiseASR?: Record<string, number> | null
  
  // Defense results
  defenseASR?: number | null
  defenseAccuracy?: number | null
  defenseRecall?: number | null
  defensePrecision?: number | null
  defenseF1?: number | null
  defenseLatency?: number | null
  defenseTokenUsage?: number | null
  defenseCategoryWiseASR?: Record<string, number> | null
}

interface TestComparisonClientProps {
  test: TestData
}

function formatDuration(durationMs: number): string {
  const minutes = Math.floor(durationMs / 60000)
  const seconds = Math.floor((durationMs % 60000) / 1000)
  return `${minutes}m ${seconds}s`
}

function formatPercentage(value: number | null | undefined): string {
  if (value === undefined || value === null) return "N/A"
  return `${(value * 100).toFixed(1)}%`
}

function formatNumber(value: number | null | undefined): string {
  if (value === undefined || value === null) return "N/A"
  return value.toFixed(2)
}

function getASRColor(asr: number | null | undefined): string {
  if (asr === undefined || asr === null) return "text-gray-500"
  if (asr >= 0.8) return "text-red-600"
  if (asr >= 0.5) return "text-yellow-600"
  return "text-green-600"
}

function getASRIcon(asr: number | null | undefined) {
  if (asr === undefined || asr === null) return <AlertTriangle className="h-4 w-4" />
  if (asr >= 0.8) return <XCircle className="h-4 w-4 text-red-600" />
  if (asr >= 0.5) return <AlertTriangle className="h-4 w-4 text-yellow-600" />
  return <CheckCircle className="h-4 w-4 text-green-600" />
}

export default function TestComparisonClient({ test }: TestComparisonClientProps) {
  const hasAttackResults = test.asr !== undefined
  const hasDefenseResults = test.defenseASR !== undefined
  const hasBothResults = hasAttackResults && hasDefenseResults

  const renderComparisonMetrics = () => {
    if (!hasBothResults) {
      return (
        <div className="text-center py-8 text-gray-500">
          {!hasAttackResults && !hasDefenseResults && "No results available yet"}
          {hasAttackResults && !hasDefenseResults && "Attack results available, defense evaluation pending"}
          {!hasAttackResults && hasDefenseResults && "Defense results available, attack evaluation pending"}
        </div>
      )
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Attack Results */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-red-600" />
              Attack Results (No Defense)
            </CardTitle>
            <CardDescription>
              Results from the initial attack evaluation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">
                  {formatPercentage(test.asr)}
                </div>
                <div className="text-sm text-gray-600">Attack Success Rate</div>
                {getASRIcon(test.asr)}
              </div>
              
              {test.type === 'white' && (
                <>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {formatPercentage(test.accuracy)}
                    </div>
                    <div className="text-sm text-gray-600">Accuracy</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {formatPercentage(test.recall)}
                    </div>
                    <div className="text-sm text-gray-600">Recall</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {formatPercentage(test.precision)}
                    </div>
                    <div className="text-sm text-gray-600">Precision</div>
                  </div>
                </>
              )}
              
              {test.type === 'black' && (
                <>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {formatNumber(test.latency)}s
                    </div>
                    <div className="text-sm text-gray-600">Latency</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {test.tokenUsage?.toLocaleString() || "N/A"}
                    </div>
                    <div className="text-sm text-gray-600">Token Usage</div>
                  </div>
                </>
              )}
            </div>
            
          </CardContent>
        </Card>

        {/* Defense Results */}
        {hasDefenseResults && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-600" />
                Defense Results ({test.defenseType})
              </CardTitle>
              <CardDescription>
                Results with {test.defenseType} defense applied
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {formatPercentage(test.defenseASR)}
                  </div>
                  <div className="text-sm text-gray-600">Attack Success Rate</div>
                  {getASRIcon(test.defenseASR)}
                </div>
                
                {test.type === 'white' && (
                  <>
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {formatPercentage(test.defenseAccuracy)}
                      </div>
                      <div className="text-sm text-gray-600">Accuracy</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {formatPercentage(test.defenseRecall)}
                      </div>
                      <div className="text-sm text-gray-600">Recall</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">
                        {formatPercentage(test.defensePrecision)}
                      </div>
                      <div className="text-sm text-gray-600">Precision</div>
                    </div>
                  </>
                )}
                
                {test.type === 'black' && (
                  <>
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {formatNumber(test.defenseLatency)}s
                      </div>
                      <div className="text-sm text-gray-600">Latency</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {test.defenseTokenUsage?.toLocaleString() || "N/A"}
                      </div>
                      <div className="text-sm text-gray-600">Token Usage</div>
                    </div>
                  </>
                )}
              </div>
              
            </CardContent>
          </Card>
        )}
      </div>
    )
  }

  const renderDefenseEffectiveness = () => {
    if (!hasBothResults) return null

    const asrImprovement = (test.asr || 0) - (test.defenseASR || 0)
    const isEffective = asrImprovement > 0

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Defense Effectiveness Analysis
          </CardTitle>
          <CardDescription>
            How well the {test.defenseType} defense performed
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-3xl font-bold text-gray-800">
                {formatPercentage(test.asr)}
              </div>
              <div className="text-sm text-gray-600">Attack ASR (No Defense)</div>
            </div>
            
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-3xl font-bold text-gray-800">
                {formatPercentage(test.defenseASR)}
              </div>
              <div className="text-sm text-gray-600">Defense ASR</div>
            </div>
            
            <div className={`text-center p-4 rounded-lg ${isEffective ? 'bg-green-50' : 'bg-red-50'}`}>
              <div className={`text-3xl font-bold ${isEffective ? 'text-green-600' : 'text-red-600'}`}>
                {asrImprovement > 0 ? '+' : ''}{formatPercentage(Math.abs(asrImprovement))}
              </div>
              <div className="text-sm text-gray-600">ASR Reduction</div>
              <div className="mt-2">
                {isEffective ? (
                  <div className="flex items-center justify-center gap-1 text-green-600">
                    <ShieldCheck className="h-4 w-4" />
                    <span className="text-sm font-medium">Effective</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-1 text-red-600">
                    <ShieldX className="h-4 w-4" />
                    <span className="text-sm font-medium">Ineffective</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <div className="text-sm text-blue-800">
              <strong>Analysis:</strong> The {test.defenseType} defense 
              {isEffective ? ' successfully reduced' : ' failed to reduce'} the attack success rate by{' '}
              {formatPercentage(Math.abs(asrImprovement))}.
              {isEffective 
                ? ' This indicates the defense mechanism is working effectively.'
                : ' This suggests the defense mechanism needs improvement or the attack is too sophisticated.'
              }
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const renderCategoryComparison = () => {
    if (!hasBothResults || !test.categoryWiseASR || !test.defenseCategoryWiseASR) {
      return null
    }

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Category-wise Attack Success Rate Comparison
          </CardTitle>
          <CardDescription>
            How different attack categories performed with and without defense
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.keys(test.categoryWiseASR!).map((category) => {
              const attackASR = test.categoryWiseASR![category]
              const defenseASR = test.defenseCategoryWiseASR![category]
              const improvement = attackASR - (defenseASR || 0)
              const isEffective = improvement > 0

              return (
                <div key={category} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">{category}</div>
                    <div className="text-sm text-gray-600">
                      Attack: {formatPercentage(attackASR)} → Defense: {formatPercentage(defenseASR)}
                    </div>
                  </div>
                  <div className={`text-right ${isEffective ? 'text-green-600' : 'text-red-600'}`}>
                    <div className="font-bold">
                      {improvement > 0 ? '+' : ''}{formatPercentage(Math.abs(improvement))}
                    </div>
                    <div className="text-xs">
                      {isEffective ? 'Improved' : 'Worse'}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link href="/dashboard/results">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Results
              </Button>
            </Link>
          </div>
          <h1 className="text-3xl font-bold">{test.name}</h1>
          <p className="text-gray-600 mt-1">
            {test.type === 'white' ? 'White Box' : 'Black Box'} Attack vs Defense Comparison
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant={test.status === 'completed' ? 'default' : 'secondary'}>
            {test.status}
          </Badge>
          {test.defenseType && (
            <Badge variant="outline">
              <Shield className="h-3 w-3 mr-1" />
              {test.defenseType}
            </Badge>
          )}
        </div>
      </div>

      {/* Test Info */}
      <Card>
        <CardHeader>
          <CardTitle>Test Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <div className="font-medium">Test Type</div>
              <div className="text-gray-600">{test.type === 'white' ? 'White Box' : 'Black Box'}</div>
            </div>
            {test.modelId && (
              <div>
                <div className="font-medium">Model</div>
                <div className="text-gray-600">{test.modelId}</div>
              </div>
            )}
            {test.attackCategory && (
              <div>
                <div className="font-medium">Attack Category</div>
                <div className="text-gray-600">{test.attackCategory}</div>
              </div>
            )}
            {test.maxSamples && (
              <div>
                <div className="font-medium">Max Samples</div>
                <div className="text-gray-600">{test.maxSamples}</div>
              </div>
            )}
            <div>
              <div className="font-medium">Created</div>
              <div className="text-gray-600">{new Date(test.createdAt).toLocaleDateString()}</div>
            </div>
            {test.completedAt && (
              <div>
                <div className="font-medium">Completed</div>
                <div className="text-gray-600">{new Date(test.completedAt).toLocaleDateString()}</div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Comparison Metrics */}
      {renderComparisonMetrics()}

      {/* Defense Effectiveness */}
      {renderDefenseEffectiveness()}

      {/* Category Comparison */}
      {renderCategoryComparison()}

      {/* Error Display */}
      {test.error && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-600">
              <XCircle className="h-5 w-5" />
              <span className="font-medium">Error</span>
            </div>
            <p className="text-red-600 dark:text-red-400 mt-2">{test.error}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
