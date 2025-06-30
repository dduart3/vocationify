import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { Mic, MicOff, Volume2 } from 'lucide-react'
import { cn } from '../lib/utils'
import { useVoice } from '../../hooks/use-voice'
import { Button } from './ui/button'

export function VoiceBubble() {
  const bubbleRef = useRef<HTMLDivElement>(null)
  const barsRef = useRef<HTMLDivElement>(null)
  const { 
    isListening, 
    isAiSpeaking, 
    transcript, 
    startListening, 
    stopListening,
    isSupported 
  } = useVoice()

  // Floating animation
  useEffect(() => {
    if (bubbleRef.current) {
      gsap.to(bubbleRef.current, {
        y: -10,
        duration: 2,
        ease: 'power2.inOut',
        yoyo: true,
        repeat: -1,
      })
    }
  }, [])

  // Pulse animation when listening
  useEffect(() => {
    if (bubbleRef.current) {
      if (isListening) {
        gsap.to(bubbleRef.current, {
          scale: 1.1,
          duration: 0.8,
          ease: 'power2.inOut',
          yoyo: true,
          repeat: -1,
        })
      } else {
        gsap.killTweensOf(bubbleRef.current)
        gsap.to(bubbleRef.current, {
          scale: 1,
          duration: 0.3,
        })
      }
    }
  }, [isListening])

  // Voice bars animation
  useEffect(() => {
    if (barsRef.current) {
      const bars = barsRef.current.children
      
      if (isListening || isAiSpeaking) {
        Array.from(bars).forEach((bar, index) => {
          gsap.to(bar, {
            scaleY: () => Math.random() * 2 + 0.5,
            duration: 0.3,
            ease: 'power2.inOut',
            repeat: -1,
            yoyo: true,
            delay: index * 0.1,
          })
        })
      } else {
        Array.from(bars).forEach((bar) => {
          gsap.killTweensOf(bar)
          gsap.to(bar, {
            scaleY: 0.2,
            duration: 0.3,
          })
        })
      }
    }
  }, [isListening, isAiSpeaking])

  if (!isSupported) {
    return null
  }

  const handleToggleListening = () => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }

  return (
    <div className="fixed bottom-8 right-8 z-50">
      {/* Voice Bubble */}
      <div
        ref={bubbleRef}
        className={cn(
          'relative mb-4 flex h-20 w-20 items-center justify-center rounded-full shadow-2xl transition-all duration-300',
          isListening && 'ring-4 ring-blue-300 ring-opacity-50',
          isAiSpeaking && 'ring-4 ring-green-300 ring-opacity-50',
          !isListening && !isAiSpeaking && 'bg-slate-100 hover:bg-slate-200'
        )}
        style={{
          background: isListening
            ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)'
            : isAiSpeaking
            ? 'linear-gradient(135deg, #10b981, #059669)'
            : 'linear-gradient(135deg, #f1f5f9, #e2e8f0)',
        }}
      >
        <Button
          onClick={handleToggleListening}
          disabled={isAiSpeaking}
          variant="ghost"
          size="icon"
          className="h-full w-full rounded-full border-0 bg-transparent text-white hover:bg-transparent"
        >
          {isAiSpeaking ? (
            <Volume2 className="h-8 w-8" />
          ) : isListening ? (
            <Mic className="h-8 w-8" />
          ) : (
            <MicOff className="h-6 w-6 text-slate-600" />
          )}
        </Button>

        {/* Ripple effect */}
        {(isListening || isAiSpeaking) && (
          <div className="absolute inset-0 rounded-full animate-ping opacity-20 bg-current" />
        )}
      </div>

      {/* Voice Bars */}
      <div
        ref={barsRef}
        className="flex items-end justify-center space-x-1 h-8"
      >
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className={cn(
              'w-1 bg-current rounded-full transform origin-bottom',
              isListening ? 'text-blue-500' : isAiSpeaking ? 'text-green-500' : 'text-slate-300'
            )}
            style={{
              height: '100%',
              transform: 'scaleY(0.2)',
            }}
          />
        ))}
      </div>

      {/* Transcript Display */}
      {transcript && (
        <div className="mt-4 max-w-xs rounded-lg bg-white p-3 shadow-lg border">
          <p className="text-sm text-slate-700">{transcript}</p>
        </div>
      )}
    </div>
  )
}
