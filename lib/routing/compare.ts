import {
  buildAdjacency,
  getChannelEligibility,
  getNode,
} from "../network/graph.ts"
import type { PaymentNetwork } from "../network/types.ts"
import { findCheapestRoute } from "./cheapest-path.ts"
import { explainRouteChoice } from "./explanations.ts"
import { findIntelligentRoute } from "./intelligent-route.ts"
import { findShortestRoute } from "./shortest-path.ts"
import type {
  NoRouteReason,
  PaymentRoute,
  RouteComparison,
  RouteRequest,
  RoutingStrategy,
} from "./types.ts"

export function findRoute(
  network: PaymentNetwork,
  request: RouteRequest,
  strategy: RoutingStrategy,
): PaymentRoute | null {
  if (strategy === "shortest") return findShortestRoute(network, request)
  if (strategy === "cheapest") return findCheapestRoute(network, request)
  return findIntelligentRoute(network, request)
}

function determineNoRouteReason(
  network: PaymentNetwork,
  request: RouteRequest,
): NoRouteReason {
  const source = getNode(network, request.source)
  const target = getNode(network, request.target)
  if (!source || !target) return "invalid-endpoint"
  if (!source.online || !target.online) return "endpoint-offline"

  const adjacencyWithoutAmountConstraint = buildAdjacency(network, 0, true)
  const visited = new Set([request.source])
  const queue = [request.source]
  while (queue.length > 0) {
    const current = queue.shift()!
    for (const edge of adjacencyWithoutAmountConstraint.get(current) ?? []) {
      if (visited.has(edge.to)) continue
      visited.add(edge.to)
      queue.push(edge.to)
    }
  }
  if (!visited.has(request.target)) return "network-disconnected"

  const blockedByLiquidity = network.channels.some((channel) => {
    const eligibility = getChannelEligibility(network, channel, request.amount)
    return !eligibility.eligible && eligibility.reason === "insufficient-liquidity"
  })
  return blockedByLiquidity ? "insufficient-liquidity" : "network-disconnected"
}

export function compareRoutes(
  network: PaymentNetwork,
  request: RouteRequest,
): RouteComparison {
  const normalizedRequest: Required<RouteRequest> = {
    ...request,
    preset: request.preset ?? "balanced",
  }

  if (
    !getNode(network, normalizedRequest.source) ||
    !getNode(network, normalizedRequest.target)
  ) {
    return {
      request: normalizedRequest,
      routes: [],
      recommended: null,
      shortest: null,
      cheapest: null,
      intelligent: null,
      explanation: null,
      noRouteReason: "invalid-endpoint",
    }
  }

  const shortest = findShortestRoute(network, normalizedRequest)
  const cheapest = findCheapestRoute(network, normalizedRequest)
  const intelligent = findIntelligentRoute(network, normalizedRequest)
  const routes = [intelligent, cheapest, shortest].filter(
    (route): route is PaymentRoute => route !== null,
  )
  const recommended = intelligent ?? cheapest ?? shortest

  return {
    request: normalizedRequest,
    routes,
    recommended,
    shortest,
    cheapest,
    intelligent,
    explanation: recommended
      ? explainRouteChoice(
          network,
          recommended,
          routes.filter((route) => route.id !== recommended.id),
        )
      : null,
    noRouteReason: recommended ? null : determineNoRouteReason(network, request),
  }
}
