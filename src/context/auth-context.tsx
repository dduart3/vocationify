import { createContext, useContext, type ReactNode } from 'react'
import type { User, Session } from '@supabase/supabase-js'
import type { UserProfile } from '@/features/auth/types'
import { useAuthImplementation } from '@/features/auth/hooks/use-auth'
import { useAuthListener } from '@/features/auth/hooks/use-auth-listener'

export interface AuthContextType {
  // State from queries
  user: User | null
  profile: UserProfile | null
  session: Session | null
  isLoading: boolean
  isAuthenticated: boolean
  isAdmin: boolean

  // Mutations
  signIn: (email: string, password: string) => Promise<void>
  signInWithProvider: (provider: 'google') => Promise<void>
  signUp: (email: string, password: string, profileData?: any) => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const auth = useAuthImplementation()
  useAuthListener()

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}
