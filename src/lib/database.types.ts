export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      habits: {
        Row: {
          id: string
          user_id: string
          name: string
          emoji: string | null
          streak: number
          completed: boolean
          created_at: string
          updated_at: string
          last_completed_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          emoji?: string | null
          streak?: number
          completed?: boolean
          created_at?: string
          updated_at?: string
          last_completed_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          emoji?: string | null
          streak?: number
          completed?: boolean
          created_at?: string
          updated_at?: string
          last_completed_at?: string | null
        }
      }
      profiles: {
        Row: {
          id: string
          full_name: string | null
          is_pro: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          is_pro?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          is_pro?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
} 