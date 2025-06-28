import { useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useQuizStore } from '../../store/quiz-store'
import { useVoice } from '../../hooks/use-voice'
import { CareerCard } from './career-card'
import { Button } from '../../components/ui/button'

export function CareerResults() {
  const navigate = useNavigate()
  const { results, isCompleted, resetQuiz } = useQuizStore()
  const { speak } = useVoice()

  useEffect(() => {
    if (!isCompleted || results.length === 0) {
      navigate({ to: '/' })
      return
    }

    // Announce results
    const topCareer = results[0]
    speak(`¡Excelente! Hemos encontrado tus carreras ideales. Tu mejor opción es ${topCareer.career.name} con un ${Math.round(topCareer.percentage)}% de compatibilidad.`)
  }, [isCompleted, results, navigate, speak])

  const handleStartOver = () => {
    resetQuiz()
    navigate({ to: '/' })
  }

  const handleGeneratePDF = () => {
    // TODO: Implement PDF generation
    speak('Generando tu reporte en PDF...')
  }

  if (!isCompleted || results.length === 0) {
    return null
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">
            ¡Tus Carreras Ideales!
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Basado en tus respuestas, estas son las 3 carreras que mejor se adaptan a tu perfil
          </p>
        </div>

        {/* Results Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {results.slice(0, 3).map((match, index) => (
            <CareerCard
              key={match.career.id}
              match={match}
              rank={index + 1}
              isTop={index === 0}
            />
          ))}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            onClick={handleGeneratePDF}
            size="lg"
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
          >
            📄 Descargar Reporte PDF
          </Button>
          
          <Button
            onClick={handleStartOver}
            variant="outline"
            size="lg"
          >
            🔄 Realizar Test Nuevamente
          </Button>
        </div>

        {/* Additional Info */}
        <div className="mt-12 bg-blue-50 rounded-xl p-6 border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">
            💡 Recomendaciones
          </h3>
          <ul className="text-blue-700 space-y-1">
            <li>• Investiga más sobre las universidades que ofrecen tu carrera ideal</li>
            <li>• Considera visitar las instalaciones y hablar con estudiantes actuales</li>
            <li>• Revisa los requisitos de admisión y fechas importantes</li>
            <li>• Mantén este reporte para futuras referencias</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
