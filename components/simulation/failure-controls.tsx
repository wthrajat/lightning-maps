"use client";

import { RotateCcw, Sparkles } from "lucide-react";

import { DEMO_SCENARIOS } from "@/data/scenarios";
import type { ScenarioId } from "@/lib/simulation/types";

export type FailureSettings = {
  nodeFailureRate: number;
  congestion: number;
  liquidityReduction: number;
};

type FailureControlsProps = {
  settings: FailureSettings;
  onChange: (settings: FailureSettings) => void;
  onSimulate: () => void;
  onReset: () => void;
  onScenario: (scenarioId: ScenarioId) => void;
};

export function FailureControls({
  settings,
  onChange,
  onSimulate,
  onReset,
  onScenario,
}: FailureControlsProps) {
  return (
    <section className="failure-controls" aria-labelledby="what-if-title">
      <div className="failure-controls__intro">
        <p className="mono">WHAT IF?</p>
        <h2 id="what-if-title">Interrupt the network</h2>
        <p>
          Apply deterministic conditions, then compare the old journey with the new one.
        </p>
      </div>

      <div className="scenario-chips" aria-label="Prepared simulation scenarios">
        {DEMO_SCENARIOS.slice(1).map((scenario) => (
          <button key={scenario.id} onClick={() => onScenario(scenario.id)} type="button">
            {scenario.shortName}
          </button>
        ))}
      </div>

      <div className="failure-sliders">
        <label>
          <span>
            Node failures <b className="mono">{settings.nodeFailureRate}%</b>
          </span>
          <input
            aria-label="Node failure percentage"
            max="30"
            min="0"
            onChange={(event) =>
              onChange({ ...settings, nodeFailureRate: Number(event.target.value) })
            }
            type="range"
            value={settings.nodeFailureRate}
          />
        </label>
        <label>
          <span>
            Congestion <b className="mono">{settings.congestion}%</b>
          </span>
          <input
            aria-label="Network congestion percentage"
            max="100"
            min="0"
            onChange={(event) =>
              onChange({ ...settings, congestion: Number(event.target.value) })
            }
            type="range"
            value={settings.congestion}
          />
        </label>
        <label>
          <span>
            Less liquidity <b className="mono">{settings.liquidityReduction}%</b>
          </span>
          <input
            aria-label="Liquidity reduction percentage"
            max="70"
            min="0"
            onChange={(event) =>
              onChange({ ...settings, liquidityReduction: Number(event.target.value) })
            }
            type="range"
            value={settings.liquidityReduction}
          />
        </label>
      </div>

      <div className="failure-controls__actions">
        <button className="button button--primary" onClick={onSimulate} type="button">
          <Sparkles aria-hidden="true" /> Simulate conditions
        </button>
        <button className="button button--secondary" onClick={onReset} type="button">
          <RotateCcw aria-hidden="true" /> Reset
        </button>
      </div>
    </section>
  );
}
