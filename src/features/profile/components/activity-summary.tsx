import { BarChart3, Brain, Building, Trophy } from 'lucide-react'
import { useProfileStats } from '../hooks/use-profile-stats'

export function ActivitySummary() {
  const { data: stats, isLoading } = useProfileStats()

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Nunca'
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const activities = [
    {
      label: 'Tests completados',
      value: isLoading ? '...' : (stats?.tests_completed || 0),
      icon: Brain,
      color: 'text-blue-400'
    }
  ]

  return (
    <div 
      className="backdrop-blur-xl rounded-3xl p-6 h-fit shadow-2xl relative overflow-hidden"
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
      <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
        <BarChart3 className="w-6 h-6 text-purple-400" />
        Resumen de Actividad
      </h3>

      <div className="space-y-4">
        {activities.map((activity, index) => {
          const Icon = activity.icon
          return (
            <div 
              key={index} 
              className="flex justify-between items-center p-4 rounded-2xl backdrop-blur-sm"
              style={{
                background: `
                  linear-gradient(135deg, 
                    rgba(255, 255, 255, 0.1) 0%, 
                    rgba(255, 255, 255, 0.05) 100%
                  )
                `
              }}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-5 h-5 ${activity.color}`} />
                <span className="text-white/80">{activity.label}</span>
              </div>
              <span className="text-white font-bold text-lg">{activity.value}</span>
            </div>
          )
        })}

        {/* Last Test Date */}
        <div 
          className="mt-6 p-4 rounded-2xl backdrop-blur-sm"
          style={{
            background: `
              linear-gradient(135deg, 
                rgba(255, 255, 255, 0.1) 0%, 
                rgba(255, 255, 255, 0.05) 100%
              )
            `
          }}
        >
          <div className="text-sm text-white/60 mb-1">Último test completado</div>
          <div className="text-white font-semibold">
            {isLoading ? 'Cargando...' : formatDate(stats?.last_test_date)}
          </div>
        </div>
      </div>
    </div>
  )
}