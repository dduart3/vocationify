import { IconClock, IconPlay, IconX } from '@tabler/icons-react'
import { useNavigate } from '@tanstack/react-router'
import type { IncompleteSession } from '../hooks/use-incomplete-session'

interface ResumeSessionBannerProps {
  session: IncompleteSession
  onDismiss: () => void
  onResume: () => void
}

export function ResumeSessionBanner({ session, onDismiss, onResume }: ResumeSessionBannerProps) {
  const navigate = useNavigate()

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))

    if (diffHours > 0) {
      return `hace ${diffHours}h ${diffMins}m`
    }
    return `hace ${diffMins}m`
  }

  const getPhaseText = (phase: string) => {
    switch (phase) {
      case 'greeting': return 'Iniciando conversación'
      case 'exploration': return 'Explorando intereses'
      case 'assessment': return 'Evaluando perfil'
      case 'recommendation': return 'Generando recomendaciones'
      default: return 'En progreso'
    }
  }

  const handleResume = () => {
    onResume()
    navigate({ 
      to: '/_authenticated/vocational-test',
      search: { sessionId: session.id }
    })
  }

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4">
      <div className="bg-gradient-to-r from-blue-600/90 to-purple-600/90 backdrop-blur-xl rounded-xl p-4 shadow-2xl ring-1 ring-white/20">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <IconClock className="w-5 h-5 text-white" />
            </div>
            
            <div className="flex-1">
              <h3 className="text-white font-semibold text-sm">
                Test vocacional en progreso
              </h3>
              <p className="text-white/80 text-xs mt-1">
                {getPhaseText(session.current_phase)} • {formatTime(session.updated_at)}
              </p>
            </div>
          </div>

          <button
            onClick={onDismiss}
            className="text-white/60 hover:text-white transition-colors duration-200 ml-2"
          >
            <IconX className="w-4 h-4" />
          </button>
        </div>

        <div className="flex gap-2 mt-4">
          <button
            onClick={handleResume}
            className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all duration-200 text-sm font-medium flex-1"
          >
            <IconPlay className="w-4 h-4" />
            Continuar test
          </button>
          
          <button
            onClick={onDismiss}
            className="px-4 py-2 text-white/80 hover:text-white transition-colors duration-200 text-sm"
          >
            Más tarde
          </button>
        </div>
      </div>
    </div>
  )
}