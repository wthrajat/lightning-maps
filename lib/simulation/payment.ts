import {
  getChannel,
  getChannelEligibility,
  getNode,
} from "../network/graph.ts"
import type { PaymentNetwork } from "../network/types.ts"
import type { PaymentRoute } from "../routing/types.ts"
import { createSeededRandom, stableHash } from "../utils/random.ts"
import type {
  PaymentSimulation,
  PaymentSimulationOptions,
  PaymentStep,
} from "./types.ts"

function nodeName(network: PaymentNetwork, nodeId: string): string {
  return getNode(network, nodeId)?.name ?? nodeId
}

function failureSimulation(
  route: PaymentRoute,
  steps: PaymentStep[],
  reason: NonNullable<PaymentSimulation["failureReason"]>,
): PaymentSimulation {
  return {
    id: `payment-${stableHash(`${route.id}:${reason}`)}`,
    status: "failed",
    amount: route.amount,
    routeId: route.id,
    steps,
    durationMs: steps.at(-1)?.scheduledAtMs ?? 0,
    failureReason: reason,
  }
}

export function simulatePayment(
  network: PaymentNetwork,
  route: PaymentRoute,
  options: PaymentSimulationOptions = {},
): PaymentSimulation {
  const stepDurationMs = Math.max(100, options.stepDurationMs ?? 650)
  const random = createSeededRandom(options.seed ?? stableHash(route.id))
  const steps: PaymentStep[] = [
    {
      index: 0,
      nodeId: route.source,
      nodeName: nodeName(network, route.source),
      state: "initiated",
      scheduledAtMs: 0,
      message: "Test payment initiated",
    },
  ]

  for (let index = 0; index < route.channelIds.length; index += 1) {
    const channelId = route.channelIds[index]!
    const nextNodeId = route.nodeIds[index + 1]!
    const channel = getChannel(network, channelId)
    const scheduledAtMs = (index + 1) * stepDurationMs

    if (!channel) {
      steps.push({
        index: index + 1,
        nodeId: nextNodeId,
        nodeName: nodeName(network, nextNodeId),
        state: "failed",
        scheduledAtMs,
        channelId,
        message: "Connection is unavailable",
      })
      return failureSimulation(route, steps, "channel-unavailable")
    }

    const eligibility = getChannelEligibility(network, channel, route.amount)
    if (!eligibility.eligible) {
      const reason = eligibility.reason === "insufficient-liquidity"
        ? "insufficient-liquidity"
        : "channel-unavailable"
      steps.push({
        index: index + 1,
        nodeId: nextNodeId,
        nodeName: nodeName(network, nextNodeId),
        state: "failed",
        scheduledAtMs,
        channelId,
        message:
          reason === "insufficient-liquidity"
            ? "Not enough simulated liquidity"
            : "Connection is unavailable",
      })
      return failureSimulation(route, steps, reason)
    }

    const shouldFail =
      options.outcome === "failure" ||
      (options.outcome !== "success" && random.next() > channel.reliability)
    if (shouldFail) {
      steps.push({
        index: index + 1,
        nodeId: nextNodeId,
        nodeName: nodeName(network, nextNodeId),
        state: "failed",
        scheduledAtMs,
        channelId,
        message: "Simulated forwarding attempt failed",
      })
      return failureSimulation(route, steps, "simulated-forwarding-failure")
    }

    const isDestination = index === route.channelIds.length - 1
    steps.push({
      index: index + 1,
      nodeId: nextNodeId,
      nodeName: nodeName(network, nextNodeId),
      state: isDestination ? "received" : "forwarded",
      scheduledAtMs,
      channelId,
      message: isDestination ? "Payment received" : "Payment forwarded",
    })
  }

  return {
    id: `payment-${stableHash(`${route.id}:${options.seed ?? "default"}`)}`,
    status: "success",
    amount: route.amount,
    routeId: route.id,
    steps,
    durationMs: steps.at(-1)?.scheduledAtMs ?? 0,
  }
}
