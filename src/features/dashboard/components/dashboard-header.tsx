import { useAuth } from '@/context/auth-context'
import { Sparkles } from 'lucide-react'

export function DashboardHeader() {
  const { profile } = useAuth()
  
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Buenos días'
    if (hour < 18) return 'Buenas tardes'
    return 'Buenas noches'
  }

  return (
    <div className="relative text-center space-y-4 mb-8">
      <div className="relative z-10">
        <div className="flex items-center justify-center gap-3 mb-3">
          <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-gray-900 via-blue-700 to-purple-700 bg-clip-text text-transparent">
            {getGreeting()}, {profile?.first_name || 'Usuario'}
          </h1>
          <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-blue-600 animate-pulse" />
          </div>
        </div>

        <p className="text-gray-600 text-xl max-w-2xl mx-auto leading-relaxed">
          Tu progreso vocacional te está esperando
        </p>
      </div>
    </div>
  )
}
