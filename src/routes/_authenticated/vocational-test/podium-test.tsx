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

export default function PodiumTest() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto py-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            🏆 Olympic Podium Test
          </h1>
          <p className="text-white/70 text-lg">
            Direct view of the career recommendations podium with GSAP animations
          </p>
        </div>

        {/* Instructions */}
        <div className="max-w-2xl mx-auto mb-8 bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
          <h2 className="text-white font-semibold text-xl mb-4">🎬 Animation Test</h2>
          <div className="text-white/80 space-y-2 text-sm">
            <p>• <strong>Scroll down</strong> to trigger the podium animation</p>
            <p>• Watch the blocks rise: 3rd → 2nd → 1st place</p>
            <p>• Notice the celebration shake at the end</p>
            <p>• Career cards float above each podium block</p>
            <p>• Gold, Silver, Bronze styling for rankings</p>
          </div>
        </div>

        {/* Spacer to enable scrolling */}
        <div className="h-screen flex items-center justify-center">
          <div className="text-white/50 text-center">
            <div className="text-6xl mb-4">⬇️</div>
            <p className="text-xl">Scroll down to see the podium rise!</p>
          </div>
        </div>

        {/* The Podium Component */}
        <CareerRecommendationsDisplay careerSuggestions={mockCareerSuggestions} />

        {/* Footer spacer */}
        <div className="h-96"></div>

      </div>
    </div>
  )
}