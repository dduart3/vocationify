import { IconUser, IconMail, IconEdit, IconCheck, IconX, IconShield } from '@tabler/icons-react'
import { useAuth } from '@/context/auth-context'

interface ProfileHeaderProps {
  isEditing: boolean
  isLoading?: boolean
  onEdit: () => void
  onSave: () => void
  onCancel: () => void
}

export function ProfileHeader({ isEditing, isLoading, onEdit, onSave, onCancel }: ProfileHeaderProps) {
  const { user, profile } = useAuth()

  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-6">
        {/* Avatar */}
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
          <IconUser className="w-12 h-12 text-white" />
        </div>
        
        {/* User Info */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            {profile?.first_name} {profile?.last_name}
          </h2>
          <p className="text-gray-600 flex items-center gap-2">
            <IconMail className="w-4 h-4" />
            {user?.email}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <IconShield className="w-4 h-4 text-blue-600" />
            <span className="text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
              {profile?.role === 'admin' ? 'Administrador' : 'Usuario'}
            </span>
          </div>
        </div>
      </div>

      {/* Edit Button */}
      {!isEditing ? (
        <button
          onClick={onEdit}
          className="flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-all duration-300"
        >
          <IconEdit className="w-4 h-4" />
          Editar
        </button>
      ) : (
        <div className="flex gap-2">
          <button
            onClick={onSave}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <IconCheck className="w-4 h-4" />
            {isLoading ? 'Guardando...' : 'Guardar'}
          </button>
          <button
            onClick={onCancel}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg transition-all duration-300"
          >
            <IconX className="w-4 h-4" />
            Cancelar
          </button>
        </div>
      )}
    </div>
  )
}