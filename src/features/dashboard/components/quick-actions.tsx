import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Link } from '@tanstack/react-router'
import { IconBrain, IconMicrophone, IconSchool, IconUser } from '@tabler/icons-react'

const actions = [
  {
    title: 'Nuevo Test Vocacional',
    description: 'Descubre tus aptitudes',
    icon: IconBrain,
    href: '/vocational-test',
    color: 'from-blue-500 to-blue-600',
  },
  {
    title: 'Asistente de Voz',
    description: 'Orientación personalizada',
    icon: IconMicrophone,
    href: '/vocational-test',
    color: 'from-purple-500 to-purple-600',
  },
  {
    title: 'Explorar Universidades',
    description: 'Encuentra tu institución',
    icon: IconSchool,
    href: '/universities',
    color: 'from-green-500 to-green-600',
  },
  {
    title: 'Actualizar Perfil',
    description: 'Mantén tu información',
    icon: IconUser,
    href: '/profile',
    color: 'from-orange-500 to-orange-600',
  },
]

export function QuickActions() {
  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="text-white">Acciones Rápidas</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {actions.map((action) => (
          <Button
            key={action.title}
            asChild
            variant="ghost"
            className="w-full justify-start h-auto p-4 hover:bg-white/10 transition-all duration-300 hover:scale-[1.02]"
          >
            <Link to={action.href}>
              <div className="flex items-center gap-3 w-full">
                <div 
                  className={`p-2 rounded-lg bg-gradient-to-r ${action.color} flex-shrink-0`}
                >
                  <action.icon size={16} className="text-white" />
                </div>
                <div className="text-left flex-1">
                  <p className="font-medium text-white text-sm">
                    {action.title}
                  </p>
                  <p className="text-xs text-slate-400">
                    {action.description}
                  </p>
                </div>
              </div>
            </Link>
          </Button>
        ))}
      </CardContent>
    </Card>
  )
}
