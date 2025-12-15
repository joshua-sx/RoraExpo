import { StyleSheet, View } from 'react-native';
import MapView from 'react-native-maps';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { DestinationBottomSheet } from '@/components/destination-bottom-sheet';

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
