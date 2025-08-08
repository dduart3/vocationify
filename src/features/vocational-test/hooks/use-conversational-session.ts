import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { conversationalAPI, queryKeys } from '../api'
import type { ConversationalSession, ConversationResponse, SessionResults } from '../types'

// Create conversational session hook
export const useCreateConversationalSession = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (userId?: string) => conversationalAPI.createSession(userId),
    onSuccess: (data: ConversationalSession) => {
      // Invalidate and refetch sessions
      queryClient.invalidateQueries({ queryKey: queryKeys.sessions.all })
      // Cache the session data
      queryClient.setQueryData(queryKeys.conversations.session(data.sessionId), data)
    },
  })
}

// Send message to conversational session
export const useSendMessage = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ sessionId, message }: { sessionId: string; message: string }) => 
      conversationalAPI.sendMessage(sessionId, message),
    onSuccess: (data: ConversationResponse, variables) => {
      // Update session results cache if we have results
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.conversations.results(variables.sessionId) 
      })
    },
  })
}

// Get conversational session results
export const useConversationalResults = (sessionId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: queryKeys.conversations.results(sessionId),
    queryFn: () => conversationalAPI.getResults(sessionId),
    enabled: enabled && !!sessionId,
    staleTime: 5 * 60 * 1000, // 5 minutes (completed results don't change)
    refetchOnWindowFocus: false, // Don't refetch on window focus
    refetchInterval: false, // Disable automatic refetching entirely for results page
  })
}

// Get session conversation history
export const useConversationHistory = (sessionId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: queryKeys.conversations.history(sessionId),
    queryFn: () => conversationalAPI.getResults(sessionId).then(results => results.conversationHistory),
    enabled: enabled && !!sessionId,
    staleTime: 5 * 1000, // 5 seconds
  })
}