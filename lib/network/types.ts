export type NodeRole =
  | "participant"
  | "hub"
  | "merchant"
  | "relay"

export type NetworkPosition = {
  x: number
  y: number
}

export type LightningNode = {
  id: string
  name: string
  online: boolean
  reliability: number
  totalCapacity: number
  availableLiquidity: number
  connectionCount: number
  recentFailures: number
  region: string
  role: NodeRole
  position: NetworkPosition
}

export type PaymentChannel = {
  id: string
  source: string
  target: string
  capacity: number
  availableLiquidity: number
  feeBase: number
  feeRate: number
  reliability: number
  latencyMs: number
  enabled: boolean
}

export type PaymentNetwork = {
  nodes: LightningNode[]
  channels: PaymentChannel[]
  metadata: {
    id: string
    name: string
    description: string
    seed: number
    synthetic: true
    generatedAt: string
  }
}

export interface NetworkDataProvider {
  getNodes(): Promise<LightningNode[]>
  getChannels(): Promise<PaymentChannel[]>
}

export type AdjacentChannel = {
  channel: PaymentChannel
  from: string
  to: string
}
