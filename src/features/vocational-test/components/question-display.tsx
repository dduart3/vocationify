import { IconVolume, IconVolumeOff, IconRefresh } from '@tabler/icons-react'

interface Question {
  id: string
  text: string
  category: string
  riasec_weights: Record<string, number>
}

interface QuestionDisplayProps {
  question: Question | null
  questionNumber: number
  totalQuestions?: number
  onReplayQuestion: () => void
  onSpeakQuestion: () => void
  isSpeaking: boolean
  canSpeak: boolean
  isLoading?: boolean
}

export function QuestionDisplay({
  question,
  questionNumber,
  totalQuestions,
  onReplayQuestion,
  onSpeakQuestion,
  isSpeaking,
  canSpeak,
  isLoading = false
}: QuestionDisplayProps) {
  // Handle nested question structure if it exists
  const actualQuestion = question?.question || question
  
  if (isLoading || !actualQuestion) {
    return (
      <div 
        className="p-8 rounded-3xl animate-pulse"
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
          <div className="w-20 h-4 bg-white/20 rounded"></div>
          <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
          <div className="w-24 h-4 bg-white/20 rounded"></div>
        </div>
        <div className="space-y-3">
          <div className="w-full h-6 bg-white/20 rounded"></div>
          <div className="w-4/5 h-6 bg-white/20 rounded"></div>
          <div className="w-3/4 h-6 bg-white/20 rounded"></div>
        </div>
      </div>
    )
  }

  return (
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
      {/* Question Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <span className="text-blue-400 text-sm font-semibold">
            Pregunta {questionNumber}
            {totalQuestions && ` de ${totalQuestions}`}
          </span>
          <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
          <span className="text-slate-400 text-sm uppercase tracking-wider">
            {actualQuestion.category || 'Sin categoría'}
          </span>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={onReplayQuestion}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-200 group"
            title="Repetir pregunta"
          >
            <IconRefresh className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors duration-200" />
          </button>
          
          {canSpeak && (
            <button
              onClick={onSpeakQuestion}
              disabled={isSpeaking}
              className="p-2 rounded-full bg-blue-500/20 hover:bg-blue-500/30 transition-colors duration-200 group disabled:opacity-50 disabled:cursor-not-allowed"
              title={isSpeaking ? "Hablando..." : "Escuchar pregunta"}
            >
              {isSpeaking ? (
                <IconVolumeOff className="w-4 h-4 text-blue-400 animate-pulse" />
              ) : (
                <IconVolume className="w-4 h-4 text-blue-400 group-hover:text-blue-300 transition-colors duration-200" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Question Text */}
      <div className="text-white text-xl font-medium leading-relaxed">
        {actualQuestion.text}
      </div>

      {/* RIASEC Category Hint */}
      <div className="mt-4 pt-4 border-t border-white/10">
        <div className="text-slate-400 text-sm">
          Esta pregunta evalúa: <span className="text-blue-400 font-medium">{actualQuestion.category?.toLowerCase() || 'categoría desconocida'}</span>
        </div>
      </div>
    </div>
  )
}