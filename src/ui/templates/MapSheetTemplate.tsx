import React, { useRef, useMemo, ReactNode } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import MapView, { Region } from 'react-native-maps';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MapErrorBoundary } from '../components/MapErrorBoundary';
import { useThemeColor } from '@/src/hooks/use-theme-color';
import { getTabBarHeight } from '@/src/utils/safe-area';
import { space } from '../tokens/spacing';

// Sheet border radius (24px - larger than standard lg for visual prominence)
const SHEET_RADIUS = 24;

interface MapSheetTemplateProps {
  /**
   * Initial map region to display
   */
  initialRegion: Region;
  /**
   * Content to render inside the map (markers, polylines, etc.)
   */
  mapContent?: ReactNode;
  /**
   * Content to render in the bottom sheet
   */
  sheetContent: ReactNode;
  /**
   * Snap points for the bottom sheet (percentages or pixel values)
   * @default ['70%', '12%']
   */
  snapPoints?: (string | number)[];
  /**
   * Initial snap index
   * @default 0
   */
  initialSnapIndex?: number;
  /**
   * Whether to show user location on map
   * @default true
   */
  showsUserLocation?: boolean;
  /**
   * Callback when map is ready
   */
  onMapReady?: () => void;
  /**
   * Ref to access MapView imperatively
   */
  mapRef?: React.RefObject<MapView>;
  /**
   * Additional content to overlay on the map (modals, FABs, etc.)
   */
  overlayContent?: ReactNode;
  /**
   * Custom style for the sheet content container
   */
  sheetContentStyle?: ViewStyle;
}

/**
 * Template for screens with a fullscreen map and bottom sheet.
 *
 * Common pattern used in:
 * - Home screen (map + destination sheet)
 * - Trip preview (map + trip details sheet)
 * - Driver tracking (map + driver info sheet)
 *
 * @example
 * ```tsx
 * <MapSheetTemplate
 *   initialRegion={SINT_MAARTEN_REGION}
 *   mapContent={
 *     <>
 *       <Marker coordinate={origin} />
 *       <Polyline coordinates={route} />
 *     </>
 *   }
 *   sheetContent={<TripDetails />}
 * />
 * ```
 */
export function MapSheetTemplate({
  initialRegion,
  mapContent,
  sheetContent,
  snapPoints: customSnapPoints,
  initialSnapIndex = 0,
  showsUserLocation = true,
  onMapReady,
  mapRef: externalMapRef,
  overlayContent,
  sheetContentStyle,
}: MapSheetTemplateProps) {
  const internalMapRef = useRef<MapView>(null);
  const mapRef = externalMapRef || internalMapRef;
  const bottomSheetRef = useRef<BottomSheet>(null);
  const insets = useSafeAreaInsets();

  const tabBarHeight = getTabBarHeight(insets);

  // Theme colors
  const surfaceColor = useThemeColor(
    { light: '#FFFFFF', dark: '#161616' },
    'surface'
  );
  const handleIndicatorColor = useThemeColor(
    { light: '#E3E6E3', dark: '#2F3237' },
    'border'
  );

  const snapPoints = useMemo(
    () => customSnapPoints || ['70%', '12%'],
    [customSnapPoints]
  );

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.container}>
        {/* Fullscreen Map */}
        <MapErrorBoundary>
          <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={initialRegion}
            showsUserLocation={showsUserLocation}
            showsMyLocationButton={false}
            showsCompass={false}
            onMapReady={onMapReady}
          >
            {mapContent}
          </MapView>
        </MapErrorBoundary>

        {/* Bottom Sheet */}
        <BottomSheet
          ref={bottomSheetRef}
          index={initialSnapIndex}
          snapPoints={snapPoints}
          enablePanDownToClose={false}
          backgroundStyle={[
            styles.bottomSheetBackground,
            { backgroundColor: surfaceColor },
          ]}
          handleIndicatorStyle={[
            styles.handleIndicator,
            { backgroundColor: handleIndicatorColor },
          ]}
        >
          <BottomSheetScrollView
            style={styles.bottomSheetContent}
            contentContainerStyle={[
              { paddingBottom: tabBarHeight + space[4] },
              sheetContentStyle,
            ]}
            scrollEnabled={true}
          >
            {sheetContent}
          </BottomSheetScrollView>
        </BottomSheet>

        {/* Overlay content (modals, FABs, etc.) */}
        {overlayContent}
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
  bottomSheetBackground: {
    borderTopLeftRadius: SHEET_RADIUS,
    borderTopRightRadius: SHEET_RADIUS,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
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
    flex: 1,
  },
});
