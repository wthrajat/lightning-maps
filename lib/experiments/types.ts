import type { RoutingStrategy } from "../routing/types.ts"

export type ExperimentConfig = {
  iterations?: number
  seed?: number
  networkSize?: number
  failureRate?: number
  paymentAmount?: number
  algorithms?: RoutingStrategy[]
}

export type AlgorithmExperimentResult = {
  algorithm: RoutingStrategy
  attempts: number
  routesFound: number
  successful: number
  failed: number
  successRate: number
  averageFee: number
  averageHops: number
  averageLatencyMs: number
}

export type ExperimentResult = {
  id: string
  config: Required<ExperimentConfig>
  algorithms: AlgorithmExperimentResult[]
  totalSimulatedPayments: number
  synthetic: true
}
