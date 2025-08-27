import { useNavigate } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/auth-store'
import { AuthLayout } from '../components/auth-layout'
import { ForgotPasswordForm } from './components/forgot-password-form'

export function ForgotPassword() {
  const navigate = useNavigate()
  const { resetPassword, isLoading, error } = useAuthStore()

  const handleSubmit = async (data: { email: string }) => {
    try {
      await resetPassword(data.email)
      // Navigate back to login after successful reset email
      setTimeout(() => {
        navigate({ to: '/login' })
      }, 2000)
    } catch (error) {
      console.error('Forgot password error:', error)
    }
  }

  return (
    <AuthLayout
      title="Restablecer contraseña"
      subtitle="Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña"
      showBackButton
      backTo="/login"
    >
      <ForgotPasswordForm 
        onSubmit={handleSubmit}
        loading={isLoading}
        error={error}
      />
    </AuthLayout>
  )
}