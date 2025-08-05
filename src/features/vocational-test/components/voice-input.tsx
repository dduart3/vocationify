import { IconMicrophone, IconPlayerStop, IconCheck, IconAlertCircle, IconMessageCircle } from '@tabler/icons-react'

interface VoiceInputProps {
  isListening: boolean
  transcript: string
  isSupported: boolean
  error: string | null
  onStartListening: () => void
  onStopListening: () => void
  onSubmitResponse: () => void
  disabled?: boolean
}

export function VoiceInput({
  isListening,
  transcript,
  isSupported,
  error,
  onStartListening,
  onStopListening,
  onSubmitResponse,
  disabled = false
}: VoiceInputProps) {
  const hasTranscript = transcript.trim().length > 0

  if (!isSupported) {
    return (
      <div className="text-center p-6 rounded-2xl bg-yellow-500/10 border border-yellow-500/20">
        <IconAlertCircle className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
        <h3 className="text-yellow-400 font-semibold mb-2">
          Reconocimiento de voz no disponible
        </h3>
        <p className="text-yellow-400/80 text-sm">
          Tu navegador no soporta reconocimiento de voz. 
          Usa Chrome o cambia al modo texto.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Voice Input Button */}
      <div className="flex justify-center">
        <button
          onClick={isListening ? onStopListening : onStartListening}
          disabled={disabled}
          className={`
            relative p-6 rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed
            ${isListening 
              ? 'bg-red-500/20 hover:bg-red-500/30 border-2 border-red-400/50' 
              : 'bg-green-500/20 hover:bg-green-500/30 border-2 border-green-400/50'
            }
          `}
        >
          {isListening ? (
            <>
              <IconPlayerStop className="w-8 h-8 text-red-400" />
              <div className="absolute inset-0 rounded-full animate-ping bg-red-400/20"></div>
            </>
          ) : (
            <IconMicrophone className="w-8 h-8 text-green-400" />
          )}
        </button>
      </div>

      {/* Status and Instructions */}
      <div className="text-center">
        {isListening ? (
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2">
              <IconMicrophone className="w-4 h-4 text-green-400 animate-pulse" />
              <p className="text-green-400 font-medium animate-pulse">
                Escuchando...
              </p>
            </div>
            <p className="text-slate-400 text-sm">
              Haz clic en el botón rojo para detener
            </p>
          </div>
        ) : (
          <p className="text-slate-400 text-sm">
            Haz clic en el micrófono y responde por voz
          </p>
        )}
      </div>

      {/* Live Transcript */}
      {transcript && (
        <div 
          className="p-4 rounded-xl bg-green-500/10 border border-green-500/20"
        >
          <div className="flex items-start gap-3">
            <IconMessageCircle className="w-5 h-5 text-green-400 mt-1" />
            <div>
              <p className="text-green-400 text-sm font-medium mb-1">
                Tu respuesta:
              </p>
              <p className="text-white text-base leading-relaxed">
                "{transcript}"
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
          <div className="flex items-center gap-2">
            <IconAlertCircle className="w-5 h-5 text-red-400" />
            <p className="text-red-400 text-sm">
              Error: {error}. Intenta de nuevo.
            </p>
          </div>
        </div>
      )}

      {/* Submit Button */}
      {hasTranscript && !isListening && (
        <div className="flex justify-center pt-4">
          <button
            onClick={onSubmitResponse}
            disabled={disabled}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <IconCheck className="w-5 h-5 text-white" />
            <span className="text-white font-medium">Enviar respuesta</span>
          </button>
        </div>
      )}
    </div>
  )
}