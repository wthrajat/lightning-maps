"use client";

import { ArrowDownUp, LocateFixed, Search } from "lucide-react";

import type { LightningNode } from "@/lib/network/types";
import type { RouteRequest, RoutingPreset } from "@/lib/routing/types";

type RouteControlsProps = {
  nodes: LightningNode[];
  request: RouteRequest;
  amountText: string;
  calculating: boolean;
  onRequestChange: (request: RouteRequest) => void;
  onAmountChange: (amount: string) => void;
  onSubmit: () => void;
  onGuidedDemo: () => void;
};

const presets: { value: RoutingPreset; label: string; description: string }[] = [
  {
    value: "balanced",
    label: "Balanced",
    description: "Weigh cost, reliability, room, distance, and delay.",
  },
  {
    value: "cheapest",
    label: "Lowest cost",
    description: "Prefer the smallest routing fee.",
  },
  {
    value: "most-reliable",
    label: "Most reliable",
    description: "Prefer dependable connections with more room.",
  },
];

export function RouteControls({
  nodes,
  request,
  amountText,
  calculating,
  onRequestChange,
  onAmountChange,
  onSubmit,
  onGuidedDemo,
}: RouteControlsProps) {
  const selectedPreset = presets.find((preset) => preset.value === request.preset);

  function swapEndpoints() {
    onRequestChange({
      ...request,
      source: request.target,
      target: request.source,
    });
  }

  return (
    <form
      className="route-controls"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <div className="route-controls__heading">
        <div>
          <p className="mono">PAYMENT ROUTE</p>
          <h2>Plan a test payment</h2>
        </div>
        <LocateFixed aria-hidden="true" />
      </div>

      <div className="endpoint-fields">
        <label>
          <span>From</span>
          <select
            aria-label="Payment sender"
            onChange={(event) =>
              onRequestChange({ ...request, source: event.target.value })
            }
            value={request.source}
          >
            {nodes.map((node) => (
              <option disabled={!node.online || node.id === request.target} key={node.id} value={node.id}>
                {node.name}{node.online ? "" : " (offline)"}
              </option>
            ))}
          </select>
        </label>
        <button
          aria-label="Swap sender and receiver"
          className="swap-button"
          onClick={swapEndpoints}
          type="button"
        >
          <ArrowDownUp aria-hidden="true" />
        </button>
        <label>
          <span>To</span>
          <select
            aria-label="Payment receiver"
            onChange={(event) =>
              onRequestChange({ ...request, target: event.target.value })
            }
            value={request.target}
          >
            {nodes.map((node) => (
              <option disabled={!node.online || node.id === request.source} key={node.id} value={node.id}>
                {node.name}{node.online ? "" : " (offline)"}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="field-label">
        <span>Amount</span>
        <div className="amount-field">
          <input
            inputMode="numeric"
            max="5000000"
            min="100"
            onChange={(event) => onAmountChange(event.target.value)}
            type="number"
            value={amountText}
          />
          <span>sats</span>
        </div>
        <small>
          A sat is a small Bitcoin unit. Here it is only a simulated amount.
        </small>
      </label>

      <fieldset className="objective-field">
        <legend>What should the route favor?</legend>
        <div className="objective-options">
          {presets.map((preset) => (
            <label key={preset.value}>
              <input
                checked={request.preset === preset.value}
                name="preset"
                onChange={() =>
                  onRequestChange({ ...request, preset: preset.value })
                }
                type="radio"
                value={preset.value}
              />
              <span>{preset.label}</span>
            </label>
          ))}
        </div>
        <p>{selectedPreset?.description}</p>
      </fieldset>

      <button className="button button--primary route-controls__submit" disabled={calculating} type="submit">
        <Search aria-hidden="true" />
        {calculating ? "Comparing routes…" : "Find best route"}
      </button>
      <button className="guided-demo-button" onClick={onGuidedDemo} type="button">
        Show me how a payment works
      </button>
    </form>
  );
}
