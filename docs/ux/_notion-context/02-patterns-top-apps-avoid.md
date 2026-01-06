Here’s the “what top apps  *avoid on purpose* ” playbook. These aren’t accidents, they’re deliberate constraints that trade power for  **trust, speed, and fewer bad decisions**.
1) Don’t offer multiple primary CTAs in one view
**Do-not-do rule:**  Never put 2–3 actions on one screen that all feel like “the main next step.”
**Why they avoid it:**  Too many strong choices causes hesitation, wrong taps, and “what did I just do?” regret. Choice overload slows decisions and increases abandonment.  [Nielsen Norman Group+1]({{https://www.nngroup.com/videos/choice-overload/?utm_source=chatgpt.com}})
**Tradeoff they accept:**  Some users want more control (compare, customize, explore). Top apps tell those users: “Sure, but not  *right now* .”
**Rejected patterns:**
- Two equally prominent buttons like  **“Confirm”**  and  **“Schedule”**  and  **“Share”**  all stacked.
- “Sticky CTA bars” with multiple actions competing for attention.
- Big “Next” plus big “Skip” plus big “Learn more” (you just created a three-way fork).
**Mistake teams learn from:**
- “We added more CTAs to increase conversion” → conversion drops because users freeze, mis-tap, or bounce.
**Where simplicity beats power:**
- High-stakes steps: confirming a driver, accepting a fare, submitting identity, payment-like commitments. One obvious “continue” wins.
2) Don’t expose advanced options upfront (progressive disclosure is a kindness)
**Do-not-do rule:**  Don’t dump “power user” settings into the main flow.
**Why they avoid it:**  Progressive disclosure reduces cognitive load and prevents novice mistakes by hiding advanced settings until users need them.  [Nielsen Norman Group+1]({{https://www.nngroup.com/articles/progressive-disclosure/?utm_source=chatgpt.com}})
**Tradeoff they accept:**  Some “expert” users take 1–2 extra taps to reach deep options.
**Rejected patterns:**
- Advanced filters always visible by default.
- Pricing breakdowns, debug-level details, multiple toggles before users even understand the basics.
- “Choose algorithm” / “sort logic” / “routing mode” on first run.
**Mistake teams learn from:**
- Exposing everything early creates  *support tickets*, not delight. Users change the wrong thing, then blame the product.
**Where simplicity beats power:**
- Onboarding and first-time usage. When trust is fragile, fewer knobs = fewer ways to break the experience.
3) Don’t show all information just because you  *have*  it (hide to clarify)
**Do-not-do rule:**  Don’t display every data point if it doesn’t change the user’s decision.
**Why they hide info:**  Showing less can create  **clearer hierarchy**, reduce anxiety, and focus attention on the decision that matters right now. Progressive disclosure also signals “what’s important” by what appears first.  [Nielsen Norman Group]({{https://www.nngroup.com/articles/progressive-disclosure/?utm_source=chatgpt.com}})
**Tradeoff they accept:**  Some users will ask “where’s the rest?” so you provide it behind “Details,” tooltips, or secondary screens.
**Rejected patterns:**
- Full fare breakdown by default (base, per-km, modifiers, taxes, etc.).
- Always-visible timers/countdowns that add pressure or panic.
- Flooding the screen with micro-metrics (distance, minutes, surge, driver rating, pickup pin accuracy, etc.) before the user chooses.
**Mistake teams learn from:**
- “Transparency” can become  *noise*. Too much info decreases trust because it feels complicated or suspicious.
**Where simplicity beats power:**
- Negotiation flows: a single clear price anchor is easier to trust than a spreadsheet on a phone.
Applied to  **Rora Ride** : your spec already chooses a  **single Rora Fare**  (no breakdown) and avoids a visible countdown in discovery, which is exactly this principle in action.
SPEC
4) Don’t allow heavy customization in critical flows
**Do-not-do rule:**  Avoid letting users customize layout, terminology, or core flow steps where mistakes are expensive.
**Why top apps limit it:**  Customization multiplies UI states, creates inconsistency, increases cognitive load, and makes troubleshooting harder. It also destroys “shared reality”: support, tutorials, and muscle memory stop working.
Apple’s guidance repeatedly warns against overcrowding and too many controls side-by-side, which is basically “don’t turn every screen into a control panel.”  [Apple Developer+1]({{https://developer.apple.com/design/human-interface-guidelines/toolbars?utm_source=chatgpt.com}})
**Tradeoff they accept:**  A few users feel constrained. Top apps choose reliability over “do anything.”
**Rejected patterns:**
- “Customize your booking screen” / “choose what fields show” in the main purchase flow.
- Letting users rearrange core navigation or change core flow steps.
- Exposing tons of settings inside the app instead of keeping them infrequent and out of the way.  [Apple Developer]({{https://developer.apple.com/design/human-interface-guidelines/settings?utm_source=chatgpt.com}})
**Mistake teams learn from:**
- Customization makes the product feel “advanced”… until the UX becomes unpredictable and users don’t trust it.
**Where simplicity beats power:**
- Safety-critical actions, logistics, identity, and money decisions. Predictability wins.
5) Don’t reinvent layouts every screen (reuse is a trust strategy)
**Do-not-do rule:**  Don’t create a new layout grammar for each feature.
**Why they reuse layouts aggressively:**  Consistency and standards reduce learning effort and help users transfer knowledge across screens.  [Nielsen Norman Group+1]({{https://www.nngroup.com/articles/consistency-and-standards/?utm_source=chatgpt.com}})
Reusable layouts also support recognition (users instantly know what they’re looking at) instead of forcing recall.  [Nielsen Norman Group+1]({{https://www.nngroup.com/articles/recognition-and-recall/?utm_source=chatgpt.com}})
**Tradeoff they accept:**  Some screens could be “more bespoke” or visually exciting, but they’d be slower to understand.
**Rejected patterns:**
- Filters on one screen are chips, on another screen they’re checkboxes, elsewhere they’re dropdowns.
- Different card styles for the same “object” (driver card changes shape in every context).
- Changing terminology across flows (“trip” vs “ride” problem you already caught).
**Mistake teams learn from:**
- Inconsistency produces silent errors: users think something means the same thing when it doesn’t.
**Where simplicity beats power:**
- Multi-step flows (browse → choose → confirm). Reuse reduces the “where am I now?” tax.
6) Don’t maximize “flexibility” when the cost of error is high
**Do-not-do rule:**  Don’t optimize for edge-case flexibility if it increases error rate for the 80%.
**Why flexibility becomes a liability:**
- More paths = more confusion.
- More options = slower decisions.
- More screens/states = more bugs and less confidence.
Every extra step adds cognitive load and can derail users.  [Smashing Magazine]({{https://www.smashingmagazine.com/2016/09/reducing-cognitive-overload-for-a-better-user-experience/?utm_source=chatgpt.com}})
**Tradeoff they accept:**  Some edge cases need customer support or a slower “advanced” path. That’s fine. The main path stays clean.
**Rejected patterns:**
- “Power routing” where users can do 15 different things before confirming.
- Overly flexible cancellation/editing during commitment steps.
- Letting users bypass guardrails in the name of “freedom.”
**Mistake teams learn from:**
- “We’ll support every scenario” turns into “we shipped an app nobody trusts under pressure.”
**Where simplicity beats power:**
- Any moment of commitment: confirm ride, accept offer, verify identity, submit report.
Applied to  **Rora Ride** : your spec deliberately restricts cancel during  **Active**  state and uses a clear ride-state machine. That’s flexibility sacrificed for trust and operational sanity.
SPEC
Quick “Rejected Patterns” Checklist (print this mentally)
- **More than 1 primary CTA**  per screen (unless one is clearly secondary).  [Nielsen Norman Group+1]({{https://www.nngroup.com/articles/simplicity-vs-choice/?utm_source=chatgpt.com}})
- **Advanced settings**  in the main flow (push them behind “Details”).  [Nielsen Norman Group+1]({{https://www.nngroup.com/articles/progressive-disclosure/?utm_source=chatgpt.com}})
- **Data dumps**  that don’t change the decision (hide until asked).  [Nielsen Norman Group]({{https://www.nngroup.com/articles/progressive-disclosure/?utm_source=chatgpt.com}})
- **Customizable core flows**  (keep customization peripheral).  [Apple Developer+1]({{https://developer.apple.com/design/human-interface-guidelines/settings?utm_source=chatgpt.com}})
- **Layout inconsistency**  across similar objects/screens.  [Nielsen Norman Group+1]({{https://www.nngroup.com/articles/consistency-and-standards/?utm_source=chatgpt.com}})
- **Flexibility that increases error**  in high-stakes steps.  [Smashing Magazine]({{https://www.smashingmagazine.com/2016/09/reducing-cognitive-overload-for-a-better-user-experience/?utm_source=chatgpt.com}})
If you want, I can translate these into a  **Rora Ride-specific “Do/Don’t” design standard**  (buttons, sheet behavior, offer cards, map+panel hierarchy) so every new screen stays consistent with the same rules.
Sources

