import { CareerMatch } from '../../types/quiz'
import { cn } from '../../lib/utils'

interface CareerCardProps {
  match: CareerMatch
  rank: number
  isTop: boolean
}

export function CareerCard({ match, rank, isTop }: CareerCardProps) {
  const { career, percentage, schools, matchReasons } = match

  const getRankEmoji = (rank: number) => {
    switch (rank) {
      case 1: return '🥇'
      case 2: return '🥈'
      case 3: return '🥉'
      default: return '🎯'
    }
  }

  const getPercentageColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600 bg-green-100'
    if (percentage >= 60) return 'text-blue-600 bg-blue-100'
    return 'text-amber-600 bg-amber-100'
  }

  return (
    <div className={cn(
      'bg-white rounded-xl shadow-lg border-2 transition-all duration-300 hover:shadow-xl',
      isTop ? 'border-yellow-300 ring-2 ring-yellow-200' : 'border-slate-200'
    )}>
      {/* Header */}
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-center justify-between mb-3">
          <span className="text-2xl">{getRankEmoji(rank)}</span>
          <div className={cn(
            'px-3 py-1 rounded-full text-sm font-bold',
            getPercentageColor(percentage)
          )}>
            {Math.round(percentage)}% Compatible
          </div>
        </div>
        
        <h3 className="text-xl font-bold text-slate-800 mb-2">
          {career.name}
        </h3>
        
        <p className="text-slate-600 text-sm line-clamp-3">
          {career.description}
        </p>

        {career.duration_years && (
          <div className="mt-3">
            <span className="inline-block bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs font-medium">
              Duración: {career.duration_years}
            </span>
          </div>
        )}
      </div>

      {/* Match Reasons */}
      {matchReasons.length > 0 && (
        <div className="p-6 border-b border-slate-100">
          <h4 className="font-semibold text-slate-800 mb-2 text-sm">
            ¿Por qué es ideal para ti?
          </h4>
          <ul className="space-y-1">
            {matchReasons.slice(0, 3).map((reason, index) => (
              <li key={index} className="text-xs text-slate-600 flex items-start">
                <span className="text-green-500 mr-1">✓</span>
                {reason}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Universities */}
      <div className="p-6">
        <h4 className="font-semibold text-slate-800 mb-3 text-sm">
          Universidades disponibles ({schools.length})
        </h4>
        <div className="space-y-3">
          {schools.slice(0, 3).map((school) => (
            <div key={school.id} className="bg-slate-50 rounded-lg p-3">
              <h5 className="font-medium text-slate-800 text-sm mb-1">
                {school.name}
              </h5>
              {school.schoolCareer.shifts && (
                <p className="text-xs text-slate-600">
                  Turnos: {school.schoolCareer.shifts}
                </p>
              )}
              {school.schoolCareer.admission_requirements && (
                <p className="text-xs text-slate-600 mt-1">
                  Requisitos: {school.schoolCareer.admission_requirements.substring(0, 100)}...
                </p>
              )}
            </div>
          ))}
          
          {schools.length > 3 && (
            <div className="text-center">
              <span className="text-xs text-slate-500">
                +{schools.length - 3} universidades más
              </span>
            </div>
          )}
        </div>
      </div>

      {isTop && (
        <div className="bg-gradient-to-r from-yellow-50 to-amber-50 px-6 py-3 rounded-b-xl border-t border-yellow-200">
          <p className="text-center text-sm font-medium text-amber-800">
            🌟 ¡Tu mejor opción vocacional!
          </p>
        </div>
      )}
    </div>
  )
}
