import { create } from 'zustand'
import { persist, devtools } from 'zustand/middleware'
import { supabase } from '@/lib/supabase'
import type { User, Session } from '@supabase/supabase-js'
import { toast } from 'sonner'

export interface UserProfile {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  role: 'user' | 'admin'
  created_at: string
  updated_at: string
}

interface AuthStore {
  // State
  user: User | null
  profile: UserProfile | null
  session: Session | null
  isLoading: boolean
  isAuthenticated: boolean
  
  // Computed
  isAdmin: boolean
  
  // Actions
  setUser: (user: User | null) => void
  setProfile: (profile: UserProfile | null) => void
  setSession: (session: Session | null) => void
  setLoading: (loading: boolean) => void
  
  // Auth methods
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, fullName?: string) => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>
  
  // Initialization
  initialize: () => Promise<void>
  reset: () => void
}

export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        user: null,
        profile: null,
        session: null,
        isLoading: true,
        isAuthenticated: false,
        
        // Computed
        get isAdmin() {
          return get().profile?.role === 'admin'
        },

        // Setters
        setUser: (user) => set({ 
          user, 
          isAuthenticated: !!user 
        }, false, 'setUser'),
        
        setProfile: (profile) => set({ profile }, false, 'setProfile'),
        
        setSession: (session) => set({ 
          session,
          user: session?.user || null,
          isAuthenticated: !!session?.user
        }, false, 'setSession'),
        
        setLoading: (isLoading) => set({ isLoading }, false, 'setLoading'),

        // Auth methods
        signIn: async (email: string, password: string) => {
          try {
            set({ isLoading: true })
            
            const { data, error } = await supabase.auth.signInWithPassword({
              email,
              password,
            })

            if (error) throw error

            if (data.user) {
              // Fetch user profile
              const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', data.user.id)
                .single()

              if (profileError) {
                console.error('Profile fetch error:', profileError)
                // Create profile if it doesn't exist
                const newProfile: Partial<UserProfile> = {
                  id: data.user.id,
                  email: data.user.email!,
                  full_name: data.user.user_metadata?.full_name,
                  role: 'user',
                }

                const { data: createdProfile, error: createError } = await supabase
                  .from('profiles')
                  .insert(newProfile)
                  .select()
                  .single()

                if (createError) throw createError
                set({ profile: createdProfile as UserProfile })
              } else {
                set({ profile: profileData as UserProfile })
              }

              set({ 
                user: data.user, 
                session: data.session,
                isAuthenticated: true 
              })

              toast.success('Welcome back!', {
                description: 'You have successfully signed in.',
              })
            }
          } catch (error: any) {
            console.error('Sign in error:', error)
            toast.error('Sign in failed', {
              description: error.message || 'Please check your credentials and try again.',
            })
            throw error
          } finally {
            set({ isLoading: false })
          }
        },

        signUp: async (email: string, password: string, fullName?: string) => {
          try {
            set({ isLoading: true })
            
            const { data, error } = await supabase.auth.signUp({
              email,
              password,
              options: {
                data: {
                  full_name: fullName,
                }
              }
            })

            if (error) throw error

            if (data.user) {
              toast.success('Account created!', {
                description: 'Please check your email to verify your account.',
              })
            }
          } catch (error: any) {
            console.error('Sign up error:', error)
            toast.error('Sign up failed', {
              description: error.message || 'Please try again.',
            })
            throw error
          } finally {
            set({ isLoading: false })
          }
        },

        signOut: async () => {
          try {
            set({ isLoading: true })
            
            const { error } = await supabase.auth.signOut()
            if (error) throw error

            get().reset()
            
            toast.success('Signed out', {
              description: 'You have been successfully signed out.',
            })
          } catch (error: any) {
            console.error('Sign out error:', error)
            toast.error('Sign out failed', {
              description: error.message,
            })
            throw error
          } finally {
            set({ isLoading: false })
          }
        },

        resetPassword: async (email: string) => {
          try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
              redirectTo: `${window.location.origin}/auth/reset-password`,
            })

            if (error) throw error

            toast.success('Password reset email sent', {
              description: 'Please check your email for reset instructions.',
            })
          } catch (error: any) {
            console.error('Password reset error:', error)
            toast.error('Password reset failed', {
              description: error.message,
            })
            throw error
          }
        },

        updateProfile: async (updates: Partial<UserProfile>) => {
          try {
            const { user, profile } = get()
            if (!user || !profile) throw new Error('Not authenticated')

            const { data, error } = await supabase
              .from('profiles')
              .update(updates)
              .eq('id', user.id)
              .select()
              .single()

            if (error) throw error

            set({ profile: data as UserProfile })
            
            toast.success('Profile updated', {
              description: 'Your profile has been successfully updated.',
            })
          } catch (error: any) {
            console.error('Profile update error:', error)
            toast.error('Profile update failed', {
              description: error.message,
            })
            throw error
          }
        },

        initialize: async () => {
          try {
            set({ isLoading: true })

            // Get initial session
            const { data: { session }, error } = await supabase.auth.getSession()
            if (error) throw error

            if (session?.user) {
              // Fetch user profile
              const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single()

              if (!profileError && profileData) {
                set({
                  user: session.user,
                  session,
                  profile: profileData as UserProfile,
                  isAuthenticated: true,
                })
              }
            }

            // Listen for auth changes
            supabase.auth.onAuthStateChange(async (event, session) => {
              console.log('Auth state changed:', event, session?.user?.email)

              if (event === 'SIGNED_IN' && session?.user) {
                // Fetch profile
                const { data: profileData } = await supabase
                  .from('profiles')
                  .select('*')
                  .eq('id', session.user.id)
                  .single()

                set({
                  user: session.user,
                  session,
                  profile: profileData as UserProfile,
                  isAuthenticated: true,
                })
              } else if (event === 'SIGNED_OUT') {
                get().reset()
              }
            })
          } catch (error) {
            console.error('Auth initialization error:', error)
          } finally {
            set({ isLoading: false })
          }
        },

        reset: () => set({
          user: null,
          profile: null,
          session: null,
          isAuthenticated: false,
          isLoading: false,
        }, false, 'reset'),
      }),
      {
        name: 'career-compass-auth',
        partialize: (state) => ({
          user: state.user,
          profile: state.profile,
          session: state.session,
          isAuthenticated: state.isAuthenticated,
        }),
        onRehydrateStorage: () => (state) => {
          // Re-initialize auth on hydration
          if (state) {
            state.initialize()
          }
        },
      }
    ),
    { name: 'auth-store' }
  )
)

// Helper functions
export const getAuthState = () => useAuthStore.getState()
export const isAuthenticated = () => useAuthStore.getState().isAuthenticated
export const isAdmin = () => useAuthStore.getState().isAdmin
export const getCurrentUser = () => useAuthStore.getState().user
export const getCurrentProfile = () => useAuthStore.getState().profile
