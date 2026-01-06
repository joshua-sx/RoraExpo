import { StyleSheet, View, type ViewStyle, type ImageSourcePropType } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';

import { Text } from '../primitives/Text';
import { Pressable } from '../primitives/Pressable';
import { DEFAULT_BLURHASH, IMAGE_TRANSITION_DURATION } from '../tokens/images';
import { colors } from '../tokens/colors';
import { radius } from '../tokens/radius';
import { space } from '../tokens/spacing';
import { type } from '../tokens/typography';

/**
 * DriverCard
 *
 * Displays a driver in a compact card format for the available drivers grid.
 * Shows driver photo, name, verification status, rating, trips, and vehicle info.
 *
 * Design:
 * - Large square photo with rounded top corners
 * - Name with verified checkmark inline
 * - Star rating + trip count
 * - Tags row (vehicle type, VIP badge, seats)
 */

type Props = {
  /** Driver's display name */
  driverName: string;
  /** Driver's photo source */
  driverPhoto?: ImageSourcePropType;
  /** Whether the driver is verified */
  isVerified?: boolean;
  /** Whether the driver has VIP/Pro status */
  isVip?: boolean;
  /** Driver's rating (0-5) */
  rating?: number;
  /** Number of completed trips */
  tripCount?: number;
  /** Vehicle type (e.g., "Sedan", "SUV") */
  vehicleType?: string;
  /** Number of seats */
  seatCount?: number;
  /** Callback when card is pressed */
  onPress?: () => void;
  /** Additional styles */
  style?: ViewStyle;
};

export function DriverCard({
  driverName,
  driverPhoto,
  isVerified = false,
  isVip = false,
  rating,
  tripCount,
  vehicleType = 'Sedan',
  seatCount = 4,
  onPress,
  style,
}: Props) {
  const cardContent = (
    <View style={[styles.container, style]}>
      {/* Photo */}
      <View style={styles.photoContainer}>
        {driverPhoto ? (
          <Image
            source={driverPhoto}
            style={styles.photo}
            placeholder={{ blurhash: DEFAULT_BLURHASH }}
            transition={IMAGE_TRANSITION_DURATION}
            contentFit="cover"
          />
        ) : (
          <View style={[styles.photo, styles.photoPlaceholder]}>
            <Ionicons name="person" size={40} color={colors.textMuted} />
          </View>
        )}
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Name + Verified Badge */}
        <View style={styles.nameRow}>
          <Text style={styles.name} numberOfLines={1}>
            {driverName}
          </Text>
          {isVerified && (
            <View style={styles.verifiedBadge}>
              <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
            </View>
          )}
        </View>

        {/* Rating + Trips */}
        {(rating !== undefined || tripCount !== undefined) && (
          <View style={styles.statsRow}>
            {rating !== undefined && (
              <>
                <Ionicons name="star" size={14} color={colors.text} />
                <Text style={styles.rating}>{rating.toFixed(1)}</Text>
              </>
            )}
            {rating !== undefined && tripCount !== undefined && (
              <Text style={styles.statsDot}>·</Text>
            )}
            {tripCount !== undefined && (
              <Text style={styles.trips}>{tripCount} trips</Text>
            )}
          </View>
        )}

        {/* Tags */}
        <View style={styles.tagsRow}>
          <View style={styles.tag}>
            <Text style={styles.tagText}>{vehicleType}</Text>
          </View>
          {isVip && (
            <View style={[styles.tag, styles.vipTag]}>
              <Text style={[styles.tagText, styles.vipTagText]}>VIP</Text>
            </View>
          )}
          <View style={styles.tag}>
            <Text style={styles.tagText}>{seatCount} seats</Text>
          </View>
        </View>
      </View>
    </View>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress} accessibilityRole="button">
        {cardContent}
      </Pressable>
    );
  }

  return cardContent;
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  photoContainer: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: colors.skeleton,
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  photoPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.skeleton,
  },
  content: {
    padding: space[3],
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[1],
  },
  name: {
    ...type.headline,
    color: colors.text,
    flex: 1,
  },
  verifiedBadge: {
    flexShrink: 0,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: space[1],
    gap: space[1],
  },
  rating: {
    ...type.caption,
    fontWeight: '600',
    color: colors.text,
  },
  statsDot: {
    ...type.caption,
    color: colors.textSecondary,
  },
  trips: {
    ...type.caption,
    color: colors.textSecondary,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space[2],
    marginTop: space[3],
  },
  tag: {
    paddingHorizontal: space[3],
    paddingVertical: space[2],
    borderRadius: radius.pill,
    backgroundColor: colors.background,
  },
  tagText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.text,
  },
  vipTag: {
    backgroundColor: colors.text,
  },
  vipTagText: {
    color: colors.surface,
  },
});
