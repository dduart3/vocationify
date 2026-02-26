import { useAuth } from '@/context/auth-context'
import { Shimmer } from "@/components/ai-elements/shimmer"

export function DashboardHeader() {
  const { profile } = useAuth()
  
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Buenos días'
    if (hour < 18) return 'Buenas tardes'
    return 'Buenas noches'
  }

  return (
    <div id="welcome-section" className="relative text-center space-y-2 mb-2">
      <div className="relative z-10">
        <div className="flex items-center justify-center gap-1.5 mb-1">
          <h1 className="text-3xl md:text-4xl font-medium tracking-tight flex flex-wrap justify-center items-center gap-x-2">
            <span className="text-slate-500 font-light">{getGreeting()},</span>
            <Shimmer 
              as="span" 
              duration={3} 
              spread={1.5} 
              className="font-semibold [--color-muted-foreground:theme(colors.blue.400)] [--color-background:theme(colors.white)] drop-shadow-sm"
            >
              {profile?.first_name || 'Usuario'}
            </Shimmer>
          </h1>
        </div>

        <p className="text-slate-500 text-[15px] max-w-2xl mx-auto leading-relaxed font-light">
          Tu progreso vocacional te está esperando
        </p>
      </div>
    </div>
  )
}
