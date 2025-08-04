import { useQuery } from '@tanstack/react-query'
import { careersAPI, queryKeys } from '../api'
import type { Career, RiasecScore } from '../types'

// Get all careers hook
export const useCareers = () => {
  return useQuery({
    queryKey: queryKeys.careers.all,
    queryFn: () => careersAPI.getAll(),
    staleTime: 30 * 60 * 1000, // 30 minutes - careers don't change often
  })
}

// Get single career hook
export const useCareer = (careerId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: queryKeys.careers.detail(careerId),
    queryFn: () => careersAPI.getById(careerId),
    enabled: enabled && !!careerId,
    staleTime: 30 * 60 * 1000, // 30 minutes
  })
}

// Get career recommendations hook
export const useCareerRecommendations = (
  scores: RiasecScore, 
  limit: number = 10, 
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: queryKeys.careers.recommendations(scores),
    queryFn: () => careersAPI.getRecommendations({ scores, limit }),
    enabled: enabled && !!scores,
    staleTime: 15 * 60 * 1000, // 15 minutes
  })
}