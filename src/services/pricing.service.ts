/**
 * Pricing Service
 *
 * Client-side service for fare calculations
 * Calls the calculate-fare Edge Function
 */

import { supabase } from '../lib/supabase';
import type { CalculateFareRequest, CalculateFareResponse } from '../types/pricing';
import { calculateHaversineDistance } from '../utils/geo';
import { HAVERSINE_MULTIPLIER, DEFAULT_BASE_FARE, DEFAULT_PER_KM_RATE } from '../utils/constants';

/**
 * Calculate fare for a route using the Edge Function
 */
export const calculateFare = async (
  request: CalculateFareRequest
): Promise<CalculateFareResponse> => {
  try {
    const { data, error } = await supabase.functions.invoke('calculate-fare', {
      body: request,
    });

    if (error) {
      console.error('Fare calculation failed:', error);
      throw error;
    }

    if (!data?.amount) {
      throw new Error('Invalid fare calculation response');
    }

    return data as CalculateFareResponse;
  } catch (error) {
    console.error('Fare calculation error:', error);
    throw error;
  }
};

/**
 * Calculate offline fare estimate using haversine distance
 * Used as fallback when network is unavailable
 */
export const calculateOfflineFareEstimate = (
  originLat: number,
  originLng: number,
  destinationLat: number,
  destinationLng: number
): number => {
  const straightLineKm = calculateHaversineDistance(
    originLat,
    originLng,
    destinationLat,
    destinationLng
  );

  const estimatedDistanceKm = straightLineKm * HAVERSINE_MULTIPLIER;
  const fare = DEFAULT_BASE_FARE + estimatedDistanceKm * DEFAULT_PER_KM_RATE;

  return Math.round(fare * 100) / 100; // Round to 2 decimal places
};

/**
 * Format fare amount for display
 */
export const formatFare = (amount: number, currency: string = 'USD'): string => {
  if (currency === 'USD') {
    return `$${amount.toFixed(2)}`;
  }
  return `${amount.toFixed(2)} ${currency}`;
};
