export function AudioWaveform({ color, intensity = 0 }: { color: string; intensity?: number }) {
  return (
    <div className="flex items-center justify-center gap-1">
      {Array.from({ length: 7 }).map((_, i) => {
        const baseHeight = 8 + i * 3
        const dynamicHeight = baseHeight + (intensity * 20)
        return (
          <div
            key={i}
            className="rounded-full animate-pulse transition-all duration-150"
            style={{
              width: '2px',
              height: `${dynamicHeight}px`,
              backgroundColor: color,
              animationDelay: `${i * 0.1}s`,
              animationDuration: `${0.8 + intensity}s`,
              opacity: 0.6 + intensity * 0.4,
              boxShadow: `0 0 ${intensity * 10}px ${color}`,
            }}
          />
        )
      })}
    </div>
  )
}

export function SpeechWaves() {
  return (
    <div className="flex items-center justify-center space-x-1">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
          style={{
            animationDelay: `${i * 0.2}s`,
            animationDuration: '1.4s',
          }}
        />
      ))}
    </div>
  )
}

export function ThinkingDots() {
  return (
    <div className="flex space-x-2">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="w-3 h-3 bg-purple-400 rounded-full animate-pulse"
          style={{
            animationDelay: `${i * 0.3}s`,
            animationDuration: '1.5s',
          }}
        />
      ))}
    </div>
  )
}