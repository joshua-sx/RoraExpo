---
app: Driver
section: "Flow rules"
source: "https://www.notion.so/927f01dff19140cca4adcf122aeb8778"
---

# 10 — Driver Flow Rules
Drivers are working. Driver UX should feel like a **dispatch console**, not a catalog.
## Driver states (high level)
1. **Off duty**
2. **On duty / waiting**
3. **Incoming request**
4. **Counter / negotiation**
5. **Selected / hold**
6. **Active ride**
7. **Complete**
## Non‑negotiable rules
### D1 — The default view is operational
- “On duty / waiting” is the home state.
- Everything else is secondary and out of the way.
### D2 — Triad decision model
For each request, show only:
1. **Accept** (at anchor price)
2. **Counter**
3. **Decline**
### D3 — Counters must be fast + constrained
- Use presets (e.g., +\$5, +\$10, +\$20) + optional custom.
- Always show rider anchor price.
### D4 — Commitment is unmistakable
- Once selected/confirmed, switch into “committed job mode.”
- Remove browsing distractions.
### D5 — Status visibility is mandatory
- Driver must always see:
	- current request state
	- next required action
	- what happens if no action
## Driver screen-by-state CTA mapping
- **Off duty:** Primary = “Go on duty”
- **Waiting:** Primary = “On duty” (status) + Secondary = “Go off duty”
- **Incoming request:** Primary = “Accept” + Secondary = “Counter” (with Decline available)
- **Counter:** Primary = “Send counter” + Secondary = “Back”
- **Selected/Hold:** Primary = “Navigate to pickup” / “Show QR scan”
- **Active:** Primary = “Complete ride”

