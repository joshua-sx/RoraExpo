import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, {
  interpolate,
  useAnimatedStyle,
  type SharedValue,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

import { Text } from '@/src/ui/primitives/Text';
import { Pressable } from '@/src/ui/primitives/Pressable';
import { Button } from '@/src/ui/components/Button';
import { RouteHeader } from '../shared/RouteHeader';
import { FareCard, getPricingMethodLabel } from '../shared/FareCard';
import { useRideSheetStore } from '../../store/ride-sheet-store';
import { formatPrice, formatDistance, formatDuration } from '@/src/utils/pricing';
import { colors } from '@/src/ui/tokens/colors';
import { space } from '@/src/ui/tokens/spacing';
import { radius } from '@/src/ui/tokens/radius';

type Props = {
  /** Animated sheet index for content transitions */
  animatedIndex: SharedValue<number>;
  /** Current snap point index (0=collapsed, 1=peek, 2=expanded) */
  currentIndex: number;
};

/**
 * RideSheetFareSummary - Content for ROUTE_SET state
 *
 * Snap points:
 * - Collapsed (100px): Summary row only "$12 · 15 min · 4.2 mi"
 * - Peek (200px): Route summary + Fare card + Negotiation note
 * - Expanded (65%): All above + "Find Drivers" CTA + "Edit route" link
 */
export function RideSheetFareSummary({ animatedIndex, currentIndex }: Props) {
  const router = useRouter();
  const data = useRideSheetStore((s) => s.data);
  const generateQR = useRideSheetStore((s) => s.generateQR);

  const isCollapsed = currentIndex === 0;

  // Peek/expanded content fades in after collapsed
  const expandedContentStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      animatedIndex.value,
      [0, 0.3, 1],
      [0, 0, 1],
      'clamp'
    );
    return { opacity };
  }, []);

  // CTA only visible at expanded state
  const ctaStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      animatedIndex.value,
      [0, 1, 2],
      [0, 0, 1],
      'clamp'
    );
    return { opacity };
  }, []);

  const handleFindDrivers = async () => {
    const success = await generateQR();
    if (success) {
      // State transitions to QR_READY automatically
    }
  };

  const handleEditRoute = () => {
    router.push('/route-input');
  };

  // Format summary text
  const summaryText = [
    data.fareAmount ? formatPrice(data.fareAmount) : null,
    data.routeData?.duration ? formatDuration(data.routeData.duration) : null,
    data.routeData?.distance ? formatDistance(data.routeData.distance) : null,
  ]
    .filter(Boolean)
    .join(' · ');

  const pricingMethod = data.pricingMetadata?.method;

  return (
    <View style={styles.container}>
      {/* Collapsed: Summary row */}
      <View style={styles.summaryRow}>
        <Text style={styles.summaryText}>{summaryText || 'Calculating...'}</Text>
      </View>

      {/* Peek/Expanded: Full content */}
      <Animated.View
        style={[styles.expandedContent, expandedContentStyle]}
        pointerEvents={isCollapsed ? 'none' : 'auto'}
      >
        {/* Route header */}
        {data.origin && data.destination && (
          <RouteHeader
            originLabel={data.origin.name}
            destinationLabel={data.destination.name}
          />
        )}

        {/* Fare card */}
        {data.fareAmount && (
          <View style={styles.fareSection}>
            <FareCard
              amount={data.fareAmount}
              methodLabel={getPricingMethodLabel(pricingMethod)}
              showHeader
            />
          </View>
        )}

        {/* Negotiation disclaimer */}
        <View style={styles.disclaimer}>
          <Ionicons
            name="information-circle-outline"
            size={16}
            color={colors.warning}
          />
          <Text variant="caption" style={styles.disclaimerText}>
            Final fare may be negotiated with the driver
          </Text>
        </View>

        {/* CTA section (only at expanded) */}
        <Animated.View style={[styles.ctaSection, ctaStyle]}>
          <Button
            label="Find Drivers"
            onPress={handleFindDrivers}
            loading={data.isGeneratingQR}
          />
          <Pressable onPress={handleEditRoute} style={styles.editButton}>
            <Text style={styles.editButtonText}>Edit route</Text>
          </Pressable>
        </Animated.View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  summaryRow: {
    paddingVertical: space[2],
  },
  summaryText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
  expandedContent: {
    flex: 1,
    gap: space[4],
    marginTop: space[4],
  },
  fareSection: {
    marginTop: space[2],
  },
  disclaimer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[2],
    backgroundColor: colors.warningLight,
    paddingVertical: space[3],
    paddingHorizontal: space[4],
    borderRadius: radius.md,
  },
  disclaimerText: {
    flex: 1,
    color: colors.warning,
  },
  ctaSection: {
    gap: space[3],
    marginTop: 'auto',
    paddingTop: space[4],
  },
  editButton: {
    alignItems: 'center',
    paddingVertical: space[3],
  },
  editButtonText: {
    color: colors.primary,
    fontWeight: '600',
  },
});
