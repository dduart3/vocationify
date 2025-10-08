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
    <div className="flex flex-col items-center space-y-4">
      <svg width={size} height={size} className="overflow-visible">
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
            <circle
              key={label.key}
              cx={point.x}
              cy={point.y}
              r="5"
              fill={label.color}
              stroke="white"
              strokeWidth="3"
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
                r="14"
                fill={label.bgColor}
                stroke={label.color}
                strokeWidth="2"
              />
              <text
                x={labelPos.x}
                y={labelPos.y - 4}
                textAnchor="middle"
                className="text-xs font-bold"
                fill={label.color}
              >
                {label.key}
              </text>
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
      <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
        {labels.map((label) => (
          <div key={label.key} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full border-2"
              style={{ backgroundColor: label.color, borderColor: label.color }}
            />
            <span className="text-gray-700 font-bold">
              {label.key} - {label.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}