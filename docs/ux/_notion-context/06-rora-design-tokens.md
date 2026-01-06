Good. This is where Rora stops being “a nice UI” and starts becoming  **a real product**.
I’ll define this the way top tech teams do it:  **tokens first, opinions baked in, no ambiguity**. You can copy this straight into a  **`design-tokens.ts`**  or Figma Variables.
Rora Design Token System (v1)
This is  **light-mode only**, modern, calm, trustworthy. Built for mobility, maps, and real-world use.
1. Color Tokens
Philosophy
- Neutral-first
- One brand accent
- High contrast
- No decorative colors
Core Palette
\\`colors = \\{
	// Neutrals
	background: "#F7F8FA",      // App background
	surface: "#FFFFFF",        // Cards, sheets
	surfaceMuted: "#F1F3F6",    // Inputs, subtle fills
	border: "#E5E7EB",          // Dividers, outlines
	// Text
	textPrimary: "#0F172A",     // Almost-black
	textSecondary: "#475569",   // Subtitles
	textMuted: "#94A3B8",       // Helper / placeholder
	textInverse: "#FFFFFF",
	// Brand (Rora)
	brand: "#1FAF8A",           // Rora Green
	brandHover: "#179C7A",
	brandSoft: "#E6F7F2",       // Light brand background
	// Semantic
	success: "#16A34A",
	warning: "#F59E0B",
	error: "#DC2626",
	// Utility
	overlay: "rgba(15, 23, 42, 0.4)"
\\}
\\`
Rules:
- **`brand`**  is used for  **primary actions only**
- Never tint random UI elements green
- Maps stay neutral
1. Spacing Tokens (8pt System)
Philosophy
If it’s not in this list, it doesn’t exist.
\\`spacing = \\{
	0: 0,
	1: 4,
	2: 8,
	3: 12,
	4: 16,
	5: 20,
	6: 24,
	7: 32,
	8: 40,
	9: 48,
	10: 64
\\}
\\`
Usage rules:
- Card padding:  **`spacing\\[4\\]`**  or  **`spacing\\[5\\]`**
- Screen horizontal padding:  **`spacing\\[4\\]`**  (16px)
- Section gaps:  **`spacing\\[7\\]`**  (32px)
- Button horizontal padding:  **`spacing\\[5\\]`**
If something feels off, it’s because someone violated this.
1. Radius Tokens
Philosophy
Soft, friendly, but not bubbly.
\\`radius = \\{
	xs: 6,     // Tags, pills
	sm: 8,     // Inputs
	md: 12,    // Cards
	lg: 16,    // Sheets, modals
	full: 999  // Pills / avatars
\\}
\\`
Rules:
- Cards:  **`md`**
- Bottom sheets:  **`lg`**
- Buttons:  **`sm`**  or  **`md`**, never mix on same screen
1. Typography Tokens
Font Stack
- **Primary**: Inter
- **Fallback**: system-ui, SF Pro
Font Sizes & Line Heights
\\`type = \\{
	// Display (rare)
	display: \\{
		size: 32,
		lineHeight: 40,
		weight: 600
	\\},
	// Headings
	h1: \\{
		size: 24,
		lineHeight: 32,
		weight: 600
	\\},
	h2: \\{
		size: 20,
		lineHeight: 28,
		weight: 600
	\\},
	// Body
	body: \\{
		size: 16,
		lineHeight: 24,
		weight: 400
	\\},
	bodyMedium: \\{
		size: 16,
		lineHeight: 24,
		weight: 500
	\\},
	// Small
	caption: \\{
		size: 14,
		lineHeight: 20,
		weight: 400
	\\},
	label: \\{
		size: 12,
		lineHeight: 16,
		weight: 500
	\\}
\\}
\\`
Rules:
- Body text is always 16px
- Never use more than 3 text styles per screen
- Labels are uppercase sparingly, not by default
1. Button Tokens
Sizes
\\`button = \\{
	height: \\{
		sm: 40,
		md: 48,
		lg: 56
	\\}
\\}
\\`
Styles
\\`buttonVariants = \\{
	primary: \\{
		background: colors.brand,
		text: colors.textInverse
	\\},
	secondary: \\{
		background: colors.surfaceMuted,
		text: colors.textPrimary
	\\},
	ghost: \\{
		background: "transparent",
		text: colors.textPrimary
	\\}
\\}
\\`
Rules:
- One  **primary button per screen**
- Secondary buttons never use brand color
- Ghost buttons are for navigation or cancel actions
1. Elevation (Shadows)
Philosophy
Subtle. If you notice it, it’s too much.
\\`shadow = \\{
	sm: "0 1px 2px rgba(0,0,0,0.05)",
	md: "0 4px 12px rgba(0,0,0,0.08)",
	lg: "0 12px 24px rgba(0,0,0,0.12)"
\\}
\\`
Usage:
- Cards:  **`sm`**
- Sheets:  **`md`**
- Floating CTAs:  **`lg`**
1. Motion Tokens
\\`motion = \\{
	fast: 150,
	normal: 200,
	slow: 280,
	easing: "cubic-bezier(0.2, 0, 0, 1)"
\\}
\\`
Rules:
- Bottom sheets use  **`normal`**
- Micro interactions use  **`fast`**
- No spring chaos
1. Hard Rules (Read this twice)
- No custom spacing per screen
- No custom button styles
- No random font sizes
- No new colors without intent
- Design tokens are law, not suggestions
This is how Airbnb, Apple, Uber stay clean at scale.
Next (strongly recommended)
I can:
1. Convert this into  **Tailwind config**
2. Generate  **Shadcn-style components**
3. Apply this system to  **Rora Rider home + bottom sheet**
4. Audit your current screens and show exactly what violates the system
This foundation will carry Rora for years if you respect it.

