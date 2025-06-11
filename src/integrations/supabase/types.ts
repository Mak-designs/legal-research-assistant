export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          ai_interaction_history: Json | null
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          first_name: string | null
          id: string
          last_login: string | null
          last_name: string | null
          notification_preferences: Json | null
          preferred_language: string | null
          updated_at: string | null
        }
        Insert: {
          ai_interaction_history?: Json | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          first_name?: string | null
          id: string
          last_login?: string | null
          last_name?: string | null
          notification_preferences?: Json | null
          preferred_language?: string | null
          updated_at?: string | null
        }
        Update: {
          ai_interaction_history?: Json | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          first_name?: string | null
          id?: string
          last_login?: string | null
          last_name?: string | null
          notification_preferences?: Json | null
          preferred_language?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      saved_cases: {
        Row: {
          case_id: string
          citation: string | null
          court_name: string | null
          created_at: string | null
          decision_date: string | null
          id: string
          notes: string | null
          title: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          case_id: string
          citation?: string | null
          court_name?: string | null
          created_at?: string | null
          decision_date?: string | null
          id?: string
          notes?: string | null
          title: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          case_id?: string
          citation?: string | null
          court_name?: string | null
          created_at?: string | null
          decision_date?: string | null
          id?: string
          notes?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "saved_cases_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      search_history: {
        Row: {
          created_at: string | null
          id: string
          query: string
          results_count: number
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          query: string
          results_count?: number
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          query?: string
          results_count?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "search_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      zambian_cases: {
        Row: {
          case_facts: string | null
          case_summary: string | null
          citation: string
          court_name: string | null
          created_at: string
          decision_date: string | null
          id: string
          judges: string[] | null
          judgment: string | null
          keywords: string[] | null
          legal_domain: string | null
          legal_principles: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          case_facts?: string | null
          case_summary?: string | null
          citation: string
          court_name?: string | null
          created_at?: string
          decision_date?: string | null
          id?: string
          judges?: string[] | null
          judgment?: string | null
          keywords?: string[] | null
          legal_domain?: string | null
          legal_principles?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          case_facts?: string | null
          case_summary?: string | null
          citation?: string
          court_name?: string | null
          created_at?: string
          decision_date?: string | null
          id?: string
          judges?: string[] | null
          judgment?: string | null
          keywords?: string[] | null
          legal_domain?: string | null
          legal_principles?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      zambian_statutes: {
        Row: {
          amended_date: string | null
          chapter_number: string | null
          citation: string
          created_at: string
          enacted_date: string | null
          id: string
          keywords: string[] | null
          legal_domain: string | null
          section_number: string | null
          status: string | null
          statute_text: string
          summary: string | null
          title: string
          updated_at: string
        }
        Insert: {
          amended_date?: string | null
          chapter_number?: string | null
          citation: string
          created_at?: string
          enacted_date?: string | null
          id?: string
          keywords?: string[] | null
          legal_domain?: string | null
          section_number?: string | null
          status?: string | null
          statute_text: string
          summary?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          amended_date?: string | null
          chapter_number?: string | null
          citation?: string
          created_at?: string
          enacted_date?: string | null
          id?: string
          keywords?: string[] | null
          legal_domain?: string | null
          section_number?: string | null
          status?: string | null
          statute_text?: string
          summary?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
