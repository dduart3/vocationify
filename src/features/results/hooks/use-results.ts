import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/context/auth-context'
import type { TestResult, ResultFilters, ResultSortOptions } from '../types'

export function useResults(filters?: Partial<ResultFilters>, sortOptions?: ResultSortOptions) {
  const { user } = useAuth()

  return useQuery({
    queryKey: ['results', user?.id, filters, sortOptions],
    queryFn: async (): Promise<TestResult[]> => {
      if (!user?.id) throw new Error('User not authenticated')

      // Get vocational sessions for the current user
      let query = supabase
        .from('vocational_sessions')
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

      // Get career names for the recommendations
      const allCareerIds = sessions?.flatMap(session => 
        (session.recommendations as any[])?.map((rec: any) => rec.careerId || rec.career_id) || []
      ).filter(Boolean) || []

      const { data: careers, error: careersError } = await supabase
        .from('careers')
        .select('id, name')
        .in('id', allCareerIds)

      if (careersError) throw careersError

      // Transform the data to match our TestResult interface
      return sessions.map(session => {
        const riasecScores = session.riasec_scores as any || {}
        const recommendations = session.recommendations as any[] || []

        // Enrich career recommendations with career names
        const enrichedRecommendations = recommendations.map((rec: any) => {
          const career = careers?.find(c => c.id === (rec.careerId || rec.career_id))
          return {
            ...rec,
            career_id: rec.careerId || rec.career_id,
            career_name: rec.name || career?.name || 'Carrera no encontrada',
            confidence: rec.confidence || 0
          }
        })

        // Calculate confidence level from recommendations average
        const avgConfidence = recommendations.length > 0
          ? Math.round(recommendations.reduce((sum, rec) => sum + (rec.confidence || 0), 0) / recommendations.length)
          : 0

        return {
          id: session.id,
          user_id: session.user_id,
          status: recommendations.length > 0 ? 'completed' : 'in_progress', // Derive status from having recommendations
          started_at: session.created_at, // Use created_at as started_at
          completed_at: recommendations.length > 0 ? session.updated_at : null, // Use updated_at if completed
          created_at: session.created_at,
          session_type: 'conversational', // All V2 sessions are conversational
          conversation_history: session.conversation_history,
          current_phase: session.current_phase,
          ai_provider: 'openai', // Default for V2
          confidence_level: avgConfidence,
          riasec_scores: {
            R: riasecScores.realistic || 0,
            I: riasecScores.investigative || 0,
            A: riasecScores.artistic || 0,
            S: riasecScores.social || 0,
            E: riasecScores.enterprising || 0,
            C: riasecScores.conventional || 0
          },
          career_recommendations: enrichedRecommendations,
          personality_description: null // Not stored in V2 sessions yet
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
      // Get the vocational session
      const { data: session, error } = await supabase
        .from('vocational_sessions')
        .select('*')
        .eq('id', resultId)
        .single()

      if (error) {
        throw error
      }

      if (!session) {
        return null
      }

      const riasecScores = session.riasec_scores as any || {}
      const recommendations = session.recommendations as any[] || []

      // Get career names for the recommendations
      const careerIds = recommendations?.map((rec: any) => rec.careerId || rec.career_id) || []
      const { data: careers, error: careersError } = await supabase
        .from('careers')
        .select('id, name')
        .in('id', careerIds)

      if (careersError) throw careersError

      // Enrich career recommendations with career names
      const enrichedRecommendations = recommendations.map((rec: any) => {
        const career = careers?.find(c => c.id === (rec.careerId || rec.career_id))
        return {
          ...rec,
          career_id: rec.careerId || rec.career_id,
          career_name: rec.name || career?.name || 'Carrera no encontrada',
          confidence: rec.confidence || 0
        }
      })

      // Calculate confidence level from recommendations average
      const avgConfidence = recommendations.length > 0
        ? Math.round(recommendations.reduce((sum, rec) => sum + (rec.confidence || 0), 0) / recommendations.length)
        : 0

      return {
        id: session.id,
        user_id: session.user_id,
        status: recommendations.length > 0 ? 'completed' : 'in_progress',
        started_at: session.created_at,
        completed_at: recommendations.length > 0 ? session.updated_at : null,
        created_at: session.created_at,
        session_type: 'conversational',
        conversation_history: session.conversation_history,
        current_phase: session.current_phase,
        ai_provider: 'openai',
        confidence_level: avgConfidence,
        riasec_scores: {
          R: riasecScores.realistic || 0,
          I: riasecScores.investigative || 0,
          A: riasecScores.artistic || 0,
          S: riasecScores.social || 0,
          E: riasecScores.enterprising || 0,
          C: riasecScores.conventional || 0
        },
        career_recommendations: enrichedRecommendations,
        personality_description: null
      }
    },
    enabled: !!resultId,
  })
}