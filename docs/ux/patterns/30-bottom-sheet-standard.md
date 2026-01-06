---
app: System
section: "Bottom sheet + map model"
source: "https://www.notion.so/4238520728c445d6a1ac56400c8c3430"
---

# 30 — Bottom Sheet Standard
Rora’s primary interaction model is: **Map as context + Bottom sheet as decision layer**.
## Sheet types
### 1) Persistent sheet (primary)
- Used for the “happy path.”
- Has snap points.
- Supports drag.
- Back gesture collapses/dismisses stepwise.
### 2) Modal sheet (secondary)
- Used for interruptions: confirmations, warnings, login prompts.
- Background is blocked with a scrim.
## Snap points
- **Collapsed:** search pill / minimal status.
- **Peek:** summary + anchor price visible.
- **Expanded:** full interaction (lists, editing, offers).
## Global rules
- The sheet must always provide a clear exit (gesture + close/back).
- Do not stack bottom sheets.
- Content can change; the container behavior must stay consistent.
- Keyboard must not cover the primary action.
## Back behavior
- Expanded → Peek → Collapsed → navigate away.
## Scroll behavior
- If the sheet is scrollable, drag vs scroll must be clear:
	- drag on handle/upper area
	- scroll inside the content region

