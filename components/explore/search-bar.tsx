import { forwardRef } from 'react';
import { StyleSheet, View, TextInput, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';

type SearchBarProps = {
  value?: string;
  onChangeText?: (text: string) => void;
  onFocus?: () => void;
  onCancel?: () => void;
  isActive?: boolean;
  placeholder?: string;
  autoFocus?: boolean;
};

export const SearchBar = forwardRef<TextInput, SearchBarProps>(
  function SearchBar(
    {
      value,
      onChangeText,
      onFocus,
      onCancel,
      isActive = false,
      placeholder = 'Search places, restaurants, beaches...',
      autoFocus = false,
    },
    ref
  ) {
    const backgroundColor = useThemeColor(
      { light: '#F3F3EE', dark: '#292524' },
      'background'
    );
    const textColor = useThemeColor(
      { light: '#4B6468', dark: '#FAFAF9' },
      'text'
    );
    const placeholderColor = useThemeColor(
      { light: '#8E8E93', dark: '#78716C' },
      'textSecondary'
    );
    const iconColor = useThemeColor(
      { light: '#8E8E93', dark: '#A8A29E' },
      'textSecondary'
    );
    const cancelColor = '#21808D';

    return (
      <View style={styles.container}>
        <View style={[styles.inputContainer, { backgroundColor }]}>
          <Ionicons name="search" size={18} color={iconColor} style={styles.icon} />
          <TextInput
            ref={ref}
            style={[styles.input, { color: textColor }]}
            placeholder={placeholder}
            placeholderTextColor={placeholderColor}
            value={value}
            onChangeText={onChangeText}
            onFocus={onFocus}
            autoFocus={autoFocus}
            returnKeyType="search"
          />
          {value && value.length > 0 && (
            <Pressable onPress={() => onChangeText?.('')} hitSlop={8}>
              <Ionicons name="close-circle" size={18} color={iconColor} />
            </Pressable>
          )}
        </View>

        {isActive && (
          <Pressable onPress={onCancel} style={styles.cancelButton}>
            <ThemedText style={[styles.cancelText, { color: cancelColor }]}>
              Cancel
            </ThemedText>
          </Pressable>
        )}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: '400',
    padding: 0,
    margin: 0,
  },
  cancelButton: {
    marginLeft: 12,
    paddingVertical: 8,
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '500',
  },
});

