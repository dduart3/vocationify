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
    isRealityCheckReady,
    
    // Actions
    startSession,
    sendMessage,
    transitionToPhase,
    completeRealityCheck,
    
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

  // Note: Removed immediate completion screen - now handled by PhaseTransitionButton

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

        {/* Conditional Input Area - Show transition button OR message input */}
        {(currentPhase === 'career_matching' || currentPhase === 'complete') ? (
          <PhaseTransitionButton
            currentPhase={currentPhase}
            onTransition={() => {
              if (currentPhase === 'career_matching') {
                transitionToPhase('reality_check')
              } else if (currentPhase === 'complete') {
                // Navigate to detailed results page
                onComplete?.(currentSessionId!)
              }
            }}
            isLoading={isTransitioning}
            isRealityCheckReady={isRealityCheckReady}
          />
        ) : (
          <MessageInput
            onSendMessage={sendMessage}
            disabled={isSending || isTransitioning}
            isLoading={isSending}
            placeholder="Responde a ARIA..."
          />
        )}
      </div>
    </div>
  )
}