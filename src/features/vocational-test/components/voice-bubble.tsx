import { useState, useEffect, useRef } from 'react'
import { IconMicrophone, IconVolume, IconBrain } from '@tabler/icons-react'

type VoiceBubbleState = 'idle' | 'listening' | 'speaking' | 'thinking'

export function VoiceBubble() {
  const [state, setState] = useState<VoiceBubbleState>('idle')
  const bubbleRef = useRef<HTMLButtonElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    // Animated particle system
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
        maxLife: 100 + Math.random() * 100
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, 400, 400)
      
      // Add new particles
      if (particles.length < 50 && Math.random() < 0.3) {
        particles.push(createParticle())
      }

      // Update and draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.life++
        p.x += p.vx
        p.y += p.vy

        const alpha = 1 - (p.life / p.maxLife)
        const size = (1 - p.life / p.maxLife) * 2

        if (state === 'listening') {
          ctx.fillStyle = `rgba(34, 197, 94, ${alpha * 0.6})`
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
  }, [state])

  const handleClick = () => {
    if (state === 'idle') {
      setState('listening')
      setTimeout(() => setState('thinking'), 3000)
      setTimeout(() => setState('speaking'), 5000)
      setTimeout(() => setState('idle'), 8000)
    }
  }

  const getStateStyles = () => {
    switch (state) {
      case 'listening':
        return {
          background: `
            radial-gradient(circle at 30% 30%, 
              rgba(34, 197, 94, 0.4) 0%, 
              rgba(34, 197, 94, 0.2) 35%,
              rgba(34, 197, 94, 0.1) 70%,
              transparent 100%
            ),
            linear-gradient(135deg, 
              rgba(255, 255, 255, 0.15) 0%, 
              rgba(255, 255, 255, 0.05) 100%
            )
          `,
          boxShadow: `
            0 0 60px rgba(34, 197, 94, 0.4),
            0 0 100px rgba(34, 197, 94, 0.2),
            inset 0 2px 0 rgba(255, 255, 255, 0.2)
          `,
          border: '2px solid rgba(34, 197, 94, 0.3)',
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
            radial-gradient(circle at 30% 30%, 
              rgba(59, 130, 246, 0.3) 0%, 
              rgba(147, 51, 234, 0.2) 35%,
              rgba(59, 130, 246, 0.1) 70%,
              transparent 100%
            ),
            linear-gradient(135deg, 
              rgba(255, 255, 255, 0.1) 0%, 
              rgba(255, 255, 255, 0.05) 100%
            )
          `,
          boxShadow: `
            0 20px 40px rgba(59, 130, 246, 0.2),
            0 10px 20px rgba(147, 51, 234, 0.1),
            inset 0 2px 0 rgba(255, 255, 255, 0.1)
          `,
          border: '2px solid rgba(255, 255, 255, 0.1)',
        }
    }
  }

  const renderContent = () => {
    switch (state) {
      case 'listening':
        return (
          <div className="flex flex-col items-center space-y-4">
            <IconMicrophone size={48} className="text-white animate-pulse" />
            <AudioWaveform color="rgb(34, 197, 94)" />
          </div>
        )
      case 'speaking':
        return (
          <div className="flex flex-col items-center space-y-4">
            <IconVolume size={48} className="text-white" />
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
      default:
        return (
          <div className="flex flex-col items-center space-y-4">
            <IconMicrophone size={56} className="text-white group-hover:scale-110 transition-transform duration-300" />
            <div className="text-center">
              <div className="text-white font-bold text-lg">ARIA</div>
              <div className="text-white/70 text-sm">Haz clic para hablar</div>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="relative flex flex-col items-center space-y-8">
      {/* Particle Canvas Background */}
      <canvas
        ref={canvasRef}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{ width: '300px', height: '300px' }}
      />

      {/* Main Voice Bubble */}
      <div className="relative">
        <button
          ref={bubbleRef}
          onClick={handleClick}
          disabled={state === 'thinking' || state === 'speaking'}
          className="relative group transition-all duration-500 ease-out hover:scale-105 disabled:cursor-not-allowed"
          style={{
            width: '240px',
            height: '240px',
            borderRadius: '50%',
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            ...getStateStyles(),
          }}
        >
          {/* Inner Content */}
          <div className="absolute inset-0 flex items-center justify-center">
            {renderContent()}
          </div>

          {/* Ripple Effect */}
          {state !== 'idle' && (
            <>
              <div className="absolute inset-0 rounded-full animate-ping opacity-20" style={getStateStyles()} />
              <div className="absolute inset-0 rounded-full animate-pulse opacity-30" style={getStateStyles()} />
            </>
          )}
        </button>

        {/* Orbital Rings */}
        <div className="absolute inset-0 pointer-events-none">
          <div 
            className="absolute inset-0 rounded-full border opacity-20 animate-spin"
            style={{ 
              borderColor: state === 'listening' ? 'rgb(34, 197, 94)' : 
                          state === 'speaking' ? 'rgb(59, 130, 246)' : 
                          state === 'thinking' ? 'rgb(147, 51, 234)' : 'rgba(255, 255, 255, 0.3)',
              borderWidth: '1px',
              borderStyle: 'dashed',
              animationDuration: '10s'
            }}
          />
          <div 
            className="absolute inset-[-20px] rounded-full border opacity-10 animate-spin"
            style={{ 
              borderColor: state === 'listening' ? 'rgb(34, 197, 94)' : 
                          state === 'speaking' ? 'rgb(59, 130, 246)' : 
                          state === 'thinking' ? 'rgb(147, 51, 234)' : 'rgba(255, 255, 255, 0.2)',
              borderWidth: '1px',
              borderStyle: 'dotted',
              animationDuration: '15s',
              animationDirection: 'reverse'
            }}
          />
        </div>
      </div>
      
      {/* Status Display */}
      <div className="text-center space-y-3 max-w-md">
        <h3 className="text-2xl font-bold text-white">
          {getStateMessage(state)}
        </h3>
        <p className="text-slate-400 text-base leading-relaxed">
          {getStateDescription(state)}
        </p>
      </div>
    </div>
  )
}

function AudioWaveform({ color }: { color: string }) {
  return (
    <div className="flex items-center justify-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="rounded-full animate-pulse"
          style={{
            width: '3px',
            height: `${12 + i * 4}px`,
            backgroundColor: color,
            animationDelay: `${i * 0.1}s`,
            animationDuration: '1s',
          }}
        />
      ))}
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
      return 'Hablando contigo'
    case 'thinking':
      return 'Analizando respuesta'
    default:
      return '¡Hola! Soy ARIA'
  }
}

function getStateDescription(state: VoiceBubbleState): string {
  switch (state) {
    case 'listening':
      return 'Habla claramente sobre tus intereses, pasatiempos y lo que te motiva profesionalmente'
    case 'speaking':
      return 'Escucha atentamente mi pregunta y prepárate para responder'
    case 'thinking':
      return 'Procesando tu respuesta con inteligencia artificial para generar la siguiente pregunta'
        default:
      return 'Tu asistente de orientación vocacional impulsada por IA. Haz clic para comenzar tu evaluación personalizada'
  }
}
