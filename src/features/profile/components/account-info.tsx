import { Shield, Calendar, Mail } from 'lucide-react'
import { useAuth } from '@/context/auth-context'

export function AccountInfo() {
  const { user, profile } = useAuth()

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="bg-white/50 backdrop-blur-md rounded-[24px] p-6 sm:p-8 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),0_4px_20px_rgba(0,0,0,0.03)] border border-white/60 relative overflow-hidden h-full">
      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
        <Shield className="w-6 h-6 text-blue-600" />
        Información de Cuenta
      </h3>

      <div className="space-y-4">
        {/* Email */}
        <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200">
          <div className="text-sm text-gray-600 mb-2">Email</div>
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-blue-600" />
            <span className="text-gray-900 font-medium">{user?.email}</span>
          </div>
        </div>

        {/* Role */}
        <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200">
          <div className="text-sm text-gray-600 mb-2">Rol</div>
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-purple-600" />
            <span className="text-gray-900 font-medium">
              {profile?.role === 'admin' ? 'Administrador' : 'Usuario'}
            </span>
          </div>
        </div>

        {/* Member Since */}
        <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200">
          <div className="text-sm text-gray-600 mb-2">Miembro desde</div>
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-green-600" />
            <span className="text-gray-900 font-medium">
              {profile?.created_at ? formatDate(profile.created_at) : 'No disponible'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}