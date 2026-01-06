/**
 * Theme - Unified Token Export
 * Rora Mobile Design System
 *
 * Import from here: import { colors, space, radius, type, shadow } from '@/src/ui/tokens';
 */

import { colors } from "./colors";
import { space } from "./spacing";
import { radius } from "./radius";
import { type } from "./typography";
import { shadow } from "./shadow";

// Animation durations (ms)
export const animation = {
  fast: 100, // Quick interactions
  normal: 200, // Standard animations
  slow: 300, // Deliberate, calm animations
  verySlow: 500, // Extended animations
} as const;

// Z-Index scale
export const zIndex = {
  base: 0,
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
} as const;

// Component sizing
export const sizing = {
  // Touch targets (minimum 48px per spec)
  touchTarget: 48,

  // Button heights
  buttonHeight: 52,

  // List item heights
  listItemHeight: 56,

  // Input heights
  inputHeight: 52,

  // Avatar sizes
  avatarSm: 40,
  avatarLg: 80,

  // Tab bar
  tabBarHeight: 49, // iOS standard, add safe area
} as const;

// Combined theme object
export const theme = {
  colors,
  space,
  radius,
  type,
  shadow,
  animation,
  zIndex,
  sizing,
} as const;

export type Theme = typeof theme;

// Re-export all tokens for convenience
export { colors, space, radius, type, shadow };
