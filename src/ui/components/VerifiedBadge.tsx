import React from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Text } from '../primitives/Text';
import { colors } from '../tokens/colors';
import { radius } from '../tokens/radius';
import { space } from '../tokens/spacing';

/**
 * VerifiedBadge
 *
 * Shows that a driver is verified.
 * Features a checkmark shield icon.
 */

type Props = {
  /** Additional styles */
  style?: ViewStyle;
};

export function VerifiedBadge({ style }: Props) {
  return (
    <View style={[styles.container, style]}>
      <Ionicons name="shield-checkmark" size={10} color={colors.verifiedText} style={styles.icon} />
      <Text style={styles.text}>VERIFIED</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: space[1],
    paddingVertical: 2,
    borderRadius: radius.sm,
    backgroundColor: colors.verifiedBg,
    alignSelf: 'flex-start',
  },
  icon: {
    marginRight: 2,
  },
  text: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '500',
    letterSpacing: 0.5,
    color: colors.verifiedText,
  },
});
