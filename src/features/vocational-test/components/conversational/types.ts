export type ConversationalBubbleState = 
  | 'idle' 
  | 'listening' 
  | 'speaking' 
  | 'thinking' 
  | 'session-starting' 
  | 'enhanced-exploration'
  | 'career-matching'
  | 'reality-check'
  | 'final-results'
  | 'results-display' 
  | 'complete'
  | 'test-finished'

// Phase-specific states for enhanced methodology
export interface PhaseState {
  name: string
  description: string
  progress: number
  isActive: boolean
  isCompleted: boolean
}

export interface EnhancedTestProgress {
  phases: {
    enhanced_exploration: PhaseState
    career_matching: PhaseState
    reality_check: PhaseState
    final_results: PhaseState
  }
  currentPhaseIndex: number
  overallProgress: number
}