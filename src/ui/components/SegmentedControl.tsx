import React from "react";
import { StyleSheet, View } from "react-native";
import { Pressable } from "../primitives/Pressable";
import { Text } from "../primitives/Text";
import { colors } from "../tokens/colors";
import { radius } from "../tokens/radius";
import { space } from "../tokens/spacing";

type Props = {
  segments: string[];
  selectedIndex: number;
  onChange: (index: number) => void;
};

/**
 * SegmentedControl - Tab-like toggle between options
 * Use for filtering or switching views within a screen.
 */
export function SegmentedControl({ segments, selectedIndex, onChange }: Props) {
  return (
    <View style={styles.container}>
      {segments.map((segment, index) => {
        const isSelected = index === selectedIndex;
        return (
          <Pressable
            key={segment}
            onPress={() => onChange(index)}
            accessibilityRole="tab"
            accessibilityState={{ selected: isSelected }}
            style={[styles.segment, isSelected && styles.segmentSelected]}
          >
            <Text
              variant="sub"
              style={[
                styles.label,
                isSelected ? styles.labelSelected : styles.labelUnselected,
              ]}
            >
              {segment}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: colors.border,
    borderRadius: radius.pill,
    padding: 4,
  },
  segment: {
    flex: 1,
    paddingVertical: space[2],
    paddingHorizontal: space[4],
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.pill,
  },
  segmentSelected: {
    backgroundColor: colors.primary,
  },
  label: {
    fontWeight: "600",
  },
  labelSelected: {
    color: colors.primaryText,
  },
  labelUnselected: {
    color: colors.text,
  },
});
