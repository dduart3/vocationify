import { useState } from 'react'
import { IconPlayerPlay, IconMicrophone, IconVolume, IconTarget, IconTrophy, IconArrowRight } from '@tabler/icons-react'
import { ConversationalVoiceBubble } from './conversational'
import { CareerRecommendationsDisplay } from './conversational/career-recommendations-display'
import { useConversationalResults } from '../hooks/use-conversational-session'
import { useNavigate } from '@tanstack/react-router'

type TestState = 'idle' | 'conversational' | 'completed'

interface VoiceTestControllerProps {
  onTestComplete?: (sessionId: string) => void
}

export function VoiceTestController({ onTestComplete }: VoiceTestControllerProps) {
  const [testState, setTestState] = useState<TestState>('idle')
  const [completedSessionId, setCompletedSessionId] = useState<string | null>(null)
  const navigate = useNavigate()
  
  // Get results for completed session
  const { data: results } = useConversationalResults(completedSessionId || '', !!completedSessionId && testState === 'completed')

  const handleStartConversation = () => {
    setTestState('conversational')
  }

  const handleTestComplete = (sessionId: string) => {
    setCompletedSessionId(sessionId)
    setTestState('completed')
    onTestComplete?.(sessionId)
  }

  const handleViewFullResults = () => {
    if (completedSessionId) {
      navigate({ to: '/vocational-test/results/$sessionId', params: { sessionId: completedSessionId } })
    }
  }

  const renderContent = () => {
    switch (testState) {
      case 'idle':
        return (
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl font-bold text-white">
                Orientación Vocacional Conversacional
              </h2>
              <p className="text-slate-300 text-lg max-w-2xl mx-auto leading-relaxed">
                Descubre tu perfil vocacional conversando naturalmente con <span className="text-blue-400 font-semibold">ARIA</span>. 
                No más preguntas estructuradas, solo una charla amigable sobre tu futuro.
              </p>
            </div>

            <button
              onClick={handleStartConversation}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
            >
              <IconPlayerPlay className="w-6 h-6 text-white" />
              <span className="text-white font-semibold text-lg">
                Comenzar Conversación
              </span>
            </button>

            {/* Feature highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto pt-8">
              {[
                { icon: IconMicrophone, title: 'Conversación natural', desc: 'Habla como con un amigo', color: 'text-green-400' },
                { icon: IconVolume, title: 'IA conversacional', desc: 'ARIA entiende el contexto', color: 'text-blue-400' },
                { icon: IconTarget, title: 'Análisis inteligente', desc: 'RIASEC dinámico y adaptativo', color: 'text-purple-400' }
              ].map((feature, index) => {
                const IconComponent = feature.icon
                return (
                  <div
                    key={index}
                    className="p-6 rounded-xl bg-white/5 border border-white/10"
                  >
                    <div className="flex justify-center mb-3">
                      <IconComponent className={`w-8 h-8 ${feature.color}`} />
                    </div>
                    <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
                    <p className="text-slate-400 text-sm">{feature.desc}</p>
                  </div>
                )
              })}
            </div>
          </div>
        )

      case 'conversational':
        return <ConversationalVoiceBubble onTestComplete={handleTestComplete} />

      case 'completed':
        return (
          <div className="text-center space-y-8">
            <div className="flex justify-center mb-4">
              <IconTrophy className="w-16 h-16 text-yellow-400" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">
                ¡Conversación Completada!
              </h2>
              <p className="text-slate-300 text-lg">
                ARIA ha analizado tu conversación y generado tu perfil vocacional personalizado
              </p>
            </div>

            {/* Show Olympic Podium with Career Recommendations */}
            {results?.careerRecommendations && results.careerRecommendations.length > 0 && (
              <CareerRecommendationsDisplay careerSuggestions={results.careerRecommendations} />
            )}

            {/* Manual Navigation Button */}
            <div className="mt-12">
              <button
                onClick={handleViewFullResults}
                className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
              >
                <span className="text-white font-semibold text-lg">
                  Ver Análisis Completo
                </span>
                <IconArrowRight className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      {renderContent()}
    </div>
  )
}