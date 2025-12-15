import { Image } from 'expo-image';
import { StyleSheet } from 'react-native';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts } from '@/constants/theme';

export default function DriversScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#E6F6EC', dark: '#0F160F' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#00BE3C"
          name="car.fill"
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText
          type="title"
          style={{
            fontFamily: Fonts.rounded,
          }}>
          Drivers
        </ThemedText>
      </ThemedView>
      <ThemedText>
        Browse and connect with available drivers in your area.
      </ThemedText>
      <ThemedView style={styles.contentContainer}>
        <ThemedText type="subtitle">Coming Soon</ThemedText>
        <ThemedText>
          This section will display a list of available drivers, their ratings,
          and real-time availability status.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.contentContainer}>
        <ThemedText type="subtitle">Features</ThemedText>
        <ThemedText>
          • View driver profiles and ratings{'\n'}
          • Check real-time availability{'\n'}
          • Filter by location and vehicle type{'\n'}
          • Contact drivers directly
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#00BE3C',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  contentContainer: {
    gap: 8,
    marginBottom: 8,
    marginTop: 16,
  },
});
