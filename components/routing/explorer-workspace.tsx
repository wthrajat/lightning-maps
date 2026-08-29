"use client";

import { FlaskConical, Info, TriangleAlert, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { GraphLegend } from "@/components/graph/graph-legend";
import { NetworkGraph } from "@/components/graph/network-graph";
import { NodeDetails } from "@/components/graph/node-details";
import { RouteControls } from "@/components/routing/route-controls";
import { RouteResults } from "@/components/routing/route-results";
import {
  FailureControls,
  type FailureSettings,
} from "@/components/simulation/failure-controls";
import { PaymentTimeline } from "@/components/simulation/payment-timeline";
import { DEFAULT_NETWORK, DEFAULT_ROUTE_REQUEST } from "@/data/network";
import type { LightningNode, PaymentNetwork } from "@/lib/network/types";
import { compareRoutes } from "@/lib/routing/compare";
import type { PaymentRoute, RouteRequest } from "@/lib/routing/types";
import { simulateNetworkConditions } from "@/lib/simulation/failures";
import { simulatePayment } from "@/lib/simulation/payment";
import { applyDemoScenario } from "@/lib/simulation/scenarios";
import type {
  NetworkEvent,
  PaymentSimulation,
  ScenarioId,
} from "@/lib/simulation/types";
import { formatPercent, formatSats } from "@/utils/format";

const initialSettings: FailureSettings = {
  nodeFailureRate: 0,
  congestion: 0,
  liquidityReduction: 0,
};

type ImpactSnapshot = {
  before: PaymentRoute | null;
  after: PaymentRoute | null;
};

type ExplorerWorkspaceProps = {
  initialWhatIfOpen?: boolean;
};

export function ExplorerWorkspace({ initialWhatIfOpen = false }: ExplorerWorkspaceProps) {
  const [network, setNetwork] = useState<PaymentNetwork>(DEFAULT_NETWORK);
  const [draftRequest, setDraftRequest] = useState<RouteRequest>({ ...DEFAULT_ROUTE_REQUEST });
  const [appliedRequest, setAppliedRequest] = useState<RouteRequest>({ ...DEFAULT_ROUTE_REQUEST });
  const [amountText, setAmountText] = useState(String(DEFAULT_ROUTE_REQUEST.amount));
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<LightningNode | null>(null);
  const [calculating, setCalculating] = useState(false);
  const [showFailureControls, setShowFailureControls] = useState(initialWhatIfOpen);
  const [failureSettings, setFailureSettings] = useState(initialSettings);
  const [events, setEvents] = useState<NetworkEvent[]>([]);
  const [impact, setImpact] = useState<ImpactSnapshot | null>(null);
  const [payment, setPayment] = useState<PaymentSimulation | null>(null);
  const [paymentStep, setPaymentStep] = useState(-1);
  const [sending, setSending] = useState(false);
  const [narration, setNarration] = useState<string | null>(null);
  const timers = useRef<number[]>([]);

  const comparison = useMemo(
    () => compareRoutes(network, appliedRequest),
    [appliedRequest, network],
  );
  const selectedRoute =
    comparison.routes.find((route) => route.id === selectedRouteId) ??
    comparison.recommended;

  const onNodeSelect = useCallback((node: LightningNode) => {
    setSelectedNode(node);
  }, []);

  useEffect(() => {
    return () => {
      timers.current.forEach((timer) => window.clearTimeout(timer));
    };
  }, []);

  function schedule(callback: () => void, delay: number) {
    const timer = window.setTimeout(callback, delay);
    timers.current.push(timer);
  }

  function clearPayment() {
    setPayment(null);
    setPaymentStep(-1);
    setSending(false);
  }

  function calculateRoute() {
    const numericAmount = Number(amountText);
    if (!Number.isFinite(numericAmount) || numericAmount < 100) return;

    setCalculating(true);
    setNarration("Checking which connections can carry this amount…");
    schedule(() => {
      setAppliedRequest({ ...draftRequest, amount: numericAmount });
      setSelectedRouteId(null);
      setCalculating(false);
      setNarration("Three routing strategies compared. The balanced route is highlighted.");
      clearPayment();
    }, 420);
  }

  function playPayment(route: PaymentRoute, paymentNetwork: PaymentNetwork) {
    timers.current.forEach((timer) => window.clearTimeout(timer));
    timers.current = [];
    const result = simulatePayment(paymentNetwork, route, {
      outcome: "success",
      stepDurationMs: 620,
    });
    setPayment(result);
    setPaymentStep(0);
    setSending(true);
    setNarration("The test payment is being handed from one participant to the next.");

    result.steps.slice(1).forEach((step, index) => {
      schedule(() => {
        setPaymentStep(index + 1);
        setNarration(step.message);
      }, step.scheduledAtMs);
    });
    schedule(() => {
      setSending(false);
      setNarration(
        result.status === "success"
          ? "The simulated payment reached its destination."
          : "The simulated payment stopped before arrival.",
      );
    }, result.durationMs + 180);
  }

  function startPayment() {
    if (selectedRoute) playPayment(selectedRoute, network);
  }

  function runGuidedDemo() {
    timers.current.forEach((timer) => window.clearTimeout(timer));
    timers.current = [];
    const request = { ...DEFAULT_ROUTE_REQUEST };
    setNetwork(DEFAULT_NETWORK);
    setDraftRequest(request);
    setAppliedRequest(request);
    setAmountText(String(request.amount));
    setSelectedRouteId(null);
    setEvents([]);
    setImpact(null);
    setNarration("Alice wants to send a 50,000 sat test payment to Bob.");
    clearPayment();

    const guidedComparison = compareRoutes(DEFAULT_NETWORK, request);
    schedule(
      () => setNarration("There are several possible routes. We compare cost, reliability, room, distance, and delay."),
      900,
    );
    schedule(
      () => setNarration("The balanced route costs slightly more than the cheapest option, but is more dependable."),
      2500,
    );
    if (guidedComparison.recommended) {
      schedule(() => playPayment(guidedComparison.recommended!, DEFAULT_NETWORK), 4300);
    }
  }

  function applyConditions() {
    const before = compareRoutes(DEFAULT_NETWORK, appliedRequest).recommended;
    const result = simulateNetworkConditions(DEFAULT_NETWORK, {
      nodeFailureRate: failureSettings.nodeFailureRate / 100,
      congestion: failureSettings.congestion / 100,
      liquidityReduction: failureSettings.liquidityReduction / 100,
      protectedNodeIds: [appliedRequest.source, appliedRequest.target],
      seed: 42,
    });
    const after = compareRoutes(result.network, appliedRequest).recommended;
    setNetwork(result.network);
    setEvents(result.events);
    setImpact({ before, after });
    setSelectedRouteId(null);
    setNarration(
      result.events[0]?.description ?? "The conditions did not change the network.",
    );
    clearPayment();
  }

  function applyScenario(scenarioId: ScenarioId) {
    const before = compareRoutes(DEFAULT_NETWORK, DEFAULT_ROUTE_REQUEST).recommended;
    const scenario = applyDemoScenario(DEFAULT_NETWORK, scenarioId);
    const after = compareRoutes(scenario.network, scenario.request).recommended;
    setNetwork(scenario.network);
    setDraftRequest(scenario.request);
    setAppliedRequest(scenario.request);
    setAmountText(String(scenario.request.amount));
    setEvents(scenario.events);
    setImpact({ before, after });
    setSelectedRouteId(null);
    setNarration(`${scenario.definition.name}: ${scenario.definition.lesson}`);
    clearPayment();
  }

  function resetNetwork() {
    setNetwork(DEFAULT_NETWORK);
    setDraftRequest({ ...DEFAULT_ROUTE_REQUEST });
    setAppliedRequest({ ...DEFAULT_ROUTE_REQUEST });
    setAmountText(String(DEFAULT_ROUTE_REQUEST.amount));
    setFailureSettings(initialSettings);
    setEvents([]);
    setImpact(null);
    setNarration("Normal network restored.");
    setSelectedRouteId(null);
    clearPayment();
  }

  const activePaymentStep = payment?.steps[paymentStep];
  const selectedNodeRole = selectedNode
    ? selectedRoute?.source === selectedNode.id
      ? "sender"
      : selectedRoute?.target === selectedNode.id
        ? "receiver"
        : selectedRoute?.nodeIds.includes(selectedNode.id)
          ? "forwarder"
          : "not-on-route"
    : "not-on-route";

  return (
    <div className="explorer-workspace">
      <aside className="explorer-sidebar">
        <RouteControls
          amountText={amountText}
          calculating={calculating}
          nodes={network.nodes}
          onAmountChange={setAmountText}
          onGuidedDemo={runGuidedDemo}
          onRequestChange={setDraftRequest}
          onSubmit={calculateRoute}
          request={draftRequest}
        />
        <button
          aria-expanded={showFailureControls}
          className={showFailureControls ? "what-if-toggle is-active" : "what-if-toggle"}
          onClick={() => setShowFailureControls((current) => !current)}
          type="button"
        >
          <FlaskConical aria-hidden="true" />
          <span>
            <strong>What if the network changes?</strong>
            <small>Fail nodes, add congestion, reduce liquidity</small>
          </span>
        </button>
      </aside>

      <div className="explorer-main">
        <div className="explorer-map-bar">
          <div>
            <span className="synthetic-label">Synthetic network</span>
            <strong>{network.nodes.filter((node) => node.online).length} active participants</strong>
          </div>
          <GraphLegend />
        </div>
        <div className="explorer-map">
          <NetworkGraph
            activeChannelId={activePaymentStep?.channelId}
            activeNodeId={activePaymentStep?.nodeId}
            amount={appliedRequest.amount}
            network={network}
            onNodeSelect={onNodeSelect}
            selectedRoute={selectedRoute}
          />
          {calculating ? (
            <div className="map-calculating" role="status">
              <span />
              <div>
                <strong>Comparing routes</strong>
                <p>Checking fees, room, reliability, and delay…</p>
              </div>
            </div>
          ) : null}
          {selectedNode ? (
            <NodeDetails node={selectedNode} onClose={() => setSelectedNode(null)} routeRole={selectedNodeRole} />
          ) : null}
        </div>
      </div>

      <div className="explorer-analysis">
        {narration ? (
          <div className="narration-bar" role="status" aria-live="polite">
            <Info aria-hidden="true" />
            <p>{narration}</p>
            <button aria-label="Dismiss explanation" onClick={() => setNarration(null)} type="button">
              <X aria-hidden="true" />
            </button>
          </div>
        ) : null}

        {showFailureControls ? (
          <FailureControls
            onChange={setFailureSettings}
            onReset={resetNetwork}
            onScenario={applyScenario}
            onSimulate={applyConditions}
            settings={failureSettings}
          />
        ) : null}

        {events.length ? (
          <div className="network-events" aria-label="Network events">
            <TriangleAlert aria-hidden="true" />
            <div>
              <strong>{events[0]?.title}</strong>
              <p>{events[0]?.description}</p>
              {events.length > 1 ? <span>+ {events.length - 1} more network changes</span> : null}
            </div>
          </div>
        ) : null}

        {impact ? (
          <section className="impact-comparison" aria-labelledby="impact-title">
            <div>
              <p className="mono">NETWORK IMPACT</p>
              <h2 id="impact-title">What changed?</h2>
            </div>
            <dl>
              <div>
                <dt>Before</dt>
                <dd>
                  <strong>{impact.before ? formatPercent(impact.before.metrics.estimatedSuccess) : "No route"}</strong>
                  <span>{impact.before ? `${impact.before.metrics.hops} hops · ${formatSats(impact.before.metrics.totalFee)} sats` : "—"}</span>
                </dd>
              </div>
              <div>
                <dt>After</dt>
                <dd>
                  <strong>{impact.after ? formatPercent(impact.after.metrics.estimatedSuccess) : "No route"}</strong>
                  <span>{impact.after ? `${impact.after.metrics.hops} hops · ${formatSats(impact.after.metrics.totalFee)} sats` : "Route unavailable"}</span>
                </dd>
              </div>
            </dl>
          </section>
        ) : null}

        <RouteResults
          comparison={comparison}
          network={network}
          onSelectRoute={setSelectedRouteId}
          selectedRoute={selectedRoute}
        />
        <PaymentTimeline
          currentStepIndex={paymentStep}
          disabled={!selectedRoute}
          onSend={startPayment}
          sending={sending}
          simulation={payment}
        />
      </div>
    </div>
  );
}
