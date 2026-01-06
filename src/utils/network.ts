/**
 * Network connectivity utilities for offline detection and fallback handling
 */

import * as Network from 'expo-network';

/**
 * Check if device is currently online
 * @returns Promise<boolean> - true if connected, false otherwise
 */
export async function isOnline(): Promise<boolean> {
  try {
    const networkState = await Network.getNetworkStateAsync();
    return networkState.isConnected === true && networkState.isInternetReachable === true;
  } catch (error) {
    console.error('[network] Failed to check network status:', error);
    // Assume offline on error
    return false;
  }
}

/**
 * Check if device is connected to WiFi (better for map loading)
 * @returns Promise<boolean> - true if connected to WiFi
 */
export async function isWiFiConnected(): Promise<boolean> {
  try {
    const networkState = await Network.getNetworkStateAsync();
    return networkState.type === Network.NetworkStateType.WIFI && networkState.isConnected === true;
  } catch (error) {
    console.error('[network] Failed to check WiFi status:', error);
    return false;
  }
}

/**
 * Get network connection type
 * @returns Promise<string> - Connection type (wifi, cellular, none, unknown)
 */
export async function getConnectionType(): Promise<string> {
  try {
    const networkState = await Network.getNetworkStateAsync();

    if (!networkState.isConnected) {
      return 'none';
    }

    switch (networkState.type) {
      case Network.NetworkStateType.WIFI:
        return 'wifi';
      case Network.NetworkStateType.CELLULAR:
        return 'cellular';
      case Network.NetworkStateType.ETHERNET:
        return 'ethernet';
      default:
        return 'unknown';
    }
  } catch (error) {
    console.error('[network] Failed to get connection type:', error);
    return 'unknown';
  }
}

/**
 * Execute a network-dependent operation with offline fallback
 * @param operation - Async function to execute
 * @param fallback - Optional fallback function to execute if offline
 * @returns Promise<T> - Result from operation or fallback
 */
export async function withNetworkFallback<T>(
  operation: () => Promise<T>,
  fallback?: () => Promise<T> | T
): Promise<T> {
  const online = await isOnline();

  if (!online) {
    console.warn('[network] Device is offline, using fallback');
    if (fallback) {
      return fallback();
    }
    throw new Error('No internet connection');
  }

  return operation();
}

/**
 * Get user-friendly connection status message
 * @returns Promise<string> - User-friendly status message
 */
export async function getConnectionStatusMessage(): Promise<string> {
  const online = await isOnline();

  if (!online) {
    return 'No internet connection';
  }

  const connectionType = await getConnectionType();

  switch (connectionType) {
    case 'wifi':
      return 'Connected via WiFi';
    case 'cellular':
      return 'Connected via cellular';
    case 'ethernet':
      return 'Connected via Ethernet';
    default:
      return 'Connected';
  }
}
