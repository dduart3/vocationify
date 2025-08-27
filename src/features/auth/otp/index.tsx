import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import { AuthLayout } from '../components/auth-layout'
import { OtpLoginForm } from './components/otp-login-form'

export function OtpLogin() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [step, setStep] = useState<'email' | 'otp'>('email')
  const [email, setEmail] = useState('')

  const handleSendOtp = async (data: { email: string }) => {
    try {
      setIsLoading(true)
      setError(null)
      
      const { error } = await supabase.auth.signInWithOtp({
        email: data.email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth-callback`
        }
      })

      if (error) throw error

      setEmail(data.email)
      setStep('otp')
      toast.success('Código enviado', {
        description: 'Revisa tu correo electrónico para el código de acceso.'
      })
    } catch (error: any) {
      console.error('OTP send error:', error)
      setError(error.message)
      toast.error('Error al enviar código', {
        description: error.message
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOtp = async (data: { otp: string }) => {
    try {
      setIsLoading(true)
      setError(null)

      const { error } = await supabase.auth.verifyOtp({
        email,
        token: data.otp,
        type: 'email'
      })

      if (error) throw error

      toast.success('Acceso exitoso', {
        description: 'Has iniciado sesión correctamente.'
      })
      
      navigate({ to: '/dashboard' })
    } catch (error: any) {
      console.error('OTP verify error:', error)
      setError(error.message)
      toast.error('Código incorrecto', {
        description: error.message
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleBackToEmail = () => {
    setStep('email')
    setEmail('')
    setError(null)
  }

  return (
    <AuthLayout
      title={step === 'email' ? 'Acceso sin contraseña' : 'Verificar código'}
      subtitle={
        step === 'email' 
          ? 'Ingresa tu correo electrónico y te enviaremos un código de acceso'
          : `Ingresa el código de 6 dígitos que enviamos a ${email}`
      }
      showBackButton
      backTo="/login"
    >
      <OtpLoginForm 
        step={step}
        onSendOtp={handleSendOtp}
        onVerifyOtp={handleVerifyOtp}
        onBackToEmail={handleBackToEmail}
        loading={isLoading}
        error={error}
      />
    </AuthLayout>
  )
}