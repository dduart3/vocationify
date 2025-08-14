import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { School, SchoolWithCareers, SchoolFilters, SchoolSortOptions } from '../types'

export function useSchools(filters?: Partial<SchoolFilters>, sortOptions?: SchoolSortOptions) {
  return useQuery({
    queryKey: ['schools', filters, sortOptions],
    queryFn: async (): Promise<School[]> => {
      let query = supabase.from('schools').select('*')

      // Apply filters
      if (filters?.search) {
        query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
      }

      if (filters?.type && filters.type !== 'all') {
        query = query.eq('type', filters.type)
      }

      // Note: With coordinate-only location, state/city filters would need a separate address table

      // Apply sorting
      if (sortOptions) {
        const { field, direction } = sortOptions
        query = query.order(field, { ascending: direction === 'asc' })
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

export function useSchoolWithCareers(schoolId: string) {
  return useQuery({
    queryKey: ['school', schoolId],
    queryFn: async (): Promise<SchoolWithCareers | null> => {
      const { data: school, error: schoolError } = await supabase
        .from('schools')
        .select('*')
        .eq('id', schoolId)
        .single()

      if (schoolError) {
        throw schoolError
      }

      if (!school) {
        return null
      }

      const { data: careers, error: careersError } = await supabase
        .from('school_careers')
        .select(`
          *,
          career:careers (
            id,
            name,
            description
          )
        `)
        .eq('school_id', schoolId)

      if (careersError) {
        throw careersError
      }

      return {
        ...school,
        careers: careers || []
      }
    },
    enabled: !!schoolId,
  })
}

