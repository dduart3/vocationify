// PhaseTransitionButton component  
// Responsibility: Handle phase transitions with appropriate button text and actions

import { ArrowRight, CheckCircle, Target } from 'lucide-react'

type Phase = 'exploration' | 'career_matching' | 'reality_check' | 'complete'

interface PhaseTransitionButtonProps {
  currentPhase: Phase
  onTransition: () => void
  isLoading?: boolean
  disabled?: boolean
  isRealityCheckReady?: boolean
}

export function PhaseTransitionButton({
  currentPhase,
  onTransition,
  isLoading = false,
  disabled = false,
  isRealityCheckReady = false,
}: PhaseTransitionButtonProps) {
  const getButtonConfig = (phase: Phase) => {
    const defaultBgColor = 'bg-gradient-to-b from-blue-500 to-blue-600 border border-blue-400/50 shadow-[inset_0_2px_4px_rgba(255,255,255,0.4),0_4px_8px_rgba(37,99,235,0.4)]'
    switch (phase) {
      case 'career_matching':
        return {
          text: 'Continuar a Reality Check',
          icon: <Target className="w-5 h-5 flex-shrink-0" />,
          bgColor: defaultBgColor,
          description: 'Evalúa qué tan preparado estás para estas carreras',
          isPill: true
        }

      case 'reality_check':
        return {
          text: 'Completar Reality Check',
          icon: <CheckCircle className="w-5 h-5 flex-shrink-0" />,
          bgColor: defaultBgColor,
          description: 'Finaliza el reality check y obtén tus recomendaciones finales',
          isPill: true
        }

      case 'complete':
        return {
          text: 'Ver Resultados Finales',
          icon: <ArrowRight className="w-5 h-5 flex-shrink-0" />,
          bgColor: defaultBgColor,
          description: 'Revisa tu evaluación completa',
          isPill: true
        }

      default:
        return {
          text: 'Continuar',
          icon: <ArrowRight className="w-5 h-5 flex-shrink-0" />,
          bgColor: defaultBgColor,
          description: 'Siguiente paso',
          isPill: true
        }
    }
  }

  // Show button for career_matching, complete, and reality_check (when ready)
  const shouldShow = currentPhase === 'career_matching' ||
                    currentPhase === 'complete' ||
                    (currentPhase === 'reality_check' && isRealityCheckReady)

  if (!shouldShow) {
    return null
  }

  const config = getButtonConfig(currentPhase)

  return (
    <div className="text-center py-6 relative z-20">
      <div className="max-w-md mx-auto">
        <p className="text-slate-900 font-semibold text-sm mb-4">
          {config.description}
        </p>
        
        <button
          onClick={onTransition}
          disabled={disabled || isLoading}
          className={`
            relative overflow-hidden
            ${config.bgColor} 
            disabled:opacity-50 disabled:cursor-not-allowed
            text-white px-8 py-3.5 ${config.isPill ? 'rounded-full' : 'rounded-xl'} font-semibold 
            flex items-center gap-3 mx-auto
            transition-all duration-300 
            hover:scale-105 active:scale-95 hover:brightness-110
          `}
        >
          {config.isPill && !disabled && !isLoading && (
            <div className="absolute inset-0 -translate-x-[150%] animate-[glare-sweep_4s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent w-full pointer-events-none" />
          )}

          {isLoading ? (
            <>
              <div className="relative z-10 w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span className="relative z-10">Procesando...</span>
            </>
          ) : (
            <>
              {config.isPill && <div className="relative z-10">{config.icon}</div>}
              <span className="relative z-10 whitespace-nowrap">{config.text}</span>
              {!config.isPill && <div className="relative z-10">{config.icon}</div>}
            </>
          )}
        </button>

        {/* Phase indicator */}
        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-white/50">

          <div className={`w-2 h-2 rounded-full ${
            currentPhase === 'career_matching' ? 'bg-orange-400' : 'bg-white/30'
          }`} />

          <div className={`w-2 h-2 rounded-full ${
            currentPhase === 'complete' ? 'bg-green-400' : 'bg-white/30'
          }`} />
        </div>
      </div>
    </div>
  )
}