// Clean vocational test types
// Simple interfaces for state management

export type Phase = 'exploration' | 'career_matching' | 'reality_check' | 'complete'

export type UIState = 'idle' | 'listening' | 'thinking' | 'speaking'

export interface SessionState {
  id: string
  user_id: string
  current_phase: Phase  // Match database field name
  conversation_history: Array<{  // Match database field name
    role: 'user' | 'assistant'
    content: string
    timestamp: string
  }>
  riasec_scores: RiasecScores  // Match database field name
  recommendations: CareerRecommendation[]
  metadata: Record<string, any>
  created_at: string
  updated_at: string
}

export interface AIResponse {
  message: string
  recommendations?: CareerRecommendation[]
  riasecScores?: RiasecScores
}

export interface CareerRecommendation {
  careerId: string
  name: string
  confidence: number
  reasoning: string
}

export interface RiasecScores {
  realistic: number
  investigative: number
  artistic: number
  social: number
  enterprising: number
  conventional: number
}

export interface UIBehavior {
  autoListen: boolean
  showCareers: boolean
  showButton?: string
  showCompletionScreen?: boolean
}

// UI behavior for each phase
export function getUIBehavior(phase: Phase): UIBehavior {
  switch (phase) {
    case 'exploration':
      return {
        autoListen: true,
        showCareers: false
      }
    
    case 'career_matching':
      return {
        autoListen: false,
        showCareers: true,
        showButton: 'Continuar a Reality Check'
      }
    
    case 'reality_check':
      return {
        autoListen: true,
        showCareers: false
      }
    
    case 'complete':
      return {
        autoListen: false,
        showCareers: true,
        showCompletionScreen: true
      }
    
    default:
      return {
        autoListen: false,
        showCareers: false
      }
  }
}