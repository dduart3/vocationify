import { useEffect } from 'react'
import { User, Mail, Phone, MapPin, AlertCircle } from 'lucide-react'
import { useAuth } from '@/context/auth-context'
import { LocationPicker } from './location-picker'
import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import type { ProfileUpdateData } from '../types'

// Zod Schema with robust validation matching register form
const profileSchema = z.object({
  first_name: z
    .string()
    .trim()
    .min(1, 'El nombre es requerido')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede exceder 50 caracteres')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'El nombre solo puede contener letras')
    .refine((val) => val.split(/\s+/).every(word => word.length > 0), 'El nombre no puede contener espacios extras'),
  last_name: z
    .string()
    .trim()
    .min(1, 'El apellido es requerido')
    .min(2, 'El apellido debe tener al menos 2 caracteres')
    .max(50, 'El apellido no puede exceder 50 caracteres')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'El apellido solo puede contener letras')
    .refine((val) => val.split(/\s+/).every(word => word.length > 0), 'El apellido no puede contener espacios extras'),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email('Ingresa un correo válido')
    .max(100, 'El correo no puede exceder 100 caracteres')
    .refine((val) => {
      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
      return emailRegex.test(val)
    }, 'Formato de correo inválido')
    .refine((val) => {
      const disposableDomains = ['tempmail', 'throwaway', '10minutemail', 'guerrillamail']
      return !disposableDomains.some(domain => val.includes(domain))
    }, 'No se permiten correos temporales')
    .nullable()
    .optional(),
  phone: z
    .string()
    .optional()
    .refine((val) => {
      if (!val) return true
      if (!/^[\d\s()-]+$/.test(val)) return false
      const cleaned = val.replace(/\D/g, '')
      return cleaned.length === 11
    }, 'Ingresa un número de teléfono válido (0414 123 45 67)')
    .refine((val) => {
      if (!val) return true
      const cleaned = val.replace(/\D/g, '')
      if (cleaned.length === 11) {
        const areaCode = cleaned.substring(1, 4)
        return ['412', '414', '424', '416', '426'].includes(areaCode)
      }
      return true
    }, 'Ingresa un número de teléfono móvil venezolano válido')
    .nullable(),
  address: z
    .string()
    .trim()
    .max(200, 'La dirección no puede exceder 200 caracteres')
    .nullable()
    .optional(),
  location: z
    .object({
      latitude: z.number().min(-90).max(90),
      longitude: z.number().min(-180).max(180)
    })
    .nullable()
    .optional()
})

export type ProfileFormData = z.infer<typeof profileSchema>

// Export validation function for use in ProfilePage
export const validateProfileData = (data: Partial<ProfileFormData>): {isValid: boolean, errors: string[]} => {
  const result = profileSchema.safeParse(data)
  if (result.success) {
    return { isValid: true, errors: [] }
  }
  const errors = result.error.errors.map(err => err.message)
  return { isValid: false, errors }
}

// Format phone number as user types: 0414 123 4567
const formatPhoneNumber = (value: string): string => {
  const digits = value.replace(/\D/g, '')
  const limited = digits.slice(0, 11)

  if (limited.length <= 4) {
    return limited
  } else if (limited.length <= 7) {
    return `${limited.slice(0, 4)} ${limited.slice(4)}`
  } else {
    return `${limited.slice(0, 4)} ${limited.slice(4, 7)} ${limited.slice(7)}`
  }
}

interface ProfileFormProps {
  isEditing: boolean
  editData: ProfileUpdateData
  onDataChange: (data: ProfileUpdateData) => void
}

export function ProfileForm({ isEditing, editData, onDataChange }: ProfileFormProps) {
  const { profile } = useAuth()

  // TanStack Form with Zod validation
  const form = useForm({
    defaultValues: {
      first_name: editData.first_name || '',
      last_name: editData.last_name || '',
      email: editData.email || '',
      phone: editData.phone || '',
      address: editData.address || '',
      location: editData.location || null
    } as ProfileFormData,
    validators: {
      onChange: ({ value }) => {
        const result = profileSchema.safeParse(value)
        if (!result.success) {
          return result.error.formErrors.fieldErrors
        }
        return undefined
      }
    }
  })

  // Update form when editData changes (when edit mode is toggled)
  useEffect(() => {
    if (isEditing) {
      // Reset form fields to current editData values when entering edit mode
      form.setFieldValue('first_name', editData.first_name || '')
      form.setFieldValue('last_name', editData.last_name || '')
      form.setFieldValue('email', editData.email || '')
      form.setFieldValue('phone', editData.phone || '')
      form.setFieldValue('address', editData.address || '')
      form.setFieldValue('location', editData.location || null)
    }
  }, [isEditing])

  return (
    <div className="space-y-6">
      {/* Subscribe to form state changes and sync to parent */}
      <form.Subscribe
        selector={(state) => state.values}
        children={(values) => {
          if (isEditing && JSON.stringify(values) !== JSON.stringify(editData)) {
            console.log('🔄 Form values changed, syncing to parent:', values)
            onDataChange(values as ProfileUpdateData)
          }
          return null
        }}
      />

      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
        <User className="w-6 h-6 text-blue-600" />
        Información Personal
      </h3>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* First Name */}
          <form.Field
            name="first_name"
            validators={{
              onChange: ({ value }) => {
                const result = profileSchema.shape.first_name.safeParse(value)
                return result.success ? undefined : result.error.issues[0]?.message
              }
            }}
            children={(field) => (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Nombre</label>
                {isEditing ? (
                  <>
                    <input
                      type="text"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className={`w-full p-3 bg-gray-50 border rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
                        field.state.meta.errors.length > 0
                          ? 'border-red-300 focus:ring-red-500'
                          : 'border-gray-300 focus:ring-blue-500'
                      }`}
                      placeholder="Tu nombre"
                    />
                    {field.state.meta.errors.length > 0 && (
                      <div className="flex items-center gap-2 text-red-600 text-xs animate-fade-in">
                        <AlertCircle className="w-3 h-3" />
                        <span>{field.state.meta.errors[0]}</span>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900">
                    {profile?.first_name || 'No especificado'}
                  </div>
                )}
              </div>
            )}
          />

          {/* Last Name */}
          <form.Field
            name="last_name"
            validators={{
              onChange: ({ value }) => {
                const result = profileSchema.shape.last_name.safeParse(value)
                return result.success ? undefined : result.error.issues[0]?.message
              }
            }}
            children={(field) => (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Apellido</label>
                {isEditing ? (
                  <>
                    <input
                      type="text"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className={`w-full p-3 bg-gray-50 border rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
                        field.state.meta.errors.length > 0
                          ? 'border-red-300 focus:ring-red-500'
                          : 'border-gray-300 focus:ring-blue-500'
                      }`}
                      placeholder="Tu apellido"
                    />
                    {field.state.meta.errors.length > 0 && (
                      <div className="flex items-center gap-2 text-red-600 text-xs animate-fade-in">
                        <AlertCircle className="w-3 h-3" />
                        <span>{field.state.meta.errors[0]}</span>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900">
                    {profile?.last_name || 'No especificado'}
                  </div>
                )}
              </div>
            )}
          />
        </div>

        {/* Email */}
        <form.Field
          name="email"
          validators={{
            onChange: ({ value }) => {
              if (!value) return undefined
              const result = profileSchema.shape.email.safeParse(value)
              return result.success ? undefined : result.error.issues[0]?.message
            }
          }}
          children={(field) => (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Correo electrónico</label>
              {isEditing ? (
                <>
                  <input
                    type="email"
                    value={field.state.value || ''}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className={`w-full p-3 bg-gray-50 border rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
                      field.state.meta.errors.length > 0
                        ? 'border-red-300 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-blue-500'
                    }`}
                    placeholder="tu@email.com"
                  />
                  {field.state.meta.errors.length > 0 && (
                    <div className="flex items-center gap-2 text-red-600 text-xs animate-fade-in">
                      <AlertCircle className="w-3 h-3" />
                      <span>{field.state.meta.errors[0]}</span>
                    </div>
                  )}
                </>
              ) : (
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-blue-600" />
                  {profile?.email || 'No especificado'}
                </div>
              )}
            </div>
          )}
        />

        {/* Phone */}
        <form.Field
          name="phone"
          validators={{
            onChange: ({ value }) => {
              if (!value) return undefined
              const result = profileSchema.shape.phone.safeParse(value)
              return result.success ? undefined : result.error.issues[0]?.message
            }
          }}
          children={(field) => (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Teléfono <span className="text-gray-500 text-xs">(opcional)</span>
              </label>
              {isEditing ? (
                <>
                  <input
                    type="tel"
                    value={field.state.value || ''}
                    onBlur={field.handleBlur}
                    onChange={(e) => {
                      const formatted = formatPhoneNumber(e.target.value)
                      field.handleChange(formatted)
                    }}
                    className={`w-full p-3 bg-gray-50 border rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
                      field.state.meta.errors.length > 0
                        ? 'border-red-300 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-blue-500'
                    }`}
                    placeholder="0414 123 45 67"
                    maxLength={14}
                  />
                  {field.state.meta.errors.length > 0 && (
                    <div className="flex items-center gap-2 text-red-600 text-xs animate-fade-in">
                      <AlertCircle className="w-3 h-3" />
                      <span>{field.state.meta.errors[0]}</span>
                    </div>
                  )}
                </>
              ) : (
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-blue-600" />
                  {profile?.phone || 'No especificado'}
                </div>
              )}
            </div>
          )}
        />

        {/* Address */}
        <form.Field
          name="address"
          validators={{
            onChange: ({ value }) => {
              if (!value) return undefined
              const result = profileSchema.shape.address.safeParse(value)
              return result.success ? undefined : result.error.issues[0]?.message
            }
          }}
          children={(field) => (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Dirección <span className="text-gray-500 text-xs">(opcional)</span>
              </label>
              {isEditing ? (
                <>
                  <textarea
                    rows={3}
                    value={field.state.value || ''}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className={`w-full p-3 bg-gray-50 border rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:border-transparent resize-none transition-all ${
                      field.state.meta.errors.length > 0
                        ? 'border-red-300 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-blue-500'
                    }`}
                    placeholder="Av. Universidad, Maracaibo, Zulia"
                  />
                  {field.state.meta.errors.length > 0 && (
                    <div className="flex items-center gap-2 text-red-600 text-xs animate-fade-in">
                      <AlertCircle className="w-3 h-3" />
                      <span>{field.state.meta.errors[0]}</span>
                    </div>
                  )}
                </>
              ) : (
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>{profile?.address || 'No especificado'}</span>
                </div>
              )}
            </div>
          )}
        />

        {/* Location */}
        <form.Field
          name="location"
          children={(field) => (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Ubicación en el mapa <span className="text-gray-500 text-xs">(opcional)</span>
              </label>
              {isEditing ? (
                <div className="space-y-2">
                  <p className="text-xs text-gray-500">
                    Haz clic en el mapa para seleccionar tu ubicación
                  </p>
                  <LocationPicker
                    value={field.state.value || undefined}
                    onChange={(location) => {
                      console.log('📍 LocationPicker onChange called with:', location)
                      field.handleChange(location || null)
                      console.log('📍 Field value after change:', field.state.value)
                    }}
                  />
                  {field.state.value && (
                    <p className="text-xs text-green-600">
                      ✓ Ubicación seleccionada: {field.state.value.latitude.toFixed(6)}, {field.state.value.longitude.toFixed(6)}
                    </p>
                  )}
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
                        onChange={() => {}}
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
          )}
        />
      </div>
    </div>
  )
}