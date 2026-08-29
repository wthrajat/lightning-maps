import type { PaymentNetwork } from "../network/types.ts"
import { getIntelligentEdgeCost, ROUTING_PRESETS } from "./scoring.ts"
import { findWeightedRoute } from "./search.ts"
import type { PaymentRoute, RouteRequest } from "./types.ts"

/**
 * A deterministic educational scoring model, not a production Lightning router.
 */
export function findIntelligentRoute(
  network: PaymentNetwork,
  request: RouteRequest,
): PaymentRoute | null {
  const preset = request.preset ?? "balanced"
  const weights = ROUTING_PRESETS[preset]
  return findWeightedRoute(
    network,
    request,
    "intelligent",
    ({ channel }) => getIntelligentEdgeCost(channel, request.amount, weights),
    preset,
    weights,
  )
}
