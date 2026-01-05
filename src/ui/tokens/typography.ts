/**
 * Typography System
 * Consistent type scale for all screens.
 */

export const type = {
  // Display - Hero text, large numbers (fare display)
  display: { fontSize: 32, lineHeight: 40, fontWeight: "700" as const },

  // Title 1 - Screen titles (large, collapsing headers)
  title1: { fontSize: 28, lineHeight: 36, fontWeight: "600" as const },

  // Title 2 - Section headers, card titles
  title2: { fontSize: 22, lineHeight: 28, fontWeight: "600" as const },

  // Title 3 - Subsection headers
  title3: { fontSize: 18, lineHeight: 24, fontWeight: "600" as const },

  // Headline - Prominent body text, button labels
  headline: { fontSize: 16, lineHeight: 22, fontWeight: "600" as const },

  // Body - Standard text
  body: { fontSize: 16, lineHeight: 24, fontWeight: "400" as const },

  // Body Small - Secondary text, descriptions
  bodySmall: { fontSize: 14, lineHeight: 20, fontWeight: "400" as const },

  // Caption - Labels, hints, timestamps
  caption: { fontSize: 12, lineHeight: 16, fontWeight: "400" as const },

  // Overline - Badges, tags (uppercase)
  overline: { fontSize: 11, lineHeight: 14, fontWeight: "500" as const, letterSpacing: 0.5 },

  // Legacy aliases for backward compatibility
  title: { fontSize: 20, lineHeight: 26, fontWeight: "600" as const },
  h2: { fontSize: 18, lineHeight: 24, fontWeight: "600" as const },
  sub: { fontSize: 14, lineHeight: 20, fontWeight: "400" as const },
  cap: { fontSize: 12, lineHeight: 16, fontWeight: "400" as const },
} as const;
