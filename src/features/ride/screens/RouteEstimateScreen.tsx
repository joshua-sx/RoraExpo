import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Box } from '@/src/ui/primitives/Box';
import { Text } from '@/src/ui/primitives/Text';
import { Pressable } from '@/src/ui/primitives/Pressable';
import { Button } from '@/src/ui/components/Button';
import { Skeleton } from '@/src/ui/components/Skeleton';
import { colors } from '@/src/ui/tokens/colors';
import { space } from '@/src/ui/tokens/spacing';
import { radius } from '@/src/ui/tokens/radius';
import { type } from '@/src/ui/tokens/typography';
import { useToast } from '@/src/ui/providers/ToastProvider';

import { calculateFare, formatFare, getDefaultRegionId } from '@/src/services/pricing.service';
import { trackEvent, AnalyticsEvents } from '@/src/lib/posthog';

interface Location {
  lat: number;
  lng: number;
  label: string;
}

export const RouteEstimateScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const { showToast } = useToast();

  const [origin, setOrigin] = useState<Location | null>(null);
  const [destination, setDestination] = useState<Location | null>(null);
  const [fare, setFare] = useState<number | null>(null);
  const [pricingMetadata, setPricingMetadata] = useState<any>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(true);

  // Pre-fill destination from params if available
  useEffect(() => {
    if (params.destinationLat && params.destinationLng && params.destinationLabel) {
      setDestination({
        lat: Number(params.destinationLat),
        lng: Number(params.destinationLng),
        label: params.destinationLabel as string,
      });
    }
  }, [params]);

  // Calculate fare when both origin and destination are set
  useEffect(() => {
    if (origin && destination && !fare) {
      handleCalculateFare();
    }
  }, [origin, destination]);

  const handleCalculateFare = async () => {
    if (!origin || !destination) return;

    setIsCalculating(true);

    try {
      const regionId = await getDefaultRegionId();
      const result = await calculateFare({
        origin: { lat: origin.lat, lng: origin.lng },
        destination: { lat: destination.lat, lng: destination.lng },
        region_id: regionId,
      });

      setFare(result.amount);
      setPricingMetadata(result.calculation_metadata);

      // Track analytics
      trackEvent(AnalyticsEvents.ESTIMATE_CREATED, {
        origin: origin.label,
        destination: destination.label,
        fare_amount: result.amount,
        method: result.calculation_metadata?.method,
      });
    } catch (error) {
      console.error('Failed to calculate fare:', error);
      showToast('Failed to calculate fare. Please try again.');
    } finally {
      setIsCalculating(false);
    }
  };

  const handleGenerateQR = () => {
    if (!origin || !destination || !fare) return;

    router.push({
      pathname: '/ride/qr-session',
      params: {
        originLat: origin.lat,
        originLng: origin.lng,
        originLabel: origin.label,
        destinationLat: destination.lat,
        destinationLng: destination.lng,
        destinationLabel: destination.label,
        fareAmount: fare,
        pricingMetadata: JSON.stringify(pricingMetadata),
      },
    });
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Text style={styles.title}>Plan Your Ride</Text>

        {/* Origin Input */}
        <Box style={styles.inputContainer}>
          <Text variant="caption" style={styles.label}>From</Text>
          <Pressable
            style={styles.input}
            onPress={() => {
              // Open places search modal for origin
            }}
            accessibilityLabel="Choose pickup location"
          >
            <Text
              variant="body"
              style={origin ? styles.inputText : styles.placeholderText}
            >
              {origin?.label || 'Choose pickup location'}
            </Text>
          </Pressable>
        </Box>

        {/* Destination Input */}
        <Box style={styles.inputContainer}>
          <Text variant="caption" style={styles.label}>To</Text>
          <Pressable
            style={styles.input}
            onPress={() => {
              // Open places search modal for destination
            }}
            accessibilityLabel="Choose destination"
          >
            <Text
              variant="body"
              style={destination ? styles.inputText : styles.placeholderText}
            >
              {destination?.label || 'Choose destination'}
            </Text>
          </Pressable>
        </Box>

        {/* Fare Display */}
        {isCalculating ? (
          <Box style={styles.fareContainer}>
            <Skeleton width={80} height={16} style={{ marginBottom: space[2] }} />
            <Skeleton width={120} height={48} borderRadius={radius.md} />
            <Skeleton width={140} height={12} style={{ marginTop: space[2] }} />
          </Box>
        ) : fare ? (
          <Box style={styles.fareContainer}>
            <Text variant="caption" style={styles.fareLabel}>Rora Fare</Text>
            <Text style={styles.fareAmount}>{formatFare(fare)}</Text>
            {pricingMetadata?.method && (
              <Text variant="caption" muted style={styles.fareMethod}>
                {pricingMetadata.method === 'zone_fixed'
                  ? 'Fixed zone fare'
                  : 'Distance-based estimate'}
              </Text>
            )}
          </Box>
        ) : null}

        {/* Disclaimer */}
        {showDisclaimer && fare && (
          <Box style={styles.disclaimerContainer}>
            <Text variant="bodySmall" style={styles.disclaimerText}>
              Final fare may be negotiated with the driver
            </Text>
            <Pressable onPress={() => setShowDisclaimer(false)}>
              <Text variant="bodySmall" style={styles.dismissButton}>
                Got it
              </Text>
            </Pressable>
          </Box>
        )}
      </ScrollView>

      {/* Fixed Bottom CTA */}
      {fare && (
        <Box style={[styles.ctaContainer, { paddingBottom: Math.max(insets.bottom, space[4]) }]}>
          <Button
            label="Generate QR Code"
            onPress={handleGenerateQR}
            variant="primary"
          />
        </Box>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: space[4],
    paddingBottom: space[9], // Space for fixed CTA
  },
  title: {
    ...type.title1,
    color: colors.text,
    marginBottom: space[6],
    marginTop: space[4],
  },
  inputContainer: {
    marginBottom: space[4],
  },
  label: {
    color: colors.textMuted,
    fontWeight: '600',
    marginBottom: space[2],
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: space[4],
    backgroundColor: colors.surface,
    minHeight: 52, // Touch target
  },
  inputText: {
    color: colors.text,
  },
  placeholderText: {
    color: colors.textMuted,
  },
  fareContainer: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: space[6],
    marginTop: space[6],
    alignItems: 'center',
  },
  fareLabel: {
    color: colors.textMuted,
    fontWeight: '600',
    marginBottom: space[2],
  },
  fareAmount: {
    ...type.display,
    fontSize: 48, // Extra large for fare
    color: colors.primary,
  },
  fareMethod: {
    marginTop: space[2],
  },
  disclaimerContainer: {
    backgroundColor: colors.warningLight,
    borderRadius: radius.md,
    padding: space[4],
    marginTop: space[4],
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  disclaimerText: {
    color: colors.warning,
    flex: 1,
  },
  dismissButton: {
    color: colors.primary,
    fontWeight: '600',
    marginLeft: space[3],
  },
  ctaContainer: {
    padding: space[4],
    backgroundColor: colors.bg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});
