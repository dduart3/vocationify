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
            description,
            duration_years
          )
        `)
        .eq('school_id', schoolId)

      if (careersError) {
        throw careersError
      }

      // Normalize so duration_years and modality come from row or nested career (Supabase may use snake_case)
      const normalizedCareers = (careers || []).map((row: Record<string, unknown>) => {
        const career = row.career as Record<string, unknown> | undefined
        const durationYears = row.duration_years ?? row.duration ?? career?.duration_years ?? career?.duration
        const modality = row.modality ?? career?.modality
        return {
          ...row,
          career: career ? { id: career.id, name: career.name, description: career.description } : row.career,
          duration_years: durationYears != null ? Number(durationYears) : (career?.duration_years != null ? Number(career.duration_years) : undefined),
          modality: modality ?? undefined,
          shifts: row.shifts != null ? (Array.isArray(row.shifts) ? row.shifts : [row.shifts]) : []
        }
      })

      return {
        ...school,
        careers: normalizedCareers
      }
    },
    enabled: !!schoolId,
  })
}

