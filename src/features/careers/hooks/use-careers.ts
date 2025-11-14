import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { Career, CareerWithSchools, CareerFilters, CareerSortOptions } from '../types'

export function useCareers(filters?: Partial<CareerFilters>, sortOptions?: CareerSortOptions) {
  return useQuery({
    queryKey: ['careers', filters, sortOptions],
    queryFn: async (): Promise<Career[]> => {
      let query = supabase.from('careers').select('*')

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
      if (sortOptions) {
        const { field, direction } = sortOptions
        const ascending = direction === 'asc'

        switch (field) {
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
        throw error
      }

      return data || []
    },
  })
}

export function useCareerWithSchools(careerId: string) {
  return useQuery({
    queryKey: ['career', careerId, 'schools'],
    queryFn: async (): Promise<CareerWithSchools | null> => {
      if (!careerId) {
        throw new Error('Career ID is required')
      }

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
    // No query-specific overrides - use global defaults
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
  })
}