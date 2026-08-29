import type {
  AdjacentChannel,
  LightningNode,
  PaymentChannel,
  PaymentNetwork,
} from "./types.ts"

export type ChannelEligibility =
  | { eligible: true }
  | {
      eligible: false
      reason:
        | "channel-disabled"
        | "insufficient-liquidity"
        | "source-offline"
        | "target-offline"
    }

export function cloneNetwork(network: PaymentNetwork): PaymentNetwork {
  return {
    metadata: { ...network.metadata },
    nodes: network.nodes.map((node) => ({
      ...node,
      position: { ...node.position },
    })),
    channels: network.channels.map((channel) => ({ ...channel })),
  }
}

export function getNode(
  network: PaymentNetwork,
  nodeId: string,
): LightningNode | undefined {
  return network.nodes.find((node) => node.id === nodeId)
}

export function getChannel(
  network: PaymentNetwork,
  channelId: string,
): PaymentChannel | undefined {
  return network.channels.find((channel) => channel.id === channelId)
}

export function getChannelFee(
  channel: PaymentChannel,
  amount: number,
): number {
  return channel.feeBase + (amount * channel.feeRate) / 1_000_000
}

export function getChannelEligibility(
  network: PaymentNetwork,
  channel: PaymentChannel,
  amount: number,
): ChannelEligibility {
  if (!channel.enabled) {
    return { eligible: false, reason: "channel-disabled" }
  }

  const source = getNode(network, channel.source)
  const target = getNode(network, channel.target)
  if (!source?.online) {
    return { eligible: false, reason: "source-offline" }
  }
  if (!target?.online) {
    return { eligible: false, reason: "target-offline" }
  }
  if (channel.availableLiquidity < amount) {
    return { eligible: false, reason: "insufficient-liquidity" }
  }

  return { eligible: true }
}

export function buildAdjacency(
  network: PaymentNetwork,
  amount = 0,
  eligibleOnly = true,
): Map<string, AdjacentChannel[]> {
  const adjacency = new Map<string, AdjacentChannel[]>()
  for (const node of network.nodes) {
    adjacency.set(node.id, [])
  }

  for (const channel of network.channels) {
    if (
      eligibleOnly &&
      !getChannelEligibility(network, channel, amount).eligible
    ) {
      continue
    }

    adjacency.get(channel.source)?.push({
      channel,
      from: channel.source,
      to: channel.target,
    })
    adjacency.get(channel.target)?.push({
      channel,
      from: channel.target,
      to: channel.source,
    })
  }

  for (const neighbors of adjacency.values()) {
    neighbors.sort((first, second) => {
      const byTarget = first.to.localeCompare(second.to)
      return byTarget || first.channel.id.localeCompare(second.channel.id)
    })
  }

  return adjacency
}

export function findChannelBetween(
  network: PaymentNetwork,
  source: string,
  target: string,
): PaymentChannel | undefined {
  return network.channels.find(
    (channel) =>
      (channel.source === source && channel.target === target) ||
      (channel.source === target && channel.target === source),
  )
}

export function isEndpointAvailable(
  network: PaymentNetwork,
  nodeId: string,
): boolean {
  return getNode(network, nodeId)?.online === true
}

export function assertValidPaymentRequest(
  network: PaymentNetwork,
  source: string,
  target: string,
  amount: number,
): void {
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error("Payment amount must be a positive number of sats.")
  }
  if (!getNode(network, source)) {
    throw new Error(`Unknown source node: ${source}`)
  }
  if (!getNode(network, target)) {
    throw new Error(`Unknown destination node: ${target}`)
  }
}
