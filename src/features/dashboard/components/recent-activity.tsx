import { Link } from '@tanstack/react-router'
import { Brain, Clock, Eye } from 'lucide-react'
import { useUserTestHistory } from '../hooks/use-dashboard-data'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

function formatDistanceToNow(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

  if (diffInMinutes < 60) {
    return `Hace ${diffInMinutes} minutos`
  }

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `Hace ${diffInHours} horas`
  }

  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 30) {
    return `Hace ${diffInDays} días`
  }

  return date.toLocaleDateString('es-ES', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  })
}

function getRiasecTypeSpanish(scores: any): string {
  const types = {
    R: 'Realista',
    I: 'Investigativo', 
    A: 'Artístico',
    S: 'Social',
    E: 'Emprendedor',
    C: 'Convencional'
  }
  
  // Find the highest scoring type
  const maxType = Object.entries(scores)
    .reduce((a, b) => scores[a[0]] > scores[b[0]] ? a : b)[0]
  
  return types[maxType as keyof typeof types] || 'Mixto'
}

export function RecentActivity() {
  const { data: testHistory, isLoading } = useUserTestHistory(5)

  if (isLoading) {
    return (
      <div
        className="p-8 rounded-3xl backdrop-blur-xl"
        style={{
          background: `
            linear-gradient(135deg, 
              rgba(255, 255, 255, 0.08) 0%, 
              rgba(255, 255, 255, 0.04) 100%
            )
          `,
          boxShadow: `
            0 8px 32px 0 rgba(31, 38, 135, 0.37),
            inset 0 1px 0 rgba(255, 255, 255, 0.1)
          `
        }}
      >
        <h2 className="text-2xl font-bold text-white mb-6">Tests Recientes</h2>
        <div className="flex items-center justify-center py-8">
          <LoadingSpinner />
        </div>
      </div>
    )
  }

  if (!testHistory || testHistory.length === 0) {
    return (
      <div
        className="p-8 rounded-3xl backdrop-blur-xl"
        style={{
          background: `
            linear-gradient(135deg, 
              rgba(255, 255, 255, 0.08) 0%, 
              rgba(255, 255, 255, 0.04) 100%
            )
          `,
          boxShadow: `
            0 8px 32px 0 rgba(31, 38, 135, 0.37),
            inset 0 1px 0 rgba(255, 255, 255, 0.1)
          `
        }}
      >
        <h2 className="text-2xl font-bold text-white mb-6">Tests Recientes</h2>
        <div className="text-center py-8">
          <p className="text-white/60 mb-6">
            No has completado ningún test aún
          </p>
          <Link to="/vocational-test">
            <div className="inline-flex px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-xl text-white font-semibold transition-all duration-300 hover:scale-105">
              Realizar Primer Test
            </div>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div
      className="p-8 rounded-3xl backdrop-blur-xl"
      style={{
        background: `
          linear-gradient(135deg, 
            rgba(255, 255, 255, 0.08) 0%, 
            rgba(255, 255, 255, 0.04) 100%
          )
        `,
        boxShadow: `
          0 8px 32px 0 rgba(31, 38, 135, 0.37),
          inset 0 1px 0 rgba(255, 255, 255, 0.1)
        `
      }}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Tests Recientes</h2>
        <Link to="/vocational-test">
          <div className="text-sm text-white/60 hover:text-white transition-colors">
            Ver Todo el Historial
          </div>
        </Link>
      </div>
      
      <div className="space-y-4">
        {testHistory.map((test) => {
          const topCareer = test.careerRecommendations?.[0]
          const dominantType = getRiasecTypeSpanish(test.riasecScores)
          
          return (
            <div 
              key={test.sessionId}
              className="flex items-start gap-4 p-4 rounded-2xl backdrop-blur-md hover:scale-[1.02] transition-all duration-300 group"
              style={{
                background: `
                  linear-gradient(135deg, 
                    rgba(255, 255, 255, 0.06) 0%, 
                    rgba(255, 255, 255, 0.02) 100%
                  )
                `,
                boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.1)'
              }}
            >
              <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 group-hover:rotate-12 transition-transform duration-300">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white mb-1">
                  Test Vocacional Completado
                </p>
                <p className="text-sm text-white/60 mb-3">
                  Perfil dominante: {dominantType}
                  {topCareer?.career?.name && (
                    <> • Top carrera: {topCareer.career.name}</>
                  )}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-white/40" />
                    <span className="text-sm text-white/50">
                      {formatDistanceToNow(test.completedAt)}
                    </span>
                  </div>
                  <Link to="/vocational-test/results/$sessionId" params={{ sessionId: test.sessionId }}>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-sm text-white/60 hover:text-white">
                      <Eye className="w-4 h-4" />
                      Ver
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
