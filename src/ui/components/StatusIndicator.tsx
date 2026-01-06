import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
  FadeIn,
  FadeOut,
} from "react-native-reanimated";
import { Text } from "../primitives/Text";
import { colors } from "../tokens/colors";
import { space } from "../tokens/spacing";

type Props = {
  /**
   * Array of status messages to rotate through
   */
  messages: string[];
  /**
   * Interval between message changes (ms)
   * @default 3000
   */
  interval?: number;
  /**
   * Show pulse animation around indicator
   * @default true
   */
  showPulse?: boolean;
  /**
   * Indicator color
   * @default colors.primary
   */
  color?: string;
};

/**
 * StatusIndicator - Animated status display for wait states
 *
 * Design System Spec (Section 5, Template E):
 * - Used for Discovery, Hold, Active Ride screens
 * - Show rich context about what's happening
 * - Subtle animation (not playful, not distracting)
 * - No countdown or timer visible to user
 * - Rotating status messages
 */
export function StatusIndicator({
  messages,
  interval = 3000,
  showPulse = true,
  color = colors.primary,
}: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Pulse animation
  const pulseScale = useSharedValue(1);
  const pulseOpacity = useSharedValue(0.6);

  useEffect(() => {
    if (showPulse) {
      // Gentle pulse animation
      pulseScale.value = withRepeat(
        withSequence(
          withTiming(1.5, { duration: 1500, easing: Easing.out(Easing.ease) }),
          withTiming(1, { duration: 0 })
        ),
        -1,
        false
      );
      pulseOpacity.value = withRepeat(
        withSequence(
          withTiming(0, { duration: 1500, easing: Easing.out(Easing.ease) }),
          withTiming(0.6, { duration: 0 })
        ),
        -1,
        false
      );
    }
  }, [showPulse, pulseScale, pulseOpacity]);

  // Rotate through messages
  useEffect(() => {
    if (messages.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % messages.length);
    }, interval);

    return () => clearInterval(timer);
  }, [messages, interval]);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
    opacity: pulseOpacity.value,
  }));

  return (
    <View style={styles.container}>
      {/* Indicator with pulse */}
      <View style={styles.indicatorContainer}>
        {showPulse && (
          <Animated.View
            style={[
              styles.pulse,
              { backgroundColor: color },
              pulseStyle,
            ]}
          />
        )}
        <View style={[styles.dot, { backgroundColor: color }]} />
      </View>

      {/* Rotating message */}
      <Animated.View
        key={currentIndex}
        entering={FadeIn.duration(300)}
        exiting={FadeOut.duration(300)}
      >
        <Text variant="headline" style={styles.message}>
          {messages[currentIndex]}
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: space[4],
  },
  indicatorContainer: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  pulse: {
    position: "absolute",
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  dot: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  message: {
    textAlign: "center",
    color: colors.text,
  },
});
