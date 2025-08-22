import { IconAlertCircle } from '@tabler/icons-react'
import { 
  Monitor, Cpu, Network, GraduationCap, Star, TrendingUp,
  Stethoscope, Scale, Briefcase, Heart, Palette, Calculator,
  Building2, Users, Wrench, BookOpen, Camera, Music
} from 'lucide-react'
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
  isResuming?: boolean
}

// Helper function to get career icon
const getCareerIcon = (careerName: string) => {
  const name = careerName.toLowerCase()
  
  // Technology & Engineering
  if (name.includes('informática') || name.includes('programación') || name.includes('software')) {
    return Monitor
  }
  if (name.includes('computación') || name.includes('hardware') || name.includes('electrónica')) {
    return Cpu
  }
  if (name.includes('sistemas') || name.includes('redes') || name.includes('telecomunicaciones')) {
    return Network
  }
  if (name.includes('ingeniería') && (name.includes('mecánica') || name.includes('industrial'))) {
    return Wrench
  }
  
  // Health & Medicine
  if (name.includes('medicina') || name.includes('médico') || name.includes('salud')) {
    return Stethoscope
  }
  if (name.includes('psicología') || name.includes('terapia') || name.includes('social')) {
    return Heart
  }
  
  // Business & Law
  if (name.includes('derecho') || name.includes('abogado') || name.includes('legal')) {
    return Scale
  }
  if (name.includes('administración') || name.includes('negocios') || name.includes('gestión')) {
    return Briefcase
  }
  if (name.includes('contabilidad') || name.includes('finanzas') || name.includes('economía')) {
    return Calculator
  }
  
  // Arts & Creative
  if (name.includes('arte') || name.includes('diseño') || name.includes('creatividad')) {
    return Palette
  }
  if (name.includes('música') || name.includes('musical')) {
    return Music
  }
  if (name.includes('comunicación') || name.includes('periodismo') || name.includes('fotografía')) {
    return Camera
  }
  
  // Education & Social
  if (name.includes('educación') || name.includes('pedagogía') || name.includes('docencia')) {
    return BookOpen
  }
  if (name.includes('recursos humanos') || name.includes('sociología')) {
    return Users
  }
  
  // Architecture & Construction
  if (name.includes('arquitectura') || name.includes('construcción') || name.includes('civil')) {
    return Building2
  }
  
  return GraduationCap // Default icon
}

// Helper function to format AI message with career recommendations
const formatAIMessage = (message: string, careerSuggestions?: any[]) => {
  // Remove markdown formatting
  let formatted = message.replace(/\*\*(.*?)\*\*/g, '$1')
  
  // If there are career suggestions, extract the intro text and format careers separately
  if (careerSuggestions && careerSuggestions.length > 0) {
    // Find the intro text before career listings
    const introMatch = formatted.match(/^(.*?)(?=\d+\.\s*\*?\*?[A-ZÁÉÍÓÚ])/s)
    const introText = introMatch ? introMatch[1].trim() : ''
    
    return {
      introText,
      hasCareerList: true,
      careers: careerSuggestions
    }
  }
  
  // For regular messages, just clean up and split into paragraphs
  const paragraphs = formatted
    .split(/\n\n+/)
    .map(p => p.trim())
    .filter(p => p.length > 0)
  
  return {
    paragraphs,
    hasCareerList: false
  }
}

export function VoiceBubbleStatusDisplay({
  state,
  transcript,
  currentAIResponse,
  speechRecognitionAvailable,
  isSpeaking = false,
  sessionResults,
  isResuming = false
}: VoiceBubbleStatusDisplayProps) {
  const getStateMessage = (state: ConversationalBubbleState): string => {
    switch (state) {
      case 'listening':
        return 'Te estoy escuchando'
      case 'speaking':
        if (isResuming) {
          return '🔄 Reanudando conversación...'
        }
        return isSpeaking ? '🎙️ ARIA está hablando...' : 'ARIA está preparando su respuesta'
      case 'thinking':
        return 'Procesando tu respuesta'
      case 'session-starting':
        return 'Iniciando conversación'
      case 'enhanced-exploration':
        return '🔍 Exploración profunda en curso'
      case 'career-matching':
        return '🎯 Analizando compatibilidad de carreras'
      case 'reality-check':
        return '⚠️ Reality Check: Preguntas discriminatorias'
      case 'final-results':
        return '🏆 Generando resultados finales'
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
      case 'enhanced-exploration':
        return 'Realizando preguntas profundas sobre tus intereses, habilidades y valores. Este proceso tomará 12-15 preguntas para un perfil RIASEC completo.'
      case 'career-matching':
        return 'Analizando tu perfil vocacional completo para identificar las 3 carreras más compatibles contigo...'
      case 'reality-check':
        return 'Fase de verificación: evaluando si estás preparado/a para los aspectos más desafiantes de tus carreras ideales.'
      case 'final-results':
        return 'Compilando tu evaluación completa con resultados ajustados por reality check...'
      case 'results-display':
        return '¡Perfecto! He analizado tus respuestas y aquí están tus carreras ideales. La página de resultados detallados se cargará en unos segundos...'
      default:
        return 'Tu asistente de orientación vocacional conversacional con metodología enhanced + reality check. Haz clic para comenzar.'
    }
  }

  const getPhaseTranslation = (phase: string): string => {
    const translations: Record<string, string> = {
      'greeting': 'Saludo',
      'enhanced_exploration': 'Exploración Profunda',
      'career_matching': 'Análisis de Carreras',
      'reality_check': 'Reality Check',
      'final_results': 'Resultados Finales',
      'complete': 'Completa',
      // Legacy phases for backward compatibility
      'exploration': 'Exploración',
      'assessment': 'Evaluación',
      'recommendation': 'Recomendación',
      'career_exploration': 'Exploración de Carreras'
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
      {currentAIResponse && (state === 'speaking' || state === 'listening') && (() => {
        // Only show career suggestions when it's appropriate (not during questions)
        const shouldShowCareers = (currentAIResponse.intent === 'recommendation' || 
                                  currentAIResponse.intent === 'completion_check') &&
                                  currentAIResponse.nextPhase !== 'reality_check' &&
                                  sessionResults?.conversationPhase !== 'reality_check'
        const formattedContent = formatAIMessage(currentAIResponse.message, shouldShowCareers ? currentAIResponse.careerSuggestions : undefined)
        
        return (
          <div 
            className="p-8 rounded-3xl max-w-4xl mx-auto"
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
            <div className="flex items-center justify-center gap-4 mb-6">
              <span className="text-blue-400 text-sm font-semibold">
                ARIA
              </span>
              <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
              <span className="text-slate-400 text-sm uppercase tracking-wider">
                {currentAIResponse.intent}
              </span>
            </div>
            
            {formattedContent.hasCareerList ? (
              <div className="space-y-6">
                {/* Intro Text */}
                {formattedContent.introText && (
                  <p className="text-white text-lg font-medium leading-relaxed text-center">
                    {formattedContent.introText}
                  </p>
                )}
                
                {/* Career Recommendations */}
                <div className="space-y-4">
                  {formattedContent.careers.map((career: any, index: number) => {
                    const IconComponent = getCareerIcon(career.name)
                    return (
                      <div 
                        key={career.careerId}
                        className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10 hover:bg-white/8 transition-all duration-300"
                      >
                        <div className="flex items-start gap-4">
                          {/* Ranking Badge */}
                          <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                            index === 0 ? 'bg-yellow-500 text-black' :
                            index === 1 ? 'bg-slate-400 text-white' :
                            'bg-orange-600 text-white'
                          }`}>
                            {index + 1}
                          </div>
                          
                          {/* Career Icon */}
                          <div className="flex-shrink-0 w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                            <IconComponent className="w-6 h-6 text-blue-400" />
                          </div>
                          
                          {/* Career Content */}
                          <div className="flex-1 space-y-2">
                            <div className="flex items-start justify-between gap-4">
                              <h4 className="text-white font-bold text-lg leading-tight">
                                {career.name}
                              </h4>
                              <div className="flex items-center gap-1 bg-green-500/20 px-3 py-1 rounded-full flex-shrink-0">
                                <TrendingUp className="w-4 h-4 text-green-400" />
                                <span className="text-green-400 font-semibold text-sm">
                                  {career.confidence}%
                                </span>
                              </div>
                            </div>
                            <p className="text-white/80 text-sm leading-relaxed">
                              {career.reasoning}
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
                
                {/* RIASEC Assessment Display (if available) */}
                {currentAIResponse.riasecAssessment && (
                  <div className="mt-6 bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
                        <Star className="w-5 h-5 text-purple-400" />
                      </div>
                      <div>
                        <h4 className="text-white font-semibold">Tu Perfil RIASEC</h4>
                        <p className="text-white/60 text-sm">{currentAIResponse.riasecAssessment.confidence}% de confianza</p>
                      </div>
                    </div>
                    <p className="text-white/80 text-sm leading-relaxed">
                      {currentAIResponse.riasecAssessment.reasoning}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              /* Regular message formatting */
              <div className="space-y-4">
                {formattedContent.paragraphs?.map((paragraph: string, index: number) => (
                  <p key={index} className="text-white text-lg font-medium leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            )}
          </div>
        )
      })()}

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