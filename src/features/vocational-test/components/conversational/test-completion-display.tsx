import { CheckCircle, Trophy, Star, ArrowRight } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import type { ConversationalResults } from '../../types'

interface TestCompletionDisplayProps {
  sessionId: string
  sessionResults?: ConversationalResults
  onViewResults?: () => void
}

export function TestCompletionDisplay({ 
  sessionId, 
  sessionResults,
  onViewResults 
}: TestCompletionDisplayProps) {
  const navigate = useNavigate()

  const handleViewResults = () => {
    onViewResults?.()
    navigate({ to: `/results/${sessionId}` })
  }

  const handleViewAllResults = () => {
    navigate({ to: '/results' })
  }

  return (
    <div className="relative flex flex-col items-center space-y-8 py-12">
      {/* Success Animation Container */}
      <div className="relative">
        {/* Celebration Glow */}
        <div 
          className="absolute -inset-8 rounded-full opacity-60 animate-pulse"
          style={{
            background: `
              radial-gradient(circle, 
                rgba(34, 197, 94, 0.3) 0%, 
                rgba(34, 197, 94, 0.1) 40%, 
                transparent 70%
              )
            `
          }}
        />
        
        {/* Main Success Icon */}
        <div 
          className="relative w-32 h-32 rounded-full flex items-center justify-center border-4"
          style={{
            background: `
              linear-gradient(135deg, 
                rgba(34, 197, 94, 0.9) 0%, 
                rgba(22, 163, 74, 0.8) 100%
              )
            `,
            borderColor: 'rgba(34, 197, 94, 0.6)',
            backdropFilter: 'blur(20px)',
            boxShadow: `
              0 0 40px rgba(34, 197, 94, 0.4),
              inset 0 1px 20px rgba(255, 255, 255, 0.2)
            `
          }}
        >
          <Trophy className="w-16 h-16 text-white animate-bounce" />
        </div>

        {/* Floating Stars */}
        {[...Array(6)].map((_, i) => (
          <Star
            key={i}
            className={`absolute w-4 h-4 text-yellow-400 animate-ping`}
            style={{
              top: `${20 + Math.sin(i * 60 * Math.PI / 180) * 60}px`,
              left: `${20 + Math.cos(i * 60 * Math.PI / 180) * 60}px`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: '2s'
            }}
          />
        ))}
      </div>

      {/* Completion Message */}
      <div 
        className="text-center p-8 rounded-3xl border max-w-2xl"
        style={{
          background: `
            linear-gradient(135deg, 
              rgba(255, 255, 255, 0.1) 0%, 
              rgba(255, 255, 255, 0.05) 100%
            )
          `,
          backdropFilter: 'blur(20px)',
          borderColor: 'rgba(255, 255, 255, 0.2)',
        }}
      >
        <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-white mb-4">
          ¡Test Vocacional Completado!
        </h2>
        <p className="text-white/80 text-lg mb-6">
          Has completado exitosamente la evaluación vocacional mejorada con metodología de 4 fases.
        </p>
        
        {/* Quick Stats */}
        {sessionResults && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="text-center p-4 rounded-2xl bg-white/5">
              <div className="text-2xl font-bold text-blue-400">
                {sessionResults.conversationHistory?.filter(msg => msg.role === 'user').length || 0}
              </div>
              <div className="text-sm text-white/70">Respuestas dadas</div>
            </div>
            <div className="text-center p-4 rounded-2xl bg-white/5">
              <div className="text-2xl font-bold text-purple-400">
                {sessionResults.careerRecommendations?.length || 0}
              </div>
              <div className="text-sm text-white/70">Carreras identificadas</div>
            </div>
            <div className="text-center p-4 rounded-2xl bg-white/5">
              <div className="text-2xl font-bold text-green-400">
                4/4
              </div>
              <div className="text-sm text-white/70">Fases completadas</div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleViewResults}
            className="group flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105"
          >
            <Trophy className="w-5 h-5" />
            Ver Mi Perfil Vocacional
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <button
            onClick={handleViewAllResults}
            className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-medium py-4 px-8 rounded-2xl border border-white/20 transition-all duration-300"
          >
            Ver Todos Mis Resultados
          </button>
        </div>
      </div>

      {/* Bottom Decoration */}
      <div className="text-center text-white/50 text-sm">
        Evaluación basada en metodología RIASEC mejorada + Reality Check
      </div>
    </div>
  )
}