import { useState, useEffect, useRef } from 'react'
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

  // Silence detection - auto-submit when user stops talking
  useEffect(() => {
    if (state === 'listening' && speechRecognition.transcript) {
      // Clear existing silence timeout
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current)
        silenceTimeoutRef.current = null
      }

      // Only submit if transcript changed (new speech detected)
      if (speechRecognition.transcript !== lastTranscriptRef.current) {
        console.log('🎙️ New speech detected:', speechRecognition.transcript)
        lastTranscriptRef.current = speechRecognition.transcript

        // Start silence detection timer - auto-submit after 2 seconds of silence
        silenceTimeoutRef.current = setTimeout(() => {
          console.log('🔇 Silence detected, auto-submitting...')
          submitUserResponse()
        }, 2000)
      }
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
      
      // Start TTS
      tts.speak(currentAIResponse.message)
      currentResponseRef.current = currentAIResponse.message
      
      // Calculate speech duration - shorter and more accurate for browser TTS
      const speechDuration = Math.max(2000, currentAIResponse.message.length * 40) + 1000 // 40ms per char + 1s buffer
      console.log(`⏰ Speech will last ${speechDuration}ms`)
      
      // Transition to listening after speech completes
      speechTimeoutRef.current = setTimeout(() => {
        console.log('✅ Speech finished, transitioning to listening')
        startListening()
      }, speechDuration)
      
    } else if (state === 'listening') {
      console.log('👂 Starting to listen...')
      
      // Ensure TTS is stopped and reset transcript tracking
      tts.stop()
      lastTranscriptRef.current = ''
      
      // Small delay to ensure audio context is clear
      setTimeout(() => {
        speechRecognition.startListening()
        
        // Fallback timeout after 20 seconds (silence detection should handle most cases)
        listeningTimeoutRef.current = setTimeout(() => {
          console.log('⏰ Listening timeout (fallback), submitting response')
          submitUserResponse()
        }, 20000)
      }, 800)
      
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
    
    if (currentAIResponse.nextPhase === 'complete') {
      console.log('✅ Conversation complete')
      setState('idle')
      return
    }
    
    setState('listening')
  }

  // Helper function to submit user response
  const submitUserResponse = async () => {
    const transcript = speechRecognition.transcript.trim()
    console.log('📝 Submitting transcript:', transcript || '(empty)')

    // Clear timeouts
    if (listeningTimeoutRef.current) {
      clearTimeout(listeningTimeoutRef.current)
      listeningTimeoutRef.current = null
    }

    // Stop listening
    speechRecognition.stopListening()

    if (!transcript) {
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
        message: transcript
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

  // Check for conversation completion
  useEffect(() => {
    if (sessionResults?.conversationPhase === 'complete') {
      setState('idle')
      onTestComplete?.(sessionResults.sessionId)
    }
  }, [sessionResults, onTestComplete])

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
    </div>
  )
}