import React from 'react';
import { StyleSheet, View, FlatList, Alert, Dimensions, type ViewStyle } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  type SharedValue,
} from 'react-native-reanimated';

import { Text } from '@/src/ui/primitives/Text';
import { Pressable } from '@/src/ui/primitives/Pressable';
import { DriverCard } from '@/src/ui/components/DriverCard';
import { useRideSheetStore, type RideSheetOffer } from '../../store/ride-sheet-store';
import { formatPrice } from '@/src/utils/pricing';
import { colors } from '@/src/ui/tokens/colors';
import { space } from '@/src/ui/tokens/spacing';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_GAP = space[3];
const CARD_WIDTH = (SCREEN_WIDTH - space[4] * 2 - CARD_GAP) / 2;

type Props = {
  /** Animated sheet index for content transitions */
  animatedIndex: SharedValue<number>;
  /** Current snap point index */
  currentIndex: number;
};

/**
 * RideSheetOffers - Content for OFFERS_RECEIVED state
 *
 * Snap points:
 * - Collapsed (140px): "3 offers received · From $10"
 * - Peek (320px): Top 2-3 offer cards
 * - Expanded (75%): All offers + "Cancel search" link
 */
export function RideSheetOffers({ animatedIndex, currentIndex }: Props) {
  const data = useRideSheetStore((s) => s.data);
  const selectOffer = useRideSheetStore((s) => s.selectOffer);
  const cancel = useRideSheetStore((s) => s.cancel);

  const isCollapsed = currentIndex === 0;
  const isPeek = currentIndex === 1;

  // Best price (offers are sorted by price ascending)
  const bestPrice = data.offers.length > 0 ? data.offers[0].offered_amount : null;
  const offerCount = data.offers.length;

  // Top 3 offers for peek state
  const topOffers = data.offers.slice(0, 3);
  const moreOffersCount = Math.max(0, data.offers.length - 3);

  // Expanded content fade
  const expandedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      animatedIndex.value,
      [0, 0.5, 1],
      [0, 0, 1],
      'clamp'
    );
    return { opacity };
  }, []);

  const handleSelectOffer = (offer: RideSheetOffer) => {
    selectOffer(offer);
  };

  const handleCancel = () => {
    Alert.alert(
      'Cancel ride?',
      'Are you sure you want to cancel this ride request?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, cancel',
          style: 'destructive',
          onPress: () => cancel(),
        },
      ]
    );
  };

  const getVehicleType = (offer: RideSheetOffer): string => {
    return offer.driver_profile?.vehicle_type || 'Sedan';
  };

  const renderDriverCard = ({ item, index }: { item: RideSheetOffer; index: number }) => {
    const cardStyle: ViewStyle = {
      ...styles.driverCard,
      ...(index % 2 === 0 ? styles.cardLeft : styles.cardRight),
    };

    return (
      <DriverCard
        driverName={item.driver_profile?.display_name || 'Driver'}
        driverPhoto={
          item.driver_profile?.avatar_url
            ? { uri: item.driver_profile.avatar_url }
            : undefined
        }
        isVerified={true} // All drivers in discovery are verified
        isVip={false} // TODO: Add is_rora_pro to driver_profile
        rating={item.driver_profile?.rating_average ?? undefined}
        tripCount={item.driver_profile?.rating_count ?? undefined}
        vehicleType={getVehicleType(item)}
        seatCount={4} // TODO: Add seat_count to driver_profile
        onPress={() => handleSelectOffer(item)}
        style={cardStyle}
      />
    );
  };

  return (
    <View style={styles.container}>
      {/* Collapsed: Summary row */}
      <View style={styles.summaryRow}>
        <Text style={styles.summaryText}>
          {offerCount} offer{offerCount === 1 ? '' : 's'} received
        </Text>
        {bestPrice && (
          <Text style={styles.bestPrice}>
            From {formatPrice(bestPrice)}
          </Text>
        )}
      </View>

      {/* Peek/Expanded: Driver Grid */}
      {!isCollapsed && (
        <Animated.View style={[styles.offersSection, expandedStyle]}>
          <Text style={styles.sectionTitle}>Driver offers</Text>

          {/* 2-column grid of drivers */}
          <FlatList
            data={isPeek ? topOffers : data.offers}
            renderItem={renderDriverCard}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={styles.gridRow}
            contentContainerStyle={styles.gridContent}
            showsVerticalScrollIndicator={false}
            scrollEnabled={!isPeek}
          />

          {/* More offers indicator (peek state only) */}
          {isPeek && moreOffersCount > 0 && (
            <Text style={styles.moreOffersText}>
              + {moreOffersCount} more offer{moreOffersCount === 1 ? '' : 's'}
            </Text>
          )}

          {/* Cancel link */}
          <Pressable onPress={handleCancel} style={styles.cancelButton}>
            <Text style={styles.cancelButtonText}>Cancel search</Text>
          </Pressable>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: space[2],
  },
  summaryText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  bestPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
  },
  offersSection: {
    flex: 1,
    marginTop: space[4],
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: space[4],
  },
  gridRow: {
    justifyContent: 'space-between',
    marginBottom: CARD_GAP,
  },
  gridContent: {
    paddingBottom: space[4],
  },
  driverCard: {
    width: CARD_WIDTH,
  },
  cardLeft: {
    marginRight: CARD_GAP / 2,
  },
  cardRight: {
    marginLeft: CARD_GAP / 2,
  },
  moreOffersText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    textAlign: 'center',
    paddingVertical: space[4],
  },
  cancelButton: {
    alignItems: 'center',
    paddingVertical: space[4],
    marginTop: 'auto',
  },
  cancelButtonText: {
    color: colors.danger,
    fontWeight: '600',
  },
});
