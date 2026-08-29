import type { LightningNode, PaymentNetwork } from "../network/types.ts"
import type {
  PaymentRoute,
  RouteExplanation,
  RoutingPreset,
} from "./types.ts"

const percent = (value: number) => `${Math.round(value * 100)}%`
const sats = (value: number) => `${Math.round(value).toLocaleString("en-US")} sats`

function routeNames(
  network: PaymentNetwork,
  route: PaymentRoute,
): LightningNode[] {
  const nodes = new Map(network.nodes.map((node) => [node.id, node]))
  return route.nodeIds.flatMap((nodeId) => {
    const node = nodes.get(nodeId)
    return node ? [node] : []
  })
}

export function formatRoutePath(
  network: PaymentNetwork,
  route: PaymentRoute,
): string {
  return routeNames(network, route)
    .map((node) => node.name)
    .join(" \u2192 ")
}

function presetReason(preset: RoutingPreset | undefined): string {
  if (preset === "cheapest") {
    return "It puts the greatest emphasis on lower routing fees."
  }
  if (preset === "most-reliable") {
    return "It puts the greatest emphasis on dependable channels and liquidity headroom."
  }
  return "It balances fee, reliability, available liquidity, route length, and latency."
}

export function explainRoute(
  network: PaymentNetwork,
  route: PaymentRoute,
): RouteExplanation {
  const metrics = route.metrics
  const strengths = [
    `Every channel can carry the ${sats(route.amount)} test payment.`,
    `Estimated success is ${percent(metrics.estimatedSuccess)} under the simulated conditions.`,
  ]
  const tradeoffs: string[] = []

  if (metrics.hops <= 3) {
    strengths.push(`The route is direct at ${metrics.hops} hops.`)
  } else {
    tradeoffs.push(
      `${metrics.hops} hops create more forwarding steps than a direct route.`,
    )
  }
  if (metrics.reliability < 0.85) {
    tradeoffs.push("One or more channels reduce the combined reliability.")
  }
  if (metrics.liquidityHeadroom < route.amount) {
    tradeoffs.push("Its tightest channel has limited room for a larger payment.")
  } else {
    strengths.push(
      `The tightest channel still has ${sats(metrics.liquidityHeadroom)} of spare simulated liquidity.`,
    )
  }

  return {
    title: "Why this route?",
    summary: `${formatRoutePath(network, route)} costs about ${sats(metrics.totalFee)} across ${metrics.hops} hops. ${presetReason(route.preset)}`,
    strengths,
    tradeoffs,
  }
}

export function explainRouteChoice(
  network: PaymentNetwork,
  recommended: PaymentRoute,
  alternatives: readonly PaymentRoute[],
): RouteExplanation {
  const explanation = explainRoute(network, recommended)
  const cheaper = alternatives.find(
    (route) => route.metrics.totalFee < recommended.metrics.totalFee,
  )
  const shorter = alternatives.find(
    (route) => route.metrics.hops < recommended.metrics.hops,
  )

  if (
    cheaper &&
    cheaper.metrics.estimatedSuccess < recommended.metrics.estimatedSuccess
  ) {
    explanation.tradeoffs.push(
      `A cheaper option saves about ${sats(recommended.metrics.totalFee - cheaper.metrics.totalFee)}, but its estimated success is ${percent(cheaper.metrics.estimatedSuccess)}.`,
    )
  }
  if (
    shorter &&
    shorter.metrics.estimatedSuccess < recommended.metrics.estimatedSuccess
  ) {
    explanation.strengths.push(
      `A shorter option exists, but this route has the stronger simulated success estimate.`,
    )
  }
  return explanation
}
