# Google Maps for Lightning Payments

## Role

You are the lead product engineer, frontend engineer, UX designer, data visualization engineer, and algorithms engineer for this project.

Build a complete, polished, production-quality web application called **Google Maps for Lightning Payments**.

The application must be visually impressive enough for a college project demonstration, technically credible enough for an engineering evaluation, and extremely understandable to people who know **nothing about Bitcoin, cryptocurrency, blockchain, or the Lightning Network**.

The application should be deployable to **Vercel** and should work well on desktop, tablet, and mobile.

Do not build a toy-looking dashboard. Build something that feels like a modern, premium developer/product experience.

---

# 1. Core Product Idea

Imagine Google Maps, except instead of finding the best road between two cities, the application finds the best route for sending a digital payment through a distributed payment network.

The user chooses:

```text
From: Alice
To: Bob
Amount: 50,000 sats
Priority: Balanced
```

The application displays a network graph and calculates possible routes between Alice and Bob.

Example:

```text
Alice → Charlie → Frank → Bob
```

The application should compare several possible routes and explain why one is recommended.

Each route should have metrics such as:

* Number of hops
* Estimated routing fee
* Available liquidity
* Estimated success probability
* Reliability
* Estimated latency
* Overall route score

The user should be able to interact with the network visually, simulate failures, change the payment amount, modify routing preferences, and watch the payment travel through the selected route.

The application is inspired by the Bitcoin Lightning Network and broader work in Lightning infrastructure, network intelligence, liquidity, routing, and payments.

However:

**The application must function independently using simulated data.**

Do not require real Bitcoin.

Do not require a Lightning node.

Do not require private keys.

Do not require a wallet.

Do not require real-money payments.

Do not require credentials or API keys for the main demonstration.

The simulator must be completely runnable locally and on Vercel using deterministic/sample data.

---

# 2. Extremely Important Educational Requirement

The target evaluator understands normal computer science but knows approximately **zero about Bitcoin and Lightning**.

This is a first-class product requirement.

The user interface must never assume that the visitor knows:

* Bitcoin
* cryptocurrency
* blockchain
* Lightning
* sats
* payment channels
* liquidity
* nodes
* routing
* multi-hop payments

Before presenting technical terminology, teach the concept visually.

The application should therefore contain an educational onboarding/tutorial.

The ideal conceptual progression is:

### Step 1: The general problem

Show:

```text
You
 |
 A
 |
 B
 |
 C
 |
 Destination
```

Explain:

> When a payment must travel through a network, there may be many possible paths. The challenge is finding a route that is cheap, reliable, and capable of carrying the payment.

### Step 2: Turn it into a network

Explain:

> Think of each participant as a point on a map and each connection as a road.

### Step 3: Introduce the payment

Explain:

> A payment can move through multiple participants before reaching its destination.

### Step 4: Introduce Lightning

Only now explain:

> The Lightning Network is a payment network built on top of Bitcoin that allows payments to be routed through connected participants.

### Step 5: Map the terminology

Show a simple glossary:

| Everyday concept    | Lightning concept   |
| ------------------- | ------------------- |
| Person/place        | Node                |
| Road                | Payment channel     |
| Road capacity       | Available liquidity |
| Toll                | Routing fee         |
| Route               | Payment path        |
| Traffic/reliability | Network conditions  |

The teaching must be visual, concise, and interactive.

Do NOT overwhelm the user with blockchain internals.

The application is about routing.

---

# 3. Product Positioning

The landing page should communicate the idea immediately.

Hero:

**Google Maps for Lightning Payments**

Subtitle:

> Find, compare, and visualize the best route for a payment across a distributed network.

Supporting text:

> Explore how cost, liquidity, reliability, and network failures affect payment routing.

Primary CTA:

**Explore the Network**

Secondary CTA:

**How does this work?**

The visual hero should contain a beautiful animated network with one highlighted payment route.

Do not use cliché crypto visuals such as:

* giant Bitcoin logos
* spinning coins
* hacker imagery
* excessive neon
* generic crypto gradients
* blockchain cubes

The aesthetic should feel more like:

* Linear
* Vercel
* Stripe
* Arc
* modern Google Maps
* premium developer tooling

rather than a cryptocurrency trading website.

---

# 4. Main Application Experience

Create a primary `/explore` page.

The page should be the centerpiece of the product.

Layout:

```text
┌──────────────────────────────────────────────────────────────┐
│ Logo                    Network Explorer     Learn   About   │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  PAYMENT ROUTE                                               │
│                                                              │
│  From        [ Alice ▼ ]                                    │
│  To          [ Bob ▼ ]                                      │
│  Amount      [ 50,000 ]                                     │
│                                                              │
│  Objective   [ Balanced ▼ ]                                 │
│                                                              │
│                 [ FIND BEST ROUTE ]                         │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│                    INTERACTIVE NETWORK                       │
│                                                              │
│                  ●──────●                                    │
│                ╱   ╲    │                                    │
│             ●──────●─────●                                  │
│              ╲     │     ╲                                  │
│               ●────●──────●                                 │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│                     ROUTE ANALYSIS                           │
│                                                              │
│ Recommended route                                            │
│ Alice → Charlie → Frank → Bob                               │
│                                                              │
│ Fee          12 sats     Hops       3                        │
│ Liquidity    High        Reliability 97%                     │
│ Success      96%                                            │
└──────────────────────────────────────────────────────────────┘
```

On desktop, the graph should occupy the majority of the viewport.

On mobile, use:

* map/graph first
* bottom sheet for controls
* collapsible route analysis
* horizontally scrollable metric cards where appropriate

Do not simply shrink the desktop UI.

---

# 5. Network Visualization

Use **React Flow / `@xyflow/react`** for the interactive network graph unless a better equivalent is identified during implementation. React Flow provides node/edge interactions, zooming, panning, minimap, controls, and custom nodes, which fit this application very well.

Use a custom node design.

Each node should visually represent a participant.

Example:

```text
      ●
   Alice
```

On hover:

```text
Alice
Online
Reliability 98%
Connections 12
Available liquidity 2.4M
```

On selection, show a side panel:

**Node details**

* Name
* Online/offline state
* Reliability
* Number of connections
* Total capacity
* Available liquidity
* Recent failures
* Current role in selected route

Edges should represent payment channels.

Edge thickness should optionally encode liquidity.

For example:

* thin = low liquidity
* medium = moderate liquidity
* thick = high liquidity

Provide a legend explaining this.

---

# 6. Network Visual Language

Use a sophisticated visual system.

Recommended direction:

* Light theme as default
* Optional dark mode
* Off-white / near-white application background
* Dark graphite text
* Subtle borders
* Soft shadows
* Restrained accent color
* One strong route highlight color
* Neutral colors for normal network edges
* Red/orange for failures
* Green/teal for healthy states

Do not hard-code excessive colors throughout components.

Create design tokens.

Typography should be extremely clean.

Use a modern sans-serif font, preferably the default optimized Next.js font system rather than loading unnecessary external fonts.

Vercel's official Next.js boilerplate currently uses `next/font` and Geist, so a Geist-style interface is appropriate.

---

# 7. Network Data Model

Create strongly typed TypeScript models.

Example:

```ts
type LightningNode = {
  id: string
  name: string
  online: boolean
  reliability: number
  totalCapacity: number
  availableLiquidity: number
  connectionCount: number
  region?: string
}

type PaymentChannel = {
  id: string
  source: string
  target: string
  capacity: number
  availableLiquidity: number
  feeBase: number
  feeRate: number
  reliability: number
  latencyMs: number
  enabled: boolean
}
```

Create a network type:

```ts
type PaymentNetwork = {
  nodes: LightningNode[]
  channels: PaymentChannel[]
}
```

Keep the simulation engine separate from the UI.

Do not put routing algorithms directly inside React components.

Recommended architecture:

```text
lib/
  network/
    types.ts
    seed-data.ts
    generator.ts
    graph.ts
  routing/
    shortest-path.ts
    cheapest-path.ts
    intelligent-route.ts
    scoring.ts
  simulation/
    payment.ts
    failures.ts
    scenarios.ts
```

---

# 8. Synthetic Network

Create a deterministic sample network with approximately 40 to 60 nodes.

Give nodes human-readable names for the educational demo.

Examples:

* Alice
* Bob
* Charlie
* Diana
* Ethan
* Frank
* Grace
* Hannah
* Isaac
* Julia

Do not make every node a person.

Use a mixture where appropriate:

```text
Alice
Bob
North Hub
Central Hub
Merchant A
Merchant B
Node 21
Node 22
```

The default network must contain:

* multiple alternative paths
* a few highly connected hubs
* different edge capacities
* different fees
* different reliability values
* some low-liquidity channels
* some high-quality routes
* enough network complexity to make route selection meaningful

The graph should remain visually readable.

Do not generate a random graph on every page reload.

Use deterministic seeded generation.

---

# 9. Routing Algorithms

Implement three routing strategies.

## A. Shortest Path

Optimize for:

> minimum number of hops

This is the baseline.

Use a standard graph shortest-path approach.

---

## B. Lowest Cost

Optimize for:

> minimum total routing fee

Edge weight should be derived from the channel's fee.

---

## C. Intelligent Route

Create a multi-factor scoring model.

Example:

```text
routeScore =
  wFee * normalizedFee +
  wHops * normalizedHops +
  wReliability * reliabilityPenalty +
  wLiquidity * liquidityPenalty +
  wLatency * normalizedLatency
```

Allow user preference presets.

### Cheapest

```text
Fee: 60%
Reliability: 15%
Liquidity: 10%
Hops: 10%
Latency: 5%
```

### Most Reliable

```text
Fee: 10%
Reliability: 55%
Liquidity: 20%
Hops: 10%
Latency: 5%
```

### Balanced

```text
Fee: 25%
Reliability: 30%
Liquidity: 20%
Hops: 15%
Latency: 10%
```

The exact weights are adjustable constants.

Document that this is a **simulation model**, not a production Lightning routing algorithm.

This distinction is important.

---

# 10. Payment Amount and Liquidity

The payment amount must affect route feasibility.

If:

```text
paymentAmount > availableLiquidity
```

the channel cannot carry the payment.

That edge must be treated as unavailable for the route calculation.

This should be visible in the UI.

Example:

> Payment requires 500,000 sats
> Channel has 320,000 sats available
> This connection cannot forward the payment.

Use plain language first, technical terminology second.

---

# 11. Route Comparison

After finding routes, show a comparison panel.

Example:

```text
ROUTE OPTIONS

Recommended
Alice → Charlie → Frank → Bob

96% success
12 sats
3 hops
42 ms


Cheapest
Alice → Diana → Ethan → Frank → Bob

98% success
7 sats
4 hops
58 ms


Shortest
Alice → Charlie → Bob

81% success
15 sats
2 hops
31 ms
```

Use a visual comparison.

The recommended route should have a clear explanation:

> Recommended because it balances fee, reliability, available liquidity, and route length.

Do not say:

> "AI selected this."

unless an actual ML model is implemented.

Never make unsupported AI claims.

---

# 12. Payment Animation

This is one of the most important demo features.

When the user clicks:

**Send Test Payment**

animate a glowing packet moving from:

```text
Alice
 ↓
Charlie
 ↓
Frank
 ↓
Bob
```

At each node, briefly show:

```text
Forwarding payment...
```

Then:

```text
✓ Payment reached destination
```

Show a timeline:

```text
Alice
  ✓ Payment initiated

Charlie
  ✓ Forwarded

Frank
  ✓ Forwarded

Bob
  ✓ Received
```

The animation should be elegant and fast.

Add an accessible reduced-motion mode.

---

# 13. Failure Simulation

Create a dedicated **What If?** mode.

Controls:

```text
Node failures
[ 0% ─────────●── 30% ]

Network congestion
[ Low ─────●──── High ]

Liquidity reduction
[ 0% ─────●────── 70% ]
```

Buttons:

**Simulate**

**Reset**

When failures occur:

* nodes disappear or become offline
* affected edges visually change
* route becomes invalid
* routing engine recalculates
* new recommended route appears

Show:

```text
NETWORK EVENT

Central Hub is offline.

Previous route is unavailable.

Searching for an alternative...
```

Then:

```text
Alternative found.

New route:
Alice → Diana → Hannah → Bob
```

---

# 14. "What Changed?" Panel

After a simulation, show:

```text
NETWORK IMPACT

Before
Success probability: 96%
Average hops: 3.2
Average fee: 11 sats

After
Success probability: 89%
Average hops: 4.6
Average fee: 17 sats
```

Use charts.

Recommended chart types:

* line chart
* bar chart
* route comparison bars
* success probability indicator

Use a lightweight charting library compatible with Next.js.

Keep charts visually consistent with the application.

---

# 15. Educational "Learn" Experience

Create `/learn`.

This page should feel like an interactive mini-course.

Sections:

### 01. The problem

> How do you move something from A to B through a network?

Interactive graph.

### 02. Digital payments

Explain the difference between direct and intermediary-based payments.

### 03. Bitcoin

Extremely concise explanation.

### 04. Lightning

Show the network concept.

### 05. Channels

Explain:

> A payment channel is a connection between participants that can be used to route payments.

### 06. Liquidity

Use a road analogy:

> A road can exist, but that doesn't mean it can carry a truck of any size.

### 07. Routing

Compare several paths.

### 08. Why this is difficult

Show:

* cost
* capacity
* reliability
* latency
* failures

### 09. Industry connection

Explain:

> Lightning infrastructure spans networks, payments, liquidity, and network data. This project explores a simplified version of the routing problem.

Do not imply this project is an official product or production service.

---

# 16. Glossary

Create a compact glossary accessible from the top navigation.

Terms:

* Bitcoin
* Lightning Network
* Node
* Payment Channel
* Liquidity
* Routing
* Routing Fee
* Hop
* Satoshi / sat
* Capacity

Each definition should have:

1. Simple definition
2. Analogy
3. Technical definition

Example:

**Liquidity**

Simple:

> How much value is currently available for a payment to pass through a connection.

Analogy:

> The amount of room available on a road.

Technical:

> The currently usable balance/capacity available for forwarding a payment across a channel.

---

# 17. "Try It" Guided Demo

Create a one-click guided demo.

Button:

**Show me how a payment works**

The application automatically:

1. selects Alice
2. selects Bob
3. selects an amount
4. finds three routes
5. explains the routes
6. highlights the recommended route
7. animates the payment
8. shows the result

The narration should say things like:

> "There are several possible routes."

> "This route is cheaper, but has lower reliability."

> "The system selects a balanced route."

> "The payment is forwarded through three intermediate participants."

This should let a professor understand the entire project in approximately two minutes.

---

# 18. Main Navigation

Create a polished responsive navigation:

```text
[Logo]

Explore
How It Works
What If?
Network
Learn
About

[Theme toggle]
```

On mobile use a proper mobile menu.

---

# 19. About Page

Create `/about`.

Include:

## Project

**Google Maps for Lightning Payments**

## Problem

Finding a reliable route through a distributed payment network is a graph optimization problem.

## Our Approach

We simulate a Lightning-inspired network and compare routing strategies based on:

* cost
* reliability
* liquidity
* route length
* latency

## Industry Context

Explain that this college project independently explores routing and network visualization concepts relevant to the Lightning infrastructure ecosystem.

## Important Disclaimer

> This is an educational simulation. It does not execute real Bitcoin or Lightning payments.

---

# 20. Dashboard / Network Overview

Create `/network`.

Show:

* number of nodes
* number of channels
* total simulated liquidity
* average reliability
* network density
* most connected nodes
* potential bottlenecks
* active/inactive nodes

Create beautiful cards.

Example:

```text
NETWORK
52 nodes

CONNECTIONS
184 channels

LIQUIDITY
128.4M sats

AVG RELIABILITY
94.7%
```

Clicking a metric should explain what it means.

---

# 21. Bottleneck Visualization

Identify nodes with unusually high graph centrality.

Display:

> Potential network bottleneck

Example:

```text
Central Hub

Connections: 17
Betweenness centrality: 0.42

Why it matters:
Many routes pass through this participant.
If it becomes unavailable, several routes may become longer or fail.
```

This is a good bridge between graph theory and Lightning.

---

# 22. Responsive Design Requirements

The app must be genuinely responsive.

Desktop:

* two-column layouts where appropriate
* large graph
* floating controls
* side panels

Tablet:

* flexible grid
* collapsible panels

Mobile:

* stacked layout
* bottom sheets
* touch-friendly controls
* no horizontal overflow
* graph remains usable
* route cards become horizontally scrollable if needed
* navigation becomes hamburger menu

Minimum targets:

* 360px mobile width
* 768px tablet
* 1024px laptop
* 1440px desktop

Test all four.

---

# 23. Accessibility

Implement proper:

* keyboard navigation
* focus states
* semantic HTML
* ARIA labels where necessary
* sufficient contrast
* reduced motion
* accessible button states
* accessible form labels
* screen-reader descriptions for important route information

Do not make the graph interaction the only way to understand the data.

Route results must also be available as normal text/cards.

---

# 24. Visual Design Requirements

The visual quality is extremely important.

Use:

* subtle entrance animations
* smooth hover states
* route drawing animations
* tasteful blur/glass effects only where useful
* responsive cards
* soft borders
* careful spacing
* strong typography hierarchy
* polished empty/loading/error states

Avoid:

* excessive glassmorphism
* giant gradients
* excessive rounded cards
* generic Tailwind dashboard appearance
* excessive icons
* cluttered screens
* crypto clichés

Use motion to communicate state, not decoration.

---

# 25. Suggested Technical Stack

Use:

### Framework

**Next.js App Router**

Use TypeScript.

Next.js currently documents the App Router as the newer router with modern React features.

Use a currently supported stable Next.js release rather than pinning to an obsolete version. At the time of this specification, Next.js 16.2.11 is listed as Active LTS and 16.3 has newer releases/features, so verify the current stable/security-supported version at implementation time.

### Deployment

**Vercel**

Configure the project so it can deploy with standard Next.js/Vercel configuration. Vercel provides first-class Next.js deployment support.

### Language

TypeScript

### Styling

Tailwind CSS

Use a clean tokenized design system.

### Graph

`@xyflow/react`

### Icons

Lucide React

### Charts

Use a lightweight chart library such as Recharts or another mature React-compatible option.

### Animation

Use Framer Motion / Motion where useful.

Do not animate every element.

### State

Prefer:

* React state for local UI state
* Context or Zustand only where genuinely needed

Avoid unnecessary global state.

### Validation

Use Zod for structured input validation if needed.

### Data

Start with local deterministic TypeScript/JSON datasets.

Do not introduce a database unless there is an actual need.

---

# 26. Project Structure

Use a clean structure similar to:

```text
app/
  page.tsx
  explore/
    page.tsx
  network/
    page.tsx
  learn/
    page.tsx
  what-if/
    page.tsx
  about/
    page.tsx

components/
  layout/
  navigation/
  graph/
    NetworkGraph.tsx
    LightningNode.tsx
    ChannelEdge.tsx
    GraphLegend.tsx
  routing/
    RouteControls.tsx
    RouteResults.tsx
    RouteComparison.tsx
    RouteExplanation.tsx
  simulation/
    FailureControls.tsx
    ScenarioPanel.tsx
    SimulationResults.tsx
  education/
    ConceptCard.tsx
    Glossary.tsx
    Tutorial.tsx
  charts/
  ui/

lib/
  network/
  routing/
  simulation/
  metrics/
  utils/

data/
  network.ts
  scenarios.ts
```

Keep business logic out of UI files.

---

# 27. Performance Requirements

The graph should feel responsive.

Avoid unnecessary rerenders.

Memoize expensive route calculations where appropriate.

Do not calculate all route combinations on every keystroke.

Use client components only where interactivity requires them.

Use server components elsewhere where appropriate.

Do not load huge external datasets into the browser.

---

# 28. No Real Payment Execution

This is mandatory.

Never create code that:

* requests a private key
* requests a seed phrase
* performs real Bitcoin transfers
* performs real Lightning payments
* requests a user's wallet credentials

The application is an educational simulation.

Use terms like:

**Test Payment**

**Simulated Payment**

**Simulated Network**

where appropriate.

---

# 29. Important Accuracy Requirements

Do not make false claims about Lightning.

In particular:

* do not claim every Lightning payment is instant under all conditions
* do not claim every route is guaranteed to succeed
* do not claim Lightning has no fees
* do not present simulated success probabilities as real network statistics
* do not claim our routing algorithm is any operator's production algorithm
* do not call the scoring function "AI" unless an actual machine learning model exists
* clearly label synthetic data as synthetic

Use:

> Estimated success probability

rather than:

> Guaranteed success

and:

> Simulated network

rather than:

> Real Lightning network

---

# 30. Optional Real-World Data Integration

Architect the application so a future adapter could ingest real network data.

Create an abstraction:

```ts
interface NetworkDataProvider {
  getNodes(): Promise<LightningNode[]>
  getChannels(): Promise<PaymentChannel[]>
}
```

Implement:

```ts
SimulationDataProvider
```

by default.

Do not implement live external integrations unless they can use publicly available, clearly permitted APIs without credentials in the demo.

The project must work completely without this integration.

If a real integration is later added, place it behind a feature flag.

---

# 31. Demo Scenarios

Include predefined scenarios.

### Scenario 1: Normal Network

Everything works.

### Scenario 2: Cheapest Isn't Best

The cheapest route has lower reliability.

The intelligent route chooses a slightly more expensive but safer route.

### Scenario 3: Large Payment

Increase the payment amount so some channels become unusable because of insufficient simulated liquidity.

### Scenario 4: Major Node Failure

Disable a highly connected node.

Watch the network reroute.

### Scenario 5: Network Congestion

Increase latency and failure probability.

Observe how route selection changes.

### Scenario 6: High Reliability Preference

User changes priority to "Most Reliable."

Recommended route changes.

These scenarios should be accessible through buttons.

---

# 32. Example Default Network

Create a deliberately designed topology.

Example:

```text
                         ┌────── Grace
                         │
Alice ─── Charlie ─── Frank ─── Bob
  │         │           │
  │         │           │
Diana ─── Ethan ───── Hannah
  │                     │
  └──── Julia ──────────┘
```

Expand this to ~40-60 nodes.

Make sure there are enough alternative routes that the routing algorithms produce meaningfully different outcomes.

---

# 33. Route Explanation Engine

Create human-readable explanations.

Given a route, generate text such as:

> **Why this route?**

> This route costs 12 sats and uses 3 hops. All required channels have enough simulated liquidity, and the route has a higher estimated reliability than the cheaper alternatives.

For another route:

> **Why not this route?**

> This route is cheaper, but one channel has lower reliability and the overall estimated success probability is lower.

This feature is extremely important for professors.

It transforms the algorithm from a black box into something they can understand.

---

# 34. Teaching the Graph Algorithm

Inside `/learn`, include a simple interactive explanation of shortest path.

Show:

```text
A → B → D
 \       ↑
  → C ───┘
```

Animate the algorithm exploring paths.

Explain:

> The system evaluates possible routes and selects the one with the lowest total score.

Do not dump mathematical notation immediately.

Then optionally show:

```text
score = cost + reliability penalty + liquidity penalty + hop penalty
```

This gives the project academic depth.

---

# 35. Data and Experiment Lab

Create `/lab`.

Allow users to run repeated simulated experiments.

Example:

```text
NETWORK SIZE
20 ─────────●──────── 100

FAILURE RATE
0% ─────●──────────── 30%

PAYMENT SIZE
10k ────●──────────── 1M

[ RUN EXPERIMENT ]
```

Results:

```text
Experiment complete

1,000 simulated payments

Success:
94.2%

Average fee:
11.4 sats

Average hops:
4.1

Failures:
58
```

Show a chart comparing algorithms.

This section makes the project feel like a genuine engineering/research project rather than only a UI demo.

---

# 36. Loading and Error States

Build deliberate states.

Loading:

```text
Building network...
Calculating route...
Analyzing liquidity...
```

No route:

```text
No viable route found.

Why?

The selected payment is larger than the available capacity across all candidate routes.
```

Network unavailable:

```text
This participant is offline.

Try another destination or run the network simulation again.
```

Do not expose raw stack traces to users.

---

# 37. SEO / Metadata

Create useful metadata:

Title:

> Google Maps for Lightning Payments

Description:

> An interactive simulation that visualizes how payments can be routed through a Lightning-inspired distributed network.

Add Open Graph metadata.

Make the landing page shareable.

---

# 38. Testing

Add meaningful tests for:

### Routing

* shortest path
* cheapest path
* intelligent route
* unreachable destination
* insufficient liquidity
* offline node
* disconnected graph

### Simulation

* node failures
* channel failures
* liquidity changes
* deterministic results

### UI

Test the most important user journey:

```text
Landing page
→ Explore
→ Select sender
→ Select receiver
→ Enter amount
→ Find route
→ Compare routes
→ Send simulated payment
→ See successful animation
```

---

# 39. Vercel Deployment

The project must deploy cleanly to Vercel.

Do not require a persistent backend server.

Avoid dependencies that require long-running processes.

Use:

* static/local data
* serverless-compatible APIs if required
* browser-side simulation where appropriate

Vercel provides first-class Next.js support and automatic deployment workflows, so keep the implementation compatible with standard Vercel deployment.

Create:

```text
README.md
```

with:

1. Project overview
2. Architecture
3. Local setup
4. Development commands
5. How routing works
6. How simulation works
7. How to deploy to Vercel
8. Explanation of Bitcoin/Lightning concepts
9. Limitations
10. Future improvements

---

# 40. README Educational Section

The README should contain a section:

## "If you know nothing about Bitcoin"

Explain in very simple language:

```text
Bitcoin
→ digital payment network

Lightning
→ payment network built on top of Bitcoin

Node
→ participant in the network

Channel
→ connection between participants

Liquidity
→ usable capacity for forwarding a payment

Route
→ sequence of participants through which a payment travels
```

Then explain why this application exists.

---

# 41. Final Presentation Mode

Create an optional **Demo Mode**.

URL:

```text
/demo
```

This should be a carefully scripted five-minute demonstration.

Sequence:

1. Welcome screen
2. Explain network
3. Choose Alice → Bob
4. Show three routes
5. Explain recommended route
6. Animate payment
7. Disable a major node
8. Show rerouting
9. Increase payment size
10. Show liquidity failure
11. Run experiment
12. Show algorithm comparison

Add a progress indicator:

```text
1 Network
2 Route
3 Payment
4 Failure
5 Experiment
```

A professor should be able to understand the entire project simply by following this mode.

---

# 42. Product Quality Bar

Do not stop when the app technically works.

Iterate on:

* spacing
* typography
* graph layout
* animation
* route clarity
* mobile responsiveness
* educational language
* empty states
* loading states
* visual hierarchy

The final app must look like an intentionally designed product.

No:

* placeholder buttons
* lorem ipsum
* broken links
* fake charts with no relation to underlying data
* unused UI elements
* unexplained icons
* console errors
* TypeScript errors
* ESLint errors
* horizontal scrolling on mobile

---

# 43. Implementation Strategy

Work incrementally.

First establish:

1. Next.js project
2. design system
3. main layout
4. network model
5. deterministic network
6. React Flow graph
7. shortest-path routing
8. route comparison
9. intelligent routing
10. payment animation
11. failure simulation
12. education pages
13. charts
14. responsive polish
15. tests
16. deployment readiness

After each major feature:

* run TypeScript checks
* run lint
* run tests
* inspect the UI
* fix visual regressions
* verify mobile behavior

Do not create the entire application blindly in one pass.

---

# 44. Engineering Principles

Prefer simple, readable code over clever abstractions.

Use strong TypeScript typing.

Separate:

* domain logic
* routing algorithms
* simulation
* UI
* visualization
* educational content

Make algorithms deterministic for reproducible demonstrations.

Do not introduce unnecessary dependencies.

Do not add authentication.

Do not add a database unless required.

Do not add payments.

Do not add crypto wallets.

Do not add real-money functionality.

The project should be easy for a college student to explain line-by-line during a viva.

---

# 45. Definition of Done

The project is complete only when all of these are true:

### User experience

* [ ] Landing page clearly explains the concept without Bitcoin knowledge
* [ ] User can enter source, destination, and payment amount
* [ ] Interactive network graph works
* [ ] User can zoom and pan
* [ ] Nodes and channels are understandable
* [ ] Route can be calculated
* [ ] At least three routing strategies work
* [ ] Routes can be compared
* [ ] Recommended route has an explanation
* [ ] Simulated payment animation works
* [ ] Network failure simulation works
* [ ] Liquidity constraints work
* [ ] Network statistics work
* [ ] Educational tutorial works
* [ ] Glossary works
* [ ] Demo mode works

### Technical

* [ ] TypeScript compiles
* [ ] Lint passes
* [ ] Tests pass
* [ ] No obvious console errors
* [ ] Responsive at 360px, 768px, 1024px, and 1440px
* [ ] Vercel deployment succeeds
* [ ] No secrets required
* [ ] No real payments executed

### Academic

* [ ] Problem statement is clear
* [ ] Baseline routing algorithm exists
* [ ] Improved routing approach exists
* [ ] Metrics are measurable
* [ ] Experiments can be repeated
* [ ] Results can be visualized
* [ ] Limitations are documented
* [ ] Lightning concepts are explained accurately
* [ ] Synthetic data is explicitly labeled synthetic

---

# 46. Final Product Personality

The application should feel like:

> "Google Maps meets Stripe meets a network-science visualization tool."

It should NOT feel like:

> "A student made a Bitcoin dashboard."

Prioritize clarity, visual quality, interaction, and explainability.

The most important test is:

**Can a professor who has never heard of Bitcoin understand the problem within 60 seconds?**

Then:

**Can they understand why the routing algorithm is non-trivial within 3 minutes?**

Then:

**Can they see measurable engineering results within 5 minutes?**

Build specifically for those three outcomes.

Start by creating the complete Next.js application and implement the core experience end-to-end before expanding secondary pages. Do not leave the main route simulation as a placeholder.
