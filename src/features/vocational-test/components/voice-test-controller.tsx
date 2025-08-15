import { useState } from 'react'
import { IconPlayerPlay, IconMicrophone, IconVolume, IconTarget, IconTrophy, IconArrowRight } from '@tabler/icons-react'
import { ConversationalVoiceBubble } from './conversational'
import { CareerRecommendationsDisplay } from './conversational/career-recommendations-display'
import { useConversationalResults } from '../hooks/use-conversational-session'
import { useNavigate } from '@tanstack/react-router'

type TestState = 'idle' | 'conversational' | 'completed'

interface VoiceTestControllerProps {
  onTestComplete?: (sessionId: string) => void
  onConversationStart?: () => void
  testState?: TestState
  setTestState?: (state: TestState) => void
  completedSessionId?: string | null
  resumingSessionId?: string | null
}

export function VoiceTestController({ onTestComplete, onConversationStart, testState: externalTestState, setTestState: setExternalTestState, completedSessionId: externalCompletedSessionId, resumingSessionId }: VoiceTestControllerProps) {
  const [internalTestState, setInternalTestState] = useState<TestState>('idle')
  const [internalCompletedSessionId, setInternalCompletedSessionId] = useState<string | null>(null)
  const navigate = useNavigate()
  
  // Use external state if provided, otherwise use internal state
  const testState = externalTestState ?? internalTestState
  const setTestState = setExternalTestState ?? setInternalTestState
  const completedSessionId = externalCompletedSessionId ?? internalCompletedSessionId
  
  // Get results for completed session
  const { data: results } = useConversationalResults(completedSessionId || '', !!completedSessionId && testState === 'completed')

  const handleStartConversation = () => {
    setTestState('conversational')
    onConversationStart?.()
  }

  const handleTestComplete = (sessionId: string) => {
    if (!setExternalTestState) {
      setInternalCompletedSessionId(sessionId)
      setInternalTestState('completed')
    }
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
          <div className="text-center space-y-8 relative">
            {/* Floating decorative elements */}
            <div className="absolute -top-20 -left-20 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute -top-10 -right-32 w-32 h-32 bg-purple-500/15 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute top-32 left-1/4 w-24 h-24 bg-indigo-500/8 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }} />
            
            <div className="space-y-6 relative z-10">
              <div className="space-y-2">
                <h2 className="text-4xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent leading-tight">
                  Conversa con ARIA
                </h2>
                <p className="text-slate-300 text-lg max-w-xl mx-auto leading-relaxed">
                  Descubre tu perfil vocacional en una charla natural
                </p>
              </div>
            </div>

            {/* Enhanced CTA Button */}
            <div className="relative inline-block">
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-2xl blur-lg opacity-75 animate-pulse"></div>
              <button
                onClick={handleStartConversation}
                className="relative group inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25"
              >
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                  <IconPlayerPlay className="w-4 h-4 text-white ml-0.5" />
                </div>
                <div className="text-white font-bold text-lg">Iniciar Test</div>
              </button>
            </div>

            {/* Enhanced Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto pt-12">
              {[
                { 
                  icon: IconMicrophone, 
                  title: 'Conversación Natural', 
                  desc: 'Habla libremente, como con un amigo de confianza',
                  color: 'from-green-400 to-emerald-500',
                  bgGlow: 'bg-green-500/10',
                  delay: '0s'
                },
                { 
                  icon: IconVolume, 
                  title: 'IA Avanzada', 
                  desc: 'ARIA comprende contexto y emociones en tiempo real',
                  color: 'from-blue-400 to-cyan-500',
                  bgGlow: 'bg-blue-500/10',
                  delay: '0.2s'
                },
                { 
                  icon: IconTarget, 
                  title: 'Análisis RIASEC', 
                  desc: 'Evaluación psicométrica adaptativa e inteligente',
                  color: 'from-purple-400 to-pink-500',
                  bgGlow: 'bg-purple-500/10',
                  delay: '0.4s'
                }
              ].map((feature, index) => {
                const IconComponent = feature.icon
                return (
                  <div
                    key={index}
                    className="group relative"
                    style={{ animationDelay: feature.delay }}
                  >
                    {/* Floating glow effect */}
                    <div className={`absolute -inset-2 ${feature.bgGlow} rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                    
                    {/* Main card */}
                    <div
                      className="relative p-8 rounded-3xl backdrop-blur-xl transition-all duration-500 group-hover:scale-105 group-hover:-translate-y-2"
                      style={{
                        background: `
                          linear-gradient(135deg, 
                            rgba(255, 255, 255, 0.08) 0%, 
                            rgba(255, 255, 255, 0.02) 100%
                          )
                        `,
                        boxShadow: `
                          0 8px 32px 0 rgba(31, 38, 135, 0.37),
                          inset 0 1px 0 rgba(255, 255, 255, 0.1),
                          0 1px 0 rgba(255, 255, 255, 0.05)
                        `
                      }}
                    >
                      {/* Icon with gradient background */}
                      <div className="relative mb-6">
                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} p-1 mx-auto group-hover:rotate-12 transition-transform duration-300`}>
                          <div className="w-full h-full bg-black/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                            <IconComponent className="w-8 h-8 text-white" />
                          </div>
                        </div>
                      </div>
                      
                      {/* Content */}
                      <h3 className="text-white font-bold text-lg mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-blue-100 group-hover:bg-clip-text transition-all duration-300">
                        {feature.title}
                      </h3>
                      <p className="text-slate-300 text-sm leading-relaxed group-hover:text-slate-200 transition-colors duration-300">
                        {feature.desc}
                      </p>
                      
                      {/* Decorative elements */}
                      <div className="absolute top-4 right-4 w-2 h-2 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute bottom-4 left-4 w-1 h-1 bg-white/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ animationDelay: '0.1s' }} />
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Additional visual elements */}
            <div className="flex justify-center items-center gap-8 pt-8 opacity-80">
              <div className="flex items-center gap-3 text-slate-300 text-sm group hover:text-white transition-colors duration-300">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md group-hover:scale-110 transition-transform duration-300"
                  style={{
                    background: `
                      linear-gradient(135deg, 
                        rgba(59, 130, 246, 0.2) 0%, 
                        rgba(147, 51, 234, 0.2) 100%
                      )
                    `,
                    boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <IconTarget className="w-4 h-4 text-blue-400" />
                </div>
                <span>Análisis personalizado</span>
              </div>
              
              <div className="w-2 h-2 bg-gradient-to-r from-blue-400/30 to-purple-400/30 rounded-full blur-sm" />
              
              <div className="flex items-center gap-3 text-slate-300 text-sm group hover:text-white transition-colors duration-300">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md group-hover:scale-110 transition-transform duration-300"
                  style={{
                    background: `
                      linear-gradient(135deg, 
                        rgba(34, 197, 94, 0.2) 0%, 
                        rgba(16, 185, 129, 0.2) 100%
                      )
                    `,
                    boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <IconVolume className="w-4 h-4 text-green-400" />
                </div>
                <span>100% conversacional</span>
              </div>
              
              <div className="w-2 h-2 bg-gradient-to-r from-green-400/30 to-purple-400/30 rounded-full blur-sm" />
              
              <div className="flex items-center gap-3 text-slate-300 text-sm group hover:text-white transition-colors duration-300">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md group-hover:scale-110 transition-transform duration-300"
                  style={{
                    background: `
                      linear-gradient(135deg, 
                        rgba(147, 51, 234, 0.2) 0%, 
                        rgba(236, 72, 153, 0.2) 100%
                      )
                    `,
                    boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <IconTrophy className="w-4 h-4 text-purple-400" />
                </div>
                <span>Resultados precisos</span>
              </div>
            </div>
          </div>
        )

      case 'conversational':
        return <ConversationalVoiceBubble onTestComplete={handleTestComplete} resumingSessionId={resumingSessionId} />

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
    <div className="max-w-4xl mx-auto px-6 pb-2">
      {renderContent()}
    </div>
  )
}