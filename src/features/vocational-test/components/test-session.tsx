import { useState, useEffect } from 'react'
import { useCreateSession, useNextQuestion, useSubmitResponse, useTestResults } from '../hooks'
import { useAuthStore } from '@/stores/auth-store'
import type { RiasecType } from '../types'

interface TestSessionProps {
  onComplete?: (sessionId: string) => void
}

export function TestSession({ onComplete }: TestSessionProps) {
  const { user } = useAuthStore()
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [questionOrder, setQuestionOrder] = useState(1)
  const [startTime, setStartTime] = useState<number>(Date.now())

  // Session hooks
  const createSession = useCreateSession()
  const { data: currentQuestion, isLoading: loadingQuestion } = useNextQuestion(sessionId || '', !!sessionId)
  const submitResponse = useSubmitResponse()
  const { data: results } = useTestResults(sessionId || '', false) // Don't fetch until test is complete

  // Start a new session
  const startTest = async () => {
    try {
      const session = await createSession.mutateAsync(user?.id)
      setSessionId(session.id)
      setStartTime(Date.now())
    } catch (error) {
      console.error('Failed to create session:', error)
    }
  }

  // Submit answer
  const handleAnswer = async (responseValue: number) => {
    if (!sessionId || !currentQuestion) return

    const responseTime = Date.now() - startTime
    
    try {
      await submitResponse.mutateAsync({
        sessionId,
        question_id: currentQuestion.id,
        question_text: currentQuestion.text,
        question_category: currentQuestion.category,
        response_value: responseValue,
        response_time: responseTime,
        question_order: questionOrder,
        riasec_weights: currentQuestion.riasec_weights,
      })

      setQuestionOrder(prev => prev + 1)
      setStartTime(Date.now()) // Reset timer for next question
    } catch (error) {
      console.error('Failed to submit response:', error)
    }
  }

  // Check if test is complete
  useEffect(() => {
    if (sessionId && !currentQuestion && !loadingQuestion) {
      // No more questions available - test is complete
      onComplete?.(sessionId)
    }
  }, [sessionId, currentQuestion, loadingQuestion, onComplete])

  if (!sessionId) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold text-white mb-4">¿Listo para comenzar?</h2>
        <p className="text-slate-300 mb-6">
          Tu test vocacional personalizado te ayudará a descubrir tu perfil RIASEC
        </p>
        <button
          onClick={startTest}
          disabled={createSession.isPending}
          className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-300 disabled:opacity-50"
        >
          {createSession.isPending ? 'Iniciando...' : 'Comenzar Test'}
        </button>
      </div>
    )
  }

  if (loadingQuestion) {
    return (
      <div className="text-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-slate-300">Cargando siguiente pregunta...</p>
      </div>
    )
  }

  if (!currentQuestion) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold text-white mb-4">¡Test Completado!</h2>
        <p className="text-slate-300 mb-6">
          Generando tus resultados personalizados...
        </p>
        <div className="animate-pulse flex space-x-4">
          <div className="rounded-full bg-slate-700 h-10 w-10"></div>
          <div className="flex-1 space-y-6 py-1">
            <div className="h-2 bg-slate-700 rounded"></div>
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-4">
                <div className="h-2 bg-slate-700 rounded col-span-2"></div>
                <div className="h-2 bg-slate-700 rounded col-span-1"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Question Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <span className="text-blue-400 text-sm font-medium">
            Pregunta {questionOrder}
          </span>
          <span className="text-slate-400 text-sm">
            {currentQuestion.category.toUpperCase()}
          </span>
        </div>
        
        <h2 className="text-2xl font-semibold text-white leading-relaxed">
          {currentQuestion.text}
        </h2>
      </div>

      {/* Answer Scale */}
      <div className="space-y-4">
        <p className="text-slate-300 text-center mb-6">
          ¿Qué tan de acuerdo estás con esta afirmación?
        </p>
        
        <div className="grid grid-cols-5 gap-3">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              onClick={() => handleAnswer(value)}
              disabled={submitResponse.isPending}
              className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-blue-500/50 transition-all duration-300 group disabled:opacity-50"
            >
              <div className="text-2xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                {value}
              </div>
              <div className="text-xs text-slate-400">
                {value === 1 && 'Muy en desacuerdo'}
                {value === 2 && 'En desacuerdo'}
                {value === 3 && 'Neutral'}
                {value === 4 && 'De acuerdo'}
                {value === 5 && 'Muy de acuerdo'}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Loading state */}
      {submitResponse.isPending && (
        <div className="text-center mt-6">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto mb-2"></div>
          <p className="text-slate-400 text-sm">Procesando respuesta...</p>
        </div>
      )}
    </div>
  )
}