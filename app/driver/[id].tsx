import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Dimensions,
  Image,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/src/ui/components/themed-text';
import { ThemedView } from '@/src/ui/components/themed-view';
import { BookingOptionsSheet } from '@/src/ui/components/BookingOptionsSheet';
import { BorderRadius, Colors, Spacing } from '@/src/constants/design-tokens';
import { getDriverById } from '@/src/features/drivers/data/drivers';
import { useThemeColor } from '@/src/hooks/use-theme-color';
import { useToast } from '@/src/ui/providers/ToastProvider';
import { useRouteStore } from '@/src/store/route-store';
import { useTripHistoryStore } from '@/src/store/trip-history-store';

export default function DriverProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { showToast } = useToast();
  const [showBookingOptions, setShowBookingOptions] = useState(false);

  const driver = getDriverById(id);
  const savedTripsCount = useTripHistoryStore(
    (state) => state.getSavedTrips().length
  );

  const backgroundColor = useThemeColor(
    { light: '#FFFFFF', dark: '#0E0F0F' },
    'background'
  );
  const cardBackgroundColor = useThemeColor(
    { light: '#FFFFFF', dark: '#161616' },
    'surface'
  );
  const textColor = useThemeColor({ light: '#262626', dark: '#E5E7EA' }, 'text');
  const secondaryTextColor = useThemeColor(
    { light: '#5C5F62', dark: '#8B8F95' },
    'textSecondary'
  );
  const borderColor = useThemeColor(
    { light: '#E3E6E3', dark: '#2F3237' },
    'border'
  );
  const roraGreen = Colors.primary; // Rora Green #00BE3C

  const handleBack = () => {
    router.back();
  };

  const handleCall = () => {
    if (driver?.phone) {
      showToast('Opening phone...');
      Linking.openURL(`tel:${driver.phone}`);
    }
  };

  const handleMessage = () => {
    if (driver?.phone) {
      showToast('Opening messages...');
      Linking.openURL(`sms:${driver.phone}`);
    }
  };

  const handleBookRide = () => {
    setShowBookingOptions(true);
  };

  const handleBookNow = () => {
    setShowBookingOptions(false);
    if (driver) {
      useRouteStore.getState().setSelectedDriver(driver.id);
      router.push('/route-input');
    }
  };

  const handleUseSaved = () => {
    setShowBookingOptions(false);
    if (driver) {
      useRouteStore.getState().setSelectedDriver(driver.id);
      router.push(`/trip-selector?driverId=${driver.id}`);
    }
  };

  if (!driver) {
    return (
      <ThemedView style={[styles.container, { backgroundColor }]}>
        <View style={[styles.header, { paddingTop: insets.top }]}>
          <Pressable onPress={handleBack} style={styles.backButton} hitSlop={8}>
            <Ionicons name="arrow-back" size={24} color={textColor} />
          </Pressable>
          <ThemedText style={styles.headerTitle}>Driver</ThemedText>
          <View style={styles.headerSpacer} />
        </View>
        <View style={styles.errorContainer}>
          <ThemedText style={styles.errorText}>Driver not found</ThemedText>
        </View>
      </ThemedView>
    );
  }

  // Mock photos for the grid (placeholder images)
  const photos = [1, 2, 3, 4, 5, 6];

  // Calculate photo width for 2-column grid
  // Card has marginHorizontal: Spacing.lg (16px) and padding: Spacing.lg (16px)
  // Total horizontal padding: 16*2 (margin) + 16*2 (padding) = 64px
  // Gap between photos: Spacing.sm (8px)
  const screenWidth = Dimensions.get('window').width;
  const cardHorizontalPadding = Spacing.lg * 4; // margin + padding on both sides
  const photoGap = Spacing.sm;
  const availableWidth = screenWidth - cardHorizontalPadding;
  const photoWidth = (availableWidth - photoGap) / 2;

  return (
    <ThemedView style={[styles.container, { backgroundColor }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 100 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top }]}>
          <Pressable onPress={handleBack} style={styles.backButton} hitSlop={8}>
            <Ionicons name="arrow-back" size={24} color={textColor} />
          </Pressable>
          <ThemedText style={styles.headerTitle}>Driver</ThemedText>
          <View style={styles.headerSpacer} />
        </View>

        {/* Map Banner */}
        <View style={styles.mapBanner}>
          {/* Gray map-like pattern */}
          <View style={styles.mapPattern}>
            <View style={[styles.mapLine, styles.mapLine1]} />
            <View style={[styles.mapLine, styles.mapLine2]} />
            <View style={[styles.mapLine, styles.mapLine3]} />
            <View style={[styles.mapLine, styles.mapLine4]} />
          </View>
        </View>

        {/* Profile Section */}
        <View style={styles.profileSection}>
          {/* Avatar with verified badge */}
          <View style={styles.avatarContainer}>
            <View style={[styles.avatarCircle, { borderColor }]}>
              {driver.profileImage ? (
                <Image
                  source={{ uri: driver.profileImage }}
                  style={styles.avatarImage}
                />
              ) : (
                <Ionicons name="person" size={56} color={secondaryTextColor} />
              )}
            </View>
            {/* Verified checkmark badge */}
            <View style={[styles.verifiedBadge, { backgroundColor: roraGreen }]}>
              <Ionicons name="checkmark" size={20} color="#FFFFFF" />
            </View>
          </View>

          {/* Name */}
          <ThemedText style={styles.name}>{driver.name}</ThemedText>

          {/* Status */}
          <View style={styles.statusRow}>
            <View
              style={[
                styles.statusDot,
                { backgroundColor: driver.onDuty ? roraGreen : '#8C9390' },
              ]}
            />
            <ThemedText
              style={[
                styles.statusText,
                { color: driver.onDuty ? roraGreen : '#8C9390' },
              ]}
            >
              {driver.onDuty ? 'On duty' : 'Off duty'}
            </ThemedText>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <Pressable
              style={[styles.actionButton, { borderColor }]}
              onPress={handleCall}
            >
              <Ionicons name="call-outline" size={24} color={roraGreen} />
              <ThemedText style={[styles.actionButtonText, { color: roraGreen }]}>
                Call
              </ThemedText>
            </Pressable>

            <Pressable
              style={[styles.actionButton, { borderColor }]}
              onPress={handleMessage}
            >
              <Ionicons name="chatbubble-outline" size={24} color={roraGreen} />
              <ThemedText style={[styles.actionButtonText, { color: roraGreen }]}>
                Message
              </ThemedText>
            </Pressable>
          </View>
        </View>

        {/* About the driver */}
        <View style={[styles.card, { backgroundColor: cardBackgroundColor, borderColor }]}>
          <ThemedText style={styles.cardTitle}>About the driver</ThemedText>
          <ThemedText style={[styles.cardText, { color: secondaryTextColor }]}>
            {driver.bio}
          </ThemedText>
        </View>

        {/* Vehicle & Ride Photos */}
        <View style={[styles.card, { backgroundColor: cardBackgroundColor, borderColor }]}>
          <ThemedText style={styles.cardTitle}>Vehicle & Ride Photos</ThemedText>
          <View style={styles.photoGrid}>
            {photos.map((photoId) => (
              <View
                key={`photo-${photoId}`}
                style={[
                  styles.photoPlaceholder,
                  { backgroundColor: borderColor, width: photoWidth },
                ]}
              >
                <Ionicons name="image-outline" size={32} color={secondaryTextColor} />
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Book Ride Button */}
      <View
        style={[
          styles.footer,
          {
            paddingBottom: Math.max(insets.bottom, Spacing.lg),
            backgroundColor,
          },
        ]}
      >
        <Pressable
          style={({ pressed }) => [
            styles.bookButton,
            {
              backgroundColor: driver.onDuty ? roraGreen : '#8C9390',
              opacity: pressed ? 0.8 : driver.onDuty ? 1 : 0.6,
            },
          ]}
          onPress={handleBookRide}
          disabled={!driver.onDuty}
        >
          <ThemedText style={styles.bookButtonText}>
            {driver.onDuty ? 'Book Ride' : 'Driver Off Duty'}
          </ThemedText>
        </Pressable>
      </View>

      {/* Booking Options Sheet */}
      <BookingOptionsSheet
        driver={driver}
        isVisible={showBookingOptions}
        onDismiss={() => setShowBookingOptions(false)}
        onBookNow={handleBookNow}
        onUseSaved={handleUseSaved}
        hasSavedTrips={savedTripsCount > 0}
      />
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
    paddingBottom: Spacing.xxl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  backButton: {
    width: 40,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  mapBanner: {
    height: 100,
    backgroundColor: '#E8E8E8',
    overflow: 'hidden',
  },
  mapPattern: {
    flex: 1,
    position: 'relative',
  },
  mapLine: {
    position: 'absolute',
    backgroundColor: '#D0D0D0',
    height: 1,
  },
  mapLine1: {
    top: '30%',
    left: 0,
    right: 0,
    transform: [{ rotate: '-15deg' }],
  },
  mapLine2: {
    top: '50%',
    left: 0,
    right: 0,
    transform: [{ rotate: '10deg' }],
  },
  mapLine3: {
    top: '40%',
    left: '20%',
    width: '60%',
    transform: [{ rotate: '-30deg' }],
  },
  mapLine4: {
    top: '60%',
    left: '10%',
    width: '80%',
    transform: [{ rotate: '5deg' }],
  },
  profileSection: {
    alignItems: 'center',
    marginTop: -50,
    paddingBottom: Spacing.xl,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: Spacing.md,
  },
  avatarCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F0F0F0',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: Spacing.lg,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  actionButton: {
    width: 100,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.card,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  card: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    padding: Spacing.lg,
    borderRadius: BorderRadius.card,
    borderWidth: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  cardText: {
    fontSize: 15,
    lineHeight: 22,
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  photoPlaceholder: {
    aspectRatio: 1,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: 18,
    fontWeight: '500',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
  },
  bookButton: {
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.button,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
});
