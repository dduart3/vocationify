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
      <div className="relative flex items-center p-1.5 bg-slate-200/80 border border-slate-300 rounded-full backdrop-blur-md shadow-inner">
        
        {/* Animated 3D Sliding Blue Thumb */}
        <div 
          className={`
            absolute left-1.5 top-1.5 bottom-1.5 w-[88px] bg-gradient-to-b from-blue-500 to-blue-600 border border-blue-400/50 shadow-[inset_0_2px_4px_rgba(255,255,255,0.4),0_2px_6px_rgba(37,99,235,0.4)] rounded-full transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]
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
              ? 'text-white' 
              : 'text-slate-500 hover:text-slate-700'
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
              ? 'text-white' 
              : 'text-slate-500 hover:text-slate-700'
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