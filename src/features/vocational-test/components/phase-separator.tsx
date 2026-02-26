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
    <div className="flex justify-center py-6 px-4">
      <div className="inline-flex items-center gap-3 md:gap-4 px-5 py-2.5 rounded-full bg-slate-100/80 backdrop-blur-md border border-white/80 shadow-[inset_0_1px_1px_rgba(255,255,255,1),0_4px_15px_rgba(0,0,0,0.03)] transition-all duration-300">
        <div className="flex items-center gap-2 text-slate-500">
          <FromIcon className="w-4 h-4" />
          <span className="font-medium text-[13px] tracking-wide">{fromInfo.label}</span>
        </div>

        <ArrowRight className="w-3.5 h-3.5 text-slate-400" />

        <div className="flex items-center gap-2 text-slate-800">
          <ToIcon className="w-4 h-4" />
          <span className="font-semibold text-[13px] tracking-wide">{toInfo.label}</span>
        </div>

        {timestamp && (
          <>
            <div className="w-px h-3.5 bg-slate-300 mx-1" />
            <span className="text-slate-500 text-[12px] font-medium tracking-wide">
              {new Date(timestamp).toLocaleTimeString('es-ES', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </>
        )}
      </div>
    </div>
  )
}