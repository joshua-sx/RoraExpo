import { StyleSheet, View } from 'react-native';
import MapView from 'react-native-maps';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useRouter } from 'expo-router';

import { DestinationBottomSheet } from '@/components/destination-bottom-sheet';
import type { PopularLocation } from '@/components/ui/popular-location-card';

// Default location: St. Maarten (matching the reference images)
const INITIAL_REGION = {
  latitude: 18.0425,
  longitude: -63.0548,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

// Tab bar height estimate for iOS native tabs
const TAB_BAR_HEIGHT = 85;

export default function HomeScreen() {
  const router = useRouter();

  const handleLocationSelect = (location: PopularLocation) => {
    // TODO: Handle location selection (e.g., show on map, start route)
    console.log('Selected location:', location.name);
  };

  const handleSeeMorePress = () => {
    // Navigate to Explore tab
    router.push('/(tabs)/explore');
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.container}>
        <MapView
          style={styles.map}
          initialRegion={INITIAL_REGION}
          showsUserLocation
          showsMyLocationButton={false}
          showsCompass={false}
        />
        <DestinationBottomSheet
          bottomInset={TAB_BAR_HEIGHT}
          onLocationSelect={handleLocationSelect}
          onSeeMorePress={handleSeeMorePress}
        />
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
});
