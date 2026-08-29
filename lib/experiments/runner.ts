import { DEFAULT_NETWORK } from "../../data/network.ts"
import { generatePaymentNetwork } from "../network/generator.ts"
import type { PaymentNetwork } from "../network/types.ts"
import { findRoute } from "../routing/compare.ts"
import type { RoutingStrategy } from "../routing/types.ts"
import { simulateNetworkConditions } from "../simulation/failures.ts"
import { createSeededRandom, stableHash } from "../utils/random.ts"
import type {
  AlgorithmExperimentResult,
  ExperimentConfig,
  ExperimentResult,
} from "./types.ts"

const DEFAULT_ALGORITHMS: RoutingStrategy[] = [
  "shortest",
  "cheapest",
  "intelligent",
]

type MutableAlgorithmResult = Omit<
  AlgorithmExperimentResult,
  "successRate" | "averageFee" | "averageHops" | "averageLatencyMs"
> & {
  totalFee: number
  totalHops: number
  totalLatencyMs: number
}

const round = (value: number, places = 2) => {
  const multiplier = 10 ** places
  return Math.round(value * multiplier) / multiplier
}

function normalizeConfig(config: ExperimentConfig): Required<ExperimentConfig> {
  const algorithms = config.algorithms?.length
    ? [...new Set(config.algorithms)]
    : DEFAULT_ALGORITHMS
  const normalized = {
    iterations: config.iterations ?? 1_000,
    seed: config.seed ?? 7_301,
    networkSize: config.networkSize ?? DEFAULT_NETWORK.nodes.length,
    failureRate: config.failureRate ?? 0.05,
    paymentAmount: config.paymentAmount ?? 50_000,
    algorithms,
  }
  if (
    !Number.isInteger(normalized.iterations) ||
    normalized.iterations < 1 ||
    normalized.iterations > 10_000
  ) {
    throw new Error("Experiment iterations must be between 1 and 10,000.")
  }
  if (normalized.paymentAmount <= 0) {
    throw new Error("Experiment payment amount must be positive.")
  }
  return normalized
}

function experimentNetwork(
  suppliedNetwork: PaymentNetwork,
  config: Required<ExperimentConfig>,
): PaymentNetwork {
  if (suppliedNetwork.nodes.length === config.networkSize) return suppliedNetwork
  return generatePaymentNetwork({
    nodeCount: config.networkSize,
    seed: suppliedNetwork.metadata.seed,
  })
}

function finalize(result: MutableAlgorithmResult): AlgorithmExperimentResult {
  return {
    algorithm: result.algorithm,
    attempts: result.attempts,
    routesFound: result.routesFound,
    successful: result.successful,
    failed: result.failed,
    successRate: round(result.successful / result.attempts),
    averageFee: result.successful
      ? round(result.totalFee / result.successful)
      : 0,
    averageHops: result.successful
      ? round(result.totalHops / result.successful)
      : 0,
    averageLatencyMs: result.successful
      ? round(result.totalLatencyMs / result.successful)
      : 0,
  }
}

export function runExperiment(
  config: ExperimentConfig = {},
  suppliedNetwork: PaymentNetwork = DEFAULT_NETWORK,
): ExperimentResult {
  const normalized = normalizeConfig(config)
  const baseNetwork = experimentNetwork(suppliedNetwork, normalized)
  const random = createSeededRandom(normalized.seed)
  const totals = new Map<RoutingStrategy, MutableAlgorithmResult>(
    normalized.algorithms.map((algorithm) => [
      algorithm,
      {
        algorithm,
        attempts: 0,
        routesFound: 0,
        successful: 0,
        failed: 0,
        totalFee: 0,
        totalHops: 0,
        totalLatencyMs: 0,
      },
    ]),
  )

  for (let iteration = 0; iteration < normalized.iterations; iteration += 1) {
    const sourceIndex = random.integer(0, baseNetwork.nodes.length - 1)
    let targetIndex = random.integer(0, baseNetwork.nodes.length - 2)
    if (targetIndex >= sourceIndex) targetIndex += 1
    const source = baseNetwork.nodes[sourceIndex]!.id
    const target = baseNetwork.nodes[targetIndex]!.id
    const conditions = simulateNetworkConditions(baseNetwork, {
      nodeFailureRate: normalized.failureRate * 0.4,
      channelFailureRate: normalized.failureRate * 0.6,
      seed: normalized.seed + iteration * 17,
      protectedNodeIds: [source, target],
    })
    const outcomeRoll = random.next()

    for (const algorithm of normalized.algorithms) {
      const result = totals.get(algorithm)!
      result.attempts += 1
      const route = findRoute(
        conditions.network,
        {
          source,
          target,
          amount: normalized.paymentAmount,
          preset: "balanced",
        },
        algorithm,
      )
      if (!route) {
        result.failed += 1
        continue
      }

      result.routesFound += 1
      const successful = outcomeRoll <= route.metrics.estimatedSuccess
      if (!successful) {
        result.failed += 1
        continue
      }

      result.successful += 1
      result.totalFee += route.metrics.totalFee
      result.totalHops += route.metrics.hops
      result.totalLatencyMs += route.metrics.latencyMs
    }
  }

  const algorithms = normalized.algorithms.map((algorithm) =>
    finalize(totals.get(algorithm)!),
  )
  return {
    id: `experiment-${stableHash(JSON.stringify(normalized))}`,
    config: normalized,
    algorithms,
    totalSimulatedPayments:
      normalized.iterations * normalized.algorithms.length,
    synthetic: true,
  }
}
