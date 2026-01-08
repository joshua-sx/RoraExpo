import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Pressable } from '../primitives/Pressable';
import { Text } from '../primitives/Text';
import { colors } from '../tokens/colors';
import { space } from '../tokens/spacing';

interface AccordionItemProps {
  question: string;
  answer: string;
  isExpanded?: boolean;
  onToggle?: () => void;
}

export function AccordionItem({
  question,
  answer,
  isExpanded: controlledIsExpanded,
  onToggle,
}: AccordionItemProps) {
  const [internalIsExpanded, setInternalIsExpanded] = useState(false);

  // Use controlled or uncontrolled state
  const isExpanded = controlledIsExpanded ?? internalIsExpanded;

  const animatedHeight = useSharedValue(isExpanded ? 1 : 0);
  const rotation = useSharedValue(isExpanded ? 1 : 0);

  const handleToggle = () => {
    const newValue = !isExpanded;
    animatedHeight.value = withTiming(newValue ? 1 : 0, { duration: 300 });
    rotation.value = withTiming(newValue ? 1 : 0, { duration: 300 });

    if (onToggle) {
      onToggle();
    } else {
      setInternalIsExpanded(newValue);
    }
  };

  const chevronStyle = useAnimatedStyle(() => {
    const rotate = interpolate(rotation.value, [0, 1], [0, 180]);
    return {
      transform: [{ rotate: `${rotate}deg` }],
    };
  });

  const contentStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(animatedHeight.value, [0, 1], [0, 1]),
      maxHeight: animatedHeight.value === 0 ? 0 : undefined,
    };
  });

  return (
    <View style={styles.container}>
      <Pressable onPress={handleToggle} style={styles.header}>
        <Text variant="body" style={styles.question}>
          {question}
        </Text>
        <Animated.View style={chevronStyle}>
          <Ionicons name="chevron-down" size={20} color={colors.textMuted} />
        </Animated.View>
      </Pressable>

      {isExpanded && (
        <Animated.View style={[styles.content, contentStyle]}>
          <Text variant="body" style={styles.answer}>
            {answer}
          </Text>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: space[4],
    paddingVertical: space[4],
    gap: space[3],
  },
  question: {
    flex: 1,
    fontWeight: '500',
    color: colors.text,
  },
  content: {
    paddingHorizontal: space[4],
    paddingBottom: space[4],
    overflow: 'hidden',
  },
  answer: {
    color: colors.textMuted,
    lineHeight: 22,
  },
});
