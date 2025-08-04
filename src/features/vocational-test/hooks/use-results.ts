import { useQuery } from '@tanstack/react-query'
import { resultsAPI, queryKeys } from '../api'
import type { TestResults } from '../types'

// Get basic test results hook
export const useTestResults = (sessionId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: queryKeys.results.basic(sessionId),
    queryFn: () => resultsAPI.get(sessionId),
    enabled: enabled && !!sessionId,
    staleTime: 10 * 60 * 1000, // 10 minutes - results don't change often
  })
}

// Get detailed results with career recommendations hook
export const useDetailedResults = (sessionId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: queryKeys.results.detailed(sessionId),
    queryFn: () => resultsAPI.getDetailed(sessionId),
    enabled: enabled && !!sessionId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}