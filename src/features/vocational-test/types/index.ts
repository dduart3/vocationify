export interface TestSession {
  id: string
  user_id?: string
  status: 'in_progress' | 'completed' | 'abandoned'
  started_at: string
  completed_at?: string
  created_at: string
  updated_at: string
}

export interface Question {
  id: string
  text: string
  category: RiasecType
  riasec_weights: RiasecWeights
  response_type: 'scale'
  scale: {
    min: number
    max: number
  }
}

export interface RiasecWeights {
  R: number
  I: number
  A: number
  S: number
  E: number
  C: number
}

export type RiasecType = 'realistic' | 'investigative' | 'artistic' | 'social' | 'enterprising' | 'conventional'

export interface RiasecScore {
  realistic: number
  investigative: number
  artistic: number
  social: number
  enterprising: number
  conventional: number
}

export interface TestResponse {
  question_id: string
  question_text: string
  question_category: RiasecType
  response_value: number
  response_time: number
  question_order: number
  riasec_weights: RiasecWeights
}

export interface TestResults {
  session_id: string
  riasec_scores: RiasecScore
  riasec_code: string
  dominant_types: RiasecType[]
  personality_description: string
  total_questions: number
  completion_percentage: number
}

export interface Career {
  id: string
  name: string
  description: string
  duration_years: number
  primary_riasec_type: RiasecType
  secondary_riasec_type: RiasecType
  riasec_code: string
  realistic_score: number
  investigative_score: number
  artistic_score: number
  social_score: number
  enterprising_score: number
  conventional_score: number
  work_environment: any
  key_skills: string[]
  related_careers: string[]
}

// Conversational session types
export interface ConversationMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
  timestamp?: Date
}

export interface ConversationalSession {
  sessionId: string
  greeting: ConversationResponse
}

export interface ConversationResponse {
  message: string
  intent: 'question' | 'clarification' | 'assessment' | 'recommendation' | 'completion_check' | 'farewell'
  suggestedFollowUp?: string[]
  riasecAssessment?: {
    scores: {
      R: number
      I: number
      A: number
      S: number
      E: number
      C: number
    }
    confidence: number
    reasoning: string
  }
  careerSuggestions?: Array<{
    careerId: string
    name: string
    confidence: number
    reasoning: string
  }>
  nextPhase?: 'greeting' | 'exploration' | 'assessment' | 'recommendation' | 'career_exploration' | 'complete'
}

export interface SessionResults {
  sessionId: string
  riasecScores: {
    R: number
    I: number
    A: number
    S: number
    E: number
    C: number
  }
  confidenceLevel: number
  conversationPhase: 'greeting' | 'exploration' | 'assessment' | 'recommendation' | 'career_exploration' | 'complete'
  careerRecommendations: Array<{
    career_id: string
    confidence: number
    reasoning: string
    career: Career | null
  }>
  conversationHistory: ConversationMessage[]
}