import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { User, Session } from '@supabase/supabase-js'
import type { UserProfile } from '@/features/auth/types'
import type { AuthContextType } from '@/context/auth-context'
import { toast } from 'sonner'
import { useNavigate } from '@tanstack/react-router'

export function useAuthImplementation(): AuthContextType {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  // Query for current session
  const {
    data: session,
    isLoading: sessionLoading,
    error: sessionError,
  } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession()
      if (error) throw error
      return session
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
  })

  // Query for user profile (only runs if we have a session)
  const {
    data: profile,
    isLoading: profileLoading,
    error: profileError,
  } = useQuery({
    queryKey: ['profile', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()

      if (error) throw error
      return data as UserProfile
    },
    enabled: !!session?.user?.id,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  })

  // Sign in mutation
  const signInMutation = useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string
      password: string
    }) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session'] })
      queryClient.invalidateQueries({ queryKey: ['profile'] })
      toast.success('Bienvenido de vuelta', {
        description: 'Has iniciado sesión exitosamente.',
      })
    },
    onError: (error: any) => {
      console.error('Sign in error:', error)
      toast.error('Error al iniciar sesión', {
        description:
          error.message || 'Por favor, verifica tus credenciales e inténtalo de nuevo.',
      })
    },
  })

  // Sign in with provider mutation
  const signInWithProviderMutation = useMutation({
    mutationFn: async (provider: 'google') => {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          redirectTo: `${window.location.origin}/auth-callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      })

      if (error) throw error
    },
    onError: (error: any) => {
      console.error('Social sign in error:', error)
      toast.error('Error al iniciar sesión social', {
        description: error.message || 'Por favor, inténtalo de nuevo.',
      })
    },
  })

  // Sign up mutation
  const signUpMutation = useMutation({
    mutationFn: async ({
      email,
      password,
      profileData,
    }: {
      email: string
      password: string
      profileData?: any
    }) => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: profileData?.firstName || null,
            last_name: profileData?.lastName || null,
            phone: profileData?.phone || null,
            address: profileData?.address || null,
            location: profileData?.location
              ? JSON.stringify(profileData.location)
              : null,
          },
        },
      })

      if (error) throw error
      return data
    },
    onSuccess: () => {
      toast.success('Cuenta creada exitosamente', {
        description: 'Por favor verifica tu correo para activar tu cuenta.',
      })
    },
    onError: (error: any) => {
      console.error('Sign up error:', error)
      toast.error('Error al crear cuenta', {
        description: error.message || 'Por favor inténtalo de nuevo.',
      })
    },
  })

  // Sign out mutation
  const signOutMutation = useMutation({
    mutationFn: async () => {
      console.log('Starting signOut process...')
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    },
    onSuccess: () => {
      console.log('Supabase signOut successful - invalidating queries...')
      queryClient.setQueryData(['session'], null)
      queryClient.setQueryData(['profile'], null)
      queryClient.invalidateQueries({ queryKey: ['session'] })
      queryClient.invalidateQueries({ queryKey: ['profile'] })
      toast.success('Sesión cerrada', {
        description: 'Has cerrado sesión exitosamente.',
      })
      navigate({ to: '/login' })
    },
    onError: (error: any) => {
      console.error('Sign out error:', error)
      toast.error('Error al cerrar sesión', {
        description: error.message,
      })
    },
  })

  // Reset password mutation
  const resetPasswordMutation = useMutation({
    mutationFn: async (email: string) => {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })

      if (error) throw error
    },
    onSuccess: () => {
      toast.success('Email de restablecimiento enviado', {
        description: 'Por favor, revisa tu correo para las instrucciones.',
      })
    },
    onError: (error: any) => {
      console.error('Password reset error:', error)
      toast.error('Error al restablecer contraseña', {
        description: error.message,
      })
    },
  })

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (updates: Partial<UserProfile>) => {
      if (!session?.user?.id) {
        throw new Error('Not authenticated')
      }

      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', session.user.id)
        .select()
        .single()

      if (error) throw error
      return data as UserProfile
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] })
      toast.success('Perfil actualizado', {
        description: 'Tu perfil ha sido actualizado exitosamente.',
      })
    },
    onError: (error: any) => {
      console.error('Profile update error:', error)
      toast.error('Error al actualizar perfil', {
        description: error.message,
      })
    },
  })

  return {
    user: session?.user || null,
    profile: profile || null,
    session: session || null,
    isLoading: sessionLoading || profileLoading,
    isAuthenticated: !!session?.user,
    isAdmin: profile?.role_id === 1,

    signIn: async (email: string, password: string) => {
      await signInMutation.mutateAsync({ email, password })
    },
    signInWithProvider: async (provider: 'google') => {
      await signInWithProviderMutation.mutateAsync(provider)
    },
    signUp: async (email: string, password: string, profileData?: any) => {
      await signUpMutation.mutateAsync({ email, password, profileData })
    },
    signOut: async () => {
      await signOutMutation.mutateAsync()
    },
    resetPassword: async (email: string) => {
      await resetPasswordMutation.mutateAsync(email)
    },
    updateProfile: async (updates: Partial<UserProfile>) => {
      await updateProfileMutation.mutateAsync(updates)
    },
  }
}
