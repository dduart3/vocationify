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
      iconColor: 'text-blue-500',
    },
    {
      title: 'Confianza Promedio',
      value: `${dashboardStats.averageConfidence}%`,
      description: dashboardStats.averageConfidence >= 80 ? 'Muy alta' : 
                   dashboardStats.averageConfidence >= 60 ? 'Alta' : 'En desarrollo',
      icon: BarChart3,
      iconColor: 'text-green-500',
    },
    {
      title: 'Último Test',
      value: formatTimeAgo(dashboardStats.lastTestDate),
      description: dashboardStats.lastTestDate ? 'Test completado' : 'Aún no has empezado',
      icon: Clock,
      iconColor: 'text-purple-500',
    },
    {
      title: 'Perfil Activo',
      value: dashboardStats.completedTests > 0 ? 'Sí' : 'No',
      description: dashboardStats.completedTests > 0 ? 'Con recomendaciones' : 'Completa un test',
      icon: Target,
      iconColor: 'text-orange-500',
    },
  ]

  return (
    <div id="dashboard-stats" className="flex flex-col md:flex-row items-center justify-between py-4 px-6 md:px-8 rounded-[2rem] bg-white/50 backdrop-blur-2xl border border-white/60 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),0_4px_20px_rgba(0,0,0,0.03)] mx-auto w-full gap-4 md:divide-x divide-gray-200/50">
      {stats.map((stat, index) => {
        const IconComponent = stat.icon
        return (
          <div
            key={stat.title}
            className={`flex flex-col items-center justify-center flex-1 transition-all duration-300 group w-full ${index !== 0 ? 'md:pl-4' : ''}`}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <div
                className={`flex shrink-0 items-center justify-center w-8 h-8 rounded-full bg-gradient-to-b from-white to-gray-50 shadow-[0_2px_5px_rgba(0,0,0,0.05),inset_0_-1px_2px_rgba(0,0,0,0.02),inset_0_1px_2px_rgba(255,255,255,1)] border border-gray-100 group-hover:scale-105 transition-transform duration-300`}
              >
                <IconComponent className={`w-4 h-4 ${stat.iconColor} drop-shadow-sm`} />
              </div>
              <h3 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                {stat.title}
              </h3>
            </div>
            <div className="text-2xl font-bold bg-gradient-to-br from-gray-900 to-gray-700 bg-clip-text text-transparent mb-0.5">
              {stat.value}
            </div>
            <p className="text-[11px] text-gray-400 font-medium">
              {stat.description}
            </p>
          </div>
        )
      })}
    </div>
  )
}
