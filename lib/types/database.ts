// Database types for Supabase tables

export interface MasterLetter {
  id: string
  user_id: string
  title: string
  role_category: string | null
  language: string
  content: string
  created_at: string
}

export interface Profile {
  id: string
  username: string
  email: string
  created_at: string
}
