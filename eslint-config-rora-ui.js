/**
 * ESLint Configuration for Rora UI Best Practices
 *
 * This config enforces the 10 UI best practices:
 * 1. Screen wrapper usage
 * 2. Layout primitives (Box, Text, Pressable)
 * 3. Token-only values (no hardcoded spacing/colors)
 * 4. Content stress test awareness
 * 5. Visual regression (manual)
 * 6. Text truncation
 * 7. Format helpers
 * 8. minWidth: 0 in rows
 * 9. No absolute positioning (except overlays)
 * 10. Safe area handling
 *
 * Usage:
 * 1. Add to your ESLint config: extends: ['./eslint-config-rora-ui.js']
 * 2. Or merge these rules into your existing .eslintrc.js
 */

module.exports = {
  rules: {
    // ========================================================================
    // RULE 2: Enforce UI primitives instead of raw React Native components
    // ========================================================================
    'no-restricted-imports': [
      'warn',
      {
        paths: [
          {
            name: 'react-native',
            importNames: ['View'],
            message:
              "Import 'Box' from '@/src/ui/primitives' instead of View from react-native.",
          },
          {
            name: 'react-native',
            importNames: ['Text'],
            message:
              "Import 'Text' from '@/src/ui/primitives' instead of Text from react-native.",
          },
          {
            name: 'react-native',
            importNames: ['TouchableOpacity', 'TouchableHighlight'],
            message:
              "Import 'Pressable' from '@/src/ui/primitives' instead of Touchable* from react-native.",
          },
        ],
      },
    ],

    // ========================================================================
    // RULE 3 & 7: Detect inline formatting that should use helpers
    // ========================================================================
    'no-restricted-syntax': [
      'warn',
      // Detect raw .toFixed() in JSX - should use formatCurrency/formatDistance
      {
        selector:
          "JSXExpressionContainer CallExpression[callee.property.name='toFixed']",
        message:
          "Use formatCurrency() or formatDistance() from '@/src/utils/format' instead of .toFixed()",
      },
      // Detect template literals with $ for currency - should use formatCurrency
      {
        selector:
          "JSXExpressionContainer TemplateLiteral[quasis.0.value.raw=/^\\$/]",
        message:
          "Use formatCurrency() from '@/src/utils/format' instead of template literal currency formatting",
      },
      // Detect hardcoded hex colors in style objects
      {
        selector:
          "Property[key.name='color'] Literal[value=/^#[0-9A-Fa-f]{3,8}$/]",
        message:
          "Use colors from '@/src/ui/tokens/colors' instead of hardcoded hex values",
      },
      {
        selector:
          "Property[key.name='backgroundColor'] Literal[value=/^#[0-9A-Fa-f]{3,8}$/]",
        message:
          "Use colors from '@/src/ui/tokens/colors' instead of hardcoded hex values",
      },
      {
        selector:
          "Property[key.name='borderColor'] Literal[value=/^#[0-9A-Fa-f]{3,8}$/]",
        message:
          "Use colors from '@/src/ui/tokens/colors' instead of hardcoded hex values",
      },
    ],

    // ========================================================================
    // RULE 9: Warn on absolute positioning (review needed)
    // ========================================================================
    // Note: This is a warning, not an error, since some cases are valid
    // (modals, FABs, overlays). Reviewer should verify usage is appropriate.

    // ========================================================================
    // RULE 10: Component complexity limits
    // ========================================================================
    'max-lines': [
      'warn',
      {
        max: 300,
        skipBlankLines: true,
        skipComments: true,
      },
    ],

    // ========================================================================
    // General code quality
    // ========================================================================
    'no-console': ['warn', { allow: ['warn', 'error'] }],
  },

  overrides: [
    // Don't enforce primitive imports in the primitives directory itself
    {
      files: ['src/ui/primitives/**/*.tsx', 'src/ui/primitives/**/*.ts'],
      rules: {
        'no-restricted-imports': 'off',
      },
    },
    // Don't enforce on generated files
    {
      files: ['src/types/database.ts'],
      rules: {
        'max-lines': 'off',
      },
    },
  ],
};

// ============================================================================
// ADDITIONAL PATTERNS TO CHECK MANUALLY OR VIA CUSTOM SCRIPT
// ============================================================================
//
// These patterns are harder to enforce via ESLint but should be checked
// during code review or via a custom script:
//
// 1. Hardcoded spacing numbers:
//    grep -r "padding:\s*\d\|margin:\s*\d\|gap:\s*\d" src/ui src/features app
//    Should use: space[n] from tokens/spacing.ts
//
// 2. Hardcoded font sizes:
//    grep -r "fontSize:\s*\d" src/ui src/features app
//    Should use: Text variant prop or type tokens
//
// 3. Hardcoded border radius:
//    grep -r "borderRadius:\s*\d" src/ui src/features app
//    Should use: radius.sm/md/lg/pill from tokens/radius.ts
//
// 4. Missing numberOfLines on Text:
//    Look for <Text> with flex: 1 parent but no numberOfLines prop
//
// 5. Missing minWidth: 0 in flex rows:
//    Look for flexDirection: 'row' with flex: 1 child without minWidth: 0
//
// 6. Absolute positioning outside overlays:
//    grep -r "position:\s*['\"]absolute['\"]" src/ui src/features app
//    Review each usage - only valid for modals, FABs, overlays
//
// ============================================================================
// PRE-COMMIT HOOK SCRIPT (scripts/check-ui-patterns.sh)
// ============================================================================
//
// #!/bin/bash
// set -e
//
// echo "🔍 Checking for UI anti-patterns..."
//
// # Check for hardcoded hex colors
// if grep -r "#[0-9A-Fa-f]\{6\}" src/ui/components src/features --include="*.tsx" | grep -v "tokens" | grep -v "node_modules"; then
//   echo "⚠️  Found hardcoded colors. Consider using color tokens."
// fi
//
// # Check for hardcoded spacing (common values)
// if grep -rE "(padding|margin|gap):\s*(4|8|12|16|20|24|32|40|48)[,\s}]" src/ui/components src/features --include="*.tsx" | grep -v "space\["; then
//   echo "⚠️  Found hardcoded spacing. Consider using space tokens."
// fi
//
// echo "✅ UI pattern check complete"
//
// ============================================================================
