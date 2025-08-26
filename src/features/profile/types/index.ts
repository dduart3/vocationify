export interface UserActivity {
  tests_completed: number
  careers_explored: number
  schools_reviewed: number
  last_test_date?: string
}

export interface ProfileUpdateData {
  first_name: string | null
  last_name: string | null
  email: string | null
  phone: string | null
  address: string | null
  avatar_url: string | null
  location: { latitude: number; longitude: number } | null
}

export interface ProfilePageProps {
  // Future props if needed
}