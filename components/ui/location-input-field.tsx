import { forwardRef } from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  Pressable,
  TextInputProps,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';

type LocationInputFieldProps = {
  label: string;
  value?: string;
  placeholder?: string;
  onChangeText?: (text: string) => void;
  onPress?: () => void;
  onFocus?: () => void;
  isLocked?: boolean;
  autoFocus?: boolean;
} & Omit<TextInputProps, 'style'>;

export const LocationInputField = forwardRef<TextInput, LocationInputFieldProps>(
  function LocationInputField(
    {
      label,
      value,
      placeholder,
      onChangeText,
      onPress,
      onFocus,
      isLocked = false,
      autoFocus = false,
      ...textInputProps
    },
    ref
  ) {
    const backgroundColor = useThemeColor(
      { light: '#F5F5F5', dark: '#2A2A2A' },
      'background'
    );
    const textColor = useThemeColor(
      { light: '#1A1A1A', dark: '#FFFFFF' },
      'text'
    );
    const placeholderColor = useThemeColor(
      { light: '#9CA3AF', dark: '#6B7280' },
      'text'
    );
    const iconColor = useThemeColor(
      { light: '#6B7280', dark: '#9CA3AF' },
      'text'
    );
    const lockedTextColor = useThemeColor(
      { light: '#374151', dark: '#D1D5DB' },
      'text'
    );
    const checkColor = useThemeColor(
      { light: '#10B981', dark: '#34D399' },
      'text'
    );
    const borderColor = useThemeColor(
      { light: '#E5E7EB', dark: '#374151' },
      'text'
    );

    const content = (
      <View style={styles.container}>
        <ThemedText style={styles.label}>{label}</ThemedText>
        <View
          style={[
            styles.inputContainer,
            { backgroundColor, borderColor },
            isLocked && styles.lockedContainer,
          ]}
        >
          <Ionicons
            name={isLocked ? 'location' : 'search'}
            size={18}
            color={isLocked ? checkColor : iconColor}
            style={styles.icon}
          />
          {isLocked ? (
            <View style={styles.lockedContent}>
              <ThemedText style={[styles.lockedText, { color: lockedTextColor }]}>
                {value || 'Current location'}
              </ThemedText>
              <Ionicons name="checkmark-circle" size={18} color={checkColor} />
            </View>
          ) : (
            <TextInput
              ref={ref}
              style={[styles.input, { color: textColor }]}
              placeholder={placeholder}
              placeholderTextColor={placeholderColor}
              value={value}
              onChangeText={onChangeText}
              onFocus={onFocus}
              autoFocus={autoFocus}
              editable={!onPress}
              pointerEvents={onPress ? 'none' : 'auto'}
              {...textInputProps}
            />
          )}
        </View>
      </View>
    );

    if (onPress && !isLocked) {
      return (
        <Pressable onPress={onPress} style={styles.pressable}>
          {content}
        </Pressable>
      );
    }

    return content;
  }
);

const styles = StyleSheet.create({
  pressable: {
    width: '100%',
  },
  container: {
    width: '100%',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    opacity: 0.8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 14,
    width: '100%',
  },
  lockedContainer: {
    opacity: 0.9,
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
  lockedContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  lockedText: {
    fontSize: 16,
    fontWeight: '400',
  },
});

