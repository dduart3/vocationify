import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/context/auth-context'
import type { RiasecScores } from '@/features/vocational-test/types'

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
  const { user } = useAuth()

  return useQuery({
    queryKey: ['dashboard-stats', user?.id],
    queryFn: async (): Promise<DashboardStats> => {
      if (!user?.id) throw new Error('User not authenticated')

      // Get vocational sessions
      const { data: sessions, error: sessionsError } = await supabase
        .from('vocational_sessions')
        .select('id, current_phase, riasec_scores, recommendations, created_at, updated_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (sessionsError) throw sessionsError

      const totalTests = sessions?.length || 0
      // Consider completed tests as those that have recommendations (completed the full flow)
      const completedTests = sessions?.filter(s => 
        s.recommendations && 
        Array.isArray(s.recommendations) && 
        s.recommendations.length > 0
      ).length || 0
      const lastTestDate = sessions?.[0]?.created_at

      // Calculate average confidence from completed sessions
      const completedSessions = sessions?.filter(s => 
        s.recommendations && 
        Array.isArray(s.recommendations) && 
        s.recommendations.length > 0
      ) || []

      let averageConfidence = 0
      if (completedSessions.length > 0) {
        const totalConfidence = completedSessions.reduce((sum, session) => {
          // Get highest confidence from recommendations
          const highestConfidence = Math.max(
            ...(session.recommendations as any[])?.map(r => r.confidence || 0) || [0]
          )
          return sum + highestConfidence
        }, 0)
        averageConfidence = Math.round(totalConfidence / completedSessions.length)
      }

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
  const { user } = useAuth()

  return useQuery({
    queryKey: ['user-test-history', user?.id, limit],
    queryFn: async (): Promise<UserTestHistory[]> => {
      if (!user?.id) throw new Error('User not authenticated')

      // Get recent completed vocational sessions
      const { data: sessions, error: sessionsError } = await supabase
        .from('vocational_sessions')
        .select('id, riasec_scores, recommendations, created_at, updated_at')
        .eq('user_id', user.id)
        .not('recommendations', 'is', null)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (sessionsError) throw sessionsError
      if (!sessions || sessions.length === 0) return []

      // Transform the data to match the expected interface
      const history: UserTestHistory[] = sessions.map(session => {
        const riasecScores = session.riasec_scores as any || {}
        const recommendations = session.recommendations as any[] || []
        
        // Calculate confidence level from recommendations
        const avgConfidence = recommendations.length > 0
          ? Math.round(recommendations.reduce((sum, rec) => sum + (rec.confidence || 0), 0) / recommendations.length)
          : 0

        return {
          sessionId: session.id,
          completedAt: session.created_at!,
          riasecScores: {
            realistic: riasecScores.realistic || 0,
            investigative: riasecScores.investigative || 0,
            artistic: riasecScores.artistic || 0,
            social: riasecScores.social || 0,
            enterprising: riasecScores.enterprising || 0,
            conventional: riasecScores.conventional || 0
          },
          confidenceLevel: avgConfidence,
          careerRecommendations: recommendations.map(rec => ({
            career_id: rec.careerId || rec.career_id,
            confidence: rec.confidence,
            career: {
              name: rec.name || rec.career_name
            }
          }))
        }
      })

      return history
    },
    enabled: !!user?.id
  })
}

export function useLatestRiasecProfile() {
  const { user } = useAuth()

  return useQuery({
    queryKey: ['latest-riasec-profile', user?.id],
    queryFn: async (): Promise<RiasecScores | null> => {
      if (!user?.id) throw new Error('User not authenticated')

      // Get the most recent session with RIASEC scores
      const { data: session, error: sessionError } = await supabase
        .from('vocational_sessions')
        .select('riasec_scores')
        .eq('user_id', user.id)
        .not('riasec_scores', 'is', null)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (sessionError) {
        if (sessionError.code === 'PGRST116') return null // No data found
        throw sessionError
      }

      if (!session?.riasec_scores) return null

      const riasecScores = session.riasec_scores as any || {}

      return {
        realistic: riasecScores.realistic || 0,
        investigative: riasecScores.investigative || 0,
        artistic: riasecScores.artistic || 0,
        social: riasecScores.social || 0,
        enterprising: riasecScores.enterprising || 0,
        conventional: riasecScores.conventional || 0
      }
    },
    enabled: !!user?.id
  })
}