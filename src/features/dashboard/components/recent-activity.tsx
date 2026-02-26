import { Link } from '@tanstack/react-router'
import { Brain, Eye } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
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
    <div className="relative overflow-hidden p-5 md:p-6 pb-4 sm:pb-5 rounded-[2rem] bg-white/50 backdrop-blur-2xl border border-white/60 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),0_4px_20px_rgba(0,0,0,0.03)] h-full flex flex-col min-h-0">


      <div className="relative z-10 flex items-center justify-between mb-3 md:mb-5 shrink-0">
        <h2 className="text-xl font-bold bg-gradient-to-br from-gray-900 to-gray-700 bg-clip-text text-transparent">Tests Recientes</h2>
      </div>

      <div className="relative z-10 space-y-3 flex-1 flex flex-col justify-start overflow-y-auto custom-scrollbar pr-1 min-h-0">
        <div className="space-y-3">
          {testHistory.map((test) => {
          const topCareer = test.careerRecommendations?.[0]
          const dominantType = getRiasecTypeSpanish(test.riasecScores)

          return (
            <div
              key={test.sessionId}
              className="flex items-center justify-between p-3 rounded-[1.25rem] bg-slate-100 hover:bg-slate-200/80 border border-slate-300/60 shadow-[inset_0_2px_4px_rgba(255,255,255,0.7),0_2px_6px_rgba(0,0,0,0.04)] hover:shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),0_4px_10px_rgba(0,0,0,0.06)] transition-all duration-300 group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2 rounded-full bg-slate-50 shadow-[0_2px_5px_rgba(0,0,0,0.08),inset_0_-1px_2px_rgba(0,0,0,0.03),inset_0_1px_2px_rgba(255,255,255,1)] border border-slate-200 group-hover:scale-110 transition-transform duration-300 shrink-0">
                  <Brain className="w-4 h-4 text-slate-500 drop-shadow-sm" />
                </div>
                <div className="min-w-0 flex flex-col">
                  <p className="text-[13px] font-bold text-slate-700 truncate">
                    Test Completado
                  </p>
                  <p className="text-[11px] text-slate-500 font-medium truncate">
                    {dominantType} {topCareer?.career?.name && <span className="text-blue-500">• {topCareer.career.name}</span>}
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col items-end gap-1 shrink-0 ml-4">
                <span className="text-[10px] text-gray-400 font-medium">
                  {formatDistanceToNow(test.completedAt)}
                </span>
                <Link to="/results/$sessionId" params={{ sessionId: test.sessionId }}>
                  <TooltipProvider>
                    <Tooltip delayDuration={0}>
                      <TooltipTrigger asChild>
                        <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center w-7 h-7 rounded-full bg-slate-50 shadow-[0_2px_5px_rgba(0,0,0,0.08),inset_0_-1px_2px_rgba(0,0,0,0.03),inset_0_1px_2px_rgba(255,255,255,1)] border border-slate-200 hover:scale-110 active:scale-95 hover:bg-white text-slate-500 hover:text-slate-700 cursor-pointer">
                          <Eye className="w-3.5 h-3.5 drop-shadow-sm" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="bg-slate-800 text-white font-medium text-xs px-2 py-1 rounded shadow-lg border-none">
                        Ver resultado
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Link>
              </div>
            </div>
          )
        })}
      </div>
      </div>
    </div>
  )
}
