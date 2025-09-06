"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { useChartColors } from '@/hooks/use-chart-colors'

interface ASRPieChartProps {
  asr: number // Attack Success Rate (0-1)
  title?: string
  size?: 'sm' | 'md' | 'lg'
}

const SIZE_CONFIG = {
  sm: { width: 200, height: 200, innerRadius: 30, outerRadius: 60 },
  md: { width: 300, height: 300, innerRadius: 50, outerRadius: 100 },
  lg: { width: 400, height: 400, innerRadius: 70, outerRadius: 140 },
}

export default function ASRPieChart({ asr, title = "Attack Success Rate", size = 'md' }: ASRPieChartProps) {
  const colors = useChartColors()
  const successRate = Math.round(asr * 100)
  const failureRate = 100 - successRate

  const data = [
    { name: 'Successful Attacks', value: successRate, color: colors.success },
    { name: 'Failed Attacks', value: failureRate, color: colors.failure },
  ]

  const config = SIZE_CONFIG[size]

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0]
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium text-foreground">{data.name}</p>
          <p className="text-sm text-muted-foreground">
            {data.value}% ({data.value === successRate ? 'Successful' : 'Failed'} attacks)
          </p>
        </div>
      )
    }
    return null
  }

  const CustomLegend = ({ payload }: any) => {
    return (
      <div className="flex justify-center space-x-4 mt-4">
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center space-x-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-muted-foreground">{entry.value}</span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="relative">
        <ResponsiveContainer width={config.width} height={config.height}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={config.innerRadius}
              outerRadius={config.outerRadius}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
          </PieChart>
        </ResponsiveContainer>
        
        {/* Center text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-3xl font-bold text-foreground">
              {successRate}%
            </div>
            <div className="text-sm text-muted-foreground">
              ASR
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
