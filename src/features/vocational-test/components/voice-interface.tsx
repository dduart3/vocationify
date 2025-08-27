// VoiceInterface component
// Responsibility: Handle voice-driven conversational flow with modern voice bubble

import { useState, useEffect, useRef } from 'react'
import { Mic, Volume2, Brain, Loader, AlertCircle } from 'lucide-react'
import { useSpeechRecognition } from '@/features/vocational-test/hooks/use-speech-recognition'
import { useOpenAITTS } from '../hooks/use-openai-tts'
import { useVoiceSettings } from '../hooks/use-voice-settings'
import { VoiceSettingsToggle } from './voice-settings-toggle'

export type VoiceState = 'idle' | 'listening' | 'processing' | 'speaking' | 'error'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

interface VoiceInterfaceProps {
  onSendMessage: (message: string) => void
  disabled?: boolean
  isLoading?: boolean
  currentQuestion?: string
  messages: Message[]
  isComplete?: boolean
}

export function VoiceInterface({ 
  onSendMessage, 
  disabled = false, 
  isLoading = false,
  currentQuestion,
  messages,
  isComplete = false
}: VoiceInterfaceProps) {
  const [voiceState, setVoiceState] = useState<VoiceState>('idle')
  const [silenceTimer, setSilenceTimer] = useState<NodeJS.Timeout | null>(null)
  const [transcript, setTranscript] = useState('')
  const previousMessageCountRef = useRef(0) // Always start at 0 to catch first message
  const transcriptRef = useRef('')
  
  // Voice settings
  const { settings } = useVoiceSettings()

  // Speech recognition hook
  const {
    transcript: speechTranscript,
    isListening,
    isSupported: isSpeechSupported,
    startListening,
    stopListening,
    resetTranscript,
    error: speechError
  } = useSpeechRecognition()

  // OpenAI Text-to-speech hook
  const {
    speak,
    stop: stopSpeech,
    isSpeaking,
    isLoading: isTTSLoading,
    isSupported: isTTSSupported,
    error: ttsError
  } = useOpenAITTS({
    voice: 'shimmer', // Warm feminine voice, perfect for career guidance
    model: 'gpt-4o-mini-tts', // Cheapest OpenAI TTS model for maximum cost savings
    speed: (settings.speechRate || 1.0) * 1.12 // Slightly faster for more natural feel
  })

  // Auto-speak initial question/message when component loads (only ONCE for initial session)
  useEffect(() => {
    // Handle the initial message when we first receive messages OR when messages go from 0 to having content
    if (messages.length > 0 && previousMessageCountRef.current === 0) {
      // For resumed sessions, speak the LAST AI message (most recent)
      // For new sessions, speak the FIRST AI message  
      const aiMessages = messages.filter(msg => msg.role === 'assistant')
      const messageToSpeak = aiMessages.length > 0 ? aiMessages[aiMessages.length - 1] : null
      
      if (messageToSpeak && isTTSSupported && !isSpeaking) {
        console.log(`🎯 Speaking ${messages.length > 1 ? 'latest' : 'initial'} AI message: "${messageToSpeak.content.substring(0, 50)}..."`)
        
        // Update the ref immediately to prevent re-triggering
        previousMessageCountRef.current = messages.length
        
        speak(messageToSpeak.content, () => {
          
          // Auto-start listening after AI finishes speaking (only in auto mode and if test is not complete)
          console.log('🎯 Initial message - checking auto-listen conditions:', {
            listeningMode: settings.listeningMode,
            disabled,
            isLoading,
            isComplete,
            isListening,
            isSpeaking,
            isTTSLoading
          })
          
          if (settings.listeningMode === 'auto' && !disabled && !isLoading && !isComplete) {
            console.log('🎯 Scheduling initial auto-listening start...')
            setTimeout(() => {
              console.log('🎯 Initial timeout, re-checking conditions:', {
                isListening,
                isSpeaking,
                isTTSLoading
              })
              
              // Double-check that we're not still speaking before starting to listen
              if (!isListening && !isSpeaking && !isTTSLoading) {
                console.log('🎙️ Starting initial auto-listening')
                setTranscript('')
                transcriptRef.current = ''
                resetTranscript()
                startListening()
              } else {
                console.log('🚫 Skipping auto-listen - still speaking or already listening')
              }
            }, 1000) // Longer delay after speech ends to ensure audio completion
          } else {
            console.log('🚫 Initial auto-listen disabled due to conditions')
          }
        })
      }
    }
  }, [messages, speak, isTTSSupported, settings.listeningMode, disabled, isLoading, isListening, startListening, resetTranscript, isComplete, isSpeaking, isTTSLoading])

  // Auto-speak new AI messages and optionally start listening
  useEffect(() => {
    if (messages.length > previousMessageCountRef.current) {
      const newMessages = messages.slice(previousMessageCountRef.current)
      const newAIMessage = newMessages.find(msg => msg.role === 'assistant')
      
      if (newAIMessage && isTTSSupported) {
        // Count user responses to detect if we're around the completion threshold (6 questions)
        const userResponseCount = messages.filter(msg => msg.role === 'user').length
        
        // If we're at the 6th user response and test isn't complete yet, 
        // add a delay to allow backend completion fallback mechanism to work
        const shouldDelay = userResponseCount >= 6 && !isComplete
        const speakDelay = shouldDelay ? 2000 : 0 // 2 second delay for backend completion check
        
        setTimeout(() => {
          // Re-check completion status after delay (backend might have completed it)
          if (shouldDelay && isComplete) {
            // Test was completed by backend during delay - speak the latest completion message instead
            const latestMessage = [...messages].reverse().find(msg => msg.role === 'assistant')
            if (latestMessage && latestMessage.content !== newAIMessage.content) {
              // A newer completion message was received, speak that instead
              speak(latestMessage.content, () => {
                // No listening for completed test
              })
              return
            }
          }
          
          // Speak the original message (either it's still valid or we're not at threshold)
          speak(newAIMessage.content, () => {
            
            // Auto-start listening after AI finishes speaking (only in auto mode and if test is not complete)
            console.log('🎯 Checking auto-listen conditions:', {
              listeningMode: settings.listeningMode,
              disabled,
              isLoading,
              isComplete,
              isListening,
              isSpeaking,
              isTTSLoading
            })
            
            if (settings.listeningMode === 'auto' && !disabled && !isLoading && !isComplete) {
              setTimeout(() => {
                console.log('🎯 In timeout, re-checking conditions:', {
                  isListening,
                  isSpeaking,
                  isTTSLoading
                })
                
                // Double-check that we're not still speaking before starting to listen
                if (!isListening && !isSpeaking && !isTTSLoading) {
                  console.log('🎙️ Starting auto-listening after speech completion')
                  setTranscript('')
                  transcriptRef.current = ''
                  resetTranscript()
                  startListening()
                } else {
                  console.log('🚫 Skipping auto-listen - still speaking or already listening')
                }
              }, 1000) // Longer delay after speech ends to ensure audio completion
            } else {
              console.log('🚫 Auto-listen disabled due to conditions')
            }
          })
        }, speakDelay)
      }
    }
    previousMessageCountRef.current = messages.length
  }, [messages, speak, isTTSSupported, settings.listeningMode, disabled, isLoading, isListening, startListening, resetTranscript, isComplete])

  // Update transcript and manage silence detection with accumulation
  useEffect(() => {
    if (speechTranscript && speechTranscript !== transcript) {
      const newSpeech = speechTranscript.trim()
      
      if (newSpeech) {
        setTranscript(prev => {
          const prevText = prev.trim()
          
          // If new speech is completely different and not contained in previous
          // this indicates a new speech segment after a pause
          if (prevText && !prevText.includes(newSpeech) && !newSpeech.includes(prevText)) {
            // Accumulate: add new speech to previous with proper spacing
            const newTranscript = `${prevText} ${newSpeech}`
            transcriptRef.current = newTranscript
            return newTranscript
          }
          
          // If new speech contains previous speech, it's an extension (Web Speech API concatenation)
          // or if no previous text, just use the new speech
          transcriptRef.current = newSpeech
          return newSpeech
        })
      }
      
      // Reset silence timer when new speech is detected
      if (silenceTimer) {
        clearTimeout(silenceTimer)
        setSilenceTimer(null)
      }

      // Set up silence detection for auto-send (2.5 seconds of silence)
      if (newSpeech && isListening) {
        const timer = setTimeout(() => {
          handleAutoSend()
        }, 2500)
        setSilenceTimer(timer)
      }
    }
  }, [speechTranscript, transcript, silenceTimer, isListening])

  // Update voice state based on speech recognition and TTS
  useEffect(() => {
    const newState = speechError || ttsError ? 'error'
      : isListening ? 'listening'
      : isSpeaking ? 'speaking'
      : (isTTSLoading || isLoading) ? 'processing'
      : 'idle'
    
    console.log('🎯 Voice state update:', {
      isListening,
      isSpeaking,
      isTTSLoading,
      isLoading,
      speechError: !!speechError,
      ttsError: !!ttsError,
      newState
    })
    
    setVoiceState(newState)
  }, [isListening, isSpeaking, isTTSLoading, isLoading, speechError, ttsError])

  const handleAutoSend = () => {
    const currentTranscript = transcriptRef.current.trim()
    if (currentTranscript && !disabled && !isLoading) {
      onSendMessage(currentTranscript)
      setTranscript('')
      transcriptRef.current = ''
      resetTranscript()
      stopListening()
      if (silenceTimer) {
        clearTimeout(silenceTimer)
        setSilenceTimer(null)
      }
    }
  }

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening()
      if (silenceTimer) {
        clearTimeout(silenceTimer)
        setSilenceTimer(null)
      }
    } else {
      if (isSpeaking) {
        stopSpeech()
      }
      setTranscript('')
      transcriptRef.current = ''
      resetTranscript()
      startListening()
    }
  }

  const getVoiceStateInfo = () => {
    switch (voiceState) {
      case 'listening':
        return {
          icon: <Mic className="w-8 h-8 text-red-400" />,
          title: 'Escuchando...',
          description: 'Habla tu respuesta',
          color: 'from-red-500/20 to-red-600/20',
          pulse: true
        }
      case 'processing':
        return {
          icon: <Loader className="w-8 h-8 text-blue-400 animate-spin" />,
          title: 'Procesando...',
          description: 'ARIA está pensando',
          color: 'from-blue-500/20 to-purple-500/20',
          pulse: false
        }
      case 'speaking':
        return {
          icon: <Volume2 className="w-8 h-8 text-green-400" />,
          title: 'Hablando...',
          description: 'ARIA está respondiendo',
          color: 'from-green-500/20 to-emerald-500/20',
          pulse: true
        }
      case 'error':
        return {
          icon: <AlertCircle className="w-8 h-8 text-red-400" />,
          title: 'Error',
          description: ttsError ? 'Error con la síntesis de voz' : 'Problema con el micrófono',
          color: 'from-red-500/20 to-red-600/20',
          pulse: false
        }
      default:
        return {
          icon: <Brain className="w-8 h-8 text-blue-400" />,
          title: 'Listo',
          description: settings.listeningMode === 'auto' ? 'Esperando respuesta automática' : 'Presiona para hablar',
          color: 'from-blue-500/20 to-purple-500/20',
          pulse: false
        }
    }
  }

  const stateInfo = getVoiceStateInfo()

  if (!isSpeechSupported || !isTTSSupported) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <p className="text-white/70 mb-4">Tu navegador no soporta reconocimiento de voz</p>
          <p className="text-white/50 text-sm">Usa el modo chat en su lugar</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6">
      {/* Current Question Display */}
      {currentQuestion && (
        <div className="mb-12 text-center max-w-2xl">
          <div 
            className="p-6 rounded-3xl backdrop-blur-xl"
            style={{
              background: `
                linear-gradient(135deg, 
                  rgba(255, 255, 255, 0.08) 0%, 
                  rgba(255, 255, 255, 0.04) 100%
                )
              `,
              boxShadow: `
                0 8px 32px 0 rgba(31, 38, 135, 0.37),
                inset 0 1px 0 rgba(255, 255, 255, 0.1)
              `
            }}
          >
            <h3 className="text-white text-lg font-semibold mb-2">ARIA pregunta:</h3>
            <p className="text-white/80 leading-relaxed">{currentQuestion}</p>
          </div>
        </div>
      )}

      {/* Main Voice Bubble */}
      <div className="relative mb-8">
        {/* Outer glow rings */}
        <div className={`absolute inset-0 rounded-full bg-gradient-to-r ${stateInfo.color} blur-3xl ${stateInfo.pulse ? 'animate-pulse' : ''}`} 
             style={{ transform: 'scale(1.5)' }} />
        <div className={`absolute inset-0 rounded-full bg-gradient-to-r ${stateInfo.color} blur-2xl ${stateInfo.pulse ? 'animate-pulse' : ''}`} 
             style={{ transform: 'scale(1.3)' }} />
        
        {/* Main voice bubble */}
        <button
          onClick={handleVoiceToggle}
          disabled={disabled || voiceState === 'processing' || voiceState === 'speaking'}
          className="relative w-48 h-48 rounded-full backdrop-blur-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed group"
          style={{
            background: `
              linear-gradient(135deg, 
                rgba(255, 255, 255, 0.1) 0%, 
                rgba(255, 255, 255, 0.05) 100%
              )
            `,
            boxShadow: `
              0 8px 32px 0 rgba(0, 0, 0, 0.3),
              inset 0 1px 0 rgba(255, 255, 255, 0.2)
            `
          }}
        >
          {/* Inner gradient overlay */}
          <div className={`absolute inset-0 rounded-full bg-gradient-to-r ${stateInfo.color} opacity-50 group-hover:opacity-70 transition-opacity duration-300`} />
          
          {/* Icon */}
          <div className="relative z-10 flex items-center justify-center h-full">
            {stateInfo.icon}
          </div>
        </button>

        {/* Waveform visualization for listening state */}
        {voiceState === 'listening' && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="w-1 bg-red-400 rounded-full animate-pulse"
                  style={{ 
                    height: `${Math.random() * 20 + 10}px`,
                    animationDelay: `${i * 0.1}s`,
                    animationDuration: '0.6s'
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Voice State Display */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">{stateInfo.title}</h2>
        <p className="text-white/70">{stateInfo.description}</p>
      </div>

      {/* Transcript Display */}
      {transcript && (
        <div className="w-full max-w-md">
          <div 
            className="p-4 rounded-2xl backdrop-blur-sm text-center"
            style={{
              background: `
                linear-gradient(135deg, 
                  rgba(34, 197, 94, 0.1) 0%, 
                  rgba(22, 163, 74, 0.1) 100%
                )
              `,
              boxShadow: 'inset 0 1px 0 rgba(34, 197, 94, 0.1)'
            }}
          >
            <p className="text-green-300 text-sm mb-1">Transcripción:</p>
            <p className="text-white">{transcript}</p>
            {silenceTimer && (
              <p className="text-green-200 text-xs mt-2">Auto-enviando en silencio...</p>
            )}
          </div>
        </div>
      )}

      {/* Manual Send Button (if there's transcript) */}
      {transcript && !silenceTimer && (
        <button
          onClick={handleAutoSend}
          className="mt-4 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
        >
          Enviar respuesta
        </button>
      )}

      {/* Error Display */}
      {ttsError && (
        <div className="w-full max-w-md mt-4">
          <div 
            className="p-4 rounded-2xl backdrop-blur-sm text-center border"
            style={{
              background: `
                linear-gradient(135deg, 
                  rgba(239, 68, 68, 0.1) 0%, 
                  rgba(220, 38, 38, 0.1) 100%
                )
              `,
              borderColor: 'rgba(239, 68, 68, 0.3)'
            }}
          >
            <p className="text-red-300 text-sm mb-1">Error TTS:</p>
            <p className="text-white text-xs">{ttsError}</p>
          </div>
        </div>
      )}

      {/* Voice Settings Toggle */}
      <div className="mt-8">
        <VoiceSettingsToggle disabled={disabled || isLoading} />
      </div>
    </div>
  )
}