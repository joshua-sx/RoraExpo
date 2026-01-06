import React from "react";
import { StyleSheet, View } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { Text } from "../primitives/Text";
import { Button } from "./Button";
import { colors } from "../tokens/colors";
import { space } from "../tokens/spacing";
import { radius } from "../tokens/radius";
import { shadow } from "../tokens/shadow";
import { type } from "../tokens/typography";

type Props = {
  /**
   * Origin location label
   */
  origin: string;
  /**
   * Destination location label
   */
  destination: string;
  /**
   * QR code data (session ID or token)
   */
  qrData: string;
  /**
   * Fare amount to display
   */
  fareAmount: number;
  /**
   * Currency symbol
   * @default "$"
   */
  currencySymbol?: string;
  /**
   * CTA button label
   * @default "Look for drivers"
   */
  ctaLabel?: string;
  /**
   * CTA button press handler
   */
  onCtaPress?: () => void;
  /**
   * Loading state for CTA button
   * @default false
   */
  ctaLoading?: boolean;
  /**
   * Disable CTA button
   * @default false
   */
  ctaDisabled?: boolean;
};

/**
 * QRCard - Ride session QR code display
 *
 * Design System Spec (Section 9):
 * - QR code: black on white, no embedded branding
 * - QR size: 200x200px
 * - Card padding: 24px
 * - Trip summary above QR (origin -> destination)
 * - Rora Fare below QR
 * - CTA button at bottom of card
 */
export function QRCard({
  origin,
  destination,
  qrData,
  fareAmount,
  currencySymbol = "$",
  ctaLabel = "Look for drivers",
  onCtaPress,
  ctaLoading = false,
  ctaDisabled = false,
}: Props) {
  return (
    <View style={styles.card}>
      {/* Trip Summary */}
      <View style={styles.tripSummary}>
        <Text variant="caption" style={styles.label}>
          Trip Summary
        </Text>
        <View style={styles.routeRow}>
          <Text variant="caption" style={styles.routeLabel}>From:</Text>
          <Text variant="body" numberOfLines={1} style={styles.routeValue}>{origin}</Text>
        </View>
        <View style={styles.routeRow}>
          <Text variant="caption" style={styles.routeLabel}>To:</Text>
          <Text variant="body" numberOfLines={1} style={styles.routeValue}>{destination}</Text>
        </View>
      </View>

      {/* QR Code */}
      <View style={styles.qrContainer}>
        <QRCode
          value={qrData}
          size={200}
          color="#000000"
          backgroundColor="#FFFFFF"
        />
      </View>

      {/* Fare Display */}
      <View style={styles.fareContainer}>
        <Text variant="caption" style={styles.fareLabel}>Rora Fare</Text>
        <Text style={styles.fareAmount}>
          {currencySymbol}{fareAmount}
        </Text>
      </View>

      {/* CTA Button */}
      {onCtaPress && (
        <Button
          label={ctaLabel}
          onPress={onCtaPress}
          loading={ctaLoading}
          disabled={ctaDisabled}
          variant="primary"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    padding: space[6], // 24px per spec
    ...shadow.md,
  },
  tripSummary: {
    marginBottom: space[5],
  },
  label: {
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: space[3],
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  routeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: space[2],
  },
  routeLabel: {
    width: 48,
    color: colors.textSecondary,
  },
  routeValue: {
    flex: 1,
  },
  qrContainer: {
    alignItems: "center",
    paddingVertical: space[4],
  },
  fareContainer: {
    alignItems: "center",
    marginBottom: space[5],
  },
  fareLabel: {
    color: colors.textSecondary,
    marginBottom: space[1],
  },
  fareAmount: {
    fontSize: type.priceDisplay.fontSize,
    lineHeight: type.priceDisplay.lineHeight,
    fontWeight: type.priceDisplay.fontWeight,
    color: colors.text,
  },
});
