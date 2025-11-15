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
    switch (phase) {
      case 'career_matching':
        return {
          text: 'Continuar a Reality Check',
          icon: <Target className="w-5 h-5" />,
          bgColor: 'bg-orange-600 hover:bg-orange-700',
          description: 'Evalúa qué tan preparado estás para estas carreras'
        }

      case 'reality_check':
        return {
          text: 'Completar Reality Check',
          icon: <CheckCircle className="w-5 h-5" />,
          bgColor: 'bg-green-600 hover:bg-green-700',
          description: 'Finaliza el reality check y obtén tus recomendaciones finales'
        }

      case 'complete':
        return {
          text: 'Ver Resultados Finales',
          icon: <ArrowRight className="w-5 h-5" />,
          bgColor: 'bg-blue-600 hover:bg-blue-700',
          description: 'Revisa tu evaluación completa'
        }

      default:
        return {
          text: 'Continuar',
          icon: <ArrowRight className="w-5 h-5" />,
          bgColor: 'bg-blue-600 hover:bg-blue-700',
          description: 'Siguiente paso'
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
    <div className="text-center py-6">
      <div className="max-w-md mx-auto">
        <p className="text-white/70 text-sm mb-4">
          {config.description}
        </p>
        
        <button
          onClick={onTransition}
          disabled={disabled || isLoading}
          className={`
            ${config.bgColor} 
            disabled:opacity-50 disabled:cursor-not-allowed
            text-white px-8 py-4 rounded-xl font-semibold 
            flex items-center gap-3 mx-auto
            transition-all duration-200 
            hover:scale-105 active:scale-95
            shadow-lg hover:shadow-xl
          `}
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Procesando...
            </>
          ) : (
            <>
              {config.text}
              {config.icon}
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