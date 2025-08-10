import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Link } from '@tanstack/react-router'
import { IconBrain, IconMicrophone, IconSchool, IconUser, IconTrophy } from '@tabler/icons-react'
import { useState } from 'react'
import { CareerRecommendationsDisplay } from '@/features/vocational-test/components/conversational/career-recommendations-display'

// Mock career data for testing the podium
const mockCareerSuggestions = [
  {
    careerId: "1",
    name: "INGENIERÍA EN INFORMÁTICA", 
    confidence: 92,
    reasoning: "Tu fuerte interés en la programación, resolución de problemas lógicos y creatividad en el diseño de sistemas te convierte en un candidato perfecto para esta carrera."
  },
  {
    careerId: "2", 
    name: "INGENIERÍA INDUSTRIAL",
    confidence: 87,
    reasoning: "Tu capacidad analítica y deseo de optimizar procesos se alinea perfectamente con esta carrera."
  },
  {
    careerId: "3",
    name: "ARQUITECTURA DE SOFTWARE",
    confidence: 84,
    reasoning: "Tu visión sistémica y capacidad para diseñar soluciones complejas encaja perfectamente con el rol de arquitecto de software."
  }
]

const actions = [
  {
    title: 'Nuevo Test Vocacional',
    description: 'Descubre tus aptitudes',
    icon: IconBrain,
    href: '/vocational-test',
    color: 'from-blue-500 to-blue-600',
  },
  {
    title: 'Asistente de Voz',
    description: 'Orientación personalizada',
    icon: IconMicrophone,
    href: '/vocational-test',
    color: 'from-purple-500 to-purple-600',
  },
  {
    title: 'Explorar Universidades',
    description: 'Encuentra tu institución',
    icon: IconSchool,
    href: '/universities',
    color: 'from-green-500 to-green-600',
  },
  {
    title: 'Actualizar Perfil',
    description: 'Mantén tu información',
    icon: IconUser,
    href: '/profile',
    color: 'from-orange-500 to-orange-600',
  },
]

export function QuickActions() {
  const [showPodium, setShowPodium] = useState(false)

  return (
    <>
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-white">Acciones Rápidas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Podium Test Button */}
          <Button
            onClick={() => setShowPodium(!showPodium)}
            variant="ghost"
            className="w-full justify-start h-auto p-4 hover:bg-white/10 transition-all duration-300 hover:scale-[1.02]"
          >
            <div className="flex items-center gap-3 w-full">
              <div className={`p-2 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500 flex-shrink-0`}>
                <IconTrophy className="w-5 h-5 text-white" />
              </div>
              <div className="text-left flex-1">
                <p className="font-medium text-white">🏆 Test Podium</p>
                <p className="text-sm text-slate-400">Prueba la animación del podium olímpico</p>
              </div>
            </div>
          </Button>

          {actions.map((action) => (
            <Button
              key={action.title}
              asChild
              variant="ghost"
              className="w-full justify-start h-auto p-4 hover:bg-white/10 transition-all duration-300 hover:scale-[1.02]"
            >
            <Link to={action.href}>
              <div className="flex items-center gap-3 w-full">
                <div 
                  className={`p-2 rounded-lg bg-gradient-to-r ${action.color} flex-shrink-0`}
                >
                  <action.icon size={16} className="text-white" />
                </div>
                <div className="text-left flex-1">
                  <p className="font-medium text-white text-sm">
                    {action.title}
                  </p>
                  <p className="text-xs text-slate-400">
                    {action.description}
                  </p>
                </div>
              </div>
            </Link>
          </Button>
        ))}
      </CardContent>
    </Card>

    {/* Podium Test Display */}
    {showPodium && (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-auto relative">
          
          {/* Close Button */}
          <button
            onClick={() => setShowPodium(false)}
            className="absolute top-4 right-4 z-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full p-2 transition-all duration-200"
          >
            <div className="w-6 h-6 flex items-center justify-center text-white">✕</div>
          </button>

          {/* Test Header */}
          <div className="text-center p-8 pb-4">
            <h2 className="text-3xl font-bold text-white mb-2">🏆 Olympic Podium Test</h2>
            <p className="text-white/70">Watch the podium blocks rise automatically!</p>
          </div>

          {/* Animation Info */}
          <div className="px-8 mb-8">
            <div className="bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-white/20">
              <p className="text-white/90 text-center text-sm">
                ✨ Animation starts in 0.3 seconds: 3rd → 2nd → 1st place with celebration shake
              </p>
            </div>
          </div>

          {/* The Podium Component */}
          <div key={showPodium ? 'show' : 'hide'}>
            <CareerRecommendationsDisplay careerSuggestions={mockCareerSuggestions} />
          </div>

          {/* Footer */}
          <div className="p-8 text-center">
            <button
              onClick={() => {
                setShowPodium(false)
                setTimeout(() => setShowPodium(true), 200)
              }}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-all duration-200 hover:scale-105"
            >
              🔄 Replay Animation
            </button>
          </div>

        </div>
      </div>
    )}
    </>
  )
}
