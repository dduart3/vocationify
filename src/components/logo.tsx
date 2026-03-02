// Logo SVG Component
export function Logo({
  size = 32,
  className = '',
  variant = 'dark',
}: {
  size?: number
  className?: string
  /** 'light' for transparent/light backgrounds (dark strokes), 'dark' for dark backgrounds (white strokes) */
  variant?: 'light' | 'dark'
}) {
  const isLight = variant === 'light'
  const strokeColor = isLight ? '#1e3a5f' : 'white'
  const capFill = isLight ? 'rgba(30, 58, 95, 0.9)' : 'rgba(255,255,255,0.8)'
  const tasselFill = isLight ? 'rgba(234, 179, 8, 0.95)' : 'rgba(234, 179, 8, 0.9)'
  const circleStroke = isLight ? 'rgba(59, 130, 246, 0.4)' : 'rgba(255,255,255,0.2)'

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background Circle */}
      <circle
        cx="16"
        cy="16"
        r="15"
        fill="url(#gradient1)"
        stroke={circleStroke}
        strokeWidth="1"
      />

      {/* Main V Shape */}
      <path
        d="M8 10 L16 22 L24 10"
        stroke={strokeColor}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Academic Cap Detail */}
      <path d="M12 8 L16 6 L20 8 L16 10 Z" fill={capFill} />

      {/* Graduation Tassel */}
      <circle cx="21" cy="9" r="1.5" fill={tasselFill} />
      
      {/* Gradient Definitions */}
      <defs>
        <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgb(59, 130, 246)" />
          <stop offset="50%" stopColor="rgb(147, 51, 234)" />
          <stop offset="100%" stopColor="rgb(79, 70, 229)" />
        </linearGradient>
      </defs>
    </svg>
  );
}
