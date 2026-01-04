import React, { ReactNode } from 'react';
import { ScrollView, StyleSheet, View, ViewStyle } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { IconButton } from '../components/IconButton';
import { Box } from '../primitives/Box';
import { Text } from '../primitives/Text';
import { colors } from '../tokens/colors';
import { space } from '../tokens/spacing';

interface ListScreenTemplateProps {
  /**
   * Screen title displayed in the header
   */
  title: string;
  /**
   * Content to render in the scrollable area
   */
  children: ReactNode;
  /**
   * Whether to show back button in header
   * @default true
   */
  showBackButton?: boolean;
  /**
   * Custom back button handler (defaults to router.back())
   */
  onBack?: () => void;
  /**
   * Right side header action (icon button or custom component)
   */
  headerRight?: ReactNode;
  /**
   * Content to render below header but above scroll view (filters, search, etc.)
   */
  headerContent?: ReactNode;
  /**
   * Custom style for the scroll view content container
   */
  contentStyle?: ViewStyle;
  /**
   * Whether to add default padding to content
   * @default true
   */
  padded?: boolean;
  /**
   * Which edges to apply safe area insets
   * @default ['top']
   */
  safeAreaEdges?: ('top' | 'bottom' | 'left' | 'right')[];
}

/**
 * Template for list-based screens with header and scrollable content.
 *
 * Common pattern used in:
 * - Favorite drivers list
 * - Trip history
 * - Settings screens
 * - Saved locations
 *
 * @example
 * ```tsx
 * <ListScreenTemplate title="Favorite Drivers">
 *   {drivers.map(driver => (
 *     <DriverCard key={driver.id} driver={driver} />
 *   ))}
 * </ListScreenTemplate>
 * ```
 *
 * @example
 * ```tsx
 * <ListScreenTemplate
 *   title="Trip History"
 *   headerRight={<FilterButton />}
 *   headerContent={<SearchInput />}
 * >
 *   {trips.map(trip => <TripCard key={trip.id} trip={trip} />)}
 * </ListScreenTemplate>
 * ```
 */
export function ListScreenTemplate({
  title,
  children,
  showBackButton = true,
  onBack,
  headerRight,
  headerContent,
  contentStyle,
  padded = true,
  safeAreaEdges = ['top'],
}: ListScreenTemplateProps) {
  const insets = useSafeAreaInsets();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={safeAreaEdges}>
      {/* Header */}
      <Box style={styles.header}>
        {showBackButton ? (
          <IconButton
            accessibilityLabel="Go back"
            onPress={handleBack}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </IconButton>
        ) : (
          <View style={styles.headerSpacer} />
        )}
        <Text variant="h2" style={styles.headerTitle}>
          {title}
        </Text>
        {headerRight || <View style={styles.headerSpacer} />}
      </Box>

      {/* Optional header content (search, filters, etc.) */}
      {headerContent}

      {/* Scrollable content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          padded && styles.paddedContent,
          { paddingBottom: Math.max(insets.bottom, space[4]) },
          contentStyle,
        ]}
      >
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

// Alias for backwards compatibility / shorthand
export const LstScreenTemplate = ListScreenTemplate;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: space[4],
    paddingVertical: space[3],
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontWeight: '600',
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  paddedContent: {
    padding: space[4],
    gap: space[4],
  },
});
