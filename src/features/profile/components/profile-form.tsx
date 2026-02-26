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

  // Update form when editData changes (when edit mode is toggled or when Header edits fields)
  useEffect(() => {
    if (isEditing) {
      if (form.state.values.first_name !== editData.first_name) form.setFieldValue('first_name', editData.first_name || '')
      if (form.state.values.last_name !== editData.last_name) form.setFieldValue('last_name', editData.last_name || '')
      if (form.state.values.email !== editData.email) form.setFieldValue('email', editData.email || '')
      if (form.state.values.phone !== editData.phone) form.setFieldValue('phone', editData.phone || '')
      if (form.state.values.address !== editData.address) form.setFieldValue('address', editData.address || '')
      
      const loc1 = form.state.values.location
      const loc2 = editData.location
      if (loc1?.latitude !== loc2?.latitude || loc1?.longitude !== loc2?.longitude) {
         form.setFieldValue('location', editData.location || null)
      }
    }
  }, [isEditing, editData, form])

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center gap-2.5 mb-3 mt-2">
        <div className="flex items-center gap-1.5 px-3 py-1 sm:py-1.5 bg-slate-100/70 backdrop-blur-sm border border-slate-200/80 rounded-full shadow-[inset_0_1px_1px_rgba(255,255,255,1),0_1px_2px_rgba(0,0,0,0.02)] w-fit">
          <div className="flex items-center justify-center shrink-0">
            <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-500" strokeWidth={2.5} />
          </div>
          <h3 className="text-[13px] sm:text-[14px] font-medium text-slate-700 tracking-tight pr-0.5">
            Información Personal
          </h3>
        </div>
      </div>

      <div className="space-y-3 sm:space-y-3.5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          
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
              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-[11.5px] font-semibold text-slate-500 ml-1 tracking-tight">
                   <Mail className="w-3 h-3 text-blue-400" strokeWidth={2.5} />
                   Correo electrónico
                </label>
                {isEditing ? (
                  <>
                    <input
                      type="email"
                      value={field.state.value || ''}
                      onBlur={field.handleBlur}
                      onChange={(e) => {
                        field.handleChange(e.target.value)
                        onDataChange({ ...editData, email: e.target.value })
                      }}
                      className={`w-full px-3 py-1.5 sm:py-2 bg-white/60 border rounded-[12px] text-[13px] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:border-transparent shadow-[inset_0_1px_2px_rgba(0,0,0,0.02),0_1px_1px_rgba(255,255,255,1)] transition-all ${
                        field.state.meta.errors.length > 0
                          ? 'border-red-300 focus:ring-red-500/20'
                          : 'border-slate-200/80 focus:ring-blue-500/20 focus:border-blue-400'
                      }`}
                      placeholder="tu@email.com"
                    />
                    {field.state.meta.errors.length > 0 && (
                      <div className="flex items-center gap-1.5 text-red-500 text-[11px] font-medium ml-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>{field.state.meta.errors[0]}</span>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="w-full px-3 py-1.5 sm:py-2 bg-white/40 border border-slate-200/60 rounded-[12px] text-[13px] text-slate-700 font-medium shadow-[0_1px_1px_rgba(255,255,255,1)] min-h-[32px] sm:min-h-[36px] flex items-center">
                    <span>{profile?.email || 'No especificado'}</span>
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
              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-[11.5px] font-semibold text-slate-500 ml-1 tracking-tight">
                   <Phone className="w-3 h-3 text-blue-400" strokeWidth={2.5} />
                   Teléfono <span className="text-slate-400/80 font-medium">(opcional)</span>
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
                        onDataChange({ ...editData, phone: formatted })
                      }}
                      className={`w-full px-3 py-1.5 sm:py-2 bg-white/60 border rounded-[12px] text-[13px] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:border-transparent shadow-[inset_0_1px_2px_rgba(0,0,0,0.02),0_1px_1px_rgba(255,255,255,1)] transition-all ${
                        field.state.meta.errors.length > 0
                          ? 'border-red-300 focus:ring-red-500/20'
                          : 'border-slate-200/80 focus:ring-blue-500/20 focus:border-blue-400'
                      }`}
                      placeholder="0414 123 45 67"
                      maxLength={14}
                    />
                    {field.state.meta.errors.length > 0 && (
                      <div className="flex items-center gap-1.5 text-red-500 text-[11px] font-medium ml-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>{field.state.meta.errors[0]}</span>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="w-full px-3 py-1.5 sm:py-2 bg-white/40 border border-slate-200/60 rounded-[12px] text-[13px] text-slate-700 font-medium shadow-[0_1px_1px_rgba(255,255,255,1)] min-h-[32px] sm:min-h-[36px] flex items-center">
                    <span>{profile?.phone || 'No especificado'}</span>
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
              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-[11.5px] font-semibold text-slate-500 ml-1 tracking-tight">
                   <MapPin className="w-3 h-3 text-blue-400" strokeWidth={2.5} />
                   Dirección <span className="text-slate-400/80 font-medium">(opcional)</span>
                </label>
                {isEditing ? (
                  <>
                    <input
                      type="text"
                      value={field.state.value || ''}
                      onBlur={field.handleBlur}
                      onChange={(e) => {
                        field.handleChange(e.target.value)
                        onDataChange({ ...editData, address: e.target.value })
                      }}
                      className={`w-full px-3 py-1.5 sm:py-2 bg-white/60 border rounded-[12px] text-[13px] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:border-transparent shadow-[inset_0_1px_2px_rgba(0,0,0,0.02),0_1px_1px_rgba(255,255,255,1)] transition-all ${
                        field.state.meta.errors.length > 0
                          ? 'border-red-300 focus:ring-red-500/20'
                          : 'border-slate-200/80 focus:ring-blue-500/20 focus:border-blue-400'
                      }`}
                      placeholder="Av. Universidad, Maracaibo, Zulia"
                    />
                    {field.state.meta.errors.length > 0 && (
                      <div className="flex items-center gap-1.5 text-red-500 text-[11px] font-medium ml-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>{field.state.meta.errors[0]}</span>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="w-full px-3 py-1.5 sm:py-2 bg-white/40 border border-slate-200/60 rounded-[12px] text-[13px] text-slate-700 font-medium shadow-[0_1px_1px_rgba(255,255,255,1)] min-h-[32px] sm:min-h-[36px] flex items-center">
                    <span className="truncate">{profile?.address || 'No especificado'}</span>
                  </div>
                )}
              </div>
            )}
          />

          {/* Location */}
          <form.Field
            name="location"
            children={(field) => (
              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-[11.5px] font-semibold text-slate-500 ml-1 tracking-tight">
                   <MapPin className="w-3 h-3 text-blue-400" strokeWidth={2.5} />
                   Ubicación en el mapa <span className="text-slate-400/80 font-medium">(opcional)</span>
                </label>
                {isEditing ? (
                  <div className="space-y-1.5">
                    <div className="h-[140px] w-full rounded-[12px] overflow-hidden border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                        <LocationPicker
                          value={field.state.value || undefined}
                          onChange={(location) => {
                            field.handleChange(location || null)
                            onDataChange({ ...editData, location: location || null })
                          }}
                        />
                    </div>
                    {field.state.value && (
                      <p className="text-[10.5px] text-green-600 font-semibold ml-1">
                        ✓ Ubicación guardada
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="w-full">
                    {profile?.location ? (
                      <div className="w-full p-1 bg-white/40 border border-slate-200/60 rounded-[12px] shadow-[0_1px_1px_rgba(255,255,255,1)] h-[84px] overflow-hidden">
                        <LocationPicker
                          value={profile.location}
                          onChange={() => {}}
                          readOnly={true}
                        />
                      </div>
                    ) : (
                      <div className="w-full px-3 py-1.5 sm:py-2 bg-white/40 border border-slate-200/60 rounded-[12px] text-[13px] text-slate-700 font-medium shadow-[0_1px_1px_rgba(255,255,255,1)] min-h-[32px] sm:min-h-[36px] flex items-center">
                        <span>No especificado</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          />

        </div>
      </div>
    </div>
  )
}