# Lightning Maps

**Google Maps for Lightning Payments** is an interactive, deterministic simulation of routing a payment through a distributed network. It compares three graph-routing strategies, visualizes why a route was selected, animates a test payment, and measures what changes when participants fail or usable capacity decreases.

Everything is synthetic. The app uses no wallet, private key, seed phrase, credentials, Lightning node, or real money.

## If you know nothing about Bitcoin

Start with a road map:

- **Bitcoin** → a digital payment network.
- **Lightning** → a payment network built on top of Bitcoin.
- **Node** → a participant in the network, like a place on a map.
- **Payment channel** → a connection between participants, like a road.
- **Liquidity** → the usable room for forwarding a payment, like a road's current carrying capacity.
- **Routing fee** → the simulated toll charged by a connection.
- **Route** → the sequence of participants through which a payment travels.

A road can exist without being suitable for every vehicle. In the same way, a payment channel can exist without having enough usable liquidity for a particular amount. Lightning Maps exists to make that routing problem visible before introducing deeper cryptocurrency terminology.

## What you can do

- Choose a sender, receiver, simulated amount, and routing objective.
- Compare shortest-hop, lowest-fee, and multi-factor balanced routes.
- Inspect fees, hops, estimated success, latency, reliability, and minimum liquidity.
- Pan and zoom a deterministic 50-node, 93-channel network.
- Select participants and inspect their status, role, connectivity, and capacity.
- Animate a simulated payment one forwarding step at a time.
- Disable nodes, add congestion, reduce liquidity, and watch the network reroute.
- Run repeatable experiments that compare all three algorithms.
- Follow a five-step presentation mode designed for a project demonstration.

## Application routes

| Route | Purpose |
| --- | --- |
| `/` | Plain-language introduction and interactive concept progression |
| `/explore` | Primary route planner, graph, comparison, and payment simulation |
| `/what-if` | Explorer opened directly in network-stress mode |
| `/learn` | Interactive mini-course, glossary, and shortest-path lesson |
| `/network` | Network statistics and graph-theory bottleneck analysis |
| `/lab` | Deterministic repeated experiment runner |
| `/demo` | Scripted five-step presentation mode |
| `/about` | Method, ecosystem context, disclaimer, and limitations |

## Architecture

```text
app/                    Next.js App Router pages and metadata
components/
  graph/                React Flow nodes, edges, controls, and map legend
  routing/              Route input, comparison, explanation, explorer state
  simulation/           Failure controls and payment timeline
  education/            Tutorial, glossary, and algorithm lesson
  network/              Network overview UI
  charts/               Experiment and network charts
lib/
  network/              Types, seeded topology generator, graph helpers, provider
  routing/              Shortest, cheapest, intelligent routing, scoring, prose
  simulation/           Failures, congestion, liquidity, scenarios, payment steps
  metrics/              Network statistics, density, centrality, impact comparison
  experiments/          Repeatable seeded multi-algorithm experiments
data/                   Default network and prepared scenarios
styles/                 OKLCH tokens, base UI, product pages, motion, responsiveness
tests/                  Routing, simulation, metrics, provider, and experiment tests
```

The domain layer contains no React code. UI components consume typed, immutable results from the routing and simulation modules. This keeps the algorithms explainable and independently testable.

### Data provider boundary

`NetworkDataProvider` defines the future integration boundary. `SimulationDataProvider` is the only implementation used today, so the complete project works locally and on Vercel without an API key or backend.

## How routing works

Every channel is checked before search. A channel is unavailable when it is disabled, touches an offline participant, or has less simulated liquidity than the requested amount.

The app then calculates:

1. **Shortest path** — breadth-first routing that minimizes hop count.
2. **Lowest cost** — weighted graph search that minimizes the calculated routing fee.
3. **Intelligent route** — a deterministic multi-factor score that combines fee, reliability penalty, liquidity headroom, hop count, and latency.

The objective presets adjust those factor weights. This is an educational simulation model, not a production Lightning routing algorithm and not an AI or machine-learning model.

Estimated route success is derived from synthetic channel reliability values. It is not a guarantee and does not represent live Lightning Network statistics.

## How simulation works

All pseudo-random behavior is seeded. The same network seed, failure settings, and experiment settings produce the same result.

- Node failure disables the participant and every touching channel.
- Channel failure disables a deterministic subset of connections.
- Liquidity reduction scales the usable amount on each channel.
- Congestion increases latency and reduces synthetic reliability.
- Payment simulation validates every step, then emits a timed semantic timeline for the UI.

Prepared scenarios cover normal conditions, cost-versus-reliability, a large payment, a hub failure, congestion, and a reliability-first objective.

## Local development

Requirements:

- Node.js 20.9 or newer
- pnpm 11

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### Quality commands

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm check
```

`pnpm check` runs lint, TypeScript, domain tests, and a production build.

## Deploy to Vercel

1. Push the repository to a Git provider.
2. Import it into Vercel.
3. Keep the detected framework as **Next.js** and package manager as **pnpm**.
4. Deploy with the default `pnpm build` command.

No environment variables, database, persistent server, or credentials are required.

## Accuracy and safety

- “Success” always means **estimated success probability** inside the synthetic model.
- A successful test animation does not execute a Bitcoin or Lightning payment.
- The generated participants and channel values are fictional.
- The project does not claim to reproduce any production routing algorithm.
- The project is an independent educational simulation, not a production service.

## Limitations

- The topology is intentionally small and designed for readability, not a copy of the public Lightning Network.
- Channels are modeled as simplified bidirectional connections; real channel balances and directionality are more nuanced.
- Reliability and latency are synthetic estimates rather than observations.
- The scoring weights are explainable teaching constants, not production tuning.
- Payment attempts do not model every protocol detail, privacy technique, or multi-part payment behavior.
- Betweenness centrality is calculated on the simulated topology and should not be interpreted as real-world risk.

## Future improvements

- Add an opt-in, feature-flagged public-data adapter with clear provenance.
- Model directional liquidity and multi-part payments.
- Export experiment runs as CSV for academic analysis.
- Add end-to-end browser coverage for the full guided journey.
- Compare additional graph-search heuristics and visualize their search frontier.

## Technology

Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, React Flow, Recharts, and Lucide icons. The supported Active LTS line is used for straightforward Vercel deployment.
