import type { ScenarioDefinition } from "../lib/simulation/types.ts"

export const DEMO_SCENARIOS: readonly ScenarioDefinition[] = [
  {
    id: "normal",
    name: "Normal network",
    shortName: "Normal",
    description: "All participants and connections are available.",
    lesson: "Several valid paths can still have very different trade-offs.",
    request: {
      source: "alice",
      target: "bob",
      amount: 50_000,
      preset: "balanced",
    },
    conditions: {},
  },
  {
    id: "cheapest-isnt-best",
    name: "Cheapest isn't best",
    shortName: "Cost vs safety",
    description: "The lowest-fee path uses less dependable connections.",
    lesson: "Saving a few sats can materially reduce estimated success.",
    request: {
      source: "alice",
      target: "bob",
      amount: 50_000,
      preset: "balanced",
    },
    conditions: {},
  },
  {
    id: "large-payment",
    name: "Large payment",
    shortName: "Large payment",
    description: "A larger test payment no longer fits through every connection.",
    lesson: "A connection can exist but still lack enough available liquidity.",
    request: {
      source: "alice",
      target: "bob",
      amount: 1_100_000,
      preset: "balanced",
    },
    conditions: {},
  },
  {
    id: "major-node-failure",
    name: "Major node failure",
    shortName: "Hub offline",
    description: "Central Hub is disabled and nearby payments must reroute.",
    lesson: "Highly connected participants can become network bottlenecks.",
    request: {
      source: "north-hub",
      target: "west-hub",
      amount: 250_000,
      preset: "balanced",
    },
    conditions: {},
    disabledNodeIds: ["central-hub"],
  },
  {
    id: "network-congestion",
    name: "Network congestion",
    shortName: "Congestion",
    description: "Every forwarding step is slower and somewhat less dependable.",
    lesson: "Current network conditions can change which path is preferable.",
    request: {
      source: "alice",
      target: "bob",
      amount: 50_000,
      preset: "balanced",
    },
    conditions: { congestion: 0.72 },
  },
  {
    id: "high-reliability",
    name: "High reliability preference",
    shortName: "Reliability first",
    description: "The scoring model gives dependable channels more importance.",
    lesson: "The best route depends on what the sender values most.",
    request: {
      source: "alice",
      target: "bob",
      amount: 50_000,
      preset: "most-reliable",
    },
    conditions: {},
  },
] as const

export const SCENARIOS_BY_ID = Object.fromEntries(
  DEMO_SCENARIOS.map((scenario) => [scenario.id, scenario]),
) as Record<ScenarioDefinition["id"], ScenarioDefinition>
