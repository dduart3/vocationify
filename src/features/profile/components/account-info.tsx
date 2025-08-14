import { IconShield, IconCalendar, IconMail } from '@tabler/icons-react'
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
    <div className="bg-white/5 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <IconShield className="w-5 h-5 text-blue-400" />
        Información de Cuenta
      </h3>

      <div className="space-y-4">
        {/* Email */}
        <div className="space-y-2">
          <label className="text-sm text-neutral-400">Email</label>
          <div className="flex items-center gap-2 p-3 bg-white/10 rounded-lg">
            <IconMail className="w-4 h-4 text-blue-400" />
            <span className="text-white text-sm">{user?.email}</span>
          </div>
        </div>

        {/* Role */}
        <div className="space-y-2">
          <label className="text-sm text-neutral-400">Rol</label>
          <div className="flex items-center gap-2 p-3 bg-white/10 rounded-lg">
            <IconShield className="w-4 h-4 text-purple-400" />
            <span className="text-white text-sm">
              {profile?.role === 'admin' ? 'Administrador' : 'Usuario'}
            </span>
          </div>
        </div>

        {/* Member Since */}
        <div className="space-y-2">
          <label className="text-sm text-neutral-400">Miembro desde</label>
          <div className="flex items-center gap-2 p-3 bg-white/10 rounded-lg">
            <IconCalendar className="w-4 h-4 text-green-400" />
            <span className="text-white text-sm">
              {profile?.created_at ? formatDate(profile.created_at) : 'No disponible'}
            </span>
          </div>
        </div>

      </div>
    </div>
  )
}