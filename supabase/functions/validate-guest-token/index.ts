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
    const { token } = await req.json()

    if (!token) {
      return new Response(
        JSON.stringify({ valid: false, error: 'Token is required' }),
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

    // Fetch guest token from database
    const { data: guestToken, error } = await supabase
      .from('guest_tokens')
      .select('*')
      .eq('token', token)
      .single()

    if (error || !guestToken) {
      return new Response(
        JSON.stringify({ valid: false, error: 'Token not found' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 404,
        }
      )
    }

    // Check if token is expired
    const now = new Date()
    const expiresAt = new Date(guestToken.expires_at)

    if (now > expiresAt) {
      return new Response(
        JSON.stringify({ valid: false, error: 'Token expired' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401,
        }
      )
    }

    // Check if token has been claimed
    if (guestToken.claimed_by_user_id) {
      return new Response(
        JSON.stringify({
          valid: false,
          error: 'Token has been claimed',
          claimed_by_user_id: guestToken.claimed_by_user_id,
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401,
        }
      )
    }

    // Update last_used_at
    await supabase
      .from('guest_tokens')
      .update({ last_used_at: new Date().toISOString() })
      .eq('id', guestToken.id)

    return new Response(
      JSON.stringify({
        valid: true,
        token_id: guestToken.id,
        expires_at: guestToken.expires_at,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Token validation failed:', error)
    return new Response(
      JSON.stringify({
        valid: false,
        error: error.message,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})
