import React, { useState, useCallback, type ReactNode } from 'react';
import { StyleSheet, View, Pressable, Dimensions, FlatList, type ViewToken } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/src/ui/components/themed-text';
import { useThemeColor } from '@/src/hooks/use-theme-color';
import type { Venue } from '@/src/types/venue';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Animation constants
const HERO_HEIGHT = 380;
const SCROLL_THRESHOLD = 100; // Full opacity point for fixed header
const FADE_START = 40; // When overlay buttons start fading
const FADE_END = 100; // When overlay buttons are fully invisible

// Placeholder image for empty venue images
const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80';

type AnimatedVenueHeaderProps = {
  venue: Venue;
  isSaved: boolean;
  onSavePress: () => void;
  onBackPress: () => void;
  children: ReactNode;
};

type PaginationDotsProps = {
  activeIndex: number;
  count: number;
};

function PaginationDots({ activeIndex, count }: PaginationDotsProps) {
  if (count <= 1) return null;

  return (
    <View style={styles.paginationContainer}>
      {Array.from({ length: count }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.paginationDot,
            index === activeIndex && styles.paginationDotActive,
          ]}
        />
      ))}
    </View>
  );
}

export function AnimatedVenueHeader({
  venue,
  isSaved,
  onSavePress,
  onBackPress,
  children,
}: AnimatedVenueHeaderProps) {
  const insets = useSafeAreaInsets();
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Theme colors
  const backgroundColor = useThemeColor({ light: '#FFFFFF', dark: '#0E0F0F' }, 'surface');
  const textColor = useThemeColor({ light: '#262626', dark: '#E5E7EA' }, 'text');
  const subtextColor = useThemeColor({ light: '#5C5F62', dark: '#A0A5AA' }, 'textSecondary');
  const chipBackgroundColor = useThemeColor({ light: '#EEF3ED', dark: '#1F1F1F' }, 'background');
  const borderColor = useThemeColor({ light: '#E5E7EB', dark: '#2A2A2A' }, 'border');
  const starColor = '#FBBF24';

  // Prepare hero images
  const heroImages = venue.images.length > 0 ? venue.images : [PLACEHOLDER_IMAGE];

  // Scroll tracking
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  // Track active carousel item
  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems[0]) {
        setActiveImageIndex(viewableItems[0].index || 0);
      }
    },
    []
  );

  // Render carousel item
  const renderCarouselItem = useCallback(
    ({ item }: { item: string }) => (
      <Image
        source={{ uri: item }}
        style={styles.heroImage}
        contentFit="cover"
        placeholder={{ blurhash: 'LGF5]+Yk^6#M@-5c,1J5@[or[Q6.' }}
        transition={300}
      />
    ),
    []
  );

  // Overlay buttons animation (fade out on scroll)
  const overlayButtonsStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [FADE_START, FADE_END],
      [1, 0],
      Extrapolation.CLAMP
    );
    return { opacity };
  }, []);

  // Fixed header background animation (fade in on scroll)
  const fixedHeaderBgStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [60, SCROLL_THRESHOLD],
      [0, 1],
      Extrapolation.CLAMP
    );
    return { opacity };
  }, []);

  // Fixed header content animation (fade in on scroll)
  const fixedHeaderContentStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [60, SCROLL_THRESHOLD],
      [0, 1],
      Extrapolation.CLAMP
    );
    return { opacity };
  }, []);

  return (
    <View style={styles.container}>
      {/* Fixed Header - Fades in on scroll */}
      <View
        style={[
          styles.fixedHeader,
          {
            paddingTop: insets.top,
            height: 44 + insets.top,
            borderBottomColor: borderColor,
          },
        ]}
        pointerEvents="box-none"
      >
        {/* Background */}
        <Animated.View
          style={[
            styles.fixedHeaderBg,
            { backgroundColor },
            fixedHeaderBgStyle,
          ]}
        />

        {/* Content */}
        <Animated.View style={[styles.fixedHeaderContent, fixedHeaderContentStyle]}>
          <Pressable
            onPress={onBackPress}
            style={styles.fixedHeaderButton}
            accessibilityLabel="Go back"
          >
            <Ionicons name="chevron-back" size={24} color={textColor} />
          </Pressable>

          <ThemedText numberOfLines={1} style={styles.fixedHeaderTitle}>
            {venue.name}
          </ThemedText>

          <Pressable
            onPress={onSavePress}
            style={styles.fixedHeaderButton}
            accessibilityLabel={isSaved ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Ionicons
              name={isSaved ? 'heart' : 'heart-outline'}
              size={24}
              color={isSaved ? '#EF4444' : textColor}
            />
          </Pressable>
        </Animated.View>
      </View>

      {/* Scrollable Content */}
      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero Carousel */}
        <View style={styles.heroContainer}>
          <FlatList
            data={heroImages}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => `${venue.id}-image-${index}`}
            renderItem={renderCarouselItem}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
            removeClippedSubviews
            initialNumToRender={1}
            maxToRenderPerBatch={1}
            windowSize={3}
          />

          {/* Pagination Dots */}
          <PaginationDots activeIndex={activeImageIndex} count={heroImages.length} />

          {/* Overlay Buttons - Fade out on scroll */}
          <Animated.View
            style={[
              styles.overlayButtons,
              { top: insets.top + 8 },
              overlayButtonsStyle,
            ]}
            pointerEvents={scrollY.value > FADE_END ? 'none' : 'auto'}
          >
            <Pressable
              style={styles.overlayButton}
              onPress={onBackPress}
              accessibilityLabel="Go back"
            >
              <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
            </Pressable>

            <Pressable
              style={styles.overlayButton}
              onPress={onSavePress}
              accessibilityLabel={isSaved ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Ionicons
                name={isSaved ? 'heart' : 'heart-outline'}
                size={24}
                color={isSaved ? '#EF4444' : '#FFFFFF'}
              />
            </Pressable>
          </Animated.View>
        </View>

        {/* Venue Info Section */}
        <View style={[styles.venueInfo, { backgroundColor }]}>
          <View style={styles.titleRow}>
            <ThemedText style={[styles.title, { color: textColor }]}>
              {venue.name}
            </ThemedText>
          </View>

          <View style={styles.metaRow}>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={16} color={starColor} />
              <ThemedText style={[styles.rating, { color: textColor }]}>
                {venue.rating}
              </ThemedText>
            </View>
            <ThemedText style={[styles.metaText, { color: subtextColor }]}>
              {venue.reviewCount} reviews
            </ThemedText>
            <ThemedText style={[styles.metaDot, { color: subtextColor }]}>·</ThemedText>
            <ThemedText style={[styles.metaText, { color: subtextColor }]}>
              {venue.category.charAt(0).toUpperCase() + venue.category.slice(1)}
            </ThemedText>
          </View>

          {venue.tags.length > 0 && (
            <View style={styles.tagsContainer}>
              {venue.tags.slice(0, 3).map((tag, index) => (
                <View
                  key={index}
                  style={[styles.tag, { backgroundColor: chipBackgroundColor }]}
                >
                  <ThemedText style={[styles.tagText, { color: subtextColor }]}>
                    {tag}
                  </ThemedText>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Children (Ride CTA, About, Hours, Map, etc.) */}
        {children}
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  // Fixed Header
  fixedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  fixedHeaderBg: {
    ...StyleSheet.absoluteFillObject,
  },
  fixedHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    paddingHorizontal: 16,
  },
  fixedHeaderButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fixedHeaderTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    paddingHorizontal: 8,
  },
  // Scroll Content
  scrollContent: {
    paddingBottom: 20,
  },
  // Hero Carousel
  heroContainer: {
    width: SCREEN_WIDTH,
    height: HERO_HEIGHT,
    position: 'relative',
  },
  heroImage: {
    width: SCREEN_WIDTH,
    height: HERO_HEIGHT,
  },
  // Pagination Dots
  paginationContainer: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 4,
  },
  paginationDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  paginationDotActive: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  // Overlay Buttons
  overlayButtons: {
    position: 'absolute',
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  overlayButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Venue Info Section
  venueInfo: {
    padding: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    marginTop: -16,
  },
  titleRow: {
    marginBottom: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  rating: {
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 4,
  },
  metaText: {
    fontSize: 14,
  },
  metaDot: {
    fontSize: 14,
    marginHorizontal: 6,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    fontSize: 13,
    fontWeight: '500',
  },
});
