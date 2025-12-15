import { StyleSheet, TextInput, View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useThemeColor } from '@/hooks/use-theme-color';

type SearchInputProps = {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  onPress?: () => void;
  editable?: boolean;
};

export function SearchInput({
  placeholder = 'Search destination',
  value,
  onChangeText,
  onPress,
  editable = true,
}: SearchInputProps) {
  const backgroundColor = useThemeColor(
    { light: '#F3F3EE', dark: '#2A2A2A' },
    'background'
  );
  const textColor = useThemeColor(
    { light: '#4B6468', dark: '#FFFFFF' },
    'text'
  );
  const placeholderColor = useThemeColor(
    { light: '#8E8E93', dark: '#6B7280' },
    'textSecondary'
  );
  const iconColor = useThemeColor(
    { light: '#8E8E93', dark: '#9CA3AF' },
    'textSecondary'
  );

  const content = (
    <View style={[styles.container, { backgroundColor }]}>
      <Ionicons name="search" size={20} color={iconColor} style={styles.icon} />
      <TextInput
        style={[styles.input, { color: textColor }]}
        placeholder={placeholder}
        placeholderTextColor={placeholderColor}
        value={value}
        onChangeText={onChangeText}
        editable={editable && !onPress}
        pointerEvents={onPress ? 'none' : 'auto'}
      />
    </View>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress} style={styles.pressable}>
        {content}
      </Pressable>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  pressable: {
    width: '100%',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    width: '100%',
  },
  icon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: '400',
    padding: 0,
    margin: 0,
  },
});

