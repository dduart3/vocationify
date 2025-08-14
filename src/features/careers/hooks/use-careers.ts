import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { Career, CareerWithSchools, CareerFilters, CareerSortOptions } from '../types'

export function useCareers(filters?: Partial<CareerFilters>, sortOptions?: CareerSortOptions) {
  return useQuery({
    queryKey: ['careers', filters, sortOptions],
    queryFn: async (): Promise<Career[]> => {
      let query = supabase
        .from('careers')
        .select('*')

      // Apply filters
      if (filters?.search) {
        query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
      }

      if (filters?.riasecType && filters.riasecType !== 'all') {
        query = query.eq('primary_riasec_type', filters.riasecType)
      }

      if (filters?.durationYears && filters.durationYears !== 'all') {
        query = query.eq('duration_years', filters.durationYears)
      }

      // Apply sorting
      if (sortOptions?.field) {
        const ascending = sortOptions.direction === 'asc'
        switch (sortOptions.field) {
          case 'name':
            query = query.order('name', { ascending })
            break
          case 'duration':
            query = query.order('duration_years', { ascending })
            break
          default:
            query = query.order('name', { ascending: true })
        }
      } else {
        query = query.order('name', { ascending: true })
      }

      const { data, error } = await query

      if (error) {
        throw new Error(`Error fetching careers: ${error.message}`)
      }

      return data || []
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useCareerWithSchools(careerId: string) {
  return useQuery({
    queryKey: ['career', careerId, 'schools'],
    queryFn: async (): Promise<CareerWithSchools | null> => {
      const { data: career, error: careerError } = await supabase
        .from('careers')
        .select('*')
        .eq('id', careerId)
        .single()

      if (careerError) {
        throw new Error(`Error fetching career: ${careerError.message}`)
      }

      const { data: schoolCareers, error: schoolsError } = await supabase
        .from('school_careers')
        .select(`
          shifts,
          admission_requirements,
          school:schools(*)
        `)
        .eq('career_id', careerId)

      if (schoolsError) {
        throw new Error(`Error fetching schools: ${schoolsError.message}`)
      }

      return {
        ...career,
        schools: schoolCareers?.map(sc => ({
          school: sc.school,
          shifts: sc.shifts,
          admission_requirements: sc.admission_requirements
        })) || []
      }
    },
    enabled: !!careerId,
    staleTime: 5 * 60 * 1000,
  })
}

export function useCareerStats() {
  return useQuery({
    queryKey: ['careers', 'stats'],
    queryFn: async () => {
      const { data: careers, error } = await supabase
        .from('careers')
        .select('primary_riasec_type, duration_years')

      if (error) {
        throw new Error(`Error fetching career stats: ${error.message}`)
      }

      const riasecCounts = careers?.reduce((acc, career) => {
        acc[career.primary_riasec_type] = (acc[career.primary_riasec_type] || 0) + 1
        return acc
      }, {} as Record<string, number>) || {}

      const durationCounts = careers?.reduce((acc, career) => {
        acc[career.duration_years] = (acc[career.duration_years] || 0) + 1
        return acc
      }, {} as Record<number, number>) || {}

      return {
        total: careers?.length || 0,
        byRiasec: riasecCounts,
        byDuration: durationCounts
      }
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}