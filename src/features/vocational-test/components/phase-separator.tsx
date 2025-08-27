// Phase separator component for showing phase transitions in chat
import { ArrowRight, Search, Target, CheckCircle, Trophy } from 'lucide-react'

interface PhaseSeparatorProps {
  fromPhase: string
  toPhase: string
  timestamp?: string
}

const phaseLabels: Record<string, { label: string; IconComponent: any; color: string }> = {
  exploration: { label: 'Exploración', IconComponent: Search, color: 'blue' },
  career_matching: { label: 'Análisis', IconComponent: Target, color: 'purple' },
  reality_check: { label: 'Reality Check', IconComponent: CheckCircle, color: 'green' },
  complete: { label: 'Completado', IconComponent: Trophy, color: 'yellow' }
}

export function PhaseSeparator({ fromPhase, toPhase, timestamp }: PhaseSeparatorProps) {
  const fromInfo = phaseLabels[fromPhase] || { label: fromPhase, IconComponent: Search, color: 'gray' }
  const toInfo = phaseLabels[toPhase] || { label: toPhase, IconComponent: Search, color: 'gray' }

  const FromIcon = fromInfo.IconComponent
  const ToIcon = toInfo.IconComponent

  return (
    <div className="flex justify-center py-8 px-4">
      <div 
        className="backdrop-blur-sm rounded-2xl px-6 py-4"
        style={{
          background: `
            linear-gradient(135deg, 
              rgba(59, 130, 246, 0.08) 0%, 
              rgba(147, 51, 234, 0.06) 50%,
              rgba(99, 102, 241, 0.08) 100%
            )
          `,
          boxShadow: `
            0 4px 16px 0 rgba(0, 0, 0, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.05)
          `
        }}
      >
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2 text-white/70">
            <FromIcon className="w-4 h-4" />
            <span className="font-medium">{fromInfo.label}</span>
          </div>
          
          <ArrowRight className="w-4 h-4 text-white/40" />
          
          <div className="flex items-center gap-2 text-white">
            <ToIcon className="w-4 h-4" />
            <span className="font-semibold">{toInfo.label}</span>
          </div>
          
          {timestamp && (
            <>
              <div className="w-px h-4 bg-white/20 mx-2" />
              <span className="text-white/40 text-xs">
                {new Date(timestamp).toLocaleTimeString('es-ES', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  )
}