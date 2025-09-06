// Theme-aware chart colors using your existing CSS variables

export const chartColors = {
  // Primary colors for success/failure - using your existing chart colors
  success: 'var(--chart-1)', // Green for successful attacks
  failure: 'var(--destructive)', // Red for failed attacks
  
  // Category colors using your existing chart color palette
  categories: [
    'var(--chart-1)', // Green
    'var(--chart-2)', // Blue  
    'var(--chart-3)', // Purple
    'var(--chart-4)', // Orange
    'var(--chart-5)', // Yellow
    'var(--destructive)', // Red
  ]
}

// Get the appropriate color based on theme
export function getChartColor(colorKey: keyof typeof chartColors) {
  return chartColors[colorKey]
}

// Get category color by index
export function getCategoryColor(index: number) {
  return chartColors.categories[index % chartColors.categories.length]
}
