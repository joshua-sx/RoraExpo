import React from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';

import { Text } from '../primitives/Text';
import { colors } from '../tokens/colors';
import { radius } from '../tokens/radius';
import { space } from '../tokens/spacing';

/**
 * PriceLabel
 *
 * Shows price context badges like "GOOD DEAL" or "PRICIER THAN USUAL"
 * Used on offer cards to help riders understand if a price is good.
 */

type Variant = 'good-deal' | 'pricier';

type Props = {
  /** The variant to display */
  variant: Variant;
  /** Additional styles */
  style?: ViewStyle;
};

const LABEL_TEXT: Record<Variant, string> = {
  'good-deal': 'GOOD DEAL',
  'pricier': 'PRICIER THAN USUAL',
};

export function PriceLabel({ variant, style }: Props) {
  const isGoodDeal = variant === 'good-deal';

  return (
    <View
      style={[
        styles.container,
        isGoodDeal ? styles.goodDeal : styles.pricier,
        style,
      ]}
    >
      <Text style={[styles.text, isGoodDeal ? styles.goodDealText : styles.pricierText]}>
        {LABEL_TEXT[variant]}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: space[1],
    paddingVertical: 2,
    borderRadius: radius.sm,
    alignSelf: 'flex-start',
  },
  goodDeal: {
    backgroundColor: colors.goodDealBg,
  },
  pricier: {
    backgroundColor: colors.pricierBg,
  },
  text: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '500',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  goodDealText: {
    color: colors.goodDeal,
  },
  pricierText: {
    color: colors.pricier,
  },
});
