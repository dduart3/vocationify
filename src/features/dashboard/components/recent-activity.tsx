import { Link } from '@tanstack/react-router'
import { Brain, Eye } from 'lucide-react'
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
    <div className="relative overflow-hidden p-6 rounded-[2rem] bg-white/50 backdrop-blur-2xl border border-white/60 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),0_4px_20px_rgba(0,0,0,0.03)] h-full flex flex-col">
      {/* Blue light background gradient from bottom right */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-80" 
        style={{
          background: 'radial-gradient(circle at bottom right, rgba(147, 197, 253, 0.45) 0%, rgba(219, 234, 254, 0.15) 50%, transparent 80%)',
        }}
      />
      {/* Grain texture */}
      <div 
        className="absolute inset-0 opacity-[0.25] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.5' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '120px 120px',
        }}
      />

      <div className="relative z-10 flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold bg-gradient-to-br from-gray-900 to-gray-700 bg-clip-text text-transparent">Tests Recientes</h2>
      </div>

      <div className="relative z-10 space-y-3 flex-1 flex flex-col justify-start">
        {testHistory.map((test) => {
          const topCareer = test.careerRecommendations?.[0]
          const dominantType = getRiasecTypeSpanish(test.riasecScores)

          return (
            <div
              key={test.sessionId}
              className="flex items-center justify-between p-3 rounded-2xl bg-white/40 border border-white/60 hover:bg-white/70 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.04)] transition-all duration-300 group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2 rounded-full bg-gradient-to-b from-white to-blue-50/50 shadow-[0_2px_4px_rgba(0,0,0,0.05),inset_0_-1px_2px_rgba(0,0,0,0.02),inset_0_1px_2px_rgba(255,255,255,1)] border border-blue-100 group-hover:scale-110 transition-transform duration-300 shrink-0">
                  <Brain className="w-4 h-4 text-blue-500 drop-shadow-sm" />
                </div>
                <div className="min-w-0 flex flex-col">
                  <p className="text-[13px] font-bold text-gray-800 truncate">
                    Test Completado
                  </p>
                  <p className="text-[11px] text-gray-500 font-medium truncate">
                    {dominantType} {topCareer?.career?.name && <span className="text-purple-600/80">• {topCareer.career.name}</span>}
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col items-end gap-1 shrink-0 ml-4">
                <span className="text-[10px] text-gray-400 font-medium">
                  {formatDistanceToNow(test.completedAt)}
                </span>
                <Link to="/results/$sessionId" params={{ sessionId: test.sessionId }}>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-[11px] text-blue-600 hover:text-blue-700 font-bold bg-white/50 px-2.5 py-0.5 rounded-full border border-blue-100/50">
                    <Eye className="w-3 h-3" />
                    <span>Ver</span>
                  </div>
                </Link>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
