import { useState } from 'react'
import { CareerRecommendationsDisplay } from '@/features/vocational-test/components/conversational/career-recommendations-display'

// Mock career data for testing the podium
const mockCareerSuggestions = [
  {
    careerId: "1ddd3e36-9bc8-49dc-9672-24d5fee645a5",
    name: "INGENIERÍA EN INFORMÁTICA", 
    confidence: 92,
    reasoning: "Tu fuerte interés en la programación, resolución de problemas lógicos y creatividad en el diseño de sistemas te convierte en un candidato perfecto para esta carrera. La combinación de lógica y creatividad que muestras es ideal para el desarrollo de software y sistemas automatizados."
  },
  {
    careerId: "00d8e4c6-85dd-4806-acaf-f725e20bd484",
    name: "INGENIERÍA INDUSTRIAL",
    confidence: 87,
    reasoning: "Tu capacidad analítica y deseo de optimizar procesos se alinea perfectamente con esta carrera. La ingeniería industrial te permitirá aplicar tus habilidades de resolución de problemas para mejorar la eficiencia en organizaciones, combinando aspectos técnicos y de gestión."
  },
  {
    careerId: "4d28d993-454b-4d1d-89f7-93599a2711e3", 
    name: "ARQUITECTURA DE SOFTWARE",
    confidence: 84,
    reasoning: "Tu visión sistémica y capacidad para diseñar soluciones complejas encaja perfectamente con el rol de arquitecto de software. Esta carrera te permitirá crear las bases tecnológicas de sistemas grandes y escalables, combinando creatividad técnica con pensamiento estratégico."
  }
]

export function PodiumDevTest() {
  const [showPodium, setShowPodium] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto py-8">
        
        {/* Controls */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-6">
            🏆 Olympic Podium Development Test
          </h1>
          
          <div className="space-y-4">
            <button
              onClick={() => setShowPodium(!showPodium)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg transition-all duration-200 hover:scale-105"
            >
              {showPodium ? '🎭 Hide Podium' : '🎬 Show Podium Animation'}
            </button>
            
            <div className="max-w-md mx-auto bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-white/20">
              <p className="text-white/80 text-sm">
                Click the button to instantly trigger the podium animation without scrolling
              </p>
            </div>
          </div>
        </div>

        {/* Animation Instructions */}
        {showPodium && (
          <div className="max-w-2xl mx-auto mb-8 bg-green-500/20 backdrop-blur-xl rounded-2xl p-6 border border-green-400/30">
            <h2 className="text-white font-semibold text-xl mb-4">🎬 What You're Seeing:</h2>
            <div className="text-white/90 space-y-2 text-sm">
              <p>✨ <strong>3rd place block rises first</strong> (shortest, rightmost)</p>
              <p>🥈 <strong>2nd place block rises second</strong> (medium height, leftmost)</p>
              <p>🥇 <strong>1st place block rises last with fanfare</strong> (tallest, center)</p>
              <p>🎉 <strong>Celebration shake</strong> - all blocks wiggle together</p>
              <p>🏅 <strong>Gold/Silver/Bronze badges</strong> on floating career cards</p>
            </div>
          </div>
        )}

        {/* The Podium Component */}
        {showPodium && (
          <div key={showPodium ? 'show' : 'hide'}>
            <CareerRecommendationsDisplay careerSuggestions={mockCareerSuggestions} />
          </div>
        )}

        {/* Quick Reload Button */}
        {showPodium && (
          <div className="text-center mt-12">
            <button
              onClick={() => {
                setShowPodium(false)
                setTimeout(() => setShowPodium(true), 100)
              }}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-2 px-6 rounded-lg shadow-lg transition-all duration-200 hover:scale-105"
            >
              🔄 Replay Animation
            </button>
          </div>
        )}

        {/* Footer spacer */}
        <div className="h-32"></div>

      </div>
    </div>
  )
}