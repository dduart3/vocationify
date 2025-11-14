import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

export function useAuthListener() {
  const queryClient = useQueryClient()

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email)

      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        queryClient.setQueryData(['session'], session)
        queryClient.invalidateQueries({ queryKey: ['profile'] })
      } else if (event === 'SIGNED_OUT') {
        queryClient.setQueryData(['session'], null)
        queryClient.setQueryData(['profile'], null)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [queryClient])
}
