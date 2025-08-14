export interface TestResult {
  id: string
  user_id: string
  status: string
  started_at: string
  completed_at: string | null
  created_at: string
  session_type: string
  conversation_history: any
  current_phase: string
  ai_provider: string
  confidence_level: number | null
  riasec_scores: {
    R: number
    I: number
    A: number
    S: number
    E: number
    C: number
  }
  career_recommendations: any[]
  personality_description: string | null
}

export interface ResultFilters {
  search?: string
  test_type?: 'all' | 'conversational' | 'traditional'
  status?: 'all' | 'completed' | 'in_progress' | 'abandoned'
  date_range?: 'all' | 'last_week' | 'last_month' | 'last_year'
}

export interface ResultSortOptions {
  field: 'created_at' | 'completed_at' | 'started_at' | 'confidence_level'
  direction: 'asc' | 'desc'
}