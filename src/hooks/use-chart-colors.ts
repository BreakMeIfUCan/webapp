"use client"

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'

export function useChartColors() {
  const { theme } = useTheme()
  const [colors, setColors] = useState({
    success: '#22c55e', // fallback green
    failure: '#ef4444', // fallback red
    categories: ['#22c55e', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444']
  })

  useEffect(() => {
    // Small delay to ensure theme has been applied
    const timer = setTimeout(() => {
      // Get computed styles to extract actual color values
      const getComputedColor = (cssVar: string) => {
        if (typeof window === 'undefined') return '#22c55e'
        
        const root = document.documentElement
        const computedStyle = getComputedStyle(root)
        return computedStyle.getPropertyValue(cssVar).trim() || '#22c55e'
      }

      const newColors = {
        success: getComputedColor('--chart-1'),
        failure: getComputedColor('--destructive'),
        categories: [
          getComputedColor('--chart-1'),
          getComputedColor('--chart-2'),
          getComputedColor('--chart-3'),
          getComputedColor('--chart-4'),
          getComputedColor('--chart-5'),
          getComputedColor('--destructive'),
        ]
      }

      setColors(newColors)
    }, 100)

    return () => clearTimeout(timer)
  }, [theme]) // Re-run when theme changes

  return colors
}
