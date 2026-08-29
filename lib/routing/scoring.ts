import { getChannel, getChannelFee } from "../network/graph.ts"
import type { PaymentChannel, PaymentNetwork } from "../network/types.ts"
import type {
  PaymentRoute,
  RouteMetrics,
  RoutingPreset,
  RoutingWeights,
} from "./types.ts"

export const ROUTING_PRESETS: Readonly<Record<RoutingPreset, RoutingWeights>> = {
  cheapest: {
    fee: 0.6,
    reliability: 0.15,
    liquidity: 0.1,
    hops: 0.1,
    latency: 0.05,
  },
  "most-reliable": {
    fee: 0.1,
    reliability: 0.55,
    liquidity: 0.2,
    hops: 0.1,
    latency: 0.05,
  },
  balanced: {
    fee: 0.25,
    reliability: 0.3,
    liquidity: 0.2,
    hops: 0.15,
    latency: 0.1,
  },
}

export const ROUTING_MODEL_NOTICE =
  "This is a deterministic simulation model, not a production Lightning routing algorithm."

const round = (value: number, places = 4) => {
  const multiplier = 10 ** places
  return Math.round(value * multiplier) / multiplier
}

function routeChannels(
  network: PaymentNetwork,
  channelIds: readonly string[],
): PaymentChannel[] {
  return channelIds.map((channelId) => {
    const channel = getChannel(network, channelId)
    if (!channel) {
      throw new Error(`Route references unknown channel: ${channelId}`)
    }
    return channel
  })
}

export function getIntelligentEdgeCost(
  channel: PaymentChannel,
  amount: number,
  weights: RoutingWeights,
): number {
  const fee = getChannelFee(channel, amount)
  const feeReference = Math.max(12, 10 + amount / 5_000)
  const feePenalty = Math.min(fee / feeReference, 3)
  const reliabilityPenalty = -Math.log(Math.max(channel.reliability, 0.001)) * 8
  const liquidityPenalty = Math.min(amount / channel.availableLiquidity, 1)
  const hopPenalty = 0.12
  const latencyPenalty = Math.min(channel.latencyMs / 120, 2)

  return (
    weights.fee * feePenalty +
    weights.reliability * reliabilityPenalty +
    weights.liquidity * liquidityPenalty +
    weights.hops * hopPenalty +
    weights.latency * latencyPenalty
  )
}

export function calculateRouteMetrics(
  network: PaymentNetwork,
  channelIds: readonly string[],
  amount: number,
  weights: RoutingWeights = ROUTING_PRESETS.balanced,
): RouteMetrics {
  const channels = routeChannels(network, channelIds)
  const hops = channels.length
  const totalFee = channels.reduce(
    (total, channel) => total + getChannelFee(channel, amount),
    0,
  )
  const minimumLiquidity = channels.length
    ? Math.min(...channels.map((channel) => channel.availableLiquidity))
    : amount
  const reliability = channels.reduce(
    (probability, channel) => probability * channel.reliability,
    1,
  )
  const latencyMs = channels.reduce(
    (latency, channel) => latency + channel.latencyMs,
    0,
  )
  const liquidityHeadroom = Math.max(0, minimumLiquidity - amount)
  const headroomRatio = minimumLiquidity > 0
    ? Math.min(liquidityHeadroom / Math.max(amount, 1), 4) / 4
    : 0
  const liquidityConfidence = 0.88 + headroomRatio * 0.1
  const estimatedSuccess = channels.length === 0
    ? 1
    : Math.min(0.999, reliability * liquidityConfidence)
  const overallScore = channels.reduce(
    (score, channel) => score + getIntelligentEdgeCost(channel, amount, weights),
    0,
  )

  return {
    hops,
    totalFee: round(totalFee, 2),
    minimumLiquidity,
    liquidityHeadroom,
    reliability: round(reliability),
    estimatedSuccess: round(estimatedSuccess),
    latencyMs,
    overallScore: round(overallScore),
  }
}

export function rescoreRoute(
  network: PaymentNetwork,
  route: PaymentRoute,
  preset: RoutingPreset,
): PaymentRoute {
  return {
    ...route,
    preset,
    metrics: calculateRouteMetrics(
      network,
      route.channelIds,
      route.amount,
      ROUTING_PRESETS[preset],
    ),
  }
}
