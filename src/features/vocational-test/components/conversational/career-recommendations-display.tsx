import { GraduationCap, TrendingUp, Info, Trophy, Medal, Award } from 'lucide-react'

interface CareerSuggestion {
  careerId: string
  name: string
  confidence: number
  reasoning: string
}

interface CareerRecommendationsDisplayProps {
  careerSuggestions: CareerSuggestion[]
}

// Get badge styles based on ranking
const getBadgeStyles = (index: number) => {
  switch (index) {
    case 0: // First place - Green
      return {
        badge: "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/25",
        icon: Trophy,
        ring: "ring-1 ring-green-400/20"
      }
    case 1: // Second place - Blue
      return {
        badge: "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/25",
        icon: Medal,
        ring: "ring-2 ring-blue-400/50"
      }
    case 2: // Third place - Yellow/Gold
      return {
        badge: "bg-gradient-to-r from-yellow-500 to-amber-500 text-white shadow-lg shadow-yellow-500/25",
        icon: Award,
        ring: "ring-2 ring-yellow-400/50"
      }
    default: // Fourth+ - Purple
      return {
        badge: "bg-gradient-to-r from-purple-500 to-violet-500 text-white shadow-lg shadow-purple-500/25",
        icon: Award,
        ring: "ring-2 ring-purple-400/50"
      }
  }
}

// Get confidence badge color
const getConfidenceBadgeStyle = (confidence: number) => {
  if (confidence >= 85) return "bg-green-500/10 backdrop-blur-sm text-green-300"
  if (confidence >= 75) return "bg-blue-500/10 backdrop-blur-sm text-blue-300"
  if (confidence >= 65) return "bg-yellow-500/10 backdrop-blur-sm text-yellow-300"
  return "bg-gray-500/10 backdrop-blur-sm text-gray-300"
}

export function CareerRecommendationsDisplay({ careerSuggestions }: CareerRecommendationsDisplayProps) {
  if (!careerSuggestions?.length) return null

  // Helper function to render podium cards
  const renderPodiumCard = (career: CareerSuggestion, index: number, heightClass: string) => {
    const badgeStyle = getBadgeStyles(index)
    const BadgeIcon = badgeStyle.icon
    const confidenceStyle = getConfidenceBadgeStyle(career.confidence)
    
    return (
      <div key={career.careerId} className={`flex-1 ${heightClass} flex flex-col justify-end min-w-0 max-w-sm mx-3`}>
        <div className="bg-white/8 backdrop-blur-xl rounded-3xl p-6 shadow-2xl hover:bg-white/12 transition-all duration-300 hover:scale-105 h-full flex flex-col">
          {/* Badge */}
          <div className="text-center mb-4">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${badgeStyle.badge} font-bold text-sm shadow-xl`}>
              <BadgeIcon className="w-5 h-5" />
              {index === 0 ? 'CAMPEÓN' : index === 1 ? '2° LUGAR' : '3° LUGAR'}
            </div>
          </div>
          
          {/* Career name */}
          <h4 className="text-white font-bold text-center mb-4 leading-tight text-xl">
            {career.name}
          </h4>
          
          {/* Confidence */}
          <div className={`flex items-center justify-center gap-2 px-3 py-2 rounded-full ${confidenceStyle} font-semibold text-sm mb-4 self-center`}>
            <TrendingUp className="w-4 h-4" />
            {career.confidence}%
          </div>
          
          {/* Reasoning */}
          <div className="bg-white/3 backdrop-blur-sm rounded-2xl p-4 flex-1 flex items-center">
            <p className="text-white/90 text-sm leading-relaxed text-center">
              {career.reasoning}
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Helper function for mobile cards
  const renderMobileCard = (career: CareerSuggestion, index: number) => {
    const badgeStyle = getBadgeStyles(index)
    const BadgeIcon = badgeStyle.icon
    const confidenceStyle = getConfidenceBadgeStyle(career.confidence)
    
    return (
      <div key={career.careerId} className="bg-white/8 backdrop-blur-xl rounded-3xl p-6 shadow-2xl hover:bg-white/12 transition-all duration-300">
        <div className="flex items-start justify-between mb-4">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${badgeStyle.badge} font-bold text-sm shadow-xl`}>
            <BadgeIcon className="w-5 h-5" />
            {index === 0 ? 'TOP MATCH' : index === 1 ? 'GRAN OPCIÓN' : index === 2 ? 'BUENA OPCIÓN' : `OPCIÓN ${index + 1}`}
          </div>
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${confidenceStyle} font-bold text-sm shadow-lg`}>
            <TrendingUp className="w-4 h-4" />
            {career.confidence}%
          </div>
        </div>
        <h4 className="text-white font-bold text-xl mb-4 leading-tight">{career.name}</h4>
        <div className="bg-white/3 backdrop-blur-sm rounded-2xl p-4">
          <p className="text-white/90 text-sm leading-relaxed">{career.reasoning}</p>
        </div>
      </div>
    )
  }

  // Helper function for additional cards
  const renderAdditionalCard = (career: CareerSuggestion, index: number) => {
    const badgeStyle = getBadgeStyles(index)
    const BadgeIcon = badgeStyle.icon
    const confidenceStyle = getConfidenceBadgeStyle(career.confidence)
    
    return (
      <div key={career.careerId} className="bg-white/6 backdrop-blur-xl rounded-2xl p-5 shadow-xl hover:bg-white/10 transition-all duration-300">
        <div className="flex items-start justify-between mb-3">
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${badgeStyle.badge} font-bold text-xs shadow-lg`}>
            <BadgeIcon className="w-4 h-4" />
            OPCIÓN {index + 1}
          </div>
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${confidenceStyle} font-semibold text-xs`}>
            <TrendingUp className="w-3 h-3" />
            {career.confidence}%
          </div>
        </div>
        <h4 className="text-white font-bold text-lg mb-3 leading-tight">{career.name}</h4>
        <div className="bg-white/3 backdrop-blur-sm rounded-xl p-3">
          <p className="text-white/85 text-xs leading-relaxed">{career.reasoning}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="mt-12 max-w-full mx-auto px-8">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/5 backdrop-blur-xl rounded-full">
          <GraduationCap className="w-6 h-6 text-blue-400" />
          <h3 className="font-bold text-xl bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
            Tus Carreras Perfectas
          </h3>
        </div>
      </div>
      
      {/* Podium Layout - First 3 careers */}
      {careerSuggestions.length >= 3 ? (
        <>
          {/* Olympic Podium Style - 2nd, 1st, 3rd arrangement */}
          <div className="hidden md:flex items-end justify-center gap-6 mb-12 max-w-6xl mx-auto px-8 py-4">
            {/* 2nd Place - Left side, shorter */}
            {renderPodiumCard(careerSuggestions[1], 1, 'h-80')}
            
            {/* 1st Place - Center, tallest */}
            {renderPodiumCard(careerSuggestions[0], 0, 'h-96')}
            
            {/* 3rd Place - Right side, shortest */}
            {renderPodiumCard(careerSuggestions[2], 2, 'h-72')}
          </div>
          
          {/* Mobile/tablet fallback - vertical stack */}
          <div className="md:hidden space-y-6">
            {careerSuggestions.slice(0, 3).map((career, index) => 
              renderMobileCard(career, index)
            )}
          </div>
          
          {/* Additional careers below podium (if any) */}
          {careerSuggestions.length > 3 && (
            <div className="mt-16 space-y-6">
              <h4 className="text-center text-white/70 font-semibold text-lg mb-8">
                Otras opciones interesantes
              </h4>
              <div className="grid md:grid-cols-2 gap-6">
                {careerSuggestions.slice(3).map((career, index) => 
                  renderAdditionalCard(career, index + 3)
                )}
              </div>
            </div>
          )}
        </>
      ) : (
        /* Fallback for less than 3 careers */
        <div className="space-y-6">
          {careerSuggestions.map((career, index) => renderMobileCard(career, index))}
        </div>
      )}
      
      {/* Helper functions moved outside JSX */}
      
      {/* Info section with pure glassmorphism */}
      <div className="mt-16 bg-white/6 backdrop-blur-xl rounded-3xl p-6 shadow-xl">
        <div className="flex items-start gap-4 text-blue-300">
          <div className="bg-blue-500/20 backdrop-blur-sm rounded-full p-2">
            <Info className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-sm leading-relaxed">
            <p className="font-bold text-white mb-2">¿Cómo calculamos esto?</p>
            <p className="text-white/80">
              Analizamos tu perfil RIASEC, intereses únicos y compatibilidad natural con cada carrera. 
              Las recomendaciones están ordenadas por afinidad total.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}