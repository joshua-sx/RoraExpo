import React, { type ReactNode } from 'react';
import { StyleSheet, View, Pressable, Platform, type ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { ThemedText } from '../components/themed-text';
import { useThemeColor } from '@/src/hooks/use-theme-color';
import { useStickyCta } from '@/src/hooks/use-sticky-cta';

type StickyCtaButtonProps = {
  /**
   * Button label text
   */
  label: string;
  /**
   * Button press handler
   */
  onPress: () => void;
  /**
   * Optional content to display above button (e.g., metadata, pricing)
   */
  content?: ReactNode;
  /**
   * Disable button
   * @default false
   */
  disabled?: boolean;
  /**
   * Loading state
   * @default false
   */
  loading?: boolean;
  /**
   * Button variant
   * @default 'primary'
   */
  variant?: 'primary' | 'secondary';
  /**
   * Additional container style
   */
  containerStyle?: ViewStyle;
  /**
   * Additional button style
   */
  buttonStyle?: ViewStyle;
};

/**
 * StickyCtaButton - Reusable sticky CTA button component
 *
 * Features:
 * - Sticky positioning at bottom of screen
 * - Respects tab bar and safe area
 * - Optional content area above button
 * - Primary and secondary variants
 * - Disabled and loading states
 * - Shadow and elevation
 * - Rounded top corners
 *
 * @example
 * ```tsx
 * <StickyCtaButton
 *   label="Book Ride"
 *   onPress={handleBookRide}
 *   content={
 *     <View>
 *       <Text>Estimated fare: $20</Text>
 *       <Text>12 min trip</Text>
 *     </View>
 *   }
 * />
 * ```
 */
// Approximate card height: paddingTop(16) + content(~14 if present) + gap(14) + button(52) + paddingBottom(16)
// For button-only: 16 + 0 + 0 + 52 + 16 = 84px
// For with content: 16 + 14 + 14 + 52 + 16 = 112px (approximate)
const BUTTON_CARD_HEIGHT = 84; // Minimum height (button only)

export function StickyCtaButton({
  label,
  onPress,
  content,
  disabled = false,
  loading = false,
  variant = 'primary',
  containerStyle,
  buttonStyle,
}: StickyCtaButtonProps) {
  // Calculate height based on whether content is present
  const cardHeight = content ? BUTTON_CARD_HEIGHT + 28 : BUTTON_CARD_HEIGHT;
  const { cardBottomPosition } = useStickyCta(cardHeight);

  const backgroundColor = useThemeColor(
    { light: '#FFFFFF', dark: '#161616' },
    'surface'
  );
  const primaryColor = useThemeColor({}, 'tint');
  const secondaryColor = useThemeColor(
    { light: '#E5E7EA', dark: '#2A2D2E' },
    'border'
  );

  const buttonBackgroundColor = variant === 'primary' ? primaryColor : secondaryColor;
  const buttonTextColor = variant === 'primary' ? '#FFFFFF' : useThemeColor({ light: '#262626', dark: '#E5E7EA' }, 'text');

  const containerContent = (
    <>
      {/* Optional Content Area */}
      {content && (
        <View style={styles.contentArea}>
          {content}
        </View>
      )}

      {/* CTA Button */}
      <Pressable
        style={({ pressed }) => [
          styles.button,
          { backgroundColor: buttonBackgroundColor },
          disabled && styles.buttonDisabled,
          pressed && !disabled && styles.buttonPressed,
          buttonStyle,
        ]}
        onPress={onPress}
        disabled={disabled || loading}
      >
        <ThemedText style={[styles.buttonText, { color: buttonTextColor }]}>
          {loading ? 'Loading...' : label}
        </ThemedText>
      </Pressable>
    </>
  );

  // Use BlurView on iOS for frosted glass effect, solid background on Android
  if (Platform.OS === 'ios') {
    return (
      <BlurView
        intensity={80}
        tint="light"
        style={[
          styles.container,
          styles.blurContainer,
          { bottom: cardBottomPosition },
          containerStyle,
        ]}
      >
        {containerContent}
      </BlurView>
    );
  }

  // Android fallback: solid background with slight transparency
  return (
    <View
      style={[
        styles.container,
        { backgroundColor: `${backgroundColor}F5`, bottom: cardBottomPosition },
        containerStyle,
      ]}
    >
      {containerContent}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
  },
  blurContainer: {
    overflow: 'hidden', // Required for BlurView with border radius
  },
  contentArea: {
    marginBottom: 14,
  },
  button: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
