import React from 'react';
import { StyleSheet, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import Animated, {
  interpolate,
  useAnimatedStyle,
  type SharedValue,
} from 'react-native-reanimated';

import { Text } from '@/src/ui/primitives/Text';
import { Pressable } from '@/src/ui/primitives/Pressable';
import { Button } from '@/src/ui/components/Button';
import { RouteHeader } from '../shared/RouteHeader';
import { useRideSheetStore } from '../../store/ride-sheet-store';
import { formatPrice } from '@/src/utils/pricing';
import { colors } from '@/src/ui/tokens/colors';
import { space } from '@/src/ui/tokens/spacing';
import { radius } from '@/src/ui/tokens/radius';

type Props = {
  /** Animated sheet index for content transitions */
  animatedIndex: SharedValue<number>;
  /** Current snap point index */
  currentIndex: number;
};

/**
 * RideSheetQR - Content for QR_READY state
 *
 * Snap points:
 * - Peek (280px): QR code + instruction text
 * - Expanded (55%): QR + route summary + "Look for Drivers" CTA + Cancel
 */
export function RideSheetQR({ animatedIndex, currentIndex }: Props) {
  const data = useRideSheetStore((s) => s.data);
  const startDiscovery = useRideSheetStore((s) => s.startDiscovery);
  const cancel = useRideSheetStore((s) => s.cancel);

  // Expanded content fades in
  const expandedContentStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      animatedIndex.value,
      [0, 0.5, 1],
      [0, 0, 1],
      'clamp'
    );
    return { opacity };
  }, []);

  const handleLookForDrivers = async () => {
    await startDiscovery();
  };

  const handleCancel = () => {
    cancel();
  };

  // Generate QR data - session ID or token
  const qrData = data.qrTokenJti || data.rideSessionId || '';

  return (
    <View style={styles.container}>
      {/* QR Code section (always visible) */}
      <View style={styles.qrSection}>
        <Text style={styles.title}>Your Ride Code</Text>

        <View style={styles.qrContainer}>
          {qrData ? (
            <QRCode
              value={qrData}
              size={180}
              color="#000000"
              backgroundColor="#FFFFFF"
            />
          ) : (
            <View style={styles.qrPlaceholder}>
              <Text muted>Generating...</Text>
            </View>
          )}
        </View>

        <Text variant="caption" style={styles.instruction}>
          Show this to your driver to start the ride
        </Text>
      </View>

      {/* Expanded content */}
      <Animated.View style={[styles.expandedContent, expandedContentStyle]}>
        {/* Route summary */}
        {data.origin && data.destination && (
          <View style={styles.routeSummary}>
            <RouteHeader
              originLabel={data.origin.name}
              destinationLabel={data.destination.name}
              compact
            />
            {data.fareAmount && (
              <Text style={styles.fareText}>
                {formatPrice(data.fareAmount)}
              </Text>
            )}
          </View>
        )}

        {/* CTA section */}
        <View style={styles.ctaSection}>
          <Button
            label="Look for Drivers"
            onPress={handleLookForDrivers}
            loading={data.isStartingDiscovery}
          />
          <Pressable onPress={handleCancel} style={styles.cancelButton}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </Pressable>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  qrSection: {
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: space[4],
  },
  qrContainer: {
    backgroundColor: colors.surface,
    padding: space[4],
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  qrPlaceholder: {
    width: 180,
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.skeleton,
    borderRadius: radius.md,
  },
  instruction: {
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: space[4],
  },
  expandedContent: {
    flex: 1,
    marginTop: space[5],
  },
  routeSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: space[3],
    paddingHorizontal: space[4],
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  fareText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
  },
  ctaSection: {
    gap: space[3],
    marginTop: 'auto',
    paddingTop: space[4],
  },
  cancelButton: {
    alignItems: 'center',
    paddingVertical: space[3],
  },
  cancelButtonText: {
    color: colors.textMuted,
    fontWeight: '600',
  },
});
