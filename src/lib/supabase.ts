import { createClient } from '@supabase/supabase-js'

// Environment variables should be defined in a .env file
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Create a single instance of the Supabase client to use across your app
export const supabase = createClient(supabaseUrl, supabaseKey)

// Updated error handling function that works with Supabase's return type
export async function handleSupabaseError<T>(
  promise: Promise<{ data: T | null; error: any }>
): Promise<T> {
  const { data, error } = await promise
  
  if (error) {
    console.error('Supabase error:', error)
    throw new Error(error.message || 'An error occurred with the database operation')
  }
  
  if (!data) {
    throw new Error('No data returned from the database')
  }
  
  return data
}
