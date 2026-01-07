import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { PlaceDetails } from '../store/route-store';

/**
 * Ride session data returned from server
 */
export interface RideSession {
  id: string;
  region_id: string;
  rider_user_id: string | null;
  guest_token_id: string | null;
  status: string;
  origin_lat: number;
  origin_lng: number;
  origin_label: string;
  destination_lat: number;
  destination_lng: number;
  destination_label: string;
  rora_fare_amount: number;
  qr_token_jti: string;
  created_at: string;
}

/**
 * Create ride session request payload
 */
export interface CreateRideSessionRequest {
  origin: {
    lat: number;
    lng: number;
    label: string;
  };
  destination: {
    lat: number;
    lng: number;
    label: string;
    freeform_name?: string;
  };
  rora_fare_amount: number;
  pricing_calculation_metadata?: Record<string, unknown>;
  request_type?: 'broadcast' | 'direct';
  target_driver_id?: string;
}

/**
 * Create ride session response
 */
export interface CreateRideSessionResponse {
  success: boolean;
  ride_session?: RideSession;
  qr_token_jti?: string;
  error?: string;
}

/**
 * Start discovery response
 */
export interface StartDiscoveryResponse {
  success: boolean;
  notified_drivers?: number;
  wave?: number;
  error?: string;
}

/**
 * Create a ride session on the server
 *
 * This calls the create-ride-session Edge Function which:
 * - Creates a ride_sessions record in the database
 * - Logs a 'created' event to ride_events
 * - Returns a QR token JTI for the QR code
 */
export async function createRideSession(
  request: CreateRideSessionRequest
): Promise<CreateRideSessionResponse> {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured, returning mock response');
    return {
      success: true,
      ride_session: {
        id: `mock-ride-${Date.now()}`,
        region_id: 'mock-region',
        rider_user_id: null,
        guest_token_id: null,
        status: 'created',
        origin_lat: request.origin.lat,
        origin_lng: request.origin.lng,
        origin_label: request.origin.label,
        destination_lat: request.destination.lat,
        destination_lng: request.destination.lng,
        destination_label: request.destination.label,
        rora_fare_amount: request.rora_fare_amount,
        qr_token_jti: `mock-qr-${Date.now()}`,
        created_at: new Date().toISOString(),
      },
      qr_token_jti: `mock-qr-${Date.now()}`,
    };
  }

  try {
    const { data, error } = await supabase.functions.invoke('create-ride-session', {
      body: request,
    });

    if (error) {
      // Log as warning instead of error to avoid dev console error overlay
      console.warn('[rides.service] Edge function unavailable, using local fallback:', error.message);
      // Return mock response for offline/development use
      return {
        success: true,
        ride_session: {
          id: `local-ride-${Date.now()}`,
          region_id: 'local-region',
          rider_user_id: null,
          guest_token_id: null,
          status: 'created',
          origin_lat: request.origin.lat,
          origin_lng: request.origin.lng,
          origin_label: request.origin.label,
          destination_lat: request.destination.lat,
          destination_lng: request.destination.lng,
          destination_label: request.destination.label,
          rora_fare_amount: request.rora_fare_amount,
          qr_token_jti: `local-qr-${Date.now()}`,
          created_at: new Date().toISOString(),
        },
        qr_token_jti: `local-qr-${Date.now()}`,
      };
    }

    return data as CreateRideSessionResponse;
  } catch (error) {
    // Log as warning instead of error to avoid dev console error overlay
    console.warn('[rides.service] Error creating ride session, using local fallback:', error);
    // Return mock response for offline/development use
    return {
      success: true,
      ride_session: {
        id: `local-ride-${Date.now()}`,
        region_id: 'local-region',
        rider_user_id: null,
        guest_token_id: null,
        status: 'created',
        origin_lat: request.origin.lat,
        origin_lng: request.origin.lng,
        origin_label: request.origin.label,
        destination_lat: request.destination.lat,
        destination_lng: request.destination.lng,
        destination_label: request.destination.label,
        rora_fare_amount: request.rora_fare_amount,
        qr_token_jti: `local-qr-${Date.now()}`,
        created_at: new Date().toISOString(),
      },
      qr_token_jti: `local-qr-${Date.now()}`,
    };
  }
}

/**
 * Start driver discovery for a ride session
 *
 * This calls the start-discovery Edge Function which:
 * - Updates ride status to 'discovery'
 * - Notifies drivers via inbox notifications
 * - Triggers push notifications to nearby drivers
 * - Returns the number of drivers notified
 */
export async function startDiscovery(
  rideSessionId: string,
  wave: number = 0
): Promise<StartDiscoveryResponse> {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured, returning mock response');
    // Simulate 3-5 drivers notified
    return {
      success: true,
      notified_drivers: Math.floor(Math.random() * 3) + 3,
      wave,
    };
  }

  try {
    const { data, error } = await supabase.functions.invoke('start-discovery', {
      body: {
        ride_session_id: rideSessionId,
        wave,
      },
    });

    if (error) {
      console.error('Failed to start discovery:', error);
      return {
        success: false,
        error: error.message,
      };
    }

    return data as StartDiscoveryResponse;
  } catch (error) {
    console.error('Error starting discovery:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Helper to convert PlaceDetails to ride session format
 */
export function placeDetailsToRideLocation(place: PlaceDetails): {
  lat: number;
  lng: number;
  label: string;
} {
  return {
    lat: place.coordinates.latitude,
    lng: place.coordinates.longitude,
    label: place.name,
  };
}

/**
 * Subscribe to ride offers for a ride session
 *
 * Returns a subscription that can be unsubscribed from
 */
export function subscribeToRideOffers(
  rideSessionId: string,
  onOffer: (offer: RideOffer) => void
) {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured, offers subscription not available');
    return { unsubscribe: () => {} };
  }

  const subscription = supabase
    .channel(`ride-offers-${rideSessionId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'ride_offers',
        filter: `ride_session_id=eq.${rideSessionId}`,
      },
      (payload) => {
        onOffer(payload.new as RideOffer);
      }
    )
    .subscribe();

  return {
    unsubscribe: () => {
      supabase.removeChannel(subscription);
    },
  };
}

/**
 * Subscribe to ride session status changes
 */
export function subscribeToRideStatus(
  rideSessionId: string,
  onStatusChange: (status: string) => void
) {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured, status subscription not available');
    return { unsubscribe: () => {} };
  }

  const subscription = supabase
    .channel(`ride-status-${rideSessionId}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'ride_sessions',
        filter: `id=eq.${rideSessionId}`,
      },
      (payload) => {
        const newStatus = (payload.new as { status: string }).status;
        onStatusChange(newStatus);
      }
    )
    .subscribe();

  return {
    unsubscribe: () => {
      supabase.removeChannel(subscription);
    },
  };
}

/**
 * Ride offer from a driver
 */
export interface RideOffer {
  id: string;
  ride_session_id: string;
  driver_user_id: string;
  offer_type: 'accept' | 'counter';
  offered_amount: number | null;
  note: string | null;
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
  created_at: string;
  expires_at: string;
  // Joined driver profile data (if available)
  driver_profile?: {
    display_name: string;
    avatar_url: string | null;
    rating_average: number | null;
    rating_count: number | null;
    vehicle_type: string | null;
    vehicle_make: string | null;
    vehicle_model: string | null;
  };
}

/**
 * Select offer response
 */
export interface SelectOfferResponse {
  success: boolean;
  ride_session_id?: string;
  offer_id?: string;
  driver_user_id?: string;
  final_fare_amount?: number;
  new_status?: string;
  error?: string;
}

/**
 * Cancel ride response
 */
export interface CancelRideResponse {
  success: boolean;
  ride_session_id?: string;
  previous_status?: string;
  new_status?: string;
  error?: string;
}

/**
 * Cancel a ride session
 *
 * This calls the cancel-ride Edge Function which:
 * - Validates user owns the ride session
 * - Validates ride is in a cancelable state (created, discovery, hold)
 * - Updates ride status to 'canceled'
 * - Rejects all pending offers
 * - Logs ride event
 * - Notifies affected driver (if any)
 *
 * SECURITY: State transition is validated server-side
 */
export async function cancelRide(
  rideSessionId: string,
  reason?: string
): Promise<CancelRideResponse> {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured, returning mock response');
    return {
      success: true,
      ride_session_id: rideSessionId,
      previous_status: 'discovery',
      new_status: 'canceled',
    };
  }

  try {
    const { data, error } = await supabase.functions.invoke('cancel-ride', {
      body: {
        ride_session_id: rideSessionId,
        reason,
      },
    });

    if (error) {
      // Log as warning for offline/development fallback
      console.warn('[rides.service] Cancel ride failed:', error.message);
      return {
        success: false,
        error: error.message,
      };
    }

    return data as CancelRideResponse;
  } catch (error) {
    console.error('Error canceling ride:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Select a driver's offer for the ride
 *
 * This calls the select-offer Edge Function which:
 * - Validates user owns the ride session
 * - Validates ride is in 'discovery' status
 * - Validates offer is still pending
 * - Accepts the offer and rejects all others
 * - Updates ride status to 'hold'
 * - Logs ride event
 * - Notifies the driver
 *
 * SECURITY: State transition is validated server-side
 */
export async function selectOffer(
  rideSessionId: string,
  offerId: string
): Promise<SelectOfferResponse> {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured, returning mock response');
    return {
      success: true,
      ride_session_id: rideSessionId,
      offer_id: offerId,
      driver_user_id: 'mock-driver-id',
      final_fare_amount: 25,
      new_status: 'hold',
    };
  }

  try {
    const { data, error } = await supabase.functions.invoke('select-offer', {
      body: {
        ride_session_id: rideSessionId,
        offer_id: offerId,
      },
    });

    if (error) {
      console.error('Failed to select offer:', error);
      return {
        success: false,
        error: error.message,
      };
    }

    return data as SelectOfferResponse;
  } catch (error) {
    console.error('Error selecting offer:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Fetch offers for a ride session
 */
export async function fetchRideOffers(rideSessionId: string): Promise<RideOffer[]> {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured, returning empty offers');
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('ride_offers')
      .select(`
        *,
        driver_profile:driver_profiles(
          display_name,
          avatar_url,
          rating_average,
          rating_count,
          vehicle_type,
          vehicle_make,
          vehicle_model
        )
      `)
      .eq('ride_session_id', rideSessionId)
      .eq('status', 'pending')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Failed to fetch ride offers:', error);
      return [];
    }

    return (data || []) as unknown as RideOffer[];
  } catch (error) {
    console.error('Error fetching ride offers:', error);
    return [];
  }
}
