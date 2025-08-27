import { Link } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import { 
  IconMail, 
  IconLoader2,
  IconArrowRight,
  IconAlertCircle,
  IconArrowLeft,
  IconKey
} from '@tabler/icons-react'

// Zod Schemas
const emailSchema = z.object({
  email: z
    .string()
    .min(1, 'El correo es requerido')
    .email('Formato de correo inválido')
})

const otpSchema = z.object({
  otp: z
    .string()
    .min(6, 'El código debe tener 6 dígitos')
    .max(6, 'El código debe tener 6 dígitos')
    .regex(/^\d{6}$/, 'El código debe contener solo números')
})

type EmailFormData = z.infer<typeof emailSchema>
type OtpFormData = z.infer<typeof otpSchema>

interface OtpLoginFormProps {
  step: 'email' | 'otp'
  onSendOtp: (data: EmailFormData) => Promise<void>
  onVerifyOtp: (data: OtpFormData) => Promise<void>
  onBackToEmail: () => void
  loading?: boolean
  error?: string | null
}

export function OtpLoginForm({ 
  step, 
  onSendOtp, 
  onVerifyOtp, 
  onBackToEmail,
  loading = false, 
  error 
}: OtpLoginFormProps) {

  // Email Form
  const emailForm = useForm({
    defaultValues: {
      email: ''
    },
    validators: {
      onSubmit: async ({ value }) => {
        const result = emailSchema.safeParse(value)
        if (!result.success) {
          return result.error.issues.map(issue => issue.message).join(', ')
        }
        return undefined
      }
    },
    onSubmit: async ({ value }) => {
      await onSendOtp(value)
    }
  })

  // OTP Form
  const otpForm = useForm({
    defaultValues: {
      otp: ''
    },
    validators: {
      onSubmit: async ({ value }) => {
        const result = otpSchema.safeParse(value)
        if (!result.success) {
          return result.error.issues.map(issue => issue.message).join(', ')
        }
        return undefined
      }
    },
    onSubmit: async ({ value }) => {
      await onVerifyOtp(value)
    }
  })

  if (step === 'email') {
    return (
      <div className="space-y-6">
        {/* Error Alert */}
        {error && (
          <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center space-x-3">
            <IconAlertCircle size={20} className="text-red-400 flex-shrink-0" />
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <form 
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            emailForm.handleSubmit()
          }}
          className="space-y-6"
        >
          {/* Email Field */}
          <emailForm.Field name="email">
            {(field) => (
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-200">
                  Correo Electrónico
                </label>
                <div className="relative">
                  <IconMail 
                    size={20} 
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" 
                  />
                  <input
                    type="email"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    placeholder="tu@correo.com"
                    disabled={loading}
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-white placeholder-neutral-400 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
                {field.state.meta.errors.length > 0 && (
                  <p className="text-red-400 text-sm mt-1">
                    {field.state.meta.errors[0]}
                  </p>
                )}
              </div>
            )}
          </emailForm.Field>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 disabled:cursor-not-allowed disabled:opacity-50 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none"
          >
            {loading ? (
              <>
                <IconLoader2 size={20} className="animate-spin" />
                <span>Enviando código...</span>
              </>
            ) : (
              <>
                <span>Enviar código</span>
                <IconArrowRight size={20} />
              </>
            )}
          </button>
        </form>

        {/* Back to Login */}
        <div className="text-center">
          <Link 
            to="/login"
            className="inline-flex items-center space-x-2 text-sm text-neutral-400 hover:text-white transition-colors duration-200 hover:underline"
          >
            <IconArrowLeft size={16} />
            <span>Volver al inicio de sesión</span>
          </Link>
        </div>
      </div>
    )
  }

  // OTP Step
  return (
    <div className="space-y-6">
      {/* Error Alert */}
      {error && (
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center space-x-3">
          <IconAlertCircle size={20} className="text-red-400 flex-shrink-0" />
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      <form 
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          otpForm.handleSubmit()
        }}
        className="space-y-6"
      >
        {/* OTP Field */}
        <otpForm.Field name="otp">
          {(field) => (
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-200">
                Código de verificación
              </label>
              <div className="relative">
                <IconKey 
                  size={20} 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" 
                />
                <input
                  type="text"
                  value={field.state.value}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 6)
                    field.handleChange(value)
                  }}
                  onBlur={field.handleBlur}
                  placeholder="123456"
                  disabled={loading}
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-white placeholder-neutral-400 disabled:opacity-50 disabled:cursor-not-allowed text-center text-2xl tracking-widest font-mono"
                  maxLength={6}
                />
              </div>
              {field.state.meta.errors.length > 0 && (
                <p className="text-red-400 text-sm mt-1">
                  {field.state.meta.errors[0]}
                </p>
              )}
            </div>
          )}
        </otpForm.Field>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 disabled:cursor-not-allowed disabled:opacity-50 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none"
        >
          {loading ? (
            <>
              <IconLoader2 size={20} className="animate-spin" />
              <span>Verificando...</span>
            </>
          ) : (
            <>
              <span>Verificar código</span>
              <IconArrowRight size={20} />
            </>
          )}
        </button>
      </form>

      {/* Back to Email Step */}
      <div className="text-center">
        <button
          onClick={onBackToEmail}
          disabled={loading}
          className="inline-flex items-center space-x-2 text-sm text-neutral-400 hover:text-white transition-colors duration-200 hover:underline disabled:opacity-50"
        >
          <IconArrowLeft size={16} />
          <span>Cambiar correo electrónico</span>
        </button>
      </div>
    </div>
  )
}