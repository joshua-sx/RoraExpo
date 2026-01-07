import { AnimatedVenueHeader } from "@/src/features/explore/components/animated-venue-header";
import { getVenueById } from "@/src/features/explore/data/venues";
import { useThemeColor } from "@/src/hooks/use-theme-color";
import { googleMapsService } from "@/src/services/google-maps.service";
import { useLocationStore } from "@/src/store/location-store";
import { useRouteStore } from "@/src/store/route-store";
import { ThemedText } from "@/src/ui/components/themed-text";
import { ThemedView } from "@/src/ui/components/themed-view";
import { MapErrorBoundary } from "@/src/ui/components/MapErrorBoundary";
import { Button } from "@/src/ui/components/Button";
import { calculatePrice } from "@/src/utils/pricing";
import { extractRouteData } from "@/src/utils/route-validation";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, Pressable, StyleSheet, View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "@/src/ui/tokens/colors";
import { space } from "@/src/ui/tokens/spacing";

export default function VenueDetailScreen() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const router = useRouter();
	const insets = useSafeAreaInsets();

	const [isSaved, setIsSaved] = useState(false);
	const [isLoadingRoute, setIsLoadingRoute] = useState(false);

	const { setOrigin, setDestination, setRouteData, setError } = useRouteStore();
	const { currentLocation, formattedAddress, permissionGranted } =
		useLocationStore();

	const backgroundColor = useThemeColor(
		{ light: "#F9F9F9", dark: "#0E0F0F" },
		"background",
	);
	const cardBackgroundColor = useThemeColor(
		{ light: "#FFFFFF", dark: "#161616" },
		"surface",
	);
	const subtextColor = useThemeColor(
		{ light: "#5C5F62", dark: "#A0A5AA" },
		"textSecondary",
	);
	const primaryColor = useThemeColor({}, "tint");

	const venue = getVenueById(id);

	const handleSavePress = useCallback(() => {
		setIsSaved((prev) => !prev);
	}, []);

	const handleGetRide = useCallback(async () => {
		if (!venue) return;

		setIsLoadingRoute(true);

		try {
			// Use user's actual location from store, fallback to Sint Maarten
			const userLocation = currentLocation || {
				latitude: 18.0425,
				longitude: -63.0548,
			};

			// Fetch route from Google Maps
			const directions = await googleMapsService.getDirections(userLocation, {
				latitude: venue.latitude,
				longitude: venue.longitude,
			});
			const { distanceKm, durationMin, coordinates } =
				extractRouteData(directions);

			const { price, version } = calculatePrice(distanceKm, durationMin);

			// Set origin with actual location info
			setOrigin({
				placeId: permissionGranted ? "current-location" : "manual-location",
				name: permissionGranted
					? "Current Location"
					: formattedAddress || "Your Location",
				description: formattedAddress || "Your current location",
				coordinates: userLocation,
			});

			// Set destination (venue)
			setDestination({
				placeId: venue.id,
				name: venue.name,
				description: venue.description,
				coordinates: { latitude: venue.latitude, longitude: venue.longitude },
			});

			// Set route data
			setRouteData({
				distance: distanceKm,
				duration: durationMin,
				price,
				coordinates: coordinates,
				quote: {
					estimatedPrice: price,
					currency: "USD" as const,
					pricingVersion: version,
					createdAt: new Date().toISOString(),
				},
			});

			// Navigate to trip preview
			router.push("/trip-preview");
		} catch (error) {
			console.error("[venue] Error fetching route:", error);
			const message =
				error instanceof Error ? error.message : "Failed to calculate route";
			setError(message);
			const isNoRoute = message === "No route found";
			Alert.alert(
				isNoRoute ? "No route found" : "Service error",
				isNoRoute
					? "Try a different pickup or destination."
					: "We could not calculate this route. Please try again.",
			);
		} finally {
			setIsLoadingRoute(false);
		}
	}, [
		venue,
		currentLocation,
		permissionGranted,
		formattedAddress,
		router,
		setOrigin,
		setDestination,
		setRouteData,
		setError,
	]);

	if (!venue) {
		return (
			<ThemedView style={[styles.container, { paddingTop: insets.top }]}>
				<View style={styles.errorContainer}>
					<Ionicons
						name="alert-circle-outline"
						size={48}
						color={subtextColor}
					/>
					<ThemedText style={styles.errorText}>Venue not found</ThemedText>
					<Pressable
						style={[styles.backButton, { borderColor: primaryColor }]}
						onPress={() => router.back()}
					>
						<ThemedText
							style={[styles.backButtonText, { color: primaryColor }]}
						>
							Go back
						</ThemedText>
					</Pressable>
				</View>
			</ThemedView>
		);
	}

	return (
		<ThemedView style={[styles.container, { backgroundColor }]}>
			<AnimatedVenueHeader
				venue={venue}
				isSaved={isSaved}
				onSavePress={handleSavePress}
				onBackPress={() => router.back()}
			>
				{/* Ride CTA Block */}
				<View style={[styles.rideCta, { backgroundColor: cardBackgroundColor }]}>
					<View style={styles.rideCtaInfo}>
						<Ionicons name="time-outline" size={16} color={subtextColor} />
						<ThemedText style={[styles.rideCtaText, { color: subtextColor }]}>
							Est. ride time: {venue.estimatedDuration || 12} min
						</ThemedText>
					</View>
					<Button
						label="Get a ride"
						onPress={handleGetRide}
						loading={isLoadingRoute}
					/>
				</View>

				{/* About Section */}
					<View
						style={[styles.section, { backgroundColor: cardBackgroundColor }]}
					>
						<ThemedText style={styles.sectionTitle}>ABOUT</ThemedText>
						<ThemedText style={styles.description}>
							{venue.description}
						</ThemedText>
					</View>

					{/* Hours & Info Section */}
					{(venue.hours || venue.amenities) && (
						<View
							style={[styles.section, { backgroundColor: cardBackgroundColor }]}
						>
							{venue.hours && (
								<View style={styles.infoRow}>
									<Ionicons
										name="time-outline"
										size={20}
										color={subtextColor}
									/>
									<ThemedText style={styles.infoText}>{venue.hours}</ThemedText>
								</View>
							)}
							{venue.amenities && venue.amenities.length > 0 && (
								<View style={styles.amenitiesContainer}>
									{venue.amenities.map((amenity, index) => (
										<View key={index} style={styles.infoRow}>
											<Ionicons
												name="checkmark-circle-outline"
												size={18}
												color={primaryColor}
											/>
											<ThemedText style={styles.amenityText}>
												{amenity}
											</ThemedText>
										</View>
									))}
								</View>
							)}
						</View>
					)}

					{/* Map Preview */}
					<View
						style={[styles.section, { backgroundColor: cardBackgroundColor }]}
					>
						<ThemedText style={styles.sectionTitle}>LOCATION</ThemedText>
						<View style={styles.mapContainer}>
							<MapErrorBoundary>
								<MapView
									provider={PROVIDER_GOOGLE}
									style={styles.map}
									initialRegion={{
										latitude: venue.latitude,
										longitude: venue.longitude,
										latitudeDelta: 0.01,
										longitudeDelta: 0.01,
									}}
									scrollEnabled={false}
									zoomEnabled={false}
								>
									<Marker
										coordinate={{
											latitude: venue.latitude,
											longitude: venue.longitude,
										}}
										pinColor={primaryColor}
									/>
								</MapView>
							</MapErrorBoundary>
						</View>
						<View style={styles.distanceRow}>
							<Ionicons
								name="navigate-outline"
								size={18}
								color={subtextColor}
							/>
							<ThemedText
								style={[styles.distanceText, { color: subtextColor }]}
							>
								{venue.distance} km away · {venue.estimatedDuration || 12} min
								drive
							</ThemedText>
						</View>
					</View>
			</AnimatedVenueHeader>
		</ThemedView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	rideCta: {
		marginHorizontal: 16,
		marginTop: 16,
		padding: 16,
		borderRadius: 12,
		gap: 12,
	},
	rideCtaInfo: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
	},
	rideCtaText: {
		fontSize: 14,
	},
	section: {
		marginHorizontal: 16,
		marginTop: 16,
		padding: 20,
		borderRadius: 16,
	},
	sectionTitle: {
		fontSize: 12,
		fontWeight: "600",
		letterSpacing: 0.5,
		opacity: 0.6,
		marginBottom: 12,
	},
	description: {
		fontSize: 15,
		lineHeight: 24,
	},
	infoRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 12,
		marginBottom: 10,
	},
	infoText: {
		fontSize: 15,
	},
	amenitiesContainer: {
		marginTop: 8,
	},
	amenityText: {
		fontSize: 14,
	},
	mapContainer: {
		height: 150,
		borderRadius: 12,
		overflow: "hidden",
		marginBottom: 12,
	},
	map: {
		...StyleSheet.absoluteFillObject,
	},
	distanceRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
	},
	distanceText: {
		fontSize: 14,
	},
	errorContainer: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		padding: 20,
	},
	errorText: {
		fontSize: 18,
		fontWeight: "500",
		marginTop: 16,
		marginBottom: 20,
	},
	backButton: {
		paddingHorizontal: 24,
		paddingVertical: 12,
		borderRadius: 8,
		borderWidth: 1,
	},
	backButtonText: {
		fontSize: 14,
		fontWeight: "500",
	},
});
