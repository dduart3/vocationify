import { useNavigate } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/auth-store'
import { AuthLayout } from '../components/auth-layout'
import { RegisterForm, type RegisterFormData } from './components/register-form'

export function Register() {
  const navigate = useNavigate()
  const { signUp, signInWithProvider, isLoading, error } = useAuthStore()

  const handleFormSubmit = async (data: RegisterFormData) => {
    try {
      await signUp(data.email, data.password, data)
      navigate({ to: '/dashboard' })
    } catch (error) {
      console.error('Register error:', error)
    }
  }

  const handleSocialLogin = async (provider: 'google') => {
    try {
      await signInWithProvider(provider)
      // OAuth will redirect automatically
    } catch (error) {
      console.error('Social login error:', error)
    }
  }

  return (
    <AuthLayout
      title="Crear cuenta"
      subtitle="Completa tus datos para crear tu cuenta en Vocationify"
    >
      <RegisterForm 
        onSubmit={handleFormSubmit}
        onSocialLogin={handleSocialLogin}
        loading={isLoading}
        error={error}
      />
    </AuthLayout>
  )
}