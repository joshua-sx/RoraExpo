import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { guestToken, userId } = await req.json()

    if (!guestToken || !userId) {
      return new Response(
        JSON.stringify({ error: 'Guest token and user ID are required' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      )
    }

    // Create Supabase client with service role
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Find the guest token record
    const { data: guestTokenRecord, error: tokenError } = await supabase
      .from('guest_tokens')
      .select('id, claimed_by_user_id')
      .eq('token', guestToken)
      .single()

    if (tokenError || !guestTokenRecord) {
      return new Response(
        JSON.stringify({ error: 'Guest token not found' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 404,
        }
      )
    }

    // Check if already claimed
    if (guestTokenRecord.claimed_by_user_id) {
      return new Response(
        JSON.stringify({
          error: 'Guest token already claimed',
          claimed_by: guestTokenRecord.claimed_by_user_id,
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 409,
        }
      )
    }

    // Find all ride sessions associated with this guest token
    const { data: rideSessions, error: ridesError } = await supabase
      .from('ride_sessions')
      .select('id')
      .eq('guest_token_id', guestTokenRecord.id)

    if (ridesError) {
      console.error('Failed to fetch guest rides:', ridesError)
      throw ridesError
    }

    const rideCount = rideSessions?.length || 0

    if (rideCount > 0) {
      // Migrate rides to authenticated user
      const { error: updateError } = await supabase
        .from('ride_sessions')
        .update({
          rider_user_id: userId,
          guest_token_id: null,
        })
        .eq('guest_token_id', guestTokenRecord.id)

      if (updateError) {
        console.error('Failed to migrate rides:', updateError)
        throw updateError
      }
    }

    // Mark guest token as claimed
    const { error: claimError } = await supabase
      .from('guest_tokens')
      .update({
        claimed_by_user_id: userId,
        claimed_at: new Date().toISOString(),
      })
      .eq('id', guestTokenRecord.id)

    if (claimError) {
      console.error('Failed to mark token as claimed:', claimError)
      throw claimError
    }

    return new Response(
      JSON.stringify({
        success: true,
        migratedRides: rideCount,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Guest ride migration failed:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})
