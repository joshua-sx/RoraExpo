import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Text } from '@/src/ui/primitives/Text';
import { colors } from '@/src/ui/tokens/colors';
import { space } from '@/src/ui/tokens/spacing';

type Props = {
  /** Origin location label */
  originLabel: string;
  /** Destination location label */
  destinationLabel: string;
  /** Whether to show in compact single-line mode */
  compact?: boolean;
};

/**
 * RouteHeader - Displays origin → destination
 *
 * Two modes:
 * - Default: Stacked layout with icons
 * - Compact: Single line "Origin → Destination"
 */
export function RouteHeader({
  originLabel,
  destinationLabel,
  compact = false,
}: Props) {
  if (compact) {
    return (
      <View style={styles.compactContainer}>
        <Text variant="body" numberOfLines={1} style={styles.compactText}>
          {originLabel}
        </Text>
        <Ionicons
          name="arrow-forward"
          size={14}
          color={colors.textMuted}
          style={styles.arrow}
        />
        <Text variant="body" numberOfLines={1} style={styles.compactText}>
          {destinationLabel}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Origin row */}
      <View style={styles.row}>
        <View style={[styles.iconContainer, styles.originIcon]}>
          <View style={styles.originDot} />
        </View>
        <View style={styles.labelContainer}>
          <Text variant="caption" style={styles.label}>
            From
          </Text>
          <Text variant="body" numberOfLines={1}>
            {originLabel}
          </Text>
        </View>
      </View>

      {/* Connector line */}
      <View style={styles.connectorContainer}>
        <View style={styles.connectorLine} />
      </View>

      {/* Destination row */}
      <View style={styles.row}>
        <View style={[styles.iconContainer, styles.destinationIcon]}>
          <Ionicons name="location" size={16} color={colors.danger} />
        </View>
        <View style={styles.labelContainer}>
          <Text variant="caption" style={styles.label}>
            To
          </Text>
          <Text variant="body" numberOfLines={1}>
            {destinationLabel}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 0,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: space[3],
  },
  originIcon: {},
  originDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  destinationIcon: {},
  connectorContainer: {
    marginLeft: 12,
    paddingVertical: space[1],
  },
  connectorLine: {
    width: 1,
    height: 12,
    backgroundColor: colors.border,
  },
  labelContainer: {
    flex: 1,
    gap: space[1],
  },
  label: {
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontSize: 11,
    fontWeight: '600',
  },
  // Compact mode
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  compactText: {
    flex: 1,
    color: colors.textSecondary,
  },
  arrow: {
    marginHorizontal: space[2],
  },
});
