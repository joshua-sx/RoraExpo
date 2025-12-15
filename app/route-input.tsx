import { useState, useRef, useCallback } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  FlatList,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';

import { ThemedText } from '@/components/themed-text';
import { LocationInputField } from '@/components/ui/location-input-field';
import { useThemeColor } from '@/hooks/use-theme-color';
import type { PopularLocation } from '@/components/ui/popular-location-card';

// Import locations data
const POPULAR_LOCATIONS: PopularLocation[] = [
  {
    id: '1',
    name: 'Sonesta Resort',
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop',
  },
  {
    id: '2',
    name: 'Mullet Bay',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop',
  },
  {
    id: '3',
    name: 'Lotus Nightclub',
    image: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=400&h=300&fit=crop',
  },
  {
    id: '4',
    name: 'Princess Juliana Airport',
    image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&h=300&fit=crop',
  },
  {
    id: '5',
    name: 'Maho Beach',
    image: 'https://images.unsplash.com/photo-1473116763249-2faaef81ccda?w=400&h=300&fit=crop',
  },
];

// Default location: St. Maarten
const INITIAL_REGION = {
  latitude: 18.0425,
  longitude: -63.0548,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

type FocusedField = 'origin' | 'destination' | null;
type ViewState = 'input' | 'loading' | 'preview';

export default function RouteInputScreen() {
  const router = useRouter();
  const originInputRef = useRef<TextInput>(null);
  const destinationInputRef = useRef<TextInput>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);

  const [origin, setOrigin] = useState('Current location');
  const [destination, setDestination] = useState('');
  const [focusedField, setFocusedField] = useState<FocusedField>('destination');
  const [viewState, setViewState] = useState<ViewState>('input');

  const backgroundColor = useThemeColor(
    { light: '#FFFFFF', dark: '#161616' },
    'background'
  );
  const surfaceColor = useThemeColor(
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
  const iconColor = useThemeColor(
    { light: '#5C5F62', dark: '#8B8F95' },
    'textSecondary'
  );
  const tintColor = useThemeColor({}, 'tint');
  const borderColor = useThemeColor(
    { light: '#E3E6E3', dark: '#2F3237' },
    'border'
  );
  const handleIndicatorColor = useThemeColor(
    { light: '#E3E6E3', dark: '#2F3237' },
    'border'
  );

  // Filter locations based on focused field value
  const searchQuery = focusedField === 'origin' ? origin : destination;
  const filteredLocations = POPULAR_LOCATIONS.filter((location) =>
    location.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Show "Current location" as first suggestion
  const suggestions = [
    { id: 'current', name: 'Current location', image: undefined },
    ...filteredLocations,
  ];

  const handleLocationSelect = useCallback(
    (location: PopularLocation) => {
      if (focusedField === 'origin') {
        setOrigin(location.name);
        // Auto-focus destination if empty
        if (!destination) {
          setFocusedField('destination');
          setTimeout(() => {
            destinationInputRef.current?.focus();
          }, 100);
        }
      } else if (focusedField === 'destination') {
        setDestination(location.name);
        // Both fields filled, transition to preview
        if (origin) {
          Keyboard.dismiss();
          setViewState('loading');
          // Show loading briefly then transition to preview
          setTimeout(() => {
            setViewState('preview');
          }, 800);
        }
      }
    },
    [focusedField, origin, destination]
  );

  const handleSwap = useCallback(() => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  }, [origin, destination]);

  const handleClose = useCallback(() => {
    router.back();
  }, [router]);

  const handleContinue = useCallback(() => {
    router.push({
      pathname: '/route-preview',
      params: { origin, destination },
    });
  }, [origin, destination, router]);

  // Input State UI
  if (viewState === 'input') {
    return (
      <KeyboardAvoidingView
        style={[styles.container, { backgroundColor }]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={handleClose} hitSlop={8}>
            <Ionicons name="close" size={28} color={textColor} />
          </Pressable>
          <ThemedText style={styles.headerTitle}>Your route</ThemedText>
          <View style={{ width: 28 }} />
        </View>

        {/* Input Fields Container */}
        <View style={styles.inputsContainer}>
          <LocationInputField
            ref={originInputRef}
            label="Pickup location"
            value={origin}
            onChangeText={setOrigin}
            onFocus={() => setFocusedField('origin')}
            onClear={() => setOrigin('')}
            isFocused={focusedField === 'origin'}
            placeholder="Where from?"
            rightIcon="time-outline"
          />

          <LocationInputField
            ref={destinationInputRef}
            label="Dropoff location"
            value={destination}
            onChangeText={setDestination}
            onFocus={() => setFocusedField('destination')}
            onClear={() => setDestination('')}
            isFocused={focusedField === 'destination'}
            placeholder="Where to?"
            autoFocus
            rightIcon="swap-vertical"
            onRightIconPress={handleSwap}
          />
        </View>

        {/* Suggestions List */}
        <FlatList
          data={suggestions}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }) => (
            <Pressable
              onPress={() => handleLocationSelect(item)}
              style={styles.suggestionItem}
            >
              <Ionicons
                name={item.id === 'current' ? 'location' : 'location-outline'}
                size={20}
                color={item.id === 'current' ? tintColor : iconColor}
                style={styles.suggestionIcon}
              />
              <View style={styles.suggestionTextContainer}>
                <ThemedText style={styles.suggestionName}>{item.name}</ThemedText>
                {item.id === 'current' && (
                  <ThemedText style={[styles.suggestionSubtext, { color: secondaryTextColor }]}>
                    Use current location
                  </ThemedText>
                )}
              </View>
            </Pressable>
          )}
        />
      </KeyboardAvoidingView>
    );
  }

  // Loading or Preview State
  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={[styles.container, { backgroundColor }]}>
        {/* Map */}
        <MapView
          style={styles.map}
          initialRegion={INITIAL_REGION}
          showsUserLocation
          showsMyLocationButton={false}
          showsCompass={false}
        >
          {/* Placeholder markers */}
          <Marker
            coordinate={{
              latitude: INITIAL_REGION.latitude - 0.01,
              longitude: INITIAL_REGION.longitude - 0.01,
            }}
            title={origin}
            pinColor={tintColor}
          />
          <Marker
            coordinate={{
              latitude: INITIAL_REGION.latitude + 0.01,
              longitude: INITIAL_REGION.longitude + 0.01,
            }}
            title={destination}
            pinColor="#FF5733"
          />
        </MapView>

        {/* Close Button */}
        <View style={styles.closeButtonContainer}>
          <Pressable
            onPress={handleClose}
            style={[styles.closeButton, { backgroundColor: surfaceColor }]}
            hitSlop={8}
          >
            <Ionicons name="close" size={24} color={textColor} />
          </Pressable>
        </View>

        {/* Route Details Bottom Sheet */}
        <BottomSheet
          ref={bottomSheetRef}
          index={0}
          snapPoints={['45%']}
          backgroundStyle={[styles.bottomSheetBackground, { backgroundColor: surfaceColor }]}
          handleIndicatorStyle={[
            styles.handleIndicator,
            { backgroundColor: handleIndicatorColor },
          ]}
          enablePanDownToClose={false}
        >
          <BottomSheetView style={styles.bottomSheetContent}>
            {viewState === 'loading' ? (
              // Loading State
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={tintColor} />
                <ThemedText style={[styles.loadingText, { color: secondaryTextColor }]}>
                  Finding best route...
                </ThemedText>
              </View>
            ) : (
              // Preview State
              <>
                {/* Route Info */}
                <View style={styles.routeInfo}>
                  <View style={styles.routePoint}>
                    <View style={[styles.dot, { backgroundColor: tintColor }]} />
                    <ThemedText style={styles.routeText}>{origin}</ThemedText>
                  </View>
                  <View style={[styles.routeLine, { backgroundColor: borderColor }]} />
                  <View style={styles.routePoint}>
                    <View style={[styles.dot, { backgroundColor: '#FF5733' }]} />
                    <ThemedText style={styles.routeText}>{destination}</ThemedText>
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
                <View style={[styles.priceContainer, { borderColor }]}>
                  <ThemedText style={styles.priceLabel}>Estimated fare</ThemedText>
                  <ThemedText style={styles.price}>$42</ThemedText>
                </View>

                {/* Continue Button */}
                <Pressable
                  onPress={handleContinue}
                  style={[styles.continueButton, { backgroundColor: tintColor }]}
                >
                  <ThemedText style={styles.continueButtonText}>Continue</ThemedText>
                </Pressable>
              </>
            )}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  inputsContainer: {
    paddingHorizontal: 20,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 40,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  suggestionIcon: {
    marginRight: 16,
  },
  suggestionTextContainer: {
    flex: 1,
  },
  suggestionName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  suggestionSubtext: {
    fontSize: 14,
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
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
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
  },
  priceLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  price: {
    fontSize: 28,
    fontWeight: '700',
  },
  continueButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
