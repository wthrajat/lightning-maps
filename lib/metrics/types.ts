export type ConnectedNodeMetric = {
  nodeId: string
  name: string
  connections: number
}

export type NetworkStats = {
  nodeCount: number
  channelCount: number
  activeNodes: number
  inactiveNodes: number
  enabledChannels: number
  disabledChannels: number
  totalCapacity: number
  totalLiquidity: number
  averageReliability: number
  networkDensity: number
  averageConnections: number
  mostConnected: ConnectedNodeMetric[]
}

export type BottleneckMetric = {
  nodeId: string
  name: string
  connections: number
  betweennessCentrality: number
  risk: "high" | "moderate" | "low"
  explanation: string
}

export type NetworkImpact = {
  before: NetworkStats
  after: NetworkStats
  changes: {
    activeNodes: number
    enabledChannels: number
    totalLiquidity: number
    averageReliability: number
    networkDensity: number
  }
}
