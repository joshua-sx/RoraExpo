import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const EARTH_RADIUS_KM = 6371

/**
 * Calculate haversine distance between two points
 */
function calculateHaversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const toRadians = (degrees: number) => degrees * (Math.PI / 180)

  const dLat = toRadians(lat2 - lat1)
  const dLng = toRadians(lng2 - lng1)

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return EARTH_RADIUS_KM * c
}

/**
 * Check if a point is inside a circular zone
 */
function isPointInZone(
  pointLat: number,
  pointLng: number,
  centerLat: number,
  centerLng: number,
  radiusMeters: number
): boolean {
  const distanceKm = calculateHaversineDistance(pointLat, pointLng, centerLat, centerLng)
  const distanceMeters = distanceKm * 1000
  return distanceMeters <= radiusMeters
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { origin, destination, region_id } = await req.json()

    if (!origin?.lat || !origin?.lng || !destination?.lat || !destination?.lng) {
      return new Response(
        JSON.stringify({ error: 'Origin and destination coordinates are required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get region (default to Sint Maarten if not provided)
    let regionId = region_id
    if (!regionId) {
      const { data: region } = await supabase
        .from('regions')
        .select('id')
        .eq('country_code', 'SX')
        .eq('is_active', true)
        .single()
      regionId = region?.id
    }

    if (!regionId) {
      throw new Error('Region not found')
    }

    // Fetch all active pricing zones for the region
    const { data: zones } = await supabase
      .from('pricing_zones')
      .select('*')
      .eq('region_id', regionId)
      .eq('is_active', true)

    // Check if origin or destination is in a zone
    const originZone = zones?.find(zone =>
      isPointInZone(
        origin.lat,
        origin.lng,
        zone.center_lat,
        zone.center_lng,
        zone.radius_meters
      )
    )

    const destinationZone = zones?.find(zone =>
      isPointInZone(
        destination.lat,
        destination.lng,
        zone.center_lat,
        zone.center_lng,
        zone.radius_meters
      )
    )

    // Try to find a fixed fare for this zone combination
    if (originZone || destinationZone) {
      const { data: fixedFare } = await supabase
        .from('pricing_fixed_fares')
        .select('*')
        .eq('region_id', regionId)
        .eq('is_active', true)
        .or(`and(origin_zone_id.eq.${originZone?.id || 'null'},destination_zone_id.eq.${destinationZone?.id || 'null'}),` +
            `and(origin_zone_id.eq.${destinationZone?.id || 'null'},destination_zone_id.eq.${originZone?.id || 'null'})`)
        .single()

      if (fixedFare) {
        // Use fixed fare
        return new Response(
          JSON.stringify({
            amount: fixedFare.amount,
            pricing_rule_version_id: null,
            calculation_metadata: {
              method: 'zone_fixed',
              origin_zone_id: originZone?.id,
              origin_zone_name: originZone?.zone_name,
              destination_zone_id: destinationZone?.id,
              destination_zone_name: destinationZone?.zone_name,
              fixed_fare_id: fixedFare.id,
              total: fixedFare.amount,
              calculated_at: new Date().toISOString(),
            },
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        )
      }
    }

    // No fixed fare found, use distance-based pricing
    // Calculate straight-line distance with multiplier (1.3x for road routing approximation)
    const straightLineKm = calculateHaversineDistance(
      origin.lat,
      origin.lng,
      destination.lat,
      destination.lng
    )
    const estimatedDistanceKm = straightLineKm * 1.3

    // Get active pricing rule
    const { data: pricingRule } = await supabase
      .from('pricing_rule_versions')
      .select('*')
      .eq('region_id', regionId)
      .eq('is_active', true)
      .single()

    if (!pricingRule) {
      throw new Error('No active pricing rule found for region')
    }

    // Calculate fare: base fare + (distance * per_km_rate)
    const baseFare = pricingRule.base_fare
    const perKmRate = pricingRule.per_km_rate
    const distanceFare = estimatedDistanceKm * perKmRate
    let total = baseFare + distanceFare

    // Check for time-based modifiers (night, peak)
    const currentHour = new Date().getUTCHours()
    const { data: modifiers } = await supabase
      .from('pricing_modifiers')
      .select('*')
      .eq('region_id', regionId)
      .eq('enabled', true)

    const appliedModifiers: any[] = []

    for (const modifier of modifiers || []) {
      const config = modifier.threshold_config
      let shouldApply = false

      // Check night modifier
      if (modifier.modifier_type === 'night' && config?.start_hour !== undefined && config?.end_hour !== undefined) {
        const startHour = config.start_hour
        const endHour = config.end_hour

        if (startHour > endHour) {
          // Spans midnight (e.g., 22:00 to 6:00)
          shouldApply = currentHour >= startHour || currentHour < endHour
        } else {
          shouldApply = currentHour >= startHour && currentHour < endHour
        }
      }

      // Check peak modifier
      if (modifier.modifier_type === 'peak' && config?.days && config?.start_hour !== undefined) {
        const dayNames = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']
        const currentDay = dayNames[new Date().getUTCDay()]
        const dayMatch = config.days.includes(currentDay)
        const hourMatch = currentHour >= config.start_hour && currentHour < config.end_hour
        shouldApply = dayMatch && hourMatch
      }

      if (shouldApply) {
        if (modifier.modifier_application === 'multiply') {
          total *= modifier.modifier_value
        } else if (modifier.modifier_application === 'add') {
          total += modifier.modifier_value
        }

        appliedModifiers.push({
          type: modifier.modifier_type,
          name: modifier.modifier_name,
          value: modifier.modifier_value,
          application: modifier.modifier_application,
        })
      }
    }

    return new Response(
      JSON.stringify({
        amount: Math.round(total * 100) / 100, // Round to 2 decimal places
        pricing_rule_version_id: pricingRule.id,
        calculation_metadata: {
          method: 'distance_fallback',
          distance_km: estimatedDistanceKm,
          straight_line_km: straightLineKm,
          multiplier: 1.3,
          base_fare: baseFare,
          per_km_rate: perKmRate,
          distance_fare: distanceFare,
          modifiers: appliedModifiers,
          subtotal: baseFare + distanceFare,
          total: Math.round(total * 100) / 100,
          calculated_at: new Date().toISOString(),
          pricing_rule_version_id: pricingRule.id,
        },
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (error) {
    console.error('Fare calculation failed:', error)
    return new Response(
      JSON.stringify({
        error: error.message,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
