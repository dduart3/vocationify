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
  IconBrandGoogle
} from '@tabler/icons-react'

// Zod Schema
const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'El correo es requerido')
    .email('Ingresa un correo válido'),
  password: z
    .string()
    .min(1, 'La contraseña es requerida')
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
})

type LoginFormData = z.infer<typeof loginSchema>

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => Promise<void>
  onSocialLogin: (provider: 'google') => Promise<void>
  onOtpLogin: () => void
  loading?: boolean
  error?: string | null
}

export function LoginForm({ onSubmit, onSocialLogin, onOtpLogin, loading = false, error }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false)

  // TanStack Form with Zod validation
  const form = useForm({
    defaultValues: {
      email: '',
      password: ''
    } as LoginFormData,
    validators: {
      onChange: ({ value }) => {
        const result = loginSchema.safeParse(value)
        if (!result.success) {
          return result.error.formErrors.fieldErrors
        }
        return undefined
      }
    },
    onSubmit: async ({ value }) => {
      const result = loginSchema.safeParse(value)
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

      {/* Form */}
      <form 
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
        className="space-y-4"
      >
        <div className="space-y-4">
          {/* Email Field */}
          <form.Field
            name="email"
            validators={{
              onChange: ({ value }) => {
                const result = z.string().min(1, 'El correo es requerido').email('Ingresa un correo válido').safeParse(value)
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
                    placeholder="tu@email.com"
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

          {/* Password Field */}
          <form.Field
            name="password"
            validators={{
              onChange: ({ value }) => {
                const result = z.string().min(1, 'La contraseña es requerida').min(6, 'La contraseña debe tener al menos 6 caracteres').safeParse(value)
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
        </div>

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
                  <span>Iniciando sesión...</span>
                </>
              ) : (
                <>
                  <span>Iniciar Sesión</span>
                  <IconArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-200" />
                </>
              )}
            </button>
          )}
        />
      </form>

      {/* Forgot Password */}
      <div className="text-right">
        <Link 
          to="/forgot-password" 
          className="text-xs text-blue-400 hover:text-blue-300 transition-colors duration-200 hover:underline"
        >
          ¿Olvidaste tu contraseña?
        </Link>
      </div>

      {/* Divider */}
      <div className="flex items-center my-5">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent"></div>
        <span className="px-4 text-xs text-slate-400 font-medium">o continúa con</span>
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent"></div>
      </div>

      {/* Google Login */}
      <button
        onClick={() => onSocialLogin('google')}
        disabled={loading}
        className="w-full py-3 px-4 rounded-xl font-medium text-white transition-all duration-300 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed group text-sm"
        style={{
          background: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}
      >
        <IconBrandGoogle size={16} className="text-red-400" />
        <span>Continuar con Google</span>
      </button>

      {/* OTP Login Button */}
      <button
        type="button"
        onClick={onOtpLogin}
        disabled={loading}
        className="w-full py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center space-x-3 text-sm font-medium hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed text-white"
        style={{
          background: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}
      >
        <IconMail size={16} className="text-blue-400" />
        <span>Acceder sin contraseña</span>
      </button>

      {/* Sign Up Link */}
      <div className="text-center pt-3">
        <p className="text-slate-400 text-xs">
          ¿No tienes una cuenta?{' '}
          <Link 
            to="/register" 
            className="text-blue-400 hover:text-blue-300 transition-colors duration-200 font-medium hover:underline"
          >
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  )
}

// Export the type for use in the page
export type { LoginFormData }

