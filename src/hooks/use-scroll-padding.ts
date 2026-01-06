import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getTabBarHeight } from '@/src/utils/safe-area';

/**
 * Hook for calculating consistent scroll view bottom padding.
 * 
 * Handles:
 * - Tab bar height (if screen is in tab layout)
 * - Safe area bottom inset
 * - Optional extra padding for spacing
 * 
 * **Usage:**
 * ```tsx
 * // For tab screen with default padding
 * const paddingBottom = useScrollPadding(true);
 * 
 * // For non-tab screen
 * const paddingBottom = useScrollPadding(false);
 * 
 * // With extra padding
 * const paddingBottom = useScrollPadding(true, 16);
 * 
 * <ScrollView contentContainerStyle={{ paddingBottom }} />
 * ```
 * 
 * @param hasTabBar - Whether the screen is in a tab navigator (default: false)
 * @param extraPadding - Additional padding in pixels (default: 0)
 * @returns Calculated bottom padding value
 */
export function useScrollPadding(hasTabBar: boolean = false, extraPadding: number = 0): number {
  const insets = useSafeAreaInsets();
  
  if (hasTabBar) {
    const tabBarHeight = getTabBarHeight(insets);
    return tabBarHeight + extraPadding;
  }
  
  // For non-tab screens, just use safe area bottom + extra padding
  return insets.bottom + extraPadding;
}

