import { getChannelFee } from "../network/graph.ts"
import type { PaymentNetwork } from "../network/types.ts"
import { findWeightedRoute } from "./search.ts"
import type { PaymentRoute, RouteRequest } from "./types.ts"

export function findCheapestRoute(
  network: PaymentNetwork,
  request: RouteRequest,
): PaymentRoute | null {
  return findWeightedRoute(network, request, "cheapest", ({ channel }) =>
    getChannelFee(channel, request.amount),
  )
}
