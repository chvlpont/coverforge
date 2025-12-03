// Database types for Supabase tables

export interface Profile {
  id: string
  username: string
  email: string
  created_at: string
}

export interface Document {
  id: string
  user_id: string
  title: string
  content: string
  reference_content: string
  created_at: string
  updated_at: string
}
