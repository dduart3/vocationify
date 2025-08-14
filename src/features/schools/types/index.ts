export interface School {
  id: string
  name: string
  address: string
  website_url: string
  phone_number: string
  email: string
  logo_url: string
  type: 'public' | 'private'
  location: {
    latitude: number
    longitude: number
  }
  created_at: string
  updated_at: string
}

export interface SchoolCareer {
  id: string
  school_id: string
  career_id: string
  shifts: string[]
  duration_years: number
  modality: 'presencial' | 'virtual' | 'mixta'
  cost_per_semester?: number
  requirements?: string[]
  career: {
    id: string
    name: string
    description: string
  }
}

export interface SchoolWithCareers extends School {
  careers: SchoolCareer[]
}

export interface SchoolFilters {
  search?: string
  type?: 'all' | 'public' | 'private'
}

export interface SchoolSortOptions {
  field: 'name' | 'type' | 'established_year' | 'location'
  direction: 'asc' | 'desc'
}