---
app: Rider
section: "Flow rules"
source: "https://www.notion.so/66c87f41aa8341c4a02fe646520238cf"
---

# 10 — Rider Flow Rules
Riders are often anxious (tourists, unfamiliar pickup points, uncertainty, spotty connectivity). Rider UX must be **calm, reversible, and context-preserving**.
## Rider states (high level)
1. **Home / Explore**
2. **Route build**
3. **Estimate / QR generation**
4. **Discovery (looking for drivers)**
5. **Offers (compare + pick)**
6. **Hold (waiting / pre-commit)**
7. **Active ride**
8. **Completed**
## Non‑negotiable rules
### R1 — One decision per screen-state
- Exactly **one** primary CTA.
- At most one secondary action.
### R2 — Price is an anchor, not a checkout
- Show **one bold price** as the anchor.
- Never turn price into a payment metaphor.
### R3 — Soft commitment comes before hard commitment
- Discovery and offers are **not commitment**.
- Commitment only occurs at explicit confirm or QR handshake.
### R4 — Context is sacred
- Prefer sheets over full screens.
- Returning should be obvious (back/dismiss).
### R5 — Visibility of system status is required
- Every “waiting” moment must show:
	- what is happening
	- what the user can do next
	- what happens if nothing happens
## Rider screen-by-state CTA mapping
- **Home:** Primary = “Where to?”
- **Route build:** Primary = “Confirm route” / “Continue”
- **Estimate:** Primary = “Generate QR”
- **Discovery:** Primary = “Looking for drivers…” (disabled) + Secondary = “Cancel”
- **Offers:** Primary = “Select” on a card (card tap is the action)
- **Hold:** Primary = “Confirm driver” (or status) + Secondary = “Pick different offer”
- **Active:** Primary = “Show driver / QR / trip details” (no cancel)
- **Completed:** Primary = “Done”

