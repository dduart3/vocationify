import { useState, useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useQuizStore } from '../../store/quiz-store'
import { useVoice } from '../../hooks/use-voice'
import { QuizQuestion } from './quiz-question'
import { QuizProgress } from './quiz-progress'
import { questions } from '../../data/quiz-questions'
import { matchCareers } from '../../lib/career-matcher'
import { Button } from '../../components/ui/button'

export function QuizFlow() {
  const navigate = useNavigate()
  const { speak } = useVoice()
  const {
    currentQuestionIndex,
    answers,
    nextQuestion,
    previousQuestion,
    setResults,
    completeQuiz,
    getProgress,
  } = useQuizStore()

  const [isProcessing, setIsProcessing] = useState(false)

  // Get current question, filtering out skipped ones
  const currentQuestion = questions[currentQuestionIndex]
  const isLastQuestion = currentQuestionIndex >= questions.length - 1

  useEffect(() => {
    // Speak the current question when it changes
    if (currentQuestion) {
      speak(currentQuestion.text)
    }
  }, [currentQuestion, speak])

  const handleNext = () => {
    if (isLastQuestion) {
      handleCompleteQuiz()
    } else {
      nextQuestion()
    }
  }

  const handleCompleteQuiz = async () => {
    setIsProcessing(true)
    speak('Procesando tus respuestas para encontrar las mejores opciones de carrera...')

    try {
      // Generate career matches
      const answerMap = answers.reduce((acc, answer) => {
        acc[answer.questionId] = answer.value
        return acc
      }, {} as Record<string, any>)

      const careerMatches = await matchCareers(answerMap)
      setResults(careerMatches)
      completeQuiz()

      setTimeout(() => {
        navigate({ to: '/results' })
      }, 2000)
    } catch (error) {
      console.error('Error processing quiz results:', error)
      speak('Hubo un error procesando tus respuestas. Por favor, intenta de nuevo.')
    } finally {
      setIsProcessing(false)
    }
  }

  if (isProcessing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-slate-800 mb-2">
            Analizando tus respuestas...
          </h2>
          <p className="text-slate-600">
            Encontrando las carreras perfectas para ti
          </p>
        </div>
      </div>
    )
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-slate-800 mb-4">
            Error: No hay más preguntas disponibles
          </h2>
          <Button onClick={() => navigate({ to: '/' })}>
            Volver al inicio
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Test Vocacional
          </h1>
          <QuizProgress 
            current={currentQuestionIndex + 1} 
            total={questions.length}
            percentage={getProgress(questions.length)}
          />
        </div>

        {/* Question */}
        <QuizQuestion 
          question={currentQuestion}
          onNext={handleNext}
          onPrevious={currentQuestionIndex > 0 ? previousQuestion : undefined}
          isLastQuestion={isLastQuestion}
        />

        {/* Navigation Help */}
        <div className="mt-8 text-center">
          <p className="text-sm text-slate-500">
            Puedes responder usando tu voz o seleccionando las opciones
          </p>
        </div>
      </div>
    </div>
  )
}
