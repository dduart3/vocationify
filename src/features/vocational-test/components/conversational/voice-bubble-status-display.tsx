import { IconAlertCircle } from '@tabler/icons-react'
import type { ConversationResponse } from '../../types'
import type { ConversationalBubbleState } from './types'

interface VoiceBubbleStatusDisplayProps {
  state: ConversationalBubbleState
  transcript: string
  currentAIResponse: ConversationResponse | null
  speechRecognitionAvailable: boolean
  isSpeaking?: boolean
  sessionResults?: {
    conversationPhase: string
    confidenceLevel: number
    conversationHistory: Array<{ role: string; content: string }>
  } | null
}

export function VoiceBubbleStatusDisplay({
  state,
  transcript,
  currentAIResponse,
  speechRecognitionAvailable,
  isSpeaking = false,
  sessionResults
}: VoiceBubbleStatusDisplayProps) {
  const getStateMessage = (state: ConversationalBubbleState): string => {
    switch (state) {
      case 'listening':
        return 'Te estoy escuchando'
      case 'speaking':
        return isSpeaking ? '🎙️ ARIA está hablando...' : 'ARIA está preparando su respuesta'
      case 'thinking':
        return 'Procesando tu respuesta'
      case 'session-starting':
        return 'Iniciando conversación'
      case 'results-display':
        return '🎉 ¡Aquí están tus resultados!'
      default:
        return '¡Hola! Soy ARIA'
    }
  }

  const getStateDescription = (
    state: ConversationalBubbleState, 
    transcript?: string, 
    _currentResponse?: ConversationResponse | null
  ): string => {
    switch (state) {
      case 'listening':
        if (transcript && transcript.trim()) {
          return `Escuchando: "${transcript}". Haz clic cuando termines de hablar.`
        }
        return 'Habla libremente. Te escucho y procesaré tu respuesta automáticamente.'
      case 'speaking':
        return isSpeaking ? 
          'Escucha mi respuesta. Cuando termine de hablar, comenzaré a escucharte automáticamente.' :
          'Preparando mi respuesta...'
      case 'thinking':
        return 'Analizando tu respuesta y preparando mi siguiente pregunta...'
      case 'session-starting':
        return 'Iniciando tu sesión de orientación vocacional conversacional...'
      case 'results-display':
        return '¡Perfecto! He analizado tus respuestas y aquí están tus carreras ideales. La página de resultados detallados se cargará en unos segundos...'
      default:
        return 'Tu asistente de orientación vocacional conversacional. Haz clic para comenzar una charla natural sobre tu futuro.'
    }
  }

  const getPhaseTranslation = (phase: string): string => {
    const translations: Record<string, string> = {
      'greeting': 'Saludo',
      'exploration': 'Exploración',
      'assessment': 'Evaluación',
      'recommendation': 'Recomendación',
      'complete': 'Completa'
    }
    return translations[phase] || phase
  }

  return (
    <div className="text-center space-y-6 max-w-3xl px-4">
      <div className="space-y-3">
        <h3 className="text-3xl font-bold text-white">
          {getStateMessage(state)}
        </h3>
        <p className="text-slate-400 text-lg leading-relaxed max-w-xl mx-auto">
          {getStateDescription(state, transcript, currentAIResponse)}
        </p>
      </div>
      
      {/* Current AI Message Display */}
      {currentAIResponse && (state === 'speaking' || state === 'listening') && (
        <div 
          className="p-8 rounded-3xl"
          style={{
            background: `
              linear-gradient(135deg, 
                rgba(255, 255, 255, 0.12) 0%, 
                rgba(255, 255, 255, 0.06) 100%
              )
            `,
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
          }}
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <span className="text-blue-400 text-sm font-semibold">
              ARIA
            </span>
            <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
            <span className="text-slate-400 text-sm uppercase tracking-wider">
              {currentAIResponse.intent}
            </span>
          </div>
          <p className="text-white text-xl font-medium leading-relaxed">
            {currentAIResponse.message}
          </p>
        </div>
      )}

      {/* Speech Recognition Warning */}
      {!speechRecognitionAvailable && (
        <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 max-w-md mx-auto">
          <div className="flex items-center justify-center gap-2">
            <IconAlertCircle className="w-5 h-5 text-yellow-400" />
            <p className="text-yellow-400 text-sm text-center">
              Reconocimiento de voz no disponible en este navegador. 
              Usa Chrome para mejor experiencia.
            </p>
          </div>
        </div>
      )}

      {/* Conversation Progress */}
      {sessionResults && (
        <div className="text-slate-500 text-sm space-y-2">
          <div>Fase: {getPhaseTranslation(sessionResults.conversationPhase)}</div>
          <div>Confianza: {sessionResults.confidenceLevel}%</div>
          <div>{sessionResults.conversationHistory.length} mensajes</div>
        </div>
      )}
    </div>
  )
}