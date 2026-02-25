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
        className="relative flex items-center gap-1.5 p-1.5 bg-slate-200/80 border border-slate-300 rounded-full backdrop-blur-md shadow-inner"
      >
        {/* Animated 3D Sliding Thumb */}
        <div 
          className={`
            absolute left-1.5 top-1.5 w-11 h-11 bg-gradient-to-b from-slate-100 to-slate-200 border border-slate-300 shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),0_2px_6px_rgba(148,163,184,0.4)] rounded-full transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]
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
              ? 'text-slate-800' 
              : 'text-slate-500 hover:text-slate-700'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
        >
          <X className="w-5 h-5 transition-transform duration-300 active:scale-90 group-active:scale-90" />

          {/* 3D Tooltip */}
          <div className="absolute bottom-full mb-3 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 left-1/2 -translate-x-1/2 whitespace-nowrap">
            <div className="px-3 py-1.5 bg-white/90 backdrop-blur-md border border-slate-200 rounded-2xl shadow-[inset_0_1px_3px_rgba(255,255,255,0.9),0_4px_12px_rgba(148,163,184,0.3)] text-slate-700 text-xs font-medium tracking-wide">
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
              ? 'text-slate-800' 
              : 'text-slate-500 hover:text-slate-700'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
        >
          <Mic className="w-5 h-5 transition-transform duration-300 active:scale-90 group-active:scale-90" />

          {/* 3D Tooltip */}
          <div className="absolute bottom-full mb-3 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 left-1/2 -translate-x-1/2 whitespace-nowrap">
            <div className="px-3 py-1.5 bg-white/90 backdrop-blur-md border border-slate-200 rounded-2xl shadow-[inset_0_1px_3px_rgba(255,255,255,0.9),0_4px_12px_rgba(148,163,184,0.3)] text-slate-700 text-xs font-medium tracking-wide">
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