---
app: Both
section: "Core docs"
source: "https://www.notion.so/b003c213a6cf47c5a353e58102208386"
---

Excellent. This document is what separates  **serious products**  from “nice-looking apps.”
This is your  **UX Constitution**. If Rora follows this, the app will feel calm, trustworthy, and premium even as it grows.
Read this like law, not inspiration.
Rora UX Constitution
**“Never break these rules”**
Inspired by proven patterns used by companies like  Airbnb, but adapted to  **Rora’s reality** : mobility, trust, cash, negotiation, tourists, drivers.
1. The Prime Directive (above all else)
Rora must always feel predictable, calm, and reversible.
If a UX decision makes the user feel rushed, confused, trapped, or surprised in a bad way, it is wrong.
No exceptions.
1. Navigation Rules (Structure is sacred)
1.1 Tabs are places, not actions
- Bottom tabs represent  **destinations**  (Home, Rides, Profile)
- Tabs never trigger actions
- Tabs never change behavior based on state
❌ A tab that starts a ride
❌ A tab that opens a modal
✅ A tab that takes you to a stable place
1.2 Screens move forward, sheets move up
- New steps → push screen
- Temporary tasks → bottom sheet
- Interruptions → modal sheet
If you open a full screen for something that could be a sheet, you broke the rule.
1.3 No sideways navigation chaos
- No horizontal screen sliding unless it’s a carousel
- No nested tab bars
- No mixed navigation metaphors
Vertical = progress.
Down = dismiss.
1. Map + Bottom Sheet Rules (Rora’s backbone)
2.1 The map is context, not content
- Map is always passive
- Map never competes with UI
- Map does not scroll
The sheet is where thinking happens.
2.2 Bottom sheets always have defined states
Every bottom sheet must support:
- Collapsed (overview)
- Half (interaction)
- Full (decision)
❌ Floating sheets
❌ Random heights
❌ Sheets that cover navigation accidentally
2.3 Content changes, container stays
- Same sheet
- Same padding
- Same motion
- Only content updates
This creates calm and familiarity.
1. One Primary Action Rule (no debate)
Every screen has exactly one primary action.
- It must be visually obvious
- It must move the user forward
- Everything else is secondary or hidden
If two buttons compete, UX fails.
1. Progressive Disclosure (show less than you think)
4.1 Show only what matters  *now*
- Price before breakdown
- Route before distance
- Offers before details
Details are optional. Decisions are not.
4.2 Never punish curiosity
- Expanding details should never feel like commitment
- Backing out should always be easy
- No irreversible actions without confirmation
Rora is used by tourists. Anxiety kills trust.
1. State-Driven UI (not navigation-driven)
5.1 Screens change by state, not by route
- Searching
- Waiting
- Offers received
- No drivers
- Active ride
Same screen. Different content.
If you add new screens for every state, you are doing it wrong.
5.2 Empty and loading states are first-class
- No blank screens
- No spinners without context
- Always explain what’s happening
Silence = broken app in the user’s mind.
1. Cards Are Decision Units
6.1 Decisions happen inside cards
- Offer cards
- Driver cards
- History cards
Cards must contain  **everything needed to decide**.
❌ Tap card → tap another button → confirm
✅ Tap card → decision
6.2 Cards are fully tappable
- No tiny hit targets
- No “dead zones”
- No nested tap confusion
Touch is confidence.
1. Soft Commitment → Hard Confirmation
7.1 Exploration must feel safe
- Browsing
- Estimating
- Generating QR
- Receiving offers
None of these commit the user.
7.2 Commitment is explicit and clear
- Selecting a driver
- Confirming a ride
- Starting a trip
These require:
- Clear language
- Clear confirmation
- Clear next state
No accidental rides. Ever.
1. Motion Rules (explain, don’t entertain)
8.1 Motion must explain hierarchy
- Slide up = temporary
- Push forward = progress
- Fade = state change
- Pull down = cancel/dismiss
Never mix meanings.
8.2 Motion is subtle or it’s wrong
- 150–250ms
- Same easing everywhere
- No spring chaos
If users notice the animation, it’s too much.
1. Consistency Over Cleverness
9.1 Reuse beats redesign
- Same buttons everywhere
- Same cards everywhere
- Same sheets everywhere
If something needs a “special version,” question it.
9.2 Tokens change, structure doesn’t
- You may tweak colors
- You may tweak spacing
- You may tweak copy
You may NOT invent new layouts per screen.
1. Trust Is a UX Feature
10.1 Calm beats speed
- No countdown pressure
- No flashing UI
- No artificial urgency
Rora is about trust, not adrenaline.
10.2 Reversibility is mandatory
- Cancel must always exist (until ride is active)
- Back must be predictable
- No dead ends
If users feel trapped, they uninstall.
1. Driver UX Has Different Priorities
11.1 Drivers decide fast
- Fewer details upfront
- Clear accept/counter actions
- No clutter
11.2 Riders decide carefully
- More context
- Comparisons
- Reassurance
Same system. Different emphasis.
1. The Final Gate (use this every time)
Before shipping any screen, ask:
1. Which template is this?
2. What is the single primary action?
3. What state is the user in?
4. Can this be a sheet instead of a screen?
5. Can the user back out safely?
6. Does this feel calm?
If you can’t answer all six, it’s not ready.
Closing truth (this matters)
This document is not restrictive.
It is  **liberating**.
Once these rules exist:
- Design becomes faster
- Debates disappear
- Consistency becomes automatic
- Quality compounds over time
This is how Airbnb-level UX is sustained for years.

