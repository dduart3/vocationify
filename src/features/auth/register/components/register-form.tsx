import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import { 
  IconMail, 
  IconLock, 
  IconEye, 
  IconEyeOff,
  IconLoader2,
  IconArrowRight,
  IconAlertCircle,
  IconUser,
  IconPhone,
  IconMapPin
} from '@tabler/icons-react'
import { LocationPicker } from './location-picker'

// Zod Schema with robust validation
const baseRegisterSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, 'El nombre es requerido')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede exceder 50 caracteres')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'El nombre solo puede contener letras')
    .refine((val) => val.split(/\s+/).every(word => word.length > 0), 'El nombre no puede contener espacios extras'),
  lastName: z
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
    .min(1, 'El correo es requerido')
    .email('Ingresa un correo válido')
    .max(100, 'El correo no puede exceder 100 caracteres')
    .refine((val) => {
      // Basic email format validation
      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
      return emailRegex.test(val)
    }, 'Formato de correo inválido')
    .refine((val) => {
      // Reject disposable email domains
      const disposableDomains = ['tempmail', 'throwaway', '10minutemail', 'guerrillamail']
      return !disposableDomains.some(domain => val.includes(domain))
    }, 'No se permiten correos temporales'),
  password: z
    .string()
    .min(1, 'La contraseña es requerida')
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .max(100, 'La contraseña no puede exceder 100 caracteres')
    .regex(/[a-z]/, 'Debe contener al menos una letra minúscula')
    .regex(/[A-Z]/, 'Debe contener al menos una letra mayúscula')
    .regex(/[0-9]/, 'Debe contener al menos un número')
    .regex(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, 'Debe contener al menos un carácter especial')
    .refine((val) => {
      // No more than 3 consecutive identical characters
      return !/(.)\1{2,}/.test(val)
    }, 'No puede tener más de 2 caracteres idénticos consecutivos'),
  confirmPassword: z
    .string()
    .min(1, 'Confirmar contraseña es requerido'),
  phone: z
    .string()
    .optional()
    .refine((val) => {
      if (!val) return true
      // Only allow digits, spaces, parentheses, and hyphens
      if (!/^[\d\s()-]+$/.test(val)) return false
      // Remove all non-digit characters
      const cleaned = val.replace(/\D/g, '')
      // Venezuelan phone numbers are 11 digits including leading 0 (format: 0414 123 45 67)
      return cleaned.length === 11
    }, 'Ingresa un número de teléfono válido en formato (0414 123 45 67)')
    .refine((val) => {
      if (!val) return true
      const cleaned = val.replace(/\D/g, '')
      // Venezuelan mobile operators: second to fourth digits (e.g., 0414 -> 414)
      if (cleaned.length === 11) {
        const areaCode = cleaned.substring(1, 4)
        return ['412', '414', '424', '416', '426'].includes(areaCode)
      }
      return true
    }, 'Ingresa un número de teléfono móvil venezolano válido'),
  address: z
    .string()
    .trim()
    .max(200, 'La dirección no puede exceder 200 caracteres')
    .optional(),
  location: z
    .object({
      latitude: z.number().min(-90).max(90),
      longitude: z.number().min(-180).max(180)
    })
    .optional()
})

const registerSchema = baseRegisterSchema.refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"]
})

export type RegisterFormData = z.infer<typeof registerSchema>

// Format phone number as user types: 0414 123 4567
const formatPhoneNumber = (value: string): string => {
  // Remove all non-digit characters
  const digits = value.replace(/\D/g, '')

  // Limit to 11 digits
  const limited = digits.slice(0, 11)

  // Format as: 0414 123 4567 (4-3-4 pattern)
  if (limited.length <= 4) {
    return limited
  } else if (limited.length <= 7) {
    return `${limited.slice(0, 4)} ${limited.slice(4)}`
  } else {
    return `${limited.slice(0, 4)} ${limited.slice(4, 7)} ${limited.slice(7)}`
  }
}

interface RegisterFormProps {
  onSubmit: (data: RegisterFormData) => Promise<void>
  onSocialLogin: (provider: 'google') => Promise<void>
  loading?: boolean
  error?: string | null
}

export function RegisterForm({ onSubmit, loading = false, error }: RegisterFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // TanStack Form with Zod validation
  const form = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      address: '',
      location: undefined
    } as RegisterFormData,
    validators: {
      onChange: ({ value }) => {
        const result = registerSchema.safeParse(value)
        if (!result.success) {
          return result.error.formErrors.fieldErrors
        }
        return undefined
      }
    },
    onSubmit: async ({ value }) => {
      const result = registerSchema.safeParse(value)
      if (!result.success) {
        throw new Error('Datos del formulario inválidos')
      }
      await onSubmit(result.data)
    }
  })

  return (
    <div className="space-y-4">
      {/* Error Message */}
      {error && (
        <div 
          className="p-3 rounded-xl flex items-center gap-2 animate-fade-in"
          style={{
            background: 'rgba(239, 68, 68, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            boxShadow: '0 8px 32px rgba(239, 68, 68, 0.1)'
          }}
        >
          <IconAlertCircle size={16} className="text-red-400 flex-shrink-0" />
          <p className="text-red-300 text-sm">{error}</p>
        </div>
      )}

      {/* Google Register Button - DISABLED */}
      {/* <button
        onClick={() => onSocialLogin('google')}
        disabled={loading}
        className="w-full py-3 px-4 rounded-xl font-medium text-white transition-all duration-300 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed group text-sm mb-4"
        style={{
          background: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}
      >
        <IconBrandGoogle size={16} className="text-red-400" />
        <span>Registrarse con Google</span>
      </button> */}

      {/* Divider - DISABLED */}
      {/* <div className="flex items-center my-5">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent"></div>
        <span className="px-4 text-xs text-slate-400 font-medium">o completa el formulario</span>
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent"></div>
      </div> */}

      {/* Form */}
      <form 
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
        className="space-y-4"
      >
        {/* Names Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* First Name */}
          <form.Field
            name="firstName"
            validators={{
              onChange: ({ value }) => {
                const result = baseRegisterSchema.shape.firstName.safeParse(value)
                return result.success ? undefined : result.error.issues[0]?.message
              }
            }}
            children={(field) => (
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  Nombre
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                    <IconUser size={16} className="text-slate-400 group-focus-within:text-blue-400 transition-colors duration-200" />
                  </div>
                  <input
                    type="text"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className={`w-full pl-10 pr-3 py-3 rounded-xl text-white placeholder-slate-400 transition-all duration-300 focus:outline-none focus:ring-2 text-sm ${
                      field.state.meta.errors.length > 0
                        ? 'focus:ring-red-500/50'
                        : 'focus:ring-blue-500/50'
                    }`}
                    style={{
                      background: 'rgba(255, 255, 255, 0.08)',
                      backdropFilter: 'blur(10px)',
                      border: `1px solid ${
                        field.state.meta.errors.length > 0
                          ? 'rgba(239, 68, 68, 0.3)'
                          : 'rgba(255, 255, 255, 0.1)'
                      }`,
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                    }}
                    placeholder="Juan"
                  />
                </div>
                {field.state.meta.errors.length > 0 && (
                  <div className="mt-1.5 flex items-center gap-2 animate-fade-in">
                    <IconAlertCircle size={12} className="text-red-400" />
                    <p className="text-red-400 text-xs">
                      {field.state.meta.errors[0]}
                    </p>
                  </div>
                )}
              </div>
            )}
          />

          {/* Last Name */}
          <form.Field
            name="lastName"
            validators={{
              onChange: ({ value }) => {
                const result = baseRegisterSchema.shape.lastName.safeParse(value)
                return result.success ? undefined : result.error.issues[0]?.message
              }
            }}
            children={(field) => (
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  Apellido
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                    <IconUser size={16} className="text-slate-400 group-focus-within:text-blue-400 transition-colors duration-200" />
                  </div>
                  <input
                    type="text"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className={`w-full pl-10 pr-3 py-3 rounded-xl text-white placeholder-slate-400 transition-all duration-300 focus:outline-none focus:ring-2 text-sm ${
                      field.state.meta.errors.length > 0
                        ? 'focus:ring-red-500/50'
                        : 'focus:ring-blue-500/50'
                    }`}
                    style={{
                      background: 'rgba(255, 255, 255, 0.08)',
                      backdropFilter: 'blur(10px)',
                      border: `1px solid ${
                        field.state.meta.errors.length > 0
                          ? 'rgba(239, 68, 68, 0.3)'
                          : 'rgba(255, 255, 255, 0.1)'
                      }`,
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                    }}
                    placeholder="Pérez"
                  />
                </div>
                {field.state.meta.errors.length > 0 && (
                  <div className="mt-1.5 flex items-center gap-2 animate-fade-in">
                    <IconAlertCircle size={12} className="text-red-400" />
                    <p className="text-red-400 text-xs">
                      {field.state.meta.errors[0]}
                    </p>
                  </div>
                )}
              </div>
            )}
          />
        </div>

        {/* Email Field */}
        <form.Field
          name="email"
          validators={{
            onChange: ({ value }) => {
              const result = baseRegisterSchema.shape.email.safeParse(value)
              return result.success ? undefined : result.error.issues[0]?.message
            }
          }}
          children={(field) => (
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                Correo Electrónico
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <IconMail size={16} className="text-slate-400 group-focus-within:text-blue-400 transition-colors duration-200" />
                </div>
                <input
                  type="email"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className={`w-full pl-10 pr-3 py-3 rounded-xl text-white placeholder-slate-400 transition-all duration-300 focus:outline-none focus:ring-2 text-sm ${
                    field.state.meta.errors.length > 0
                      ? 'focus:ring-red-500/50'
                      : 'focus:ring-blue-500/50'
                  }`}
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    backdropFilter: 'blur(10px)',
                    border: `1px solid ${
                      field.state.meta.errors.length > 0
                        ? 'rgba(239, 68, 68, 0.3)'
                        : 'rgba(255, 255, 255, 0.1)'
                    }`,
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                  }}
                  placeholder="juan@email.com"
                />
              </div>
              {field.state.meta.errors.length > 0 && (
                <div className="mt-1.5 flex items-center gap-2 animate-fade-in">
                  <IconAlertCircle size={12} className="text-red-400" />
                  <p className="text-red-400 text-xs">
                    {field.state.meta.errors[0]}
                  </p>
                </div>
              )}
            </div>
          )}
        />

        {/* Password Fields Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Password */}
          <form.Field
            name="password"
            validators={{
              onChange: ({ value }) => {
                const result = baseRegisterSchema.shape.password.safeParse(value)
                return result.success ? undefined : result.error.issues[0]?.message
              }
            }}
            children={(field) => (
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  Contraseña
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                    <IconLock size={16} className="text-slate-400 group-focus-within:text-blue-400 transition-colors duration-200" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className={`w-full pl-10 pr-10 py-3 rounded-xl text-white placeholder-slate-400 transition-all duration-300 focus:outline-none focus:ring-2 text-sm ${
                      field.state.meta.errors.length > 0
                        ? 'focus:ring-red-500/50'
                        : 'focus:ring-blue-500/50'
                    }`}
                    style={{
                      background: 'rgba(255, 255, 255, 0.08)',
                      backdropFilter: 'blur(10px)',
                      border: `1px solid ${
                        field.state.meta.errors.length > 0
                          ? 'rgba(239, 68, 68, 0.3)'
                          : 'rgba(255, 255, 255, 0.1)'
                      }`,
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                    }}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white transition-colors duration-200 z-10"
                  >
                    {showPassword ? <IconEyeOff size={16} /> : <IconEye size={16} />}
                  </button>
                </div>
                {field.state.meta.errors.length > 0 && (
                  <div className="mt-1.5 flex items-center gap-2 animate-fade-in">
                    <IconAlertCircle size={12} className="text-red-400" />
                    <p className="text-red-400 text-xs">
                      {field.state.meta.errors[0]}
                    </p>
                  </div>
                )}
              </div>
            )}
          />

          {/* Confirm Password */}
          <form.Field
            name="confirmPassword"
            validators={{
              onChange: ({ value }) => {
                const password = form.getFieldValue('password')
                if (value && password && value !== password) {
                  return 'Las contraseñas no coinciden'
                }
                return undefined
              }
            }}
            children={(field) => (
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  Confirmar Contraseña
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                    <IconLock size={16} className="text-slate-400 group-focus-within:text-blue-400 transition-colors duration-200" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className={`w-full pl-10 pr-10 py-3 rounded-xl text-white placeholder-slate-400 transition-all duration-300 focus:outline-none focus:ring-2 text-sm ${
                      field.state.meta.errors.length > 0
                        ? 'focus:ring-red-500/50'
                        : 'focus:ring-blue-500/50'
                    }`}
                    style={{
                      background: 'rgba(255, 255, 255, 0.08)',
                      backdropFilter: 'blur(10px)',
                      border: `1px solid ${
                        field.state.meta.errors.length > 0
                          ? 'rgba(239, 68, 68, 0.3)'
                          : 'rgba(255, 255, 255, 0.1)'
                      }`,
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                    }}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white transition-colors duration-200 z-10"
                  >
                    {showConfirmPassword ? <IconEyeOff size={16} /> : <IconEye size={16} />}
                  </button>
                </div>
                {field.state.meta.errors.length > 0 && (
                  <div className="mt-1.5 flex items-center gap-2 animate-fade-in">
                    <IconAlertCircle size={12} className="text-red-400" />
                    <p className="text-red-400 text-xs">
                      {field.state.meta.errors[0]}
                    </p>
                  </div>
                )}
              </div>
            )}
          />
        </div>

        {/* Phone Field */}
        <form.Field
          name="phone"
          validators={{
            onChange: ({ value }) => {
              const result = baseRegisterSchema.shape.phone.safeParse(value)
              return result.success ? undefined : result.error.issues[0]?.message
            }
          }}
          children={(field) => (
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                Teléfono <span className="text-slate-400">(opcional)</span>
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <IconPhone size={16} className="text-slate-400 group-focus-within:text-blue-400 transition-colors duration-200" />
                </div>
                <input
                  type="tel"
                  value={field.state.value || ''}
                  onBlur={field.handleBlur}
                  onChange={(e) => {
                    const formatted = formatPhoneNumber(e.target.value)
                    field.handleChange(formatted)
                  }}
                  className={`w-full pl-10 pr-3 py-3 rounded-xl text-white placeholder-slate-400 transition-all duration-300 focus:outline-none focus:ring-2 text-sm ${
                    field.state.meta.errors.length > 0
                      ? 'focus:ring-red-500/50'
                      : 'focus:ring-blue-500/50'
                  }`}
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    backdropFilter: 'blur(10px)',
                    border: `1px solid ${
                      field.state.meta.errors.length > 0
                        ? 'rgba(239, 68, 68, 0.3)'
                        : 'rgba(255, 255, 255, 0.1)'
                    }`,
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                  }}
                  placeholder="0414 123 45 67"
                  maxLength={14}
                />
              </div>
              {field.state.meta.errors.length > 0 && (
                <div className="mt-1.5 flex items-center gap-2 animate-fade-in">
                  <IconAlertCircle size={12} className="text-red-400" />
                  <p className="text-red-400 text-xs">
                    {field.state.meta.errors[0]}
                  </p>
                </div>
              )}
            </div>
          )}
        />

        {/* Address Field */}
        <form.Field
          name="address"
          children={(field) => (
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                Dirección <span className="text-slate-400">(opcional)</span>
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <IconMapPin size={16} className="text-slate-400 group-focus-within:text-blue-400 transition-colors duration-200" />
                </div>
                <textarea
                  rows={2}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 rounded-xl text-white placeholder-slate-400 transition-all duration-300 focus:outline-none focus:ring-2 text-sm focus:ring-blue-500/50 resize-none"
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                  }}
                  placeholder="Av. Universidad, Maracaibo, Zulia"
                />
              </div>
            </div>
          )}
        />

        {/* Location Picker */}
        <form.Field
          name="location"
          children={(field) => (
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                Ubicación en el mapa <span className="text-slate-400">(opcional)</span>
              </label>
              <p className="text-slate-400 text-xs mb-3">
                Haz clic en el mapa para seleccionar tu ubicación
              </p>
              <LocationPicker
                value={field.state.value}
                onChange={(location) => {
                  console.log('📍 Register - LocationPicker onChange:', location)
                  field.handleChange(location || undefined)
                  console.log('📍 Register - Field value after change:', field.state.value)
                }}
              />
              {field.state.value && (
                <p className="text-green-400 text-xs mt-2">
                  ✓ Ubicación seleccionada: {field.state.value.latitude.toFixed(6)}, {field.state.value.longitude.toFixed(6)}
                </p>
              )}
            </div>
          )}
        />

        {/* Submit Button */}
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <button
              type="submit"
              disabled={!canSubmit || loading || isSubmitting}
              className="w-full py-3 px-4 rounded-xl font-semibold text-white transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] text-sm"
              style={{
                background: (!canSubmit || loading || isSubmitting)
                  ? 'rgba(59, 130, 246, 0.5)' 
                  : 'linear-gradient(135deg, rgba(59, 130, 246, 0.8) 0%, rgba(147, 51, 234, 0.8) 100%)',
                boxShadow: (!canSubmit || loading || isSubmitting)
                  ? 'none' 
                  : '0 15px 30px rgba(59, 130, 246, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)'
              }}
            >
              {(loading || isSubmitting) ? (
                <>
                  <IconLoader2 size={16} className="animate-spin" />
                  <span>Creando cuenta...</span>
                </>
              ) : (
                <>
                  <span>Crear Cuenta</span>
                  <IconArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-200" />
                </>
              )}
            </button>
          )}
        />
      </form>

      {/* Sign In Link */}
      <div className="text-center pt-3">
        <p className="text-slate-400 text-xs">
          ¿Ya tienes una cuenta?{' '}
          <Link 
            to="/login" 
            className="text-blue-400 hover:text-blue-300 transition-colors duration-200 font-medium hover:underline"
          >
            Inicia sesión aquí
          </Link>
        </p>
      </div>
    </div>
  )
}