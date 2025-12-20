import { StyleSheet } from 'react-native';

import ParallaxScrollView from '@/src/ui/components/parallax-scroll-view';
import { ThemedText } from '@/src/ui/components/themed-text';
import { ThemedView } from '@/src/ui/components/themed-view';
import { IconSymbol } from '@/src/ui/legacy/icon-symbol';
import { Fonts } from '@/src/constants/theme';

export default function ProfileScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#E9F8EE', dark: '#0F160F' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#00BE3C"
          name="person.circle.fill"
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText
          type="title"
          style={{
            fontFamily: Fonts.rounded,
          }}>
          Profile
        </ThemedText>
      </ThemedView>
      <ThemedText>
        Manage your account settings and preferences.
      </ThemedText>
      <ThemedView style={styles.contentContainer}>
        <ThemedText type="subtitle">Account Information</ThemedText>
        <ThemedText>
          View and edit your personal information, contact details, and account preferences.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.contentContainer}>
        <ThemedText type="subtitle">Settings</ThemedText>
        <ThemedText>
          • Notification preferences{'\n'}
          • Privacy settings{'\n'}
          • Payment methods{'\n'}
          • Language and region{'\n'}
          • App appearance
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.contentContainer}>
        <ThemedText type="subtitle">Activity</ThemedText>
        <ThemedText>
          Review your ride history, saved locations, and favorite drivers.
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
