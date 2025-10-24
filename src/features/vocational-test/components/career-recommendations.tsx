// CareerRecommendations component
// Responsibility: Display career recommendations in card format

import { Star, TrendingUp, BookOpen, Target } from 'lucide-react'
import { PDFExport } from '../../results/components/pdf-export'

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
    <div className={`space-y-6 ${className}`} id="career-recommendations-content">
      {showTitle && (
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-2 flex items-center justify-center gap-2">
            <Target className="w-6 h-6 text-blue-600" />
            Tus Carreras Recomendadas
          </h3>
          <p className="text-gray-600 text-sm mb-4">
            Basado en tus intereses y respuestas
          </p>
          
          {/* PDF Export Button */}
          <div className="flex justify-center">
            <PDFExport 
              contentId="career-recommendations-content"
              fileName="mis-carreras-recomendadas"
              title="Mis Carreras Recomendadas - Test Vocacional"
            />
          </div>
        </div>
      )}
      
      <div className="space-y-3">
        {recommendations.map((career, index) => (
          <div
            key={career.careerId}
            className="bg-white/80 backdrop-blur-sm rounded-xl p-5 hover:bg-white transition-all duration-200 border border-gray-200 shadow-lg shadow-gray-200/50"
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
                  <h4 className="font-semibold text-gray-900 text-lg leading-tight">
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
                <p className="text-gray-700 text-sm leading-relaxed">
                  {career.reasoning}
                </p>

                {/* Career ID for debugging (only in dev) */}
                {process.env.NODE_ENV === 'development' && (
                  <div className="mt-2 text-xs text-gray-400 font-mono">
                    ID: {career.careerId}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Summary Stats */}
      <div className="mt-6 p-4 bg-white/60 rounded-lg border border-gray-200">
        <div className="flex items-center justify-center gap-6 text-sm text-gray-700">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-600" />
            <span>{recommendations.length} recomendaciones</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-600" />
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