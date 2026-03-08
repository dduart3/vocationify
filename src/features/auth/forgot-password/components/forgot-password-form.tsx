import { Link } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import { 
  IconMail, 
  IconLoader2,
  IconArrowRight,
  IconAlertCircle,
  IconArrowLeft
} from '@tabler/icons-react'

// Zod Schema
const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'El correo es requerido')
    .email('Formato de correo inválido')
})

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>

interface ForgotPasswordFormProps {
  onSubmit: (data: ForgotPasswordFormData) => Promise<void>
  loading?: boolean
  error?: string | null
}

export function ForgotPasswordForm({ onSubmit, loading = false, error }: ForgotPasswordFormProps) {
  
  // TanStack Form with Zod validation
  const form = useForm({
    defaultValues: {
      email: ''
    },
    validators: {
      onSubmit: async ({ value }) => {
        const result = forgotPasswordSchema.safeParse(value)
        if (!result.success) {
          return result.error.issues.map(issue => issue.message).join(', ')
        }
        return undefined
      }
    },
    onSubmit: async ({ value }) => {
      await onSubmit(value)
    }
  })

  const inputBaseClass = "flex h-10 w-full rounded-md border bg-transparent px-3 text-sm placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"

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
          form.handleSubmit()
        }}
        className="space-y-4"
      >
        {/* Email Field */}
        <form.Field name="email">
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
        </form.Field>

        {/* Submit Button */}
        <form.Subscribe
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
                  Enviando...
                </>
              ) : (
                <>
                  Enviar enlace
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