import { type TextProps } from 'react-native';

import { Text } from '../primitives/Text';
import { type } from '../tokens/typography';

/**
 * Truncation variants with semantic meaning.
 *
 * - `title`: Single line, tail ellipsis (for headings, names)
 * - `address`: Single line, middle ellipsis (for addresses - shows start+end)
 * - `subtitle`: Single line, tail ellipsis (for secondary info)
 * - `description`: Two lines, tail ellipsis (for descriptions)
 * - `body`: Three lines, tail ellipsis (for longer text blocks)
 */
type TruncationVariant = 'title' | 'address' | 'subtitle' | 'description' | 'body';

type TruncatedTextProps = Omit<TextProps, 'numberOfLines' | 'ellipsizeMode'> & {
  /**
   * Truncation variant determining lines and ellipsis mode.
   * @default 'title'
   */
  truncation?: TruncationVariant;
  /**
   * Typography variant from the type system.
   * @default 'body'
   */
  variant?: keyof typeof type;
  /**
   * Whether to use muted text color.
   */
  muted?: boolean;
  /**
   * Override the number of lines (ignores truncation preset).
   */
  lines?: number;
};

const TRUNCATION_CONFIG: Record<
  TruncationVariant,
  { numberOfLines: number; ellipsizeMode: 'head' | 'middle' | 'tail' | 'clip' }
> = {
  title: { numberOfLines: 1, ellipsizeMode: 'tail' },
  address: { numberOfLines: 1, ellipsizeMode: 'middle' },
  subtitle: { numberOfLines: 1, ellipsizeMode: 'tail' },
  description: { numberOfLines: 2, ellipsizeMode: 'tail' },
  body: { numberOfLines: 3, ellipsizeMode: 'tail' },
};

/**
 * TruncatedText - Text with built-in truncation variants
 *
 * Provides semantic truncation patterns:
 * - Titles: Single line with tail ellipsis
 * - Addresses: Single line with middle ellipsis (shows start and end)
 * - Descriptions: Two lines with tail ellipsis
 *
 * Usage:
 * ```tsx
 * <TruncatedText truncation="title" variant="headline">
 *   Very Long Restaurant Name That Needs Truncation
 * </TruncatedText>
 *
 * <TruncatedText truncation="address" variant="bodySmall" muted>
 *   123 Example Street, Philipsburg, Sint Maarten
 * </TruncatedText>
 *
 * <TruncatedText truncation="description" variant="body">
 *   This is a longer description that may wrap to multiple lines
 *   before being truncated with an ellipsis.
 * </TruncatedText>
 * ```
 */
export function TruncatedText({
  truncation = 'title',
  variant = 'body',
  muted,
  lines,
  style,
  children,
  ...rest
}: TruncatedTextProps) {
  const config = TRUNCATION_CONFIG[truncation];
  const numberOfLines = lines ?? config.numberOfLines;

  return (
    <Text
      variant={variant}
      muted={muted}
      numberOfLines={numberOfLines}
      ellipsizeMode={config.ellipsizeMode}
      style={style}
      {...rest}
    >
      {children}
    </Text>
  );
}
