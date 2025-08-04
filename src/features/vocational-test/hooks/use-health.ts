import { useQuery } from '@tanstack/react-query'
import { healthAPI, queryKeys } from '../api'

// Health check hook
export const useHealthCheck = () => {
  return useQuery({
    queryKey: queryKeys.health,
    queryFn: () => healthAPI.check(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5 * 60 * 1000, // Check every 5 minutes
    retry: 1, // Only retry once for health checks
  })
}