import { useNavigate } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/auth-store'
import { AuthLayout } from '../components/auth-layout'
import { LoginForm, type LoginFormData } from './components/login-form'

export function Login() {
  const navigate = useNavigate()
  const { signIn, signInWithProvider, isLoading, error } = useAuthStore()

  const handleFormSubmit = async (data: LoginFormData) => {
    try {
      await signIn(data.email, data.password)
      navigate({ to: '/dashboard' })
    } catch (error) {
      console.error('Login error:', error)
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

  const handleOtpLogin = () => {
    navigate({ to: '/otp' })
  }

  return (
    <AuthLayout
      title="Iniciar sesión"
      subtitle="Introduce tu correo electrónico y contraseña para acceder a tu cuenta"
    >
      <LoginForm 
        onSubmit={handleFormSubmit}
        onSocialLogin={handleSocialLogin}
        onOtpLogin={handleOtpLogin}
        loading={isLoading}
        error={error}
      />
    </AuthLayout>
  )
}
