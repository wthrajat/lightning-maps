"use client";

import { ArrowRight, Check, Clock3, Coins, Route, ShieldCheck } from "lucide-react";

import type { PaymentNetwork } from "@/lib/network/types";
import type { PaymentRoute, RouteComparison } from "@/lib/routing/types";
import { formatCompactSats, formatLatency, formatPercent, formatSats } from "@/utils/format";

type RouteResultsProps = {
  comparison: RouteComparison;
  network: PaymentNetwork;
  selectedRoute: PaymentRoute | null;
  onSelectRoute: (routeId: string) => void;
};

const strategyLabels = {
  intelligent: "Recommended",
  cheapest: "Lowest fee",
  shortest: "Fewest hops",
};

function routeNames(network: PaymentNetwork, route: PaymentRoute): string[] {
  const names = new Map(network.nodes.map((node) => [node.id, node.name]));
  return route.nodeIds.map((nodeId) => names.get(nodeId) ?? nodeId);
}

export function RouteResults({
  comparison,
  network,
  selectedRoute,
  onSelectRoute,
}: RouteResultsProps) {
  if (!comparison.recommended) {
    const messages = {
      "invalid-endpoint": "Choose two different participants and try again.",
      "endpoint-offline": "The sender or receiver is offline. Choose an online participant.",
      "insufficient-liquidity":
        "The payment is larger than the usable room across every candidate path.",
      "network-disconnected":
        "The active connections do not form a path between these participants.",
    };

    return (
      <div className="no-route-state" role="status">
        <span aria-hidden="true">×</span>
        <div>
          <h2>No viable route found</h2>
          <p>{messages[comparison.noRouteReason ?? "network-disconnected"]}</p>
          <small>
            Lower the amount, restore the network, or select another destination.
          </small>
        </div>
      </div>
    );
  }

  return (
    <section className="route-results" aria-labelledby="route-options-title">
      <div className="route-results__header">
        <div>
          <p className="mono">ROUTE ANALYSIS</p>
          <h2 id="route-options-title">Three ways to get there</h2>
        </div>
        <span>{comparison.routes.length} options compared</span>
      </div>

      <div className="route-option-tabs" aria-label="Calculated route options">
        {comparison.routes.map((route) => {
          const names = routeNames(network, route);
          const isSelected = route.id === selectedRoute?.id;
          const isRecommended = route.id === comparison.recommended?.id;

          return (
            <button
              aria-pressed={isSelected}
              className={isSelected ? "route-option is-selected" : "route-option"}
              key={route.id}
              onClick={() => onSelectRoute(route.id)}
              type="button"
            >
              <span className="route-option__type">
                {isRecommended ? <Check aria-hidden="true" /> : null}
                {strategyLabels[route.strategy]}
              </span>
              <strong>{names.join(" → ")}</strong>
              <span className="route-option__metrics mono">
                {formatSats(route.metrics.totalFee)} sats
                <i />
                {route.metrics.hops} hops
                <i />
                {formatPercent(route.metrics.estimatedSuccess)} est. success
              </span>
            </button>
          );
        })}
      </div>

      {selectedRoute ? (
        <div className="selected-route-analysis">
          <div className="route-path-line">
            {routeNames(network, selectedRoute).map((name, index, names) => (
              <span key={`${name}-${index}`}>
                <b>{name}</b>
                {index < names.length - 1 ? <ArrowRight aria-hidden="true" /> : null}
              </span>
            ))}
          </div>

          <dl className="route-metrics">
            <div>
              <dt><Coins aria-hidden="true" /> Estimated fee</dt>
              <dd className="mono">{formatSats(selectedRoute.metrics.totalFee)} sats</dd>
            </div>
            <div>
              <dt><Route aria-hidden="true" /> Connections</dt>
              <dd className="mono">{selectedRoute.metrics.hops} hops</dd>
            </div>
            <div>
              <dt><ShieldCheck aria-hidden="true" /> Est. success</dt>
              <dd className="mono">{formatPercent(selectedRoute.metrics.estimatedSuccess)}</dd>
            </div>
            <div>
              <dt><Clock3 aria-hidden="true" /> Est. latency</dt>
              <dd className="mono">{formatLatency(selectedRoute.metrics.latencyMs)}</dd>
            </div>
            <div>
              <dt>Smallest opening</dt>
              <dd className="mono">{formatCompactSats(selectedRoute.metrics.minimumLiquidity)} sats</dd>
            </div>
          </dl>

          {selectedRoute.id === comparison.recommended.id && comparison.explanation ? (
            <div className="route-explanation">
              <span>Why this route?</span>
              <div>
                <h3>{comparison.explanation.title}</h3>
                <p>{comparison.explanation.summary}</p>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
