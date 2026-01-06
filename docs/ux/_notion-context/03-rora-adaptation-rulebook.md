Below is a concrete UX “rulebook” for  **Rora**  as a mobility marketplace where  **money is physical, negotiation is normal, and trust is the product**. I’m grounding it in what you already spec’d (cash-first, negotiation, verification, QR handshake, discovery → commitment)
SPEC  and adapting the proven patterns to your reality.
Rider flow rules
R1. One decision per screen-state
**Rule:**  Every rider state has exactly  **one**  primary action, one secondary at most.
Why: tourists under stress do not want a menu, they want the next step.
**Rora mapping**
- **Home (map context):**  Primary = “Where to?” (start route). Secondary = quick zone chips.
SPEC
- **Estimate:**  Primary = “Generate QR”. Secondary = edit route. (No other CTAs.)
- **QR Session (not live yet):**  Primary = “Look for drivers”. Secondary = cancel.
SPEC
- **Offers:**  Primary = “Select” on an offer. Secondary = “Keep looking / expand search” (only if needed).
- **Hold:**  Primary = “Confirm driver” (or “Waiting…” if auto). Secondary = “Pick different offer”.
- **Active:**  Primary = “Show QR / driver info” (no cancel; you already spec’d that).
SPEC
- **Completed:**  Primary = “Done”. Secondary = rate/report (optional).
SPEC
R2. Price is an anchor, not a checkout
**Rule:**  Treat price as a  **reference point**  and agreement, not a payment step.
You already do this: a single Rora Fare, no breakdown, drivers may counter.
SPEC
**Concrete UX behavior**
- Always display  **one bold number**  as the anchor (Rora Fare or chosen offer).
- Put negotiation language in small, calm copy once: “Final fare may be negotiated.” (Dismissable; no nagging.)
SPEC
- On offers, keep “Good deal / Pricier than usual” as  *labels*, not rules. (You already spec thresholds + tooltips.)
SPEC
R3. Soft commitment comes before hard commitment
**Rule:**  Split the flow into two psychological phases:
1. **Discovery (no commitment)**
2. **Commitment (locked)**
That’s exactly how you spec’d it.
SPEC
**Concrete UX behavior**
- During Discovery: no countdown pressure, no “Hurry!” vibes. You already specify “no timer shown.”
SPEC
- Commitment triggers only when:
	◦ rider confirms driver, or
	◦ in-person QR scan happens (override prompt).
SPEC
R4. Trust is signaled through verification + traceability, not payments
**Rule:**  In cash markets, trust must be visible as:
- “This person is real and authorized”
- “This agreement is recorded”
- “I can prove what happened”
**Concrete trust signals in UI**
- Badges must be  **small, consistent, and always explained**  (tooltip). You already define baseline verification types and Rora Pro meaning.
SPEC
- “Ride record” is your receipt: show route + agreed fare + timestamp, even for guests (then prompt to claim). You already have guest token strategy + ride history flows.
SPEC
- Use the  **QR handshake**  as the trust ritual: “We both see the same session.” (Haptics/success animation already planned.)
SPEC
Driver flow rules
Drivers are not “browsing.” Drivers are working. Their UI should feel like a  **cash register and a radio**, not a travel catalog.
D1. Driver home is a single operational dashboard
**Rule:**  Default view is “On duty” and requests. Everything else is secondary.
**Structure**
- Top: status (On duty / Off duty)
- Middle: current request card (or “waiting” state)
- Bottom: history/earnings shortcut (optional), profile, support
D2. Triad decision model: Accept / Counter / Decline
**Rule:**  For each request, show only 3 choices, always in the same order:
1. Accept (at Rora Fare)
2. Counter (enter amount, with quick presets)
3. Decline
This matches your negotiation logic (drivers can accept/counter/decline).
SPEC
D3. Counters must be fast and constrained
**Rule:**  Let drivers counter quickly without turning the screen into a calculator.
- Presets: +\$5, +\$10, +\$20, “Custom”
- Optional reason chips (Traffic, Bags, Late night) but never required
- Always show the rider’s anchor price above the counter input
D4. Commitment must be unmistakable
**Rule:**  Once a driver is selected, the UI switches to a “committed job” mode.
- Big status: “Selected by rider” (Hold) → “Confirmed” → “Active”
- No distractions, no list browsing
You already have a hold state and confirm/active transitions.
SPEC
Bottom-sheet behavior definitions (Rora standard)
Rora’s core pattern should be:  **Map as context + Sheet as decision layer**.
Sheet types
1. **Persistent sheet (primary)**
Used for your core flow. It has snap points and never feels like a new page.
1. **Modal sheet (secondary)**
Used for rare, high-focus tasks (report issue, auth method switch).
Snap points (recommended)
- **Collapsed:**  search pill only (map mostly visible)
- **Peek:**  route summary + price anchor visible
- **Expanded:**  full interaction (editing route, offers list)
Global rules
- **Drag to expand/collapse**  always enabled on persistent sheets.
- **Back gesture**  closes the sheet one level at a time (Expanded → Peek → Collapsed), then navigates away.
- **Keyboard**  never hides the primary CTA. If keyboard opens, sheet auto-expands.
Per-state sheet mapping (rider)
- Home: Collapsed (search pill)
- Route build: Expanded
- Estimate: Peek (price anchor always visible)
- QR session: Expanded (QR must be fully visible and scannable)
SPEC
- Discovery: Peek (status + cancel) with optional expand for details (no timer)
SPEC
- Offers: Expanded (cards list + top 3 emphasized)
SPEC
- Hold: Peek (driver summary + waiting) with expand for details
- Active: Peek (driver + agreed fare)
Decision-making hierarchy (what must “win” visually)
Think like a bouncer at the door: only the important stuff gets in.
Rider hierarchy (highest → lowest)
1. **State**  (Finding drivers / Offers received / Waiting / Active)
2. **Price anchor**  (Rora Fare or chosen offer)
3. **Next action**  (single primary CTA)
4. **Trust badges**  (verification, pro) and driver identity
5. **Route summary**  (origin → destination)
6. **Secondary info**  (distance, labels, notes)
7. **Everything else**  behind “Details”
This aligns with your spec choices: single-number fare, top 3 offers, no timer, compact history list, etc.
SPEC
Driver hierarchy
1. **Request state**  (new request, selected, confirmed, active)
2. **Pickup + destination**  (glanceable)
3. **Price**  (Rora Fare + counter if any)
4. **Decision buttons**  (Accept / Counter / Decline)
5. **Rider identity**  (minimal, privacy-safe)
6. **Notes**  (only if needed)
Allowed vs forbidden UI behaviors
Allowed
- **Soft commitment**  discovery without pressure (no countdowns)
SPEC
- **One price anchor**, no breakdown in the main flow
SPEC
- **Cards for offers/drivers**, consistent layout everywhere
- **Badges with tooltips**  (clear meaning, no “mystery meat trust”)
- **Top-3 offers + “X more”**  (progressive disclosure)
SPEC
- **Guest mode**  with claim later (trust grows after first success)
SPEC
- **In-person scan override**  prompt (reality beats the app)
SPEC
Forbidden
- Multiple primary CTAs in one view (especially around confirming/selecting)
- Visible countdown timers that create panic during Discovery (you explicitly avoid this)
SPEC
- Presenting negotiation as “error” or “bad behavior” (it’s normal here)
- Dense tables for offers or drivers (cards only)
- Showing a full pricing formula/breakdown as default (details only)
- Dark patterns: fake urgency, guilt copy, forced ratings
- Rider cancel during Active (you already forbid it; keep it strict)
SPEC
- “Live driver availability” map clutter in MVP (you already scoped it out)
SPEC
How Airbnb-style patterns change when money is physical
Airbnb optimizes for “browse, compare, book, pay.”
Rora must optimize for “find, agree, meet, ride, record.”
So you keep Airbnb’s strengths:
- cards, hierarchy, progressive disclosure, familiar structure
…but you remove or modify:
- checkout metaphors
- price breakdown obsession
- heavy filter-first browsing in the main flow
In cash negotiation markets, the “product” is  **clarity + a recorded agreement**, not a payment pipeline. Your spec already points the right way:  **price as anchor, negotiation allowed, ride events logged, QR handshake, verification badges**
SPEC.
If you want, I can turn this into a  **Rora UX Constitution**  (1 page) plus a  **screen-by-screen template**  for Rider and Driver that enforces: spacing, component rules, CTA rules, and bottom-sheet snap points so every new screen stays consistent.
Sources

