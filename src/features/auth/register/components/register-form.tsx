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

  const inputBaseClass = "flex h-10 w-full rounded-md border bg-transparent px-3 text-sm placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"

  return (
    <div className="space-y-4">
      {/* Error Message */}
      {error && (
        <div className="p-3 rounded-md bg-red-50 border border-red-200 flex items-center space-x-3">
          <IconAlertCircle size={16} className="text-red-500 flex-shrink-0" />
          <p className="text-red-500 text-sm font-medium">{error}</p>
        </div>
      )}

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
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-900">
                  Nombre
                </label>
                <div className="relative group">
                  <IconUser 
                    size={16} 
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors duration-200 z-10" 
                  />
                  <input
                    type="text"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className={`${inputBaseClass} pl-10 ${
                      field.state.meta.errors.length > 0
                        ? 'border-red-500 focus-visible:ring-red-500'
                        : 'border-slate-200'
                    }`}
                    placeholder="Juan"
                  />
                </div>
                {field.state.meta.errors.length > 0 && (
                  <div className="flex items-center gap-2 animate-fade-in">
                    <IconAlertCircle size={12} className="text-red-500" />
                    <p className="text-red-500 text-xs font-medium">
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
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-900">
                  Apellido
                </label>
                <div className="relative group">
                  <IconUser 
                    size={16} 
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors duration-200 z-10" 
                  />
                  <input
                    type="text"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className={`${inputBaseClass} pl-10 ${
                      field.state.meta.errors.length > 0
                        ? 'border-red-500 focus-visible:ring-red-500'
                        : 'border-slate-200'
                    }`}
                    placeholder="Pérez"
                  />
                </div>
                {field.state.meta.errors.length > 0 && (
                  <div className="flex items-center gap-2 animate-fade-in">
                    <IconAlertCircle size={12} className="text-red-500" />
                    <p className="text-red-500 text-xs font-medium">
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
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-900">
                Correo Electrónico
              </label>
              <div className="relative group">
                <IconMail 
                  size={16} 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors duration-200 z-10" 
                />
                <input
                  type="email"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className={`${inputBaseClass} pl-10 ${
                    field.state.meta.errors.length > 0
                      ? 'border-red-500 focus-visible:ring-red-500'
                      : 'border-slate-200'
                  }`}
                  placeholder="juan@email.com"
                />
              </div>
              {field.state.meta.errors.length > 0 && (
                <div className="flex items-center gap-2 animate-fade-in">
                  <IconAlertCircle size={12} className="text-red-500" />
                  <p className="text-red-500 text-xs font-medium">
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
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-900">
                  Contraseña
                </label>
                <div className="relative group">
                  <IconLock 
                    size={16} 
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors duration-200 z-10" 
                  />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className={`${inputBaseClass} pl-10 pr-10 ${
                      field.state.meta.errors.length > 0
                        ? 'border-red-500 focus-visible:ring-red-500'
                        : 'border-slate-200'
                    }`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-900 transition-colors duration-200 z-10"
                  >
                    {showPassword ? <IconEyeOff size={16} /> : <IconEye size={16} />}
                  </button>
                </div>
                {field.state.meta.errors.length > 0 && (
                  <div className="flex items-center gap-2 animate-fade-in">
                    <IconAlertCircle size={12} className="text-red-500" />
                    <p className="text-red-500 text-xs font-medium">
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
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-900">
                  Confirmar Contraseña
                </label>
                <div className="relative group">
                  <IconLock 
                    size={16} 
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors duration-200 z-10" 
                  />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className={`${inputBaseClass} pl-10 pr-10 ${
                      field.state.meta.errors.length > 0
                        ? 'border-red-500 focus-visible:ring-red-500'
                        : 'border-slate-200'
                    }`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-900 transition-colors duration-200 z-10"
                  >
                    {showConfirmPassword ? <IconEyeOff size={16} /> : <IconEye size={16} />}
                  </button>
                </div>
                {field.state.meta.errors.length > 0 && (
                  <div className="flex items-center gap-2 animate-fade-in">
                    <IconAlertCircle size={12} className="text-red-500" />
                    <p className="text-red-500 text-xs font-medium">
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
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-900">
                Teléfono <span className="text-slate-500 font-normal">(opcional)</span>
              </label>
              <div className="relative group">
                <IconPhone 
                  size={16} 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors duration-200 z-10" 
                />
                <input
                  type="tel"
                  value={field.state.value || ''}
                  onBlur={field.handleBlur}
                  onChange={(e) => {
                    const formatted = formatPhoneNumber(e.target.value)
                    field.handleChange(formatted)
                  }}
                  className={`${inputBaseClass} pl-10 ${
                    field.state.meta.errors.length > 0
                      ? 'border-red-500 focus-visible:ring-red-500'
                      : 'border-slate-200'
                  }`}
                  placeholder="0414 123 45 67"
                  maxLength={14}
                />
              </div>
              {field.state.meta.errors.length > 0 && (
                <div className="flex items-center gap-2 animate-fade-in">
                  <IconAlertCircle size={12} className="text-red-500" />
                  <p className="text-red-500 text-xs font-medium">
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
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-900">
                Dirección <span className="text-slate-500 font-normal">(opcional)</span>
              </label>
              <div className="relative group">
                <IconMapPin 
                  size={16} 
                  className="absolute left-3 top-3 text-slate-400 group-focus-within:text-slate-900 transition-colors duration-200 z-10" 
                />
                <textarea
                  rows={2}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="flex min-h-[60px] w-full rounded-md border border-slate-200 bg-transparent px-3 pl-10 py-2 text-sm placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none transition-colors"
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
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-900">
                Ubicación en el mapa <span className="text-slate-500 font-normal">(opcional)</span>
              </label>
              <p className="text-slate-500 text-xs mt-1">
                Haz clic en el mapa para seleccionar tu ubicación
              </p>
              <div className="rounded-md border border-slate-200 overflow-hidden mt-2">
                <LocationPicker
                  value={field.state.value}
                  onChange={(location) => {
                    field.handleChange(location || undefined)
                  }}
                />
              </div>
              {field.state.value && (
                <p className="text-emerald-600 font-medium text-xs mt-2">
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
              className="inline-flex w-full items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-slate-900 text-slate-50 hover:bg-slate-900/90 h-10 px-4 py-2 mt-4"
            >
              {(loading || isSubmitting) ? (
                <>
                  <IconLoader2 size={16} className="mr-2 animate-spin" />
                  Creando cuenta...
                </>
              ) : (
                <>
                  Crear Cuenta
                  <IconArrowRight size={16} className="ml-2" />
                </>
              )}
            </button>
          )}
        />
      </form>

      {/* Sign In Link */}
      <div className="text-center pt-2">
        <p className="text-slate-500 text-sm">
          ¿Ya tienes una cuenta?{' '}
          <Link 
            to="/login" 
            className="font-semibold text-slate-900 underline-offset-4 hover:underline"
          >
            Inicia sesión aquí
          </Link>
        </p>
      </div>
    </div>
  )
}