# Rora Ride — Mobile Design Specification

**Version:** 1.0
**Last Updated:** 2026-01-04
**Status:** Active

This document defines the design rules for Rora Ride. All screens must conform to these rules. No exceptions without documented rationale.

This is a **specification document** (rules to follow), not implementation documentation.

---

## 1. Design Principles

### Core Philosophy
- **Warm & friendly**: The app should feel approachable, not corporate
- **In control**: Users should never feel rushed or pressured
- **Ambient presence**: Background processes don't demand attention
- **Scannable**: Information is organized for quick comprehension

### Hierarchy of Concerns
1. **Clarity** — Can the user understand what's happening?
2. **Confidence** — Does the user feel in control?
3. **Efficiency** — Can the user accomplish their goal quickly?
4. **Delight** — Does the interaction feel good?

---

## 2. Layout Grid & Spacing

### Base Unit
**4pt grid system.** All spacing values are multiples of 4.

### Spacing Scale
```
xs:   4pt   — Tight internal spacing (icon to label)
sm:   8pt   — Related elements (badge to badge)
md:   12pt  — Component internal padding
base: 16pt  — Standard spacing between elements
lg:   20pt  — Section separation within a screen
xl:   24pt  — Major section separation
2xl:  32pt  — Screen section dividers
3xl:  40pt  — Hero spacing / breathing room
4xl:  48pt  — Maximum spacing
```

### Screen Edge Padding
- **Horizontal (left/right)**: `16pt` standard, `20pt` for cards that need breathing room
- **Vertical (top/bottom)**: Respects safe areas + `16pt` minimum content padding
- **Map screens**: Map bleeds to edges; content sheet has `16pt` padding

### Content Width
- **Maximum content width**: None (full width minus edge padding)
- **Maximum text line length**: 75 characters (for readability)
- **Card content**: `16pt` internal padding on all sides

### Vertical Rhythm
- **Between list items**: `12pt`
- **Between sections**: `24pt`
- **Between screen regions**: `32pt`
- **After section headers**: `16pt`

---

## 3. Typography

### Font Family
**Inter** — Primary font for all text

Fallback stack: `Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`

### Type Scale
```
Display:    32pt / 40pt line-height / -0.5 tracking / Bold
Title 1:    28pt / 36pt line-height / -0.3 tracking / Semibold
Title 2:    22pt / 28pt line-height / -0.2 tracking / Semibold
Title 3:    18pt / 24pt line-height / 0 tracking / Semibold
Headline:   16pt / 22pt line-height / 0 tracking / Semibold
Body:       16pt / 24pt line-height / 0 tracking / Regular
Body Small: 14pt / 20pt line-height / 0 tracking / Regular
Caption:    12pt / 16pt line-height / 0.2 tracking / Regular
Overline:   11pt / 14pt line-height / 0.5 tracking / Medium (uppercase)
```

### Type Usage
| Context | Style | Weight |
|---------|-------|--------|
| Screen titles | Title 1 | Semibold |
| Section headers | Title 3 | Semibold |
| Card titles | Headline | Semibold |
| Body text | Body | Regular |
| Supporting text | Body Small | Regular |
| Labels, hints | Caption | Regular |
| Badges, tags | Overline | Medium |

### Dynamic Type Support
- **Body, Body Small, Caption**: Scale with system settings (limited range)
- **All headers**: Fixed size (max scaling factor: 1.2x)
- **Layout must accommodate**: Up to 120% text scaling without breaking

---

## 4. Color System

### Brand Colors
```
Primary (Teal):
  teal-500: #14B8A6  — Primary actions, links, active states
  teal-600: #0D9488  — Pressed states
  teal-700: #0F766E  — Dark mode primary (future)
  teal-100: #CCFBF1  — Light backgrounds, highlights
  teal-50:  #F0FDFA  — Subtle backgrounds

Accent (for emphasis):
  amber-500: #F59E0B — Warnings, attention
  amber-100: #FEF3C7 — Warning backgrounds
```

### Semantic Colors
```
Success:
  green-500: #22C55E
  green-100: #DCFCE7

Error:
  red-500: #EF4444
  red-100: #FEE2E2

Warning:
  amber-500: #F59E0B
  amber-100: #FEF3C7

Info:
  blue-500: #3B82F6
  blue-100: #DBEAFE
```

### Neutral Palette
```
Background:
  white:     #FFFFFF — Primary background
  gray-50:   #F9FAFB — Secondary background, cards on white
  gray-100:  #F3F4F6 — Disabled backgrounds, dividers

Text:
  gray-900:  #111827 — Primary text
  gray-700:  #374151 — Secondary text
  gray-500:  #6B7280 — Tertiary text, placeholders
  gray-400:  #9CA3AF — Disabled text
  white:     #FFFFFF — Text on dark backgrounds

Borders:
  gray-200:  #E5E7EB — Default borders
  gray-300:  #D1D5DB — Emphasized borders
```

### Special States
```
Map dimming overlay: rgba(0, 0, 0, 0.4)
Sheet backdrop (when modal): rgba(0, 0, 0, 0.3)
Skeleton loading: gray-200 with shimmer animation
Locked/blurred content: blur(8px) + gray-100 overlay at 60% opacity
```

---

## 5. Corner Radius

### Radius Scale
```
none: 0pt     — Sharp edges (rare)
sm:   4pt     — Small elements (badges, small buttons)
md:   8pt     — Inputs, smaller cards
base: 12pt    — Standard cards, sheets
lg:   16pt    — Prominent cards, bottom sheets
xl:   20pt    — Large modals, hero cards
full: 9999pt  — Pills, circular elements
```

### Usage Guidelines
| Element | Radius |
|---------|--------|
| Buttons (standard) | `base (12pt)` |
| Buttons (small) | `md (8pt)` |
| Input fields | `md (8pt)` |
| Cards | `base (12pt)` |
| Bottom sheets | `lg (16pt)` top corners only |
| Badges/tags | `sm (4pt)` |
| Avatars | `full` |
| Filter chips | `full` |

---

## 6. Shadows & Elevation

### Shadow Scale
```
sm:   0 1pt 2pt rgba(0,0,0,0.05)
      — Subtle lift (cards on gray background)

base: 0 1pt 3pt rgba(0,0,0,0.1), 0 1pt 2pt rgba(0,0,0,0.06)
      — Standard cards

md:   0 4pt 6pt rgba(0,0,0,0.1), 0 2pt 4pt rgba(0,0,0,0.06)
      — Elevated cards, floating elements

lg:   0 10pt 15pt rgba(0,0,0,0.1), 0 4pt 6pt rgba(0,0,0,0.05)
      — Bottom sheets, modals

xl:   0 20pt 25pt rgba(0,0,0,0.1), 0 10pt 10pt rgba(0,0,0,0.04)
      — Prominent overlays
```

### Elevation Hierarchy
1. **Background (map)**: No shadow
2. **Content cards**: `base` shadow
3. **Floating elements**: `md` shadow
4. **Bottom sheets**: `lg` shadow
5. **Modals**: `xl` shadow

---

## 7. Touch Targets & Accessibility

### Minimum Touch Targets
- **All interactive elements**: 44 × 44pt minimum
- **Primary actions**: 48 × 48pt recommended
- **Spacing between targets**: 8pt minimum

### Focus States
- All interactive elements must have visible focus indicators
- Focus ring: `2pt` solid `teal-500` with `2pt` offset

### Contrast Requirements
- **Large text (18pt+)**: 3:1 minimum contrast ratio
- **Body text**: 4.5:1 minimum contrast ratio
- **Interactive elements**: 3:1 minimum against background

### Screen Reader
- All images must have alt text
- All buttons must have accessible labels
- Form inputs must have associated labels

---

## 8. Motion & Animation

### Timing
```
instant:  0ms      — Immediate feedback (color changes)
fast:     150ms    — Micro-interactions (button press)
normal:   250ms    — Standard transitions
slow:     350ms    — Emphasis transitions
slower:   500ms    — Large content changes
```

### Easing
```
ease-out:    cubic-bezier(0, 0, 0.2, 1)     — Elements entering
ease-in:     cubic-bezier(0.4, 0, 1, 1)     — Elements exiting
ease-in-out: cubic-bezier(0.4, 0, 0.2, 1)   — Elements moving
spring:      cubic-bezier(0.175, 0.885, 0.32, 1.275) — Bouncy (rare)
```

### Animation Guidelines
- **Sheet expansion**: `normal` timing with `ease-out`
- **Screen transitions**: `normal` timing with `ease-in-out`
- **Loading skeletons**: Shimmer at `1.5s` loop, `ease-in-out`
- **Success feedback**: Quick pulse + haptic
- **Error feedback**: Subtle shake (3 oscillations, 150ms total)

### Reduce Motion
- Respect `prefers-reduced-motion`
- When enabled: Instant transitions, no decorative animation

---

## 9. Component Specifications

### 9.1 Buttons

#### Primary Button
```
Height: 52pt
Padding: 16pt horizontal
Background: teal-500
Text: white, Headline weight
Border radius: base (12pt)
Shadow: none (flat design)

States:
  Hover: teal-600
  Pressed: teal-700 + scale(0.98)
  Disabled: gray-300 background, gray-500 text
  Loading: Spinner replaces text, maintains width
```

#### Secondary Button (Ghost)
```
Height: 52pt
Padding: 16pt horizontal
Background: transparent
Border: 1.5pt solid gray-300
Text: gray-900, Headline weight
Border radius: base (12pt)

States:
  Hover: gray-50 background
  Pressed: gray-100 background
  Disabled: gray-200 border, gray-400 text
```

#### Text Button
```
Height: 44pt minimum (touch target)
Padding: 8pt horizontal
Background: transparent
Text: teal-500, Body weight

States:
  Hover: teal-600
  Pressed: teal-700
  Disabled: gray-400
```

#### Small Button
```
Height: 36pt
Padding: 12pt horizontal
Text: Body Small weight
Border radius: md (8pt)
```

### 9.2 Input Fields

#### Text Input
```
Height: 52pt
Padding: 16pt horizontal
Background: white
Border: 1.5pt solid gray-300
Border radius: md (8pt)
Text: Body, gray-900
Placeholder: Body, gray-500

States:
  Focus: teal-500 border, teal-50 background
  Error: red-500 border, red-50 background
  Disabled: gray-100 background, gray-400 text
```

#### Search Input
```
Same as Text Input plus:
  Left icon: Search icon, gray-500, 20pt
  Left padding: 44pt (to accommodate icon)
  Clear button: Right side when has content
```

### 9.3 Cards

#### Standard Card
```
Background: white
Border radius: base (12pt)
Shadow: base
Padding: 16pt all sides
```

#### Offer Card
```
Background: white
Border radius: base (12pt)
Shadow: base
Padding: 16pt all sides

Layout (top to bottom):
  Row 1: Driver photo (48pt circle) | Name + badges | Price (right-aligned)
  Row 2: Price label badge (if applicable)
  Row 3: Distance from pickup | Vehicle info
  Row 4: Select button (full width, secondary style)

Price typography: Title 2, gray-900
Price label badge: Prominent (see Badges section)
```

#### Driver Card (Directory)
```
Background: white
Border radius: base (12pt)
Shadow: base
Padding: 16pt all sides

Layout (top to bottom):
  Row 1: Driver photo (56pt circle) | Name + badges (vertical stack)
  Row 2: Languages | Capacity | Service areas (chips)
  Tap: Navigates to full profile
```

#### Venue Card
```
Background: white
Border radius: base (12pt)
Shadow: base
Overflow: hidden (for image)

Layout:
  Image: Top, 160pt height, full width
  Content padding: 16pt
  Title: Headline
  Category: Caption, gray-500
  CTA: "Get a ride" text button, right-aligned
```

### 9.4 Badges & Labels

#### Price Label - Good Deal
```
Background: green-100
Text: green-700, Overline style
Padding: 4pt horizontal, 2pt vertical
Border radius: sm (4pt)
Content: "GOOD DEAL"
```

#### Price Label - Pricier
```
Background: amber-100
Text: amber-700, Overline style
Padding: 4pt horizontal, 2pt vertical
Border radius: sm (4pt)
Content: "PRICIER THAN USUAL"
```

#### Rora Pro Badge
```
Background: teal-500
Text: white, Overline style
Padding: 4pt horizontal, 2pt vertical
Border radius: sm (4pt)
Content: "PRO"
Icon: Star, 10pt, left of text
```

#### Verification Badge
```
Background: blue-100
Text: blue-700, Overline style
Padding: 4pt horizontal, 2pt vertical
Border radius: sm (4pt)
Content: "VERIFIED"
Icon: Checkmark shield, 10pt, left of text
```

### 9.5 Filter Chips

```
Height: 36pt
Padding: 12pt horizontal
Background: gray-100 (unselected) | teal-100 (selected)
Border: 1pt solid gray-200 (unselected) | teal-500 (selected)
Text: Body Small, gray-700 (unselected) | teal-700 (selected)
Border radius: full

States:
  Unselected: gray-100 background
  Selected: teal-100 background, teal-500 border
  Pressed: Scale 0.95
```

### 9.6 Tab Bar

```
Height: 49pt + safe area bottom
Background: white
Border top: 1pt solid gray-200
Shadow: none

Tab Item:
  Width: Equal distribution
  Icon: 24pt, gray-500 (inactive) | teal-500 (active)
  Label: Caption, gray-500 (inactive) | teal-500 (active)
  Icon-to-label spacing: 4pt
  Touch target: Full width of tab, 49pt height
```

### 9.7 Headers

#### Screen Header
```
Height: 44pt + safe area top
Background: white (or transparent on map screens)
Shadow: none (shadow comes from content scroll)

Left: Back button (if navigable) | 44pt touch target
Center: Title, Headline, gray-900
Right: Action button(s) if needed | 44pt touch target
```

#### Large Title (Collapsing)
```
Expanded state:
  Title: Title 1, gray-900
  Position: Left-aligned, 16pt from edge
  Padding below: 16pt

Collapsed state:
  Title: Headline, gray-900
  Position: Centered in header
  Transition: Smooth collapse on scroll
```

---

## 10. Screen Templates

### 10.1 Map + Bottom Sheet Screen

**Used for:** Home, Discovery, Active Ride, QR Session

```
Structure:
┌─────────────────────────────┐
│ Status Bar (safe area)      │
├─────────────────────────────┤
│                             │
│        MAP REGION           │
│    (dominant, 70%+ view)    │
│                             │
│                             │
├─────────────────────────────┤ ← Sheet handle
│                             │
│    BOTTOM SHEET CONTENT     │
│                             │
│    [Primary CTA - Fixed]    │
└─────────────────────────────┘

Sheet behavior:
  - Snap points: Contextual per screen state
  - Handle: 4pt × 36pt pill, gray-300, centered, 8pt from top
  - Corner radius: lg (16pt) top corners
  - Background: white
  - Shadow: lg

When sheet expands:
  - Map dims with overlay (rgba 0,0,0,0.4)
  - Smooth transition (normal timing, ease-out)
```

#### Home Screen Specifics
```
Sheet peek state:
  - Height: ~180pt
  - Content: Search input, zone chips
  - Dismissible: No (always visible minimum)

Search tap behavior:
  - Navigates to full-screen search (not sheet expansion)
  - Transition: Push from right
```

#### Discovery Screen Specifics
```
Sheet states:
  Peek (no offers): ~120pt
    - Animated status text
    - Cancel text button

  Offers received: ~300pt (shows top 3)
    - Offer cards
    - "View all X offers" if > 3

  Expanded: Full screen minus 100pt
    - All offers visible
    - Scrollable

Dismissible: Collapsible to peek, not fully dismissible
```

### 10.2 List Screen

**Used for:** Drivers Directory, Explore (Venues), Activity (History), Favorites

```
Structure:
┌─────────────────────────────┐
│ Status Bar (safe area)      │
├─────────────────────────────┤
│ Large Title (collapsing)    │
├─────────────────────────────┤
│ [Filter chips - horizontal] │ ← Optional, sticky when scrolling
├─────────────────────────────┤
│                             │
│    SCROLLABLE LIST          │
│    [Card]                   │
│    [Card]                   │
│    [Card]                   │
│    [Empty/Loading state]    │
│                             │
└─────────────────────────────┘
│ Tab Bar                     │
└─────────────────────────────┘

Scroll behavior:
  - Large title collapses to inline header
  - Filter chips stick below header
  - Content scrolls beneath

List item spacing: 12pt between cards
Edge padding: 16pt horizontal
```

#### Activity Screen Specifics
```
Section headers:
  - "Upcoming" (if any scheduled rides exist)
  - "Past rides"

Empty states:
  - Upcoming: "No upcoming rides" with illustration
  - Past: "Your ride history will appear here" with illustration
```

### 10.3 Detail Screen

**Used for:** Driver Profile, Ride Detail, Venue Detail

```
Structure:
┌─────────────────────────────┐
│ Status Bar (safe area)      │
├─────────────────────────────┤
│ [Back]      Title   [Action]│
├─────────────────────────────┤
│                             │
│    HERO IMAGE/CONTENT       │
│    (optional, ~200pt)       │
│                             │
├─────────────────────────────┤
│                             │
│    SCROLLABLE CONTENT       │
│    [Section 1]              │
│    [Section 2]              │
│    [Section 3]              │
│                             │
├─────────────────────────────┤
│ [Primary CTA - Fixed]       │ ← If applicable
│ Safe area bottom            │
└─────────────────────────────┘

No tab bar: Detail screens hide tab bar
Navigation: Back button returns to previous screen
```

#### Driver Profile Specifics
```
Hero section:
  - Large photo (circular, 96pt)
  - Name (Title 2)
  - Badges row (Pro, Verified)
  - Rating (if threshold met)

Content sections:
  - About (languages, capacity)
  - Service areas
  - Contact info (if opted in)

CTA (fixed):
  - "Request this driver" (primary)
  - OR "Not accepting requests" (disabled state, no button)

Secondary action:
  - Heart icon in header for favorite/unfavorite
```

### 10.4 Full Screen Search

**Used for:** Destination search, Origin search

```
Structure:
┌─────────────────────────────┐
│ Status Bar (safe area)      │
├─────────────────────────────┤
│ [Back] [Search Input      ] │
├─────────────────────────────┤
│ [Zone chips - horizontal]   │
├─────────────────────────────┤
│                             │
│    SEARCH RESULTS           │
│    [Result row]             │
│    [Result row]             │
│    [Result row]             │
│                             │
│    RECENT SEARCHES          │
│    [Recent item]            │
│    [Recent item]            │
│                             │
└─────────────────────────────┘

No tab bar: Search is a focused modal-like experience
Input: Auto-focused on entry
Results: Google Places autocomplete
Zone chips: Quick destination selection
```

### 10.5 Authentication Screens

**Used for:** Login, OTP entry, Email verification

```
Structure:
┌─────────────────────────────┐
│ Status Bar (safe area)      │
├─────────────────────────────┤
│                             │
│    [Logo - 64pt]            │
│                             │
│    Title (Title 1)          │
│    Subtitle (Body, gray-500)│
│                             │
│    [Input field]            │
│    [Secondary option link]  │
│                             │
│    [Primary CTA]            │
│                             │
│                             │
│    [Footer text/links]      │
│                             │
└─────────────────────────────┘

No tab bar
Keyboard avoidance: Content scrolls/shifts to keep input visible
```

### 10.6 Settings Screen

**Used for:** Profile/Settings

```
Structure:
┌─────────────────────────────┐
│ Status Bar (safe area)      │
├─────────────────────────────┤
│ Large Title: Settings       │
├─────────────────────────────┤
│                             │
│    [User info card]         │
│                             │
│    [Settings section]       │
│      [Row: Label → Value]   │
│      [Row: Label → Toggle]  │
│                             │
│    [Settings section]       │
│      [Row: Favorites]       │
│      [Row: Saved locations] │
│                             │
│    [Subscription section]   │
│      [Current plan info]    │
│      [Upgrade CTA]          │
│                             │
│    [Danger zone]            │
│      [Log out]              │
│                             │
└─────────────────────────────┘
│ Tab Bar                     │
└─────────────────────────────┘
```

---

## 11. State Templates

### 11.1 Empty States

```
Structure:
┌─────────────────────────────┐
│                             │
│    [Illustration - 120pt]   │
│                             │
│    Title (Headline)         │
│    "No favorites yet"       │
│                             │
│    Body (Body Small, gray-500)
│    "Drivers you favorite    │
│     will appear here"       │
│                             │
│    [CTA button - optional]  │
│    "Browse drivers"         │
│                             │
└─────────────────────────────┘

Personality: Friendly, encouraging
Illustration style: Simple line art, teal accent color
Center-aligned, vertically centered in available space
```

### 11.2 Loading States (Skeleton)

```
Skeleton elements:
  - Background: gray-200
  - Shimmer: Left-to-right gradient animation
  - Animation: 1.5s loop, ease-in-out
  - Shape: Match content shape with rounded corners

Card skeleton:
  ┌─────────────────────────────┐
  │ [○ 48pt] [████████ 60%]    │
  │          [████ 30%]         │
  │ [████████████████ 80%]     │
  │ [██████████ 50%]           │
  └─────────────────────────────┘
```

### 11.3 Error States

```
Toast/Snackbar:
  Position: Bottom, above tab bar (if visible) or safe area
  Margin: 16pt from edges
  Background: gray-900
  Text: white, Body Small
  Padding: 12pt horizontal, 16pt vertical
  Border radius: md (8pt)
  Duration: 4 seconds (auto-dismiss)
  Action: Optional "Retry" text button, teal-400

  Slide up animation: normal timing, ease-out
  Slide down on dismiss: fast timing, ease-in
```

### 11.4 Locked Content (Free Tier Limits)

```
Driver card beyond limit:
  - Apply blur(8px) to card content
  - Overlay: gray-100 at 60% opacity
  - Lock icon centered, gray-500, 32pt

List terminator:
  ┌─────────────────────────────┐
  │ + 47 more drivers           │
  │                             │
  │ Upgrade to Pro to see       │
  │ the full directory          │
  │                             │
  │ [Upgrade button - primary]  │
  └─────────────────────────────┘

Inline upgrade prompt:
  - Background: teal-50
  - Border: 1pt solid teal-200
  - Border radius: base (12pt)
  - Padding: 16pt
  - Text: Body, gray-700
  - CTA: Text button, teal-500
```

---

## 12. Navigation Patterns

### 12.1 Tab Navigation

**5 Tabs:**
| Tab | Icon | Label | Content |
|-----|------|-------|---------|
| Home | House | Home | Map + ride flow |
| Drivers | Users | Drivers | Driver directory |
| Explore | Compass | Explore | Venues (restaurants, hotels, beaches) |
| Activity | Clock | Activity | Ride history (upcoming + past) |
| Profile | User | Profile | Settings, account, favorites |

**Tab Bar Visibility:**
- **Visible:** Home (idle), Drivers, Explore, Activity, Profile
- **Hidden:** During ride flow (QR → Discovery → Offers → Active → Complete)

### 12.2 Screen Transitions

| From | To | Transition |
|------|-----|------------|
| Tab → Tab | Instant crossfade | |
| List → Detail | Push from right | |
| Home → Search | Push from right | |
| Button → Modal | Slide up from bottom | |
| Any → Ride Flow | Crossfade (sheet morphs) | |

### 12.3 Back Behavior

- **Header back button:** Returns to previous screen in stack
- **Swipe from left edge:** Same as back button (iOS)
- **Hardware back (Android):** Same as back button
- **Sheet drag down:** Collapses sheet (doesn't navigate back)
- **During ride flow:** Back navigates within flow, confirms if would exit

### 12.4 Deep Links

Structure: `rora://[path]`
| Path | Destination |
|------|-------------|
| `/ride/:id` | Ride detail screen |
| `/driver/:id` | Driver profile |
| `/venue/:id` | Venue detail |
| `/offers` | Current offers (if in discovery) |

---

## 13. Non-Negotiable Rules

These rules must be followed on every screen. No exceptions.

### Layout Rules

1. **Primary CTAs must never be hidden behind tab bar or keyboard**
   - Use keyboard avoidance
   - Position CTAs above tab bar area

2. **All interactive elements must meet 44pt minimum touch target**
   - Even if visual size is smaller, touch area must be 44×44pt

3. **Safe areas must be respected**
   - No content in notch/dynamic island area
   - No content in home indicator area

4. **Map screens must dim when sheet expands beyond peek**
   - Maintains focus on sheet content
   - User understands sheet is primary

### Interaction Rules

5. **No screen ships without empty, loading, and error states**
   - Skeleton loading for initial load
   - Empty state with illustration for zero items
   - Toast for errors

6. **Inline prompts, not modals (except for critical confirmations)**
   - "Expand search?" appears inline
   - "Cancel ride?" gets confirmation modal

7. **Ride flow hides tab bar**
   - From QR generation through completion
   - User is focused on the ride

8. **Confirmations only for critical actions**
   - Cancel ride: Confirm
   - Remove favorite: No confirmation (could add undo toast)
   - Log out: Confirm

### Content Rules

9. **Price is always prominent with context**
   - Price + label ("Good deal") as visual unit
   - Never show price without context on offer cards

10. **Badges are first-class UI elements**
    - Rora Pro, Verified, price labels are prominent
    - Not afterthoughts or tiny icons

11. **Free tier limits are visible**
    - Show blurred/locked content
    - Show count of hidden items
    - Upgrade path is inline, not modal

### Performance Rules

12. **Skeleton loading within 100ms of navigation**
    - User sees immediate response
    - Content populates as available

13. **Animations respect reduce-motion preference**
    - When enabled, transitions are instant
    - No decorative animation

---

## 14. Screen-by-Screen Specifications

### 14.1 Home Screen

**Template:** Map + Bottom Sheet

**Sheet Peek State:**
- Height: 180pt
- Content:
  - Search input (tappable, navigates to search)
  - Zone chips row (horizontal scroll)
  - "Use my location" button (if location denied)
- Dismissible: No

**Map State:**
- Shows user location (if permitted)
- No driver markers
- Clean, minimal

**Tap search → Full screen search**

---

### 14.2 Search Screen

**Template:** Full Screen Search

**Layout:**
- Header: Back button + Search input (auto-focused)
- Below input: Zone chips (Airport, Cruise Port, Maho Beach)
- Results area: Places autocomplete results
- Below results: Recent searches section

**Behaviors:**
- Zone chip tap: Selects as destination, returns to estimate
- Result tap: Selects as destination, returns to estimate
- Clear button: Clears input, shows recent searches

---

### 14.3 Route & Estimate Screen

**Template:** Map + Bottom Sheet

**Sheet State:**
- Height: ~280pt (or taller if content requires)
- Content:
  - Origin pill (tappable to change)
  - Destination pill (tappable to change)
  - Divider
  - Rora Fare (Title 1, centered, just the number: "$20")
  - Primary CTA: "Generate QR"
  - Secondary: "Edit route" (text button)

**First-time disclaimer:**
- Appears once per session
- "Final fare may be negotiated with driver"
- "Got it" dismisses forever in session

**Free tier limit:**
- If quotes exhausted, show inline upgrade prompt
- "You've used your 3 free quotes this month. Upgrade to Pro for unlimited."
- CTA: "Upgrade"

---

### 14.4 QR Session Screen

**Template:** Map + Bottom Sheet

**Sheet State:**
- Height: ~380pt (expanded)
- Content:
  - QR code (200pt × 200pt, centered)
  - Route summary below QR (Origin → Destination)
  - Rora Fare ($20)
  - Primary CTA: "Look for drivers"
  - Secondary: "Cancel" (text button)

**QR Display:**
- Plain black/white (no embedded logo for scan reliability)
- Cached offline
- Generates haptic + visual feedback on successful scan

---

### 14.5 Discovery Screen

**Template:** Map + Bottom Sheet

**Sheet States:**

**Waiting (no offers yet):**
- Height: ~120pt
- Content:
  - Animated status text (rotating phrases)
  - "Finding drivers..." → "Checking availability..." → etc.
  - Subtle animation (fade/slide transitions)
  - "Cancel" text button

**Offers received:**
- Height: ~340pt (peek with offers)
- Content:
  - "X drivers responded" (Headline)
  - Top 3 offer cards
  - If > 3: "View all X offers" text button
  - Each card has "Select" secondary button

**Expanded (all offers):**
- Height: Full screen minus 100pt map peek
- Scrollable list of all offers
- Each offer card with "Select" button

**Discovery escalation prompt (inline):**
- After 10 min with no offers:
  - Inline card appears in sheet
  - "No drivers nearby yet"
  - "We can look a bit farther out"
  - CTAs: "Expand search" (primary) | "Keep waiting" (text)

**Map behavior:**
- Dims when sheet expanded beyond peek

---

### 14.6 Offer Card

**Layout (within card):**
```
┌─────────────────────────────────────┐
│ [Photo 48pt] [Name          ] [$25]│
│              [PRO][VERIFIED]       │
│              [GOOD DEAL]           │
│─────────────────────────────────────│
│ 0.5 km away • Seats 4              │
│─────────────────────────────────────│
│         [Select - secondary]        │
└─────────────────────────────────────┘
```

**Price prominence:** Title 2, gray-900, right-aligned
**Badges:** Row below name
**Price label:** Prominent badge (Good deal = green, Pricier = amber)
**Select button:** Full width, secondary (ghost) style

---

### 14.7 Hold/Confirmation Screen

**Template:** Map + Bottom Sheet

**Sheet State:**
- Height: ~240pt
- Content:
  - Selected driver card (photo, name, badges)
  - Agreed fare
  - "Waiting for driver confirmation..."
  - Spinner (subtle)
  - "Cancel" text button

**In-person scan override (inline prompt):**
- If different driver scans QR:
  - Inline card appears
  - "A driver is here in person"
  - [Driver card preview]
  - CTAs: "Switch to this driver" | "Keep [original driver]"

---

### 14.8 Active Ride Screen

**Template:** Map + Bottom Sheet

**Sheet State:**
- Height: ~200pt
- Content:
  - "Ride in progress" (Headline)
  - Driver info (photo, name, badges)
  - Route: Origin → Destination
  - Agreed fare
  - No CTA (ride controlled by driver)

**No tab bar:** Hidden during ride
**Cannot cancel:** Only admin can force-cancel active rides

---

### 14.9 Completion Summary Screen

**Template:** Detail Screen (no hero)

**Layout:**
- Checkmark success icon (teal, 64pt)
- "Ride complete" (Title 1)
- Route summary
- Fare paid
- Driver info card
- Rating prompt (optional)
- Primary CTA: "Done" (returns to Home)
- Secondary: "Report an issue" (text button)

**Rating UI:**
- 5 stars, tappable
- "How was your ride with [Driver]?"
- Optional, dismissible
- Submits silently on tap

---

### 14.10 Drivers Directory

**Template:** List Screen

**Header:** "Drivers" (collapsing large title)

**Filter chips (horizontal scroll):**
- Service Area (multi-select: Airport, Cruise Port, VIP)
- Capacity (4+, 6+, 8+)
- Languages
- Rora Pro

**List content:**
- Driver cards
- 12pt spacing between cards

**Free tier limit:**
- After 10 drivers, show locked cards (blurred)
- After locked cards, upgrade prompt card

**Tap card → Driver Profile (push)**

---

### 14.11 Driver Profile

**Template:** Detail Screen

**Hero section:**
- Large photo (96pt circle)
- Name (Title 2)
- Badge row (Pro, Verified)
- Rating with count (if threshold met): "4.8 ★ (47 rides)"

**Content sections:**
- **About:** Languages, vehicle capacity
- **Service areas:** Chips showing tags
- **Contact:** Phone/WhatsApp (if opted in)

**Header action:** Heart icon (favorite toggle)

**CTA (fixed):**
- If accepting: "Request this driver" (primary)
- If not accepting: "Not accepting requests" (disabled text, no button)

---

### 14.12 Explore (Venues)

**Template:** List Screen

**Header:** "Explore" (collapsing large title)

**Filter chips:**
- Popular
- Beaches
- Hotels
- Restaurants
- Nightlife
- (etc.)

**List content:**
- Venue cards (with image)
- 12pt spacing

**Tap card → Venue Detail (push)**

---

### 14.13 Venue Detail

**Template:** Detail Screen

**Hero:** Large image (200pt)

**Content:**
- Name (Title 2)
- Category chip
- Description (Body)
- Address
- Hours (if available)

**CTA (fixed):** "Get a ride here" (primary)
- Tapping pre-fills venue as destination
- Navigates to Route & Estimate screen

---

### 14.14 Activity (History)

**Template:** List Screen

**Header:** "Activity" (collapsing large title)

**Sections:**
- "Upcoming" (if scheduled rides exist, even though feature is future)
- "Past rides"

**Ride cards (minimal):**
```
┌─────────────────────────────────────┐
│ Jan 4, 2026                         │
│ Airport → Maho Beach         $20   │
└─────────────────────────────────────┘
```

**Empty state:**
- "Your rides will appear here"
- Illustration of car/route

**Tap card → Ride Detail (push)**

---

### 14.15 Ride Detail

**Template:** Detail Screen

**Content:**
- Date & time
- Route (Origin → Destination, with mini-map optional)
- Agreed fare
- Driver info (photo, name, badges)
- Ride status (Completed / Canceled)

**Actions:**
- "Favorite this driver" (if not already)
- "Report an issue"

---

### 14.16 Profile / Settings

**Template:** Settings Screen

**User card:**
- Photo (if available)
- Name
- Phone/email

**Sections:**
- **Account:** Edit profile
- **Saved:** Favorites, Saved locations
- **Preferences:** Notifications
- **Subscription:** Current plan, Upgrade CTA (if free)
- **Support:** Help center link, Contact support
- **Account actions:** Log out

**Free tier indicator:**
- Shows "Free plan" with usage counts
- "2 of 3 quotes used this month"
- "Upgrade to Pro" CTA

---

### 14.17 Authentication: Phone Entry

**Template:** Auth Screen

**Content:**
- Rora logo (64pt)
- "Welcome to Rora" (Title 1)
- "Enter your phone number to get started" (Body, gray-500)
- Phone input with country code
- "Use email instead" (text link below input)
- "Continue" (primary CTA)
- Footer: Terms & Privacy links

---

### 14.18 Authentication: OTP Entry

**Template:** Auth Screen

**Content:**
- "Enter code" (Title 1)
- "We sent a code to +1 555-1234" (Body, gray-500)
- OTP input (6 boxes)
- "Resend code" (text button, shows countdown if recently sent)
- Auto-submits when 6 digits entered
- "Use a different number" (text link)

---

### 14.19 Favorites

**Template:** List Screen (accessed from Profile)

**Header:** "Favorites" (standard header, not collapsing)

**Content:**
- List of favorited driver cards
- Same card format as directory

**Empty state:**
- "No favorites yet"
- "Drivers you favorite will appear here for quick access"
- "Browse drivers" CTA

**Tap card → Driver Profile**

---

## 15. User Tiers & Monetization

### 15.1 Tier Model

**Free Tier (Default):**
- 3 fare quotes per month
- 10 drivers visible in directory
- Full ride flow access (if quotes remain)
- Ride history

**Pro Tier (Subscription):**
- Unlimited fare quotes
- Full driver directory access
- All features

### 15.2 Limit Enforcement UI

**Quote limit reached:**
```
Location: Route & Estimate screen
Trigger: User tries to generate 4th quote

Display: Inline upgrade prompt (not modal)
  Background: teal-50
  Text: "You've used your 3 free quotes this month."
  CTA: "Upgrade to Pro for unlimited" (primary)

Blocked action: Generate QR button disabled
```

**Directory limit:**
```
Location: Drivers directory
Trigger: After 10th driver card

Display:
  - Cards 11+ are blurred with lock icon
  - After blurred cards, terminator card:
    "+ X more drivers"
    "Upgrade to Pro to see the full directory"
    [Upgrade button]
```

### 15.3 Subscription Access

**Location:** Profile → Subscription section

**Free user view:**
- "Free Plan"
- "2 of 3 quotes used this month"
- "Upgrade to Pro" (primary CTA)

**Pro user view:**
- "Pro Plan"
- "Renews [date]"
- "Manage subscription" (text link)

---

## 16. SPEC.md Alignment Notes

This design specification incorporates changes from product discussions that differ from SPEC.md:

| Topic | SPEC.md | Design Spec |
|-------|---------|-------------|
| Guest mode | Extensive guest mode, 5 QRs/hour | No guest mode; auth required, free tier with limits |
| Monetization | Rora Pro for drivers | Subscription tiers for riders (Free/Pro) |
| Tab structure | Implied 4 tabs | 5 tabs (Home, Drivers, Explore, Activity, Profile) |
| Explore tab | Not specified | Venues (restaurants, hotels, beaches, etc.) |
| Favorites location | Implied separate | Within Profile tab |

**Recommendation:** Update SPEC.md to reflect these decisions.

---

## 17. Component Checklist

Before shipping any screen, verify:

- [ ] Uses correct screen template
- [ ] Follows spacing scale (no magic numbers)
- [ ] Typography uses defined styles
- [ ] Colors use defined tokens
- [ ] Touch targets meet 44pt minimum
- [ ] Empty state designed
- [ ] Loading state designed (skeleton)
- [ ] Error state handled (toast)
- [ ] Safe areas respected
- [ ] CTA not hidden by keyboard/tab bar
- [ ] Animations respect reduce-motion
- [ ] Free tier limits handled (if applicable)

---

*End of Design Specification*
