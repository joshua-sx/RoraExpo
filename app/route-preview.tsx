import { useRef } from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';

// Default location: St. Maarten
const INITIAL_REGION = {
  latitude: 18.0425,
  longitude: -63.0548,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

export default function RoutePreviewScreen() {
  const params = useLocalSearchParams<{ origin: string; destination: string }>();
  const router = useRouter();
  const bottomSheetRef = useRef<BottomSheet>(null);

  const backgroundColor = useThemeColor(
    { light: '#FFFFFF', dark: '#161616' },
    'surface'
  );
  const textColor = useThemeColor(
    { light: '#262626', dark: '#E5E7EA' },
    'text'
  );
  const secondaryTextColor = useThemeColor(
    { light: '#5C5F62', dark: '#8B8F95' },
    'textSecondary'
  );
  const tintColor = useThemeColor({}, 'tint');
  const handleIndicatorColor = useThemeColor(
    { light: '#E3E6E3', dark: '#2F3237' },
    'border'
  );

  const handleClose = () => {
    router.back();
  };

  const handleBookRide = () => {
    // TODO: Implement ride booking
    console.log('Book ride from', params.origin, 'to', params.destination);
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.container}>
        {/* Map */}
        <MapView
          style={styles.map}
          initialRegion={INITIAL_REGION}
          showsUserLocation
          showsMyLocationButton={false}
          showsCompass={false}
        >
          {/* Placeholder markers - in a real app, these would be geocoded locations */}
          <Marker
            coordinate={{
              latitude: INITIAL_REGION.latitude - 0.01,
              longitude: INITIAL_REGION.longitude - 0.01,
            }}
            title={params.origin}
            pinColor={tintColor}
          />
          <Marker
            coordinate={{
              latitude: INITIAL_REGION.latitude + 0.01,
              longitude: INITIAL_REGION.longitude + 0.01,
            }}
            title={params.destination}
            pinColor="#FF5733"
          />
        </MapView>

        {/* Close Button */}
        <View style={styles.closeButtonContainer}>
          <Pressable
            onPress={handleClose}
            style={[styles.closeButton, { backgroundColor }]}
            hitSlop={8}
          >
            <Ionicons name="close" size={24} color={textColor} />
          </Pressable>
        </View>

        {/* Route Details Bottom Sheet */}
        <BottomSheet
          ref={bottomSheetRef}
          index={0}
          snapPoints={['35%']}
          backgroundStyle={[styles.bottomSheetBackground, { backgroundColor }]}
          handleIndicatorStyle={[
            styles.handleIndicator,
            { backgroundColor: handleIndicatorColor },
          ]}
          enablePanDownToClose={false}
        >
          <BottomSheetView style={styles.bottomSheetContent}>
            {/* Route Info */}
            <View style={styles.routeInfo}>
              <View style={styles.routePoint}>
                <View style={[styles.dot, { backgroundColor: tintColor }]} />
                <ThemedText style={styles.routeText}>{params.origin}</ThemedText>
              </View>
              <View style={styles.routeLine} />
              <View style={styles.routePoint}>
                <View style={[styles.dot, { backgroundColor: '#FF5733' }]} />
                <ThemedText style={styles.routeText}>{params.destination}</ThemedText>
              </View>
            </View>

            {/* Trip Details */}
            <View style={styles.tripDetails}>
              <View style={styles.detailItem}>
                <Ionicons name="time-outline" size={20} color={secondaryTextColor} />
                <ThemedText style={[styles.detailText, { color: secondaryTextColor }]}>
                  ~15 min
                </ThemedText>
              </View>
              <View style={styles.detailItem}>
                <Ionicons name="car-outline" size={20} color={secondaryTextColor} />
                <ThemedText style={[styles.detailText, { color: secondaryTextColor }]}>
                  5.2 km
                </ThemedText>
              </View>
            </View>

            {/* Price */}
            <View style={styles.priceContainer}>
              <ThemedText style={styles.priceLabel}>Estimated fare</ThemedText>
              <ThemedText style={styles.price}>$25.00</ThemedText>
            </View>

            {/* Book Button */}
            <Pressable
              onPress={handleBookRide}
              style={[styles.bookButton, { backgroundColor: tintColor }]}
            >
              <ThemedText style={styles.bookButtonText}>Book Ride</ThemedText>
            </Pressable>
          </BottomSheetView>
        </BottomSheet>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  closeButtonContainer: {
    position: 'absolute',
    top: 60,
    left: 20,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  bottomSheetBackground: {
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
  bottomSheetContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  routeInfo: {
    marginBottom: 20,
  },
  routePoint: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  routeLine: {
    width: 2,
    height: 20,
    backgroundColor: '#E3E6E3',
    marginLeft: 5,
    marginVertical: 2,
  },
  routeText: {
    fontSize: 16,
    fontWeight: '500',
  },
  tripDetails: {
    flexDirection: 'row',
    gap: 24,
    marginBottom: 20,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#E3E6E3',
  },
  priceLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  price: {
    fontSize: 24,
    fontWeight: '700',
  },
  bookButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
