import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Button } from '../../components/ui/button'
import { useVoice } from '../../hooks/use-voice'

export function Hero() {
  const navigate = useNavigate()
  const { speak } = useVoice()
  const [isStarting, setIsStarting] = useState(false)

  const handleStartQuiz = async () => {
    setIsStarting(true)
    
    // Welcome message in Spanish
    speak('¡Bienvenido a Vocationify! Te ayudaré a descubrir tu carrera ideal. Comenzaremos el test vocacional.')
    
    // Navigate to quiz after speaking
    setTimeout(() => {
      navigate({ to: '/quiz' })
    }, 3000)
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4">
      <div className="max-w-4xl mx-auto text-center">
        {/* Logo/Title */}
        <div className="mb-8">
          <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-900 bg-clip-text text-transparent mb-4">
            Vocationify
          </h1>
          <div className="h-1 w-32 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto mb-6 rounded-full" />
        </div>

        {/* Subtitle */}
        <h2 className="text-2xl md:text-3xl font-light text-slate-700 mb-6 leading-relaxed">
          Descubre tu carrera ideal en las universidades de <span className="font-semibold text-blue-800">Maracaibo</span>
        </h2>

        {/* Description */}
        <p className="text-lg text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed">
          Test vocacional inteligente con interacción por voz. Te ayudamos a encontrar las 3 carreras que mejor se adapten a tu personalidad e intereses.
        </p>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-slate-200">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              🎯
            </div>
            <h3 className="font-semibold text-slate-800 mb-2">Preguntas Adaptativas</h3>
            <p className="text-slate-600 text-sm">Algoritmo inteligente que adapta las preguntas según tus respuestas</p>
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-slate-200">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              🎤
            </div>
            <h3 className="font-semibold text-slate-800 mb-2">Interacción por Voz</h3>
            <p className="text-slate-600 text-sm">Responde con tu voz en español venezolano</p>
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-slate-200">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              🎓
            </div>
            <h3 className="font-semibold text-slate-800 mb-2">73 Carreras</h3>
            <p className="text-slate-600 text-sm">De 10+ universidades en Maracaibo con información detallada</p>
          </div>
        </div>

        {/* CTA Button */}
        <Button
          onClick={handleStartQuiz}
          disabled={isStarting}
          size="lg"
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          {isStarting ? 'Iniciando...' : 'Comenzar Test Vocacional'}
        </Button>

        <p className="text-sm text-slate-500 mt-4">
          Tiempo estimado: 10-15 minutos
        </p>
      </div>

      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" />
        <div className="absolute top-3/4 right-1/4 w-64 h-64 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }} />
      </div>
    </div>
  )
}
