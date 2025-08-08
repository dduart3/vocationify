import React from 'react'

interface RiasecRadarChartProps {
  scores: {
    R: number
    I: number
    A: number
    S: number
    E: number
    C: number
  }
  size?: number
}

export function RiasecRadarChart({ scores, size = 300 }: RiasecRadarChartProps) {
  const center = size / 2
  const radius = (size - 80) / 2
  const labelOffset = 20

  // RIASEC labels in Spanish
  const labels = [
    { key: 'R', label: 'Realista', color: '#ef4444' },
    { key: 'I', label: 'Investigativo', color: '#3b82f6' },
    { key: 'A', label: 'Artístico', color: '#8b5cf6' },
    { key: 'S', label: 'Social', color: '#10b981' },
    { key: 'E', label: 'Emprendedor', color: '#f59e0b' },
    { key: 'C', label: 'Convencional', color: '#6b7280' }
  ]

  // Calculate points for the polygon
  const getPointPosition = (index: number, value: number) => {
    const angle = (index * 2 * Math.PI) / 6 - Math.PI / 2 // Start from top
    const distance = (value / 100) * radius
    return {
      x: center + Math.cos(angle) * distance,
      y: center + Math.sin(angle) * distance
    }
  }

  // Calculate label positions
  const getLabelPosition = (index: number) => {
    const angle = (index * 2 * Math.PI) / 6 - Math.PI / 2
    return {
      x: center + Math.cos(angle) * (radius + labelOffset),
      y: center + Math.sin(angle) * (radius + labelOffset)
    }
  }

  // Generate polygon points
  const polygonPoints = labels.map((label, index) => {
    const point = getPointPosition(index, scores[label.key as keyof typeof scores])
    return `${point.x},${point.y}`
  }).join(' ')

  // Generate grid circles (20%, 40%, 60%, 80%, 100%)
  const gridCircles = [20, 40, 60, 80, 100].map((percentage) => (
    <circle
      key={percentage}
      cx={center}
      cy={center}
      r={(percentage / 100) * radius}
      fill="none"
      stroke="#e2e8f0"
      strokeWidth="1"
      strokeDasharray={percentage === 100 ? "none" : "4,4"}
    />
  ))

  // Generate grid lines from center to each axis
  const gridLines = labels.map((_, index) => {
    const endPoint = getLabelPosition(index)
    return (
      <line
        key={index}
        x1={center}
        y1={center}
        x2={center + Math.cos((index * 2 * Math.PI) / 6 - Math.PI / 2) * radius}
        y2={center + Math.sin((index * 2 * Math.PI) / 6 - Math.PI / 2) * radius}
        stroke="#e2e8f0"
        strokeWidth="1"
      />
    )
  })

  return (
    <div className="flex flex-col items-center space-y-4">
      <svg width={size} height={size} className="overflow-visible">
        {/* Grid circles */}
        {gridCircles}
        
        {/* Grid lines */}
        {gridLines}
        
        {/* Main polygon */}
        <polygon
          points={polygonPoints}
          fill="rgba(59, 130, 246, 0.15)"
          stroke="#3b82f6"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        
        {/* Data points */}
        {labels.map((label, index) => {
          const point = getPointPosition(index, scores[label.key as keyof typeof scores])
          return (
            <circle
              key={label.key}
              cx={point.x}
              cy={point.y}
              r="4"
              fill={label.color}
              stroke="white"
              strokeWidth="2"
            />
          )
        })}
        
        {/* Axis labels */}
        {labels.map((label, index) => {
          const labelPos = getLabelPosition(index)
          const score = scores[label.key as keyof typeof scores]
          
          return (
            <g key={label.key}>
              <circle
                cx={labelPos.x}
                cy={labelPos.y - 8}
                r="12"
                fill={label.color}
                fillOpacity="0.1"
                stroke={label.color}
                strokeWidth="1"
              />
              <text
                x={labelPos.x}
                y={labelPos.y - 4}
                textAnchor="middle"
                className="text-xs font-semibold fill-slate-700"
              >
                {label.key}
              </text>
              <text
                x={labelPos.x}
                y={labelPos.y + 20}
                textAnchor="middle"
                className="text-xs font-medium fill-slate-600"
              >
                {label.label}
              </text>
              <text
                x={labelPos.x}
                y={labelPos.y + 32}
                textAnchor="middle"
                className="text-xs font-bold"
                fill={label.color}
              >
                {score}%
              </text>
            </g>
          )
        })}
        
        {/* Center point */}
        <circle
          cx={center}
          cy={center}
          r="3"
          fill="#1f2937"
        />
      </svg>
      
      {/* Legend */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
        {labels.map((label) => (
          <div key={label.key} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: label.color }}
            />
            <span className="text-slate-700 font-medium">
              {label.key} - {label.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}