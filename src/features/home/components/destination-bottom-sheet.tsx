import type BottomSheet from "@gorhom/bottom-sheet";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { LayoutChangeEvent } from "react-native";
import { StyleSheet, View, useWindowDimensions } from "react-native";
import Animated, {
	interpolate,
	useAnimatedStyle,
	useSharedValue,
} from "react-native-reanimated";

import { HomePopularCarousel } from "@/src/features/home/components/home-popular-carousel";
import { PillSearchBar } from "@/src/ui/legacy/pill-search-bar";
import { Sheet } from "@/src/ui/components/Sheet";
import { space } from "@/src/ui/tokens/spacing";

// Spacing rhythm: 16px inside/between content, 24px for major sections
const HANDLE_HEIGHT = 12; // Handle indicator + top margin
const CONTENT_PADDING = space[4]; // 16px - padding around content
const CONTENT_GAP = space[4]; // 16px - gap between pill and carousel

type DestinationBottomSheetProps = {
	/** Tab bar height - required to prevent content hiding behind tab bar */
	bottomInset: number;
};

export function DestinationBottomSheet({
	bottomInset,
}: DestinationBottomSheetProps) {
	const bottomSheetRef = useRef<BottomSheet>(null);
	const router = useRouter();
	const { height: screenHeight } = useWindowDimensions();
	const animatedIndex = useSharedValue(1);

	// Track bottom sheet position: true = expanded (show carousel), false = collapsed (hide carousel)
	const [isExpanded, setIsExpanded] = useState(true);

	// Measured heights (null = not yet measured, use estimates)
	const [pillHeight, setPillHeight] = useState<number | null>(null);
	const [carouselHeight, setCarouselHeight] = useState<number | null>(null);

	// Snap points based on height, safe areas, and measured content
	// Bottom spacing = CONTENT_GAP (16px visual gap) + bottomInset (tab bar clearance)
	const snapPoints = useMemo(() => {
		// Use measured values or reasonable estimates
		const effectivePillHeight = pillHeight ?? 60;
		const effectiveCarouselHeight = carouselHeight ?? 240; // Estimate for initial render

		// Total bottom space: visual gap + tab bar height
		const bottomSpace = CONTENT_GAP + bottomInset;

		// Collapsed: handle + padding + pill + bottom space
		const collapsedHeight =
			HANDLE_HEIGHT +
			CONTENT_PADDING +
			effectivePillHeight +
			bottomSpace;

		// Expanded: handle + padding + pill + gap + carousel + bottom space
		const expandedHeight =
			HANDLE_HEIGHT +
			CONTENT_PADDING +
			effectivePillHeight +
			CONTENT_GAP +
			effectiveCarouselHeight +
			bottomSpace;

		// Cap expanded height to 75% of screen to prevent weird behavior on small phones
		const maxExpandedHeight = screenHeight * 0.75;
		const cappedExpandedHeight = Math.min(expandedHeight, maxExpandedHeight);

		return [collapsedHeight, cappedExpandedHeight];
	}, [pillHeight, carouselHeight, screenHeight, bottomInset]);

	// Callback when bottom sheet position changes
	const handleSheetChange = useCallback((index: number) => {
		setIsExpanded(index === 1);
	}, []);

	const handleSearchPress = useCallback(() => {
		router.push("/route-input");
	}, [router]);

	// Carousel fade animation: starts fading at 0.3, fully visible at 1
	const carouselAnimatedStyle = useAnimatedStyle(() => {
		const opacity = interpolate(
			animatedIndex.value,
			[0, 0.3, 1],
			[0, 0, 1],
			"clamp",
		);
		const translateY = interpolate(
			animatedIndex.value,
			[0, 1],
			[8, 0],
			"clamp",
		);

		return {
			opacity,
			transform: [{ translateY }],
		};
	}, []);

	const handlePillLayout = useCallback((event: LayoutChangeEvent) => {
		const nextHeight = event.nativeEvent.layout.height;
		setPillHeight((current) => {
			if (current === null) return nextHeight;
			if (Math.abs(current - nextHeight) < 1) return current;
			return nextHeight;
		});
	}, []);

	const handleCarouselLayout = useCallback((event: LayoutChangeEvent) => {
		const nextHeight = event.nativeEvent.layout.height;
		setCarouselHeight((current) => {
			if (current === null) return nextHeight;
			if (Math.abs(current - nextHeight) < 1) return current;
			return nextHeight;
		});
	}, []);

	// Initialize animatedIndex on mount
	useEffect(() => {
		animatedIndex.value = 1;
	}, [animatedIndex]);

	return (
		<Sheet
			ref={bottomSheetRef}
			index={1}
			snapPoints={snapPoints}
			animatedIndex={animatedIndex}
			backgroundStyle={styles.background}
			handleIndicatorStyle={styles.handleIndicator}
			enablePanDownToClose={false}
			onChange={handleSheetChange}
			animateOnMount={false}
			enableOverDrag={false}
			overDragResistanceFactor={0}
			enableDynamicSizing={false}
			bottomInset={0} // We handle bottom padding ourselves for consistent spacing
			activeOffsetY={[-15, 15]}
			failOffsetX={[-5, 5]}
			contentContainerStyle={{
				paddingTop: CONTENT_PADDING,
				paddingHorizontal: CONTENT_PADDING,
				paddingBottom: CONTENT_GAP + bottomInset, // 16px gap + tab bar clearance
			}}
		>
			{/* Pill search bar - measured for accurate snap points */}
			<View onLayout={handlePillLayout}>
				<PillSearchBar onSearchPress={handleSearchPress} />
			</View>

			{/* Popular locations carousel - fades out when collapsed */}
			<Animated.View
				style={[{ marginTop: CONTENT_GAP }, carouselAnimatedStyle]}
				onLayout={handleCarouselLayout}
				pointerEvents={isExpanded ? "box-none" : "none"}
			>
				<HomePopularCarousel />
			</Animated.View>
		</Sheet>
	);
}

const styles = StyleSheet.create({
	background: {
		shadowColor: "transparent",
		shadowOffset: { width: 0, height: 0 },
		shadowOpacity: 0,
		shadowRadius: 0,
		elevation: 0,
	},
	handleIndicator: {},
});
