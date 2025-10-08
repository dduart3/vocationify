import { Link } from '@tanstack/react-router'
import { Brain, GraduationCap, User } from 'lucide-react'

const actions = [
  {
    title: 'Nuevo Test Vocacional',
    description: 'Descubre tus aptitudes',
    icon: Brain,
    href: '/vocational-test',
    color: 'from-blue-500 to-blue-600',
  },
  {
    title: 'Explorar Universidades',
    description: 'Encuentra tu institución',
    icon: GraduationCap,
    href: '/schools',
    color: 'from-green-500 to-green-600',
  },
  {
    title: 'Actualizar Perfil',
    description: 'Mantén tu información',
    icon: User,
    href: '/profile',
    color: 'from-orange-500 to-orange-600',
  },
]

export function QuickActions() {

  return (
    <div className="p-8 rounded-3xl bg-white/80 backdrop-blur-sm border border-gray-300/50 shadow-lg shadow-gray-200/50">
      <h2 className="text-2xl font-bold bg-gradient-to-br from-gray-900 to-gray-700 bg-clip-text text-transparent mb-6">Acciones Rápidas</h2>

      <div>
        {actions.map((action, index) => {
          const IconComponent = action.icon
          return (
            <Link key={action.title} to={action.href}>
              <div
                className={`w-full p-5 rounded-2xl bg-gradient-to-br from-white to-gray-50/50 border-2 border-gray-200 hover:border-gray-400 hover:shadow-lg hover:shadow-gray-300/30 hover:scale-[1.02] transition-all duration-300 group ${index < actions.length - 1 ? 'mb-4' : ''}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${action.color} shadow-md group-hover:rotate-12 group-hover:scale-110 transition-all duration-300`}>
                    <IconComponent className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left flex-1">
                    <p className="font-bold text-gray-900 mb-1">
                      {action.title}
                    </p>
                    <p className="text-sm text-gray-600 font-medium">
                      {action.description}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
