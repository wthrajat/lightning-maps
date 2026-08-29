import { generatePaymentNetwork } from "../lib/network/generator.ts"

/** Stable synthetic data. It contains no real Lightning node information. */
export const DEFAULT_NETWORK = generatePaymentNetwork()

export const DEFAULT_ROUTE_REQUEST = {
  source: "alice",
  target: "bob",
  amount: 50_000,
  preset: "balanced",
} as const
