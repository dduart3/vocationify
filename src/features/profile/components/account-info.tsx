import { Shield, Calendar, Mail } from 'lucide-react'
import { useAuthStore } from '@/stores/auth-store'

export function AccountInfo() {
  const { user, profile } = useAuthStore()

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div 
      className="backdrop-blur-xl rounded-3xl p-6 shadow-2xl relative overflow-hidden"
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
      <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
        <Shield className="w-6 h-6 text-blue-400" />
        Información de Cuenta
      </h3>

      <div className="space-y-4">
        {/* Email */}
        <div 
          className="p-4 rounded-2xl backdrop-blur-sm"
          style={{
            background: `
              linear-gradient(135deg, 
                rgba(255, 255, 255, 0.1) 0%, 
                rgba(255, 255, 255, 0.05) 100%
              )
            `
          }}
        >
          <div className="text-sm text-white/60 mb-2">Email</div>
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-blue-400" />
            <span className="text-white font-medium">{user?.email}</span>
          </div>
        </div>

        {/* Role */}
        <div 
          className="p-4 rounded-2xl backdrop-blur-sm"
          style={{
            background: `
              linear-gradient(135deg, 
                rgba(255, 255, 255, 0.1) 0%, 
                rgba(255, 255, 255, 0.05) 100%
              )
            `
          }}
        >
          <div className="text-sm text-white/60 mb-2">Rol</div>
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-purple-400" />
            <span className="text-white font-medium">
              {profile?.role === 'admin' ? 'Administrador' : 'Usuario'}
            </span>
          </div>
        </div>

        {/* Member Since */}
        <div 
          className="p-4 rounded-2xl backdrop-blur-sm"
          style={{
            background: `
              linear-gradient(135deg, 
                rgba(255, 255, 255, 0.1) 0%, 
                rgba(255, 255, 255, 0.05) 100%
              )
            `
          }}
        >
          <div className="text-sm text-white/60 mb-2">Miembro desde</div>
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-green-400" />
            <span className="text-white font-medium">
              {profile?.created_at ? formatDate(profile.created_at) : 'No disponible'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}