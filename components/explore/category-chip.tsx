import { StyleSheet, Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import type { CategoryInfo } from '@/types/venue';

type CategoryChipProps = {
  category: CategoryInfo;
  isActive?: boolean;
  onPress?: (category: CategoryInfo) => void;
};

export function CategoryChip({
  category,
  isActive = false,
  onPress,
}: CategoryChipProps) {
  const backgroundColor = useThemeColor(
    { light: '#F3F3EE', dark: '#292524' },
    'background'
  );
  const activeBackgroundColor = useThemeColor(
    { light: '#21808D', dark: '#2A9BA8' },
    'tint'
  );
  const textColor = useThemeColor(
    { light: '#4B6468', dark: '#FAFAF9' },
    'text'
  );
  const activeTextColor = '#FFFFFF';

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        {
          backgroundColor: isActive ? activeBackgroundColor : backgroundColor,
        },
        pressed && styles.pressed,
      ]}
      onPress={() => onPress?.(category)}
    >
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : category.color + '20' },
        ]}
      >
        <Ionicons
          name={category.icon as any}
          size={18}
          color={isActive ? activeTextColor : category.color}
        />
      </View>
      <ThemedText
        style={[
          styles.label,
          { color: isActive ? activeTextColor : textColor },
        ]}
      >
        {category.name}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 24,
    marginRight: 10,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  iconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
});

