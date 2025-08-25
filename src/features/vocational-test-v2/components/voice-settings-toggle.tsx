// VoiceSettingsToggle component
// Responsibility: Toggle between auto and manual voice listening modes

import { Zap, Hand } from 'lucide-react'
import { useVoiceSettings, type VoiceListeningMode } from '../hooks/use-voice-settings'

interface VoiceSettingsToggleProps {
  disabled?: boolean
  className?: string
}

export function VoiceSettingsToggle({ disabled = false, className = "" }: VoiceSettingsToggleProps) {
  const { settings, setListeningMode } = useVoiceSettings()

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div 
        className="flex bg-white/5 rounded-xl p-0.5 backdrop-blur-sm"
        style={{
          boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.08)'
        }}
      >
        <button
          onClick={() => setListeningMode('auto')}
          disabled={disabled}
          className={`
            flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-300 text-xs font-medium
            ${settings.listeningMode === 'auto' 
              ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md' 
              : 'text-white/60 hover:text-white/80 hover:bg-white/5'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
          title="Escucha automática después de cada respuesta de ARIA"
        >
          <Zap className="w-3 h-3" />
          Auto
        </button>
        
        <button
          onClick={() => setListeningMode('manual')}
          disabled={disabled}
          className={`
            flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-300 text-xs font-medium
            ${settings.listeningMode === 'manual' 
              ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md' 
              : 'text-white/60 hover:text-white/80 hover:bg-white/5'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
          title="Presionar botón para hablar cada vez"
        >
          <Hand className="w-3 h-3" />
          Manual
        </button>
      </div>
    </div>
  )
}

// Export the hook for direct access
export { useVoiceSettings }