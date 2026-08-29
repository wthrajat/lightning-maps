import { SCENARIOS_BY_ID } from "../../data/scenarios.ts"
import type { PaymentNetwork } from "../network/types.ts"
import {
  disableNodes,
  simulateNetworkConditions,
} from "./failures.ts"
import type { AppliedScenario, NetworkEvent, ScenarioId } from "./types.ts"

export function applyDemoScenario(
  network: PaymentNetwork,
  scenarioId: ScenarioId,
): AppliedScenario {
  const definition = SCENARIOS_BY_ID[scenarioId]
  if (!definition) {
    throw new Error(`Unknown scenario: ${scenarioId}`)
  }

  const simulation = simulateNetworkConditions(network, definition.conditions)
  let scenarioNetwork = simulation.network
  let events: NetworkEvent[] = [...simulation.events]

  if (definition.disabledNodeIds?.length) {
    const disabled = disableNodes(scenarioNetwork, definition.disabledNodeIds)
    scenarioNetwork = disabled.network
    events = [...events, ...disabled.events]
  }

  return {
    definition,
    request: { ...definition.request },
    network: scenarioNetwork,
    events,
  }
}
