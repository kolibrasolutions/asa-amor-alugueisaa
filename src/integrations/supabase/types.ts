export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      banners: {
        Row: {
          active: boolean | null
          created_at: string
          id: string
          image_url: string
          sort_order: number | null
          subtitle: string | null
          title: string | null
          updated_at: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string
          id?: string
          image_url: string
          sort_order?: number | null
          subtitle?: string | null
          title?: string | null
          updated_at?: string
        }
        Update: {
          active?: boolean | null
          created_at?: string
          id?: string
          image_url?: string
          sort_order?: number | null
          subtitle?: string | null
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          name: string
          sort_order: number | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          sort_order?: number | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          sort_order?: number | null
        }
        Relationships: []
      }
      colors: {
        Row: {
          created_at: string
          hex_code: string
          id: string
          is_default: boolean | null
          name: string
          updated_at: string
          value: string
        }
        Insert: {
          created_at?: string
          hex_code: string
          id?: string
          is_default?: boolean | null
          name: string
          updated_at?: string
          value: string
        }
        Update: {
          created_at?: string
          hex_code?: string
          id?: string
          is_default?: boolean | null
          name?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      customers: {
        Row: {
          address: string | null
          cidade: string | null
          cpf: string | null
          created_at: string
          document_number: string | null
          email: string | null
          endereco: string | null
          id: string
          nome: string | null
          notes: string | null
          phone: string | null
          rg: string | null
          telefone: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          cidade?: string | null
          cpf?: string | null
          created_at?: string
          document_number?: string | null
          email?: string | null
          endereco?: string | null
          id?: string
          nome?: string | null
          notes?: string | null
          phone?: string | null
          rg?: string | null
          telefone?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          cidade?: string | null
          cpf?: string | null
          created_at?: string
          document_number?: string | null
          email?: string | null
          endereco?: string | null
          id?: string
          nome?: string | null
          notes?: string | null
          phone?: string | null
          rg?: string | null
          telefone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      hero_images: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          image_url: string
          is_active: boolean
          sort_order: number
          title: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          image_url: string
          is_active?: boolean
          sort_order?: number
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string
          is_active?: boolean
          sort_order?: number
          title?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      products: {
        Row: {
          brand: string | null
          category_id: string | null
          color: string | null
          created_at: string
          description: string | null
          id: string
          images: string[] | null
          name: string
          purchase_price: number | null
          rental_price: number | null
          size: string | null
          sku: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          brand?: string | null
          category_id?: string | null
          color?: string | null
          created_at?: string
          description?: string | null
          id?: string
          images?: string[] | null
          name: string
          purchase_price?: number | null
          rental_price?: number | null
          size?: string | null
          sku?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          brand?: string | null
          category_id?: string | null
          color?: string | null
          created_at?: string
          description?: string | null
          id?: string
          images?: string[] | null
          name?: string
          purchase_price?: number | null
          rental_price?: number | null
          size?: string | null
          sku?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          full_name: string | null
          id: string
          role: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          full_name?: string | null
          id: string
          role?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          full_name?: string | null
          id?: string
          role?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      rental_items: {
        Row: {
          id: string
          product_id: string | null
          quantity: number | null
          rental_id: string | null
          unit_price: number | null
        }
        Insert: {
          id?: string
          product_id?: string | null
          quantity?: number | null
          rental_id?: string | null
          unit_price?: number | null
        }
        Update: {
          id?: string
          product_id?: string | null
          quantity?: number | null
          rental_id?: string | null
          unit_price?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "rental_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rental_items_rental_id_fkey"
            columns: ["rental_id"]
            isOneToOne: false
            referencedRelation: "rental_with_customer"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rental_items_rental_id_fkey"
            columns: ["rental_id"]
            isOneToOne: false
            referencedRelation: "rentals"
            referencedColumns: ["id"]
          },
        ]
      }
      rentals: {
        Row: {
          created_at: string
          customer_id: string
          deposit_amount: number | null
          event_date: string
          id: string
          notes: string | null
          rental_end_date: string
          rental_start_date: string
          status: string | null
          total_amount: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          customer_id: string
          deposit_amount?: number | null
          event_date: string
          id?: string
          notes?: string | null
          rental_end_date: string
          rental_start_date: string
          status?: string | null
          total_amount: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          customer_id?: string
          deposit_amount?: number | null
          event_date?: string
          id?: string
          notes?: string | null
          rental_end_date?: string
          rental_start_date?: string
          status?: string | null
          total_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "rentals_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      section_images: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          image_url: string
          is_active: boolean
          section_id: string
          sort_order: number
          title: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          image_url: string
          is_active?: boolean
          section_id: string
          sort_order?: number
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string
          is_active?: boolean
          section_id?: string
          sort_order?: number
          title?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      sizes: {
        Row: {
          created_at: string
          id: string
          is_default: boolean | null
          name: string
          sort_order: number | null
          updated_at: string
          value: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_default?: boolean | null
          name: string
          sort_order?: number | null
          updated_at?: string
          value: string
        }
        Update: {
          created_at?: string
          id?: string
          is_default?: boolean | null
          name?: string
          sort_order?: number | null
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
    }
    Views: {
      rental_with_customer: {
        Row: {
          created_at: string | null
          customer_cidade: string | null
          customer_cpf: string | null
          customer_email: string | null
          customer_endereco: string | null
          customer_id: string | null
          customer_nome: string | null
          customer_rg: string | null
          customer_telefone: string | null
          deposit_amount: number | null
          event_date: string | null
          id: string | null
          notes: string | null
          rental_end_date: string | null
          rental_start_date: string | null
          status: string | null
          total_amount: number | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rentals_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
