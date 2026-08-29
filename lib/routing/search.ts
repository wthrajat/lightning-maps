import {
  assertValidPaymentRequest,
  buildAdjacency,
  isEndpointAvailable,
} from "../network/graph.ts"
import type { AdjacentChannel, PaymentNetwork } from "../network/types.ts"
import { calculateRouteMetrics } from "./scoring.ts"
import type {
  PaymentRoute,
  RouteRequest,
  RoutingPreset,
  RoutingStrategy,
  RoutingWeights,
} from "./types.ts"

type PathRecord = {
  nodeId: string
  cost: number
  pathKey: string
}

type PreviousStep = {
  nodeId: string
  channelId: string
}

function takeLowestCost(queue: PathRecord[]): PathRecord | undefined {
  queue.sort(
    (first, second) =>
      first.cost - second.cost ||
      first.pathKey.localeCompare(second.pathKey) ||
      first.nodeId.localeCompare(second.nodeId),
  )
  return queue.shift()
}

function reconstructRoute(
  network: PaymentNetwork,
  request: RouteRequest,
  strategy: RoutingStrategy,
  previous: Map<string, PreviousStep>,
  preset?: RoutingPreset,
  weights?: RoutingWeights,
): PaymentRoute | null {
  if (request.source !== request.target && !previous.has(request.target)) {
    return null
  }

  const nodeIds = [request.target]
  const channelIds: string[] = []
  let cursor = request.target
  while (cursor !== request.source) {
    const step = previous.get(cursor)
    if (!step) return null
    channelIds.unshift(step.channelId)
    nodeIds.unshift(step.nodeId)
    cursor = step.nodeId
  }

  const routeKey = nodeIds.join("-")
  return {
    id: `${strategy}-${routeKey}-${request.amount}`,
    strategy,
    preset,
    source: request.source,
    target: request.target,
    amount: request.amount,
    nodeIds,
    channelIds,
    metrics: calculateRouteMetrics(network, channelIds, request.amount, weights),
  }
}

export function findWeightedRoute(
  network: PaymentNetwork,
  request: RouteRequest,
  strategy: RoutingStrategy,
  edgeCost: (edge: AdjacentChannel) => number,
  preset?: RoutingPreset,
  weights?: RoutingWeights,
): PaymentRoute | null {
  assertValidPaymentRequest(
    network,
    request.source,
    request.target,
    request.amount,
  )
  if (
    !isEndpointAvailable(network, request.source) ||
    !isEndpointAvailable(network, request.target)
  ) {
    return null
  }

  const adjacency = buildAdjacency(network, request.amount, true)
  const distances = new Map<string, number>([[request.source, 0]])
  const pathKeys = new Map<string, string>([[request.source, request.source]])
  const previous = new Map<string, PreviousStep>()
  const queue: PathRecord[] = [
    { nodeId: request.source, cost: 0, pathKey: request.source },
  ]

  while (queue.length > 0) {
    const current = takeLowestCost(queue)
    if (!current) break
    if (current.cost > (distances.get(current.nodeId) ?? Number.POSITIVE_INFINITY)) {
      continue
    }
    if (current.nodeId === request.target) break

    for (const edge of adjacency.get(current.nodeId) ?? []) {
      const candidateCost = current.cost + edgeCost(edge)
      const candidatePathKey = `${current.pathKey}>${edge.to}`
      const knownCost = distances.get(edge.to) ?? Number.POSITIVE_INFINITY
      const knownPathKey = pathKeys.get(edge.to) ?? "\uffff"
      const isBetter = candidateCost < knownCost - Number.EPSILON
      const isDeterministicTie =
        Math.abs(candidateCost - knownCost) <= Number.EPSILON &&
        candidatePathKey.localeCompare(knownPathKey) < 0

      if (isBetter || isDeterministicTie) {
        distances.set(edge.to, candidateCost)
        pathKeys.set(edge.to, candidatePathKey)
        previous.set(edge.to, {
          nodeId: current.nodeId,
          channelId: edge.channel.id,
        })
        queue.push({
          nodeId: edge.to,
          cost: candidateCost,
          pathKey: candidatePathKey,
        })
      }
    }
  }

  return reconstructRoute(
    network,
    request,
    strategy,
    previous,
    preset,
    weights,
  )
}
