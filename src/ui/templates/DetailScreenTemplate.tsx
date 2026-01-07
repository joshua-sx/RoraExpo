import React, { type ReactNode } from 'react';
import { StyleSheet, ScrollView, type ScrollViewProps } from 'react-native';
import { ThemedView } from '../components/themed-view';
import { useThemeColor } from '@/src/hooks/use-theme-color';
import { useStickyCta } from '@/src/hooks/use-sticky-cta';

type DetailScreenTemplateProps = {
  /**
   * Hero header component (image, title, metadata)
   */
  header: ReactNode;
  /**
   * Main scrollable content
   */
  children: ReactNode;
  /**
   * Optional sticky CTA button at bottom
   */
  stickyButton?: ReactNode;
  /**
   * ScrollView props
   */
  scrollViewProps?: Omit<ScrollViewProps, 'children'>;
};

/**
 * DetailScreenTemplate - Reusable template for detail screens
 *
 * Features:
 * - Hero header section (typically image + title)
 * - Scrollable content area
 * - Optional sticky CTA button with proper spacing
 * - Automatic safe area handling
 * - Proper tab bar spacing
 *
 * Use with StickyCtaButton component for consistent CTA positioning.
 *
 * @example
 * ```tsx
 * <DetailScreenTemplate
 *   header={
 *     <VenueHeader
 *       venue={venue}
 *       onSavePress={handleSave}
 *       isSaved={isSaved}
 *     />
 *   }
 *   stickyButton={
 *     <StickyCtaButton
 *       label="Get a ride"
 *       onPress={handleBookRide}
 *       content={
 *         <Text>Est. ride time: 12 min</Text>
 *       }
 *     />
 *   }
 * >
 *   <View>{/* Sections, maps, etc. *\/}</View>
 * </DetailScreenTemplate>
 * ```
 */
// Approximate height for sticky buttons when using this template
// Default button height: padding(16) + button(52) + padding(16) = 84px
const DEFAULT_STICKY_BUTTON_HEIGHT = 84;

export function DetailScreenTemplate({
  header,
  children,
  stickyButton,
  scrollViewProps,
}: DetailScreenTemplateProps) {
  // Calculate padding if sticky button is present
  // Note: If stickyButton is a StickyCtaButton, it handles its own positioning
  // This padding is for ScrollView content spacing
  const { scrollViewPadding } = useStickyCta(
    stickyButton ? DEFAULT_STICKY_BUTTON_HEIGHT : 0
  );

  const backgroundColor = useThemeColor(
    { light: '#F9F9F9', dark: '#0E0F0F' },
    'background'
  );

  return (
    <ThemedView style={[styles.container, { backgroundColor }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          // Only add padding if there's a sticky button
          stickyButton ? { paddingBottom: scrollViewPadding } : undefined,
        ].filter(Boolean)}
        showsVerticalScrollIndicator={false}
        {...scrollViewProps}
      >
        {/* Hero Header */}
        {header}

        {/* Main Content */}
        {children}
      </ScrollView>

      {/* Sticky CTA Button */}
      {stickyButton}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
});
