export interface Career {
  id: string
  name: string
  description: string
  duration_years: number
  created_at: string
  updated_at: string
  primary_riasec_type: string
  secondary_riasec_type: string | null
  riasec_code: string
  realistic_score: number
  investigative_score: number
  artistic_score: number
  social_score: number
  enterprising_score: number
  conventional_score: number
  work_environment: string[]
  key_skills: string[]
  related_careers: string[]
}

export interface School {
  id: string
  name: string
  description: string
  address: string
  website_url: string | null
  phone_number: string | null
  email: string | null
  logo_url: string | null
  created_at: string
  updated_at: string
  location: {
    state?: string
    city?: string
    coordinates?: {
      lat: number
      lng: number
    }
  }
  type: 'university' | 'technical' | 'institute' | 'private' | 'public'
}

export interface SchoolCareer {
  id: string
  school_id: string
  career_id: string
  shifts: string
  admission_requirements: string
  created_at: string
  school?: School
  career?: Career
}

export interface CareerWithSchools extends Career {
  schools: Array<{
    school: School
    shifts: string
    admission_requirements: string
  }>
}

export type RiasecType = 'realistic' | 'investigative' | 'artistic' | 'social' | 'enterprising' | 'conventional'

export interface CareerFilters {
  search: string
  riasecType: RiasecType | 'all'
  durationYears: number | 'all'
  state: string | 'all'
  schoolType: School['type'] | 'all'
}

export interface CareerSortOptions {
  field: 'name' | 'duration' | 'riasec_match'
  direction: 'asc' | 'desc'
}