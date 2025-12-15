import { useCallback, useMemo, useRef } from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { LocationInputField } from '@/components/ui/location-input-field';
import { useThemeColor } from '@/hooks/use-theme-color';
import type { Venue } from '@/types/venue';

type RideCtaSheetProps = {
  venue: Venue;
  isVisible: boolean;
  onClose: () => void;
  onGetQuote: () => void;
  onEditPickup?: () => void;
};

export function RideCtaSheet({
  venue,
  isVisible,
  onClose,
  onGetQuote,
  onEditPickup,
}: RideCtaSheetProps) {
  const bottomSheetRef = useRef<BottomSheet>(null);

  const backgroundColor = useThemeColor(
    { light: '#FCFCF9', dark: '#1C1917' },
    'surface'
  );
  const handleIndicatorColor = useThemeColor(
    { light: '#E5E5DE', dark: '#4B5563' },
    'border'
  );
  const subtextColor = useThemeColor(
    { light: '#8E8E93', dark: '#A8A29E' },
    'textSecondary'
  );
  const borderColor = useThemeColor(
    { light: '#E5E5DE', dark: '#374151' },
    'border'
  );
  const tealColor = '#21808D';

  const snapPoints = useMemo(() => ['55%'], []);

  const handleSheetChanges = useCallback(
    (index: number) => {
      if (index === -1) {
        onClose();
      }
    },
    [onClose]
  );

  if (!isVisible) {
    return null;
  }

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={0}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      enablePanDownToClose
      backgroundStyle={[styles.background, { backgroundColor }]}
      handleIndicatorStyle={[
        styles.handleIndicator,
        { backgroundColor: handleIndicatorColor },
      ]}
    >
      <BottomSheetView style={styles.contentContainer}>
        {/* Header */}
        <View style={styles.header}>
          <ThemedText style={styles.title}>
            Get a ride to {venue.name}
          </ThemedText>
        </View>

        {/* Pickup Field */}
        <View style={styles.fieldContainer}>
          <View style={styles.fieldHeader}>
            <ThemedText style={[styles.fieldLabel, { color: subtextColor }]}>
              PICKUP
            </ThemedText>
          </View>
          <Pressable
            style={[styles.fieldInput, { borderColor }]}
            onPress={onEditPickup}
          >
            <Ionicons name="location" size={18} color={tealColor} />
            <ThemedText style={styles.fieldValue}>Current Location</ThemedText>
            <Ionicons name="chevron-down" size={18} color={subtextColor} />
          </Pressable>
        </View>

        {/* Destination Field (Locked) */}
        <View style={styles.fieldContainer}>
          <View style={styles.fieldHeader}>
            <ThemedText style={[styles.fieldLabel, { color: subtextColor }]}>
              DESTINATION
            </ThemedText>
          </View>
          <View style={[styles.fieldInput, styles.fieldLocked, { borderColor }]}>
            <Ionicons name="location" size={18} color={subtextColor} />
            <ThemedText style={[styles.fieldValue, { flex: 1 }]}>
              {venue.name}
            </ThemedText>
            <Ionicons name="lock-closed" size={16} color={subtextColor} />
          </View>
        </View>

        {/* Route Preview */}
        <View style={[styles.routePreview, { borderColor }]}>
          <View style={styles.routeItem}>
            <Ionicons name="time-outline" size={20} color={subtextColor} />
            <ThemedText style={styles.routeText}>
              ~{venue.estimatedDuration || 12} min
            </ThemedText>
          </View>
          <View style={styles.routeDivider} />
          <View style={styles.routeItem}>
            <Ionicons name="navigate-outline" size={20} color={subtextColor} />
            <ThemedText style={styles.routeText}>
              ~{venue.distance} km
            </ThemedText>
          </View>
        </View>

        {/* CTA Button */}
        <Pressable
          style={({ pressed }) => [
            styles.ctaButton,
            { backgroundColor: '#21808D' },
            pressed && styles.ctaButtonPressed,
          ]}
          onPress={onGetQuote}
        >
          <ThemedText style={styles.ctaButtonText}>
            Get Official Quote & View Drivers
          </ThemedText>
        </Pressable>
      </BottomSheetView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  background: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10,
  },
  handleIndicator: {
    width: 40,
    height: 4,
    borderRadius: 2,
    marginTop: 8,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
  },
  fieldContainer: {
    marginBottom: 16,
  },
  fieldHeader: {
    marginBottom: 8,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  fieldInput: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  fieldLocked: {
    opacity: 0.7,
  },
  fieldValue: {
    fontSize: 16,
    fontWeight: '400',
  },
  routePreview: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    marginVertical: 16,
  },
  routeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  routeDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#E7E5E4',
    marginHorizontal: 24,
  },
  routeText: {
    fontSize: 16,
    fontWeight: '500',
  },
  ctaButton: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  ctaButtonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
  ctaButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

