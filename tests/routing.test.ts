import assert from "node:assert/strict"
import test from "node:test"

import { DEFAULT_NETWORK } from "../data/network.ts"
import { generatePaymentNetwork } from "../lib/network/generator.ts"
import type { PaymentNetwork } from "../lib/network/types.ts"
import {
  compareRoutes,
  findCheapestRoute,
  findIntelligentRoute,
  findShortestRoute,
} from "../lib/routing/index.ts"

const DEFAULT_REQUEST = {
  source: "alice",
  target: "bob",
  amount: 50_000,
  preset: "balanced" as const,
}

function disconnectedNetwork(): PaymentNetwork {
  return {
    metadata: {
      ...DEFAULT_NETWORK.metadata,
      id: "disconnected-test",
    },
    nodes: DEFAULT_NETWORK.nodes
      .filter((node) => ["alice", "bob"].includes(node.id))
      .map((node) => ({ ...node, connectionCount: 0 })),
    channels: [],
  }
}

test("default network is deterministic with stable visual positions", () => {
  const regenerated = generatePaymentNetwork()
  assert.equal(DEFAULT_NETWORK.nodes.length, 50)
  assert.ok(DEFAULT_NETWORK.channels.length >= 80)
  assert.deepEqual(regenerated, DEFAULT_NETWORK)
  assert.ok(
    DEFAULT_NETWORK.nodes.every(
      (node) => Number.isFinite(node.position.x) && Number.isFinite(node.position.y),
    ),
  )
})

test("shortest route minimizes hop count", () => {
  const route = findShortestRoute(DEFAULT_NETWORK, DEFAULT_REQUEST)
  assert.ok(route)
  assert.deepEqual(route.nodeIds, ["alice", "charlie", "bob"])
  assert.equal(route.metrics.hops, 2)
})

test("cheapest route minimizes forwarding fees", () => {
  const cheapest = findCheapestRoute(DEFAULT_NETWORK, DEFAULT_REQUEST)
  const shortest = findShortestRoute(DEFAULT_NETWORK, DEFAULT_REQUEST)
  assert.ok(cheapest)
  assert.ok(shortest)
  assert.deepEqual(cheapest.nodeIds, [
    "alice",
    "diana",
    "ethan",
    "hannah",
    "bob",
  ])
  assert.ok(cheapest.metrics.totalFee < shortest.metrics.totalFee)
})

test("balanced intelligent routing trades a small fee for reliability", () => {
  const intelligent = findIntelligentRoute(DEFAULT_NETWORK, DEFAULT_REQUEST)
  const cheapest = findCheapestRoute(DEFAULT_NETWORK, DEFAULT_REQUEST)
  assert.ok(intelligent)
  assert.ok(cheapest)
  assert.deepEqual(intelligent.nodeIds, [
    "alice",
    "charlie",
    "frank",
    "bob",
  ])
  assert.ok(
    intelligent.metrics.estimatedSuccess > cheapest.metrics.estimatedSuccess,
  )
  assert.ok(intelligent.metrics.totalFee > cheapest.metrics.totalFee)
})

test("most-reliable preset selects a different high-quality route", () => {
  const balanced = findIntelligentRoute(DEFAULT_NETWORK, DEFAULT_REQUEST)
  const reliable = findIntelligentRoute(DEFAULT_NETWORK, {
    ...DEFAULT_REQUEST,
    preset: "most-reliable",
  })
  assert.ok(balanced)
  assert.ok(reliable)
  assert.notDeepEqual(reliable.nodeIds, balanced.nodeIds)
  assert.ok(reliable.metrics.reliability > balanced.metrics.reliability)
})

test("route comparison exposes three strategies and a plain-language reason", () => {
  const comparison = compareRoutes(DEFAULT_NETWORK, DEFAULT_REQUEST)
  assert.equal(comparison.routes.length, 3)
  assert.equal(comparison.recommended?.strategy, "intelligent")
  assert.match(comparison.explanation?.summary ?? "", /balances fee/i)
  assert.equal(comparison.noRouteReason, null)
})

test("payment amount removes channels with insufficient liquidity", () => {
  const largeRoute = findShortestRoute(DEFAULT_NETWORK, {
    ...DEFAULT_REQUEST,
    amount: 1_100_000,
  })
  assert.ok(largeRoute)
  assert.notDeepEqual(largeRoute.nodeIds, ["alice", "charlie", "bob"])
  assert.ok(largeRoute.metrics.minimumLiquidity >= 1_100_000)
})

test("unaffordable payment reports an insufficient-liquidity no-route state", () => {
  const comparison = compareRoutes(DEFAULT_NETWORK, {
    ...DEFAULT_REQUEST,
    amount: 100_000_000,
  })
  assert.equal(comparison.recommended, null)
  assert.equal(comparison.noRouteReason, "insufficient-liquidity")
})

test("offline endpoint cannot be routed", () => {
  const offline: PaymentNetwork = {
    ...DEFAULT_NETWORK,
    nodes: DEFAULT_NETWORK.nodes.map((node) =>
      node.id === "alice" ? { ...node, online: false } : node,
    ),
  }
  assert.equal(findShortestRoute(offline, DEFAULT_REQUEST), null)
})

test("disconnected nodes return no route without looping", () => {
  const route = findIntelligentRoute(disconnectedNetwork(), DEFAULT_REQUEST)
  assert.equal(route, null)
})

test("same-node payment produces an immediate zero-hop route", () => {
  const route = findShortestRoute(DEFAULT_NETWORK, {
    ...DEFAULT_REQUEST,
    target: "alice",
  })
  assert.ok(route)
  assert.deepEqual(route.nodeIds, ["alice"])
  assert.equal(route.metrics.hops, 0)
  assert.equal(route.metrics.estimatedSuccess, 1)
})

test("route comparison reports an invalid endpoint without throwing", () => {
  const comparison = compareRoutes(DEFAULT_NETWORK, {
    ...DEFAULT_REQUEST,
    target: "missing-node",
  })
  assert.equal(comparison.recommended, null)
  assert.equal(comparison.noRouteReason, "invalid-endpoint")
})

test("disabled channels are never selected", () => {
  const disabled: PaymentNetwork = {
    ...DEFAULT_NETWORK,
    channels: DEFAULT_NETWORK.channels.map((channel) =>
      channel.id === "channel-alice--charlie"
        ? { ...channel, enabled: false }
        : channel,
    ),
  }
  const route = findShortestRoute(disabled, DEFAULT_REQUEST)
  assert.ok(route)
  assert.ok(!route.channelIds.includes("channel-alice--charlie"))
})
