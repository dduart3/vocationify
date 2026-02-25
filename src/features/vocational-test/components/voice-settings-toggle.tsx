// VoiceSettingsToggle component
// Responsibility: Toggle between auto and manual voice listening modes

import { Mic, X } from 'lucide-react'
import { useVoiceSettings } from '../hooks/use-voice-settings'

interface VoiceSettingsToggleProps {
  disabled?: boolean
  className?: string
}

export function VoiceSettingsToggle({ disabled = false, className = "" }: VoiceSettingsToggleProps) {
  const { settings, setListeningMode } = useVoiceSettings()

  return (
    <div className={`flex items-center justify-center ${className}`}>
      {/* 3D Deep Embedded Pill Container */}
      <div 
        className="relative flex items-center gap-1.5 p-1.5 bg-[#020617]/60 border border-white/5 rounded-full backdrop-blur-xl shadow-[inset_0_4px_10px_rgba(0,0,0,0.8),inset_0_-1px_2px_rgba(255,255,255,0.05)]"
      >
        {/* Animated 3D Sliding Thumb */}
        <div 
          className={`
            absolute left-1.5 top-1.5 w-11 h-11 bg-white/10 backdrop-blur-md border border-white/20 shadow-[inset_0_2px_4px_rgba(255,255,255,0.3),0_4px_10px_rgba(0,0,0,0.4)] rounded-full transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]
            ${settings.listeningMode === 'auto' ? 'translate-x-[50px]' : 'translate-x-0'}
          `}
        />

        {/* Manual Mode Button (X) */}
        <button
          onClick={() => setListeningMode('manual')}
          disabled={disabled}
          className={`
            relative z-10 w-11 h-11 flex items-center justify-center rounded-full transition-colors duration-300 outline-none group
            ${settings.listeningMode === 'manual' 
              ? 'text-white' 
              : 'text-white/30 hover:text-white/60'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
        >
          <X className="w-5 h-5 transition-transform duration-300 active:scale-90 group-active:scale-90" />

          {/* 3D Tooltip */}
          <div className="absolute bottom-full mb-3 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 left-1/2 -translate-x-1/2 whitespace-nowrap">
            <div className="px-3 py-1.5 bg-[#020617]/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[inset_0_1px_3px_rgba(255,255,255,0.2),0_4px_12px_rgba(0,0,0,0.5)] text-white text-xs font-medium tracking-wide">
              Modo Manual
            </div>
          </div>
        </button>
        
        {/* Auto Mode Button (Mic) */}
        <button
          onClick={() => setListeningMode('auto')}
          disabled={disabled}
          className={`
            relative z-10 w-11 h-11 flex items-center justify-center rounded-full transition-colors duration-300 outline-none group
            ${settings.listeningMode === 'auto' 
              ? 'text-white' 
              : 'text-white/30 hover:text-white/60'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
        >
          <Mic className="w-5 h-5 transition-transform duration-300 active:scale-90 group-active:scale-90" />

          {/* 3D Tooltip */}
          <div className="absolute bottom-full mb-3 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 left-1/2 -translate-x-1/2 whitespace-nowrap">
            <div className="px-3 py-1.5 bg-[#020617]/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[inset_0_1px_3px_rgba(255,255,255,0.2),0_4px_12px_rgba(0,0,0,0.5)] text-white text-xs font-medium tracking-wide">
              Escucha Continua
            </div>
          </div>
        </button>
      </div>
    </div>
  )
}

// Export the hook for direct access
export { useVoiceSettings }