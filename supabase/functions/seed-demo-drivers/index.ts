import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Demo drivers based on Sint Maarten taxi drivers
const DEMO_DRIVERS = [
  {
    email: 'marcus.thompson@demo.roraride.com',
    password: 'DemoDriver123!',
    profile: {
      display_name: 'Marcus Thompson',
      legal_name: 'Marcus Anthony Thompson',
      phone_number: '+1 721 555-0123',
      avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
      vehicle_type: 'sedan',
      vehicle_make: 'Toyota',
      vehicle_model: 'Camry',
      vehicle_color: 'Silver',
      vehicle_year: 2022,
      license_plate: 'SXM-4521',
      seats: 4,
      languages: ['en', 'nl', 'es'],
      service_area_tags: ['airport', 'philipsburg', 'maho'],
      rating_average: 4.9,
      rating_count: 127,
      bio: 'Professional driver with 8 years of experience. I know every corner of Sint Maarten and love sharing local tips with visitors!',
      is_rora_pro: true,
      is_accepting_requests: true,
    },
  },
  {
    email: 'sophia.laurent@demo.roraride.com',
    password: 'DemoDriver123!',
    profile: {
      display_name: 'Sophia Laurent',
      legal_name: 'Sophia Marie Laurent',
      phone_number: '+1 721 555-0124',
      avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face',
      vehicle_type: 'suv',
      vehicle_make: 'Honda',
      vehicle_model: 'CR-V',
      vehicle_color: 'White',
      vehicle_year: 2023,
      license_plate: 'SXM-7890',
      seats: 5,
      languages: ['en', 'fr', 'pap'],
      service_area_tags: ['airport', 'cruise_port', 'french_side', 'marigot'],
      rating_average: 5.0,
      rating_count: 203,
      bio: 'Bilingual driver specializing in airport transfers and island tours. Safety and comfort are my top priorities.',
      is_rora_pro: true,
      is_accepting_requests: true,
    },
  },
  {
    email: 'rafael.santos@demo.roraride.com',
    password: 'DemoDriver123!',
    profile: {
      display_name: 'Rafael Santos',
      legal_name: 'Rafael Miguel Santos',
      phone_number: '+1 721 555-0125',
      avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face',
      vehicle_type: 'van',
      vehicle_make: 'Mercedes',
      vehicle_model: 'Sprinter',
      vehicle_color: 'Black',
      vehicle_year: 2021,
      license_plate: 'SXM-3456',
      seats: 12,
      languages: ['en', 'es'],
      service_area_tags: ['airport', 'cruise_port', 'hotels'],
      rating_average: 4.8,
      rating_count: 89,
      bio: 'Large group specialist with a spacious van. Perfect for family trips and group outings around the island.',
      is_rora_pro: false,
      is_accepting_requests: true,
    },
  },
  {
    email: 'amara.williams@demo.roraride.com',
    password: 'DemoDriver123!',
    profile: {
      display_name: 'Amara Williams',
      legal_name: 'Amara Nicole Williams',
      phone_number: '+1 721 555-0126',
      avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face',
      vehicle_type: 'sedan',
      vehicle_make: 'Nissan',
      vehicle_model: 'Altima',
      vehicle_color: 'Blue',
      vehicle_year: 2022,
      license_plate: 'SXM-6789',
      seats: 4,
      languages: ['en', 'nl'],
      service_area_tags: ['philipsburg', 'simpson_bay', 'maho'],
      rating_average: 4.7,
      rating_count: 156,
      bio: 'Friendly and reliable driver. I love meeting new people and making your ride enjoyable.',
      is_rora_pro: false,
      is_accepting_requests: false, // Off duty
    },
  },
  {
    email: 'jeanpierre.dubois@demo.roraride.com',
    password: 'DemoDriver123!',
    profile: {
      display_name: 'Jean-Pierre Dubois',
      legal_name: 'Jean-Pierre Antoine Dubois',
      phone_number: '+1 721 555-0127',
      avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
      vehicle_type: 'suv',
      vehicle_make: 'Ford',
      vehicle_model: 'Explorer',
      vehicle_color: 'Gray',
      vehicle_year: 2023,
      license_plate: 'SXM-2345',
      seats: 5,
      languages: ['fr', 'en', 'nl'],
      service_area_tags: ['french_side', 'marigot', 'orient_bay', 'grand_case'],
      rating_average: 4.9,
      rating_count: 178,
      bio: 'Born and raised on the island. I can take you to the best local spots and hidden gems. Excellent for custom tours!',
      is_rora_pro: true,
      is_accepting_requests: true,
    },
  },
  {
    email: 'keisha.richardson@demo.roraride.com',
    password: 'DemoDriver123!',
    profile: {
      display_name: 'Keisha Richardson',
      legal_name: 'Keisha Marie Richardson',
      phone_number: '+1 721 555-0128',
      avatar_url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&h=200&fit=crop&crop=face',
      vehicle_type: 'sedan',
      vehicle_make: 'Hyundai',
      vehicle_model: 'Sonata',
      vehicle_color: 'Red',
      vehicle_year: 2021,
      license_plate: 'SXM-8901',
      seats: 4,
      languages: ['en'],
      service_area_tags: ['airport', 'philipsburg', 'simpson_bay'],
      rating_average: 4.6,
      rating_count: 92,
      bio: 'Efficient and punctual driver. Specializing in business travel and airport runs. Always on time!',
      is_rora_pro: false,
      is_accepting_requests: true,
    },
  },
  {
    email: 'carlos.ramirez@demo.roraride.com',
    password: 'DemoDriver123!',
    profile: {
      display_name: 'Carlos Ramirez',
      legal_name: 'Carlos Eduardo Ramirez',
      phone_number: '+1 721 555-0129',
      avatar_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop&crop=face',
      vehicle_type: 'suv',
      vehicle_make: 'Jeep',
      vehicle_model: 'Grand Cherokee',
      vehicle_color: 'Green',
      vehicle_year: 2022,
      license_plate: 'SXM-5678',
      seats: 5,
      languages: ['es', 'en'],
      service_area_tags: ['beaches', 'orient_bay', 'mullet_bay'],
      rating_average: 4.5,
      rating_count: 64,
      bio: 'Adventure-focused driver with a rugged SUV. Great for beach trips and exploring the island.',
      is_rora_pro: false,
      is_accepting_requests: false, // Off duty
    },
  },
  {
    email: 'isabella.chen@demo.roraride.com',
    password: 'DemoDriver123!',
    profile: {
      display_name: 'Isabella Chen',
      legal_name: 'Isabella Wei Chen',
      phone_number: '+1 721 555-0130',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face',
      vehicle_type: 'sedan',
      vehicle_make: 'Tesla',
      vehicle_model: 'Model 3',
      vehicle_color: 'White',
      vehicle_year: 2023,
      license_plate: 'SXM-1234',
      seats: 4,
      languages: ['en', 'zh'],
      service_area_tags: ['philipsburg', 'simpson_bay', 'maho', 'cruise_port'],
      rating_average: 5.0,
      rating_count: 142,
      bio: 'Eco-friendly rides in a fully electric vehicle. Quiet, smooth, and environmentally conscious.',
      is_rora_pro: true,
      is_accepting_requests: true,
    },
  },
]

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Only allow POST
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 405 }
      )
    }

    // Create admin Supabase client with service role
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    // Get Sint Maarten region ID
    const { data: region, error: regionError } = await supabaseAdmin
      .from('regions')
      .select('id')
      .eq('country_code', 'SX')
      .eq('is_active', true)
      .single()

    if (regionError || !region) {
      throw new Error('Sint Maarten region not found. Run migrations first.')
    }

    const results: Array<{ email: string; success: boolean; error?: string }> = []

    for (const driver of DEMO_DRIVERS) {
      try {
        // Check if user already exists
        const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers()
        const existingUser = existingUsers?.users?.find(u => u.email === driver.email)

        let userId: string

        if (existingUser) {
          userId = existingUser.id
          console.log(`Driver ${driver.email} already exists, updating profile...`)
        } else {
          // Create auth user
          const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email: driver.email,
            password: driver.password,
            email_confirm: true,
            user_metadata: {
              role: 'driver',
              display_name: driver.profile.display_name,
            },
          })

          if (authError) {
            throw authError
          }

          userId = authUser.user.id
        }

        // Upsert driver profile
        const { error: profileError } = await supabaseAdmin
          .from('driver_profiles')
          .upsert({
            id: userId,
            region_id: region.id,
            display_name: driver.profile.display_name,
            legal_name: driver.profile.legal_name,
            phone_number: driver.profile.phone_number,
            avatar_url: driver.profile.avatar_url,
            vehicle_type: driver.profile.vehicle_type,
            vehicle_make: driver.profile.vehicle_make,
            vehicle_model: driver.profile.vehicle_model,
            vehicle_color: driver.profile.vehicle_color,
            vehicle_year: driver.profile.vehicle_year,
            license_plate: driver.profile.license_plate,
            seats: driver.profile.seats,
            languages: driver.profile.languages,
            service_area_tags: driver.profile.service_area_tags,
            rating_average: driver.profile.rating_average,
            rating_count: driver.profile.rating_count,
            bio: driver.profile.bio,
            status: 'ACTIVE',
            is_rora_pro: driver.profile.is_rora_pro,
            is_accepting_requests: driver.profile.is_accepting_requests,
            allow_direct_requests: true,
          })

        if (profileError) {
          throw profileError
        }

        // Add government verification
        await supabaseAdmin
          .from('driver_verifications')
          .upsert({
            driver_user_id: userId,
            verification_type: 'GOVERNMENT_REGISTERED',
            verified_at: new Date().toISOString(),
            verification_metadata: {
              permit_number: `SXM-TAXI-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
              verified_date: new Date().toISOString().split('T')[0],
            },
          }, {
            onConflict: 'driver_user_id,verification_type',
          })

        // Add Rora verification for Pro drivers
        if (driver.profile.is_rora_pro) {
          await supabaseAdmin
            .from('driver_verifications')
            .upsert({
              driver_user_id: userId,
              verification_type: 'RORA_VERIFIED',
              verified_at: new Date().toISOString(),
              verification_metadata: {
                background_check: 'passed',
                vehicle_inspection: 'passed',
              },
            }, {
              onConflict: 'driver_user_id,verification_type',
            })
        }

        results.push({ email: driver.email, success: true })
      } catch (error) {
        console.error(`Failed to seed driver ${driver.email}:`, error)
        results.push({ email: driver.email, success: false, error: error.message })
      }
    }

    const successCount = results.filter(r => r.success).length
    const failureCount = results.filter(r => !r.success).length

    return new Response(
      JSON.stringify({
        success: true,
        message: `Seeded ${successCount} drivers, ${failureCount} failed`,
        results,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (error) {
    console.error('Seed demo drivers failed:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
