import { StyleSheet, Pressable, View } from 'react-native';
import { Image } from 'expo-image';

import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';

export type PopularLocation = {
  id: string;
  name: string;
  image: string;
};

type PopularLocationCardProps = {
  location: PopularLocation;
  onPress?: (location: PopularLocation) => void;
};

export function PopularLocationCard({
  location,
  onPress,
}: PopularLocationCardProps) {
  const backgroundColor = useThemeColor(
    { light: '#FFFFFF', dark: '#161616' },
    'surface'
  );
  const borderColor = useThemeColor(
    { light: '#E3E6E3', dark: '#2F3237' },
    'border'
  );

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        { backgroundColor, borderColor },
        pressed && styles.pressed,
      ]}
      onPress={() => onPress?.(location)}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: location.image }}
          style={styles.image}
          contentFit="cover"
          placeholder={{ blurhash: 'LGF5]+Yk^6#M@-5c,1J5@[or[Q6.' }}
          transition={200}
        />
      </View>
      <ThemedText style={styles.name} numberOfLines={2}>
        {location.name}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 120,
    marginRight: 12,
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  imageContainer: {
    width: '100%',
    height: 80,
    backgroundColor: '#EEF3ED',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  name: {
    fontSize: 13,
    fontWeight: '500',
    paddingHorizontal: 10,
    paddingVertical: 10,
    textAlign: 'left',
  },
});
