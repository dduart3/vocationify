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
    <div
      className="p-8 rounded-3xl backdrop-blur-xl"
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
      <h2 className="text-2xl font-bold text-white mb-6">Acciones Rápidas</h2>
      
      <div>
        {actions.map((action, index) => {
          const IconComponent = action.icon
          return (
            <Link key={action.title} to={action.href}>
              <div
                className={`w-full p-4 rounded-2xl backdrop-blur-md hover:scale-[1.02] transition-all duration-300 group ${index < actions.length - 1 ? 'mb-6' : ''}`}
                style={{
                  background: `
                    linear-gradient(135deg, 
                      rgba(255, 255, 255, 0.06) 0%, 
                      rgba(255, 255, 255, 0.02) 100%
                    )
                  `,
                  boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                }}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${action.color} group-hover:rotate-12 transition-transform duration-300`}>
                    <IconComponent className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left flex-1">
                    <p className="font-semibold text-white mb-1">
                      {action.title}
                    </p>
                    <p className="text-sm text-white/60">
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
