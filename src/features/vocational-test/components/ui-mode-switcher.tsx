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
      <div 
        className="flex bg-white/5 rounded-2xl p-1 backdrop-blur-sm"
        style={{
          boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.1)'
        }}
      >
        <button
          onClick={() => onModeChange('voice')}
          disabled={disabled}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 text-sm font-medium
            ${currentMode === 'voice' 
              ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg' 
              : 'text-white/70 hover:text-white hover:bg-white/10'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
        >
          <Mic className="w-4 h-4" />
          Voz
        </button>
        
        <button
          onClick={() => onModeChange('chat')}
          disabled={disabled}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 text-sm font-medium
            ${currentMode === 'chat' 
              ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg' 
              : 'text-white/70 hover:text-white hover:bg-white/10'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
        >
          <MessageCircle className="w-4 h-4" />
          Chat
        </button>
      </div>
    </div>
  )
}