/**
 * Border Radius System
 * Rora Mobile Design System
 *
 * Consistent radii across all components.
 */

export const radius = {
  // Generic scale
  sm: 8, // Small elements
  md: 12, // Buttons, inputs
  lg: 16, // Cards, sheets
  pill: 999, // Badges, pills

  // Semantic aliases (prefer these)
  button: 12,
  input: 12,
  card: 16,
  sheet: 24,
  badge: 999,
} as const;
