import { useEffect } from 'react';
import { Keyboard } from 'react-native';
import { useNavigation } from 'expo-router';

/**
 * Hook to dismiss keyboard when screen loses focus.
 *
 * Prevents keyboard from persisting across screen transitions.
 *
 * Usage:
 * ```tsx
 * // In screen component
 * useKeyboardDismissOnBlur();
 * ```
 */
export function useKeyboardDismissOnBlur() {
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      Keyboard.dismiss();
    });

    return unsubscribe;
  }, [navigation]);
}
