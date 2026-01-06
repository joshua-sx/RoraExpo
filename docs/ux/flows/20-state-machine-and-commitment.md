---
app: Both
section: "Flow rules"
source: "https://www.notion.so/fceb0bf008d849b6b0ba5f6775c19e7c"
---

# 20 — State Machine & Commitment Model
## Two phases
### Phase A — Discovery (soft)
- User can explore and back out.
- No irreversible actions.
### Phase B — Commitment (hard)
- User has explicitly chosen a driver OR QR handshake occurred.
- State transitions are logged and visible.
## Rider state transitions (simplified)
- Home → Route build → Estimate → QR session → Discovery → Offers → Hold → Active → Completed
## Driver state transitions (simplified)
- Off duty → On duty → Incoming request → (Accept/Counter/Decline)
- If accepted and rider selects: Selected/Hold → Confirmed → Active → Completed
## Commitment triggers (the only ones)
- Rider confirms driver selection.
- In-person QR scan handshake.
## Rules
- Never allow commitment to occur as a side effect of “viewing details.”
- Every state change must have a visible status label.
- Back/dismiss must never silently cancel a committed ride.

