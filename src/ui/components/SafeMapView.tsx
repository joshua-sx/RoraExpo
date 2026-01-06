/**
 * SafeMapView - MapView wrapper with error boundary, loading state, and offline detection
 */

import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import MapView, { MapViewProps, PROVIDER_GOOGLE } from 'react-native-maps';
import { MapErrorBoundary } from './MapErrorBoundary';
import { isOnline } from '@/src/utils/network';
import { Colors } from '@/src/constants/design-tokens';
import { ThemedText } from './themed-text';
import { Ionicons } from '@expo/vector-icons';

interface SafeMapViewProps extends MapViewProps {
  /** Show loading indicator while map initializes */
  showLoadingState?: boolean;
  /** Custom loading message */
  loadingMessage?: string;
  /** Check network connectivity before loading */
  checkConnectivity?: boolean;
  /** Callback when map fails to load */
  onLoadError?: (error: Error) => void;
  /** Callback when map successfully loads */
  onLoadSuccess?: () => void;
}

/**
 * SafeMapView - Production-ready MapView with built-in:
 * - Error boundary with retry
 * - Loading state
 * - Offline detection
 * - Consistent Google Maps provider
 */
export const SafeMapView = React.forwardRef<MapView, SafeMapViewProps>(
  (
    {
      showLoadingState = true,
      loadingMessage = 'Loading map...',
      checkConnectivity = true,
      onMapReady,
      onLoadError,
      onLoadSuccess,
      provider = PROVIDER_GOOGLE,
      ...mapProps
    },
    ref
  ) => {
    const [isLoading, setIsLoading] = useState(showLoadingState);
    const [isOffline, setIsOffline] = useState(false);
    const [mapKey, setMapKey] = useState(0);

    // Check connectivity on mount
    useEffect(() => {
      if (checkConnectivity) {
        checkNetworkStatus();
      }
    }, [checkConnectivity]);

    const checkNetworkStatus = useCallback(async () => {
      const online = await isOnline();
      setIsOffline(!online);

      if (!online) {
        console.warn('[SafeMapView] Device is offline');
        onLoadError?.(new Error('No internet connection'));
      }
    }, [onLoadError]);

    const handleMapReady = useCallback(() => {
      setIsLoading(false);
      onLoadSuccess?.();
      onMapReady?.();
    }, [onMapReady, onLoadSuccess]);

    const handleRetry = useCallback(() => {
      console.log('[SafeMapView] Retrying map load');
      setIsLoading(true);
      setMapKey((prev) => prev + 1);
      checkNetworkStatus();
    }, [checkNetworkStatus]);

    // Show offline warning if no connectivity
    if (isOffline && checkConnectivity) {
      return (
        <View style={styles.offlineContainer}>
          <Ionicons name="cloud-offline-outline" size={48} color={Colors.textSecondary} />
          <ThemedText style={styles.offlineTitle}>No internet connection</ThemedText>
          <ThemedText style={styles.offlineMessage}>
            Maps require an active internet connection
          </ThemedText>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <MapErrorBoundary onRetry={handleRetry}>
          <MapView
            key={mapKey}
            ref={ref}
            provider={provider}
            onMapReady={handleMapReady}
            showsCompass={false}
            showsMyLocationButton={false}
            {...mapProps}
          />
        </MapErrorBoundary>

        {/* Loading overlay */}
        {isLoading && showLoadingState && (
          <View style={styles.loadingOverlay}>
            <View style={styles.loadingCard}>
              <ActivityIndicator size="large" color={Colors.primary} />
              <ThemedText style={styles.loadingText}>{loadingMessage}</ThemedText>
            </View>
          </View>
        )}
      </View>
    );
  }
);

SafeMapView.displayName = 'SafeMapView';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    minWidth: 200,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  offlineContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    padding: 32,
  },
  offlineTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  offlineMessage: {
    fontSize: 14,
    textAlign: 'center',
    color: Colors.textSecondary,
    lineHeight: 20,
  },
});
