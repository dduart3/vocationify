import { useState, useEffect, useRef } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useCreateConversationalSession, useSendMessage, useConversationalResults } from '../../hooks'
import { useSessionDetails } from '../../hooks/use-session-details'
import { useTTSService } from '../../hooks/use-tts-service'
import { useAuthStore } from '@/stores/auth-store'
import type { ConversationResponse } from '../../types'
import { VoiceBubbleCore } from './voice-bubble-core'
import { VoiceBubbleParticleSystem } from './voice-bubble-particle-system'
import { VoiceBubbleStatusDisplay } from './voice-bubble-status-display'
import { CareerRecommendationsDisplay } from './career-recommendations-display'
import { EnhancedProgressIndicator } from './enhanced-progress-indicator'
import { TestCompletionDisplay } from './test-completion-display'
import { useSpeechRecognition } from '../../hooks/use-speech-recognition'
import { useAudioVisualization, useMorphAnimation } from './voice-bubble-hooks'
import { getStateStyles } from './voice-bubble-styles'
import type { ConversationalBubbleState } from './types'
import '../../styles/voice-bubble.css'

interface ConversationalVoiceBubbleProps {
  onTestComplete?: (sessionId: string) => void
  resumingSessionId?: string | null
}

export function ConversationalVoiceBubble({ onTestComplete, resumingSessionId }: ConversationalVoiceBubbleProps) {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [state, setState] = useState<ConversationalBubbleState>('idle')
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [currentAIResponse, setCurrentAIResponse] = useState<ConversationResponse | null>(null)

  // State for completion detection
  const [shouldPollForCompletion, setShouldPollForCompletion] = useState(false)
  const [completionDetected, setCompletionDetected] = useState(false)
  
  // API hooks
  const createSession = useCreateConversationalSession()
  const sendMessage = useSendMessage()
  const { data: sessionResults, refetch: refetchResults } = useConversationalResults(
    sessionId || '', 
    !!sessionId, 
    shouldPollForCompletion
  )
  const { data: sessionDetails } = useSessionDetails(resumingSessionId, !!resumingSessionId)
  
  // Services
  const tts = useTTSService()
  const speechRecognition = useSpeechRecognition({
    language: 'es-VE',
    continuous: true, // Changed to continuous for better detection
    interimResults: true
  })

  // Visual hooks
  const { audioLevel } = useAudioVisualization(state, speechRecognition.isListening)
  const { getMorphedBorderRadius, getMorphedClipPath } = useMorphAnimation(state)

  // Refs for cleanup and control
  const speechTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const listeningTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastTranscriptRef = useRef<string>('')
  const currentResponseRef = useRef<string>('')

  // Handle session resumption
  useEffect(() => {
    if (resumingSessionId && sessionDetails && sessionId !== resumingSessionId) {
      console.log('🔄 Resuming session:', resumingSessionId, 'with details:', sessionDetails)
      setSessionId(resumingSessionId)
      
      // Check the last message to determine what to do
      const lastMessage = sessionDetails.conversationHistory[sessionDetails.conversationHistory.length - 1]
      
      if (lastMessage && lastMessage.role === 'assistant') {
        // Last message was from AI - user needs to respond, so repeat the question
        console.log('🔄 Last message was from AI, repeating question')
        const aiResponse: ConversationResponse = {
          message: lastMessage.content,
          intent: 'question' as const,
          nextPhase: sessionDetails.currentPhase as any,
          suggestedFollowUp: []
        }
        setCurrentAIResponse(aiResponse)
        setState('speaking')
      } else if (lastMessage && lastMessage.role === 'user') {
        // Last message was from user - AI needs to respond, so continue the conversation
        console.log('🔄 Last message was from user, continuing conversation')
        setState('thinking')
        
        // Process the last user message through the AI
        setTimeout(async () => {
          try {
            const response = await sendMessage.mutateAsync({
              sessionId: resumingSessionId,
              message: '[CONTINUING_SESSION]' // Special marker for continuing
            })
            setCurrentAIResponse(response)
            setState('speaking')
          } catch (error) {
            console.error('❌ Error continuing session:', error)
            setState('listening')
          }
        }, 500)
      } else {
        // No conversation history - start fresh
        console.log('🔄 No conversation history, starting fresh')
        setState('listening')
      }
    }
  }, [resumingSessionId, sessionId, sessionDetails, sendMessage])

  // Simple silence detection - restart timer whenever transcript changes
  useEffect(() => {
    if (state === 'listening' && speechRecognition.transcript.trim()) {
      // Clear existing silence timeout
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current)
        silenceTimeoutRef.current = null
      }

      console.log('🎙️ Speech detected:', speechRecognition.transcript)

      // Start/restart silence detection timer - auto-submit after 2.5 seconds of silence
      silenceTimeoutRef.current = setTimeout(() => {
        console.log('🔇 Silence detected, auto-submitting...')
        submitUserResponse()
      }, 2500)
    }
  }, [state, speechRecognition.transcript])

  // Simple state machine - ONE effect to rule them all
  useEffect(() => {
    console.log(`🔄 State changed to: ${state}`)

    // Clear any existing timeouts when state changes
    if (speechTimeoutRef.current) {
      clearTimeout(speechTimeoutRef.current)
      speechTimeoutRef.current = null
    }
    if (listeningTimeoutRef.current) {
      clearTimeout(listeningTimeoutRef.current)
      listeningTimeoutRef.current = null
    }
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current)
      silenceTimeoutRef.current = null
    }

    if (state === 'speaking' && currentAIResponse) {
      console.log('🎙️ ARIA speaking:', currentAIResponse.message.substring(0, 50) + '...')
      
      // Start TTS with completion callback
      tts.speak(currentAIResponse.message, () => {
        console.log('✅ TTS onend callback fired - speech actually finished')
        
        // Check for completion before transitioning to listening
        if (currentAIResponse.nextPhase === 'complete' || completionDetected) {
          console.log('🏁 Speech finished but completion detected - not transitioning to listening')
          return
        }
        
        setTimeout(() => {
          startListening()
        }, 300) // Small delay for natural feel
      })
      currentResponseRef.current = currentAIResponse.message
      
    } else if (state === 'listening') {
      console.log('👂 Starting to listen...')
      
      // Ensure TTS is stopped and reset transcript tracking
      tts.stop()
      
      // Small delay to ensure audio context is clear
      setTimeout(() => {
        speechRecognition.startListening()
        
        // Fallback timeout after 15 seconds
        listeningTimeoutRef.current = setTimeout(() => {
          console.log('⏰ Listening timeout (fallback), submitting response')
          submitUserResponse()
        }, 15000)
      }, 500)
      
    } else if (state === 'thinking') {
      console.log('🧠 Processing user input...')
      // Stop everything during thinking
      tts.stop()
      speechRecognition.stopListening()
    }

    // Cleanup function
    return () => {
      if (speechTimeoutRef.current) {
        clearTimeout(speechTimeoutRef.current)
        speechTimeoutRef.current = null
      }
      if (listeningTimeoutRef.current) {
        clearTimeout(listeningTimeoutRef.current)
        listeningTimeoutRef.current = null
      }
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current)
        silenceTimeoutRef.current = null
      }
    }
  }, [state, currentAIResponse])

  // Helper function to start listening
  const startListening = () => {
    if (!currentAIResponse) return
    
    // Check for immediate completion to avoid transitioning to listening
    if (currentAIResponse.nextPhase === 'complete' || completionDetected) {
      console.log('🏁 Completion detected - not starting listening mode')
      return
    }
    
    // Handle enhanced exploration phase with continuous listening
    if (currentAIResponse.nextPhase === 'enhanced_exploration' || sessionResults?.conversationPhase === 'enhanced_exploration') {
      console.log('🔍 Enhanced exploration phase - continuing deep assessment')
      setState('enhanced-exploration')
      setTimeout(() => setState('listening'), 500)
      return
    }
    
    // Handle career matching phase (brief processing phase)
    if (currentAIResponse.nextPhase === 'career_matching' || sessionResults?.conversationPhase === 'career_matching') {
      console.log('🎯 Career matching phase - AI analyzing profile')
      setState('career-matching')
      setTimeout(() => setState('listening'), 500)
      return
    }
    
    // Handle reality check phase with discriminating questions
    if (currentAIResponse.nextPhase === 'reality_check' || sessionResults?.conversationPhase === 'reality_check') {
      console.log('⚠️ Reality check phase - discriminating questions')
      setState('reality-check')
      setTimeout(() => setState('listening'), 500)
      return
    }
    
    // Handle final results phase
    if (currentAIResponse.nextPhase === 'final_results' || sessionResults?.conversationPhase === 'final_results') {
      console.log('🏆 Final results phase - comprehensive assessment')
      setState('final-results')
      setTimeout(() => setState('listening'), 500)
      return
    }
    
    setState('listening')
  }

  // Helper function to submit user response
  const submitUserResponse = async () => {
    const finalTranscript = speechRecognition.transcript.trim()
    console.log('📝 Submitting transcript:', finalTranscript || '(empty)')

    // Clear timeouts
    if (listeningTimeoutRef.current) {
      clearTimeout(listeningTimeoutRef.current)
      listeningTimeoutRef.current = null
    }
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current)
      silenceTimeoutRef.current = null
    }

    // Stop listening
    speechRecognition.stopListening()

    if (!finalTranscript) {
      console.log('❌ No transcript, restarting listening')
      // Brief pause then restart listening
      setTimeout(() => {
        setState('listening')
      }, 1000)
      return
    }

    try {
      setState('thinking')
      
      const response = await sendMessage.mutateAsync({
        sessionId: sessionId!,
        message: finalTranscript
      })
      
      setCurrentAIResponse(response)
      speechRecognition.resetTranscript()
      setState('speaking')
      
    } catch (error) {
      console.error('❌ API Error:', error)
      // On error, restart listening
      setTimeout(() => {
        setState('listening')
      }, 2000)
    }
  }

  // Handle button clicks
  const handleClick = async () => {
    console.log(`🖱️ Click in state: ${state}`)

    if (state === 'idle') {
      // If we have a resumingSessionId, don't create new session - resume the existing one
      if (resumingSessionId) {
        console.log('🔄 Resuming session from click:', resumingSessionId)
        setSessionId(resumingSessionId)
        setState('listening')
        return
      }

      // Start new session only if no resuming session
      try {
        setState('session-starting')
        const session = await createSession.mutateAsync(user?.id)
        setSessionId(session.sessionId)
        setCurrentAIResponse(session.greeting)
        setState('speaking')
      } catch (error) {
        console.error('❌ Session creation failed:', error)
        setState('idle')
      }
      
    } else if (state === 'listening') {
      // Manual submit
      console.log('🖱️ Manual submit')
      submitUserResponse()
      
    } else if (state === 'speaking') {
      // Skip to listening
      console.log('🖱️ Skipping speech')
      if (speechTimeoutRef.current) {
        clearTimeout(speechTimeoutRef.current)
        speechTimeoutRef.current = null
      }
      startListening()
    }
  }

  // Check for conversation completion - but let final speech finish first
  useEffect(() => {
    if (sessionResults?.conversationPhase === 'complete' && state !== 'speaking') {
      // Only complete if we're not currently speaking
      console.log('🏁 Conversation completed - transitioning to completion state')
      setTimeout(() => {
        setState('test-finished')
        onTestComplete?.(sessionResults.sessionId)
      }, 2000) // 2 second delay to let the final message be absorbed
    } else if (sessionResults?.conversationPhase === 'complete' && state === 'speaking') {
      // If we're speaking when completion is detected, wait for speech to finish
      console.log('🏁 Conversation complete but ARIA is still speaking - will complete after speech')
    }
  }, [sessionResults, onTestComplete, state])

  // Show completion display when test is finished
  if (state === 'test-finished') {
    return (
      <TestCompletionDisplay 
        sessionId={sessionId || ''}
        sessionResults={sessionResults}
        onViewResults={() => onTestComplete?.(sessionId || '')}
      />
    )
  }

  return (
    <div className="relative flex flex-col items-center space-y-12 py-8">
      {/* Particle Canvas Background */}
      <VoiceBubbleParticleSystem state={state} audioLevel={audioLevel} />

      {/* Enhanced Progress Indicator */}
      <EnhancedProgressIndicator
        currentPhase={sessionResults?.conversationPhase || currentAIResponse?.nextPhase || 'enhanced_exploration'}
        currentResponse={currentAIResponse}
        conversationHistory={sessionResults?.conversationHistory || []}
      />

      {/* Main Voice Bubble Container */}
      <VoiceBubbleCore
        state={state}
        audioLevel={audioLevel}
        isListeningToSpeech={speechRecognition.isListening}
        morphedBorderRadius={getMorphedBorderRadius()}
        morphedClipPath={getMorphedClipPath()}
        stateStyles={getStateStyles(state, audioLevel)}
        onClick={handleClick}
        disabled={state === 'thinking' || state === 'session-starting'}
      />
      

      {/* Status Display */}
      <VoiceBubbleStatusDisplay
        state={state}
        transcript={speechRecognition.transcript}
        currentAIResponse={currentAIResponse}
        speechRecognitionAvailable={speechRecognition.isSupported}
        isSpeaking={tts.isSpeaking}
        sessionResults={sessionResults}
        isResuming={!!resumingSessionId && !!sessionDetails}
      />

      {/* Career Recommendations Display - ONLY show when test is actually complete (not during conversation) */}
      {state === 'complete' && sessionResults?.conversationPhase === 'complete' && sessionResults?.careerRecommendations && (
        <CareerRecommendationsDisplay careerSuggestions={sessionResults.careerRecommendations} />
      )}

      {/* Career Matching Phase UI - shown when AI provides top career matches */}
      {currentAIResponse?.intent === 'recommendation' && currentAIResponse?.nextPhase === 'reality_check' && (state === 'idle' || state === 'listening') && (
        <div 
          className="fixed bottom-0 left-0 right-0 z-50 p-4"
          style={{
            background: `
              linear-gradient(135deg, 
                rgba(0, 0, 0, 0.8) 0%, 
                rgba(0, 0, 0, 0.6) 100%
              )
            `,
            backdropFilter: 'blur(20px)',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <div className="max-w-4xl mx-auto text-center space-y-3">
            <h3 className="text-white font-semibold text-sm">
              Top 3 carreras identificadas - Ahora verificaremos si estás preparado/a para sus realidades
            </h3>
            <div className="flex flex-wrap gap-3 justify-center">
              <button
                onClick={async () => {
                  setState('thinking')
                  try {
                    const response = await sendMessage.mutateAsync({
                      sessionId: sessionId!,
                      message: 'Estoy listo/a para las preguntas sobre las realidades de estas carreras.'
                    })
                    setCurrentAIResponse(response)
                    setState('speaking') // ← MISSING LINE - transition to speaking to show AI response
                  } catch (error) {
                    console.error('❌ Error proceeding to reality check:', error)
                    setState('listening')
                  }
                }}
                className="bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
              >
                Continuar con Reality Check
              </button>
              <button
                onClick={async () => {
                  setState('thinking')
                  try {
                    const response = await sendMessage.mutateAsync({
                      sessionId: sessionId!,
                      message: '¿Podrías explicarme qué son las preguntas discriminatorias?'
                    })
                    setCurrentAIResponse(response)
                    setState('speaking') // ← MISSING LINE - transition to speaking to show AI response
                  } catch (error) {
                    console.error('❌ Error asking about discriminating questions:', error)
                    setState('listening')
                  }
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
              >
                ¿Qué es Reality Check?
              </button>
            </div>
            <p className="text-sm text-white/70 mt-4">
              Evaluaremos aspectos desafiantes de cada carrera para asegurar compatibilidad real
            </p>
          </div>
        </div>
      )}

      {/* Final Results Phase UI - shown when AI provides final comprehensive results */}
      {currentAIResponse?.intent === 'farewell' && currentAIResponse?.nextPhase === 'complete' && (state === 'idle' || state === 'listening') && (
        <div 
          className="fixed bottom-0 left-0 right-0 z-50 p-4"
          style={{
            background: `
              linear-gradient(135deg, 
                rgba(0, 100, 0, 0.8) 0%, 
                rgba(0, 150, 0, 0.6) 100%
              )
            `,
            backdropFilter: 'blur(20px)',
            borderTop: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          <div className="max-w-4xl mx-auto text-center space-y-3">
            <h3 className="text-white font-semibold text-sm">
              🎉 ¡Test completado exitosamente! Tu perfil vocacional está listo
            </h3>
            <div className="flex flex-wrap gap-3 justify-center">
              <button
                onClick={() => {
                  setState('complete')
                  onTestComplete?.(sessionId!)
                }}
                className="bg-white/90 hover:bg-white text-green-800 font-medium py-2 px-4 rounded-lg transition-colors text-sm"
              >
                Ver perfil completo
              </button>
              <button
                onClick={() => navigate({ to: '/results' })}
                className="bg-white/20 hover:bg-white/30 text-white font-medium py-2 px-4 rounded-lg transition-colors border border-white/30 text-sm"
              >
                Ir a mis resultados
              </button>
            </div>
            <p className="text-sm text-white/70 mt-4">
              Resultado basado en evaluación profunda + reality check completado
            </p>
          </div>
        </div>
      )}
    </div>
  )
}