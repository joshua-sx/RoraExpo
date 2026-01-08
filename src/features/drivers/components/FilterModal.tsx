import { Ionicons } from '@expo/vector-icons';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import React, { useEffect, useRef } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { useThemeColor } from '@/src/hooks/use-theme-color';
import { ThemedText } from '@/src/ui/components/themed-text';

export type VehicleType = 'Sedan' | 'SUV' | 'Van' | 'Any';
export type RatingFilter = 1 | 2 | 3 | 4 | 'Any';

export interface DriverFilters {
  dutyStatus: boolean;
  seats: number | 'Any';
  vehicleType: VehicleType;
  rating: RatingFilter;
  specializations: string[];
}

interface FilterModalProps {
  isVisible: boolean;
  onDismiss: () => void;
  filters: DriverFilters;
  onApplyFilters: (filters: DriverFilters) => void;
  onClearAll: () => void;
  matchingDriversCount: number;
  /** Bottom inset to account for tab bar */
  bottomInset?: number;
}

const VEHICLE_TYPES: Array<{ type: VehicleType; label: string; icon: string }> = [
  { type: 'Any', label: 'Any type', icon: 'apps' },
  { type: 'Sedan', label: 'Sedan', icon: 'car' },
  { type: 'SUV', label: 'SUV', icon: 'car-sport' },
  { type: 'Van', label: 'Van', icon: 'bus' },
];

const SPECIALIZATIONS: Array<{ value: string; label: string; icon: string }> = [
  { value: 'vip', label: 'VIP', icon: 'diamond-outline' },
  { value: 'airport', label: 'Airport', icon: 'airplane-outline' },
  { value: 'cruise_port', label: 'Cruise Port', icon: 'boat-outline' },
];

export function FilterModal({
  isVisible,
  onDismiss,
  filters,
  onApplyFilters,
  onClearAll,
  matchingDriversCount,
  bottomInset = 0,
}: FilterModalProps) {
  const sheetRef = useRef<BottomSheet>(null);
  const [localFilters, setLocalFilters] = React.useState<DriverFilters>(filters);

  const backgroundColor = useThemeColor(
    { light: '#FFFFFF', dark: '#1A1A1A' },
    'surface'
  );
  const textColor = useThemeColor({ light: '#222222', dark: '#E5E7EA' }, 'text');
  const secondaryTextColor = useThemeColor(
    { light: '#717171', dark: '#B0B0B0' },
    'textSecondary'
  );
  const borderColor = useThemeColor(
    { light: '#DDDDDD', dark: '#3A3A3A' },
    'border'
  );
  const tintColor = useThemeColor({}, 'tint');
  const handleIndicatorColor = useThemeColor(
    { light: '#DDDDDD', dark: '#3A3A3A' },
    'border'
  );

  useEffect(() => {
    if (isVisible) {
      sheetRef.current?.snapToIndex(0);
      setLocalFilters(filters);
    } else {
      sheetRef.current?.close();
    }
  }, [isVisible, filters]);

  const handleSheetChange = (index: number) => {
    if (index === -1) {
      onDismiss();
    }
  };

  const handleApply = () => {
    onApplyFilters(localFilters);
    onDismiss();
  };

  const handleClearAll = () => {
    onClearAll();
    onDismiss();
  };

  const updateFilter = <K extends keyof DriverFilters>(
    key: K,
    value: DriverFilters[K]
  ) => {
    setLocalFilters((prev) => ({ ...prev, [key]: value }));
  };

  const toggleSpecialization = (spec: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      specializations: prev.specializations.includes(spec)
        ? prev.specializations.filter((s) => s !== spec)
        : [...prev.specializations, spec],
    }));
  };

  return (
    <BottomSheet
      ref={sheetRef}
      index={-1}
      snapPoints={['85%']}
      enablePanDownToClose
      onChange={handleSheetChange}
      backgroundStyle={[styles.background, { backgroundColor }]}
      handleIndicatorStyle={[
        styles.handleIndicator,
        { backgroundColor: handleIndicatorColor },
      ]}
    >
      <BottomSheetScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={onDismiss} hitSlop={12} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={textColor} />
          </Pressable>
          <ThemedText style={styles.headerTitle}>Filters</ThemedText>
          <View style={styles.closeButton} />
        </View>

        {/* Vehicle Type Section */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Vehicle Type</ThemedText>
          <View style={styles.vehicleTypeGrid}>
            {VEHICLE_TYPES.map((vehicle) => (
              <Pressable
                key={vehicle.type}
                style={({ pressed }) => [
                  styles.vehicleTypeButton,
                  {
                    borderColor:
                      localFilters.vehicleType === vehicle.type
                        ? textColor
                        : borderColor,
                    backgroundColor:
                      localFilters.vehicleType === vehicle.type
                        ? `${textColor}08`
                        : 'transparent',
                    opacity: pressed ? 0.6 : 1,
                  },
                ]}
                onPress={() => updateFilter('vehicleType', vehicle.type)}
              >
                <Ionicons
                  name={vehicle.icon as keyof typeof Ionicons.glyphMap}
                  size={32}
                  color={
                    localFilters.vehicleType === vehicle.type
                      ? textColor
                      : secondaryTextColor
                  }
                />
                <ThemedText
                  style={[
                    styles.vehicleTypeLabel,
                    localFilters.vehicleType === vehicle.type && {
                      fontWeight: '600',
                      color: textColor,
                    },
                  ]}
                >
                  {vehicle.label}
                </ThemedText>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={[styles.divider, { backgroundColor: borderColor }]} />

        {/* Seats Section */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Seats</ThemedText>
          <View style={styles.seatsRow}>
            <View style={styles.seatsLeft}>
              <ThemedText style={[styles.seatsLabel, { color: secondaryTextColor }]}>
                Minimum seats
              </ThemedText>
              <ThemedText style={styles.seatsValue}>
                {localFilters.seats === 'Any' ? 'Any' : localFilters.seats}
              </ThemedText>
            </View>
            <View style={styles.seatsControls}>
              <Pressable
                style={({ pressed }) => [
                  styles.seatsButton,
                  { borderColor },
                  localFilters.seats === 'Any' && styles.seatsButtonDisabled,
                  pressed && !((localFilters.seats === 'Any' || localFilters.seats === 1)) && { opacity: 0.6 },
                ]}
                onPress={() => {
                  if (localFilters.seats !== 'Any' && localFilters.seats > 1) {
                    updateFilter('seats', localFilters.seats - 1);
                  }
                }}
                disabled={localFilters.seats === 'Any' || localFilters.seats === 1}
              >
                <Ionicons
                  name="remove"
                  size={20}
                  color={
                    localFilters.seats === 'Any' || localFilters.seats === 1
                      ? borderColor
                      : textColor
                  }
                />
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  styles.anyButton,
                  localFilters.seats === 'Any' && {
                    backgroundColor: textColor,
                  },
                  pressed && { opacity: 0.6 },
                ]}
                onPress={() => updateFilter('seats', 'Any')}
              >
                <ThemedText
                  style={[
                    styles.anyButtonText,
                    localFilters.seats === 'Any' && styles.anyButtonTextActive,
                  ]}
                >
                  Any
                </ThemedText>
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  styles.seatsButton,
                  { borderColor },
                  pressed && { opacity: 0.6 },
                ]}
                onPress={() => {
                  if (localFilters.seats === 'Any') {
                    updateFilter('seats', 1);
                  } else if (localFilters.seats < 8) {
                    updateFilter('seats', localFilters.seats + 1);
                  }
                }}
              >
                <Ionicons name="add" size={20} color={textColor} />
              </Pressable>
            </View>
          </View>
        </View>

        <View style={[styles.divider, { backgroundColor: borderColor }]} />

        {/* Rating Section */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Minimum Rating</ThemedText>
          <View style={styles.ratingOptions}>
            <Pressable
              style={({ pressed }) => [
                styles.ratingOption,
                {
                  borderColor:
                    localFilters.rating === 'Any' ? textColor : borderColor,
                  backgroundColor:
                    localFilters.rating === 'Any' ? `${textColor}08` : 'transparent',
                  opacity: pressed ? 0.6 : 1,
                },
              ]}
              onPress={() => updateFilter('rating', 'Any')}
            >
              <ThemedText
                style={[
                  styles.ratingOptionText,
                  localFilters.rating === 'Any' && { fontWeight: '600', color: textColor },
                ]}
              >
                Any
              </ThemedText>
            </Pressable>

            {([4, 3, 2, 1] as const).map((rating) => (
              <Pressable
                key={rating}
                style={({ pressed }) => [
                  styles.ratingOption,
                  {
                    borderColor:
                      localFilters.rating === rating ? textColor : borderColor,
                    backgroundColor:
                      localFilters.rating === rating ? `${textColor}08` : 'transparent',
                    opacity: pressed ? 0.6 : 1,
                  },
                ]}
                onPress={() => updateFilter('rating', rating)}
              >
                <View style={styles.ratingContent}>
                  <Ionicons name="star" size={16} color="#FFB800" />
                  <ThemedText
                    style={[
                      styles.ratingOptionText,
                      localFilters.rating === rating && { fontWeight: '600', color: textColor },
                    ]}
                  >
                    {rating}+
                  </ThemedText>
                </View>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={[styles.divider, { backgroundColor: borderColor }]} />

        {/* On Duty Filter */}
        <View style={styles.section}>
          <View style={styles.switchRow}>
            <View style={styles.switchLeft}>
              <ThemedText style={styles.switchTitle}>On duty only</ThemedText>
              <ThemedText style={[styles.switchSubtitle, { color: secondaryTextColor }]}>
                Show only drivers currently on duty
              </ThemedText>
            </View>
            <Pressable
              style={({ pressed }) => [
                styles.customSwitch,
                localFilters.dutyStatus && { backgroundColor: tintColor },
                !localFilters.dutyStatus && { backgroundColor: borderColor },
                pressed && { opacity: 0.7 },
              ]}
              onPress={() => updateFilter('dutyStatus', !localFilters.dutyStatus)}
            >
              <View
                style={[
                  styles.customSwitchThumb,
                  localFilters.dutyStatus && styles.customSwitchThumbActive,
                ]}
              />
            </Pressable>
          </View>
        </View>

        <View style={[styles.divider, { backgroundColor: borderColor }]} />

        {/* Specializations Filter */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Specializations</ThemedText>
          <View style={styles.specializationOptions}>
            {SPECIALIZATIONS.map((spec) => (
              <Pressable
                key={spec.value}
                style={({ pressed }) => [
                  styles.specializationPill,
                  {
                    borderColor: localFilters.specializations.includes(spec.value)
                      ? textColor
                      : borderColor,
                    backgroundColor: localFilters.specializations.includes(spec.value)
                      ? `${textColor}08`
                      : 'transparent',
                    opacity: pressed ? 0.6 : 1,
                  },
                ]}
                onPress={() => toggleSpecialization(spec.value)}
              >
                <Ionicons
                  name={spec.icon as keyof typeof Ionicons.glyphMap}
                  size={20}
                  color={
                    localFilters.specializations.includes(spec.value)
                      ? textColor
                      : secondaryTextColor
                  }
                />
                <ThemedText
                  style={[
                    styles.specializationLabel,
                    localFilters.specializations.includes(spec.value) && {
                      fontWeight: '600',
                      color: textColor,
                    },
                  ]}
                >
                  {spec.label}
                </ThemedText>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Spacing at bottom */}
        <View style={{ height: 120 }} />
      </BottomSheetScrollView>

      {/* Footer with buttons */}
      <View style={[styles.footer, { backgroundColor, borderTopColor: borderColor, paddingBottom: 16 + bottomInset }]}>
        <Pressable
          onPress={handleClearAll}
          style={({ pressed }) => [
            styles.clearButton,
            pressed && { opacity: 0.6 },
          ]}
        >
          <ThemedText style={[styles.clearButtonText, { color: textColor }]}>
            Clear all
          </ThemedText>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.showButton,
            { backgroundColor: textColor },
            pressed && { opacity: 0.85 },
          ]}
          onPress={handleApply}
        >
          <ThemedText style={styles.showButtonText}>
            Show {matchingDriversCount} driver{matchingDriversCount !== 1 ? 's' : ''}
          </ThemedText>
        </Pressable>
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  background: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  handleIndicator: {
    width: 40,
    height: 4,
    borderRadius: 2,
    marginTop: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'transparent',
  },
  closeButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: -0.3,
  },
  section: {
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 20,
    letterSpacing: -0.5,
  },
  vehicleTypeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  vehicleTypeButton: {
    width: '48%',
    aspectRatio: 1.5,
    borderWidth: 1.5,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  vehicleTypeLabel: {
    fontSize: 14,
    fontWeight: '400',
  },
  divider: {
    height: 1,
    marginHorizontal: 24,
  },
  seatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  seatsLeft: {
    flex: 1,
  },
  seatsLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  seatsValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  seatsControls: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  seatsButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  seatsButtonDisabled: {
    opacity: 0.3,
  },
  anyButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 18,
    backgroundColor: '#F7F7F7',
  },
  anyButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  anyButtonTextActive: {
    color: '#FFFFFF',
  },
  ratingOptions: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
  ratingOption: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderWidth: 1.5,
    borderRadius: 24,
  },
  ratingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  ratingOptionText: {
    fontSize: 14,
    fontWeight: '400',
  },
  specializationOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  specializationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1.5,
    borderRadius: 24,
    gap: 8,
  },
  specializationLabel: {
    fontSize: 14,
    fontWeight: '400',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  switchLeft: {
    flex: 1,
    marginRight: 16,
  },
  switchTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  switchSubtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  customSwitch: {
    width: 52,
    height: 32,
    borderRadius: 16,
    padding: 2,
    justifyContent: 'center',
  },
  customSwitchThumb: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  customSwitchThumbActive: {
    transform: [{ translateX: 20 }],
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingTop: 16,
    gap: 12,
    borderTopWidth: 1,
  },
  clearButton: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearButtonText: {
    fontSize: 16,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  showButton: {
    flex: 2,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  showButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
