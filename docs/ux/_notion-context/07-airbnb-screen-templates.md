Good. This is the  *right*  next step.
Once you understand Airbnb as  **reusable screen templates**, design stops being mystical and starts being mechanical.
Below is a  **beginner-friendly but professional breakdown**  of Airbnb’s mobile app into  **exact screen templates**  you can reuse and tweak Shadcn-style for Rora or any serious app.
I’ll be direct, structured, and honest. No fluff.
Airbnb’s Reusable Mobile Screen Templates
(What almost every great app secretly uses)
Airbnb  does  **not**  design hundreds of unique screens.
They reuse  **\\~7 core templates**, over and over, with different data.
Template 1: Map + Collapsible Bottom Sheet (The Core Template)
What it’s used for
- Search
- Explore
- Browse
- Location-based decisions
Structure
\\`\\[ Map (background, passive) \\]
\\[ Bottom Sheet \\]
	├─ Collapsed: summary
	├─ Half: interaction
	└─ Full: decision
\\`
Rules
- Map never scrolls
- Sheet snaps to fixed heights
- Sheet content changes, container stays the same
- No full-screen navigation unless absolutely necessary
How you reuse this in Rora
- Rider home
- Driver home
- Discovery
- Incoming requests
This template alone can power 60–70% of your app.
Template 2: Vertical Feed (Browse & Compare)
What it’s used for
- Listings
- Search results
- Driver offers
- History
Structure
\\`\\[ Optional Header \\]
\\[ Scrollable List \\]
	├─ Card
	├─ Card
	├─ Card
\\`
Rules
- One column only
- Cards contain everything needed to decide
- Tapping a card = next step
- No nested scrolling
Beginner mistake to avoid
Do not mix grids, rows, and cards on the same screen.
Template 3: Detail Page (Commitment Screen)
What it’s used for
- Listing detail
- Driver profile
- Ride summary
Structure
\\`\\[ Media (optional) \\]
\\[ Title + key info \\]
\\[ Supporting details \\]
\\[ Sticky primary action \\]
\\`
Rules
- Scrollable content
- Primary CTA fixed at bottom
- No competing actions
- Details are secondary, not loud
Rora adaptation
- Driver profile
- Ride summary
- Completed ride details
Template 4: Action Sheet / Modal Sheet (Interruptions)
What it’s used for
- Login prompts
- Warnings
- Confirmations
- Quick choices
Structure
\\`\\[ Scrim \\]
\\[ Sheet \\]
	├─ Title
	├─ Short explanation
	├─ Primary action
	└─ Secondary / cancel
\\`
Rules
- No scrolling if possible
- Clear escape (swipe or cancel)
- Never feels permanent
This is where  *politeness*  in UX lives.
Template 5: Full-Screen Form (Rare, Focused)
What it’s used for
- Login
- Checkout
- Account setup
Structure
\\`\\[ Header with back \\]
\\[ Single-column form \\]
\\[ Primary action \\]
\\`
Rules
- One task only
- No distractions
- Clear progress
Airbnb avoids these unless absolutely necessary.
Template 6: Empty / Loading / State Screen
What it’s used for
- No results
- Searching
- Waiting
Structure
\\`\\[ Illustration / animation \\]
\\[ Clear message \\]
\\[ Optional suggestion \\]
\\`
Rules
- Calm language
- No blame
- No panic UI
Great apps feel human here.
Template 7: Confirmation / Success Screen
What it’s used for
- Booking complete
- Action success
- Task finished
Structure
\\`\\[ Icon / checkmark \\]
\\[ Clear confirmation \\]
\\[ Summary \\]
\\[ Done / Continue \\]
\\`
Rules
- No decisions required
- Emotional relief
- Clear next step
The Hidden Rule: These templates NEVER change
Airbnb:
- Changes data
- Changes copy
- Changes images
But  **templates stay the same**.
That’s the secret to consistency.
How to use this Shadcn-style (very important)
Think like this:
- Templates = Shadcn components
- Tokens = your theme
- Content = your business logic
You do  **not**  redesign screens.
You  **assemble templates**.
Mental checklist before designing ANY screen
Ask yourself:
1. Which template is this?
2. Is it map-based, feed-based, or detail-based?
3. What is the single primary action?
4. Can this be a sheet instead of a screen?
5. What state is this screen in?
If you can’t answer these, don’t design yet.
Final truth (tell-it-like-it-is)
Beautiful apps are not creative masterpieces.
They are  **well-organized systems with taste**.
Once you internalize these templates:
- Your UX will automatically improve
- Your app will feel familiar but original
- You’ll stop guessing
- You’ll design faster with more confidence
If you want next, I can:
- Map  **each Rora screen**  to one of these templates
- Turn these into  **actual wireframe blueprints**
- Create a  **“never break these rules” UX document**  for Rora
You’re learning this the right way.

