import { CheckCircle, Circle, Clock, Sparkles } from 'lucide-react'
import type { ConversationResponse } from '../../types'

interface EnhancedProgressIndicatorProps {
  currentPhase?: string
  currentResponse?: ConversationResponse | null
  conversationHistory?: Array<{ role: string; content: string }>
}

interface PhaseInfo {
  key: string
  name: string
  shortDescription: string
  icon: any
  estimatedQuestions?: number
  color: {
    active: string
    completed: string
    inactive: string
    background: string
  }
}

const phases: PhaseInfo[] = [
  {
    key: 'enhanced_exploration',
    name: 'Exploración Profunda',
    shortDescription: '12-15 preguntas estratégicas',
    icon: Sparkles,
    estimatedQuestions: 15,
    color: {
      active: 'text-white ring-2 ring-blue-400/60 bg-blue-500/30 shadow-lg shadow-blue-500/25',
      completed: 'text-white ring-2 ring-green-400/60 bg-green-500/30 shadow-lg shadow-green-500/25',
      inactive: 'text-slate-300 ring-1 ring-white/20 bg-white/5',
      background: 'bg-blue-500/5'
    }
  },
  {
    key: 'career_matching',
    name: 'Análisis de Carreras',
    shortDescription: 'Top 3 compatibilidades',
    icon: CheckCircle,
    color: {
      active: 'text-white ring-2 ring-purple-400/60 bg-purple-500/30 shadow-lg shadow-purple-500/25',
      completed: 'text-white ring-2 ring-green-400/60 bg-green-500/30 shadow-lg shadow-green-500/25',
      inactive: 'text-slate-300 ring-1 ring-white/20 bg-white/5',
      background: 'bg-purple-500/5'
    }
  },
  {
    key: 'reality_check',
    name: 'Reality Check',
    shortDescription: 'Preguntas discriminatorias',
    icon: Clock,
    estimatedQuestions: 9,
    color: {
      active: 'text-white ring-2 ring-orange-400/60 bg-orange-500/30 shadow-lg shadow-orange-500/25',
      completed: 'text-white ring-2 ring-green-400/60 bg-green-500/30 shadow-lg shadow-green-500/25',
      inactive: 'text-slate-300 ring-1 ring-white/20 bg-white/5',
      background: 'bg-orange-500/5'
    }
  },
  {
    key: 'final_results',
    name: 'Resultados Finales',
    shortDescription: 'Perfil completo + recomendaciones',
    icon: CheckCircle,
    color: {
      active: 'text-white ring-2 ring-green-400/60 bg-green-500/30 shadow-lg shadow-green-500/25',
      completed: 'text-white ring-2 ring-green-400/60 bg-green-500/30 shadow-lg shadow-green-500/25',
      inactive: 'text-slate-300 ring-1 ring-white/20 bg-white/5',
      background: 'bg-green-500/5'
    }
  }
]

export function EnhancedProgressIndicator({ 
  currentPhase, 
  currentResponse,
  conversationHistory = []
}: EnhancedProgressIndicatorProps) {
  // Normalize phase names to match our expected keys
  const normalizePhase = (phase?: string): string => {
    if (!phase) return 'enhanced_exploration'
    
    // Map various possible phase names to our standardized keys
    const phaseMap: Record<string, string> = {
      'greeting': 'enhanced_exploration',
      'saludo': 'enhanced_exploration',
      'exploration': 'enhanced_exploration',
      'enhanced_exploration': 'enhanced_exploration',
      'career_matching': 'career_matching',
      'reality_check': 'reality_check',
      'final_results': 'final_results',
      'complete': 'final_results'
    }
    
    return phaseMap[phase.toLowerCase()] || 'enhanced_exploration'
  }
  
  const normalizedPhase = normalizePhase(currentPhase)
  
  // Calculate progress based on conversation history
  const userMessages = conversationHistory.filter(msg => msg.role === 'user').length
  
  const getPhaseStatus = (phaseKey: string) => {
    if (!normalizedPhase) return 'inactive'
    
    const currentPhaseIndex = phases.findIndex(p => p.key === normalizedPhase)
    const phaseIndex = phases.findIndex(p => p.key === phaseKey)
    
    if (phaseIndex < currentPhaseIndex) return 'completed'
    if (phaseIndex === currentPhaseIndex) return 'active'
    return 'inactive'
  }
  
  const getPhaseProgress = (phaseKey: string): number => {
    if (!currentPhase) return 0
    
    const status = getPhaseStatus(phaseKey)
    if (status === 'completed') return 100
    if (status === 'inactive') return 0
    
    // Calculate progress for active phase
    if (phaseKey === 'enhanced_exploration') {
      // Progress based on user messages (up to 15 questions)
      const progress = Math.min((userMessages / 15) * 100, 100)
      return progress
    } else if (phaseKey === 'reality_check') {
      // Estimate progress based on conversation context
      // This is a rough estimate since reality check is dynamic
      const realityCheckMessages = userMessages > 15 ? userMessages - 15 : 0
      const progress = Math.min((realityCheckMessages / 9) * 100, 100)
      return progress
    }
    
    return 50 // Default active progress
  }
  
  const getCurrentPhaseEstimate = () => {
    if (!currentPhase) return null
    
    const phase = phases.find(p => p.key === currentPhase)
    if (!phase) return null
    
    const progress = getPhaseProgress(currentPhase)
    const status = getPhaseStatus(currentPhase)
    
    if (status !== 'active') return null
    
    if (currentPhase === 'enhanced_exploration') {
      const answered = Math.floor((progress / 100) * 15)
      return `${answered}/15 preguntas respondidas`
    } else if (currentPhase === 'reality_check') {
      return 'Evaluando compatibilidad real'
    } else if (currentPhase === 'career_matching') {
      return 'Analizando tu perfil...'
    } else if (currentPhase === 'final_results') {
      return 'Compilando resultados...'
    }
    
    return null
  }

  // Don't show progress indicator during initial greeting or if no phase is set
  // But DO show it once the test has actually started (when we have conversation history)
  const hasStartedTest = conversationHistory.length > 0
  
  if (!currentPhase || (currentPhase === 'greeting' && !hasStartedTest)) {
    return null
  }


  return (
    <div 
      className="w-full max-w-4xl mx-auto p-4 rounded-2xl border"
      style={{
        background: `
          linear-gradient(135deg, 
            rgba(255, 255, 255, 0.08) 0%, 
            rgba(255, 255, 255, 0.03) 100%
          )
        `,
        backdropFilter: 'blur(20px)',
        borderColor: 'rgba(255, 255, 255, 0.1)',
      }}
    >
      {/* Phase Progress Steps */}
      <div className="flex items-center justify-between mb-4">
        {phases.map((phase, index) => {
          const status = getPhaseStatus(phase.key)
          const progress = getPhaseProgress(phase.key)
          const IconComponent = phase.icon
          
          return (
            <div key={phase.key} className="flex items-center flex-1">
              {/* Phase Circle */}
              <div className="relative flex flex-col items-center">
                <div 
                  className={`
                    relative w-12 h-12 rounded-full flex items-center justify-center
                    transition-all duration-300 backdrop-blur-sm
                    ${status === 'active' ? phase.color.active : 
                      status === 'completed' ? phase.color.completed : 
                      phase.color.inactive}
                  `}
                >
                  <IconComponent className="w-5 h-5" />
                  
                  {/* Progress Ring for Active Phase */}
                  {status === 'active' && progress > 0 && (
                    <div 
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: `conic-gradient(from 0deg, 
                          currentColor ${progress * 3.6}deg, 
                          transparent ${progress * 3.6}deg)`
                      }}
                    />
                  )}
                </div>
                
                {/* Phase Label */}
                <div className="mt-2 text-center">
                  <p className={`text-xs font-semibold ${
                    status === 'active' ? 'text-white' : 
                    status === 'completed' ? 'text-white' : 
                    'text-slate-300'
                  }`}>
                    {phase.name}
                  </p>
                  <p className={`text-xs mt-1 ${
                    status === 'active' ? 'text-white/90' : 
                    status === 'completed' ? 'text-white/90' : 
                    'text-slate-400'
                  }`}>
                    {phase.shortDescription}
                  </p>
                </div>
              </div>
              
              {/* Connection Line */}
              {index < phases.length - 1 && (
                <div 
                  className={`
                    flex-1 h-0.5 mx-4 transition-colors duration-300
                    ${status === 'completed' ? 'bg-green-500/50' : 'bg-slate-600/30'}
                  `}
                />
              )}
            </div>
          )
        })}
      </div>
      
      {/* Current Phase Status */}
      {getCurrentPhaseEstimate() && (
        <div className="text-center">
          <p className="text-white/80 text-sm">
            {getCurrentPhaseEstimate()}
          </p>
          {currentPhase === 'enhanced_exploration' && (
            <div className="mt-2 w-full bg-slate-700/50 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${getPhaseProgress('enhanced_exploration')}%` }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}