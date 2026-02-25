// UIModeSwitcher component
// Responsibility: Switch between chat and voice interface modes

import { MessageCircle, Mic } from 'lucide-react'

export type UIMode = 'chat' | 'voice'

interface UIModeSwitcherProps {
  currentMode: UIMode
  onModeChange: (mode: UIMode) => void
  disabled?: boolean
}

export function UIModeSwitcher({ currentMode, onModeChange, disabled = false }: UIModeSwitcherProps) {
  return (
    <div className="flex items-center justify-center mb-6">
      {/* 3D Deep Embedded Pill Track */}
      <div className="relative flex items-center p-1.5 bg-[#020617]/60 border border-white/5 rounded-full backdrop-blur-xl shadow-[inset_0_4px_10px_rgba(0,0,0,0.8),inset_0_-1px_2px_rgba(255,255,255,0.05)]">
        
        {/* Animated 3D Sliding Blue Thumb */}
        <div 
          className={`
            absolute left-1.5 top-1.5 bottom-1.5 w-[88px] bg-gradient-to-r from-blue-600 to-indigo-600 border border-white/10 shadow-[inset_0_2px_4px_rgba(255,255,255,0.3),0_4px_12px_rgba(59,130,246,0.3)] rounded-full transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]
            ${currentMode === 'chat' ? 'translate-x-[88px]' : 'translate-x-0'}
          `}
        />

        {/* Voice Mode Button */}
        <button
          onClick={() => onModeChange('voice')}
          disabled={disabled}
          className={`
            relative z-10 flex items-center justify-center gap-2 w-[88px] h-8 rounded-full transition-colors duration-300 text-xs font-semibold tracking-wide outline-none
            ${currentMode === 'voice' 
              ? 'text-white drop-shadow-md' 
              : 'text-white/40 hover:text-white/70'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
        >
          <Mic className="w-3.5 h-3.5" />
          Voz
        </button>

        {/* Chat Mode Button */}
        <button
          onClick={() => onModeChange('chat')}
          disabled={disabled}
          className={`
            relative z-10 flex items-center justify-center gap-2 w-[88px] h-8 rounded-full transition-colors duration-300 text-xs font-semibold tracking-wide outline-none
            ${currentMode === 'chat' 
              ? 'text-white drop-shadow-md' 
              : 'text-white/40 hover:text-white/70'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
        >
          <MessageCircle className="w-3.5 h-3.5" />
          Chat
        </button>
      </div>
    </div>
  )
}