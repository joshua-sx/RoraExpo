/**
 * Color System - Dieter Rams Approved
 * Neutrals do the heavy lifting. One strong accent.
 */

export const colors = {
  // Base
  bg: "#FFFFFF",
  surface: "#F9F9F9",
  text: "#262626",
  textMuted: "#5C5F62",
  border: "#E3E6E3",

  // Accent (Rora Brand)
  primary: "#00BE3C",
  primaryLight: "#E6F9EC", // 10% opacity equivalent
  primaryText: "#FFFFFF",

  // Functional (use sparingly)
  danger: "#D14343",
  dangerLight: "#FEE2E2",
  warning: "#E9A63A",
  warningLight: "#FEF3C7",
  success: "#00BE3C",
  successLight: "#DCFCE7",
  info: "#3B82F6",
  infoLight: "#DBEAFE",

  // Price Labels (per spec)
  goodDeal: "#22C55E",
  goodDealBg: "#DCFCE7",
  pricier: "#F59E0B",
  pricierBg: "#FEF3C7",

  // Pro Badge
  proBg: "#00BE3C",
  proText: "#FFFFFF",

  // Verified Badge
  verifiedBg: "#DBEAFE",
  verifiedText: "#1D4ED8",

  // System
  overlay: "rgba(0,0,0,0.4)",
  overlayLight: "rgba(0,0,0,0.3)",
  skeleton: "#E5E7EB",

  // Aliases for compatibility
  muted: "#5C5F62", // Alias for textMuted
  card: "#FFFFFF", // Alias for bg
  background: "#F9F9F9", // Alias for surface
} as const;
