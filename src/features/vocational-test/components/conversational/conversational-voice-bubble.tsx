import { useState, useEffect, useRef } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useCreateConversationalSession, useSendMessage, useConversationalResults } from '../../hooks'
import { useTTSService } from '../../hooks/use-tts-service'
import { useAuthStore } from '@/stores/auth-store'
import type { ConversationResponse } from '../../types'
import { VoiceBubbleCore } from './voice-bubble-core'
import { VoiceBubbleParticleSystem } from './voice-bubble-particle-system'
import { VoiceBubbleStatusDisplay } from './voice-bubble-status-display'
import { CareerRecommendationsDisplay } from './career-recommendations-display'
import { useSpeechRecognition } from '../../hooks/use-speech-recognition'
import { useAudioVisualization, useMorphAnimation } from './voice-bubble-hooks'
import { getStateStyles } from './voice-bubble-styles'
import type { ConversationalBubbleState } from './types'
import '../../styles/voice-bubble.css'

interface ConversationalVoiceBubbleProps {
  onTestComplete?: (sessionId: string) => void
}

export function ConversationalVoiceBubble({ onTestComplete }: ConversationalVoiceBubbleProps) {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [state, setState] = useState<ConversationalBubbleState>('idle')
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [currentAIResponse, setCurrentAIResponse] = useState<ConversationResponse | null>(null)

  // API hooks
  const createSession = useCreateConversationalSession()
  const sendMessage = useSendMessage()
  const { data: sessionResults } = useConversationalResults(sessionId || '', !!sessionId)
  
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
    
    // Check if conversation should complete (only when truly complete, not during career exploration)
    if (currentAIResponse.nextPhase === 'complete' || sessionResults?.conversationPhase === 'complete') {
      console.log('✅ Conversation complete - NO AUTO REDIRECT - let useEffect handle completion')
      return
    }
    
    // Continue listening for career exploration phase
    if (currentAIResponse.nextPhase === 'career_exploration' || sessionResults?.conversationPhase === 'career_exploration') {
      console.log('🎯 Entering career exploration phase - continuing conversation')
      setState('listening')
      // Do not navigate away - stay in conversation mode for career exploration
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
      // Start new session
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
      // Only complete if we're not currently speaking - NO AUTO REDIRECT
      setState('complete')
      console.log('🏁 Conversation completed - showing results without redirect')
      onTestComplete?.(sessionResults.sessionId)
    } else if (sessionResults?.conversationPhase === 'complete' && state === 'speaking') {
      // If we're speaking when completion is detected, wait for speech to finish
      console.log('🏁 Conversation complete but ARIA is still speaking - will complete after speech')
    }
  }, [sessionResults, onTestComplete, state])

  return (
    <div className="relative flex flex-col items-center space-y-12 py-8">
      {/* Particle Canvas Background */}
      <VoiceBubbleParticleSystem state={state} audioLevel={audioLevel} />

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
      />

      {/* Career Recommendations Display - ONLY show when test is actually complete (not during conversation) */}
      {state === 'complete' && sessionResults?.careerRecommendations && (
        <CareerRecommendationsDisplay careerSuggestions={sessionResults.careerRecommendations} />
      )}

      {/* Career Exploration UI - shown when AI provides career recommendations - STICKY AT BOTTOM */}
      {currentAIResponse?.intent === 'recommendation' && currentAIResponse?.nextPhase === 'career_exploration' && (state === 'idle' || state === 'listening') && (
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
              ¿Qué te gustaría hacer ahora?
            </h3>
            <div className="flex flex-wrap gap-3 justify-center">
              <button
                onClick={async () => {
                  setState('thinking')
                  try {
                    const response = await sendMessage.mutateAsync({
                      sessionId: sessionId!,
                      message: '¿Podrías contarme más detalles sobre estas carreras? Me interesa saber sobre el campo laboral y las oportunidades.'
                    })
                    setCurrentAIResponse(response)
                  } catch (error) {
                    console.error('❌ Error sending career exploration message:', error)
                    setState('listening')
                  }
                }}
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
              >
                Conocer más detalles
              </button>
              <button
                onClick={async () => {
                  setState('thinking')
                  try {
                    const response = await sendMessage.mutateAsync({
                      sessionId: sessionId!,
                      message: '¿Podrías sugerirme otras carreras alternativas que también podrían interesarme?'
                    })
                    setCurrentAIResponse(response)
                  } catch (error) {
                    console.error('❌ Error sending alternative careers message:', error)
                    setState('listening')
                  }
                }}
                className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
              >
                Ver otras opciones
              </button>
              <button
                onClick={async () => {
                  setState('thinking')
                  try {
                    const response = await sendMessage.mutateAsync({
                      sessionId: sessionId!,
                      message: 'Estoy satisfecho con estas recomendaciones. Me gustaría ver los resultados finales.'
                    })
                    setCurrentAIResponse(response)
                  } catch (error) {
                    console.error('❌ Error sending completion message:', error)
                    setState('listening')
                  }
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
              >
                Ver resultados finales
              </button>
            </div>
            <p className="text-sm text-white/70 mt-4">
              También puedes hacer cualquier pregunta hablando naturalmente
            </p>
          </div>
        </div>
      )}

      {/* Completion Check UI - shown when AI suggests finishing - STICKY AT BOTTOM */}
      {currentAIResponse?.intent === 'completion_check' && state === 'idle' && (
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
              ¿Qué te gustaría hacer?
            </h3>
            <div className="flex flex-wrap gap-3 justify-center">
              <button
                onClick={async () => {
                  // Send confirmation message to complete
                  setState('thinking')
                  try {
                    const response = await sendMessage.mutateAsync({
                      sessionId: sessionId!,
                      message: 'Ver resultados finales'
                    })
                    setCurrentAIResponse(response)
                  } catch (error) {
                    console.error('❌ Error sending completion confirmation:', error)
                    setState('idle')
                  }
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
              >
                Ver resultados finales
              </button>
              <button
                onClick={async () => {
                  // Send message to continue exploring
                  setState('thinking')
                  try {
                    const response = await sendMessage.mutateAsync({
                      sessionId: sessionId!,
                      message: 'Explorar más carreras'
                    })
                    setCurrentAIResponse(response)
                  } catch (error) {
                    console.error('❌ Error sending continue message:', error)
                    setState('idle')
                  }
                }}
                className="bg-white/20 hover:bg-white/30 text-white font-medium py-2 px-4 rounded-lg transition-colors border border-white/30 text-sm"
              >
                Explorar más carreras
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}