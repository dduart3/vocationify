import { useState } from 'react'
import { IconUser } from '@tabler/icons-react'
import { useAuthStore } from '@/stores/auth-store'
import type { ProfileUpdateData } from '../types'

interface ProfileFormProps {
  isEditing: boolean
  editData: ProfileUpdateData
  onDataChange: (data: ProfileUpdateData) => void
}

export function ProfileForm({ isEditing, editData, onDataChange }: ProfileFormProps) {
  const { profile } = useAuthStore()

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <IconUser className="w-5 h-5 text-blue-400" />
        Información Personal
      </h3>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* First Name */}
          <div className="space-y-2">
            <label className="text-sm text-neutral-300">Nombre</label>
            {isEditing ? (
              <input
                type="text"
                value={editData.first_name}
                onChange={(e) => onDataChange({...editData, first_name: e.target.value})}
                className="w-full p-3 bg-gradient-to-r from-white/10 to-white/5 rounded-xl text-white placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-blue-500/50 backdrop-blur-sm shadow-inner"
                placeholder="Tu nombre"
                required
              />
            ) : (
              <div className="p-3 bg-gradient-to-r from-white/8 to-white/3 rounded-xl text-white shadow-inner backdrop-blur-sm">
                {profile?.first_name || 'No especificado'}
              </div>
            )}
          </div>

          {/* Last Name */}
          <div className="space-y-2">
            <label className="text-sm text-neutral-300">Apellido</label>
            {isEditing ? (
              <input
                type="text"
                value={editData.last_name}
                onChange={(e) => onDataChange({...editData, last_name: e.target.value})}
                className="w-full p-3 bg-gradient-to-r from-white/10 to-white/5 rounded-xl text-white placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-blue-500/50 backdrop-blur-sm shadow-inner"
                placeholder="Tu apellido"
                required
              />
            ) : (
              <div className="p-3 bg-gradient-to-r from-white/8 to-white/3 rounded-xl text-white shadow-inner backdrop-blur-sm">
                {profile?.last_name || 'No especificado'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}