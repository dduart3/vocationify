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
  const padding = 120 // Increased padding so badges and text don't get cut off
  const radius = (size - padding) / 2
  const labelOffset = 26

  // RIASEC labels in Spanish with darker colors
  const labels = [
    { key: 'R', label: 'Realista', color: '#dc2626', bgColor: '#fef2f2' },
    { key: 'I', label: 'Investigativo', color: '#2563eb', bgColor: '#eff6ff' },
    { key: 'A', label: 'Artístico', color: '#7c3aed', bgColor: '#faf5ff' },
    { key: 'S', label: 'Social', color: '#059669', bgColor: '#f0fdf4' },
    { key: 'E', label: 'Emprendedor', color: '#d97706', bgColor: '#fffbeb' },
    { key: 'C', label: 'Convencional', color: '#64748b', bgColor: '#f8fafc' }
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
      stroke="#d1d5db"
      strokeWidth="1.5"
      strokeDasharray={percentage === 100 ? "none" : "4,4"}
    />
  ))

  // Generate grid lines from center to each axis
  const gridLines = labels.map((_, index) => {
    return (
      <line
        key={index}
        x1={center}
        y1={center}
        x2={center + Math.cos((index * 2 * Math.PI) / 6 - Math.PI / 2) * radius}
        y2={center + Math.sin((index * 2 * Math.PI) / 6 - Math.PI / 2) * radius}
        stroke="#d1d5db"
        strokeWidth="1.5"
      />
    )
  })

  return (
    <div className="flex flex-col items-center w-full">
      <svg 
        viewBox={`0 0 ${size} ${size}`} 
        className="w-full h-full max-w-[350px] overflow-visible drop-shadow-sm"
      >
        {/* Grid circles */}
        {gridCircles}
        
        {/* Grid lines */}
        {gridLines}
        
        {/* Main polygon */}
        <polygon
          points={polygonPoints}
          fill="rgba(59, 130, 246, 0.2)"
          stroke="#2563eb"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        
        {/* Data points */}
        {labels.map((label, index) => {
          const point = getPointPosition(index, scores[label.key as keyof typeof scores])
          return (
            <foreignObject
              key={`dot-${label.key}`}
              x={point.x - 7}
              y={point.y - 7}
              width="14"
              height="14"
              className="overflow-visible"
            >
              <div
                className="w-3.5 h-3.5 rounded-full"
                style={{
                  backgroundColor: label.color,
                  border: '1.5px solid white',
                  boxShadow: `inset 0 1.5px 2px rgba(255,255,255,0.7), inset 0 -1px 2px rgba(0,0,0,0.15), 0 3px 6px ${label.color}60, 0 1px 3px rgba(0,0,0,0.2)`
                }}
              />
            </foreignObject>
          )
        })}
        
        {/* Axis labels */}
        {labels.map((label, index) => {
          const labelPos = getLabelPosition(index)
          const score = scores[label.key as keyof typeof scores]

          return (
            <g key={label.key}>
              <foreignObject
                x={labelPos.x - 18}
                y={labelPos.y - 26}
                width="36"
                height="36"
                className="overflow-visible"
              >
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-[14px]"
                  style={{
                    background: `linear-gradient(to bottom, #ffffff, ${label.bgColor})`,
                    borderColor: label.color,
                    borderWidth: '1.5px',
                    color: label.color,
                    boxShadow: `inset 0 2px 5px rgba(255,255,255,0.9), 0 3px 8px ${label.color}30, 0 1px 3px ${label.color}20`,
                  }}
                >
                  {label.key}
                </div>
              </foreignObject>
              <text
                x={labelPos.x}
                y={labelPos.y + 20}
                textAnchor="middle"
                className="text-xs font-bold fill-gray-700"
              >
                {label.label}
              </text>
              <text
                x={labelPos.x}
                y={labelPos.y + 32}
                textAnchor="middle"
                className="text-sm font-bold"
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
          r="4"
          fill="#4b5563"
        />
      </svg>
      
      {/* Legend */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm mt-8">
        {labels.map((label) => (
          <div key={label.key} className="flex items-center gap-2.5">
            <div
              className="w-3.5 h-3.5 rounded-full"
              style={{ 
                backgroundColor: label.color,
                border: '1.5px solid white',
                boxShadow: `inset 0 1px 2px rgba(255,255,255,0.7), 0 2px 4px ${label.color}60`
              }}
            />
            <span className="text-gray-700 font-bold text-[13px]">
              {label.key} - {label.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}