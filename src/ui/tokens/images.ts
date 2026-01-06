/**
 * Image System Constants
 * Standardized image sizes, aspect ratios, and placeholders.
 */

/**
 * Default blurhash placeholder for all images.
 * Represents a neutral gray gradient that works well with most content.
 */
export const DEFAULT_BLURHASH = 'LGF5]+Yk^6#M@-5c,1J5@[or[Q6.';

/**
 * Image size constants following 8pt grid.
 * Use these instead of magic numbers for image dimensions.
 */
export const imageSizes = {
  // Avatar sizes
  avatarXs: 24,
  avatarSm: 32,
  avatarMd: 40,
  avatarLg: 60,
  avatarXl: 80,

  // Thumbnail sizes
  thumbnailSm: 48,
  thumbnailMd: 80,
  thumbnailLg: 100,

  // Card image sizes
  cardSm: 120,
  cardMd: 160,
  cardLg: 200,
} as const;

/**
 * Standard aspect ratios for image containers.
 */
export const aspectRatios = {
  square: 1,
  landscape: 16 / 9,
  portrait: 3 / 4,
  wide: 2 / 1,
} as const;

/**
 * Default image transition duration in milliseconds.
 */
export const IMAGE_TRANSITION_DURATION = 300;
