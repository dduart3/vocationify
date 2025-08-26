import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/auth-store'
import type { UserActivity } from '../types'

export function useProfileStats() {
  const { user } = useAuthStore()

  return useQuery({
    queryKey: ['profile-stats', user?.id],
    queryFn: async (): Promise<UserActivity> => {
      if (!user?.id) throw new Error('User not authenticated')

      // Get vocational sessions count (completed tests have recommendations)
      const { count: testsCount, error: testsError } = await supabase
        .from('vocational_sessions')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .not('recommendations', 'is', null)
        .neq('recommendations', '[]')

      if (testsError) throw testsError

      // Get last test date
      const { data: lastTest, error: lastTestError } = await supabase
        .from('vocational_sessions')
        .select('updated_at')
        .eq('user_id', user.id)
        .not('recommendations', 'is', null)
        .neq('recommendations', '[]')
        .order('updated_at', { ascending: false })
        .limit(1)
        .single()

      // Don't throw error if no tests found
      if (lastTestError && lastTestError.code !== 'PGRST116') {
        throw lastTestError
      }

      return {
        tests_completed: testsCount || 0,
        last_test_date: lastTest?.updated_at || undefined
      }
    },
    enabled: !!user?.id
  })
}