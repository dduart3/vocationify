import { BarChart3, Brain } from 'lucide-react'
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
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 h-fit shadow-lg shadow-gray-200/50 border border-gray-300/50 relative overflow-hidden">
      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
        <BarChart3 className="w-6 h-6 text-purple-600" />
        Resumen de Actividad
      </h3>

      <div className="space-y-4">
        {activities.map((activity, index) => {
          const Icon = activity.icon
          return (
            <div
              key={index}
              className="flex justify-between items-center p-4 rounded-2xl bg-gray-50 border border-gray-200"
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-5 h-5 ${activity.color.replace('text-', 'text-').replace('-400', '-600')}`} />
                <span className="text-gray-700">{activity.label}</span>
              </div>
              <span className="text-gray-900 font-bold text-lg">{activity.value}</span>
            </div>
          )
        })}

        {/* Last Test Date */}
        <div className="mt-6 p-4 rounded-2xl bg-gray-50 border border-gray-200">
          <div className="text-sm text-gray-600 mb-1">Último test completado</div>
          <div className="text-gray-900 font-semibold">
            {isLoading ? 'Cargando...' : formatDate(stats?.last_test_date)}
          </div>
        </div>
      </div>
    </div>
  )
}