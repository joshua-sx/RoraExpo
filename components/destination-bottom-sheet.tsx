import { useCallback, useMemo, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';

import { ThemedText } from '@/components/themed-text';
import { SearchInput } from '@/components/ui/search-input';
import { useThemeColor } from '@/hooks/use-theme-color';

type DestinationBottomSheetProps = {
  onSearchPress?: () => void;
};

export function DestinationBottomSheet({
  onSearchPress,
}: DestinationBottomSheetProps) {
  const bottomSheetRef = useRef<BottomSheet>(null);

  const backgroundColor = useThemeColor(
    { light: '#FFFFFF', dark: '#1A1A1A' },
    'background'
  );
  const handleIndicatorColor = useThemeColor(
    { light: '#D1D5DB', dark: '#4B5563' },
    'text'
  );

  // Snap points for the bottom sheet
  const snapPoints = useMemo(() => ['25%', '50%', '90%'], []);

  const handleSheetChanges = useCallback((index: number) => {
    // Handle sheet position changes if needed
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
    >
      <BottomSheetView style={styles.contentContainer}>
        <View style={styles.header}>
          <ThemedText style={styles.greeting}>Nice to see you!</ThemedText>
          <ThemedText type="title" style={styles.title}>
            Where are you going?
          </ThemedText>
        </View>

        <View style={styles.searchContainer}>
          <SearchInput
            placeholder="Search destination"
            onPress={onSearchPress}
          />
        </View>
      </BottomSheetView>
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
  contentContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  header: {
    marginBottom: 20,
  },
  greeting: {
    fontSize: 14,
    opacity: 0.6,
    marginBottom: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  searchContainer: {
    width: '100%',
  },
});

