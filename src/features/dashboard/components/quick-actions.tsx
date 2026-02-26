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
    <>
      <style>{`
        @keyframes glare-sweep-quick {
          0% { transform: translateX(-150%) skewX(-20deg); }
          100% { transform: translateX(300%) skewX(-20deg); }
        }
      `}</style>
      <div className="flex flex-col items-center gap-1.5 w-full my-1.5 md:my-2">
        <h3 className="text-[10px] font-bold text-gray-500/80 uppercase tracking-wider text-center">
          Acciones rápidas
        </h3>
        <div className="w-full flex flex-col sm:flex-row items-center justify-center p-1 bg-slate-200/80 backdrop-blur-md border border-slate-300 shadow-inner rounded-3xl sm:rounded-full gap-1.5 lg:max-w-max mx-auto">
        {actions.map((action) => {
        const IconComponent = action.icon
        return (
          <Link key={action.title} to={action.href} className="block w-full sm:w-fit sm:flex-1">
            <div
              id={action.id}
              className="relative overflow-hidden w-full py-[7px] px-4 rounded-full bg-slate-50 border border-slate-200 shadow-[0_2px_5px_rgba(0,0,0,0.08),inset_0_-1px_2px_rgba(0,0,0,0.03),inset_0_1px_2px_rgba(255,255,255,1)] hover:shadow-[0_4px_12px_rgba(59,130,246,0.15),inset_0_-2px_4px_rgba(59,130,246,0.08),inset_0_2px_4px_rgba(255,255,255,1)] hover:bg-blue-50/80 hover:border-blue-200/60 hover:-translate-y-[1px] transition-all duration-300 group flex items-center justify-center gap-2 cursor-pointer"
            >
              {/* Shimmer Effect overlay */}
              <div className="absolute inset-0 -translate-x-[150%] opacity-0 group-hover:opacity-100 group-hover:animate-[glare-sweep-quick_2.5s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/80 to-transparent pointer-events-none transition-opacity duration-300" />
              
              <div className="relative z-10 flex shrink-0 items-center justify-center w-7 h-7 rounded-full bg-slate-100 border border-slate-200/60 shadow-[inset_0_2px_4px_rgba(255,255,255,0.7),0_1px_2px_rgba(0,0,0,0.05)] group-hover:bg-white group-hover:border-blue-100 group-hover:shadow-[inset_0_2px_4px_rgba(255,255,255,1),0_2px_6px_rgba(59,130,246,0.15)] transition-all duration-300">
                <IconComponent className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-500 drop-shadow-sm transition-colors duration-300" />
              </div>
              <p className="relative z-10 font-bold text-[12px] text-slate-600 whitespace-nowrap group-hover:text-blue-600 transition-colors duration-300">
                {action.title}
              </p>
            </div>
          </Link>
        )
        })}
        </div>
      </div>
    </>
  )
}
