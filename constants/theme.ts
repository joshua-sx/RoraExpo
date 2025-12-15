/**
 * Rora Design System
 * Color palette and typography for light and dark modes
 */

import { Platform } from 'react-native';
import { Colors, Typography } from './design-tokens';

// ============================================================================
// SEMANTIC COLORS FOR LIGHT AND DARK MODES
// ============================================================================

export const ThemeColors = {
  light: {
    text: Colors.textSlate,
    textSecondary: Colors.neutralStone,
    background: Colors.canvasMist,
    surface: Colors.cardWhite,
    tint: Colors.primary,
    icon: Colors.neutralStone,
    border: Colors.dividerMist,
    success: Colors.success,
    error: Colors.error,
    warning: Colors.warning,
    info: Colors.info,
    tabIconDefault: Colors.neutralStone,
    tabIconSelected: Colors.primary,
  },
  dark: {
    text: '#FAFAF9', // Light off-white
    textSecondary: '#A8A29E', // Lighter stone
    background: '#1C1917', // Very dark
    surface: '#292524', // Dark grey
    tint: Colors.primary,
    icon: '#A8A29E',
    border: '#3F3F3F',
    success: Colors.success,
    error: Colors.error,
    warning: Colors.warning,
    info: Colors.info,
    tabIconDefault: '#A8A29E',
    tabIconSelected: Colors.primary,
  },
};

export const Colors_compat = ThemeColors;

// ============================================================================
// TYPOGRAPHY
// ============================================================================

export const Fonts = Platform.select({
  ios: {
    /** iOS - System sans-serif (Roboto equivalent) */
    sans: 'system-ui',
    /** iOS - Serif */
    serif: 'ui-serif',
    /** iOS - Rounded (for headings) */
    rounded: 'ui-rounded',
    /** iOS - Monospaced */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

export { Typography };
