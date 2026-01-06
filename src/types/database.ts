export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      devices: {
        Row: {
          app_version: string | null
          created_at: string
          device_name: string | null
          id: string
          is_active: boolean
          last_used_at: string
          platform: string
          push_token: string
          updated_at: string
          user_id: string
        }
        Insert: {
          app_version?: string | null
          created_at?: string
          device_name?: string | null
          id?: string
          is_active?: boolean
          last_used_at?: string
          platform: string
          push_token: string
          updated_at?: string
          user_id: string
        }
        Update: {
          app_version?: string | null
          created_at?: string
          device_name?: string | null
          id?: string
          is_active?: boolean
          last_used_at?: string
          platform?: string
          push_token?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      driver_profiles: {
        Row: {
          allow_direct_requests: boolean | null
          avatar_url: string | null
          bio: string | null
          created_at: string
          display_name: string
          id: string
          is_accepting_requests: boolean | null
          is_rora_pro: boolean | null
          languages: string[] | null
          legal_name: string | null
          license_plate: string | null
          phone_number: string | null
          rating_average: number | null
          rating_count: number | null
          region_id: string
          seats: number | null
          service_area_tags: string[] | null
          status: Database["public"]["Enums"]["driver_status"]
          updated_at: string
          vehicle_color: string | null
          vehicle_make: string | null
          vehicle_model: string | null
          vehicle_type: string | null
          vehicle_year: number | null
        }
        Insert: {
          allow_direct_requests?: boolean | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name: string
          id: string
          is_accepting_requests?: boolean | null
          is_rora_pro?: boolean | null
          languages?: string[] | null
          legal_name?: string | null
          license_plate?: string | null
          phone_number?: string | null
          rating_average?: number | null
          rating_count?: number | null
          region_id: string
          seats?: number | null
          service_area_tags?: string[] | null
          status?: Database["public"]["Enums"]["driver_status"]
          updated_at?: string
          vehicle_color?: string | null
          vehicle_make?: string | null
          vehicle_model?: string | null
          vehicle_type?: string | null
          vehicle_year?: number | null
        }
        Update: {
          allow_direct_requests?: boolean | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string
          id?: string
          is_accepting_requests?: boolean | null
          is_rora_pro?: boolean | null
          languages?: string[] | null
          legal_name?: string | null
          license_plate?: string | null
          phone_number?: string | null
          rating_average?: number | null
          rating_count?: number | null
          region_id?: string
          seats?: number | null
          service_area_tags?: string[] | null
          status?: Database["public"]["Enums"]["driver_status"]
          updated_at?: string
          vehicle_color?: string | null
          vehicle_make?: string | null
          vehicle_model?: string | null
          vehicle_type?: string | null
          vehicle_year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "driver_profiles_region_id_fkey"
            columns: ["region_id"]
            isOneToOne: false
            referencedRelation: "regions"
            referencedColumns: ["id"]
          },
        ]
      }
      driver_verifications: {
        Row: {
          created_at: string
          driver_user_id: string
          expires_at: string | null
          id: string
          verification_metadata: Json | null
          verification_type: Database["public"]["Enums"]["verification_type"]
          verified_at: string
          verified_by_user_id: string | null
        }
        Insert: {
          created_at?: string
          driver_user_id: string
          expires_at?: string | null
          id?: string
          verification_metadata?: Json | null
          verification_type: Database["public"]["Enums"]["verification_type"]
          verified_at?: string
          verified_by_user_id?: string | null
        }
        Update: {
          created_at?: string
          driver_user_id?: string
          expires_at?: string | null
          id?: string
          verification_metadata?: Json | null
          verification_type?: Database["public"]["Enums"]["verification_type"]
          verified_at?: string
          verified_by_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "driver_verifications_driver_user_id_fkey"
            columns: ["driver_user_id"]
            isOneToOne: false
            referencedRelation: "driver_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      favorites: {
        Row: {
          created_at: string
          driver_user_id: string
          rider_user_id: string
        }
        Insert: {
          created_at?: string
          driver_user_id: string
          rider_user_id: string
        }
        Update: {
          created_at?: string
          driver_user_id?: string
          rider_user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_driver_user_id_fkey"
            columns: ["driver_user_id"]
            isOneToOne: false
            referencedRelation: "driver_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      guest_tokens: {
        Row: {
          claimed_at: string | null
          claimed_by_user_id: string | null
          created_at: string
          expires_at: string
          id: string
          last_used_at: string | null
          token: string
        }
        Insert: {
          claimed_at?: string | null
          claimed_by_user_id?: string | null
          created_at?: string
          expires_at: string
          id?: string
          last_used_at?: string | null
          token: string
        }
        Update: {
          claimed_at?: string | null
          claimed_by_user_id?: string | null
          created_at?: string
          expires_at?: string
          id?: string
          last_used_at?: string | null
          token?: string
        }
        Relationships: []
      }
      notifications_inbox: {
        Row: {
          body: string
          created_at: string
          id: string
          metadata: Json | null
          read_at: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          metadata?: Json | null
          read_at?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          metadata?: Json | null
          read_at?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      pricing_fixed_fares: {
        Row: {
          amount: number
          created_at: string
          description: string | null
          destination_zone_id: string | null
          id: string
          is_active: boolean
          origin_zone_id: string | null
          region_id: string
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          description?: string | null
          destination_zone_id?: string | null
          id?: string
          is_active?: boolean
          origin_zone_id?: string | null
          region_id: string
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string | null
          destination_zone_id?: string | null
          id?: string
          is_active?: boolean
          origin_zone_id?: string | null
          region_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pricing_fixed_fares_destination_zone_id_fkey"
            columns: ["destination_zone_id"]
            isOneToOne: false
            referencedRelation: "pricing_zones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pricing_fixed_fares_origin_zone_id_fkey"
            columns: ["origin_zone_id"]
            isOneToOne: false
            referencedRelation: "pricing_zones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pricing_fixed_fares_region_id_fkey"
            columns: ["region_id"]
            isOneToOne: false
            referencedRelation: "regions"
            referencedColumns: ["id"]
          },
        ]
      }
      pricing_modifiers: {
        Row: {
          created_at: string
          enabled: boolean
          id: string
          modifier_application: string
          modifier_name: string
          modifier_type: string
          modifier_value: number
          region_id: string
          threshold_config: Json | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          enabled?: boolean
          id?: string
          modifier_application?: string
          modifier_name: string
          modifier_type: string
          modifier_value: number
          region_id: string
          threshold_config?: Json | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          enabled?: boolean
          id?: string
          modifier_application?: string
          modifier_name?: string
          modifier_type?: string
          modifier_value?: number
          region_id?: string
          threshold_config?: Json | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pricing_modifiers_region_id_fkey"
            columns: ["region_id"]
            isOneToOne: false
            referencedRelation: "regions"
            referencedColumns: ["id"]
          },
        ]
      }
      pricing_rule_versions: {
        Row: {
          activated_at: string | null
          base_fare: number
          created_at: string
          deactivated_at: string | null
          id: string
          is_active: boolean
          per_km_rate: number
          region_id: string
          updated_at: string
          version_name: string | null
          version_number: number
        }
        Insert: {
          activated_at?: string | null
          base_fare: number
          created_at?: string
          deactivated_at?: string | null
          id?: string
          is_active?: boolean
          per_km_rate: number
          region_id: string
          updated_at?: string
          version_name?: string | null
          version_number: number
        }
        Update: {
          activated_at?: string | null
          base_fare?: number
          created_at?: string
          deactivated_at?: string | null
          id?: string
          is_active?: boolean
          per_km_rate?: number
          region_id?: string
          updated_at?: string
          version_name?: string | null
          version_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "pricing_rule_versions_region_id_fkey"
            columns: ["region_id"]
            isOneToOne: false
            referencedRelation: "regions"
            referencedColumns: ["id"]
          },
        ]
      }
      pricing_zones: {
        Row: {
          center_lat: number
          center_lng: number
          created_at: string
          id: string
          is_active: boolean
          radius_meters: number
          region_id: string
          updated_at: string
          zone_code: string
          zone_name: string
        }
        Insert: {
          center_lat: number
          center_lng: number
          created_at?: string
          id?: string
          is_active?: boolean
          radius_meters: number
          region_id: string
          updated_at?: string
          zone_code: string
          zone_name: string
        }
        Update: {
          center_lat?: number
          center_lng?: number
          created_at?: string
          id?: string
          is_active?: boolean
          radius_meters?: number
          region_id?: string
          updated_at?: string
          zone_code?: string
          zone_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "pricing_zones_region_id_fkey"
            columns: ["region_id"]
            isOneToOne: false
            referencedRelation: "regions"
            referencedColumns: ["id"]
          },
        ]
      }
      ratings: {
        Row: {
          comment: string | null
          created_at: string
          driver_user_id: string
          id: string
          ride_session_id: string
          rider_user_id: string
          score: number
        }
        Insert: {
          comment?: string | null
          created_at?: string
          driver_user_id: string
          id?: string
          ride_session_id: string
          rider_user_id: string
          score: number
        }
        Update: {
          comment?: string | null
          created_at?: string
          driver_user_id?: string
          id?: string
          ride_session_id?: string
          rider_user_id?: string
          score?: number
        }
        Relationships: [
          {
            foreignKeyName: "ratings_driver_user_id_fkey"
            columns: ["driver_user_id"]
            isOneToOne: false
            referencedRelation: "driver_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ratings_ride_session_id_fkey"
            columns: ["ride_session_id"]
            isOneToOne: false
            referencedRelation: "ride_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      regions: {
        Row: {
          country_code: string
          created_at: string
          currency_code: string
          default_pricing_rule_version_id: string | null
          discovery_radius_config: Json | null
          distance_unit: string
          id: string
          is_active: boolean
          island_name: string
          updated_at: string
        }
        Insert: {
          country_code: string
          created_at?: string
          currency_code?: string
          default_pricing_rule_version_id?: string | null
          discovery_radius_config?: Json | null
          distance_unit?: string
          id?: string
          is_active?: boolean
          island_name: string
          updated_at?: string
        }
        Update: {
          country_code?: string
          created_at?: string
          currency_code?: string
          default_pricing_rule_version_id?: string | null
          discovery_radius_config?: Json | null
          distance_unit?: string
          id?: string
          is_active?: boolean
          island_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      ride_events: {
        Row: {
          actor_type: string | null
          actor_user_id: string | null
          created_at: string
          event_data: Json | null
          event_type: string
          id: string
          ride_session_id: string
        }
        Insert: {
          actor_type?: string | null
          actor_user_id?: string | null
          created_at?: string
          event_data?: Json | null
          event_type: string
          id?: string
          ride_session_id: string
        }
        Update: {
          actor_type?: string | null
          actor_user_id?: string | null
          created_at?: string
          event_data?: Json | null
          event_type?: string
          id?: string
          ride_session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ride_events_ride_session_id_fkey"
            columns: ["ride_session_id"]
            isOneToOne: false
            referencedRelation: "ride_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      ride_offers: {
        Row: {
          created_at: string
          driver_user_id: string
          id: string
          offer_amount: number
          offer_type: Database["public"]["Enums"]["offer_type"]
          price_label: Database["public"]["Enums"]["price_label"] | null
          response_metadata: Json | null
          ride_session_id: string
          status: string
        }
        Insert: {
          created_at?: string
          driver_user_id: string
          id?: string
          offer_amount: number
          offer_type: Database["public"]["Enums"]["offer_type"]
          price_label?: Database["public"]["Enums"]["price_label"] | null
          response_metadata?: Json | null
          ride_session_id: string
          status?: string
        }
        Update: {
          created_at?: string
          driver_user_id?: string
          id?: string
          offer_amount?: number
          offer_type?: Database["public"]["Enums"]["offer_type"]
          price_label?: Database["public"]["Enums"]["price_label"] | null
          response_metadata?: Json | null
          ride_session_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "ride_offers_ride_session_id_fkey"
            columns: ["ride_session_id"]
            isOneToOne: false
            referencedRelation: "ride_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      ride_reports: {
        Row: {
          admin_notes: string | null
          category: Database["public"]["Enums"]["report_category"]
          created_at: string
          id: string
          notes: string | null
          reporter_user_id: string
          resolved_at: string | null
          resolved_by_user_id: string | null
          ride_session_id: string
          status: string
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          category: Database["public"]["Enums"]["report_category"]
          created_at?: string
          id?: string
          notes?: string | null
          reporter_user_id: string
          resolved_at?: string | null
          resolved_by_user_id?: string | null
          ride_session_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          category?: Database["public"]["Enums"]["report_category"]
          created_at?: string
          id?: string
          notes?: string | null
          reporter_user_id?: string
          resolved_at?: string | null
          resolved_by_user_id?: string | null
          ride_session_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ride_reports_ride_session_id_fkey"
            columns: ["ride_session_id"]
            isOneToOne: false
            referencedRelation: "ride_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      ride_sessions: {
        Row: {
          completed_at: string | null
          confirmed_at: string | null
          created_at: string
          destination_freeform_name: string | null
          destination_label: string
          destination_lat: number
          destination_lng: number
          discovery_started_at: string | null
          final_agreed_amount: number | null
          guest_token_id: string | null
          hold_expires_at: string | null
          id: string
          origin_label: string
          origin_lat: number
          origin_lng: number
          pricing_calculation_metadata: Json | null
          pricing_rule_version_id: string | null
          qr_token_jti: string | null
          region_id: string
          request_type: Database["public"]["Enums"]["request_type"]
          rider_user_id: string | null
          rora_fare_amount: number
          selected_driver_id: string | null
          selected_offer_id: string | null
          status: Database["public"]["Enums"]["ride_status"]
          target_driver_id: string | null
          updated_at: string
        }
        Insert: {
          completed_at?: string | null
          confirmed_at?: string | null
          created_at?: string
          destination_freeform_name?: string | null
          destination_label: string
          destination_lat: number
          destination_lng: number
          discovery_started_at?: string | null
          final_agreed_amount?: number | null
          guest_token_id?: string | null
          hold_expires_at?: string | null
          id?: string
          origin_label: string
          origin_lat: number
          origin_lng: number
          pricing_calculation_metadata?: Json | null
          pricing_rule_version_id?: string | null
          qr_token_jti?: string | null
          region_id: string
          request_type?: Database["public"]["Enums"]["request_type"]
          rider_user_id?: string | null
          rora_fare_amount: number
          selected_driver_id?: string | null
          selected_offer_id?: string | null
          status?: Database["public"]["Enums"]["ride_status"]
          target_driver_id?: string | null
          updated_at?: string
        }
        Update: {
          completed_at?: string | null
          confirmed_at?: string | null
          created_at?: string
          destination_freeform_name?: string | null
          destination_label?: string
          destination_lat?: number
          destination_lng?: number
          discovery_started_at?: string | null
          final_agreed_amount?: number | null
          guest_token_id?: string | null
          hold_expires_at?: string | null
          id?: string
          origin_label?: string
          origin_lat?: number
          origin_lng?: number
          pricing_calculation_metadata?: Json | null
          pricing_rule_version_id?: string | null
          qr_token_jti?: string | null
          region_id?: string
          request_type?: Database["public"]["Enums"]["request_type"]
          rider_user_id?: string | null
          rora_fare_amount?: number
          selected_driver_id?: string | null
          selected_offer_id?: string | null
          status?: Database["public"]["Enums"]["ride_status"]
          target_driver_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_ride_sessions_selected_offer"
            columns: ["selected_offer_id"]
            isOneToOne: false
            referencedRelation: "ride_offers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ride_sessions_guest_token_id_fkey"
            columns: ["guest_token_id"]
            isOneToOne: false
            referencedRelation: "guest_tokens"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ride_sessions_pricing_rule_version_id_fkey"
            columns: ["pricing_rule_version_id"]
            isOneToOne: false
            referencedRelation: "pricing_rule_versions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ride_sessions_region_id_fkey"
            columns: ["region_id"]
            isOneToOne: false
            referencedRelation: "regions"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          phone_number: string | null
          preferred_language: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          phone_number?: string | null
          preferred_language?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone_number?: string | null
          preferred_language?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_push_tokens: {
        Args: { p_user_id: string }
        Returns: {
          platform: string
          push_token: string
        }[]
      }
      mark_all_notifications_read: {
        Args: { p_user_id: string }
        Returns: number
      }
      mark_notification_read: {
        Args: { p_notification_id: string; p_user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      driver_status: "ACTIVE" | "UNVERIFIED" | "SUSPENDED"
      offer_type: "accept" | "counter"
      price_label: "good_deal" | "normal" | "pricier"
      report_category:
        | "safety_concern"
        | "pricing_dispute"
        | "unprofessional_behavior"
        | "route_issue"
        | "vehicle_condition"
        | "other"
      request_type: "broadcast" | "direct"
      ride_status:
        | "created"
        | "discovery"
        | "hold"
        | "confirmed"
        | "active"
        | "completed"
        | "canceled"
        | "expired"
      verification_type: "GOVERNMENT_REGISTERED" | "RORA_VERIFIED"
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
    Enums: {
      driver_status: ["ACTIVE", "UNVERIFIED", "SUSPENDED"],
      offer_type: ["accept", "counter"],
      price_label: ["good_deal", "normal", "pricier"],
      report_category: [
        "safety_concern",
        "pricing_dispute",
        "unprofessional_behavior",
        "route_issue",
        "vehicle_condition",
        "other",
      ],
      request_type: ["broadcast", "direct"],
      ride_status: [
        "created",
        "discovery",
        "hold",
        "confirmed",
        "active",
        "completed",
        "canceled",
        "expired",
      ],
      verification_type: ["GOVERNMENT_REGISTERED", "RORA_VERIFIED"],
    },
  },
} as const
