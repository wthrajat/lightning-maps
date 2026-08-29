import { DEFAULT_NETWORK } from "../../data/network.ts"
import { cloneNetwork } from "./graph.ts"
import type {
  LightningNode,
  NetworkDataProvider,
  PaymentChannel,
  PaymentNetwork,
} from "./types.ts"

export class SimulationDataProvider implements NetworkDataProvider {
  readonly #network: PaymentNetwork

  constructor(network: PaymentNetwork = DEFAULT_NETWORK) {
    this.#network = cloneNetwork(network)
  }

  async getNodes(): Promise<LightningNode[]> {
    return cloneNetwork(this.#network).nodes
  }

  async getChannels(): Promise<PaymentChannel[]> {
    return cloneNetwork(this.#network).channels
  }

  async getNetwork(): Promise<PaymentNetwork> {
    return cloneNetwork(this.#network)
  }
}
