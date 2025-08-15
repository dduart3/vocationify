import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '@/stores/auth-store'
import { supabase } from '@/lib/supabase'

export interface IncompleteSession {
  id: string
  session_type: string
  current_phase: string
  conversation_history: any[]
  started_at: string
  updated_at: string
}

export function useIncompleteSession() {
  const { user } = useAuthStore()

  return useQuery({
    queryKey: ['incomplete-session', user?.id],
    queryFn: async (): Promise<IncompleteSession | null> => {
      if (!user?.id) return null

      const { data, error } = await supabase
        .from('test_sessions')
        .select('id, session_type, current_phase, conversation_history, started_at, updated_at')
        .eq('user_id', user.id)
        .eq('status', 'in_progress')
        .order('updated_at', { ascending: false })
        .limit(1)
        .single()

      if (error) {
        // No incomplete session found is not an error
        if (error.code === 'PGRST116') {
          return null
        }
        throw error
      }

      return data as IncompleteSession
    },
    enabled: !!user?.id,
    // Check every 30 seconds for incomplete sessions
    refetchInterval: 30000,
    // Don't refetch on window focus to avoid interruption
    refetchOnWindowFocus: false
  })
}