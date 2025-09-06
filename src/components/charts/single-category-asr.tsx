"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Target } from "lucide-react"

interface SingleCategoryASRProps {
  categoryWiseASR: Record<string, number> // { "Phishing": 0.75 } - only one category
  title?: string
}

export default function SingleCategoryASR({ categoryWiseASR, title = "Category ASR" }: SingleCategoryASRProps) {
  // Get the single category and its ASR
  const entries = Object.entries(categoryWiseASR)
  if (entries.length === 0) return null
  
  const [category, asr] = entries[0]
  const asrPercentage = Math.round(asr * 100)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Badge variant="outline" className="text-sm">
              {category}
            </Badge>
            <p className="text-sm text-muted-foreground">
              Attack Category
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">
              {asrPercentage}%
            </div>
            <p className="text-sm text-muted-foreground">
              ASR
            </p>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Attack Success Rate</span>
            <span className="font-medium">{asrPercentage}%</span>
          </div>
          <Progress value={asrPercentage} className="h-3" />
        </div>
      </CardContent>
    </Card>
  )
}
