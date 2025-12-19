import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { useRouter } from "expo-router";
import { useCallback, useMemo, useRef, useState } from "react";
import {
	LayoutChangeEvent,
	StyleSheet,
	View,
	useWindowDimensions,
} from "react-native";
import Animated, {
	Extrapolate,
	interpolate,
	useAnimatedStyle,
	useSharedValue,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { HomePopularCarousel } from "@/components/home-popular-carousel";
import { PillSearchBar } from "@/components/ui/pill-search-bar";
import { BorderRadius, Spacing } from "@/constants/design-tokens";
import { useThemeColor } from "@/hooks/use-theme-color";

type DestinationBottomSheetProps = {
  bottomInset?: number; // Tab bar height (optional override)
};

export function DestinationBottomSheet({
	bottomInset = 0,
}: DestinationBottomSheetProps) {
	const bottomSheetRef = useRef<BottomSheet>(null);
	const router = useRouter();
	const insets = useSafeAreaInsets();
	const { width: screenWidth } = useWindowDimensions();
	const animatedIndex = useSharedValue(1);

	// Track bottom sheet position: true = expanded (show carousel), false = collapsed (hide carousel)
	const [isExpanded, setIsExpanded] = useState(true);
	const [carouselHeight, setCarouselHeight] = useState<number | null>(null);

	const backgroundColor = useThemeColor(
		{ light: "#FFFFFF", dark: "#161616" },
		"surface",
	);
	const handleIndicatorColor = useThemeColor(
		{ light: "#E3E6E3", dark: "#2F3237" },
		"border",
	);

	// Calculate total bottom padding: device safe area + tab bar height + content padding
	// This ensures content never scrolls under the floating tab bar
	const totalBottomPadding = insets.bottom + bottomInset + Spacing.xl;

	// Two snap points: collapsed (pill only) and expanded (pill + cards)
	const snapPoints = useMemo(() => {
		const handleIndicatorSpace = 12; // Handle indicator + top margin
		const topPadding = Spacing.xl; // 20px
		const pillHeight = 60; // Updated to match new pill height

		// Collapsed state: just pill search bar
		// Use totalBottomPadding to account for safe area + tab bar + content padding
		const collapsedHeight =
			handleIndicatorSpace + topPadding + pillHeight + totalBottomPadding;

		// Expanded state: pill + popular locations cards
		const gapAfterPill = Spacing.lg; // 16px
		const cardHeight = screenWidth * 0.5; // Square card (50% screen width)
		const estimatedHeaderHeight = 24; // Icon/text row without font scaling
		const estimatedCarouselHeight =
			cardHeight + Spacing.lg + estimatedHeaderHeight;
		const effectiveCarouselHeight = carouselHeight ?? estimatedCarouselHeight;

		const expandedHeight =
			handleIndicatorSpace +
			topPadding +
			pillHeight +
			gapAfterPill +
			effectiveCarouselHeight +
			totalBottomPadding;

		return [collapsedHeight, expandedHeight];
	}, [carouselHeight, screenWidth, totalBottomPadding]);

	// Callback when bottom sheet position changes
	const handleSheetChange = useCallback((index: number) => {
		// index 0 = collapsed (hide carousel), index 1 = expanded (show carousel)
		setIsExpanded(index === 1);
	}, []);

	const handleSearchPress = useCallback(() => {
		router.push("/route-input");
	}, [router]);

	const carouselAnimatedStyle = useAnimatedStyle(() => {
		const opacity = interpolate(
			animatedIndex.value,
			[0, 0.2, 1],
			[0, 0, 1],
			Extrapolate.CLAMP,
		);
		const translateY = interpolate(
			animatedIndex.value,
			[0, 1],
			[12, 0],
			Extrapolate.CLAMP,
		);
		const scale = interpolate(
			animatedIndex.value,
			[0, 1],
			[0.98, 1],
			Extrapolate.CLAMP,
		);

		return {
			opacity,
			transform: [{ translateY }, { scale }],
		};
	}, []);

	const handleCarouselLayout = useCallback(
		(event: LayoutChangeEvent) => {
			const nextHeight = event.nativeEvent.layout.height;
			setCarouselHeight((current) => {
				if (current === null) return nextHeight;
				if (Math.abs(current - nextHeight) < 1) return current;
				return nextHeight;
			});
		},
		[setCarouselHeight],
	);

	return (
		<BottomSheet
			ref={bottomSheetRef}
			index={1}
			snapPoints={snapPoints}
			animatedIndex={animatedIndex}
			backgroundStyle={[styles.background, { backgroundColor }]}
			handleIndicatorStyle={[
				styles.handleIndicator,
				{ backgroundColor: handleIndicatorColor },
			]}
			enablePanDownToClose={false}
			onChange={handleSheetChange}
		>
			<BottomSheetView
				style={{
					paddingTop: Spacing.xl, // 20px
					paddingBottom: totalBottomPadding, // Device safe area + tab bar + content padding
					paddingHorizontal: Spacing.xl, // 20px
				}}
			>
				{/* Pill search bar */}
				<PillSearchBar onSearchPress={handleSearchPress} />

				{/* Popular locations carousel - hidden when collapsed */}
				<Animated.View
					style={[{ marginTop: Spacing.xl }, carouselAnimatedStyle]}
					onLayout={handleCarouselLayout}
					pointerEvents={isExpanded ? "box-none" : "none"}
				>
					<HomePopularCarousel />
				</Animated.View>
			</BottomSheetView>
		</BottomSheet>
	);
}

const styles = StyleSheet.create({
	background: {
		borderTopLeftRadius: BorderRadius.sheet, // 24px
		borderTopRightRadius: BorderRadius.sheet,
		// No shadows - flat, clean appearance
		shadowColor: "transparent",
		shadowOffset: {
			width: 0,
			height: 0,
		},
		shadowOpacity: 0,
		shadowRadius: 0,
		elevation: 0,
	},
	handleIndicator: {
		width: 40,
		height: 4,
		borderRadius: 2,
		marginTop: Spacing.sm, // 8px
	},
});
