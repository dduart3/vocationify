import { Link } from '@tanstack/react-router'
import { Brain, Clock, Eye } from 'lucide-react'
import { useUserTestHistory } from '../hooks/use-dashboard-data'

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
  const { data: testHistory, isLoading } = useUserTestHistory(3)

  if (isLoading) {
    return (
      <div className="p-8 rounded-3xl bg-white border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="h-6 bg-gray-200 rounded animate-pulse w-32"></div>
          <div className="h-4 bg-gray-100 rounded animate-pulse w-24"></div>
        </div>

        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-200"
            >
              <div className="w-11 h-11 bg-gray-200 rounded-xl animate-pulse"></div>
              <div className="flex-1 min-w-0">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-40 mb-2"></div>
                <div className="h-4 bg-gray-100 rounded animate-pulse w-full mb-3"></div>
                <div className="flex items-center justify-between">
                  <div className="h-3 bg-gray-100 rounded animate-pulse w-24"></div>
                  <div className="h-3 bg-gray-100 rounded animate-pulse w-8"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (!testHistory || testHistory.length === 0) {
    return (
      <div className="p-8 rounded-3xl bg-white border border-gray-200 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Tests Recientes</h2>
        <div className="text-center py-8">
          <p className="text-gray-600 mb-6">
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
    <div className="p-8 rounded-3xl bg-white/80 backdrop-blur-sm border border-gray-300/50 shadow-lg shadow-gray-200/50">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-br from-gray-900 to-gray-700 bg-clip-text text-transparent">Tests Recientes</h2>
      </div>

      <div className="space-y-4">
        {testHistory.map((test) => {
          const topCareer = test.careerRecommendations?.[0]
          const dominantType = getRiasecTypeSpanish(test.riasecScores)

          return (
            <div
              key={test.sessionId}
              className="flex items-start gap-4 p-5 rounded-2xl bg-gradient-to-br from-white to-blue-50/30 border-2 border-gray-200 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-100/50 hover:scale-[1.02] transition-all duration-300 group"
            >
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-md group-hover:rotate-12 group-hover:scale-110 transition-all duration-300">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900 mb-1">
                  Test Vocacional Completado
                </p>
                <p className="text-sm text-gray-700 font-medium mb-3">
                  Perfil dominante: <span className="font-bold text-blue-700">{dominantType}</span>
                  {topCareer?.career?.name && (
                    <> • Top carrera: <span className="font-bold text-purple-700">{topCareer.career.name}</span></>
                  )}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-600 font-medium">
                      {formatDistanceToNow(test.completedAt)}
                    </span>
                  </div>
                  <Link to="/results/$sessionId" params={{ sessionId: test.sessionId }}>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-semibold">
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
