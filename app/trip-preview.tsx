import { Ionicons } from "@expo/vector-icons";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, View, useWindowDimensions } from "react-native";
import Animated, { interpolate, runOnJS, useAnimatedStyle, useSharedValue, withSpring, withTiming } from "react-native-reanimated";
import { Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import QRCode from "react-native-qrcode-svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";

import { ThemedText } from "@/src/ui/components/themed-text";
import { MapErrorBoundary } from "@/src/ui/components/MapErrorBoundary";
import { SINT_MAARTEN_REGION } from "@/src/constants/config";
import { Colors, BorderRadius, Spacing } from "@/src/constants/design-tokens";
import { getDriverById } from "@/src/features/drivers/data/drivers";
import { useThemeColor } from "@/src/hooks/use-theme-color";
import { useRouteStore } from "@/src/store/route-store";
import { useTripHistoryStore } from "@/src/store/trip-history-store";
import { formatDistance, formatDuration, formatPrice } from "@/src/utils/pricing";
import { fitMapToRoute } from "@/src/utils/map";
import { useToast } from "@/src/ui/providers/ToastProvider";
import { generateManualCode } from "@/src/utils/trip-qr";
import {
	createRideSession,
	startDiscovery,
	placeDetailsToRideLocation,
	type RideSession,
} from "@/src/services/rides.service";

/**
 * Validates that coordinates array contains valid latitude/longitude objects
 */
function validateCoordinates(coords: { latitude: number; longitude: number }[]): boolean {
	if (!Array.isArray(coords) || coords.length === 0) return false;
	return coords.every(
		coord =>
			coord &&
			typeof coord.latitude === 'number' &&
			typeof coord.longitude === 'number' &&
			!Number.isNaN(coord.latitude) &&
			!Number.isNaN(coord.longitude)
	);
}

export default function TripPreviewScreen() {
	const router = useRouter();
	const insets = useSafeAreaInsets();
	const { height: screenHeight } = useWindowDimensions();
	const mapRef = useRef<MapView>(null);
	const bottomSheetRef = useRef<BottomSheet>(null);
	const { showToast } = useToast();
	const animatedIndex = useSharedValue(1); // Start expanded (index 1)
	const [isCollapsed, setIsCollapsed] = useState(false);

	const { origin, destination, routeData, selectedDriverId, clearDriver } = useRouteStore();
	const { addTrip, toggleSaved } = useTripHistoryStore();

	// Get selected driver if any
	const selectedDriver = selectedDriverId ? getDriverById(selectedDriverId) : null;
	const [currentPage, setCurrentPage] = useState(0); // 0 = details, 1 = qr
	const [tripId, setTripId] = useState<string | null>(null);
	const [serverRideSession, setServerRideSession] = useState<RideSession | null>(null);
	const [isCreatingRide, setIsCreatingRide] = useState(false);
	const [isSaved, setIsSaved] = useState(false);
	const [qrValue, setQrValue] = useState<string>('');
	const [manualCode, setManualCode] = useState<string>('');
	const [isFindingDrivers, setIsFindingDrivers] = useState(false);
	const [mapReady, setMapReady] = useState(false);

	// Gesture state for horizontal swipe (using Reanimated)
	const translateX = useSharedValue(0);

	// Theme colors
	const surfaceColor = useThemeColor({ light: "#FFFFFF", dark: "#161616" }, "surface");
	const textColor = useThemeColor({ light: "#262626", dark: "#E5E7EA" }, "text");
	const secondaryTextColor = useThemeColor({ light: "#5C5F62", dark: "#8B8F95" }, "textSecondary");
	const borderColor = useThemeColor({ light: "#E3E6E3", dark: "#2F3237" }, "border");
	const handleIndicatorColor = useThemeColor({ light: "#E3E6E3", dark: "#2F3237" }, "border");
	const tintColor = useThemeColor({}, "tint");

	// Animated styles for collapse/expand transitions
	// index 0 = collapsed, index 1 = expanded
	const contentAnimatedStyle = useAnimatedStyle(() => {
		// Content visible when expanded (index 1), hidden when collapsed (index 0)
		const opacity = interpolate(animatedIndex.value, [0, 0.5, 1], [0, 0.5, 1], "clamp");
		return { opacity };
	});

	const hintAnimatedStyle = useAnimatedStyle(() => {
		// Hint visible when collapsed (index 0), hidden when expanded (index 1)
		const opacity = interpolate(animatedIndex.value, [0, 0.5, 1], [1, 0.5, 0], "clamp");
		return { opacity };
	});

	// Handle sheet position changes
	// index 0 = collapsed, index 1 = expanded
	const handleSheetChange = useCallback((index: number) => {
		setIsCollapsed(index === 0);
	}, []);

	// Note: This screen is NOT in tab layout, so we don't need to account for tab bar
	// Just use safe area bottom inset for padding

	// Bottom sheet snap points: collapsed (12%) and expanded (70%)
	// BottomSheet snap points go from smallest to largest
	const collapsedHeight = useMemo(
		() => Math.round(screenHeight * 0.12),
		[screenHeight],
	);
	const expandedHeight = useMemo(
		() => Math.round(screenHeight * 0.70),
		[screenHeight],
	);
	const snapPoints = useMemo(() => [collapsedHeight, expandedHeight], [collapsedHeight, expandedHeight]);

	const mapEdgePadding = useMemo(
		() => ({
			top: insets.top + 80,
			right: 60,
			bottom: expandedHeight + Spacing.xl,
			left: 60,
		}),
		[insets.top, expandedHeight],
	);

	const handleFitMapToRoute = useCallback(
		(coords: { latitude: number; longitude: number }[]) => {
			if (!mapRef.current) {
				console.warn('Map ref not ready');
				return;
			}
			fitMapToRoute(mapRef, coords, {
				edgePadding: mapEdgePadding,
			});
		},
		[mapEdgePadding],
	);

	// Validate route data exists and is valid
	useEffect(() => {
		if (!routeData || !origin || !destination) {
			console.warn("No route data available, returning to input");
			router.replace("/route-input");
			return;
		}

		if (!validateCoordinates(routeData.coordinates)) {
			console.error("Invalid route coordinates", routeData.coordinates);
			showToast("Route data is invalid. Please try again.");
			router.replace("/route-input");
			return;
		}

		if (typeof routeData.price !== 'number' || routeData.price <= 0) {
			console.error("Invalid route price", routeData.price);
			showToast("Unable to calculate price. Please try again.");
			router.replace("/route-input");
			return;
		}
	}, [routeData, origin, destination, router, showToast]);

	// Create safe quote object with fallback
	const quote = useMemo(() => {
		return routeData?.quote || {
			estimatedPrice: routeData?.price || 0,
			currency: 'USD' as const,
			pricingVersion: 'v1.0',
			createdAt: new Date().toISOString(),
		};
	}, [routeData]);

	// Create ride session on server and save to local history
	useEffect(() => {
		if (routeData && origin && destination && !tripId && !isCreatingRide) {
			const createRide = async () => {
				setIsCreatingRide(true);

				try {
					// Create ride session on server
					const response = await createRideSession({
						origin: placeDetailsToRideLocation(origin),
						destination: placeDetailsToRideLocation(destination),
						rora_fare_amount: routeData.price,
						pricing_calculation_metadata: {
							distance_km: routeData.distance,
							duration_min: routeData.duration,
							pricing_version: quote.pricingVersion,
						},
						request_type: selectedDriverId ? 'direct' : 'broadcast',
						target_driver_id: selectedDriverId || undefined,
					});

					if (response.success && response.ride_session) {
						const serverRide = response.ride_session;
						setServerRideSession(serverRide);
						setTripId(serverRide.id);

						// Use the QR token from server for the QR code
						if (response.qr_token_jti) {
							setQrValue(response.qr_token_jti);
						} else {
							setQrValue(serverRide.id);
						}

						console.log('[trip-preview] Ride session created on server:', serverRide.id);

						// Also save to local history for offline access
						addTrip({
							id: serverRide.id,
							timestamp: Date.now(),
							origin,
							destination,
							routeData,
							quote,
							status: selectedDriverId ? 'pending' : 'not_taken',
							driverId: selectedDriverId || undefined,
						});
					} else {
						// Fallback to local-only if server fails
						console.warn('[trip-preview] Server ride creation failed, using local fallback:', response.error);
						const localTripId = `local-trip-${Date.now()}`;
						setTripId(localTripId);
						setQrValue(localTripId);

						addTrip({
							id: localTripId,
							timestamp: Date.now(),
							origin,
							destination,
							routeData,
							quote,
							status: selectedDriverId ? 'pending' : 'not_taken',
							driverId: selectedDriverId || undefined,
						});
					}
				} catch (error) {
					console.error('[trip-preview] Error creating ride session:', error);
					// Fallback to local-only
					const localTripId = `local-trip-${Date.now()}`;
					setTripId(localTripId);
					setQrValue(localTripId);

					addTrip({
						id: localTripId,
						timestamp: Date.now(),
						origin,
						destination,
						routeData,
						quote,
						status: selectedDriverId ? 'pending' : 'not_taken',
						driverId: selectedDriverId || undefined,
					});
				} finally {
					setIsCreatingRide(false);

					// Clear driver from route store after assignment
					if (selectedDriverId) {
						clearDriver();
					}
				}
			};

			createRide();
		}
	}, [routeData, origin, destination, tripId, isCreatingRide, addTrip, selectedDriverId, clearDriver, quote]);

	// Fit map to show full route when map is ready
	useEffect(() => {
		if (mapReady && routeData?.coordinates && validateCoordinates(routeData.coordinates)) {
			handleFitMapToRoute(routeData.coordinates);
		}
	}, [mapReady, routeData, handleFitMapToRoute]);

	// Generate manual code when trip is created (QR value is set during ride creation)
	useEffect(() => {
		if (tripId && qrValue) {
			// Generate manual code based on the QR value
			generateManualCode(qrValue).then(setManualCode).catch((error) => {
				console.error('[trip-preview] Failed to generate manual code:', error);
			});
		}
	}, [tripId, qrValue]);

	const handleClose = useCallback(() => {
		// Close and clear the quote session, navigate back to home
		router.push("/");
	}, [router]);

	const handleSaveAndGoHome = useCallback(() => {
		if (tripId && !isSaved) {
			toggleSaved(tripId);
			setIsSaved(true);
		}

		// Show success feedback
		showToast("Trip saved successfully");
		Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

		// Delay navigation to show toast
		setTimeout(() => {
			router.push("/");
		}, 800);
	}, [tripId, toggleSaved, isSaved, showToast, router]);

	const handleNotifyDrivers = useCallback(async () => {
		if (!tripId) {
			showToast("Please wait for ride to be created");
			return;
		}

		// Auto-save trip if not already saved
		if (!isSaved) {
			toggleSaved(tripId);
			setIsSaved(true);
		}

		// Show loading state
		setIsFindingDrivers(true);
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

		try {
			// Call server to start driver discovery
			const response = await startDiscovery(tripId, 0); // Wave 0 = favorites first

			if (response.success) {
				const driverCount = response.notified_drivers || 0;
				Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

				// Navigate to offers screen to see driver responses
				router.push({
					pathname: "/offers",
					params: {
						rideSessionId: tripId,
						roraFare: routeData?.price?.toString() || "0",
					},
				});

				if (driverCount > 0) {
					showToast(`Notified ${driverCount} nearby drivers`);
				}
			} else {
				console.error('[trip-preview] Discovery failed:', response.error);
				Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
				showToast("Failed to notify drivers. Please try again.");
			}
		} catch (error) {
			console.error('[trip-preview] Error starting discovery:', error);
			Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
			showToast("Something went wrong. Please try again.");
		} finally {
			setIsFindingDrivers(false);
		}
	}, [tripId, toggleSaved, isSaved, showToast, router, routeData?.price]);

	// Animated style for the swipeable content
	const swipeAnimatedStyle = useAnimatedStyle(() => ({
		transform: [{ translateX: translateX.value }],
	}));

	// Horizontal swipe gesture for page navigation
	const panGesture = Gesture.Pan()
		.onUpdate((event) => {
			translateX.value = event.translationX;
		})
		.onEnd((event) => {
			const SWIPE_THRESHOLD = 50;
			if (event.translationX > SWIPE_THRESHOLD && currentPage === 1) {
				// Swipe right → go to page 0
				translateX.value = withTiming(0, { duration: 200 }, () => {
					runOnJS(setCurrentPage)(0);
				});
			} else if (event.translationX < -SWIPE_THRESHOLD && currentPage === 0) {
				// Swipe left → go to page 1
				translateX.value = withTiming(0, { duration: 200 }, () => {
					runOnJS(setCurrentPage)(1);
				});
			} else {
				// Snap back
				translateX.value = withSpring(0);
			}
		});

	if (!routeData || !origin || !destination) {
		return null;
	}

	return (
		<GestureHandlerRootView style={styles.container}>
			{/* Fullscreen Map */}
			<MapErrorBoundary>
				<MapView
					provider={PROVIDER_GOOGLE}
					ref={mapRef}
					style={styles.map}
					initialRegion={SINT_MAARTEN_REGION}
					showsUserLocation
					showsMyLocationButton={false}
					showsCompass={false}
					onMapReady={() => setMapReady(true)}
				>
					{/* Origin Marker */}
					<Marker
						coordinate={origin.coordinates}
						title={origin.name}
						pinColor={Colors.primary}
					/>

					{/* Destination Marker */}
					<Marker
						coordinate={destination.coordinates}
						title={destination.name}
						pinColor="#FF5733"
					/>

					{/* Route Polyline */}
					<Polyline
						coordinates={routeData.coordinates}
						strokeWidth={4}
						strokeColor="#000000"
					/>
				</MapView>
			</MapErrorBoundary>

			{/* Bottom Sheet */}
			<BottomSheet
				ref={bottomSheetRef}
				index={1}
				snapPoints={snapPoints}
				enablePanDownToClose={false}
				animatedIndex={animatedIndex}
				onChange={handleSheetChange}
				backgroundStyle={[styles.bottomSheetBackground, { backgroundColor: surfaceColor }]}
				handleIndicatorStyle={[
					styles.handleIndicator,
					{ backgroundColor: handleIndicatorColor },
				]}
			>
				<BottomSheetScrollView
					style={styles.bottomSheetContent}
					contentContainerStyle={{ paddingBottom: insets.bottom + Spacing.md }}
					scrollEnabled={true}
				>
					{/* Main content - fades out when collapsed */}
					<Animated.View style={contentAnimatedStyle} pointerEvents={isCollapsed ? "none" : "auto"}>
						{/* Page Indicator (dots) - Tappable to switch pages */}
						<Pressable
						onPress={() => setCurrentPage(prev => prev === 0 ? 1 : 0)}
						style={styles.pageIndicator}
					>
						<View
							style={[
								styles.dot,
								currentPage === 0
									? { backgroundColor: tintColor }
									: { backgroundColor: "#D0D3D7" },
							]}
						/>
						<View
							style={[
								styles.dot,
								currentPage === 1
									? { backgroundColor: tintColor }
									: { backgroundColor: "#D0D3D7" },
							]}
						/>
					</Pressable>

					{/* Header with title and close button */}
					<View style={styles.sheetHeader}>
						<View style={{ width: 40 }} />
						<ThemedText style={styles.sheetTitle}>Ride Quote</ThemedText>
						<Pressable
							onPress={handleClose}
							style={styles.closeButton}
							hitSlop={8}
							accessible
							accessibilityRole="button"
							accessibilityLabel="Close quote"
						>
							<Ionicons name="close" size={24} color={textColor} />
						</Pressable>
					</View>

					{/* Swipeable Content Container */}
					<GestureDetector gesture={panGesture}>
						<Animated.View style={swipeAnimatedStyle}>
							{/* Page 1: Trip Details */}
							{currentPage === 0 && (
								<View style={styles.page}>
									{/* Route: Stacked 2-line layout */}
									<View style={styles.routeStacked}>
										<View style={styles.routeRow}>
											<View style={[styles.routeDotSmall, { backgroundColor: tintColor }]} />
											<ThemedText style={styles.routeLocationText} numberOfLines={2}>
												{origin.name}
											</ThemedText>
										</View>
										<View style={styles.routeRow}>
											<View style={[styles.routeDotSmall, { backgroundColor: "#FF5733" }]} />
											<ThemedText style={styles.routeLocationText} numberOfLines={2}>
												{destination.name}
											</ThemedText>
										</View>
									</View>

									{/* Trip Details */}
									<View style={styles.tripDetails}>
										<View style={styles.detailItem}>
											<Ionicons name="time-outline" size={20} color={secondaryTextColor} />
											<ThemedText style={styles.detailText}>
												{formatDuration(routeData.duration)}
											</ThemedText>
										</View>
										<View style={styles.detailItem}>
											<Ionicons name="car-outline" size={20} color={secondaryTextColor} />
											<ThemedText style={styles.detailText}>
												{formatDistance(routeData.distance)}
											</ThemedText>
										</View>
									</View>

									{/* Assigned Driver Section */}
									{selectedDriver && (
										<View style={[styles.assignedDriverSection, { borderColor }]}>
											<ThemedText style={styles.sectionTitle}>Assigned Driver</ThemedText>
											<View style={styles.driverCard}>
												<View style={[styles.driverAvatar, { backgroundColor: borderColor }]}>
													<Ionicons name="person" size={24} color={secondaryTextColor} />
												</View>
												<View style={styles.driverDetails}>
													<ThemedText style={styles.driverName}>{selectedDriver.name}</ThemedText>
													<ThemedText style={[styles.driverMeta, { color: secondaryTextColor }]}>
														★ {selectedDriver.rating} • {selectedDriver.vehicleType}
													</ThemedText>
												</View>
												<Pressable
													onPress={() => router.push(`/driver/${selectedDriver.id}`)}
													style={[styles.viewProfileButton, { borderColor }]}
												>
													<ThemedText style={[styles.viewProfileText, { color: tintColor }]}>
														View
													</ThemedText>
												</Pressable>
											</View>
										</View>
									)}

									{/* Price Display */}
									<View style={[styles.priceContainer, { borderColor }]}>
										<ThemedText style={styles.priceLabel}>Estimated fare</ThemedText>
										<ThemedText style={styles.price}>
											{formatPrice(routeData.price)}
										</ThemedText>
									</View>

									{/* Action Buttons */}
									<View style={styles.actionButtons}>
										{/* Primary CTA: Notify Drivers or Notify [Driver Name] */}
										<Pressable
											onPress={handleNotifyDrivers}
											style={[styles.primaryButton, { backgroundColor: tintColor }]}
											disabled={isFindingDrivers}
											accessible
											accessibilityRole="button"
											accessibilityLabel={
												selectedDriver
													? `Notify ${selectedDriver.name}`
													: 'Notify available drivers'
											}
										>
											{isFindingDrivers ? (
												<>
													<ActivityIndicator size="small" color="#FFFFFF" />
													<ThemedText style={styles.primaryButtonText}>
														{selectedDriver ? `Notifying ${selectedDriver.name}...` : 'Notifying drivers...'}
													</ThemedText>
												</>
											) : (
												<>
													<Ionicons name="megaphone-outline" size={20} color="#FFFFFF" />
													<ThemedText style={styles.primaryButtonText}>
														{selectedDriver ? `Notify ${selectedDriver.name}` : 'Notify drivers'}
													</ThemedText>
												</>
											)}
										</Pressable>

										{/* Secondary CTA: Save Trip */}
										<Pressable
											onPress={handleSaveAndGoHome}
											style={[styles.secondaryButton, { borderColor }]}
											accessible
											accessibilityRole="button"
											accessibilityLabel="Save trip for later"
										>
											<Ionicons name="heart-outline" size={20} color={tintColor} />
											<ThemedText style={[styles.secondaryButtonText, { color: tintColor }]}>
												Save Trip
											</ThemedText>
										</Pressable>
									</View>
								</View>
							)}

							{/* Page 2: QR Code */}
							{currentPage === 1 && (
								<View style={styles.page}>
									{/* QR Code */}
									<View style={styles.qrContainer}>
										{qrValue ? (
											<QRCode
												value={qrValue}
												size={200}
												backgroundColor="white"
												color="black"
											/>
										) : (
											<ActivityIndicator size="large" color={tintColor} />
										)}
									</View>

									{/* Instruction Text */}
									<ThemedText style={styles.qrInstruction}>
										{selectedDriver ? `Show this code to ${selectedDriver.name}` : 'Show this code to your driver'}
									</ThemedText>
									<ThemedText style={[styles.qrSubtext, { color: secondaryTextColor }]}>
										Let driver scan for verification
									</ThemedText>

									{/* Manual Code Fallback */}
									{manualCode && (
										<View style={styles.manualCodeContainer}>
											<ThemedText style={[styles.manualCodeLabel, { color: secondaryTextColor }]}>
												Manual Code (if scanner fails)
											</ThemedText>
											<ThemedText style={styles.manualCodeText}>
												{manualCode}
											</ThemedText>
										</View>
									)}
								</View>
							)}
						</Animated.View>
					</GestureDetector>
					</Animated.View>

					{/* Collapsed State Hint (visible when collapsed) */}
					<Animated.View style={[styles.collapsedHint, hintAnimatedStyle]} pointerEvents={isCollapsed ? "auto" : "none"}>
						<Ionicons name="chevron-up" size={20} color={secondaryTextColor} />
						<ThemedText style={[styles.collapsedHintText, { color: secondaryTextColor }]}>
							Swipe up to see details
						</ThemedText>
					</Animated.View>
				</BottomSheetScrollView>
			</BottomSheet>
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
		borderTopLeftRadius: BorderRadius.sheet,
		borderTopRightRadius: BorderRadius.sheet,
		shadowColor: "#000",
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
	sheetHeader: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingHorizontal: Spacing.lg,
		paddingVertical: Spacing.md,
	},
	sheetTitle: {
		fontSize: 18,
		fontWeight: "600",
	},
	closeButton: {
		width: 40,
		height: 40,
		alignItems: "center",
		justifyContent: "center",
	},
	pageIndicator: {
		flexDirection: "row",
		gap: 8,
		justifyContent: "center",
		paddingTop: Spacing.sm,
		paddingBottom: Spacing.xs,
	},
	dot: {
		width: 8,
		height: 8,
		borderRadius: 4,
	},
	page: {
		paddingHorizontal: Spacing.lg,
	},
	routeStacked: {
		gap: Spacing.sm,
		marginBottom: Spacing.md,
	},
	routeRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: Spacing.sm,
	},
	routeDotSmall: {
		width: 8,
		height: 8,
		borderRadius: 4,
	},
	routeLocationText: {
		flex: 1,
		fontSize: 15,
		fontWeight: "500",
	},
	tripDetails: {
		flexDirection: "row",
		gap: Spacing.xl,
		paddingVertical: Spacing.xs,
		marginBottom: Spacing.md,
	},
	detailItem: {
		flexDirection: "row",
		alignItems: "center",
		gap: Spacing.sm,
	},
	detailText: {
		fontSize: 15,
		fontWeight: "500",
	},
	assignedDriverSection: {
		paddingVertical: Spacing.md,
		paddingHorizontal: Spacing.lg,
		borderWidth: 1,
		borderRadius: BorderRadius.card,
		marginBottom: Spacing.md,
	},
	sectionTitle: {
		fontSize: 13,
		fontWeight: "600",
		opacity: 0.6,
		marginBottom: Spacing.md,
		letterSpacing: 0.5,
		textTransform: "uppercase",
	},
	driverCard: {
		flexDirection: "row",
		alignItems: "center",
		gap: Spacing.md,
	},
	driverAvatar: {
		width: 48,
		height: 48,
		borderRadius: 24,
		alignItems: "center",
		justifyContent: "center",
	},
	driverDetails: {
		flex: 1,
	},
	driverName: {
		fontSize: 16,
		fontWeight: "600",
		marginBottom: 2,
	},
	driverMeta: {
		fontSize: 13,
	},
	viewProfileButton: {
		paddingHorizontal: Spacing.md,
		paddingVertical: Spacing.sm,
		borderWidth: 1,
		borderRadius: BorderRadius.button,
	},
	viewProfileText: {
		fontSize: 14,
		fontWeight: "600",
	},
	priceContainer: {
		paddingVertical: Spacing.md,
		paddingHorizontal: Spacing.lg,
		borderWidth: 1,
		borderRadius: BorderRadius.card,
		marginBottom: Spacing.md,
	},
	priceLabel: {
		fontSize: 13,
		fontWeight: "500",
		opacity: 0.6,
		marginBottom: 4,
	},
	price: {
		fontSize: 32,
		fontWeight: "700",
		lineHeight: 38,
	},
	actionButtons: {
		gap: Spacing.md,
		marginBottom: Spacing.lg,
	},
	primaryButton: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: Spacing.sm,
		paddingVertical: Spacing.lg,
		borderRadius: BorderRadius.button,
	},
	primaryButtonText: {
		color: "#FFFFFF",
		fontSize: 17,
		fontWeight: "600",
	},
	secondaryButton: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: Spacing.sm,
		paddingVertical: Spacing.md,
		borderRadius: BorderRadius.button,
		borderWidth: 1,
	},
	secondaryButtonText: {
		fontSize: 16,
		fontWeight: "600",
	},
	qrContainer: {
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: Spacing.lg,
		marginVertical: Spacing.md,
	},
	qrInstruction: {
		fontSize: 24,
		fontWeight: "700",
		textAlign: "center",
		marginTop: Spacing.md,
	},
	qrSubtext: {
		fontSize: 14,
		fontWeight: "500",
		textAlign: "center",
		marginTop: Spacing.sm,
		paddingHorizontal: Spacing.lg,
	},
	manualCodeContainer: {
		marginTop: Spacing.md,
		paddingVertical: Spacing.md,
		paddingHorizontal: Spacing.xl,
		alignItems: "center",
	},
	manualCodeLabel: {
		fontSize: 12,
		fontWeight: "500",
		marginBottom: Spacing.sm,
		textAlign: "center",
	},
	manualCodeText: {
		fontSize: 32,
		fontWeight: "700",
		letterSpacing: 4,
		textAlign: "center",
	},
	collapsedHint: {
		alignItems: "center",
		paddingVertical: Spacing.md,
	},
	collapsedHintText: {
		fontSize: 14,
		fontWeight: "500",
	},
});
