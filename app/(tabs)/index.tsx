import { StyleSheet, View } from 'react-native';
import MapView from 'react-native-maps';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { DestinationBottomSheet } from '@/components/destination-bottom-sheet';

// Default location: San Francisco
const INITIAL_REGION = {
  latitude: 37.78825,
  longitude: -122.4324,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

export default function HomeScreen() {
  const handleSearchPress = () => {
    // TODO: Navigate to search screen
    console.log('Search pressed');
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
        <DestinationBottomSheet onSearchPress={handleSearchPress} />
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
