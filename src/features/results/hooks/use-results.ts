import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/auth-store'
import type { TestResult, ResultFilters, ResultSortOptions } from '../types'

export function useResults(filters?: Partial<ResultFilters>, sortOptions?: ResultSortOptions) {
  const { user } = useAuthStore()

  return useQuery({
    queryKey: ['results', user?.id, filters, sortOptions],
    queryFn: async (): Promise<TestResult[]> => {
      if (!user?.id) throw new Error('User not authenticated')

      // Get test sessions for the current user
      let query = supabase
        .from('test_sessions')
        .select('*')
        .eq('user_id', user.id)

      // Apply filters
      if (filters?.search) {
        // Search in session_id
        query = query.or(`id.ilike.%${filters.search}%`)
      }

      if (filters?.date_range && filters.date_range !== 'all') {
        const now = new Date()
        let startDate: Date
        
        switch (filters.date_range) {
          case 'last_week':
            startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
            break
          case 'last_month':
            startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
            break
          case 'last_year':
            startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
            break
          default:
            startDate = new Date(0)
        }
        
        query = query.gte('created_at', startDate.toISOString())
      }

      // Apply sorting
      if (sortOptions) {
        const { field, direction } = sortOptions
        query = query.order(field, { ascending: direction === 'asc' })
      } else {
        query = query.order('created_at', { ascending: false })
      }

      const { data: sessions, error } = await query

      if (error) {
        throw error
      }

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
        .select('*')
        .in('session_id', sessions.map(s => s.id))

      if (resultsError) throw resultsError

      // Get career names for the recommendations
      const allCareerIds = testResults?.flatMap(result => 
        result.career_recommendations?.map((rec: any) => rec.career_id) || []
      ).filter(Boolean) || []

      const { data: careers, error: careersError } = await supabase
        .from('careers')
        .select('id, name')
        .in('id', allCareerIds)

      if (careersError) throw careersError

      // Transform the data to match our TestResult interface
      return sessions.map(session => {
        const riasec = riasecScores?.find(r => r.session_id === session.id)
        const result = testResults?.find(r => r.session_id === session.id)

        // Enrich career recommendations with career names
        const enrichedRecommendations = result?.career_recommendations?.map((rec: any) => {
          const career = careers?.find(c => c.id === rec.career_id)
          return {
            ...rec,
            career_name: career?.name || 'Carrera no encontrada'
          }
        }) || []

        return {
          id: session.id,
          user_id: session.user_id,
          status: session.status,
          started_at: session.started_at,
          completed_at: session.completed_at,
          created_at: session.created_at,
          session_type: session.session_type,
          conversation_history: session.conversation_history,
          current_phase: session.current_phase,
          ai_provider: session.ai_provider,
          confidence_level: session.confidence_level,
          riasec_scores: {
            R: riasec?.realistic_score || 50,
            I: riasec?.investigative_score || 50,
            A: riasec?.artistic_score || 50,
            S: riasec?.social_score || 50,
            E: riasec?.enterprising_score || 50,
            C: riasec?.conventional_score || 50
          },
          career_recommendations: enrichedRecommendations,
          personality_description: result?.personality_description || null
        }
      })
    },
    enabled: !!user?.id
  })
}

export function useResultDetail(resultId: string) {
  return useQuery({
    queryKey: ['result', resultId],
    queryFn: async (): Promise<TestResult | null> => {
      const { data, error } = await supabase
        .from('conversational_sessions')
        .select('*')
        .eq('id', resultId)
        .single()

      if (error) {
        throw error
      }

      if (!data) {
        return null
      }

      return {
        id: data.id,
        user_id: data.user_id,
        session_id: data.session_id,
        test_type: 'conversational',
        status: data.status,
        riasec_scores: data.riasec_scores || { R: 50, I: 50, A: 50, S: 50, E: 50, C: 50 },
        confidence_score: data.confidence_score || 75,
        top_career_recommendations: data.career_recommendations || [],
        created_at: data.created_at,
        completed_at: data.completed_at,
        duration_minutes: data.duration_minutes
      }
    },
    enabled: !!resultId,
  })
}