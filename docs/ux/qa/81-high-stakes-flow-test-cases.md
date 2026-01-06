---
app: Both
section: "QA / consistency checks"
source: "https://www.notion.so/59df83a4e6854f3d8682b1727decc255"
---

# 81 — High-Stakes Flow Test Cases
## Rider — Offer selection
- Given offers arrive, rider can select an offer with one action.
- Rider can change selection before commitment.
## Rider — Commitment
- Rider confirmation requires explicit action.
- Back gesture does not accidentally confirm.
## Rider — Active
- Cancel is not available.
- Critical info (driver + agreed fare) is visible.
## Driver — Incoming request
- Driver can accept/counter/decline quickly.
- Counter is sendable in under 5 seconds.
## Driver — Selected
- State clearly indicates rider selected.
## System status
- No silent loading.
- Any failure has a next step.

