interface QuizProgressProps {
  current: number
  total: number
  percentage: number
}

export function QuizProgress({ current, total, percentage }: QuizProgressProps) {
  return (
    <div className="space-y-2">
      {/* Progress Bar */}
      <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      {/* Progress Text */}
      <div className="flex justify-between items-center text-sm">
        <span className="text-slate-600">
          Pregunta {current} de {total}
        </span>
        <span className="font-semibold text-slate-800">
          {Math.round(percentage)}% completado
        </span>
      </div>
    </div>
  )
}
