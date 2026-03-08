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

  // Common UI classes
  const inputBaseClass = "flex h-10 w-full rounded-md border bg-transparent px-3 text-sm placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
  
  if (step === 'email') {
    return (
      <div className="space-y-6">
        {/* Error Alert */}
        {error && (
          <div className="p-3 rounded-md bg-red-50 border border-red-200 flex items-center space-x-3">
            <IconAlertCircle size={16} className="text-red-500 flex-shrink-0" />
            <p className="text-red-500 text-sm font-medium">{error}</p>
          </div>
        )}

        <form 
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            emailForm.handleSubmit()
          }}
          className="space-y-4"
        >
          {/* Email Field */}
          <emailForm.Field name="email">
            {(field) => (
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-900">
                  Correo Electrónico
                </label>
                <div className="relative group">
                  <IconMail 
                    size={16} 
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors duration-200" 
                  />
                  <input
                    type="email"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    placeholder="tu@correo.com"
                    disabled={loading}
                    className={`${inputBaseClass} pl-10 ${
                      field.state.meta.errors.length > 0
                        ? 'border-red-500 focus-visible:ring-red-500'
                        : 'border-slate-200'
                    }`}
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
          </emailForm.Field>

          {/* Submit Button */}
          <emailForm.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmitting]) => (
              <button
                type="submit"
                disabled={!canSubmit || loading || isSubmitting}
                className="inline-flex w-full items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-slate-900 text-slate-50 hover:bg-slate-900/90 h-10 px-4 py-2 mt-2"
              >
                {(loading || isSubmitting) ? (
                  <>
                    <IconLoader2 size={16} className="mr-2 animate-spin" />
                    Enviando código...
                  </>
                ) : (
                  <>
                    Enviar código
                    <IconArrowRight size={16} className="ml-2" />
                  </>
                )}
              </button>
            )}
          />
        </form>

        {/* Back to Login */}
        <div className="text-center">
          <Link 
            to="/login"
            className="inline-flex items-center justify-center space-x-2 text-sm text-slate-500 hover:text-slate-900 transition-colors duration-200 hover:underline underline-offset-4 font-medium"
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
        <div className="p-3 rounded-md bg-red-50 border border-red-200 flex items-center space-x-3">
          <IconAlertCircle size={16} className="text-red-500 flex-shrink-0" />
          <p className="text-red-500 text-sm font-medium">{error}</p>
        </div>
      )}

      <form 
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          otpForm.handleSubmit()
        }}
        className="space-y-4"
      >
        {/* OTP Field */}
        <otpForm.Field name="otp">
          {(field) => (
            <div className="space-y-2 text-center">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-900 text-left block">
                Código de verificación
              </label>
              <div className="relative group mx-auto">
                <IconKey 
                  size={16} 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors duration-200" 
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
                  className={`${inputBaseClass} pl-10 text-center tracking-widest font-mono text-lg py-5 ${
                    field.state.meta.errors.length > 0
                      ? 'border-red-500 focus-visible:ring-red-500'
                      : 'border-slate-200'
                  }`}
                  maxLength={6}
                />
              </div>
              {field.state.meta.errors.length > 0 && (
                <div className="flex items-center gap-2 animate-fade-in mt-1 justify-center">
                  <IconAlertCircle size={12} className="text-red-500" />
                  <p className="text-red-500 text-xs font-medium">
                    {field.state.meta.errors[0]}
                  </p>
                </div>
              )}
            </div>
          )}
        </otpForm.Field>

        {/* Submit Button */}
        <otpForm.Subscribe
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
                  Verificando...
                </>
              ) : (
                <>
                  Verificar código
                  <IconArrowRight size={16} className="ml-2" />
                </>
              )}
            </button>
          )}
        />
      </form>

      {/* Back to Email Step */}
      <div className="text-center">
        <button
          onClick={onBackToEmail}
          disabled={loading}
          className="inline-flex items-center justify-center space-x-2 text-sm text-slate-500 hover:text-slate-900 transition-colors duration-200 hover:underline underline-offset-4 disabled:opacity-50 font-medium"
        >
          <IconArrowLeft size={16} />
          <span>Cambiar correo electrónico</span>
        </button>
      </div>
    </div>
  )
}