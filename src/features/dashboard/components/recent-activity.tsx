import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { IconBrain, IconMicrophone, IconSchool, IconClock } from '@tabler/icons-react'

const activities = [
  {
    title: 'Test de Aptitudes Completado',
    description: 'Resultados: Fuerte inclinación hacia STEM',
    time: 'Hace 2 horas',
    icon: IconBrain,
    color: 'text-blue-400',
  },
  {
    title: 'Sesión con Asistente de Voz',
    description: 'Exploración de carreras en Ingeniería',
    time: 'Ayer',
    icon: IconMicrophone,
    color: 'text-purple-400',
  },
  {
    title: 'Universidad Guardada',
    description: 'MIT agregado a favoritos',
    time: 'Hace 3 días',
    icon: IconSchool,
    color: 'text-green-400',
  },
]

export function RecentActivity() {
  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="text-white">Actividad Reciente</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div key={index} className="flex items-start gap-4 p-3 rounded-lg hover:bg-white/5 transition-colors duration-200">
              <div className={`p-2 rounded-lg bg-white/10 ${activity.color}`}>
                <activity.icon size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white">
                  {activity.title}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  {activity.description}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <IconClock size={12} className="text-slate-500" />
                  <span className="text-xs text-slate-500">
                    {activity.time}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
