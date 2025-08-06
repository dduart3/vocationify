import { useState, useEffect, useRef } from 'react'
import { IconMicrophone, IconVolume, IconBrain, IconAlertCircle } from '@tabler/icons-react'
import { useCreateConversationalSession, useSendMessage, useConversationalResults } from '../hooks'
import { useAuthStore } from '@/stores/auth-store'
import type { ConversationResponse } from '../types'
import '../styles/voice-bubble.css'

// TypeScript declarations for Web Speech API
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList
  resultIndex: number
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string
  message?: string
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  maxAlternatives: number
  start(): void
  stop(): void
  abort(): void
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null
  onend: ((this: SpeechRecognition, ev: Event) => any) | null
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null
}

interface SpeechRecognitionStatic {
  new(): SpeechRecognition
}

declare global {
  interface Window {
    SpeechRecognition: SpeechRecognitionStatic
    webkitSpeechRecognition: SpeechRecognitionStatic
  }
}

type ConversationalBubbleState = 'idle' | 'listening' | 'speaking' | 'thinking' | 'session-starting'

interface ConversationalVoiceBubbleProps {
  onTestComplete?: (sessionId: string) => void
}

export function ConversationalVoiceBubble({ onTestComplete }: ConversationalVoiceBubbleProps) {
  const { user } = useAuthStore()
  const [state, setState] = useState<ConversationalBubbleState>('idle')
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [audioLevel, setAudioLevel] = useState(0)
  const [isRecording, setIsRecording] = useState(false)
  const [morphPhase, setMorphPhase] = useState(0)
  const [transcript, setTranscript] = useState('')
  const [isListeningToSpeech, setIsListeningToSpeech] = useState(false)
  const [speechRecognitionAvailable, setSpeechRecognitionAvailable] = useState(false)
  const [currentAIResponse, setCurrentAIResponse] = useState<ConversationResponse | null>(null)
  
  const bubbleRef = useRef<HTMLButtonElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const animationFrameRef = useRef<number>(0)
  const speechRecognitionRef = useRef<SpeechRecognition | null>(null)

  // API hooks
  const createSession = useCreateConversationalSession()
  const sendMessage = useSendMessage()
  const { data: sessionResults } = useConversationalResults(sessionId || '', !!sessionId)

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      const recognition = new SpeechRecognition()
      
      recognition.continuous = false
      recognition.interimResults = true
      recognition.lang = 'es-VE' // Venezuelan Spanish
      recognition.maxAlternatives = 1
      
      recognition.onstart = () => {
        setIsListeningToSpeech(true)
        setTranscript('')
      }
      
      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let finalTranscript = ''
        let interimTranscript = ''
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            finalTranscript += transcript
          } else {
            interimTranscript += transcript
          }
        }
        
        setTranscript(finalTranscript || interimTranscript)
      }
      
      recognition.onend = () => {
        setIsListeningToSpeech(false)
      }
      
      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error)
        setIsListeningToSpeech(false)
      }
      
      speechRecognitionRef.current = recognition
      setSpeechRecognitionAvailable(true)
    } else {
      console.warn('Speech Recognition not supported in this browser')
      setSpeechRecognitionAvailable(false)
    }
    
    return () => {
      if (speechRecognitionRef.current) {
        speechRecognitionRef.current.abort()
      }
    }
  }, [])

  // Morphing animation for idle state
  useEffect(() => {
    if (state === 'idle') {
      const interval = setInterval(() => {
        setMorphPhase(prev => (prev + 1) % 4)
      }, 3750)
      
      return () => clearInterval(interval)
    }
  }, [state])

  // Audio visualization setup
  useEffect(() => {
    if (state === 'listening' && isRecording) {
      const startAudioVisualization = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
          const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
          const analyser = audioContext.createAnalyser()
          const microphone = audioContext.createMediaStreamSource(stream)
          
          analyser.smoothingTimeConstant = 0.8
          analyser.fftSize = 256
          microphone.connect(analyser)
          
          audioContextRef.current = audioContext
          analyserRef.current = analyser
          
          const bufferLength = analyser.frequencyBinCount
          const dataArray = new Uint8Array(bufferLength)
          
          const updateAudioLevel = () => {
            if (!analyserRef.current) return
            
            analyserRef.current.getByteFrequencyData(dataArray)
            const average = dataArray.reduce((sum, value) => sum + value, 0) / bufferLength
            setAudioLevel(average / 255)
            
            if (state === 'listening') {
              animationFrameRef.current = requestAnimationFrame(updateAudioLevel)
            }
          }
          
          updateAudioLevel()
        } catch (error) {
          console.error('Error accessing microphone:', error)
        }
      }
      
      startAudioVisualization()
    }
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [state, isRecording])

  // Enhanced particle system with audio reactivity
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = 400
    canvas.height = 400

    const particles: Array<{
      x: number
      y: number
      vx: number
      vy: number
      life: number
      maxLife: number
      baseRadius: number
    }> = []

    const createParticle = () => {
      const angle = Math.random() * Math.PI * 2
      const radius = 80 + Math.random() * 40
      return {
        x: 200 + Math.cos(angle) * radius,
        y: 200 + Math.sin(angle) * radius,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        life: 0,
        maxLife: 100 + Math.random() * 100,
        baseRadius: Math.random() * 2 + 1
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, 400, 400)
      
      // Create sound waves when listening
      if (state === 'listening' && audioLevel > 0.1) {
        const waveCount = Math.floor(audioLevel * 10) + 1
        for (let i = 0; i < waveCount; i++) {
          particles.push(createParticle())
        }
      } else if (particles.length < 30 && Math.random() < 0.2) {
        particles.push(createParticle())
      }

      // Update and draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.life++
        p.x += p.vx
        p.y += p.vy

        const alpha = 1 - (p.life / p.maxLife)
        const audioBoost = state === 'listening' ? (1 + audioLevel * 2) : 1
        const size = (1 - p.life / p.maxLife) * p.baseRadius * audioBoost

        if (state === 'listening') {
          const intensity = audioLevel * 0.8 + 0.2
          ctx.fillStyle = `rgba(34, 197, 94, ${alpha * intensity})`
        } else if (state === 'speaking') {
          ctx.fillStyle = `rgba(59, 130, 246, ${alpha * 0.6})`
        } else if (state === 'thinking') {
          ctx.fillStyle = `rgba(147, 51, 234, ${alpha * 0.6})`
        } else {
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.3})`
        }

        ctx.beginPath()
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2)
        ctx.fill()

        if (p.life >= p.maxLife) {
          particles.splice(i, 1)
        }
      }

      requestAnimationFrame(animate)
    }

    animate()
  }, [state, audioLevel])

  // Check if conversation is complete
  useEffect(() => {
    if (sessionResults?.conversationPhase === 'complete') {
      setState('idle')
      onTestComplete?.(sessionResults.sessionId)
    }
  }, [sessionResults, onTestComplete])

  const handleClick = async () => {
    if (state === 'idle') {
      try {
        setState('session-starting')
        const session = await createSession.mutateAsync(user?.id)
        setSessionId(session.sessionId)
        setCurrentAIResponse(session.greeting)
        
        // ARIA is speaking the greeting
        setState('speaking')
        
        // Simulate ARIA speaking time, then listen
        setTimeout(() => {
          setState('listening')
          setIsRecording(true)
          // Start speech recognition
          if (speechRecognitionRef.current) {
            speechRecognitionRef.current.start()
          }
        }, 3000)
        
      } catch (error) {
        console.error('Failed to start conversational session:', error)
        setState('idle')
      }
    } else if (state === 'listening') {
      // Stop listening and process response
      setState('thinking')
      setIsRecording(false)
      
      // Stop speech recognition
      if (speechRecognitionRef.current) {
        speechRecognitionRef.current.stop()
      }
      
      // Process the transcript and send to AI
      setTimeout(async () => {
        try {
          if (!transcript.trim()) {
            // No transcript, restart listening
            setState('listening')
            setIsRecording(true)
            if (speechRecognitionRef.current) {
              speechRecognitionRef.current.start()
            }
            return
          }

          const response = await sendMessage.mutateAsync({
            sessionId: sessionId!,
            message: transcript
          })
          
          setCurrentAIResponse(response)
          setTranscript('') // Clear transcript
          
          // ARIA is responding
          setState('speaking')
          
          // Wait for ARIA to "speak", then continue conversation
          setTimeout(() => {
            if (response.nextPhase !== 'complete') {
              setState('listening')
              setIsRecording(true)
              // Start speech recognition for next response
              if (speechRecognitionRef.current) {
                speechRecognitionRef.current.start()
              }
            } else {
              setState('idle')
            }
          }, 3000)
          
        } catch (error) {
          console.error('Failed to send message:', error)
          setState('listening')
          setIsRecording(true)
          // Restart speech recognition on error
          if (speechRecognitionRef.current) {
            speechRecognitionRef.current.start()
          }
        }
      }, 2000)
    }
  }

  const getMorphedBorderRadius = () => {
    if (state !== 'idle') return '50%'
    
    const morphShapes = [
      '50% 50% 50% 50% / 50% 50% 50% 50%', // Perfect circle
      '51.5% 48.5% 50% 50% / 48.5% 51.5% 50% 50%', // Slight morph
      '50% 50% 48.5% 51.5% / 50% 50% 51.5% 48.5%', // Different direction
      '48.5% 51.5% 50% 50% / 51.5% 48.5% 50% 50%', // Back to subtle
    ]
    
    return morphShapes[morphPhase]
  }

  const getMorphedClipPath = () => {
    if (state !== 'idle') return 'none'
    
    const morphClipPaths = [
      'ellipse(50% 50% at 50% 50%)', // Perfect circle
      'ellipse(52% 48% at 49% 51%)', // Slight vertical stretch, offset
      'ellipse(48% 52% at 51% 49%)', // Slight horizontal stretch, offset  
      'ellipse(51% 49% at 50% 50%)', // Minor oval
    ]
    
    return morphClipPaths[morphPhase]
  }

  const getStateStyles = () => {
    const audioIntensity = state === 'listening' ? audioLevel : 0
    const pulseIntensity = 0.3 + audioIntensity * 0.7
    
    switch (state) {
      case 'listening':
        return {
          background: `
            radial-gradient(circle at 30% 30%, 
              rgba(34, 197, 94, ${0.4 + audioIntensity * 0.3}) 0%, 
              rgba(34, 197, 94, ${0.2 + audioIntensity * 0.2}) 35%,
              rgba(34, 197, 94, ${0.1 + audioIntensity * 0.1}) 70%,
              transparent 100%
            ),
            linear-gradient(135deg, 
              rgba(255, 255, 255, 0.15) 0%, 
              rgba(255, 255, 255, 0.05) 100%
            )
          `,
          boxShadow: `
            0 0 ${60 + audioIntensity * 40}px rgba(34, 197, 94, ${pulseIntensity}),
            0 0 ${100 + audioIntensity * 60}px rgba(34, 197, 94, ${pulseIntensity * 0.5}),
            inset 0 2px 0 rgba(255, 255, 255, 0.2)
          `,
          border: `2px solid rgba(34, 197, 94, ${0.3 + audioIntensity * 0.4})`,
          transform: `scale(${1 + audioIntensity * 0.05})`,
        }
      case 'session-starting':
        return {
          background: `
            radial-gradient(circle at 30% 30%, 
              rgba(59, 130, 246, 0.3) 0%, 
              rgba(147, 51, 234, 0.2) 35%,
              rgba(59, 130, 246, 0.1) 70%,
              transparent 100%
            ),
            linear-gradient(135deg, 
              rgba(255, 255, 255, 0.15) 0%, 
              rgba(255, 255, 255, 0.05) 100%
            )
          `,
          boxShadow: `
            0 0 80px rgba(59, 130, 246, 0.4),
            0 0 120px rgba(147, 51, 234, 0.3),
            inset 0 2px 0 rgba(255, 255, 255, 0.2)
          `,
          border: '2px solid rgba(59, 130, 246, 0.4)',
        }
      case 'speaking':
        return {
          background: `
            radial-gradient(circle at 30% 30%, 
              rgba(59, 130, 246, 0.4) 0%, 
              rgba(59, 130, 246, 0.2) 35%,
              rgba(59, 130, 246, 0.1) 70%,
              transparent 100%
            ),
            linear-gradient(135deg, 
              rgba(255, 255, 255, 0.15) 0%, 
              rgba(255, 255, 255, 0.05) 100%
            )
          `,
          boxShadow: `
            0 0 60px rgba(59, 130, 246, 0.4),
            0 0 100px rgba(59, 130, 246, 0.2),
            inset 0 2px 0 rgba(255, 255, 255, 0.2)
          `,
          border: '2px solid rgba(59, 130, 246, 0.3)',
        }
      case 'thinking':
        return {
          background: `
            radial-gradient(circle at 30% 30%, 
              rgba(147, 51, 234, 0.4) 0%, 
              rgba(147, 51, 234, 0.2) 35%,
              rgba(147, 51, 234, 0.1) 70%,
              transparent 100%
            ),
            linear-gradient(135deg, 
              rgba(255, 255, 255, 0.15) 0%, 
              rgba(255, 255, 255, 0.05) 100%
            )
          `,
          boxShadow: `
            0 0 60px rgba(147, 51, 234, 0.4),
            0 0 100px rgba(147, 51, 234, 0.2),
            inset 0 2px 0 rgba(255, 255, 255, 0.2)
          `,
          border: '2px solid rgba(147, 51, 234, 0.3)',
        }
      default:
        return {
          background: `
            radial-gradient(ellipse at 25% 25%, 
              rgba(255, 255, 255, 0.15) 0%, 
              rgba(59, 130, 246, 0.1) 25%,
              rgba(147, 51, 234, 0.08) 50%,
              rgba(59, 130, 246, 0.05) 75%,
              transparent 100%
            ),
            radial-gradient(ellipse at 75% 75%, 
              rgba(147, 51, 234, 0.1) 0%, 
              rgba(59, 130, 246, 0.05) 50%,
              transparent 100%
            ),
            linear-gradient(135deg, 
              rgba(255, 255, 255, 0.08) 0%, 
              rgba(255, 255, 255, 0.02) 100%
            )
          `,
          boxShadow: `
            inset 0 1px 0 rgba(255, 255, 255, 0.2),
            inset 0 -1px 0 rgba(255, 255, 255, 0.05)
          `,
          border: '1px solid rgba(255, 255, 255, 0.15)',
        }
    }
  }

  const renderContent = () => {
    switch (state) {
      case 'listening':
        return (
          <div className="flex flex-col items-center space-y-4">
            <IconMicrophone 
              size={48 + audioLevel * 8} 
              className="text-white animate-pulse" 
              style={{ 
                filter: `drop-shadow(0 0 ${10 + audioLevel * 20}px rgba(34, 197, 94, 0.8))` 
              }} 
            />
            <AudioWaveform color="rgb(34, 197, 94)" intensity={audioLevel} />
            {isListeningToSpeech && (
              <div className="flex items-center justify-center gap-1 text-green-400 text-xs mt-2 animate-pulse">
                <IconMicrophone className="w-3 h-3" />
                <span>Escuchando...</span>
              </div>
            )}
          </div>
        )
      case 'speaking':
        return (
          <div className="flex flex-col items-center space-y-4">
            <IconVolume size={48} className="text-white animate-bounce" />
            <SpeechWaves />
          </div>
        )
      case 'thinking':
        return (
          <div className="flex flex-col items-center space-y-4">
            <IconBrain size={48} className="text-white animate-spin" style={{ animationDuration: '3s' }} />
            <ThinkingDots />
          </div>
        )
      case 'session-starting':
        return (
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <IconBrain size={48} className="text-white animate-pulse" />
              <div className="absolute inset-0 animate-ping">
                <IconBrain size={48} className="text-blue-400 opacity-75" />
              </div>
            </div>
            <div className="text-center">
              <div className="text-white font-bold text-sm">Iniciando conversación...</div>
            </div>
          </div>
        )
      default:
        return (
          <div className="flex flex-col items-center space-y-6">
            <div className="relative">
              <IconMicrophone 
                size={64} 
                className="text-white group-hover:scale-125 transition-all duration-500 drop-shadow-lg" 
                style={{
                  filter: 'drop-shadow(0 0 20px rgba(255, 255, 255, 0.3))',
                }}
              />
              <div className="absolute inset-0 animate-ping opacity-20">
                <IconMicrophone size={64} className="text-blue-400" />
              </div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-white font-bold text-2xl tracking-wide">ARIA</div>
              <div className="text-white/80 text-sm font-medium">Toca para conversar</div>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="relative flex flex-col items-center space-y-12 py-8">
      {/* Particle Canvas Background */}
      <canvas
        ref={canvasRef}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{ width: '350px', height: '350px' }}
      />

      {/* Main Voice Bubble Container */}
      <div className="relative p-8">
        <button
          ref={bubbleRef}
          onClick={handleClick}
          disabled={state === 'thinking' || state === 'speaking'}
          className="relative group transition-all duration-700 ease-out hover:scale-105 disabled:cursor-not-allowed"
          style={{
            width: '260px',
            height: '260px',
            borderRadius: getMorphedBorderRadius(),
            backdropFilter: 'blur(32px) saturate(200%)',
            WebkitBackdropFilter: 'blur(32px) saturate(200%)',
            clipPath: getMorphedClipPath(),
            animation: state === 'idle' ? 'float 6s ease-in-out infinite' : 
                       state === 'listening' ? 'breathe 2s ease-in-out infinite' : undefined,
            overflow: 'visible',
            transition: state === 'idle' ? 'clip-path 2s ease-in-out, border-radius 2s ease-in-out' : 'border-radius 0.7s ease-in-out',
            ...getStateStyles(),
          }}
        >
          {/* Bubble highlight */}
          <div className="bubble-highlight" />
          
          {/* Secondary highlight */}
          <div 
            className="absolute top-40% right-25% w-6 h-6 bg-white/20 rounded-full blur-sm"
            style={{
              animation: 'highlight-float 5s ease-in-out infinite reverse',
            }}
          />

          {/* Inner Content */}
          <div className="absolute inset-0 flex items-center justify-center z-10">
            {renderContent()}
          </div>

          {/* Subtle listening indicator */}
          {state === 'listening' && (
            <div 
              className="absolute inset-0 border border-green-400/20 opacity-0"
              style={{
                borderRadius: 'inherit',
                animation: 'liquidRipple 4s ease-out infinite',
              }}
            />
          )}
        </button>

        {/* Subtle orbital ring - only when active */}
        {state !== 'idle' && (
          <div className="absolute inset-[-10px] pointer-events-none">
            <div 
              className="absolute inset-0 rounded-full border opacity-15 animate-spin"
              style={{ 
                borderColor: state === 'listening' ? 'rgb(34, 197, 94)' : 
                            state === 'speaking' ? 'rgb(59, 130, 246)' : 
                            state === 'thinking' ? 'rgb(147, 51, 234)' : 'rgba(255, 255, 255, 0.3)',
                borderWidth: '1px',
                borderStyle: 'dashed',
                animationDuration: '8s'
              }}
            />
          </div>
        )}
      </div>
      
      {/* Status Display */}
      <div className="text-center space-y-6 max-w-3xl px-4">
        <div className="space-y-3">
          <h3 className="text-3xl font-bold text-white">
            {getStateMessage(state)}
          </h3>
          <p className="text-slate-400 text-lg leading-relaxed max-w-xl mx-auto">
            {getStateDescription(state, transcript, currentAIResponse)}
          </p>
        </div>
        
        {/* Current AI Message Display */}
        {currentAIResponse && (state === 'speaking' || state === 'listening') && (
          <div 
            className="p-8 rounded-3xl"
            style={{
              background: `
                linear-gradient(135deg, 
                  rgba(255, 255, 255, 0.12) 0%, 
                  rgba(255, 255, 255, 0.06) 100%
                )
              `,
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
            }}
          >
            <div className="flex items-center justify-center gap-4 mb-4">
              <span className="text-blue-400 text-sm font-semibold">
                ARIA
              </span>
              <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
              <span className="text-slate-400 text-sm uppercase tracking-wider">
                {currentAIResponse.intent}
              </span>
            </div>
            <p className="text-white text-xl font-medium leading-relaxed">
              {currentAIResponse.message}
            </p>
          </div>
        )}

        {/* Speech Recognition Warning */}
        {!speechRecognitionAvailable && (
          <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 max-w-md mx-auto">
            <div className="flex items-center justify-center gap-2">
              <IconAlertCircle className="w-5 h-5 text-yellow-400" />
              <p className="text-yellow-400 text-sm text-center">
                Reconocimiento de voz no disponible en este navegador. 
                Usa Chrome para mejor experiencia.
              </p>
            </div>
          </div>
        )}

        {/* Conversation Progress */}
        {sessionResults && (
          <div className="text-slate-500 text-sm space-y-2">
            <div>Fase: {getPhaseTranslation(sessionResults.conversationPhase)}</div>
            <div>Confianza: {sessionResults.confidenceLevel}%</div>
            <div>{sessionResults.conversationHistory.length} mensajes</div>
          </div>
        )}
      </div>
    </div>
  )
}

// Helper components remain the same as the original voice bubble
function AudioWaveform({ color, intensity = 0 }: { color: string; intensity?: number }) {
  return (
    <div className="flex items-center justify-center gap-1">
      {Array.from({ length: 7 }).map((_, i) => {
        const baseHeight = 8 + i * 3
        const dynamicHeight = baseHeight + (intensity * 20)
        return (
          <div
            key={i}
            className="rounded-full animate-pulse transition-all duration-150"
            style={{
              width: '2px',
              height: `${dynamicHeight}px`,
              backgroundColor: color,
              animationDelay: `${i * 0.1}s`,
              animationDuration: `${0.8 + intensity}s`,
              opacity: 0.6 + intensity * 0.4,
              boxShadow: `0 0 ${intensity * 10}px ${color}`,
            }}
          />
        )
      })}
    </div>
  )
}

function SpeechWaves() {
  return (
    <div className="flex items-center justify-center space-x-1">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
          style={{
            animationDelay: `${i * 0.2}s`,
            animationDuration: '1.4s',
          }}
        />
      ))}
    </div>
  )
}

function ThinkingDots() {
  return (
    <div className="flex space-x-2">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="w-3 h-3 bg-purple-400 rounded-full animate-pulse"
          style={{
            animationDelay: `${i * 0.3}s`,
            animationDuration: '1.5s',
          }}
        />
      ))}
    </div>
  )
}

function getStateMessage(state: ConversationalBubbleState): string {
  switch (state) {
    case 'listening':
      return 'Te estoy escuchando'
    case 'speaking':
      return 'ARIA está hablando'
    case 'thinking':
      return 'Procesando tu respuesta'
    case 'session-starting':
      return 'Iniciando conversación'
    default:
      return '¡Hola! Soy ARIA'
  }
}

function getStateDescription(
  state: ConversationalBubbleState, 
  transcript?: string, 
  _currentResponse?: ConversationResponse | null
): string {
  switch (state) {
    case 'listening':
      if (transcript && transcript.trim()) {
        return `Escuchando: "${transcript}". Haz clic cuando termines de hablar.`
      }
      return 'Comparte tus pensamientos conmigo. Haz clic nuevamente cuando termines de hablar.'
    case 'speaking':
      return 'Escucha mi respuesta y prepárate para continuar nuestra conversación.'
    case 'thinking':
      return 'Analizando tu respuesta y preparando mi siguiente pregunta...'
    case 'session-starting':
      return 'Iniciando tu sesión de orientación vocacional conversacional...'
    default:
      return 'Tu asistente de orientación vocacional conversacional. Haz clic para comenzar una charla natural sobre tu futuro.'
  }
}

function getPhaseTranslation(phase: string): string {
  const translations: Record<string, string> = {
    'greeting': 'Saludo',
    'exploration': 'Exploración',
    'assessment': 'Evaluación',
    'recommendation': 'Recomendación',
    'complete': 'Completa'
  }
  return translations[phase] || phase
}