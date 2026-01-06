import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, {
  interpolate,
  useAnimatedStyle,
  type SharedValue,
} from 'react-native-reanimated';

import { HomePopularCarousel } from '@/src/features/home/components/home-popular-carousel';
import { PillSearchBar } from '@/src/ui/legacy/pill-search-bar';
import { space } from '@/src/ui/tokens/spacing';

const CONTENT_GAP = space[4]; // 16px gap between pill and carousel

type Props = {
  /** Animated sheet index for opacity transitions */
  animatedIndex: SharedValue<number>;
  /** Whether the sheet is in expanded state */
  isExpanded: boolean;
};

/**
 * RideSheetIdle - Content for IDLE state
 *
 * Shows:
 * - "Where to?" search pill
 * - Popular destinations carousel (fades on collapse)
 *
 * This is the home state before any route is selected.
 */
export function RideSheetIdle({ animatedIndex, isExpanded }: Props) {
  const router = useRouter();

  const handleSearchPress = useCallback(() => {
    router.push('/route-input');
  }, [router]);

  // Carousel fade animation: starts fading at 0.3, fully visible at 1
  const carouselAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      animatedIndex.value,
      [0, 0.3, 1],
      [0, 0, 1],
      'clamp'
    );
    const translateY = interpolate(
      animatedIndex.value,
      [0, 1],
      [8, 0],
      'clamp'
    );

    return {
      opacity,
      transform: [{ translateY }],
    };
  }, []);

  return (
    <View style={styles.container}>
      {/* Search pill */}
      <PillSearchBar onSearchPress={handleSearchPress} />

      {/* Popular destinations (fades when collapsed) */}
      <Animated.View
        style={[styles.carouselContainer, carouselAnimatedStyle]}
        pointerEvents={isExpanded ? 'box-none' : 'none'}
      >
        <HomePopularCarousel />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  carouselContainer: {
    marginTop: CONTENT_GAP,
  },
});
