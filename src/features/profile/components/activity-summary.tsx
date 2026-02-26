import { useProfileStats } from '../hooks/use-profile-stats'
import { useAuth } from '@/context/auth-context'

export function ActivitySummary() {
  const { data: stats, isLoading } = useProfileStats()
  const { profile } = useAuth()

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return 'Nunca'
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const statItems = [
    {
      label: 'Registrado desde',
      value: profile?.created_at ? formatDate(profile.created_at) : 'N/A'
    },
    {
      label: 'Último test',
      value: isLoading ? '...' : formatDate(stats?.last_test_date)
    },
    {
      label: 'Completados',
      value: isLoading ? '...' : (stats?.tests_completed || 0)
    },
    {
      label: 'Rol',
      value: profile?.role === 'admin' ? 'Administrador' : 'Estudiante'
    }
  ]

  return (
    <div className="w-full flex flex-col sm:flex-row items-center sm:items-start justify-between sm:divide-x divide-slate-200/60 pb-2">
      {statItems.map((item, index) => (
        <div 
          key={index} 
          className={`flex flex-col flex-1 w-full sm:w-auto items-center sm:items-start space-y-1 sm:space-y-2 py-4 sm:py-0 ${index !== 0 ? 'sm:pl-8' : ''}`}
        >
          <span className="text-[13px] text-slate-400 font-medium">
            {item.label}
          </span>
          <span className="text-[16px] sm:text-[18px] text-slate-800 font-bold whitespace-nowrap">
            {item.value}
          </span>
        </div>
      ))}
    </div>
  )
}