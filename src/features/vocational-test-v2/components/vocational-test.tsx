// Clean vocational test component
// Responsibility: Orchestrate sub-components and manage overall flow

import { useEffect } from 'react'
import { Trophy, ArrowRight } from 'lucide-react'
import { useVocationalTest } from '../hooks/use-vocational-test'
import { ConversationHistory } from './conversation-history'
import { CareerRecommendations } from './career-recommendations'
import { PhaseTransitionButton } from './phase-transition-button'
import { MessageInput } from './message-input'

interface VocationalTestProps {
  userId: string
  sessionId?: string
  onComplete?: (sessionId: string) => void
}

export function VocationalTest({ userId, sessionId, onComplete }: VocationalTestProps) {
  const {
    session,
    sessionId: currentSessionId,
    currentPhase,
    uiBehavior,
    hasSession,
    isComplete,
    recommendations,
    
    // Actions
    startSession,
    sendMessage,
    transitionToPhase,
    
    // Loading states
    isStarting,
    isSending,
    isTransitioning
  } = useVocationalTest({ userId, sessionId })

  // Handle completion callback
  useEffect(() => {
    if (isComplete && onComplete && currentSessionId) {
      console.log('🎉 V2 vocational test completed')
      onComplete(currentSessionId)
    }
  }, [isComplete, onComplete, currentSessionId])

  // No session - show start screen
  if (!hasSession && !isStarting) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
        <div className="text-white text-center max-w-2xl px-6">
          <h1 className="text-4xl font-bold mb-4">Test Vocacional V2</h1>
          <p className="text-lg text-white/80 mb-8">
            Descubre qué carrera es perfecta para ti con nuestra nueva implementación limpia y simple.
          </p>
          <button
            onClick={startSession}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg"
          >
            Comenzar Test Vocacional
          </button>
        </div>
      </div>
    )
  }

  // Loading state
  if (isStarting) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
        <div className="text-white text-center">
          <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Iniciando tu sesión vocacional V2...</p>
        </div>
      </div>
    )
  }

  // Completion screen
  if (isComplete) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-900 via-blue-900 to-indigo-900">
        <div className="text-center text-white max-w-2xl px-6">
          <div className="mb-8">
            <Trophy className="w-20 h-20 text-yellow-400 mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-4">¡Test V2 Completado!</h1>
            <p className="text-lg text-white/80">
              Has completado exitosamente tu evaluación vocacional usando la nueva implementación limpia. 
              Tus resultados están listos para revisar.
            </p>
          </div>
          
          {recommendations && recommendations.length > 0 && (
            <CareerRecommendations 
              recommendations={recommendations}
              className="mb-8"
            />
          )}
          
          <button
            onClick={() => onComplete?.(currentSessionId!)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold flex items-center gap-2 mx-auto"
          >
            Ver Resultados Detallados
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    )
  }

  // Main test interface
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      {/* Header */}
      <div className="border-b border-white/10 bg-white/5 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">
                Test Vocacional ARIA V2
              </h1>
              <div className="flex items-center gap-3 text-white/70 text-sm">
                <span>Fase: {currentPhase}</span>
                <span>•</span>
                <span className="bg-green-500/20 text-green-300 px-2 py-1 rounded text-xs">
                  CLEAN ARCHITECTURE
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex flex-col h-[calc(100vh-80px)]">
        
        {/* Conversation History */}
        <ConversationHistory 
          messages={session?.conversation_history || []}
          currentPhase={currentPhase}
        />

        {/* Career Recommendations (when available) */}
        {uiBehavior.showCareers && recommendations && recommendations.length > 0 && (
          <div className="border-t border-white/10 bg-white/5 backdrop-blur-sm p-6">
            <div className="max-w-4xl mx-auto">
              <CareerRecommendations 
                recommendations={recommendations}
              />
            </div>
          </div>
        )}

        {/* Phase Transition Button */}
        <PhaseTransitionButton
          currentPhase={currentPhase}
          onTransition={() => {
            if (currentPhase === 'career_matching') {
              transitionToPhase('reality_check')
            } else if (currentPhase === 'reality_check') {
              transitionToPhase('complete')
            }
          }}
          isLoading={isTransitioning}
        />

        {/* Message Input */}
        <MessageInput
          onSendMessage={sendMessage}
          disabled={isSending || isTransitioning}
          isLoading={isSending}
          placeholder="Responde a ARIA..."
        />
      </div>
    </div>
  )
}