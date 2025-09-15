"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './card'
import { cn } from '@/lib/utils'

// Chart Types
export type ChartType = 'line' | 'bar' | 'pie' | 'doughnut' | 'area' | 'scatter' | 'radar'

// Chart Data Interfaces
export interface ChartDataPoint {
  label: string
  value: number
  color?: string
  metadata?: Record<string, any>
}

export interface ChartDataset {
  label: string
  data: number[]
  backgroundColor?: string | string[]
  borderColor?: string | string[]
  borderWidth?: number
  fill?: boolean
}

export interface ChartData {
  labels: string[]
  datasets: ChartDataset[]
}

export interface ChartOptions {
  responsive?: boolean
  maintainAspectRatio?: boolean
  plugins?: {
    title?: {
      display?: boolean
      text?: string
    }
    legend?: {
      display?: boolean
      position?: 'top' | 'bottom' | 'left' | 'right'
    }
    tooltip?: {
      enabled?: boolean
    }
  }
  scales?: {
    x?: {
      display?: boolean
      title?: {
        display?: boolean
        text?: string
      }
    }
    y?: {
      display?: boolean
      title?: {
        display?: boolean
        text?: string
      }
      beginAtZero?: boolean
    }
  }
}

// Base Chart Component
interface BaseChartProps {
  type: ChartType
  data: ChartData
  options?: ChartOptions
  height?: number | string
  className?: string
  title?: string
  subtitle?: string
}

export function BaseChart({
  type,
  data,
  options = {},
  height = 300,
  className,
  title,
  subtitle,
}: BaseChartProps) {
  const defaultOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: !!title,
        text: title,
      },
      legend: {
        display: true,
        position: 'bottom',
      },
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      x: {
        display: true,
        title: {
          display: false,
        },
      },
      y: {
        display: true,
        title: {
          display: false,
        },
        beginAtZero: true,
      },
    },
    ...options,
  }

  return (
    <Card className={cn("w-full", className)}>
      {(title || subtitle) && (
        <CardHeader className="pb-4">
          {title && <CardTitle className="text-lg">{title}</CardTitle>}
          {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
        </CardHeader>
      )}
      <CardContent>
        <div style={{ height, position: 'relative' }}>
          <ChartRenderer
            type={type}
            data={data}
            options={defaultOptions}
          />
        </div>
      </CardContent>
    </Card>
  )
}

// Chart Renderer Component
function ChartRenderer({ type, data, options }: {
  type: ChartType
  data: ChartData
  options: ChartOptions
}) {
  const chartRef = React.useRef<HTMLCanvasElement>(null)
  const chartInstance = React.useRef<any>(null)

  React.useEffect(() => {
    if (!chartRef.current) return

    // Destroy existing chart
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    // Import Chart.js dynamically
    const initChart = async () => {
      try {
        const { Chart, registerables } = await import('chart.js')
        Chart.register(...registerables)

        const ctx = chartRef.current!.getContext('2d')
        if (!ctx) return

        // Prepare chart configuration
        const chartConfig = {
          type: type === 'doughnut' ? 'doughnut' : type,
          data: {
            labels: data.labels,
            datasets: data.datasets.map(dataset => ({
              ...dataset,
              backgroundColor: dataset.backgroundColor || getDefaultColors(type, data.labels.length),
              borderColor: dataset.borderColor || getDefaultBorderColors(type, data.labels.length),
            }))
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: options.plugins?.legend?.display !== false,
                position: options.plugins?.legend?.position || 'bottom',
              },
              tooltip: {
                enabled: options.plugins?.tooltip?.enabled !== false,
              },
              title: {
                display: options.plugins?.title?.display !== false,
                text: options.plugins?.title?.text || '',
              }
            },
            scales: type !== 'pie' && type !== 'doughnut' ? {
              x: {
                display: options.scales?.x?.display !== false,
                title: {
                  display: options.scales?.x?.title?.display || false,
                  text: options.scales?.x?.title?.text || '',
                }
              },
              y: {
                display: options.scales?.y?.display !== false,
                title: {
                  display: options.scales?.y?.title?.display || false,
                  text: options.scales?.y?.title?.text || '',
                },
                beginAtZero: options.scales?.y?.beginAtZero !== false,
              }
            } : undefined,
          }
        }

        chartInstance.current = new Chart(ctx, chartConfig)
      } catch (error) {
        console.error('Chart initialization error:', error)
        // Fallback to placeholder
        chartRef.current!.style.display = 'none'
        const fallbackDiv = document.createElement('div')
        fallbackDiv.className = 'w-full h-full flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-200'
        fallbackDiv.innerHTML = `
          <div class="text-center">
            <div class="text-2xl font-bold text-gray-400 mb-2">${type.toUpperCase()} Chart</div>
            <p class="text-gray-500 text-sm">Chart library failed to load</p>
            <p class="text-gray-400 text-xs mt-1">${data.labels.length} labels, ${data.datasets.length} datasets</p>
          </div>
        `
        chartRef.current!.parentNode?.appendChild(fallbackDiv)
      }
    }

    initChart()

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [type, data, options])

  return <canvas ref={chartRef} className="w-full h-full" />
}

// Helper functions for default colors
function getDefaultColors(type: ChartType, count: number): string[] {
  if (type === 'pie' || type === 'doughnut') {
    return Array.from({ length: count }, (_, i) => 
      `hsl(${(i * 137.5) % 360}, 70%, 60%)`
    )
  }
  return ['rgba(59, 130, 246, 0.8)']
}

function getDefaultBorderColors(type: ChartType, count: number): string[] {
  if (type === 'pie' || type === 'doughnut') {
    return Array.from({ length: count }, (_, i) => 
      `hsl(${(i * 137.5) % 360}, 70%, 50%)`
    )
  }
  return ['rgba(59, 130, 246, 1)']
}

// Specific Chart Components
export function LineChart({
  data,
  options,
  height,
  className,
  title,
  subtitle,
}: Omit<BaseChartProps, 'type'>) {
  return (
    <BaseChart
      type="line"
      data={data}
      options={options}
      height={height}
      className={className}
      title={title}
      subtitle={subtitle}
    />
  )
}

export function BarChart({
  data,
  options,
  height,
  className,
  title,
  subtitle,
}: Omit<BaseChartProps, 'type'>) {
  return (
    <BaseChart
      type="bar"
      data={data}
      options={options}
      height={height}
      className={className}
      title={title}
      subtitle={subtitle}
    />
  )
}

export function PieChart({
  data,
  options,
  height,
  className,
  title,
  subtitle,
}: Omit<BaseChartProps, 'type'>) {
  return (
    <BaseChart
      type="pie"
      data={data}
      options={options}
      height={height}
      className={className}
      title={title}
      subtitle={subtitle}
    />
  )
}

export function DoughnutChart({
  data,
  options,
  height,
  className,
  title,
  subtitle,
}: Omit<BaseChartProps, 'type'>) {
  return (
    <BaseChart
      type="doughnut"
      data={data}
      options={options}
      height={height}
      className={className}
      title={title}
      subtitle={subtitle}
    />
  )
}

export function AreaChart({
  data,
  options,
  height,
  className,
  title,
  subtitle,
}: Omit<BaseChartProps, 'type'>) {
  return (
    <BaseChart
      type="area"
      data={data}
      options={options}
      height={height}
      className={className}
      title={title}
      subtitle={subtitle}
    />
  )
}

// Metric Cards
export interface MetricCardProps {
  title: string
  value: string | number
  change?: {
    value: number
    type: 'increase' | 'decrease' | 'neutral'
  }
  icon?: React.ReactNode
  className?: string
}

export function MetricCard({
  title,
  value,
  change,
  icon,
  className,
}: MetricCardProps) {
  const getChangeColor = () => {
    if (!change) return ''
    
    switch (change.type) {
      case 'increase':
        return 'text-green-600'
      case 'decrease':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  const getChangeIcon = () => {
    if (!change) return null
    
    switch (change.type) {
      case 'increase':
        return '↗'
      case 'decrease':
        return '↘'
      default:
        return '→'
    }
  }

  return (
    <Card className={cn("w-full", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {icon && (
              <div className="p-2 bg-blue-100 rounded-lg">
                {icon}
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-gray-600">{title}</p>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              {change && (
                <div className={cn("flex items-center text-sm", getChangeColor())}>
                  <span className="mr-1">{getChangeIcon()}</span>
                  <span>{change.value}%</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Progress Chart
export interface ProgressChartProps {
  data: ChartDataPoint[]
  title?: string
  subtitle?: string
  className?: string
  showValues?: boolean
  showPercentages?: boolean
}

export function ProgressChart({
  data,
  title,
  subtitle,
  className,
  showValues = true,
  showPercentages = true,
}: ProgressChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0)

  return (
    <Card className={cn("w-full", className)}>
      {(title || subtitle) && (
        <CardHeader className="pb-4">
          {title && <CardTitle className="text-lg">{title}</CardTitle>}
          {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
        </CardHeader>
      )}
      <CardContent className="space-y-4">
        {data.map((item, index) => {
          const percentage = total > 0 ? (item.value / total) * 100 : 0
          
          return (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-gray-700">{item.label}</span>
                <div className="flex items-center space-x-2">
                  {showValues && <span className="text-gray-600">{item.value}</span>}
                  {showPercentages && (
                    <span className="text-gray-500">({percentage.toFixed(1)}%)</span>
                  )}
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: item.color || '#3B82F6',
                  }}
                />
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}

// Sparkline Chart
export interface SparklineChartProps {
  data: number[]
  title?: string
  className?: string
  height?: number
  color?: string
  showValue?: boolean
}

export function SparklineChart({
  data,
  title,
  className,
  height = 60,
  color = '#3B82F6',
  showValue = true,
}: SparklineChartProps) {
  if (data.length < 2) {
    return (
      <Card className={cn("w-full", className)}>
        <CardContent className="p-4">
          <div className="text-center text-gray-500">
            Insufficient data for sparkline
          </div>
        </CardContent>
      </Card>
    )
  }

  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min
  
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 100
    const y = range > 0 ? 100 - ((value - min) / range) * 100 : 50
    return `${x},${y}`
  }).join(' ')

  const currentValue = data[data.length - 1]
  const previousValue = data[data.length - 2]
  const change = previousValue !== 0 ? ((currentValue - previousValue) / previousValue) * 100 : 0

  return (
    <Card className={cn("w-full", className)}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            {title && <p className="text-sm font-medium text-gray-600">{title}</p>}
            {showValue && (
              <p className="text-lg font-bold text-gray-900">{currentValue}</p>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <div
              className="text-sm"
              style={{ color: change >= 0 ? '#10B981' : '#EF4444' }}
            >
              {change >= 0 ? '↗' : '↘'} {Math.abs(change).toFixed(1)}%
            </div>
            <svg
              width="100"
              height={height}
              viewBox="0 0 100 100"
              className="flex-shrink-0"
            >
              <polyline
                fill="none"
                stroke={color}
                strokeWidth="2"
                points={points}
              />
            </svg>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Utility functions for chart data preparation
export function prepareChartData(
  data: any[],
  labelKey: string,
  valueKey: string,
  groupBy?: string
): ChartData {
  if (groupBy) {
    const grouped = data.reduce((acc, item) => {
      const group = item[groupBy] || 'Unknown'
      if (!acc[group]) {
        acc[group] = []
      }
      acc[group].push(item)
      return acc
    }, {} as Record<string, any[]>)

    const labels = Object.keys(grouped)
    const datasets = [{
      label: 'Data',
      data: labels.map(label => 
        grouped[label].reduce((sum, item) => sum + (item[valueKey] || 0), 0)
      ),
      backgroundColor: labels.map((_, i) => `hsl(${(i * 137.5) % 360}, 70%, 50%)`),
    }]

    return { labels, datasets }
  } else {
    const labels = data.map(item => item[labelKey] || 'Unknown')
    const values = data.map(item => item[valueKey] || 0)
    
    return {
      labels,
      datasets: [{
        label: 'Data',
        data: values,
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      }],
    }
  }
}

export function prepareTimeSeriesData(
  data: any[],
  dateKey: string,
  valueKey: string,
  groupBy?: string
): ChartData {
  // Sort by date
  const sortedData = [...data].sort((a, b) => 
    new Date(a[dateKey]).getTime() - new Date(b[dateKey]).getTime()
  )

  if (groupBy) {
    const grouped = sortedData.reduce((acc, item) => {
      const group = item[groupBy] || 'Unknown'
      if (!acc[group]) {
        acc[group] = []
      }
      acc[group].push(item)
      return acc
    }, {} as Record<string, any[]>)

    const labels = sortedData.map(item => 
      new Date(item[dateKey]).toLocaleDateString()
    )
    
    const datasets = Object.keys(grouped).map((group, index) => ({
      label: group,
      data: labels.map(label => {
        const date = new Date(label).toISOString().split('T')[0]
        const item = grouped[group].find(g => 
          new Date(g[dateKey]).toISOString().split('T')[0] === date
        )
        return item ? item[valueKey] || 0 : 0
      }),
      borderColor: `hsl(${(index * 137.5) % 360}, 70%, 50%)`,
      backgroundColor: `hsla(${(index * 137.5) % 360}, 70%, 50%, 0.1)`,
      fill: true,
    }))

    return { labels, datasets }
  } else {
    const labels = sortedData.map(item => 
      new Date(item[dateKey]).toLocaleDateString()
    )
    const values = sortedData.map(item => item[valueKey] || 0)
    
    return {
      labels,
      datasets: [{
        label: 'Data',
        data: values,
        borderColor: 'rgba(59, 130, 246, 1)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
      }],
    }
  }
}
