import { useState, useEffect } from 'react'
import { IconPlayerPlay, IconLoader2, IconMicrophone, IconVolume, IconTarget, IconTrophy } from '@tabler/icons-react'
import { useCreateSession, useNextQuestion, useSubmitResponse } from '../hooks'
import { useSpeechRecognition } from '../hooks/use-speech-recognition'
import { useTextToSpeech } from '../hooks/use-text-to-speech'
import { useAuthStore } from '@/stores/auth-store'
import { QuestionDisplay } from './question-display'
import { VoiceInput } from './voice-input'
import { processTranscriptToValue, getResponseDescription, getResponseColor } from '../utils/response-processor'

type TestState = 'idle' | 'starting' | 'active' | 'processing' | 'completed'

interface VoiceTestControllerProps {
  onTestComplete?: (sessionId: string) => void
}

export function VoiceTestController({ onTestComplete }: VoiceTestControllerProps) {
  const { user } = useAuthStore()
  const [testState, setTestState] = useState<TestState>('idle')
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [questionOrder, setQuestionOrder] = useState(1)
  const [lastResponse, setLastResponse] = useState<{ value: number; transcript: string } | null>(null)

  // API hooks
  const createSession = useCreateSession()
  const { data: currentQuestion, isLoading: loadingQuestion, error: questionError } = useNextQuestion(sessionId || '', !!sessionId)
  const submitResponse = useSubmitResponse()

  // Debug logging (temporarily disabled)
  // useEffect(() => {
  //   console.log('VoiceTestController Debug:', {
  //     testState,
  //     sessionId,
  //     currentQuestion,
  //     loadingQuestion,
  //     questionError,
  //     questionType: typeof currentQuestion,
  //     questionKeys: currentQuestion ? Object.keys(currentQuestion) : 'none'
  //   })
  // }, [testState, sessionId, currentQuestion, loadingQuestion, questionError])

  // Speech hooks
  const speechRecognition = useSpeechRecognition({
    language: 'es-VE',
    continuous: false,
    interimResults: true
  })

  const textToSpeech = useTextToSpeech({
    language: 'es-VE',
    rate: 0.9,
    pitch: 1,
    volume: 0.8
  })

  // Auto-speak questions when they load
  useEffect(() => {
    if (currentQuestion && testState === 'active' && textToSpeech.isSupported && !textToSpeech.isSpeaking) {
      const actualQuestion = currentQuestion?.question || currentQuestion
      if (actualQuestion?.text) {
        const questionText = `${actualQuestion.text}. Responde hablando claramente.`
        setTimeout(() => {
          textToSpeech.speak(questionText)
        }, 500) // Small delay for better UX
      }
    }
  }, [currentQuestion, testState, textToSpeech.isSupported]) // Removed textToSpeech object from deps to prevent loop

  // Check if test is complete
  useEffect(() => {
    if (sessionId && !currentQuestion && !loadingQuestion && testState === 'active') {
      setTestState('completed')
      onTestComplete?.(sessionId)
    }
  }, [sessionId, currentQuestion, loadingQuestion, testState, onTestComplete])

  const startTest = async () => {
    try {
      setTestState('starting')
      const sessionData = await createSession.mutateAsync(user?.id)
      setSessionId(sessionData.id)
      setQuestionOrder(1)
      setLastResponse(null)
      speechRecognition.resetTranscript()
      
      // The first question is already returned from session creation
      console.log('Session created with first question:', sessionData)
      
      setTimeout(() => {
        setTestState('active')
      }, 1000)
    } catch (error) {
      console.error('Failed to start test:', error)
      setTestState('idle')
    }
  }

  const handleSpeakQuestion = () => {
    const actualQuestion = currentQuestion?.question || currentQuestion
    if (actualQuestion && textToSpeech.isSupported) {
      const questionText = `Pregunta ${questionOrder}. ${actualQuestion.text}. Responde hablando claramente.`
      textToSpeech.speak(questionText)
    }
  }

  const handleReplayQuestion = () => {
    handleSpeakQuestion()
  }

  const handleSubmitResponse = async () => {
    if (!currentQuestion || !sessionId || !speechRecognition.transcript.trim()) {
      return
    }

    try {
      setTestState('processing')
      
      const actualQuestion = currentQuestion?.question || currentQuestion
      const responseValue = processTranscriptToValue(speechRecognition.transcript)
      setLastResponse({
        value: responseValue,
        transcript: speechRecognition.transcript
      })

      await submitResponse.mutateAsync({
        sessionId,
        question_id: actualQuestion.id,
        question_text: actualQuestion.text,
        question_category: actualQuestion.category,
        response_value: responseValue,
        response_time: 5000, // Approximate time
        question_order: questionOrder,
        riasec_weights: actualQuestion.riasec_weights,
      })

      setQuestionOrder(prev => prev + 1)
      speechRecognition.resetTranscript()
      
      setTimeout(() => {
        setTestState('active')
      }, 1500)
      
    } catch (error) {
      console.error('Failed to submit response:', error)
      setTestState('active')
    }
  }

  const renderContent = () => {
    switch (testState) {
      case 'idle':
        return (
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl font-bold text-white">
                Test Vocacional RIASEC
              </h2>
              <p className="text-slate-300 text-lg max-w-2xl mx-auto leading-relaxed">
                Descubre tu perfil vocacional respondiendo preguntas por voz. 
                ARIA te guiará a través del proceso de manera interactiva.
              </p>
            </div>

            <button
              onClick={startTest}
              disabled={createSession.isPending}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {createSession.isPending ? (
                <IconLoader2 className="w-6 h-6 text-white animate-spin" />
              ) : (
                <IconPlayerPlay className="w-6 h-6 text-white" />
              )}
              <span className="text-white font-semibold text-lg">
                {createSession.isPending ? 'Iniciando...' : 'Comenzar Test'}
              </span>
            </button>

            {/* Feature highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto pt-8">
              {[
                { icon: IconMicrophone, title: 'Respuestas por voz', desc: 'Habla naturalmente', color: 'text-green-400' },
                { icon: IconVolume, title: 'Audio interactivo', desc: 'ARIA lee las preguntas', color: 'text-blue-400' },
                { icon: IconTarget, title: 'Análisis preciso', desc: 'Basado en modelo RIASEC', color: 'text-purple-400' }
              ].map((feature, index) => {
                const IconComponent = feature.icon
                return (
                  <div
                    key={index}
                    className="p-6 rounded-xl bg-white/5 border border-white/10"
                  >
                    <div className="flex justify-center mb-3">
                      <IconComponent className={`w-8 h-8 ${feature.color}`} />
                    </div>
                    <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
                    <p className="text-slate-400 text-sm">{feature.desc}</p>
                  </div>
                )
              })}
            </div>
          </div>
        )

      case 'starting':
        return (
          <div className="text-center space-y-6">
            <IconLoader2 className="w-16 h-16 text-blue-400 animate-spin mx-auto" />
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Iniciando tu sesión...
              </h2>
              <p className="text-slate-400">
                Preparando el test vocacional personalizado
              </p>
            </div>
          </div>
        )

      case 'active':
        // Show error state if there's an API error
        if (questionError) {
          return (
            <div className="text-center space-y-6">
              <div className="p-6 rounded-xl bg-red-500/10 border border-red-500/20">
                <h2 className="text-xl font-bold text-red-400 mb-2">
                  Error al cargar preguntas
                </h2>
                <p className="text-red-300 text-sm mb-4">
                  {questionError?.message || 'No se pudieron cargar las preguntas del test'}
                </p>
                <div className="space-y-2 text-xs text-slate-400">
                  <p>Debug Info:</p>
                  <p>Session ID: {sessionId}</p>
                  <p>Estado: {testState}</p>
                  <p>Cargando: {loadingQuestion ? 'Sí' : 'No'}</p>
                </div>
                <button
                  onClick={() => setTestState('idle')}
                  className="mt-4 px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors"
                >
                  Volver al inicio
                </button>
              </div>
            </div>
          )
        }

        return (
          <div className="space-y-8">
            <QuestionDisplay
              question={currentQuestion}
              questionNumber={questionOrder}
              onReplayQuestion={handleReplayQuestion}
              onSpeakQuestion={handleSpeakQuestion}
              isSpeaking={textToSpeech.isSpeaking}
              canSpeak={textToSpeech.isSupported}
              isLoading={loadingQuestion}
            />

            <VoiceInput
              isListening={speechRecognition.isListening}
              transcript={speechRecognition.transcript}
              isSupported={speechRecognition.isSupported}
              error={speechRecognition.error}
              onStartListening={speechRecognition.startListening}
              onStopListening={speechRecognition.stopListening}
              onSubmitResponse={handleSubmitResponse}
            />

            {/* Progress indicator */}
            {questionOrder > 1 && (
              <div className="text-center">
                <p className="text-slate-500 text-sm">
                  {questionOrder - 1} respuestas completadas
                </p>
              </div>
            )}
          </div>
        )

      case 'processing':
        return (
          <div className="text-center space-y-6">
            <IconLoader2 className="w-12 h-12 text-purple-400 animate-spin mx-auto" />
            <div>
              <h2 className="text-xl font-bold text-white mb-2">
                Procesando tu respuesta...
              </h2>
              {lastResponse && (
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 max-w-md mx-auto">
                  <p className="text-slate-300 text-sm mb-2">Interpretaste:</p>
                  <p className="text-white">"{lastResponse.transcript}"</p>
                  <p className="text-sm mt-2">
                    Como: <span className={getResponseColor(lastResponse.value)}>
                      {getResponseDescription(lastResponse.value)}
                    </span>
                  </p>
                </div>
              )}
            </div>
          </div>
        )

      case 'completed':
        return (
          <div className="text-center space-y-6">
            <div className="flex justify-center mb-4">
              <IconTrophy className="w-16 h-16 text-yellow-400" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">
                ¡Test Completado!
              </h2>
              <p className="text-slate-300 text-lg">
                Hemos analizado tus respuestas y generado tu perfil vocacional
              </p>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      {renderContent()}
    </div>
  )
}