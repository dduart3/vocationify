import { User, Mail, Phone, MapPin } from 'lucide-react'
import { useAuth } from '@/context/auth-context'
import { LocationPicker } from './location-picker'
import type { ProfileUpdateData } from '../types'

interface ProfileFormProps {
  isEditing: boolean
  editData: ProfileUpdateData
  onDataChange: (data: ProfileUpdateData) => void
}

export function ProfileForm({ isEditing, editData, onDataChange }: ProfileFormProps) {
  const { profile } = useAuth()

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
        <User className="w-6 h-6 text-blue-600" />
        Información Personal
      </h3>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* First Name */}
          <div className="space-y-2">
            <label className="text-sm text-gray-700">Nombre</label>
            {isEditing ? (
              <input
                type="text"
                value={editData.first_name || ''}
                onChange={(e) => onDataChange({...editData, first_name: e.target.value})}
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Tu nombre"
                required
              />
            ) : (
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900">
                {profile?.first_name || 'No especificado'}
              </div>
            )}
          </div>

          {/* Last Name */}
          <div className="space-y-2">
            <label className="text-sm text-gray-700">Apellido</label>
            {isEditing ? (
              <input
                type="text"
                value={editData.last_name || ''}
                onChange={(e) => onDataChange({...editData, last_name: e.target.value})}
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Tu apellido"
                required
              />
            ) : (
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900">
                {profile?.last_name || 'No especificado'}
              </div>
            )}
          </div>
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label className="text-sm text-gray-700">Correo electrónico</label>
          {isEditing ? (
            <input
              type="email"
              value={editData.email || ''}
              onChange={(e) => onDataChange({...editData, email: e.target.value})}
              className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="tu@email.com"
            />
          ) : (
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 flex items-center gap-2">
              <Mail className="w-4 h-4 text-blue-600" />
              {profile?.email || 'No especificado'}
            </div>
          )}
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <label className="text-sm text-gray-700">Teléfono</label>
          {isEditing ? (
            <input
              type="tel"
              value={editData.phone || ''}
              onChange={(e) => onDataChange({...editData, phone: e.target.value})}
              className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="+58 412 123 4567"
            />
          ) : (
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 flex items-center gap-2">
              <Phone className="w-4 h-4 text-blue-600" />
              {profile?.phone || 'No especificado'}
            </div>
          )}
        </div>

        {/* Address */}
        <div className="space-y-2">
          <label className="text-sm text-gray-700">Dirección</label>
          {isEditing ? (
            <textarea
              rows={3}
              value={editData.address || ''}
              onChange={(e) => onDataChange({...editData, address: e.target.value})}
              className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Av. Universidad, Maracaibo, Zulia"
            />
          ) : (
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 flex items-start gap-2">
              <MapPin className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <span>{profile?.address || 'No especificado'}</span>
            </div>
          )}
        </div>

        {/* Location */}
        <div className="space-y-2">
          <label className="text-sm text-gray-700">Ubicación en el mapa</label>
          {isEditing ? (
            <div className="space-y-2">
              <p className="text-xs text-gray-500">
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
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-blue-600" />
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
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-600" />
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