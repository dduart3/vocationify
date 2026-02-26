import { Link } from '@tanstack/react-router'
import { Brain, GraduationCap, User } from 'lucide-react'

const actions = [
  {
    id: 'start-test-button',
    title: 'Nuevo Test Vocacional',
    description: 'Descubre tus aptitudes',
    icon: Brain,
    href: '/vocational-test',
    color: 'from-blue-500 to-blue-600',
  },
  {
    id: 'explore-schools-button',
    title: 'Explorar Universidades',
    description: 'Encuentra tu institución',
    icon: GraduationCap,
    href: '/schools',
    color: 'from-green-500 to-green-600',
  },
  {
    id: 'update-profile-button',
    title: 'Actualizar Perfil',
    description: 'Mantén tu información',
    icon: User,
    href: '/profile',
    color: 'from-orange-500 to-orange-600',
  },
]

export function QuickActions() {
  return (
    <div className="w-full flex flex-wrap items-center justify-center gap-3">
      {actions.map((action) => {
        const IconComponent = action.icon
        return (
          <Link key={action.title} to={action.href} className="block flex-1 min-w-[200px] max-w-[260px]">
            <div
              id={action.id}
              className="w-full py-2.5 px-4 rounded-full bg-white/60 backdrop-blur-2xl border border-white/60 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),0_4px_12px_rgba(0,0,0,0.03)] hover:bg-white/80 hover:shadow-[inset_0_1px_1px_rgba(255,255,255,1),0_4px_16px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 transition-all duration-300 group flex items-center justify-center gap-2.5"
            >
              <div className={`flex shrink-0 items-center justify-center w-7 h-7 rounded-full bg-gradient-to-b from-white to-blue-50 shadow-[0_2px_5px_rgba(0,0,0,0.05),inset_0_-1px_2px_rgba(0,0,0,0.02),inset_0_1px_2px_rgba(255,255,255,1)] border border-blue-100 group-hover:scale-110 transition-transform duration-300`}>
                <IconComponent className="w-3.5 h-3.5 text-blue-500 drop-shadow-sm" />
              </div>
              <p className="font-semibold text-[13px] text-gray-700 truncate group-hover:text-blue-600 transition-colors">
                {action.title}
              </p>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
