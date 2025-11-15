export interface UserProfile {
  id: string
  first_name: string | null
  last_name: string | null
  email: string | null
  address: string | null
  phone: string | null
  avatar_url: string | null
  created_at: string | null
  updated_at: string | null
  role_id: number | null
  role?: string | null
  location: { latitude: number; longitude: number } | null
  onboarding_completed: boolean | null
}
