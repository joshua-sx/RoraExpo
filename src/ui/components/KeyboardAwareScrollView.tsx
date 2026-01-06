import { forwardRef } from 'react';
import {
  ScrollView,
  type ScrollViewProps,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useKeyboardHeight } from '@/src/hooks/use-keyboard-height';
import { space } from '../tokens/spacing';

type KeyboardAwareScrollViewProps = ScrollViewProps & {
  /**
   * Extra padding to add at bottom (e.g., for sticky CTA buttons).
   * @default 0
   */
  extraBottomPadding?: number;
  /**
   * Whether to include safe area bottom inset in padding.
   * @default true
   */
  includeSafeArea?: boolean;
  /**
   * Whether to use KeyboardAvoidingView wrapper.
   * Set to false if parent already handles keyboard avoidance.
   * @default true
   */
  avoidKeyboard?: boolean;
};

/**
 * KeyboardAwareScrollView - ScrollView that handles keyboard visibility
 *
 * Features:
 * - Automatically adjusts padding when keyboard appears
 * - Handles safe area insets
 * - Works with sticky CTA buttons
 * - Cross-platform (iOS and Android)
 *
 * Usage:
 * ```tsx
 * <KeyboardAwareScrollView extraBottomPadding={80}>
 *   <TextInput />
 *   <TextInput />
 * </KeyboardAwareScrollView>
 * ```
 */
export const KeyboardAwareScrollView = forwardRef<ScrollView, KeyboardAwareScrollViewProps>(
  function KeyboardAwareScrollView(
    {
      children,
      contentContainerStyle,
      extraBottomPadding = 0,
      includeSafeArea = true,
      avoidKeyboard = true,
      style,
      ...rest
    },
    ref
  ) {
    const insets = useSafeAreaInsets();
    const keyboardHeight = useKeyboardHeight();

    const bottomPadding =
      (keyboardHeight > 0 ? keyboardHeight : includeSafeArea ? insets.bottom : 0) +
      extraBottomPadding +
      space[4]; // Buffer

    const scrollView = (
      <ScrollView
        ref={ref}
        style={style}
        contentContainerStyle={[
          styles.content,
          contentContainerStyle,
          { paddingBottom: bottomPadding },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        {...rest}
      >
        {children}
      </ScrollView>
    );

    if (!avoidKeyboard) {
      return scrollView;
    }

    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        {scrollView}
      </KeyboardAvoidingView>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
  },
});
