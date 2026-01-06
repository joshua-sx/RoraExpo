/**
 * @deprecated This screen is deprecated. The home map with ride sheet is now
 * handled by app/(tabs)/index.tsx with the RideSheet component.
 * See: src/features/ride/components/RideSheet.tsx
 *
 * This file will be removed in a future cleanup.
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Dimensions,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useRouter } from 'expo-router';
import { DEFAULT_MAP_CENTER } from '../../../utils/constants';

const ZONE_CHIPS = [
  { id: 'airport', label: 'Airport', lat: 18.041, lng: -63.1089 },
  { id: 'cruise_port', label: 'Cruise Port', lat: 18.0237, lng: -63.0458 },
  { id: 'maho', label: 'Maho Beach', lat: 18.0384, lng: -63.1156 },
];

export const HomeMapScreen = () => {
  const router = useRouter();
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const handleZoneChipPress = (zone: typeof ZONE_CHIPS[0]) => {
    // Navigate to route estimate screen with destination pre-filled
    router.push({
      // @ts-ignore - Route is deprecated and will be removed
      pathname: '/ride/route-estimate',
      params: {
        destinationLat: zone.lat,
        destinationLng: zone.lng,
        destinationLabel: zone.label,
      },
    });
  };

  const handleWhereToPress = () => {
    // @ts-ignore - Route is deprecated and will be removed
    router.push('/ride/route-estimate');
  };

  return (
    <View style={styles.container}>
      {/* Map */}
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: userLocation?.latitude || DEFAULT_MAP_CENTER.latitude,
          longitude: userLocation?.longitude || DEFAULT_MAP_CENTER.longitude,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
        showsUserLocation
        showsMyLocationButton
      >
        {userLocation && (
          <Marker
            coordinate={{
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
            }}
            title="Your Location"
          />
        )}
      </MapView>

      {/* Top Search Bar */}
      <View style={styles.searchContainer}>
        <TouchableOpacity style={styles.searchBar} onPress={handleWhereToPress}>
          <Text style={styles.searchPlaceholder}>Where to?</Text>
        </TouchableOpacity>
      </View>

      {/* Zone Chips */}
      <View style={styles.zoneChipsContainer}>
        <Text style={styles.zoneChipsTitle}>Quick destinations</Text>
        <View style={styles.zoneChips}>
          {ZONE_CHIPS.map((zone) => (
            <TouchableOpacity
              key={zone.id}
              style={styles.zoneChip}
              onPress={() => handleZoneChipPress(zone)}
            >
              <Text style={styles.zoneChipText}>{zone.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  searchContainer: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
  },
  searchBar: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchPlaceholder: {
    fontSize: 16,
    color: '#999',
  },
  zoneChipsContainer: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  zoneChipsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 12,
  },
  zoneChips: {
    flexDirection: 'row',
    gap: 8,
  },
  zoneChip: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  zoneChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
});
