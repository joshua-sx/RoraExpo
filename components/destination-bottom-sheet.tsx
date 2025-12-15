import { useCallback, useMemo, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  Keyboard,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import Animated, {
  useAnimatedStyle,
  withTiming,
  interpolate,
} from 'react-native-reanimated';

import { SearchInput } from '@/components/ui/search-input';
import { LocationInputField } from '@/components/ui/location-input-field';
import { PopularLocations } from '@/components/popular-locations';
import { useThemeColor } from '@/hooks/use-theme-color';
import type { PopularLocation } from '@/components/ui/popular-location-card';

// Enable LayoutAnimation on Android
if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type DestinationBottomSheetProps = {
  bottomInset?: number;
  onLocationSelect?: (location: PopularLocation) => void;
  onSeeMorePress?: () => void;
};

export function DestinationBottomSheet({
  bottomInset = 0,
  onLocationSelect,
  onSeeMorePress,
}: DestinationBottomSheetProps) {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const destinationInputRef = useRef<TextInput>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [destination, setDestination] = useState('');

  const backgroundColor = useThemeColor(
    { light: '#FCFCF9', dark: '#1C1917' },
    'surface'
  );
  const handleIndicatorColor = useThemeColor(
    { light: '#E5E5DE', dark: '#4B5563' },
    'border'
  );

  // Snap points: collapsed (accounts for tab bar) and expanded
  const snapPoints = useMemo(
    () => [140 + bottomInset, '65%'],
    [bottomInset]
  );

  const handleSheetChanges = useCallback((index: number) => {
    const expanded = index >= 1;
    if (expanded !== isExpanded) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setIsExpanded(expanded);
    }

    // If collapsed, dismiss keyboard and clear destination
    if (index === 0) {
      Keyboard.dismiss();
    }
  }, [isExpanded]);

  const handleSearchPress = useCallback(() => {
    // Expand sheet and focus destination input
    bottomSheetRef.current?.snapToIndex(1);
    setTimeout(() => {
      destinationInputRef.current?.focus();
    }, 300);
  }, []);

  const handleLocationPress = useCallback(
    (location: PopularLocation) => {
      setDestination(location.name);
      onLocationSelect?.(location);
      Keyboard.dismiss();
    },
    [onLocationSelect]
  );

  const handleCollapse = useCallback(() => {
    bottomSheetRef.current?.snapToIndex(0);
    setDestination('');
    Keyboard.dismiss();
  }, []);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={0}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      backgroundStyle={[styles.background, { backgroundColor }]}
      handleIndicatorStyle={[
        styles.handleIndicator,
        { backgroundColor: handleIndicatorColor },
      ]}
      enablePanDownToClose={false}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      android_keyboardInputMode="adjustResize"
    >
      <BottomSheetScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.contentContainer,
          { paddingBottom: bottomInset + 20 },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        {!isExpanded ? (
          // Collapsed State: Single search input
          <View style={styles.collapsedContent}>
            <SearchInput
              placeholder="Search destination"
              onPress={handleSearchPress}
            />
          </View>
        ) : (
          // Expanded State: Origin + Destination + Popular Locations
          <View style={styles.expandedContent}>
            <LocationInputField
              label="Origin"
              value="Current location"
              isLocked
            />

            <LocationInputField
              ref={destinationInputRef}
              label="Destination"
              placeholder="Where are you going?"
              value={destination}
              onChangeText={setDestination}
              autoFocus
            />

            <PopularLocations
              onLocationPress={handleLocationPress}
              onSeeMorePress={onSeeMorePress}
            />
          </View>
        )}
      </BottomSheetScrollView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  background: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
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
  contentContainer: {
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  collapsedContent: {
    width: '100%',
  },
  expandedContent: {
    width: '100%',
  },
});
