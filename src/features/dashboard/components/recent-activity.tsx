import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Link } from '@tanstack/react-router'
import { IconBrain, IconClock, IconEye } from '@tabler/icons-react'
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
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-white">Tests Recientes</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <LoadingSpinner />
        </CardContent>
      </Card>
    )
  }

  if (!testHistory || testHistory.length === 0) {
    return (
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-white">Tests Recientes</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <p className="text-slate-400 mb-4">
            No has completado ningún test aún
          </p>
          <Button asChild className="bg-blue-600 hover:bg-blue-700">
            <Link to="/vocational-test">
              Realizar Primer Test
            </Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="glass-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-white">Tests Recientes</CardTitle>
        <Button
          asChild
          variant="ghost"
          size="sm" 
          className="text-slate-400 hover:text-white hover:bg-white/10"
        >
          <Link to="/vocational-test">
            Ver Todo el Historial
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {testHistory.map((test) => {
            const topCareer = test.careerRecommendations?.[0]
            const dominantType = getRiasecTypeSpanish(test.riasecScores)
            
            return (
              <div 
                key={test.sessionId} 
                className="flex items-start gap-4 p-3 rounded-lg hover:bg-white/5 transition-colors duration-200 group"
              >
                <div className="p-2 rounded-lg bg-white/10 text-blue-400">
                  <IconBrain size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white">
                    Test Vocacional Completado
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Perfil dominante: {dominantType}
                    {topCareer?.career?.name && (
                      <> • Top carrera: {topCareer.career.name}</>
                    )}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-1">
                      <IconClock size={12} className="text-slate-500" />
                      <span className="text-xs text-slate-500">
                        {formatDistanceToNow(test.completedAt)}
                      </span>
                    </div>
                    <Button
                      asChild
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-white h-auto p-1"
                    >
                      <Link to="/vocational-test/results/$sessionId" params={{ sessionId: test.sessionId }}>
                        <IconEye size={14} className="mr-1" />
                        Ver
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
