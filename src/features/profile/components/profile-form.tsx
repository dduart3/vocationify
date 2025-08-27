import { User, Mail, Phone, MapPin } from 'lucide-react'
import { useAuthStore } from '@/stores/auth-store'
import { LocationPicker } from './location-picker'
import type { ProfileUpdateData } from '../types'

interface ProfileFormProps {
  isEditing: boolean
  editData: ProfileUpdateData
  onDataChange: (data: ProfileUpdateData) => void
}

export function ProfileForm({ isEditing, editData, onDataChange }: ProfileFormProps) {
  const { profile } = useAuthStore()

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
        <User className="w-6 h-6 text-blue-400" />
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
                value={editData.first_name || ''}
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
                value={editData.last_name || ''}
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

        {/* Email */}
        <div className="space-y-2">
          <label className="text-sm text-neutral-300">Correo electrónico</label>
          {isEditing ? (
            <input
              type="email"
              value={editData.email || ''}
              onChange={(e) => onDataChange({...editData, email: e.target.value})}
              className="w-full p-3 bg-gradient-to-r from-white/10 to-white/5 rounded-xl text-white placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-blue-500/50 backdrop-blur-sm shadow-inner"
              placeholder="tu@email.com"
            />
          ) : (
            <div className="p-3 bg-gradient-to-r from-white/8 to-white/3 rounded-xl text-white shadow-inner backdrop-blur-sm flex items-center gap-2">
              <Mail className="w-4 h-4 text-blue-400" />
              {profile?.email || 'No especificado'}
            </div>
          )}
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <label className="text-sm text-neutral-300">Teléfono</label>
          {isEditing ? (
            <input
              type="tel"
              value={editData.phone || ''}
              onChange={(e) => onDataChange({...editData, phone: e.target.value})}
              className="w-full p-3 bg-gradient-to-r from-white/10 to-white/5 rounded-xl text-white placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-blue-500/50 backdrop-blur-sm shadow-inner"
              placeholder="+58 412 123 4567"
            />
          ) : (
            <div className="p-3 bg-gradient-to-r from-white/8 to-white/3 rounded-xl text-white shadow-inner backdrop-blur-sm flex items-center gap-2">
              <Phone className="w-4 h-4 text-blue-400" />
              {profile?.phone || 'No especificado'}
            </div>
          )}
        </div>

        {/* Address */}
        <div className="space-y-2">
          <label className="text-sm text-neutral-300">Dirección</label>
          {isEditing ? (
            <textarea
              rows={3}
              value={editData.address || ''}
              onChange={(e) => onDataChange({...editData, address: e.target.value})}
              className="w-full p-3 bg-gradient-to-r from-white/10 to-white/5 rounded-xl text-white placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-blue-500/50 backdrop-blur-sm shadow-inner resize-none"
              placeholder="Av. Universidad, Maracaibo, Zulia"
            />
          ) : (
            <div className="p-3 bg-gradient-to-r from-white/8 to-white/3 rounded-xl text-white shadow-inner backdrop-blur-sm flex items-start gap-2">
              <MapPin className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
              <span>{profile?.address || 'No especificado'}</span>
            </div>
          )}
        </div>

        {/* Location */}
        <div className="space-y-2">
          <label className="text-sm text-neutral-300">Ubicación en el mapa</label>
          {isEditing ? (
            <div className="space-y-2">
              <p className="text-xs text-neutral-400">
                Haz clic en el mapa para seleccionar tu ubicación
              </p>
              <LocationPicker
                value={editData.location}
                onChange={(location) => onDataChange({...editData, location})}
              />
            </div>
          ) : (
            <div className="space-y-2">
              {profile?.location ? (
                <div className="p-3 bg-gradient-to-r from-white/8 to-white/3 rounded-xl text-white shadow-inner backdrop-blur-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-blue-400" />
                    <span className="text-sm">
                      Lat: {profile.location.latitude.toFixed(6)}, 
                      Lng: {profile.location.longitude.toFixed(6)}
                    </span>
                  </div>
                  <LocationPicker
                    value={profile.location}
                    onChange={() => {}} // Read-only when not editing
                    readOnly={true}
                  />
                </div>
              ) : (
                <div className="p-3 bg-gradient-to-r from-white/8 to-white/3 rounded-xl text-white shadow-inner backdrop-blur-sm flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-400" />
                  No especificado
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}