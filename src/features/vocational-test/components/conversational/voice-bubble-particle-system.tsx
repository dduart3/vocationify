import { useEffect, useRef } from 'react'
import type { ConversationalBubbleState } from './types'

interface VoiceBubbleParticleSystemProps {
  state: ConversationalBubbleState
  audioLevel: number
}

export function VoiceBubbleParticleSystem({ state, audioLevel }: VoiceBubbleParticleSystemProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

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
        const size = Math.max(0, (1 - p.life / p.maxLife) * p.baseRadius * audioBoost)

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

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
      style={{ width: '350px', height: '350px' }}
    />
  )
}