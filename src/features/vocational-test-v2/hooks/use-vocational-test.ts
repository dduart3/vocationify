// Clean vocational test hook
// Simple state management, no complex logic

import { useState, useCallback, useRef } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { 
  Phase, 
  UIState, 
  SessionState, 
  AIResponse, 
  UIBehavior
} from '../types'
import { getUIBehavior } from '../types'

const API_BASE = `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/vocational-test`

// API functions
const api = {
  startSession: async (userId: string): Promise<SessionState> => {
    const response = await fetch(`${API_BASE}/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.error || 'Failed to start session')
    return data.session
  },

  getSession: async (sessionId: string): Promise<SessionState> => {
    const response = await fetch(`${API_BASE}/session/${sessionId}`)
    const data = await response.json()
    if (!response.ok) throw new Error(data.error || 'Failed to get session')
    return data.session
  },

  sendMessage: async (sessionId: string, message: string): Promise<{
    session: SessionState
    aiResponse: AIResponse
  }> => {
    const response = await fetch(`${API_BASE}/message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, message })
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.error || 'Failed to send message')
    return data
  },

  transitionPhase: async (sessionId: string, targetPhase: Phase): Promise<SessionState> => {
    const response = await fetch(`${API_BASE}/transition`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, targetPhase })
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.error || 'Failed to transition phase')
    return data.session
  }
}

export interface UseVocationalTestProps {
  userId: string
  sessionId?: string
}

export function useVocationalTest({ userId, sessionId }: UseVocationalTestProps) {
  const [currentUIState, setCurrentUIState] = useState<UIState>('idle')
  const [currentAIResponse, setCurrentAIResponse] = useState<AIResponse | null>(null)
  const queryClient = useQueryClient()
  const sessionIdRef = useRef<string | undefined>(sessionId)

  // Get current session data
  const { data: session, isLoading: sessionLoading, error: sessionError } = useQuery({
    queryKey: ['vocational-session-v2', sessionIdRef.current],
    queryFn: () => sessionIdRef.current ? api.getSession(sessionIdRef.current) : null,
    enabled: !!sessionIdRef.current,
    refetchOnWindowFocus: false
  })

  // Start new session mutation
  const startSessionMutation = useMutation({
    mutationFn: () => api.startSession(userId),
    onSuccess: (newSession) => {
      sessionIdRef.current = newSession.id
      queryClient.setQueryData(['vocational-session-v2', newSession.id], newSession)
      console.log('✅ New V2 session started with AI greeting:', newSession.id)
      
      // The backend should have already included the AI's initial greeting
      if (newSession.conversation_history && newSession.conversation_history.length > 0) {
        const lastMessage = newSession.conversation_history[newSession.conversation_history.length - 1]
        if (lastMessage.role === 'assistant') {
          setCurrentAIResponse({ message: lastMessage.content })
        }
      }
    },
    onError: (error) => {
      console.error('❌ Failed to start V2 session:', error)
    }
  })

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: ({ message }: { message: string }) => {
      if (!sessionIdRef.current) throw new Error('No active session')
      return api.sendMessage(sessionIdRef.current, message)
    },
    onSuccess: (data) => {
      // Update session data in cache
      queryClient.setQueryData(['vocational-session-v2', sessionIdRef.current], data.session)
      setCurrentAIResponse(data.aiResponse)
      console.log(`✅ V2 message processed, new phase: ${data.session.currentPhase}`)
    },
    onError: (error) => {
      console.error('❌ Failed to send V2 message:', error)
    }
  })

  // Phase transition mutation
  const transitionPhaseMutation = useMutation({
    mutationFn: ({ targetPhase }: { targetPhase: Phase }) => {
      if (!sessionIdRef.current) throw new Error('No active session')
      return api.transitionPhase(sessionIdRef.current, targetPhase)
    },
    onSuccess: (updatedSession) => {
      queryClient.setQueryData(['vocational-session-v2', sessionIdRef.current], updatedSession)
      console.log(`✅ V2 phase transitioned to: ${updatedSession.currentPhase}`)
    },
    onError: (error) => {
      console.error('❌ Failed to transition V2 phase:', error)
    }
  })

  // Helper functions
  const startSession = useCallback(() => {
    console.log('🚀 Starting new V2 vocational test session')
    startSessionMutation.mutate()
  }, [startSessionMutation.mutate])

  const sendMessage = useCallback((message: string) => {
    console.log(`💬 Sending V2 message: "${message}"`)
    setCurrentUIState('thinking')
    sendMessageMutation.mutate({ message })
  }, [sendMessageMutation.mutate])

  const transitionToPhase = useCallback((targetPhase: Phase) => {
    console.log(`🔄 V2 transitioning to phase: ${targetPhase}`)
    transitionPhaseMutation.mutate({ targetPhase })
  }, [transitionPhaseMutation.mutate])

  // Get UI behavior based on current phase
  const uiBehavior: UIBehavior = session ? getUIBehavior(session.currentPhase) : { autoListen: false, showCareers: false }

  // Simple state helpers
  const setUIState = useCallback((state: UIState) => {
    console.log(`🎛️ V2 UI state: ${currentUIState} → ${state}`)
    setCurrentUIState(state)
  }, [currentUIState])

  return {
    // Session data
    session,
    sessionId: sessionIdRef.current,
    isSessionLoading: sessionLoading,
    sessionError,

    // Current state
    currentPhase: session?.currentPhase || 'exploration',
    currentUIState,
    currentAIResponse,
    uiBehavior,

    // Actions
    startSession,
    sendMessage,
    transitionToPhase,
    setUIState,

    // Loading states
    isStarting: startSessionMutation.isPending,
    isSending: sendMessageMutation.isPending,
    isTransitioning: transitionPhaseMutation.isPending,

    // Computed helpers
    hasSession: !!session,
    isComplete: session?.currentPhase === 'complete',
    recommendations: session?.recommendations || currentAIResponse?.recommendations,
    riasecScores: session?.riasecScores || currentAIResponse?.riasecScores,
    
    // Simple phase checks
    isExploration: session?.currentPhase === 'exploration',
    isRecommendations: session?.currentPhase === 'career_matching',
    isRealityCheck: session?.currentPhase === 'reality_check'
  }
}