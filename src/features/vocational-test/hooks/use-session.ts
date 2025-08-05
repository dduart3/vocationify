import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { sessionAPI, queryKeys } from '../api'
import type { TestSession, Question } from '../types'

// Create session hook
export const useCreateSession = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (userId?: string) => sessionAPI.create(userId),
    onSuccess: (data: { id: string; question: Question; progress: number }) => {
      // Invalidate and refetch sessions
      queryClient.invalidateQueries({ queryKey: queryKeys.sessions.all })
      // Set the first question in cache
      queryClient.setQueryData(queryKeys.questions.next(data.id), data.question)
    },
  })
}

// Get session hook
export const useSession = (sessionId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: queryKeys.sessions.detail(sessionId),
    queryFn: () => sessionAPI.get(sessionId),
    enabled: enabled && !!sessionId,
    staleTime: 30 * 1000, // 30 seconds
  })
}

// Complete session hook
export const useCompleteSession = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (sessionId: string) => sessionAPI.complete(sessionId),
    onSuccess: (data: TestSession, sessionId: string) => {
      // Update the session data in cache
      queryClient.setQueryData(queryKeys.sessions.detail(sessionId), data)
      // Invalidate results queries to trigger refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.results.basic(sessionId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.results.detailed(sessionId) })
    },
  })
}