// VoiceInterface component
// Responsibility: Handle voice-driven conversational flow with modern voice bubble

import { useState, useEffect, useRef } from 'react'
import { Mic, Volume2, Brain, Loader, AlertCircle, X } from 'lucide-react'
import { useSpeechRecognition } from '@/features/vocational-test/hooks/use-speech-recognition'
import { useOpenAITTS } from '../hooks/use-openai-tts'
import { useVoiceSettings } from '../hooks/use-voice-settings'
import { VoiceSettingsToggle } from './voice-settings-toggle'
import { Persona } from '@/components/ai-elements/persona'
import { Shimmer } from '@/components/ai-elements/shimmer'
import type { UIBehavior } from '../types'

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
  uiBehavior?: UIBehavior
}

export function VoiceInterface({
  onSendMessage,
  disabled = false,
  isLoading = false,
  currentQuestion,
  messages,
  isComplete = false,
  uiBehavior = { autoListen: true, showCareers: false }
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
    error: ttsError,
    progress
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
            // Check the UI behavior based on current phase instead of just isComplete
            // This ensures we don't auto-listen during completion or career_matching phases
            const shouldAutoListen = settings.listeningMode === 'auto' &&
                                    !disabled &&
                                    !isLoading &&
                                    !isComplete &&
                                    uiBehavior.autoListen !== false

            console.log('🎯 Checking auto-listen conditions:', {
              listeningMode: settings.listeningMode,
              disabled,
              isLoading,
              isComplete,
              uiBehaviorAutoListen: uiBehavior.autoListen,
              shouldAutoListen,
              isListening,
              isSpeaking,
              isTTSLoading
            })

            if (shouldAutoListen) {
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
          <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <p className="text-gray-700 mb-4">Tu navegador no soporta reconocimiento de voz</p>
          <p className="text-gray-600 text-sm">Usa el modo chat en su lugar</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6">
      {/* Top spacing to account for removed question div */}
      <div className="h-12" />

      {/* Main Voice Bubble - Animated Persona Component */}
      <div className="relative mb-8 flex justify-center items-center">
        {/* Outer subtle glow to match the background */}
        <div className={`absolute inset-0 rounded-full bg-gradient-to-r ${stateInfo.color} blur-3xl opacity-50 ${stateInfo.pulse ? 'animate-pulse' : ''}`} 
             style={{ transform: 'scale(2)' }} />
        
        <button
          onClick={handleVoiceToggle}
          disabled={disabled || voiceState === 'processing' || voiceState === 'speaking'}
          className="relative z-10 flex items-center justify-center transition-transform duration-300 hover:scale-[1.02] active:scale-95 disabled:opacity-80 disabled:hover:scale-100 disabled:cursor-not-allowed outline-none"
        >
          <Persona 
            variant="obsidian" 
            state={
              voiceState === 'processing' ? 'thinking' : 
              voiceState === 'speaking' ? 'speaking' : 
              voiceState === 'listening' ? 'listening' : 
              'idle'
            } 
            className="w-64 h-64 sm:w-80 sm:h-80 drop-shadow-2xl" 
          />

          {/* Central 3D Deep State Icon */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/40 shadow-[inset_0_3px_6px_rgba(255,255,255,0.6),0_8px_16px_rgba(0,0,0,0.6)] flex items-center justify-center transition-all duration-300">
              
              {/* Idle: Time to talk */}
              {(voiceState === 'idle' || voiceState === 'error') && (
                <Mic className="w-5 h-5 text-gray-800 drop-shadow-md transition-opacity duration-300 opacity-100" />
              )}
              
              {/* Listening: Listening to the user speaking */}
              {voiceState === 'listening' && (
                <div className="flex items-center justify-center gap-[3px] h-5">
                  <div className="w-1 bg-gray-800 rounded-full animate-[pulse_0.8s_ease-in-out_infinite] shadow-sm" style={{ height: '50%', animationDelay: '0ms' }} />
                  <div className="w-1 bg-gray-800 rounded-full animate-[pulse_0.8s_ease-in-out_infinite] shadow-sm" style={{ height: '100%', animationDelay: '200ms' }} />
                  <div className="w-1 bg-gray-800 rounded-full animate-[pulse_0.8s_ease-in-out_infinite] shadow-sm" style={{ height: '70%', animationDelay: '400ms' }} />
                  <div className="w-1 bg-gray-800 rounded-full animate-[pulse_0.8s_ease-in-out_infinite] shadow-sm" style={{ height: '40%', animationDelay: '600ms' }} />
                </div>
              )}
              
              {/* Processing/Thinking: 3 Animated Dots */}
              {voiceState === 'processing' && (
                <div className="flex gap-1 justify-center items-center">
                  <div className="w-1.5 h-1.5 bg-gray-800 rounded-full animate-bounce shadow-sm" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 bg-gray-800 rounded-full animate-bounce shadow-sm" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 bg-gray-800 rounded-full animate-bounce shadow-sm" style={{ animationDelay: '300ms' }} />
                </div>
              )}

              {/* Speaking: AI talking */}
              {voiceState === 'speaking' && (
                <Volume2 className="w-5 h-5 text-gray-800 drop-shadow-md animate-pulse" />
              )}

            </div>
          </div>
        </button>
      </div>

      {/* AI Dialog & Voice State Display */}
      <div className="text-center mb-6 min-h-[100px] flex flex-col items-center justify-start max-w-2xl px-4 animate-in fade-in zoom-in-95 duration-500">
        {voiceState === 'listening' ? (
          <div>
            <h2 className="text-2xl md:text-3xl font-medium tracking-wide drop-shadow-lg mb-2">
              <Shimmer className="[--color-background:#ffffff] [--color-muted-foreground:rgba(255,255,255,0.3)]">
                Escuchando...
              </Shimmer>
            </h2>
          </div>
        ) : voiceState === 'processing' ? (
          <div>
            <h2 className="text-2xl md:text-3xl font-medium tracking-wide drop-shadow-lg mb-2">
              <Shimmer className="[--color-background:#ffffff] [--color-muted-foreground:rgba(255,255,255,0.3)]">
                Pensando...
              </Shimmer>
            </h2>
          </div>
        ) : currentQuestion ? (
          <div key={currentQuestion} className="animate-in fade-in slide-in-from-bottom-6 duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)]">
            <h2 className="text-xl md:text-2xl font-medium tracking-wide leading-relaxed drop-shadow-lg pointer-events-none">
              {currentQuestion.split(' ').map((word, i, arr) => {
              // Smooth karaoke highlight logic: triggers word transition cleanly as progress sweeps
              const isActive = voiceState === 'speaking' ? (i / arr.length) <= (progress + 0.05) : true;
              return (
                <span 
                  key={i} 
                  className={`transition-colors duration-500 ease-out ${isActive ? 'text-white' : 'text-white/30'}`}
                >
                  {word}{' '}
                </span>
              )
            })}
          </h2>
          </div>
        ) : (
          <div>
            <h2 className="text-2xl md:text-3xl font-medium text-white tracking-wide drop-shadow-lg mb-2">
              {stateInfo.title}
            </h2>
          </div>
        )}
      </div>

      {/* Bottom Controls Area: Transcript & Settings */}
      <div className="flex flex-col items-center gap-4 mt-8 w-full max-w-sm">
        
        {/* Error Display */}
        {ttsError && (
          <div className="px-4 py-2 bg-red-500/10 backdrop-blur-md border border-red-500/20 rounded-full text-center">
            <p className="text-red-400 text-xs font-medium">{ttsError}</p>
          </div>
        )}

        {/* Reserved space to stop UI jumping, holding the Transcript Box */}
        <div className="h-10 relative flex justify-center items-end w-full">
          {/* Transcript Box */}
          {(voiceState === 'listening' || transcript) && (
            <div className="absolute bottom-0 flex items-start px-4 py-2.5 bg-[#171717]/95 backdrop-blur-xl border border-white/5 rounded-2xl text-xs text-white/90 w-fit max-w-[320px] sm:max-w-[400px] shadow-[0_8px_30px_rgba(0,0,0,0.4)] transition-all duration-300 transform translate-y-[-10px]">
              
              {/* Red Recording Block */}
              <div className="flex-shrink-0 mt-[2px] mr-3 w-3 h-3 rounded-[3px] bg-[#ff5a5a] shadow-[0_0_8px_rgba(255,90,90,0.4)]" />

              {/* Transcript Text */}
              <div className="flex-1 mr-3 font-medium tracking-wide break-words leading-relaxed overflow-hidden">
                {transcript ? (
                  <span>{transcript}</span>
                ) : (
                  <Shimmer className="[--color-background:#ffffff] [--color-muted-foreground:rgba(255,255,255,0.4)]">
                    Transcribiendo...
                  </Shimmer>
                )}
              </div>
              
              {/* Clear Window Button (X) */}
              <button
                onClick={() => {
                  setTranscript('')
                  transcriptRef.current = ''
                }}
                className="flex-shrink-0 mt-[1px] hover:bg-white/10 p-0.5 rounded-full transition-colors flex items-center justify-center outline-none"
                title="Descartar"
              >
                <X className="w-4 h-4 text-white/40 hover:text-white/80 transition-colors" />
              </button>
            </div>
          )}
        </div>

        {/* Manual Send Button (Only shows in manual mode when ready) */}
        {transcript && !silenceTimer && (
          <button
            onClick={handleAutoSend}
            className="px-6 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white text-xs font-medium rounded-full transition-all duration-300 hover:scale-105 border border-white/20 shadow-lg"
          >
            Enviar respuesta
          </button>
        )}

        {/* Voice Settings Toggle */}
        <VoiceSettingsToggle disabled={disabled || isLoading} />
      </div>
    </div>
  )
}