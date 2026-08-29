export type RoutingStrategy = "shortest" | "cheapest" | "intelligent"
export type RoutingPreset = "cheapest" | "most-reliable" | "balanced"

export type RoutingWeights = {
  fee: number
  reliability: number
  liquidity: number
  hops: number
  latency: number
}

export type RouteRequest = {
  source: string
  target: string
  amount: number
  preset?: RoutingPreset
}

export type RouteMetrics = {
  hops: number
  totalFee: number
  minimumLiquidity: number
  liquidityHeadroom: number
  reliability: number
  estimatedSuccess: number
  latencyMs: number
  overallScore: number
}

export type PaymentRoute = {
  id: string
  strategy: RoutingStrategy
  preset?: RoutingPreset
  source: string
  target: string
  amount: number
  nodeIds: string[]
  channelIds: string[]
  metrics: RouteMetrics
}

export type RouteExplanation = {
  title: string
  summary: string
  strengths: string[]
  tradeoffs: string[]
}

export type NoRouteReason =
  | "invalid-endpoint"
  | "endpoint-offline"
  | "insufficient-liquidity"
  | "network-disconnected"

export type RouteComparison = {
  request: Required<RouteRequest>
  routes: PaymentRoute[]
  recommended: PaymentRoute | null
  shortest: PaymentRoute | null
  cheapest: PaymentRoute | null
  intelligent: PaymentRoute | null
  explanation: RouteExplanation | null
  noRouteReason: NoRouteReason | null
}
