import { createSeededRandom, stableHash } from "../utils/random.ts"
import type {
  LightningNode,
  NetworkPosition,
  NodeRole,
  PaymentChannel,
  PaymentNetwork,
} from "./types.ts"

export const DEFAULT_NETWORK_SEED = 20_250_606
export const DEFAULT_NODE_COUNT = 50

const NODE_NAMES = [
  "Alice",
  "Bob",
  "Charlie",
  "Diana",
  "Ethan",
  "Frank",
  "Grace",
  "Hannah",
  "Isaac",
  "Julia",
  "Central Hub",
  "North Hub",
  "South Hub",
  "East Hub",
  "West Hub",
  "Merchant Square",
  "River Market",
  "Harbor Cafe",
  "Campus Store",
  "Metro Books",
  "Aurora",
  "Beacon",
  "Cedar",
  "Delta",
  "Ember",
  "Falcon",
  "Grove",
  "Horizon",
  "Indigo",
  "Juniper",
  "Kestrel",
  "Linden",
  "Maple",
  "Nova",
  "Orion",
  "Pine",
  "Quartz",
  "Rowan",
  "Summit",
  "Tidal",
  "Union",
  "Valley",
  "Willow",
  "Xenon",
  "Yard",
  "Zenith",
  "Station 46",
  "Relay 47",
  "Node 48",
  "Node 49",
] as const

const REGIONS = ["North", "Central", "East", "South", "West"] as const

const slugify = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")

function positionFor(index: number, seed: number): NetworkPosition {
  const column = index % 10
  const row = Math.floor(index / 10)
  const positionSeed = stableHash(`${seed}:position:${index}`)
  const jitterX = (positionSeed % 31) - 15
  const jitterY = (Math.floor(positionSeed / 31) % 31) - 15

  return {
    x: 90 + column * 155 + (row % 2) * 42 + jitterX,
    y: 70 + row * 145 + jitterY,
  }
}

function roleFor(index: number): NodeRole {
  if (index >= 10 && index <= 14) return "hub"
  if (index >= 15 && index <= 19) return "merchant"
  if (index >= 46) return "relay"
  return "participant"
}

function createNodeSeeds(count: number, seed: number): LightningNode[] {
  return Array.from({ length: count }, (_, index) => {
    const name = NODE_NAMES[index] ?? `Participant ${index + 1}`
    const reliability = 0.91 + (stableHash(`${seed}:node:${index}`) % 85) / 1_000

    return {
      id: slugify(name),
      name,
      online: true,
      reliability: Math.min(reliability, 0.995),
      totalCapacity: 0,
      availableLiquidity: 0,
      connectionCount: 0,
      recentFailures: stableHash(`${seed}:failures:${index}`) % 4,
      region: REGIONS[index % REGIONS.length]!,
      role: roleFor(index),
      position: positionFor(index, seed),
    }
  })
}

type ChannelOverrides = Partial<
  Omit<PaymentChannel, "id" | "source" | "target">
>

function channelId(first: string, second: string): string {
  return `channel-${[first, second].sort().join("--")}`
}

function createChannel(
  source: string,
  target: string,
  seed: number,
  overrides: ChannelOverrides = {},
): PaymentChannel {
  const random = createSeededRandom(`${seed}:${source}:${target}`)
  const capacity = random.integer(700_000, 6_500_000)
  const liquidityRatio = 0.25 + random.next() * 0.68

  return {
    id: channelId(source, target),
    source,
    target,
    capacity,
    availableLiquidity: Math.floor(capacity * liquidityRatio),
    feeBase: random.integer(1, 9),
    feeRate: random.integer(8, 80),
    reliability: 0.86 + random.next() * 0.135,
    latencyMs: random.integer(9, 86),
    enabled: true,
    ...overrides,
  }
}

function criticalChannels(seed: number): PaymentChannel[] {
  const build = (
    source: string,
    target: string,
    overrides: ChannelOverrides,
  ) => createChannel(source, target, seed, overrides)

  return [
    build("alice", "charlie", {
      capacity: 3_600_000,
      availableLiquidity: 2_800_000,
      feeBase: 3,
      feeRate: 18,
      reliability: 0.992,
      latencyMs: 11,
    }),
    build("charlie", "bob", {
      capacity: 850_000,
      availableLiquidity: 620_000,
      feeBase: 17,
      feeRate: 90,
      reliability: 0.82,
      latencyMs: 19,
    }),
    build("charlie", "frank", {
      capacity: 4_200_000,
      availableLiquidity: 3_500_000,
      feeBase: 3,
      feeRate: 22,
      reliability: 0.991,
      latencyMs: 13,
    }),
    build("frank", "bob", {
      capacity: 3_800_000,
      availableLiquidity: 3_100_000,
      feeBase: 4,
      feeRate: 20,
      reliability: 0.987,
      latencyMs: 12,
    }),
    build("alice", "diana", {
      capacity: 2_100_000,
      availableLiquidity: 1_650_000,
      feeBase: 1,
      feeRate: 5,
      reliability: 0.93,
      latencyMs: 16,
    }),
    build("diana", "ethan", {
      capacity: 1_950_000,
      availableLiquidity: 1_480_000,
      feeBase: 1,
      feeRate: 5,
      reliability: 0.9,
      latencyMs: 17,
    }),
    build("ethan", "hannah", {
      capacity: 1_800_000,
      availableLiquidity: 1_320_000,
      feeBase: 1,
      feeRate: 6,
      reliability: 0.92,
      latencyMs: 16,
    }),
    build("hannah", "bob", {
      capacity: 1_750_000,
      availableLiquidity: 1_250_000,
      feeBase: 1,
      feeRate: 6,
      reliability: 0.93,
      latencyMs: 15,
    }),
    build("alice", "grace", {
      capacity: 1_300_000,
      availableLiquidity: 780_000,
      feeBase: 4,
      feeRate: 28,
      reliability: 0.997,
      latencyMs: 18,
    }),
    build("grace", "isaac", {
      capacity: 1_200_000,
      availableLiquidity: 710_000,
      feeBase: 5,
      feeRate: 32,
      reliability: 0.996,
      latencyMs: 21,
    }),
    build("isaac", "bob", {
      capacity: 1_250_000,
      availableLiquidity: 740_000,
      feeBase: 5,
      feeRate: 30,
      reliability: 0.995,
      latencyMs: 20,
    }),
    build("diana", "julia", {
      capacity: 1_100_000,
      availableLiquidity: 820_000,
      feeBase: 2,
      feeRate: 18,
      reliability: 0.95,
      latencyMs: 22,
    }),
    build("julia", "hannah", {
      capacity: 1_050_000,
      availableLiquidity: 760_000,
      feeBase: 3,
      feeRate: 16,
      reliability: 0.954,
      latencyMs: 20,
    }),
  ]
}

function addChannel(
  channels: PaymentChannel[],
  seen: Set<string>,
  source: string,
  target: string,
  seed: number,
  overrides: ChannelOverrides = {},
): void {
  if (source === target) return
  const id = channelId(source, target)
  if (seen.has(id)) return
  seen.add(id)
  channels.push(createChannel(source, target, seed, overrides))
}

function connectSecondaryNetwork(
  nodes: LightningNode[],
  seed: number,
  initialChannels: PaymentChannel[],
): PaymentChannel[] {
  const channels = [...initialChannels]
  const seen = new Set(channels.map((channel) => channel.id))
  const secondary = nodes.slice(10)

  for (let index = 0; index < secondary.length; index += 1) {
    const current = secondary[index]!
    const next = secondary[(index + 1) % secondary.length]!
    addChannel(channels, seen, current.id, next.id, seed)
  }

  const hubs = nodes.slice(10, 15)
  for (let hubIndex = 0; hubIndex < hubs.length; hubIndex += 1) {
    const hub = hubs[hubIndex]!
    for (let offset = 0; offset < 6; offset += 1) {
      const spokeIndex = 15 + hubIndex + offset * 5
      const spoke = nodes[spokeIndex]
      if (spoke) {
        addChannel(channels, seen, hub.id, spoke.id, seed, {
          reliability: 0.955 + (offset % 4) * 0.009,
          availableLiquidity: 1_700_000 + offset * 320_000,
          capacity: 4_500_000 + offset * 380_000,
        })
      }
    }
  }

  for (let index = 0; index < hubs.length; index += 1) {
    addChannel(
      channels,
      seen,
      hubs[index]!.id,
      hubs[(index + 1) % hubs.length]!.id,
      seed,
      {
        capacity: 8_500_000,
        availableLiquidity: 6_800_000,
        reliability: 0.989,
        feeBase: 4,
        feeRate: 14,
        latencyMs: 10 + index * 2,
      },
    )
  }

  addChannel(channels, seen, "central-hub", "south-hub", seed)
  addChannel(channels, seen, "north-hub", "east-hub", seed)
  addChannel(channels, seen, "west-hub", "central-hub", seed)

  const coreAttachments: ReadonlyArray<readonly [string, string]> = [
    ["grace", "north-hub"],
    ["frank", "central-hub"],
    ["hannah", "south-hub"],
    ["ethan", "west-hub"],
    ["isaac", "east-hub"],
    ["julia", "south-hub"],
    ["charlie", "beacon"],
  ]
  for (const [source, target] of coreAttachments) {
    if (nodes.some((node) => node.id === target)) {
      addChannel(channels, seen, source, target, seed)
    }
  }

  return channels
}

function populateNodeMetrics(
  nodes: LightningNode[],
  channels: PaymentChannel[],
): LightningNode[] {
  return nodes.map((node) => {
    const connected = channels.filter(
      (channel) => channel.source === node.id || channel.target === node.id,
    )
    return {
      ...node,
      connectionCount: connected.length,
      totalCapacity: connected.reduce(
        (total, channel) => total + channel.capacity,
        0,
      ),
      availableLiquidity: connected.reduce(
        (total, channel) => total + channel.availableLiquidity,
        0,
      ),
    }
  })
}

export type NetworkGenerationOptions = {
  nodeCount?: number
  seed?: number
}

export function generatePaymentNetwork(
  options: NetworkGenerationOptions = {},
): PaymentNetwork {
  const nodeCount = options.nodeCount ?? DEFAULT_NODE_COUNT
  const seed = options.seed ?? DEFAULT_NETWORK_SEED
  if (!Number.isInteger(nodeCount) || nodeCount < 15 || nodeCount > 100) {
    throw new Error("Network size must be an integer between 15 and 100.")
  }

  const nodeSeeds = createNodeSeeds(nodeCount, seed)
  const channels = connectSecondaryNetwork(
    nodeSeeds,
    seed,
    criticalChannels(seed),
  )
  const nodes = populateNodeMetrics(nodeSeeds, channels)

  return {
    nodes,
    channels,
    metadata: {
      id: `synthetic-lightning-${seed}-${nodeCount}`,
      name: "Lightning Maps demonstration network",
      description:
        "A deterministic, synthetic payment-channel network for education.",
      seed,
      synthetic: true,
      generatedAt: "2025-06-06T00:00:00.000Z",
    },
  }
}
