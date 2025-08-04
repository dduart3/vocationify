import { useState, useEffect, useRef } from 'react'
import { IconMicrophone, IconVolume, IconBrain } from '@tabler/icons-react'
import { useCreateSession, useNextQuestion, useSubmitResponse } from '../hooks'
import { useAuthStore } from '@/stores/auth-store'
import '../styles/voice-bubble.css'

type VoiceBubbleState = 'idle' | 'listening' | 'speaking' | 'thinking' | 'session-starting'

interface VoiceBubbleProps {
  onTestComplete?: (sessionId: string) => void
}

export function VoiceBubble({ onTestComplete }: VoiceBubbleProps) {
  const { user } = useAuthStore()
  const [state, setState] = useState<VoiceBubbleState>('idle')
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [questionOrder, setQuestionOrder] = useState(1)
  const [audioLevel, setAudioLevel] = useState(0)
  const [isRecording, setIsRecording] = useState(false)
  
  const bubbleRef = useRef<HTMLButtonElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const animationFrameRef = useRef<number>()

  // API hooks
  const createSession = useCreateSession()
  const { data: currentQuestion, isLoading: loadingQuestion } = useNextQuestion(sessionId || '', !!sessionId)
  const submitResponse = useSubmitResponse()

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
            setAudioLevel(average / 255) // Normalize to 0-1
            
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

  // Check if test is complete
  useEffect(() => {
    if (sessionId && !currentQuestion && !loadingQuestion) {
      setState('idle')
      onTestComplete?.(sessionId)
    }
  }, [sessionId, currentQuestion, loadingQuestion, onTestComplete])

  const handleClick = async () => {
    if (state === 'idle') {
      try {
        setState('session-starting')
        const session = await createSession.mutateAsync(user?.id)
        setSessionId(session.id)
        
        // Wait for first question to load
        setTimeout(() => {
          if (currentQuestion) {
            setState('speaking')
            // Simulate ARIA speaking the question
            setTimeout(() => {
              setState('listening')
              setIsRecording(true)
            }, 3000)
          }
        }, 1000)
        
      } catch (error) {
        console.error('Failed to start session:', error)
        setState('idle')
      }
    } else if (state === 'listening') {
      // Stop listening and process response
      setState('thinking')
      setIsRecording(false)
      
      // Simulate voice processing and submit response
      setTimeout(async () => {
        try {
          const responseValue = Math.floor(Math.random() * 5) + 1 // Mock response for now
          
          await submitResponse.mutateAsync({
            sessionId: sessionId!,
            question_id: currentQuestion!.id,
            question_text: currentQuestion!.text,
            question_category: currentQuestion!.category,
            response_value: responseValue,
            response_time: 3000,
            question_order: questionOrder,
            riasec_weights: currentQuestion!.riasec_weights,
          })
          
          setQuestionOrder(prev => prev + 1)
          
          // Wait for next question to load or complete test
          setTimeout(() => {
            if (currentQuestion) {
              setState('speaking')
              setTimeout(() => {
                setState('listening')
                setIsRecording(true)
              }, 2000)
            } else {
              setState('idle')
            }
          }, 1000)
          
        } catch (error) {
          console.error('Failed to submit response:', error)
          setState('listening')
          setIsRecording(true)
        }
      }, 2000)
    }
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
            0 25px 50px rgba(59, 130, 246, 0.15),
            0 15px 30px rgba(147, 51, 234, 0.1),
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
              <div className="text-white font-bold text-sm">Iniciando sesión...</div>
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
              <div className="text-white/80 text-sm font-medium">Toca para comenzar</div>
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

      {/* Main Voice Bubble Container - Extra padding to prevent cuts */}
      <div className="relative p-8">
        <button
          ref={bubbleRef}
          onClick={handleClick}
          disabled={state === 'thinking' || state === 'speaking'}
          className="relative group transition-all duration-700 ease-out hover:scale-105 disabled:cursor-not-allowed"
          style={{
            width: '260px',
            height: '260px',
            borderRadius: '50%',
            backdropFilter: 'blur(32px) saturate(200%)',
            WebkitBackdropFilter: 'blur(32px) saturate(200%)',
            animation: state === 'idle' ? 'float 6s ease-in-out infinite, morph 12s ease-in-out infinite' : 
                       state === 'listening' ? 'breathe 2s ease-in-out infinite' : undefined,
            overflow: 'visible',
            ...getStateStyles(),
          }}
        >
          {/* Surface tension effect */}
          <div 
            className="surface-tension" 
            style={{
              borderRadius: 'inherit',
              animation: 'surface-flow 12s linear infinite',
            }}
          />
          
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
            {getStateDescription(state)}
          </p>
        </div>
        
        {/* Current Question Display - Only when active */}
        {currentQuestion && (state === 'speaking' || state === 'listening') && (
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
                Pregunta {questionOrder}
              </span>
              <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
              <span className="text-slate-400 text-sm uppercase tracking-wider">
                {currentQuestion.category}
              </span>
            </div>
            <p className="text-white text-xl font-medium leading-relaxed">
              {currentQuestion.text}
            </p>
          </div>
        )}

        {/* Progress indicator - Simplified */}
        {sessionId && questionOrder > 1 && (
          <div className="text-slate-500 text-sm">
            {questionOrder - 1} respuestas completadas
          </div>
        )}
      </div>
    </div>
  )
}

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

function getStateMessage(state: VoiceBubbleState): string {
  switch (state) {
    case 'listening':
      return 'Te estoy escuchando'
    case 'speaking':
      return 'Nueva pregunta'
    case 'thinking':
      return 'Analizando respuesta'
    case 'session-starting':
      return 'Iniciando test vocacional'
    default:
      return '¡Hola! Soy ARIA'
  }
}

function getStateDescription(state: VoiceBubbleState): string {
  switch (state) {
    case 'listening':
      return 'Responde la pregunta hablando claramente. Haz clic nuevamente cuando termines.'
    case 'speaking':
      return 'Escucha atentamente la pregunta y prepárate para responder por voz.'
    case 'thinking':
      return 'Procesando tu respuesta con inteligencia artificial para generar la siguiente pregunta.'
    case 'session-starting':
      return 'Creando tu sesión personalizada de test vocacional...'
    default:
      return 'Tu asistente de orientación vocacional impulsada por IA. Haz clic para comenzar tu evaluación personalizada.'
  }
}
