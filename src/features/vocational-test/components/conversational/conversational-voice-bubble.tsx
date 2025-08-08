import { useState, useEffect, useRef } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useCreateConversationalSession, useSendMessage, useConversationalResults } from '../../hooks'
import { useTTSService } from '../../hooks/use-tts-service'
import { useAuthStore } from '@/stores/auth-store'
import type { ConversationResponse } from '../../types'
import { VoiceBubbleCore } from './voice-bubble-core'
import { VoiceBubbleParticleSystem } from './voice-bubble-particle-system'
import { VoiceBubbleStatusDisplay } from './voice-bubble-status-display'
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
      console.log('✅ Conversation complete - final speech finished')
      setState('idle')
      // Navigate to results page
      if (sessionResults?.sessionId || sessionId) {
        const resultSessionId = sessionResults?.sessionId || sessionId!
        console.log('🔄 Navigating to results page:', resultSessionId)
        navigate({ to: '/vocational-test/results/$sessionId', params: { sessionId: resultSessionId } })
      }
      // Also trigger completion callback for backward compatibility
      if (sessionResults?.conversationPhase === 'complete') {
        onTestComplete?.(sessionResults.sessionId)
      }
      return
    }
    
    // Continue listening for career exploration phase
    if (currentAIResponse.nextPhase === 'career_exploration' || sessionResults?.conversationPhase === 'career_exploration') {
      console.log('🎯 Entering career exploration phase - continuing conversation')
      setState('idle')
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
      // Only complete if we're not currently speaking
      setState('idle')
      // Navigate to results page
      console.log('🔄 Navigating to results page from useEffect:', sessionResults.sessionId)
      navigate({ to: '/vocational-test/results/$sessionId', params: { sessionId: sessionResults.sessionId } })
      onTestComplete?.(sessionResults.sessionId)
    } else if (sessionResults?.conversationPhase === 'complete' && state === 'speaking') {
      // If we're speaking when completion is detected, wait for speech to finish
      console.log('🏁 Conversation complete but ARIA is still speaking - will complete after speech')
    }
  }, [sessionResults, onTestComplete, state, navigate])

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

      {/* Completion Check UI - shown when AI suggests finishing */}
      {currentAIResponse?.intent === 'completion_check' && state === 'idle' && (
        <div className="mt-8 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl max-w-md">
          <div className="text-center space-y-4">
            <h3 className="text-white font-semibold text-lg">
              ¿Qué te gustaría hacer?
            </h3>
            <div className="space-y-3">
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
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-xl transition-colors"
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
                className="w-full bg-white/20 hover:bg-white/30 text-white font-medium py-3 px-4 rounded-xl transition-colors border border-white/30"
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