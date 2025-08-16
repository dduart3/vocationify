import { useQuery } from '@tanstack/react-query'
import { conversationalAPI, queryKeys } from '../api'

export interface SessionDetails {
  sessionId: string
  status: string
  currentPhase: string
  conversationHistory: Array<{
    role: 'user' | 'assistant'
    content: string
    timestamp: string
  }>
  startedAt: string
  updatedAt: string
}

export function useSessionDetails(sessionId: string | null, enabled: boolean = true) {
  return useQuery({
    queryKey: queryKeys.conversations.session(sessionId || ''),
    queryFn: () => conversationalAPI.getSessionDetails(sessionId!),
    enabled: enabled && !!sessionId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  })
}