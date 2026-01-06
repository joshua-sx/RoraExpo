# Rora Mobile Design System Spec

## Overview

This document defines the design system for Rora Ride's mobile app. It is the single source of truth for layout, spacing, typography, components, and screen patterns. All screens must conform to these rules.

**Design Philosophy:**
- Eager anticipation — the app should feel inviting and forward-moving
- Balanced density — comfortable spacing, clear grouping, not cramped or wasteful
- Price-first hierarchy — on offer comparisons, price dominates
- Grounded CTAs — primary actions feel stable, anchored to bottom
- Simple, readable, easy to delete — no over-engineering

---

## 1. Layout Grid & Spacing

### Base Unit
**8pt grid** — all spacing derives from multiples of 8. Exception: 4pt for micro-adjustments.

### Spacing Scale
```
space[0]: 0px
space[1]: 4px   (micro gaps, icon padding)
space[2]: 8px   (tight gaps between related items)
space[3]: 12px  (standard gap within components)
space[4]: 16px  (standard padding, section gaps)
space[5]: 20px  (screen horizontal padding)
space[6]: 24px  (larger section breaks)
space[7]: 32px  (major section separators)
space[8]: 40px  (hero spacing)
space[9]: 48px  (large vertical rhythm)
```

### Standard Paddings

| Context | Value | Token |
|---------|-------|-------|
| Screen horizontal | 20px | `space[5]` |
| Card internal | 16px | `space[4]` |
| List item vertical | 12px | `space[3]` |
| List item horizontal | 16px | `space[4]` |
| Section gap (same type) | 16px | `space[4]` |
| Section gap (different type) | 24px | `space[6]` |
| Between cards in list | 12px | `space[3]` |

### Vertical Rhythm Rules
1. Content sections within a screen use `space[4]` (16px) gaps
2. Major section breaks use `space[6]` (24px)
3. Hero to content transition uses `space[5]` (20px)
4. List items use consistent `space[3]` (12px) vertical padding

---

## 2. Typography Scale

### Minimal Type Scale (4 sizes + 1 utility)

| Name | Size | Line Height | Weight | Use Case |
|------|------|-------------|--------|----------|
| **Title** | 22px | 28px | 700 (Bold) | Screen titles, section headers |
| **Headline** | 16px | 22px | 600 (SemiBold) | Card titles, button labels, emphasis |
| **Body** | 16px | 24px | 400 (Regular) | Default text, descriptions |
| **Caption** | 14px | 20px | 400 (Regular) | Secondary info, metadata, timestamps |
| **Overline** | 11px | 14px | 600 (SemiBold) | Labels, badges, category tags |

### Price Typography (Special)
- **Price Display:** 32px, Bold (2x body text)
- **Price in Cards:** 24px, Bold (1.5x body, still prominent)
- **Price in Lists:** 18px, SemiBold

### Typography Rules
1. Never use more than 2 font weights on a single screen
2. Title is reserved for screen headers only
3. Headline for card titles and emphasis
4. Body for everything else
5. Caption for secondary/supporting info
6. Overline only for badges and category labels

---

## 3. Color System

### Brand Colors
```
primary:        #00BE3C  (Rora Green — CTAs, highlights)
primaryLight:   #D1FAE5  (Light green backgrounds)
primaryDark:    #059669  (Pressed states)
```

### Neutral Palette
```
background:     #F9F9F9  (Screen background)
surface:        #FFFFFF  (Cards, sheets)
text:           #262626  (Primary text)
textSecondary:  #5C5F62  (Secondary text, captions)
textMuted:      #8C9390  (Placeholders, disabled)
border:         #E3E6E3  (Dividers, card borders)
```

### Functional Colors
```
success:        #22C55E  (Confirmations)
danger:         #D14343  (Destructive actions, errors)
warning:        #E9A63A  (Cautions)
info:           #3B82F6  (Informational)
```

### Price Label Colors
```
goodDeal:       background: #DCFCE7, text: #22C55E
pricier:        background: #FEF3C7, text: #F59E0B
```

### Overlay
```
overlay:        rgba(0,0,0,0.4)
overlayLight:   rgba(0,0,0,0.3)
```

---

## 4. Component Specifications

### Buttons

| Variant | Background | Text | Border | Height |
|---------|------------|------|--------|--------|
| Primary | `primary` | white | none | 52px |
| Secondary | transparent | `primary` | 1px `primary` | 52px |
| Tertiary | transparent | `primary` | none | 52px |
| Danger | transparent | `danger` | none | 52px |

- Horizontal padding: 20px
- Border radius: 12px
- Touch target: minimum 48px (satisfied by 52px height)
- Disabled: 50% opacity

### List Items
- Minimum height: 56px
- Padding: 12px vertical, 16px horizontal
- Structure: `[Leading] [Content] [Trailing]`
- Leading: avatar/icon (40px)
- Content: title + subtitle, flex: 1
- Trailing: chevron icon (required for tappable items)
- Gap between leading and content: 12px

### Cards
- Background: `surface` (#FFFFFF)
- Border radius: 16px
- Shadow: `shadow.md` (y:2, blur:4, opacity:0.08)
- Padding: 16px
- No nested cards

### Avatars
- Small: 40px (default in lists, offer cards)
- Large: 80px (driver profile hero only)
- Shape: Circle
- Fallback: Initials on colored background

### Badges
- Height: 24px
- Padding: 4px horizontal, 2px vertical
- Border radius: pill (999px)
- Font: Overline (11px, SemiBold)
- Variants: neutral, primary, success, warning, danger

### Inputs
- Height: 52px
- Border radius: 12px
- Border: 1px `border`, focus: `primary`
- Padding: 16px horizontal
- Label above: Caption size, 4px gap

---

## 5. Screen Templates

### Template A: Map + Bottom Sheet
**Use for:** Home, QR Session, Discovery, Active Ride

```
+-------------------------+
| [Status Bar]            | <- respects safe area
+-------------------------+
|                         |
|    MapView              | <- full screen, extends under notch
|    (edge-to-edge)       |
|                         |
+-------------------------+
| +---------------------+ |
| | Sheet Handle        | | <- drag handle
| +---------------------+ |
| | Sheet Content       | | <- scrollable
| | ...                 | |
| +---------------------+ |
+-------------------------+
| [Tab Bar]               | <- hidden during flows
+-------------------------+
```

**Sheet Behavior:**
- 2 snap points: Peek (collapsed) and Full (expanded)
- `bottomInset` = tab bar height (when tabs visible)
- Pan down to minimize, pan up to expand

### Template B: List Screen
**Use for:** Drivers Directory, Ride History, Favorites, Offers List

```
+-------------------------+
| [Status Bar]            |
+-------------------------+
| Title (22px Bold)       | <- safe area + 16px top
| Subtitle (optional)     |
| [Filter Button]         | <- opens filter sheet
+-------------------------+
| +---------------------+ |
| | List Item           | |
| | List Item           | |
| | List Item           | |
| | ...                 | |
| +---------------------+ |
+-------------------------+
| [Tab Bar]               |
+-------------------------+
```

**Rules:**
- List takes natural height (dynamic by content)
- Pagination: load 10 items, then "Load more"
- Empty state: centered, encouraging action

### Template C: Detail Screen
**Use for:** Driver Profile, Ride Detail, Venue Detail

```
+-------------------------+
| [Status Bar]            |
+-------------------------+
| <- Back         [Actions]| <- header with back button
+-------------------------+
| +---------------------+ |
| | Hero Image/Header   | | <- full-width, 200-240px
| +---------------------+ |
| | Content Section     | |
| | Content Section     | | <- scrollable
| | ...                 | |
| +---------------------+ |
+-------------------------+
| +=====================+ |
| | [Secondary Button]  | | <- stacked buttons
| | [Primary Button]    | | <- primary on bottom
| +=====================+ |
+-------------------------+
```

**Multi-Action Rule:**
- When 2 actions: stack vertically (secondary above primary)
- Primary button always at bottom (closest to thumb)
- Gap between buttons: 12px

### Template D: Form/Input Screen
**Use for:** Route & Estimate, Authentication

```
+-------------------------+
| [Status Bar]            |
+-------------------------+
| <- Back                 |
+-------------------------+
| Title                   |
| Subtitle/Description    |
+-------------------------+
| [Input Field]           |
| [Input Field]           |
| ...                     |
+-------------------------+
| +=====================+ |
| | [Primary Button]    | | <- sticky CTA
| +=====================+ |
+-------------------------+
```

**Keyboard Behavior:**
- Push content up when keyboard appears
- CTA remains visible above keyboard

### Template E: Status/Progress Screen
**Use for:** Discovery (looking for drivers), Hold, Active Ride

```
+-------------------------+
| [Status Bar]            |
+-------------------------+
|                         |
|    Status Indicator     | <- centered
|    Status Text          | <- rotating messages
|                         |
| +---------------------+ |
| | Context Card        | | <- rich context about what's happening
| | (QR, route info)    | |
| +---------------------+ |
|                         |
+-------------------------+
| +=====================+ |
| | [Cancel / Action]   | |
| +=====================+ |
+-------------------------+
```

**Wait State Rules:**
- Show rich context: what's happening, how many drivers notified
- No countdown or timer visible to user
- Subtle animation (not playful, not distracting)

---

## 6. Navigation & Behavior Rules

### Tab Bar
- **Visible:** Home, browsing screens (Directory, History, Favorites)
- **Hidden:** During active flows (Discovery -> Offers -> Hold -> Active -> Complete)
- Style: Blur with system material effect (current)
- Active color: Rora Green (#00BE3C)
- Inactive color: #8C9390

### Back Behavior
- Always go back one step (standard navigation)
- No confirmation dialogs for back during flows
- Discovery continues in background if user backs out

### Bottom Sheet Behavior
- 2 snap points: Peek and Full
- Swipe down to minimize
- Swipe up to expand
- Handle indicator always visible (4px x 36px, border radius 2px)

### Modal Dismissal
- Swipe down to dismiss (when appropriate)
- Tap outside to dismiss (when appropriate)
- X button in top-right for explicit close

### Transitions
- Use standard platform transitions (iOS slide, Android material)
- No custom animations for screen transitions

---

## 7. Sticky CTA Rules

### Appearance
- Full-width bar docked to bottom
- Background: subtle blur (frosted glass effect)
- Button: full-width minus horizontal padding (20px each side)
- Height: 84px (16px padding + 52px button + 16px padding)

### With Content Above
- Optional content area above button (price summary, metadata)
- Total height: ~112px when content present
- Content uses Caption size text

### Positioning
- `bottom: tabBarHeight` when tabs visible
- `bottom: safeAreaBottom` when tabs hidden
- Content scrolls behind with blur visible

### Non-Negotiable
- **CTA must never be hidden behind tab bar**
- **CTA must never overlap with scrollable content**
- ScrollView must have `paddingBottom` = tabBarHeight + CTAHeight + 16px buffer

---

## 8. Offer Card Specification

Since offers are critical to the core loop, here's the exact specification:

### Layout
```
+-------------------------------------+
| +----+                              |
| |    |  Driver Name        $XX <-- | Price: 24px Bold, right-aligned
| | ** |  * 4.8 - 2.3 km    [DEAL]<- | Badge if applicable
| +----+  Toyota Camry - White       |
|         [Verified]  [PRO]          |
+-------------------------------------+
```

### Visual Hierarchy (order of attention)
1. **Price** — largest, right side, 24px Bold
2. **Driver Photo** — left, 40px circle
3. **Driver Name** — Headline (16px SemiBold)
4. **Price Label Badge** — colored pill next to price
5. **Distance** — visible metric, Caption size
6. **Rating** — Caption size, star icon
7. **Badges** — small, below name

### Price Label Badges
- **Good deal:** Green pill (#DCFCE7 bg, #22C55E text)
- **Pricier than usual:** Amber pill (#FEF3C7 bg, #F59E0B text)
- **Normal:** No badge

### Offer List Rules
- Show top 3 offers expanded
- "+ X more offers" collapsed below
- Tap to expand/collapse additional offers
- Each offer is a tappable card -> selects offer

---

## 9. QR Card Specification

### Layout
```
+-------------------------------------+
|           Trip Summary              |
|   From: Airport                     |
|   To: Maho Beach                    |
|                                     |
|   +-----------------------------+   |
|   |                             |   |
|   |         QR CODE             |   | 200x200px
|   |                             |   |
|   +-----------------------------+   |
|                                     |
|   Rora Fare: $20                    |
|                                     |
|   [Look for drivers]                |
+-------------------------------------+
```

### Rules
- QR code: black on white, no embedded branding
- QR size: 200x200px
- Card padding: 24px
- Trip summary above QR (origin -> destination)
- Rora Fare below QR
- CTA button at bottom of card

---

## 10. Empty, Loading, and Error States

### Empty States
- **Tone:** Encouraging action
- **Structure:**
  - Illustration (optional, simple)
  - Title: Headline size
  - Description: Body size, secondary color
  - CTA button (when applicable)
- **Examples:**
  - "No favorites yet" -> "Find your first driver"
  - "No rides yet" -> "Take your first trip"

### Loading States
- **Tone:** Subtle and quiet
- **Pattern:** Skeleton screens with pulse animation
- No spinners except for button loading states
- Skeleton matches content layout exactly

### Error States
- **Tone:** Empathetic and warm
- **Examples:**
  - "We couldn't find any drivers nearby. Want to try a different pickup spot?"
  - "Something went wrong. Please try again."
- Always provide a next action (retry, adjust, cancel)

---

## 11. Success Feedback

### On Key Actions
- Confirm driver -> Haptic (success) + visual checkmark
- Complete ride -> Haptic (success) + summary screen
- Favorite driver -> Haptic (light) + heart fill animation

### Implementation
- Use Expo Haptics: `Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)`
- Visual: brief checkmark animation or color flash

---

## 12. Non-Negotiables (Gate Checklist)

Before any screen ships, verify:

- [ ] **CTA not hidden behind tab bar**
- [ ] **Touch targets >= 48px**
- [ ] **Chevron on all tappable list items**
- [ ] **Empty state defined**
- [ ] **Loading state defined**
- [ ] **Error state defined**
- [ ] **Safe areas respected** (content not under notch)
- [ ] **Map extends edge-to-edge, UI respects safe area**
- [ ] **Horizontal padding = 20px**
- [ ] **Uses only 4-5 type sizes**
- [ ] **Price is visually dominant** (where applicable)
- [ ] **Destructive actions use red**
- [ ] **Cards have subtle shadow**

---

## 13. Screen Inventory

| Screen | Template | Tab Visible | Notes |
|--------|----------|-------------|-------|
| Home | Map + Sheet | Yes | Destination input sheet |
| Route & Estimate | Form | No | Route builder |
| QR Session | Status | No | QR card + "Look for drivers" |
| Discovery | Status | No | Rich context, rotating status |
| Offers List | List | No | Top 3 + expandable |
| Hold | Status | No | Selected driver, waiting |
| Active Ride | Map + Sheet | No | Driver info, fare |
| Completion | Detail | No | Summary + rating prompt |
| Drivers Directory | List | Yes | Filters via sheet |
| Driver Profile | Detail | No | Stacked CTAs |
| Ride History | List | Yes | 10 items, load more |
| Ride Detail | Detail | No | Report/Favorite actions |
| Favorites | List | Yes | No limit |
| Profile/Settings | List | Yes | Account info |
| Authentication | Form | No | OTP/Magic link |

---

*End of Design System Spec*
