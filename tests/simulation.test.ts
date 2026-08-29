import assert from "node:assert/strict"
import test from "node:test"

import { DEFAULT_NETWORK } from "../data/network.ts"
import { SimulationDataProvider } from "../lib/network/provider.ts"
import { findIntelligentRoute } from "../lib/routing/intelligent-route.ts"
import { compareRoutes } from "../lib/routing/compare.ts"
import {
  applyChannelFailures,
  applyNetworkCongestion,
  applyNodeFailures,
  reduceNetworkLiquidity,
  simulateNetworkConditions,
} from "../lib/simulation/failures.ts"
import { simulatePayment } from "../lib/simulation/payment.ts"
import { applyDemoScenario } from "../lib/simulation/scenarios.ts"

const REQUEST = {
  source: "alice",
  target: "bob",
  amount: 50_000,
  preset: "balanced" as const,
}

test("node failure selection is deterministic and leaves input unchanged", () => {
  const first = applyNodeFailures(DEFAULT_NETWORK, 0.1, 44, ["alice", "bob"])
  const second = applyNodeFailures(DEFAULT_NETWORK, 0.1, 44, ["alice", "bob"])
  assert.deepEqual(first, second)
  assert.equal(first.events.length, 5)
  assert.equal(DEFAULT_NETWORK.nodes.every((node) => node.online), true)
  assert.equal(
    first.network.nodes.find((node) => node.id === "alice")?.online,
    true,
  )
  for (const event of first.events) {
    const nodeId = event.nodeId!
    assert.equal(
      first.network.channels
        .filter(
          (channel) => channel.source === nodeId || channel.target === nodeId,
        )
        .every((channel) => !channel.enabled),
      true,
    )
  }
})

test("channel failures disable a deterministic subset", () => {
  const first = applyChannelFailures(DEFAULT_NETWORK, 0.1, 81)
  const second = applyChannelFailures(DEFAULT_NETWORK, 0.1, 81)
  assert.deepEqual(first, second)
  assert.equal(first.events.length, Math.round(DEFAULT_NETWORK.channels.length * 0.1))
  assert.equal(
    first.network.channels.filter((channel) => !channel.enabled).length,
    first.events.length,
  )
})

test("liquidity reduction is proportional, immutable, and reflected on nodes", () => {
  const result = reduceNetworkLiquidity(DEFAULT_NETWORK, 0.4)
  const originalChannel = DEFAULT_NETWORK.channels[0]!
  const changedChannel = result.network.channels[0]!
  assert.equal(
    changedChannel.availableLiquidity,
    Math.floor(originalChannel.availableLiquidity * 0.6),
  )
  assert.notEqual(changedChannel, originalChannel)
  assert.equal(result.events.length, 1)
})

test("congestion raises latency and lowers reliability", () => {
  const result = applyNetworkCongestion(DEFAULT_NETWORK, 0.75)
  const original = DEFAULT_NETWORK.channels[0]!
  const changed = result.network.channels[0]!
  assert.ok(changed.latencyMs > original.latencyMs)
  assert.ok(changed.reliability < original.reliability)
})

test("combined network conditions are repeatable", () => {
  const conditions = {
    nodeFailureRate: 0.05,
    channelFailureRate: 0.08,
    liquidityReduction: 0.2,
    congestion: 0.4,
    seed: 105,
    protectedNodeIds: ["alice", "bob"],
  }
  assert.deepEqual(
    simulateNetworkConditions(DEFAULT_NETWORK, conditions),
    simulateNetworkConditions(DEFAULT_NETWORK, conditions),
  )
})

test("major-node-failure scenario disables Central Hub", () => {
  const scenario = applyDemoScenario(DEFAULT_NETWORK, "major-node-failure")
  assert.equal(
    scenario.network.nodes.find((node) => node.id === "central-hub")?.online,
    false,
  )
  assert.equal(scenario.events[0]?.type, "node-offline")
})

test("prepared congestion and reliability scenarios visibly change routing", () => {
  const normalRoute = compareRoutes(DEFAULT_NETWORK, REQUEST).recommended
  const congested = applyDemoScenario(DEFAULT_NETWORK, "network-congestion")
  const reliable = applyDemoScenario(DEFAULT_NETWORK, "high-reliability")
  const congestedRoute = compareRoutes(
    congested.network,
    congested.request,
  ).recommended
  const reliableRoute = compareRoutes(reliable.network, reliable.request).recommended
  assert.ok(normalRoute)
  assert.ok(congestedRoute)
  assert.ok(reliableRoute)
  assert.notDeepEqual(congestedRoute.nodeIds, normalRoute.nodeIds)
  assert.notDeepEqual(reliableRoute.nodeIds, normalRoute.nodeIds)
})

test("successful payment produces an ordered forwarding timeline", () => {
  const route = findIntelligentRoute(DEFAULT_NETWORK, REQUEST)
  assert.ok(route)
  const payment = simulatePayment(DEFAULT_NETWORK, route, {
    outcome: "success",
    stepDurationMs: 500,
  })
  assert.equal(payment.status, "success")
  assert.equal(payment.steps.length, route.nodeIds.length)
  assert.equal(payment.steps[0]?.state, "initiated")
  assert.equal(payment.steps.at(-1)?.state, "received")
  assert.equal(payment.durationMs, route.metrics.hops * 500)
})

test("payment fails when transformed liquidity no longer supports its route", () => {
  const route = findIntelligentRoute(DEFAULT_NETWORK, REQUEST)
  assert.ok(route)
  const drained = reduceNetworkLiquidity(DEFAULT_NETWORK, 1).network
  const payment = simulatePayment(drained, route, { outcome: "success" })
  assert.equal(payment.status, "failed")
  assert.equal(payment.failureReason, "insufficient-liquidity")
})

test("simulation provider protects its data from caller mutations", async () => {
  const provider = new SimulationDataProvider(DEFAULT_NETWORK)
  const first = await provider.getNetwork()
  first.nodes[0]!.online = false
  const second = await provider.getNetwork()
  assert.equal(second.nodes[0]?.online, true)
})
