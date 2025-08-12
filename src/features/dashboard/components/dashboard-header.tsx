import { useAuthStore } from '@/stores/auth-store'
import { Sparkles } from 'lucide-react'

export function DashboardHeader() {
  const { profile } = useAuthStore()
  
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Buenos días'
    if (hour < 18) return 'Buenas tardes'
    return 'Buenas noches'
  }

  return (
    <div className="relative text-center space-y-4 mb-8">
      {/* Background glow effect */}
      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-96 h-16 bg-gradient-to-r from-blue-500/8 via-purple-500/10 to-indigo-500/8 blur-3xl rounded-full animate-pulse" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-center gap-3 mb-3">
          <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
            {getGreeting()}, {profile?.first_name || 'Usuario'}
          </h1>
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center backdrop-blur-md">
            <Sparkles className="w-5 h-5 text-blue-400 animate-pulse" />
          </div>
        </div>
        
        <p className="text-slate-300 text-xl max-w-2xl mx-auto leading-relaxed">
          Tu progreso vocacional te está esperando
        </p>
      </div>
    </div>
  )
}
