import type { PaymentNetwork } from "../network/types.ts"
import { findWeightedRoute } from "./search.ts"
import type { PaymentRoute, RouteRequest } from "./types.ts"

export function findShortestRoute(
  network: PaymentNetwork,
  request: RouteRequest,
): PaymentRoute | null {
  return findWeightedRoute(network, request, "shortest", () => 1)
}
