import React from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Text } from '../primitives/Text';
import { colors } from '../tokens/colors';
import { radius } from '../tokens/radius';
import { space } from '../tokens/spacing';

/**
 * ProBadge
 *
 * Shows that a user or driver has Rora Pro status.
 * Features the PRO text with a star icon.
 */

type Props = {
  /** Additional styles */
  style?: ViewStyle;
};

export function ProBadge({ style }: Props) {
  return (
    <View style={[styles.container, style]}>
      <Ionicons name="star" size={10} color={colors.proText} style={styles.icon} />
      <Text style={styles.text}>PRO</Text>
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
    backgroundColor: colors.proBg,
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
    color: colors.proText,
  },
});
