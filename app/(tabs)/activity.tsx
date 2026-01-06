import { useCallback, useMemo, useState } from "react";
import { FlatList, RefreshControl, StyleSheet, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import { useTripHistoryStore } from "@/src/store/trip-history-store";
import type { Trip } from "@/src/types/trip";
import { EmptyState } from "@/src/ui/components/EmptyState";
import { SegmentedControl } from "@/src/ui/components/SegmentedControl";
import { TripCard } from "@/src/ui/components/TripCard";
import { Box } from "@/src/ui/primitives/Box";
import { Text } from "@/src/ui/primitives/Text";
import { colors } from "@/src/ui/tokens/colors";
import { space } from "@/src/ui/tokens/spacing";
import { getTabBarHeight } from "@/src/utils/safe-area";

type TimeGroup = {
  title: string;
  trips: Trip[];
};

export default function ActivityScreen() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = getTabBarHeight(insets);
  const { trips } = useTripHistoryStore();
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<"past" | "upcoming">("past");

  // Filter trips by active tab
  const filteredTrips = useMemo(() => {
    return trips.filter((trip) => {
      if (activeTab === "past") {
        return trip.status === "completed" || trip.status === "cancelled";
      }
      return ["not_taken", "pending", "in_progress"].includes(trip.status);
    });
  }, [trips, activeTab]);

  // Group trips by time periods
  const groupedTrips = useMemo((): TimeGroup[] => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const thisWeek = new Date(today);
    thisWeek.setDate(thisWeek.getDate() - 7);

    const groups: Record<string, Trip[]> = {
      Today: [],
      Yesterday: [],
      "This Week": [],
      Earlier: [],
    };

    filteredTrips.forEach((trip) => {
      const tripDate = new Date(trip.quote.createdAt || trip.timestamp);
      const tripDay = new Date(
        tripDate.getFullYear(),
        tripDate.getMonth(),
        tripDate.getDate()
      );

      if (tripDay.getTime() === today.getTime()) {
        groups.Today.push(trip);
      } else if (tripDay.getTime() === yesterday.getTime()) {
        groups.Yesterday.push(trip);
      } else if (tripDay >= thisWeek) {
        groups["This Week"].push(trip);
      } else {
        groups.Earlier.push(trip);
      }
    });

    // Return only non-empty groups
    return Object.entries(groups)
      .filter(([_, groupTrips]) => groupTrips.length > 0)
      .map(([title, groupTrips]) => ({ title, trips: groupTrips }));
  }, [filteredTrips]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Simulate refresh - in production, this would refetch from server
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const handleTripPress = useCallback((trip: Trip) => {
    // Navigate to trip detail screen
    console.log("Navigate to trip detail:", trip.id);
    // router.push(`/trip/${trip.id}`);
  }, []);

  const renderEmpty = () => (
    <EmptyState
      icon={
        <Ionicons
          name={activeTab === "past" ? "checkmark-circle-outline" : "calendar-outline"}
          size={64}
          color={colors.textMuted}
        />
      }
      message={
        activeTab === "past"
          ? "No completed rides yet"
          : "No upcoming rides. Plan a trip to get started!"
      }
      actionLabel="Plan a trip"
      onAction={() => router.push("/")}
      style={styles.emptyState}
    />
  );

  const renderSectionHeader = ({ title }: TimeGroup) => (
    <Box style={styles.sectionHeader}>
      <Text variant="sub" muted style={styles.sectionTitle}>
        {title}
      </Text>
    </Box>
  );

  const renderTrip = ({ item }: { item: Trip }) => (
    <TripCard trip={item} onPress={() => handleTripPress(item)} showQuoteAge />
  );

  const data = groupedTrips;

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Header */}
      <Box style={styles.header}>
        <Text variant="title" style={styles.headerTitle}>
          Activity
        </Text>
        <Text variant="body" muted style={styles.headerSubtitle}>
          {activeTab === "past" ? "Your completed rides" : "Rides you've planned"}
        </Text>
      </Box>

      {/* Tab Switcher */}
      <Box style={styles.tabContainer}>
        <SegmentedControl
          segments={["Past", "Upcoming"]}
          selectedIndex={activeTab === "past" ? 0 : 1}
          onChange={(index) => setActiveTab(index === 0 ? "past" : "upcoming")}
        />
      </Box>

      {/* Trip List */}
      <FlatList
        data={data}
        keyExtractor={(item) => item.title}
        renderItem={({ item }) => (
          <Box>
            {renderSectionHeader(item)}
            {item.trips.map((trip) => (
              <Box key={trip.id} style={styles.tripWrapper}>
                {renderTrip({ item: trip })}
              </Box>
            ))}
          </Box>
        )}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: tabBarHeight + space[4] },
          data.length === 0 && styles.listContentEmpty,
        ]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        ListFooterComponent={<View style={{ height: space[2] }} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  header: {
    paddingHorizontal: space[4],
    paddingTop: space[4],
    paddingBottom: space[3],
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontWeight: "700",
    marginBottom: space[1],
  },
  headerSubtitle: {
    fontSize: 14,
  },
  tabContainer: {
    paddingHorizontal: space[4],
    paddingVertical: space[3],
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  listContent: {
    paddingHorizontal: space[4],
    paddingTop: space[4],
  },
  listContentEmpty: {
    flexGrow: 1,
  },
  sectionHeader: {
    paddingTop: space[4],
    paddingBottom: space[3],
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  tripWrapper: {
    marginBottom: space[3],
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
  },
});
