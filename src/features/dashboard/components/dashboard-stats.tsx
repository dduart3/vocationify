import { Brain, BarChart3, Clock, Target } from 'lucide-react'
import { useDashboardStats } from '../hooks/use-dashboard-data'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

export function DashboardStats() {
  const { data: dashboardStats, isLoading } = useDashboardStats()

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="p-6 rounded-3xl backdrop-blur-xl"
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
            <div className="flex items-center justify-center py-8">
              <LoadingSpinner size="sm" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (!dashboardStats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="p-6 rounded-3xl backdrop-blur-xl"
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
            <div className="flex items-center justify-center py-8">
              <p className="text-slate-400 text-sm">Sin datos</p>
            </div>
          </div>
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
      icon: Brain,
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Confianza Promedio',
      value: `${dashboardStats.averageConfidence}%`,
      description: dashboardStats.averageConfidence >= 80 ? 'Muy alta' : 
                   dashboardStats.averageConfidence >= 60 ? 'Alta' : 'En desarrollo',
      icon: BarChart3,
      color: 'from-green-500 to-green-600',
    },
    {
      title: 'Último Test',
      value: formatTimeAgo(dashboardStats.lastTestDate),
      description: dashboardStats.lastTestDate ? 'Test completado' : 'Aún no has empezado',
      icon: Clock,
      color: 'from-purple-500 to-purple-600',
    },
    {
      title: 'Perfil Activo',
      value: dashboardStats.completedTests > 0 ? 'Sí' : 'No',
      description: dashboardStats.completedTests > 0 ? 'Con recomendaciones' : 'Completa un test',
      icon: Target,
      color: 'from-orange-500 to-orange-600',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => {
        const IconComponent = stat.icon
        return (
          <div
            key={stat.title}
            className="p-6 rounded-3xl backdrop-blur-xl hover:scale-105 transition-all duration-300 group"
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
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-white/80">
                {stat.title}
              </h3>
              <div
                className={`p-2 rounded-xl bg-gradient-to-r ${stat.color} group-hover:rotate-12 transition-transform duration-300`}
              >
                <IconComponent className="w-4 h-4 text-white" />
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-2">
              {stat.value}
            </div>
            <p className="text-sm text-white/60">
              {stat.description}
            </p>
          </div>
        )
      })}
    </div>
  )
}
