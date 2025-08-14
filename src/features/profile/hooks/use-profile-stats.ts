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

      // Get test sessions count
      const { count: testsCount, error: testsError } = await supabase
        .from('test_sessions')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('status', 'completed')

      if (testsError) throw testsError

      // Get careers explored (we can track this from careers page views if needed)
      // For now, we'll use a placeholder
      const careersExplored = 0

      // Get schools reviewed (placeholder for now)
      const schoolsReviewed = 0

      // Get last test date
      const { data: lastTest, error: lastTestError } = await supabase
        .from('test_sessions')
        .select('completed_at')
        .eq('user_id', user.id)
        .eq('status', 'completed')
        .order('completed_at', { ascending: false })
        .limit(1)
        .single()

      // Don't throw error if no tests found
      if (lastTestError && lastTestError.code !== 'PGRST116') {
        throw lastTestError
      }

      return {
        tests_completed: testsCount || 0,
        careers_explored: careersExplored,
        schools_reviewed: schoolsReviewed,
        last_test_date: lastTest?.completed_at || undefined
      }
    },
    enabled: !!user?.id
  })
}