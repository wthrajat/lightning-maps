import assert from "node:assert/strict"
import test from "node:test"

import { DEFAULT_NETWORK } from "../data/network.ts"
import { runExperiment } from "../lib/experiments/runner.ts"
import {
  calculateBottlenecks,
  calculateNetworkStats,
  compareNetworkImpact,
} from "../lib/metrics/network.ts"
import { applyNodeFailures } from "../lib/simulation/failures.ts"

test("network statistics are calculated from the synthetic graph", () => {
  const stats = calculateNetworkStats(DEFAULT_NETWORK)
  assert.equal(stats.nodeCount, 50)
  assert.equal(stats.channelCount, DEFAULT_NETWORK.channels.length)
  assert.equal(stats.activeNodes, 50)
  assert.ok(stats.totalLiquidity > 0)
  assert.ok(stats.averageReliability > 0.9)
  assert.ok(stats.networkDensity > 0 && stats.networkDensity < 1)
})

test("betweenness analysis identifies deliberate hubs", () => {
  const bottlenecks = calculateBottlenecks(DEFAULT_NETWORK, 5)
  assert.equal(bottlenecks.length, 5)
  assert.ok(bottlenecks[0]!.betweennessCentrality > 0)
  assert.ok(bottlenecks.some((entry) => entry.nodeId === "central-hub"))
})

test("network impact reports losses after node failures", () => {
  const changed = applyNodeFailures(DEFAULT_NETWORK, 0.1, 19).network
  const impact = compareNetworkImpact(DEFAULT_NETWORK, changed)
  assert.equal(impact.changes.activeNodes, -5)
  assert.ok(impact.changes.enabledChannels < 0)
})

test("experiment runner is repeatable and aggregates every strategy", () => {
  const config = {
    iterations: 40,
    seed: 601,
    failureRate: 0.08,
    paymentAmount: 90_000,
  }
  const first = runExperiment(config)
  const second = runExperiment(config)
  assert.deepEqual(first, second)
  assert.equal(first.algorithms.length, 3)
  assert.equal(first.totalSimulatedPayments, 120)
  assert.equal(
    first.algorithms.every(
      (result) =>
        result.attempts === 40 &&
        result.successful + result.failed === result.attempts,
    ),
    true,
  )
})
