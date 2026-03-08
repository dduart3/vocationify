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
  IconAlertCircle
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
}

export function LoginForm({ onSubmit, onOtpLogin, loading = false }: LoginFormProps) {
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
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-900">
                  Correo Electrónico
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                    <IconMail size={16} className="text-slate-400 group-focus-within:text-slate-900 transition-colors duration-200" />
                  </div>
                  <input
                    type="email"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className={`flex h-10 w-full rounded-md border bg-transparent px-3 pl-10 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors ${
                      field.state.meta.errors.length > 0
                        ? 'border-red-500 focus-visible:ring-red-500'
                        : 'border-slate-200'
                    }`}
                    placeholder="tu@email.com"
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
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-900">
                    Contraseña
                  </label>
                  <Link 
                    to="/forgot-password" 
                    className="text-xs font-medium text-slate-900 underline-offset-4 hover:underline"
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                    <IconLock size={16} className="text-slate-400 group-focus-within:text-slate-900 transition-colors duration-200" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className={`flex h-10 w-full rounded-md border bg-transparent px-3 pl-10 pr-10 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors ${
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
        </div>

        {/* Submit Button */}
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <button
              type="submit"
              disabled={!canSubmit || loading || isSubmitting}
              className="inline-flex w-full items-center justify-center whitespace-nowrap rounded-[1rem] text-sm font-semibold text-white bg-gradient-to-b from-blue-500 to-blue-600 border border-blue-400/50 shadow-[0_4px_12px_rgba(59,130,246,0.25),inset_0_-2px_4px_rgba(0,0,0,0.1),inset_0_2px_4px_rgba(255,255,255,0.3)] hover:shadow-[0_6px_16px_rgba(59,130,246,0.3),inset_0_-2px_4px_rgba(0,0,0,0.08),inset_0_2px_4px_rgba(255,255,255,0.4)] hover:-translate-y-[1px] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-[44px] px-4 py-2"
            >
              {(loading || isSubmitting) ? (
                <>
                  <IconLoader2 size={16} className="mr-2 animate-spin" />
                  Iniciando sesión...
                </>
              ) : (
                <>
                  Iniciar Sesión
                  <IconArrowRight size={16} className="ml-2" />
                </>
              )}
            </button>
          )}
        />
      </form>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-slate-200" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-slate-500">
            o continuar con
          </span>
        </div>
      </div>

      {/* OTP Login Button */}
      <button
        type="button"
        onClick={onOtpLogin}
        disabled={loading}
        className="inline-flex w-full items-center justify-center whitespace-nowrap rounded-[1rem] text-sm font-semibold text-slate-700 bg-gradient-to-b from-white to-slate-50 border border-slate-200 shadow-[0_4px_12px_rgba(0,0,0,0.03),inset_0_-2px_4px_rgba(0,0,0,0.02),inset_0_2px_4px_rgba(255,255,255,1)] hover:shadow-[0_6px_16px_rgba(0,0,0,0.06),inset_0_-2px_4px_rgba(0,0,0,0.01),inset_0_2px_4px_rgba(255,255,255,1)] hover:bg-white hover:-translate-y-[1px] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-[44px] px-4 py-2"
      >
        <IconMail size={16} className="mr-2" />
        Acceder sin contraseña
      </button>

      {/* Sign Up Link */}
      <div className="text-center pt-2">
        <p className="text-slate-500 text-sm">
          ¿No tienes una cuenta?{' '}
          <Link 
            to="/register" 
            className="font-semibold text-slate-900 underline-offset-4 hover:underline"
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
