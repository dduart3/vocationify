// CareerRecommendations component
// Responsibility: Display career recommendations in card format

import { Star, TrendingUp, BookOpen, Target } from 'lucide-react'

interface CareerRecommendation {
  careerId: string
  name: string
  confidence: number
  reasoning: string
}

interface CareerRecommendationsProps {
  recommendations: CareerRecommendation[]
  showTitle?: boolean
  className?: string
}

export function CareerRecommendations({ 
  recommendations, 
  showTitle = true, 
  className = "" 
}: CareerRecommendationsProps) {
  if (!recommendations || recommendations.length === 0) {
    return null
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 85) return 'text-green-400 bg-green-500/20'
    if (confidence >= 70) return 'text-yellow-400 bg-yellow-500/20'
    return 'text-orange-400 bg-orange-500/20'
  }

  const getConfidenceIcon = (confidence: number) => {
    if (confidence >= 85) return <TrendingUp className="w-4 h-4" />
    if (confidence >= 70) return <Star className="w-4 h-4" />
    return <BookOpen className="w-4 h-4" />
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {showTitle && (
        <div className="text-center">
          <h3 className="text-xl font-semibold text-white mb-2 flex items-center justify-center gap-2">
            <Target className="w-6 h-6 text-blue-400" />
            Tus Carreras Recomendadas
          </h3>
          <p className="text-white/70 text-sm">
            Basado en tus intereses y respuestas
          </p>
        </div>
      )}
      
      <div className="space-y-3">
        {recommendations.map((career, index) => (
          <div
            key={career.careerId}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-5 hover:bg-white/15 transition-all duration-200"
          >
            <div className="flex items-start gap-4">
              {/* Ranking Number */}
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {index + 1}
                </div>
              </div>
              
              {/* Career Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h4 className="font-semibold text-white text-lg leading-tight">
                    {career.name}
                  </h4>
                  
                  {/* Confidence Badge */}
                  <div className={`
                    flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium
                    ${getConfidenceColor(career.confidence)}
                  `}>
                    {getConfidenceIcon(career.confidence)}
                    {career.confidence}%
                  </div>
                </div>
                
                {/* Reasoning */}
                <p className="text-white/80 text-sm leading-relaxed">
                  {career.reasoning}
                </p>
                
                {/* Career ID for debugging (only in dev) */}
                {process.env.NODE_ENV === 'development' && (
                  <div className="mt-2 text-xs text-white/30 font-mono">
                    ID: {career.careerId}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Summary Stats */}
      <div className="mt-6 p-4 bg-white/5 rounded-lg">
        <div className="flex items-center justify-center gap-6 text-sm text-white/70">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-400" />
            <span>{recommendations.length} recomendaciones</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span>
              {Math.round(
                recommendations.reduce((sum, r) => sum + r.confidence, 0) / 
                recommendations.length
              )}% promedio
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}