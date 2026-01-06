import React from "react";
import { StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Pressable } from "../primitives/Pressable";
import { Text } from "../primitives/Text";
import { colors } from "../tokens/colors";
import { space } from "../tokens/spacing";

type Props = {
  title: string;
  subtitle?: string;
  onPress?: () => void;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  /**
   * Show chevron icon when tappable
   * @default true (when onPress is provided)
   */
  showChevron?: boolean;
  /**
   * Hide bottom border
   * @default false
   */
  noBorder?: boolean;
};

/**
 * ListItem - Tappable list row
 *
 * Design System Rules:
 * - Minimum height: 56px
 * - Padding: 12px vertical, 16px horizontal
 * - Structure: [Leading] [Content] [Trailing] [Chevron]
 * - Chevron is REQUIRED for tappable items (showChevron=false to override)
 * - Touch target: 56px minimum height
 */
export function ListItem({
  title,
  subtitle,
  onPress,
  leading,
  trailing,
  showChevron,
  noBorder = false,
}: Props) {
  // By default, show chevron if item is tappable (has onPress)
  const shouldShowChevron = showChevron ?? !!onPress;

  const content = (
    <>
      {leading ? <View style={styles.leading}>{leading}</View> : null}
      <View style={styles.content}>
        <Text variant="headline" numberOfLines={1}>{title}</Text>
        {subtitle ? <Text variant="caption" numberOfLines={2} style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {trailing ? <View style={styles.trailing}>{trailing}</View> : null}
      {shouldShowChevron && (
        <Ionicons
          name="chevron-forward"
          size={20}
          color={colors.textMuted}
          style={styles.chevron}
        />
      )}
    </>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress} style={[styles.row, noBorder && styles.noBorder]}>
        {content}
      </Pressable>
    );
  }

  return (
    <View style={[styles.row, noBorder && styles.noBorder]}>
      {content}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 56,
    paddingVertical: space[3],
    paddingHorizontal: space[4],
    flexDirection: "row",
    alignItems: "center",
    gap: space[3],
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  noBorder: {
    borderBottomWidth: 0,
  },
  leading: {
    width: 40,
    alignItems: "center",
  },
  content: {
    flex: 1,
    gap: space[1],
    minWidth: 0,
  },
  subtitle: {
    color: colors.textSecondary,
  },
  trailing: {
    alignItems: "flex-end",
  },
  chevron: {
    marginLeft: space[2],
  },
});
