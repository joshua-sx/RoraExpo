import { StyleSheet, View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import type { Venue } from '@/types/venue';

type RideCtaCardProps = {
  venue: Venue;
  onPress?: () => void;
};

export function RideCtaCard({ venue, onPress }: RideCtaCardProps) {
  const backgroundColor = useThemeColor(
    { light: '#FCFCF9', dark: '#1C1917' },
    'surface'
  );
  const textColor = useThemeColor(
    { light: '#4B6468', dark: '#FAFAF9' },
    'text'
  );
  const subtextColor = useThemeColor(
    { light: '#8E8E93', dark: '#A8A29E' },
    'textSecondary'
  );
  const tealColor = '#21808D';

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={styles.content}>
        <ThemedText style={[styles.title, { color: textColor }]}>
          Get a ride to {venue.name}
        </ThemedText>
        <View style={styles.metaRow}>
          <Ionicons name="time-outline" size={14} color={subtextColor} />
          <ThemedText style={[styles.metaText, { color: subtextColor }]}>
            Est. trip: {venue.estimatedDuration || 12} min
          </ThemedText>
        </View>
      </View>

      <Pressable
        style={({ pressed }) => [
          styles.button,
          { backgroundColor: '#21808D' },
          pressed && styles.buttonPressed,
        ]}
        onPress={onPress}
      >
        <ThemedText style={styles.buttonText}>Set pickup location</ThemedText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 34,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
  },
  content: {
    marginBottom: 14,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 14,
  },
  button: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

