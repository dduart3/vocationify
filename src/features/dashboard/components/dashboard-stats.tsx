import { Brain, BarChart3, Clock, Target } from 'lucide-react'
import { useDashboardStats } from '../hooks/use-dashboard-data'

export function DashboardStats() {
  const { data: dashboardStats, isLoading } = useDashboardStats()

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="p-6 rounded-3xl bg-white border border-gray-200 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
              <div className="w-8 h-8 bg-gray-200 rounded-xl animate-pulse"></div>
            </div>
            <div className="h-8 bg-gray-200 rounded animate-pulse w-16 mb-2"></div>
            <div className="h-4 bg-gray-100 rounded animate-pulse w-32"></div>
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
            className="p-6 rounded-3xl bg-white border border-gray-200 shadow-sm"
          >
            <div className="flex items-center justify-center py-8">
              <p className="text-gray-500 text-sm">Sin datos</p>
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
            className="p-6 rounded-3xl bg-white/80 backdrop-blur-sm border border-gray-300/50 shadow-lg shadow-gray-200/50 hover:shadow-xl hover:shadow-gray-300/50 hover:scale-105 hover:border-gray-400/50 transition-all duration-300 group"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                {stat.title}
              </h3>
              <div
                className={`p-2.5 rounded-xl bg-gradient-to-br ${stat.color} shadow-md group-hover:rotate-12 transition-transform duration-300`}
              >
                <IconComponent className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="text-3xl font-bold bg-gradient-to-br from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
              {stat.value}
            </div>
            <p className="text-sm text-gray-600 font-medium">
              {stat.description}
            </p>
          </div>
        )
      })}
    </div>
  )
}
