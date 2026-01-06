import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Text } from '@/src/ui/primitives/Text';
import { formatPrice } from '@/src/utils/pricing';
import { colors } from '@/src/ui/tokens/colors';
import { space } from '@/src/ui/tokens/spacing';
import { radius } from '@/src/ui/tokens/radius';
import { type } from '@/src/ui/tokens/typography';

type Props = {
  /** Fare amount in local currency */
  amount: number;
  /** Pricing method label */
  methodLabel?: string;
  /** Whether to show the "Rora Fare" header */
  showHeader?: boolean;
  /** Size variant */
  size?: 'default' | 'compact';
};

/**
 * FareCard - Displays the Rora fare estimate
 *
 * Design spec:
 * - Card with centered content
 * - "Rora Fare" header (optional)
 * - Large price display
 * - Method label below (e.g., "Distance-based estimate")
 */
export function FareCard({
  amount,
  methodLabel,
  showHeader = true,
  size = 'default',
}: Props) {
  const isCompact = size === 'compact';

  return (
    <View style={[styles.container, isCompact && styles.containerCompact]}>
      {showHeader && (
        <Text variant="caption" style={styles.header}>
          Rora Fare
        </Text>
      )}
      <Text
        style={[styles.amount, isCompact && styles.amountCompact]}
        accessibilityLabel={`Fare: ${formatPrice(amount)}`}
      >
        {formatPrice(amount)}
      </Text>
      {methodLabel && (
        <Text variant="caption" style={styles.method}>
          {methodLabel}
        </Text>
      )}
    </View>
  );
}

/**
 * Get a human-readable label for the pricing method
 */
export function getPricingMethodLabel(
  method?: 'zone_fixed' | 'distance' | 'time_distance' | string
): string {
  switch (method) {
    case 'zone_fixed':
      return 'Fixed zone fare';
    case 'distance':
      return 'Distance-based estimate';
    case 'time_distance':
      return 'Time & distance estimate';
    default:
      return 'Estimated fare';
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: space[5],
    alignItems: 'center',
  },
  containerCompact: {
    padding: space[4],
  },
  header: {
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontWeight: '600',
    marginBottom: space[2],
  },
  amount: {
    ...type.priceDisplay,
    color: colors.primary,
  },
  amountCompact: {
    fontSize: 24,
    lineHeight: 32,
  },
  method: {
    color: colors.textMuted,
    marginTop: space[2],
  },
});
