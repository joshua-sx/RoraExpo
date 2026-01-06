/**
 * Typography System
 * Rora Mobile Design System
 *
 * Minimal scale: 4 sizes + 1 utility + price variants
 * Never use more than 2 font weights on a single screen.
 */

export const type = {
  // ============================================================================
  // PRIMARY SCALE (use these)
  // ============================================================================

  // Title - Screen titles, section headers (22px Bold)
  title: { fontSize: 22, lineHeight: 28, fontWeight: "700" as const },

  // Headline - Card titles, button labels, emphasis (16px SemiBold)
  headline: { fontSize: 16, lineHeight: 22, fontWeight: "600" as const },

  // Body - Default text, descriptions (16px Regular)
  body: { fontSize: 16, lineHeight: 24, fontWeight: "400" as const },

  // Caption - Secondary info, metadata, timestamps (14px Regular)
  caption: { fontSize: 14, lineHeight: 20, fontWeight: "400" as const },

  // Overline - Labels, badges, category tags (11px SemiBold)
  overline: { fontSize: 11, lineHeight: 14, fontWeight: "600" as const, letterSpacing: 0.5 },

  // ============================================================================
  // PRICE TYPOGRAPHY (special use)
  // ============================================================================

  // Price Display - Hero prices, fare display (32px Bold = 2x body)
  priceDisplay: { fontSize: 32, lineHeight: 40, fontWeight: "700" as const },

  // Price Card - Prices on offer cards (24px Bold)
  priceCard: { fontSize: 24, lineHeight: 32, fontWeight: "700" as const },

  // Price List - Prices in list items (18px SemiBold)
  priceList: { fontSize: 18, lineHeight: 24, fontWeight: "600" as const },

  // ============================================================================
  // LEGACY ALIASES (for backward compatibility - deprecate over time)
  // ============================================================================

  // Map old names to new scale
  display: { fontSize: 32, lineHeight: 40, fontWeight: "700" as const }, // Use priceDisplay
  title1: { fontSize: 22, lineHeight: 28, fontWeight: "700" as const }, // Use title
  title2: { fontSize: 22, lineHeight: 28, fontWeight: "600" as const }, // Use title
  title3: { fontSize: 18, lineHeight: 24, fontWeight: "600" as const }, // Use headline or title
  bodySmall: { fontSize: 14, lineHeight: 20, fontWeight: "400" as const }, // Use caption
  h2: { fontSize: 18, lineHeight: 24, fontWeight: "600" as const }, // Use headline
  sub: { fontSize: 14, lineHeight: 20, fontWeight: "400" as const }, // Use caption
  cap: { fontSize: 12, lineHeight: 16, fontWeight: "400" as const }, // Use caption
} as const;
