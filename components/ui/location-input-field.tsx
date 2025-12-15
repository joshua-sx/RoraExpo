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
import { Fonts } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';

type LocationInputFieldProps = {
  label: string;
  value?: string;
  placeholder?: string;
  onChangeText?: (text: string) => void;
  onPress?: () => void;
  onFocus?: () => void;
  onClear?: () => void;
  isLocked?: boolean;
  isFocused?: boolean;
  autoFocus?: boolean;
  iconName?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
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
      onClear,
      isLocked = false,
      isFocused = false,
      autoFocus = false,
      iconName,
      rightIcon,
      onRightIconPress,
      ...textInputProps
    },
    ref
  ) {
    const backgroundColor = useThemeColor(
      { light: '#FFFFFF', dark: '#1A1A1A' },
      'surface'
    );
    const textColor = useThemeColor(
      { light: '#262626', dark: '#E5E7EA' },
      'text'
    );
    const placeholderColor = useThemeColor(
      { light: '#5C5F62', dark: '#8B8F95' },
      'textSecondary'
    );
    const iconColor = useThemeColor(
      { light: '#5C5F62', dark: '#8B8F95' },
      'textSecondary'
    );
    const lockedTextColor = useThemeColor(
      { light: '#262626', dark: '#D1D5DB' },
      'text'
    );
    const checkColor = useThemeColor({}, 'tint');
    const tintColor = useThemeColor({}, 'tint');
    const baseBorderColor = useThemeColor(
      { light: '#E3E6E3', dark: '#2F3237' },
      'border'
    );
    const borderColor = isFocused ? tintColor : baseBorderColor;

    const displayIcon = iconName || (isLocked ? 'location' : 'search');

    const content = (
      <View style={styles.container}>
        <ThemedText style={styles.label}>{label}</ThemedText>
        <View style={styles.rowContainer}>
          <View
            style={[
              styles.inputContainer,
              { backgroundColor, borderColor },
              isLocked && styles.lockedContainer,
              isFocused && styles.focusedContainer,
            ]}
          >
            <Ionicons
              name={displayIcon}
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
              <>
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
                {value && value.length > 0 && onClear && !onPress && (
                  <Pressable onPress={onClear} hitSlop={8} style={styles.clearButton}>
                    <Ionicons name="close-circle" size={18} color={iconColor} />
                  </Pressable>
                )}
              </>
            )}
          </View>
          {rightIcon && (
            <Pressable
              onPress={onRightIconPress}
              style={styles.rightIconButton}
              hitSlop={8}
              disabled={!onRightIconPress}
            >
              <Ionicons name={rightIcon} size={20} color={iconColor} />
            </Pressable>
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
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  lockedContainer: {
    opacity: 0.9,
  },
  focusedContainer: {
    borderWidth: 2,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: '400',
    fontFamily: Fonts?.sans,
    padding: 0,
    margin: 0,
  },
  clearButton: {
    marginLeft: 8,
  },
  rightIconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
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
    fontFamily: Fonts?.sans,
  },
});
