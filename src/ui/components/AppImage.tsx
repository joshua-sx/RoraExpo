import React from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import { Image, type ImageProps, type ImageStyle } from 'expo-image';
import { colors } from '../tokens/colors';
import { DEFAULT_BLURHASH, IMAGE_TRANSITION_DURATION } from '../tokens/images';

type AppImageProps = Omit<ImageProps, 'placeholder' | 'transition'> & {
  /**
   * Custom blurhash placeholder. Defaults to standard placeholder.
   */
  blurhash?: string;
  /**
   * Transition duration in ms. Defaults to 300ms.
   */
  transitionDuration?: number;
  /**
   * Whether to show placeholder background on load failure.
   * @default true
   */
  showPlaceholderOnError?: boolean;
  /**
   * Container style for the image wrapper.
   */
  containerStyle?: ViewStyle;
};

/**
 * AppImage - Unified image component with expo-image
 *
 * Features:
 * - Automatic blurhash placeholder
 * - Smooth transition on load
 * - Error state handling with placeholder
 * - Consistent across the app
 *
 * Usage:
 * ```tsx
 * <AppImage
 *   source={{ uri: imageUrl }}
 *   style={{ width: 100, height: 100 }}
 *   contentFit="cover"
 * />
 * ```
 */
export function AppImage({
  blurhash = DEFAULT_BLURHASH,
  transitionDuration = IMAGE_TRANSITION_DURATION,
  showPlaceholderOnError = true,
  style,
  containerStyle,
  ...rest
}: AppImageProps) {
  const [hasError, setHasError] = React.useState(false);

  const handleError = () => {
    if (showPlaceholderOnError) {
      setHasError(true);
    }
  };

  if (hasError) {
    return (
      <View style={[styles.placeholder, style as ViewStyle, containerStyle]} />
    );
  }

  return (
    <Image
      {...rest}
      style={style}
      placeholder={{ blurhash }}
      transition={transitionDuration}
      onError={handleError}
    />
  );
}

const styles = StyleSheet.create({
  placeholder: {
    backgroundColor: colors.skeleton,
  },
});
