import { buildAdjacency } from "../network/graph.ts"
import type { PaymentNetwork } from "../network/types.ts"
import type {
  BottleneckMetric,
  NetworkImpact,
  NetworkStats,
} from "./types.ts"

const round = (value: number, places = 4) => {
  const multiplier = 10 ** places
  return Math.round(value * multiplier) / multiplier
}

export function calculateNetworkStats(network: PaymentNetwork): NetworkStats {
  const nodeCount = network.nodes.length
  const channelCount = network.channels.length
  const activeNodes = network.nodes.filter((node) => node.online).length
  const enabledChannels = network.channels.filter(
    (channel) => channel.enabled,
  ).length
  const possibleChannels = (nodeCount * (nodeCount - 1)) / 2
  const averageReliability = channelCount
    ? network.channels.reduce(
        (total, channel) => total + channel.reliability,
        0,
      ) / channelCount
    : 0
  const mostConnected = [...network.nodes]
    .sort(
      (first, second) =>
        second.connectionCount - first.connectionCount ||
        first.name.localeCompare(second.name),
    )
    .slice(0, 5)
    .map((node) => ({
      nodeId: node.id,
      name: node.name,
      connections: node.connectionCount,
    }))

  return {
    nodeCount,
    channelCount,
    activeNodes,
    inactiveNodes: nodeCount - activeNodes,
    enabledChannels,
    disabledChannels: channelCount - enabledChannels,
    totalCapacity: network.channels.reduce(
      (total, channel) => total + channel.capacity,
      0,
    ),
    totalLiquidity: network.channels.reduce(
      (total, channel) => total + channel.availableLiquidity,
      0,
    ),
    averageReliability: round(averageReliability),
    networkDensity: possibleChannels
      ? round(enabledChannels / possibleChannels)
      : 0,
    averageConnections: nodeCount
      ? round((2 * enabledChannels) / nodeCount, 2)
      : 0,
    mostConnected,
  }
}

function calculateBetweenness(network: PaymentNetwork): Map<string, number> {
  const onlineNodeIds = network.nodes
    .filter((node) => node.online)
    .map((node) => node.id)
  const adjacency = buildAdjacency(network, 0, true)
  const centrality = new Map<string, number>(
    onlineNodeIds.map((nodeId) => [nodeId, 0] as const),
  )

  for (const source of onlineNodeIds) {
    const stack: string[] = []
    const predecessors = new Map(
      onlineNodeIds.map((nodeId) => [nodeId, [] as string[]] as const),
    )
    const paths = new Map<string, number>(
      onlineNodeIds.map((nodeId) => [nodeId, 0] as const),
    )
    const distance = new Map<string, number>(
      onlineNodeIds.map((nodeId) => [nodeId, -1] as const),
    )
    paths.set(source, 1)
    distance.set(source, 0)
    const queue = [source]

    while (queue.length > 0) {
      const current = queue.shift()!
      stack.push(current)
      for (const edge of adjacency.get(current) ?? []) {
        if ((distance.get(edge.to) ?? -1) < 0) {
          distance.set(edge.to, (distance.get(current) ?? 0) + 1)
          queue.push(edge.to)
        }
        if (distance.get(edge.to) === (distance.get(current) ?? 0) + 1) {
          paths.set(
            edge.to,
            (paths.get(edge.to) ?? 0) + (paths.get(current) ?? 0),
          )
          predecessors.get(edge.to)?.push(current)
        }
      }
    }

    const dependency = new Map<string, number>(
      onlineNodeIds.map((nodeId) => [nodeId, 0] as const),
    )
    while (stack.length > 0) {
      const nodeId = stack.pop()!
      for (const predecessor of predecessors.get(nodeId) ?? []) {
        const pathCount = paths.get(nodeId) ?? 0
        if (pathCount === 0) continue
        const contribution =
          ((paths.get(predecessor) ?? 0) / pathCount) *
          (1 + (dependency.get(nodeId) ?? 0))
        dependency.set(
          predecessor,
          (dependency.get(predecessor) ?? 0) + contribution,
        )
      }
      if (nodeId !== source) {
        centrality.set(
          nodeId,
          (centrality.get(nodeId) ?? 0) + (dependency.get(nodeId) ?? 0),
        )
      }
    }
  }

  const denominator = (onlineNodeIds.length - 1) * (onlineNodeIds.length - 2)
  for (const [nodeId, rawScore] of centrality) {
    const undirectedScore = rawScore / 2
    centrality.set(
      nodeId,
      denominator > 0 ? (2 * undirectedScore) / denominator : 0,
    )
  }
  return centrality
}

export function calculateBottlenecks(
  network: PaymentNetwork,
  limit = 5,
): BottleneckMetric[] {
  const centrality = calculateBetweenness(network)
  return network.nodes
    .filter((node) => node.online)
    .map((node) => {
      const score = round(centrality.get(node.id) ?? 0)
      const risk = score >= 0.15
        ? "high"
        : score >= 0.06
          ? "moderate"
          : "low"
      return {
        nodeId: node.id,
        name: node.name,
        connections: node.connectionCount,
        betweennessCentrality: score,
        risk,
        explanation:
          risk === "high"
            ? "Many shortest routes pass through this participant. Its loss could lengthen or block payments."
            : risk === "moderate"
              ? "This participant connects several parts of the simulated network."
              : "Few shortest routes depend on this participant.",
      } satisfies BottleneckMetric
    })
    .sort(
      (first, second) =>
        second.betweennessCentrality - first.betweennessCentrality ||
        second.connections - first.connections ||
        first.name.localeCompare(second.name),
    )
    .slice(0, Math.max(0, limit))
}

export function compareNetworkImpact(
  beforeNetwork: PaymentNetwork,
  afterNetwork: PaymentNetwork,
): NetworkImpact {
  const before = calculateNetworkStats(beforeNetwork)
  const after = calculateNetworkStats(afterNetwork)
  return {
    before,
    after,
    changes: {
      activeNodes: after.activeNodes - before.activeNodes,
      enabledChannels: after.enabledChannels - before.enabledChannels,
      totalLiquidity: after.totalLiquidity - before.totalLiquidity,
      averageReliability: round(
        after.averageReliability - before.averageReliability,
      ),
      networkDensity: round(after.networkDensity - before.networkDensity),
    },
  }
}
