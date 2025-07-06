import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { IconBrain, IconTrophy, IconClock, IconTarget } from '@tabler/icons-react'

const stats = [
  {
    title: 'Tests Completados',
    value: '3',
    description: '+2 este mes',
    icon: IconBrain,
    color: 'from-blue-500 to-blue-600',
  },
  {
    title: 'Nivel de Progreso',
    value: '75%',
    description: '+15% esta semana',
    icon: IconTrophy,
    color: 'from-green-500 to-green-600',
  },
  {
    title: 'Tiempo Invertido',
    value: '12h',
    description: 'En orientación',
    icon: IconClock,
    color: 'from-purple-500 to-purple-600',
  },
  {
    title: 'Objetivos',
    value: '4/6',
    description: 'Completados',
    icon: IconTarget,
    color: 'from-orange-500 to-orange-600',
  },
]

export function DashboardStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
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
