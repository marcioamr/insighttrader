'use client'

import { useEffect, useRef } from 'react'

interface Signal {
  id: string
  date: string
  type: 'buy' | 'sell'
  price: number
  reason: string
  timestamp: number
}

interface ChartDataPoint {
  date: string
  price: number
  timestamp: number
}

interface LightweightChartProps {
  data: ChartDataPoint[]
  signals: Signal[]
  width?: number
  height?: number
}

export function LightweightChart({ data, signals, width = 1000, height = 400 }: LightweightChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!canvasRef.current || !data.length) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size for high DPI displays
    const dpr = window.devicePixelRatio || 1
    canvas.width = width * dpr
    canvas.height = height * dpr
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`
    ctx.scale(dpr, dpr)

    // Clear canvas
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, width, height)

    // Chart dimensions
    const padding = { top: 20, right: 60, bottom: 40, left: 60 }
    const chartWidth = width - padding.left - padding.right
    const chartHeight = height - padding.top - padding.bottom

    // Calculate scales
    const minPrice = Math.min(...data.map(d => d.price))
    const maxPrice = Math.max(...data.map(d => d.price))
    const priceRange = maxPrice - minPrice || 1
    const minTime = data[0].timestamp
    const maxTime = data[data.length - 1].timestamp
    const timeRange = maxTime - minTime || 1

    // Helper functions
    const getX = (timestamp: number) => padding.left + (timestamp - minTime) / timeRange * chartWidth
    const getY = (price: number) => padding.top + (maxPrice - price) / priceRange * chartHeight

    // Draw grid
    ctx.strokeStyle = '#f0f0f0'
    ctx.lineWidth = 1
    
    // Horizontal grid lines
    for (let i = 0; i <= 5; i++) {
      const y = padding.top + (i / 5) * chartHeight
      ctx.beginPath()
      ctx.moveTo(padding.left, y)
      ctx.lineTo(padding.left + chartWidth, y)
      ctx.stroke()
    }

    // Vertical grid lines
    for (let i = 0; i <= 5; i++) {
      const x = padding.left + (i / 5) * chartWidth
      ctx.beginPath()
      ctx.moveTo(x, padding.top)
      ctx.lineTo(x, padding.top + chartHeight)
      ctx.stroke()
    }

    // Draw price line
    if (data.length > 1) {
      ctx.strokeStyle = '#2563eb'
      ctx.lineWidth = 2
      ctx.beginPath()
      
      data.forEach((point, index) => {
        const x = getX(point.timestamp)
        const y = getY(point.price)
        
        if (index === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      })
      
      ctx.stroke()

      // Add gradient fill under the line
      ctx.fillStyle = 'rgba(37, 99, 235, 0.1)'
      ctx.beginPath()
      ctx.moveTo(getX(data[0].timestamp), getY(data[0].price))
      
      data.forEach((point) => {
        ctx.lineTo(getX(point.timestamp), getY(point.price))
      })
      
      ctx.lineTo(getX(data[data.length - 1].timestamp), padding.top + chartHeight)
      ctx.lineTo(getX(data[0].timestamp), padding.top + chartHeight)
      ctx.closePath()
      ctx.fill()
    }

    // Draw signal markers
    signals.forEach(signal => {
      const dataPoint = data.find(d => d.date === signal.date)
      if (!dataPoint) return

      const x = getX(dataPoint.timestamp)
      const y = getY(dataPoint.price)
      const color = signal.type === 'buy' ? '#16a34a' : '#dc2626'

      // Draw circle
      ctx.fillStyle = color
      ctx.beginPath()
      ctx.arc(x, y, 6, 0, 2 * Math.PI)
      ctx.fill()

      // Draw white border
      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(x, y, 6, 0, 2 * Math.PI)
      ctx.stroke()

      // Draw arrow
      ctx.fillStyle = color
      ctx.font = 'bold 12px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(signal.type === 'buy' ? '▲' : '▼', x, y - 12)
    })

    // Draw Y-axis labels (prices)
    ctx.fillStyle = '#6b7280'
    ctx.font = '11px sans-serif'
    ctx.textAlign = 'right'
    
    for (let i = 0; i <= 5; i++) {
      const ratio = i / 5
      const price = minPrice + priceRange * (1 - ratio)
      const y = padding.top + ratio * chartHeight
      ctx.fillText(`R$ ${price.toFixed(2)}`, padding.left - 10, y + 4)
    }

    // Draw X-axis labels (dates)
    ctx.textAlign = 'center'
    for (let i = 0; i <= 5; i++) {
      const ratio = i / 5
      const timestamp = minTime + timeRange * ratio
      const x = padding.left + ratio * chartWidth
      const date = new Date(timestamp).toLocaleDateString('pt-BR', { 
        day: '2-digit', 
        month: '2-digit' 
      })
      ctx.fillText(date, x, height - 10)
    }

    // Draw current price line if data exists
    if (data.length > 0) {
      const lastPrice = data[data.length - 1].price
      const y = getY(lastPrice)
      
      ctx.strokeStyle = '#2563eb'
      ctx.lineWidth = 1
      ctx.setLineDash([5, 5])
      ctx.beginPath()
      ctx.moveTo(padding.left, y)
      ctx.lineTo(padding.left + chartWidth, y)
      ctx.stroke()
      ctx.setLineDash([])
      
      // Price label
      ctx.fillStyle = '#2563eb'
      ctx.fillRect(padding.left + chartWidth + 2, y - 10, 58, 20)
      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 11px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(`R$ ${lastPrice.toFixed(2)}`, padding.left + chartWidth + 31, y + 4)
    }

  }, [data, signals, width, height])

  if (!data.length) {
    return (
      <div 
        className="flex items-center justify-center border rounded bg-gray-50" 
        style={{ width, height }}
      >
        <p className="text-gray-500">Nenhum dado para exibir</p>
      </div>
    )
  }

  return (
    <div ref={containerRef} className="relative">
      <canvas
        ref={canvasRef}
        className="border rounded bg-white cursor-crosshair"
        style={{ width, height }}
      />
      
      {/* Crosshair and tooltip can be added here for interactivity */}
      <div className="absolute top-2 left-2 bg-white/90 backdrop-blur rounded px-2 py-1 text-xs border">
        <div className="font-medium text-blue-600">
          Preços {data.length > 0 && `(${data.length} pontos)`}
        </div>
        {signals.length > 0 && (
          <div className="text-gray-600">
            {signals.length} sinais detectados
          </div>
        )}
      </div>
    </div>
  )
}