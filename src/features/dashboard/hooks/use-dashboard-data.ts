import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/auth-store'
import type { RiasecScores, SessionResults } from '@/features/vocational-test/types'

interface DashboardStats {
  totalTests: number
  completedTests: number
  averageConfidence: number
  lastTestDate?: string
}

interface UserTestHistory {
  sessionId: string
  completedAt: string
  riasecScores: RiasecScores
  confidenceLevel: number
  careerRecommendations: Array<{
    career_id: string
    confidence: number
    career: {
      name: string
    } | null
  }>
}

export function useDashboardStats() {
  const { user } = useAuthStore()

  return useQuery({
    queryKey: ['dashboard-stats', user?.id],
    queryFn: async (): Promise<DashboardStats> => {
      if (!user?.id) throw new Error('User not authenticated')

      // Get test sessions count
      const { data: sessions, error: sessionsError } = await supabase
        .from('test_sessions')
        .select('id, status, completed_at')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false })

      if (sessionsError) throw sessionsError

      const totalTests = sessions?.length || 0
      const completedTests = sessions?.filter(s => s.status === 'completed').length || 0
      const lastTestDate = sessions?.[0]?.completed_at

      // Get average confidence from results
      const { data: results, error: resultsError } = await supabase
        .from('test_results')
        .select('id, session_id')
        .in('session_id', sessions?.map(s => s.id) || [])

      if (resultsError) throw resultsError

      // For conversational sessions, get confidence from session_riasec_scores
      const { data: riasecData, error: riasecError } = await supabase
        .from('session_riasec_scores')
        .select('*')
        .in('session_id', sessions?.map(s => s.id) || [])

      if (riasecError) throw riasecError

      // Calculate average confidence (mock for now since we don't store it yet)
      const averageConfidence = completedTests > 0 ? 85 : 0

      return {
        totalTests,
        completedTests,
        averageConfidence,
        lastTestDate: lastTestDate || undefined
      }
    },
    enabled: !!user?.id
  })
}

export function useUserTestHistory(limit: number = 5) {
  const { user } = useAuthStore()

  return useQuery({
    queryKey: ['user-test-history', user?.id, limit],
    queryFn: async (): Promise<UserTestHistory[]> => {
      if (!user?.id) throw new Error('User not authenticated')

      // Get recent completed test sessions
      const { data: sessions, error: sessionsError } = await supabase
        .from('test_sessions')
        .select('id, completed_at, session_type')
        .eq('user_id', user.id)
        .eq('status', 'completed')
        .not('completed_at', 'is', null)
        .order('completed_at', { ascending: false })
        .limit(limit)

      if (sessionsError) throw sessionsError
      if (!sessions || sessions.length === 0) return []

      // Get RIASEC scores for these sessions
      const { data: riasecScores, error: riasecError } = await supabase
        .from('session_riasec_scores')
        .select('*')
        .in('session_id', sessions.map(s => s.id))

      if (riasecError) throw riasecError

      // Get test results with career recommendations
      const { data: testResults, error: resultsError } = await supabase
        .from('test_results')
        .select(`
          session_id,
          career_recommendations
        `)
        .in('session_id', sessions.map(s => s.id))

      if (resultsError) throw resultsError

      // Combine the data
      const history: UserTestHistory[] = sessions.map(session => {
        const riasec = riasecScores?.find(r => r.session_id === session.id)
        const result = testResults?.find(r => r.session_id === session.id)

        return {
          sessionId: session.id,
          completedAt: session.completed_at!,
          riasecScores: {
            R: riasec?.realistic_score || 0,
            I: riasec?.investigative_score || 0,
            A: riasec?.artistic_score || 0,
            S: riasec?.social_score || 0,
            E: riasec?.enterprising_score || 0,
            C: riasec?.conventional_score || 0
          },
          confidenceLevel: 85, // Mock for now
          careerRecommendations: result?.career_recommendations || []
        }
      })

      return history
    },
    enabled: !!user?.id
  })
}

export function useLatestRiasecProfile() {
  const { user } = useAuthStore()

  return useQuery({
    queryKey: ['latest-riasec-profile', user?.id],
    queryFn: async (): Promise<RiasecScores | null> => {
      if (!user?.id) throw new Error('User not authenticated')

      // Get the most recent completed session
      const { data: session, error: sessionError } = await supabase
        .from('test_sessions')
        .select('id')
        .eq('user_id', user.id)
        .eq('status', 'completed')
        .not('completed_at', 'is', null)
        .order('completed_at', { ascending: false })
        .limit(1)
        .single()

      if (sessionError) {
        if (sessionError.code === 'PGRST116') return null // No data found
        throw sessionError
      }

      if (!session) return null

      // Get RIASEC scores for this session
      const { data: riasec, error: riasecError } = await supabase
        .from('session_riasec_scores')
        .select('*')
        .eq('session_id', session.id)
        .single()

      if (riasecError) {
        if (riasecError.code === 'PGRST116') return null // No data found
        throw riasecError
      }

      return {
        R: riasec.realistic_score || 0,
        I: riasec.investigative_score || 0,
        A: riasec.artistic_score || 0,
        S: riasec.social_score || 0,
        E: riasec.enterprising_score || 0,
        C: riasec.conventional_score || 0
      }
    },
    enabled: !!user?.id
  })
}