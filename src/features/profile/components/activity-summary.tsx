import { IconMapPin, IconBrain, IconBuilding, IconTrophy } from '@tabler/icons-react'
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
      icon: IconBrain,
      color: 'text-blue-400'
    },
    {
      label: 'Carreras exploradas',
      value: isLoading ? '...' : (stats?.careers_explored || 0),
      icon: IconTrophy,
      color: 'text-green-400'
    },
    {
      label: 'Instituciones revisadas',
      value: isLoading ? '...' : (stats?.schools_reviewed || 0),
      icon: IconBuilding,
      color: 'text-purple-400'
    }
  ]

  return (
    <div className="bg-white/5 rounded-xl p-6 h-fit">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <IconMapPin className="w-5 h-5 text-purple-400" />
        Resumen de Actividad
      </h3>

      <div className="space-y-2">
        {activities.map((activity, index) => {
          const Icon = activity.icon
          return (
            <div key={index} className="flex justify-between items-center p-2 bg-white/10 rounded-lg">
              <div className="flex items-center gap-2">
                <Icon className={`w-4 h-4 ${activity.color}`} />
                <span className="text-neutral-300 text-sm">{activity.label}</span>
              </div>
              <span className="text-white font-semibold">{activity.value}</span>
            </div>
          )
        })}

        {/* Last Test Date */}
        <div className="mt-3 p-2 bg-white/10 rounded-lg">
          <div className="text-xs text-neutral-400 mb-1">Último test completado</div>
          <div className="text-white font-medium text-sm">
            {isLoading ? 'Cargando...' : formatDate(stats?.last_test_date)}
          </div>
        </div>
      </div>
    </div>
  )
}