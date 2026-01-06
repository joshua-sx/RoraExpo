import { StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';

import { Text } from '@/src/ui/primitives/Text';
import { Pressable } from '@/src/ui/primitives/Pressable';
import { colors } from '@/src/ui/tokens/colors';
import { space } from '@/src/ui/tokens/spacing';
import { radius } from '@/src/ui/tokens/radius';
import { DEFAULT_BLURHASH, IMAGE_TRANSITION_DURATION } from '@/src/ui/tokens/images';
import type { Venue } from '@/src/types/venue';

type FeaturedVenueCardProps = {
  venue: Venue;
  onPress?: (venue: Venue) => void;
  size?: 'large' | 'medium';
};

/**
 * FeaturedVenueCard - Hero card for featured venues
 *
 * Uses absolute positioning for image/gradient overlay effect,
 * which is acceptable for this hero card pattern.
 */
export function FeaturedVenueCard({
  venue,
  onPress,
  size = 'large',
}: FeaturedVenueCardProps) {
  const isLarge = size === 'large';

  return (
    <Pressable
      style={[
        styles.container,
        isLarge ? styles.containerLarge : styles.containerMedium,
      ]}
      onPress={() => onPress?.(venue)}
    >
      <Image
        source={{ uri: venue.images[0] }}
        style={styles.image}
        contentFit="cover"
        placeholder={{ blurhash: DEFAULT_BLURHASH }}
        transition={IMAGE_TRANSITION_DURATION}
      />
      <LinearGradient
        colors={['transparent', colors.overlay]}
        style={styles.gradient}
      />

      {venue.isPopular && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>POPULAR</Text>
        </View>
      )}

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {venue.name}
        </Text>
        <Text style={styles.subtitle} numberOfLines={2}>
          {venue.shortDescription}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: radius.lg,
    overflow: 'hidden',
    marginBottom: space[4],
  },
  containerLarge: {
    height: 200,
    width: '100%',
  },
  containerMedium: {
    height: 160,
    width: '100%',
  },
  image: {
    ...StyleSheet.absoluteFillObject,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  badge: {
    position: 'absolute',
    top: space[3],
    right: space[3],
    backgroundColor: colors.primary,
    paddingHorizontal: space[2],
    paddingVertical: space[1],
    borderRadius: radius.sm,
  },
  badgeText: {
    color: colors.primaryText,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  content: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: space[4],
  },
  title: {
    color: colors.primaryText,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: space[1],
    textShadowColor: colors.overlay,
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    fontWeight: '400',
    textShadowColor: colors.overlay,
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});
