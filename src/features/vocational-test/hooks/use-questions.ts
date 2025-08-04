import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { questionAPI, queryKeys } from '../api'
import type { Question, TestResponse } from '../types'

// Get next question hook
export const useNextQuestion = (sessionId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: queryKeys.questions.next(sessionId),
    queryFn: () => questionAPI.getNext(sessionId),
    enabled: enabled && !!sessionId,
    staleTime: 0, // Always fresh for questions
    refetchOnWindowFocus: false,
  })
}

// Submit response hook
export const useSubmitResponse = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: { sessionId: string } & TestResponse) => questionAPI.submitResponse(data),
    onSuccess: (_, variables) => {
      // Invalidate next question query to get the next one
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.questions.next(variables.sessionId) 
      })
      // Invalidate session data to update progress
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.sessions.detail(variables.sessionId) 
      })
    },
  })
}