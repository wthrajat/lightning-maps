import type { PaymentNetwork } from "../network/types.ts"
import type { RouteRequest, RoutingPreset } from "../routing/types.ts"

export type NetworkEventType =
  | "node-offline"
  | "channel-disabled"
  | "liquidity-reduced"
  | "congestion"

export type NetworkEvent = {
  id: string
  type: NetworkEventType
  title: string
  description: string
  nodeId?: string
  channelId?: string
}

export type NetworkConditions = {
  nodeFailureRate?: number
  channelFailureRate?: number
  liquidityReduction?: number
  congestion?: number
  seed?: number
  protectedNodeIds?: string[]
}

export type NetworkSimulationResult = {
  network: PaymentNetwork
  events: NetworkEvent[]
  conditions: Required<Omit<NetworkConditions, "protectedNodeIds">> & {
    protectedNodeIds: string[]
  }
}

export type ScenarioId =
  | "normal"
  | "cheapest-isnt-best"
  | "large-payment"
  | "major-node-failure"
  | "network-congestion"
  | "high-reliability"

export type ScenarioDefinition = {
  id: ScenarioId
  name: string
  shortName: string
  description: string
  lesson: string
  request: RouteRequest & { preset: RoutingPreset }
  conditions: NetworkConditions
  disabledNodeIds?: string[]
}

export type AppliedScenario = {
  definition: ScenarioDefinition
  request: RouteRequest & { preset: RoutingPreset }
  network: PaymentNetwork
  events: NetworkEvent[]
}

export type PaymentStepState =
  | "initiated"
  | "forwarded"
  | "received"
  | "failed"

export type PaymentStep = {
  index: number
  nodeId: string
  nodeName: string
  state: PaymentStepState
  scheduledAtMs: number
  channelId?: string
  message: string
}

export type PaymentSimulation = {
  id: string
  status: "success" | "failed"
  amount: number
  routeId: string
  steps: PaymentStep[]
  durationMs: number
  failureReason?:
    | "channel-unavailable"
    | "insufficient-liquidity"
    | "simulated-forwarding-failure"
}

export type PaymentSimulationOptions = {
  seed?: number
  outcome?: "estimated" | "success" | "failure"
  stepDurationMs?: number
}
