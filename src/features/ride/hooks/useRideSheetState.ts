import { useMemo } from 'react';
import { useRideSheetStore, type RideSheetState } from '../store/ride-sheet-store';
import { calculatePriceLabel } from '@/src/types/pricing';

/**
 * Derived state helpers for RideSheet components
 *
 * These computed values simplify component logic by pre-calculating
 * common conditions and formatted values.
 */
export function useRideSheetState() {
  const state = useRideSheetStore((s) => s.state);
  const data = useRideSheetStore((s) => s.data);

  // -------------------------------------------------------------------------
  // Loading states
  // -------------------------------------------------------------------------

  const isLoading = useMemo(() => {
    return (
      data.isGeneratingQR ||
      data.isStartingDiscovery ||
      data.isConfirmingRide
    );
  }, [data.isGeneratingQR, data.isStartingDiscovery, data.isConfirmingRide]);

  const isWaitingForOffers = useMemo(() => {
    return state === 'DISCOVERING' && data.offers.length === 0;
  }, [state, data.offers.length]);

  // -------------------------------------------------------------------------
  // Route state
  // -------------------------------------------------------------------------

  const hasRoute = useMemo(() => {
    return data.origin !== null && data.destination !== null;
  }, [data.origin, data.destination]);

  const hasRouteData = useMemo(() => {
    return data.routeData !== null;
  }, [data.routeData]);

  const hasFare = useMemo(() => {
    return data.fareAmount !== null;
  }, [data.fareAmount]);

  // -------------------------------------------------------------------------
  // Session state
  // -------------------------------------------------------------------------

  const hasSession = useMemo(() => {
    return data.rideSessionId !== null;
  }, [data.rideSessionId]);

  const hasQRCode = useMemo(() => {
    return data.qrTokenJti !== null;
  }, [data.qrTokenJti]);

  // -------------------------------------------------------------------------
  // Offers state
  // -------------------------------------------------------------------------

  const offerCount = useMemo(() => {
    return data.offers.length;
  }, [data.offers.length]);

  const hasOffers = useMemo(() => {
    return data.offers.length > 0;
  }, [data.offers.length]);

  const bestOffer = useMemo(() => {
    if (data.offers.length === 0) return null;
    // Offers are already sorted by price (lowest first)
    return data.offers[0];
  }, [data.offers]);

  const bestPrice = useMemo(() => {
    return bestOffer?.offered_amount ?? null;
  }, [bestOffer]);

  /**
   * Get price label for an offer amount
   * Returns 'good_deal' | 'normal' | 'pricier'
   */
  const getPriceLabel = useMemo(() => {
    return (offerAmount: number) => {
      if (!data.fareAmount) return 'normal';
      return calculatePriceLabel(offerAmount, data.fareAmount);
    };
  }, [data.fareAmount]);

  // -------------------------------------------------------------------------
  // Discovery state
  // -------------------------------------------------------------------------

  const discoveryDurationMs = useMemo(() => {
    if (!data.discoveryStartedAt) return 0;
    return Date.now() - new Date(data.discoveryStartedAt).getTime();
  }, [data.discoveryStartedAt]);

  const showExpandPrompt = useMemo(() => {
    // Show expand prompt after 10 minutes with no offers
    const TEN_MINUTES = 10 * 60 * 1000;
    return (
      state === 'DISCOVERING' &&
      data.offers.length === 0 &&
      discoveryDurationMs >= TEN_MINUTES
    );
  }, [state, data.offers.length, discoveryDurationMs]);

  // -------------------------------------------------------------------------
  // UI state
  // -------------------------------------------------------------------------

  const canCancel = useMemo(() => {
    return state !== 'MATCHED' && state !== 'IDLE';
  }, [state]);

  const canEditRoute = useMemo(() => {
    return state === 'ROUTE_SET' || state === 'QR_READY';
  }, [state]);

  const showMap = useMemo(() => {
    // Map is always visible except in IDLE where we show user location only
    return true;
  }, []);

  const showRouteOnMap = useMemo(() => {
    return hasRouteData && state !== 'IDLE';
  }, [hasRouteData, state]);

  const showDriversOnMap = useMemo(() => {
    return state === 'DISCOVERING' || state === 'OFFERS_RECEIVED';
  }, [state]);

  // -------------------------------------------------------------------------
  // Formatted values
  // -------------------------------------------------------------------------

  const formattedFare = useMemo(() => {
    if (!data.fareAmount) return null;
    return `$${data.fareAmount.toFixed(0)}`;
  }, [data.fareAmount]);

  const formattedBestPrice = useMemo(() => {
    if (!bestPrice) return null;
    return `$${bestPrice.toFixed(0)}`;
  }, [bestPrice]);

  const routeSummary = useMemo(() => {
    if (!data.routeData) return null;
    const { distance, duration } = data.routeData;
    const distanceMi = (distance * 0.621371).toFixed(1); // km to miles
    return `${Math.round(duration)} min · ${distanceMi} mi`;
  }, [data.routeData]);

  const fullRouteSummary = useMemo(() => {
    if (!data.fareAmount || !data.routeData) return null;
    const { distance, duration } = data.routeData;
    const distanceMi = (distance * 0.621371).toFixed(1);
    return `$${data.fareAmount.toFixed(0)} · ${Math.round(duration)} min · ${distanceMi} mi`;
  }, [data.fareAmount, data.routeData]);

  // -------------------------------------------------------------------------
  // Snap points by state
  // -------------------------------------------------------------------------

  const snapPoints = useMemo((): (number | string)[] => {
    switch (state) {
      case 'IDLE':
        return [120, '55%'];
      case 'ROUTE_SET':
        return [100, 200, '65%'];
      case 'QR_READY':
        return [280, '55%'];
      case 'DISCOVERING':
        return [120, 200, '45%'];
      case 'OFFERS_RECEIVED':
        return [140, 320, '75%'];
      case 'CONFIRMING':
        return ['55%'];
      case 'MATCHED':
        return [200, '45%'];
      default:
        return ['55%'];
    }
  }, [state]);

  const defaultSnapIndex = useMemo((): number => {
    switch (state) {
      case 'IDLE':
        return 0; // Collapsed
      case 'ROUTE_SET':
        return 2; // Expanded (show CTA)
      case 'QR_READY':
        return 0; // Peek (show QR)
      case 'DISCOVERING':
        return 1; // Peek (show status)
      case 'OFFERS_RECEIVED':
        return 1; // Peek (show top offers)
      case 'CONFIRMING':
        return 0; // Single snap point
      case 'MATCHED':
        return 0; // Peek (show driver info)
      default:
        return 0;
    }
  }, [state]);

  // -------------------------------------------------------------------------
  // Error state
  // -------------------------------------------------------------------------

  const hasError = useMemo(() => {
    return data.error !== null;
  }, [data.error]);

  const errorMessage = useMemo(() => {
    return data.error;
  }, [data.error]);

  // -------------------------------------------------------------------------
  // Return all derived state
  // -------------------------------------------------------------------------

  return {
    // Raw state
    state,
    data,

    // Loading
    isLoading,
    isWaitingForOffers,

    // Route
    hasRoute,
    hasRouteData,
    hasFare,

    // Session
    hasSession,
    hasQRCode,

    // Offers
    offerCount,
    hasOffers,
    bestOffer,
    bestPrice,
    getPriceLabel,

    // Discovery
    discoveryDurationMs,
    showExpandPrompt,

    // UI
    canCancel,
    canEditRoute,
    showMap,
    showRouteOnMap,
    showDriversOnMap,

    // Formatted
    formattedFare,
    formattedBestPrice,
    routeSummary,
    fullRouteSummary,

    // Snap points
    snapPoints,
    defaultSnapIndex,

    // Error
    hasError,
    errorMessage,
  };
}

/**
 * Type for the return value of useRideSheetState
 */
export type RideSheetDerivedState = ReturnType<typeof useRideSheetState>;

/**
 * Helper to check if we're in a "pre-discovery" state
 * (user hasn't started looking for drivers yet)
 */
export function isPreDiscoveryState(state: RideSheetState): boolean {
  return state === 'IDLE' || state === 'ROUTE_SET' || state === 'QR_READY';
}

/**
 * Helper to check if we're in an "active search" state
 * (actively looking for or reviewing offers)
 */
export function isActiveSearchState(state: RideSheetState): boolean {
  return state === 'DISCOVERING' || state === 'OFFERS_RECEIVED' || state === 'CONFIRMING';
}

/**
 * Helper to check if we're in a "committed" state
 * (ride is confirmed and in progress)
 */
export function isCommittedState(state: RideSheetState): boolean {
  return state === 'MATCHED';
}
