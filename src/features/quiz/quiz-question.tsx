import { useState, useEffect } from 'react'
import { Question } from '../../types/quiz'
import { useQuizStore } from '../../store/quiz-store'
import { useVoice } from '../../hooks/use-voice'
import { Button } from '../../components/ui/button'
import { cn } from '../../lib/utils'

interface QuizQuestionProps {
  question: Question
  onNext: () => void
  onPrevious?: () => void
  isLastQuestion: boolean
}

export function QuizQuestion({ question, onNext, onPrevious, isLastQuestion }: QuizQuestionProps) {
  const { setAnswer, getAnswer } = useQuizStore()
  const { transcript, isListening } = useVoice()
  const [selectedValue, setSelectedValue] = useState<string | number | boolean | null>(null)

  // Load existing answer
  useEffect(() => {
    const existingAnswer = getAnswer(question.id)
    if (existingAnswer) {
      setSelectedValue(existingAnswer.value)
    } else {
      setSelectedValue(null)
    }
  }, [question.id, getAnswer])

  // Process voice input
  useEffect(() => {
    if (transcript && isListening && question.type === 'multiple-choice' && question.options) {
      const normalizedTranscript = transcript.toLowerCase().trim()
      
      // Try to match transcript to option text
      const matchedOption = question.options.find(option => 
        option.text.toLowerCase().includes(normalizedTranscript) ||
        normalizedTranscript.includes(option.text.toLowerCase())
      )

      if (matchedOption) {
        handleAnswer(matchedOption.value)
      }
    }
  }, [transcript, isListening, question])

  const handleAnswer = (value: string | number | boolean) => {
    setSelectedValue(value)
    setAnswer(question.id, value)
  }

  const canProceed = selectedValue !== null

  const renderQuestionInput = () => {
    switch (question.type) {
      case 'multiple-choice':
        return (
          <div className="space-y-3">
            {question.options?.map((option) => (
              <button
                key={option.id}
                onClick={() => handleAnswer(option.value)}
                className={cn(
                  'w-full p-4 text-left rounded-lg border-2 transition-all duration-200 hover:shadow-md',
                  selectedValue === option.value
                    ? 'border-blue-500 bg-blue-50 text-blue-900'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                )}
              >
                <div className="flex items-center space-x-3">
                  <div className={cn(
                    'w-4 h-4 rounded-full border-2 transition-colors',
                    selectedValue === option.value
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-slate-300'
                  )}>
                    {selectedValue === option.value && (
                      <div className="w-full h-full rounded-full bg-white scale-50" />
                    )}
                  </div>
                  <span className="font-medium">{option.text}</span>
                </div>
              </button>
            ))}
          </div>
        )

      case 'scale':
        return (
          <div className="space-y-4">
            <div className="flex justify-between text-sm text-slate-600">
              <span>Totalmente en desacuerdo</span>
              <span>Totalmente de acuerdo</span>
            </div>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  onClick={() => handleAnswer(value)}
                  className={cn(
                    'w-12 h-12 rounded-full border-2 font-semibold transition-all duration-200',
                    selectedValue === value
                      ? 'border-blue-500 bg-blue-500 text-white'
                      : 'border-slate-300 hover:border-slate-400'
                  )}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>
        )

      case 'boolean':
        return (
          <div className="flex space-x-4">
            <button
              onClick={() => handleAnswer(true)}
              className={cn(
                'flex-1 p-4 rounded-lg border-2 font-semibold transition-all duration-200',
                selectedValue === true
                  ? 'border-green-500 bg-green-50 text-green-900'
                  : 'border-slate-200 hover:border-slate-300'
              )}
            >
              Sí
            </button>
            <button
              onClick={() => handleAnswer(false)}
              className={cn(
                'flex-1 p-4 rounded-lg border-2 font-semibold transition-all duration-200',
                selectedValue === false
                  ? 'border-red-500 bg-red-50 text-red-900'
                  : 'border-slate-200 hover:border-slate-300'
              )}
            >
              No
            </button>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 border border-slate-200">
      {/* Question Text */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-slate-800 mb-4 leading-relaxed">
          {question.text}
        </h2>
        
        {/* Voice Indicator */}
        {isListening && (
          <div className="flex items-center space-x-2 text-blue-600 mb-4">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
            <span className="text-sm">Escuchando tu respuesta...</span>
          </div>
        )}
      </div>

      {/* Question Input */}
      <div className="mb-8">
        {renderQuestionInput()}
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <div>
          {onPrevious && (
            <Button 
              onClick={onPrevious}
              variant="outline"
              className="px-6"
            >
              Anterior
            </Button>
          )}
        </div>

        <Button
          onClick={onNext}
          disabled={!canProceed}
          className="px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
        >
          {isLastQuestion ? 'Finalizar Test' : 'Siguiente'}
        </Button>
      </div>

      {/* Progress indicator */}
      <div className="mt-6 text-center">
        <p className="text-sm text-slate-500">
          {canProceed ? 'Respuesta registrada ✓' : 'Selecciona una respuesta para continuar'}
        </p>
      </div>
    </div>
  )
}
