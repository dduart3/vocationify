import { useRef } from 'react'
import { IconMicrophone, IconVolume, IconBrain } from '@tabler/icons-react'
import { AudioWaveform, SpeechWaves, ThinkingDots } from './voice-bubble-animations'
import type { ConversationalBubbleState } from './types'

interface VoiceBubbleCoreProps {
  state: ConversationalBubbleState
  audioLevel: number
  isListeningToSpeech: boolean
  morphedBorderRadius: string
  morphedClipPath: string
  stateStyles: React.CSSProperties
  onClick: () => void
  disabled: boolean
}

export function VoiceBubbleCore({
  state,
  audioLevel,
  isListeningToSpeech,
  morphedBorderRadius,
  morphedClipPath,
  stateStyles,
  onClick,
  disabled
}: VoiceBubbleCoreProps) {
  const bubbleRef = useRef<HTMLButtonElement>(null)

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
    <div className="relative p-8">
      <button
        ref={bubbleRef}
        onClick={onClick}
        disabled={disabled}
        className="relative group transition-all duration-700 ease-out hover:scale-105 disabled:cursor-not-allowed"
        style={{
          width: '260px',
          height: '260px',
          borderRadius: morphedBorderRadius,
          backdropFilter: 'blur(32px) saturate(200%)',
          WebkitBackdropFilter: 'blur(32px) saturate(200%)',
          clipPath: morphedClipPath,
          animation: state === 'idle' ? 'float 6s ease-in-out infinite' : 
                     state === 'listening' ? 'breathe 2s ease-in-out infinite' : undefined,
          overflow: 'visible',
          transition: state === 'idle' ? 'clip-path 2s ease-in-out, border-radius 2s ease-in-out' : 'border-radius 0.7s ease-in-out',
          ...stateStyles,
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
  )
}