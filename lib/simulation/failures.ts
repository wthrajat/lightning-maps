import { cloneNetwork } from "../network/graph.ts"
import type { PaymentChannel, PaymentNetwork } from "../network/types.ts"
import { createSeededRandom } from "../utils/random.ts"
import type {
  NetworkConditions,
  NetworkEvent,
  NetworkSimulationResult,
} from "./types.ts"

function normalizedRate(rate: number): number {
  if (!Number.isFinite(rate)) return 0
  const decimalRate = rate > 1 ? rate / 100 : rate
  return Math.min(1, Math.max(0, decimalRate))
}

function selectionCount(total: number, rate: number): number {
  if (rate <= 0 || total === 0) return 0
  return Math.min(total, Math.max(1, Math.round(total * rate)))
}

function eventId(type: string, target: string, seed: number): string {
  return `${type}-${target}-${seed}`
}

function refreshNodeLiquidity(network: PaymentNetwork): PaymentNetwork {
  return {
    ...network,
    nodes: network.nodes.map((node) => {
      const connected = network.channels.filter(
        (channel) => channel.source === node.id || channel.target === node.id,
      )
      return {
        ...node,
        availableLiquidity: connected.reduce(
          (total, channel) => total + channel.availableLiquidity,
          0,
        ),
      }
    }),
  }
}

export function applyNodeFailures(
  network: PaymentNetwork,
  failureRate: number,
  seed = 1,
  protectedNodeIds: readonly string[] = [],
): { network: PaymentNetwork; events: NetworkEvent[] } {
  const result = cloneNetwork(network)
  const protectedIds = new Set(protectedNodeIds)
  const candidates = result.nodes.filter(
    (node) => node.online && !protectedIds.has(node.id),
  )
  const random = createSeededRandom(seed)
  const selected = new Set(
    random
      .shuffle(candidates)
      .slice(0, selectionCount(candidates.length, normalizedRate(failureRate)))
      .map((node) => node.id),
  )

  result.nodes = result.nodes.map((node) =>
    selected.has(node.id) ? { ...node, online: false } : node,
  )
  result.channels = result.channels.map((channel) =>
    selected.has(channel.source) || selected.has(channel.target)
      ? { ...channel, enabled: false }
      : channel,
  )

  const events = result.nodes
    .filter((node) => selected.has(node.id))
    .map((node) => ({
      id: eventId("node-offline", node.id, seed),
      type: "node-offline" as const,
      title: `${node.name} is offline`,
      description:
        "Connections through this participant are unavailable, so routes may change.",
      nodeId: node.id,
    }))
  return { network: result, events }
}

export function applyChannelFailures(
  network: PaymentNetwork,
  failureRate: number,
  seed = 1,
): { network: PaymentNetwork; events: NetworkEvent[] } {
  const result = cloneNetwork(network)
  const candidates = result.channels.filter((channel) => channel.enabled)
  const selected = new Set(
    createSeededRandom(seed)
      .shuffle(candidates)
      .slice(0, selectionCount(candidates.length, normalizedRate(failureRate)))
      .map((channel) => channel.id),
  )

  result.channels = result.channels.map((channel) =>
    selected.has(channel.id) ? { ...channel, enabled: false } : channel,
  )
  const events = result.channels
    .filter((channel) => selected.has(channel.id))
    .map((channel) => ({
      id: eventId("channel-disabled", channel.id, seed),
      type: "channel-disabled" as const,
      title: "A payment connection is unavailable",
      description: `${channel.source} \u2194 ${channel.target} cannot forward this test payment.`,
      channelId: channel.id,
    }))
  return { network: result, events }
}

export function reduceNetworkLiquidity(
  network: PaymentNetwork,
  reduction: number,
): { network: PaymentNetwork; events: NetworkEvent[] } {
  const ratio = normalizedRate(reduction)
  const result = cloneNetwork(network)
  result.channels = result.channels.map((channel) => ({
    ...channel,
    availableLiquidity: Math.max(
      0,
      Math.floor(channel.availableLiquidity * (1 - ratio)),
    ),
  }))

  return {
    network: refreshNodeLiquidity(result),
    events: ratio
      ? [
          {
            id: `liquidity-reduced-${Math.round(ratio * 10_000)}`,
            type: "liquidity-reduced",
            title: "Available liquidity decreased",
            description: `Every connection has ${Math.round(ratio * 100)}% less simulated room for payments.`,
          },
        ]
      : [],
  }
}

export function applyNetworkCongestion(
  network: PaymentNetwork,
  congestion: number,
): { network: PaymentNetwork; events: NetworkEvent[] } {
  const severity = normalizedRate(congestion)
  const result = cloneNetwork(network)
  result.channels = result.channels.map((channel) => ({
    ...channel,
    latencyMs: Math.round(channel.latencyMs * (1 + severity * 3)),
    reliability: Math.max(0.2, channel.reliability * (1 - severity * 0.38)),
  }))

  return {
    network: result,
    events: severity
      ? [
          {
            id: `congestion-${Math.round(severity * 10_000)}`,
            type: "congestion",
            title: "The network is congested",
            description:
              "Forwarding is slower and the simulated chance of a failed attempt is higher.",
          },
        ]
      : [],
  }
}

function appendEvents(
  result: NetworkSimulationResult,
  next: { network: PaymentNetwork; events: NetworkEvent[] },
): NetworkSimulationResult {
  return {
    ...result,
    network: next.network,
    events: [...result.events, ...next.events],
  }
}

export function simulateNetworkConditions(
  network: PaymentNetwork,
  conditions: NetworkConditions = {},
): NetworkSimulationResult {
  const normalized = {
    nodeFailureRate: normalizedRate(conditions.nodeFailureRate ?? 0),
    channelFailureRate: normalizedRate(conditions.channelFailureRate ?? 0),
    liquidityReduction: normalizedRate(conditions.liquidityReduction ?? 0),
    congestion: normalizedRate(conditions.congestion ?? 0),
    seed: conditions.seed ?? 1,
    protectedNodeIds: [...(conditions.protectedNodeIds ?? [])],
  }
  let result: NetworkSimulationResult = {
    network: cloneNetwork(network),
    events: [],
    conditions: normalized,
  }

  result = appendEvents(
    result,
    applyNodeFailures(
      result.network,
      normalized.nodeFailureRate,
      normalized.seed,
      normalized.protectedNodeIds,
    ),
  )
  result = appendEvents(
    result,
    applyChannelFailures(
      result.network,
      normalized.channelFailureRate,
      normalized.seed + 1,
    ),
  )
  result = appendEvents(
    result,
    reduceNetworkLiquidity(result.network, normalized.liquidityReduction),
  )
  result = appendEvents(
    result,
    applyNetworkCongestion(result.network, normalized.congestion),
  )
  return result
}

export function disableNodes(
  network: PaymentNetwork,
  nodeIds: readonly string[],
): { network: PaymentNetwork; events: NetworkEvent[] } {
  const selected = new Set(nodeIds)
  const result = cloneNetwork(network)
  result.nodes = result.nodes.map((node) =>
    selected.has(node.id) ? { ...node, online: false } : node,
  )
  result.channels = result.channels.map((channel) =>
    selected.has(channel.source) || selected.has(channel.target)
      ? { ...channel, enabled: false }
      : channel,
  )
  const events = result.nodes
    .filter((node) => selected.has(node.id))
    .map((node) => ({
      id: `node-offline-${node.id}-scenario`,
      type: "node-offline" as const,
      title: `${node.name} is offline`,
      description:
        "The previous route may be unavailable. The router will look for an alternative.",
      nodeId: node.id,
    }))
  return { network: result, events }
}

export function unavailableChannels(
  before: PaymentNetwork,
  after: PaymentNetwork,
): PaymentChannel[] {
  const beforeEnabled = new Set(
    before.channels.filter((channel) => channel.enabled).map((channel) => channel.id),
  )
  return after.channels.filter(
    (channel) => beforeEnabled.has(channel.id) && !channel.enabled,
  )
}
