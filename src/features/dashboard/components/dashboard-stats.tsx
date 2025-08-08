import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { IconBrain, IconChartBar, IconClock, IconTarget } from '@tabler/icons-react'
import { useDashboardStats } from '../hooks/use-dashboard-data'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

export function DashboardStats() {
  const { data: dashboardStats, isLoading } = useDashboardStats()

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="glass-card">
            <CardContent className="flex items-center justify-center py-8">
              <LoadingSpinner size="sm" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!dashboardStats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="glass-card">
            <CardContent className="flex items-center justify-center py-8">
              <p className="text-slate-400 text-sm">Sin datos</p>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const formatTimeAgo = (dateString?: string) => {
    if (!dateString) return 'Nunca'
    const date = new Date(dateString)
    const now = new Date()
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
    
    if (diffInDays === 0) return 'Hoy'
    if (diffInDays === 1) return 'Ayer'
    if (diffInDays < 7) return `Hace ${diffInDays} días`
    if (diffInDays < 30) return `Hace ${Math.floor(diffInDays / 7)} semanas`
    return date.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' })
  }

  const stats = [
    {
      title: 'Tests Completados',
      value: dashboardStats.completedTests.toString(),
      description: dashboardStats.totalTests > dashboardStats.completedTests 
        ? `${dashboardStats.totalTests - dashboardStats.completedTests} en progreso`
        : 'Todos completados',
      icon: IconBrain,
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Confianza Promedio',
      value: `${dashboardStats.averageConfidence}%`,
      description: dashboardStats.averageConfidence >= 80 ? 'Muy alta' : 
                   dashboardStats.averageConfidence >= 60 ? 'Alta' : 'En desarrollo',
      icon: IconChartBar,
      color: 'from-green-500 to-green-600',
    },
    {
      title: 'Último Test',
      value: formatTimeAgo(dashboardStats.lastTestDate),
      description: dashboardStats.lastTestDate ? 'Test completado' : 'Aún no has empezado',
      icon: IconClock,
      color: 'from-purple-500 to-purple-600',
    },
    {
      title: 'Perfil Activo',
      value: dashboardStats.completedTests > 0 ? 'Sí' : 'No',
      description: dashboardStats.completedTests > 0 ? 'Con recomendaciones' : 'Completa un test',
      icon: IconTarget,
      color: 'from-orange-500 to-orange-600',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <Card 
          key={stat.title} 
          className="glass-card hover:scale-105 transition-transform duration-300"
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">
              {stat.title}
            </CardTitle>
            <div 
              className={`p-2 rounded-lg bg-gradient-to-r ${stat.color}`}
            >
              <stat.icon size={16} className="text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white mb-1">
              {stat.value}
            </div>
            <p className="text-xs text-slate-400">
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
