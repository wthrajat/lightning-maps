"use client";

import {
  ArrowLeft,
  ArrowRight,
  Check,
  FlaskConical,
  Map,
  Play,
  Route,
  Send,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { NetworkGraph } from "@/components/graph/network-graph";
import { DEFAULT_NETWORK, DEFAULT_ROUTE_REQUEST } from "@/data/network";
import { runExperiment } from "@/lib/experiments/runner";
import { compareRoutes } from "@/lib/routing/compare";
import { simulatePayment } from "@/lib/simulation/payment";
import { applyDemoScenario } from "@/lib/simulation/scenarios";
import type { PaymentSimulation } from "@/lib/simulation/types";
import { formatPercent, formatSats } from "@/utils/format";

import styles from "./guided-demo.module.css";

const stages = [
  {
    title: "Network",
    icon: Map,
    heading: "A map made of participants and connections",
    narration:
      "Each point can forward a payment. Each line has a fee, a delay, a reliability history, and a limited amount of usable room.",
  },
  {
    title: "Route",
    icon: Route,
    heading: "Three algorithms see three different best paths",
    narration:
      "The shortest route minimizes connections. The cheapest minimizes fees. The balanced route accepts a small fee increase for a stronger estimated success rate.",
  },
  {
    title: "Payment",
    icon: Send,
    heading: "The payment is forwarded, one connection at a time",
    narration:
      "This animation is a deterministic test. It uses no wallet, private key, Bitcoin, or real money.",
  },
  {
    title: "Failure",
    icon: FlaskConical,
    heading: "Central Hub goes offline. The route adapts.",
    narration:
      "Removing a highly connected participant changes which paths exist. The router recalculates against the same rules and explains the alternative.",
  },
  {
    title: "Experiment",
    icon: Play,
    heading: "Repeat the question hundreds of times",
    narration:
      "A seeded experiment compares all three algorithms across the same failures. That makes the results measurable and reproducible.",
  },
];

export function GuidedDemo() {
  const [stage, setStage] = useState(0);
  const [payment, setPayment] = useState<PaymentSimulation | null>(null);
  const [paymentStep, setPaymentStep] = useState(-1);
  const timers = useRef<number[]>([]);
  const onNodeSelect = useCallback(() => undefined, []);

  const baseComparison = useMemo(
    () => compareRoutes(DEFAULT_NETWORK, DEFAULT_ROUTE_REQUEST),
    [],
  );
  const failureScenario = useMemo(
    () => applyDemoScenario(DEFAULT_NETWORK, "major-node-failure"),
    [],
  );
  const failureComparison = useMemo(
    () => compareRoutes(failureScenario.network, failureScenario.request),
    [failureScenario],
  );
  const experiment = useMemo(
    () =>
      runExperiment({
        iterations: 300,
        failureRate: 0.08,
        paymentAmount: 50_000,
        seed: 7301,
      }),
    [],
  );

  useEffect(() => {
    const timerRegistry = timers;

    return () => {
      timerRegistry.current.forEach((timer) => window.clearTimeout(timer));
    };
  }, []);

  function goToStage(nextStage: number) {
    timers.current.forEach((timer) => window.clearTimeout(timer));
    timers.current = [];
    setStage(nextStage);
    setPayment(null);
    setPaymentStep(-1);

    if (nextStage === 2 && baseComparison.recommended) {
      const result = simulatePayment(DEFAULT_NETWORK, baseComparison.recommended, {
        outcome: "success",
        stepDurationMs: 760,
      });
      setPayment(result);
      setPaymentStep(0);
      result.steps.slice(1).forEach((step, index) => {
        timers.current.push(
          window.setTimeout(() => setPaymentStep(index + 1), step.scheduledAtMs),
        );
      });
    }
  }

  const activeStep = payment?.steps[paymentStep];
  const graphNetwork = stage === 3 ? failureScenario.network : DEFAULT_NETWORK;
  const graphRoute =
    stage === 0
      ? null
      : stage === 3
        ? failureComparison.recommended
        : baseComparison.recommended;
  const current = stages[stage];

  return (
    <div className={styles.demoShell}>
      <ol className={styles.progress} aria-label="Guided demo progress">
        {stages.map((item, index) => (
          <li
            className={
              index === stage
                ? styles.current
                : index < stage
                  ? styles.complete
                  : ""
            }
            key={item.title}
          >
            <button
              aria-current={index === stage ? "step" : undefined}
              onClick={() => goToStage(index)}
              type="button"
            >
              <span>{index < stage ? <Check aria-hidden="true" /> : index + 1}</span>
              {item.title}
            </button>
          </li>
        ))}
      </ol>

      <section className={styles.stage}>
        <div className={styles.narrative}>
          <span className={styles.stageIcon}>
            <current.icon aria-hidden="true" />
          </span>
          <p className="mono">STEP {stage + 1} OF {stages.length}</p>
          <h1>{current.heading}</h1>
          <p>{current.narration}</p>

          {stage === 0 ? (
            <dl className={styles.quickFacts}>
              <div>
                <dt>Participants</dt>
                <dd className="mono">{DEFAULT_NETWORK.nodes.length}</dd>
              </div>
              <div>
                <dt>Connections</dt>
                <dd className="mono">{DEFAULT_NETWORK.channels.length}</dd>
              </div>
              <div>
                <dt>Dataset</dt>
                <dd>Synthetic</dd>
              </div>
            </dl>
          ) : null}

          {stage === 1 && baseComparison.recommended ? (
            <div className={styles.routeComparison}>
              {baseComparison.routes.map((route) => (
                <div
                  className={
                    route.id === baseComparison.recommended?.id
                      ? styles.recommended
                      : ""
                  }
                  key={route.id}
                >
                  <strong>
                    {route.strategy === "intelligent" ? "Balanced" : route.strategy}
                  </strong>
                  <span className="mono">
                    {formatSats(route.metrics.totalFee)} sats
                  </span>
                  <span className="mono">{route.metrics.hops} hops</span>
                  <span className="mono">
                    {formatPercent(route.metrics.estimatedSuccess)}
                  </span>
                </div>
              ))}
            </div>
          ) : null}

          {stage === 2 && payment ? (
            <ol className={styles.handoff} aria-live="polite">
              {payment.steps.map((step, index) => (
                <li
                  className={index <= paymentStep ? styles.reached : ""}
                  key={`${step.nodeId}-${index}`}
                >
                  <span>
                    {index <= paymentStep ? <Check aria-hidden="true" /> : index + 1}
                  </span>
                  <div>
                    <strong>{step.nodeName}</strong>
                    <small>{index <= paymentStep ? step.message : "Waiting"}</small>
                  </div>
                </li>
              ))}
            </ol>
          ) : null}

          {stage === 3 ? (
            <div className={styles.failureNote}>
              <strong>{failureScenario.events[0]?.title}</strong>
              <p>{failureScenario.events[0]?.description}</p>
              <span>
                New route: {failureComparison.recommended?.metrics.hops ?? "—"} hops ·{" "}
                {failureComparison.recommended
                  ? `${formatSats(failureComparison.recommended.metrics.totalFee)} sats`
                  : "unavailable"}
              </span>
            </div>
          ) : null}

          {stage === 4 ? (
            <div className={styles.experiment}>
              {experiment.algorithms.map((result) => (
                <div key={result.algorithm}>
                  <span>
                    {result.algorithm === "intelligent"
                      ? "Balanced"
                      : result.algorithm}
                  </span>
                  <i>
                    <b style={{ width: `${result.successRate * 100}%` }} />
                  </i>
                  <strong className="mono">
                    {formatPercent(result.successRate)}
                  </strong>
                </div>
              ))}
              <p>
                {experiment.totalSimulatedPayments.toLocaleString()} seeded
                algorithm attempts · synthetic results
              </p>
            </div>
          ) : null}
        </div>

        <div className={styles.mapStage}>
          <div className={styles.mapToolbar}>
            <span className="synthetic-label">Simulated network</span>
            <span className="mono">
              {stage === 3
                ? "FAILURE SCENARIO"
                : stage === 2
                  ? "PAYMENT IN MOTION"
                  : "NORMAL CONDITIONS"}
            </span>
          </div>
          <NetworkGraph
            activeChannelId={activeStep?.channelId}
            activeNodeId={activeStep?.nodeId}
            amount={
              stage === 3
                ? failureScenario.request.amount
                : DEFAULT_ROUTE_REQUEST.amount
            }
            network={graphNetwork}
            onNodeSelect={onNodeSelect}
            selectedRoute={graphRoute}
          />
        </div>
      </section>

      <div className={styles.controls}>
        <button
          className="button button--secondary"
          disabled={stage === 0}
          onClick={() => goToStage(Math.max(0, stage - 1))}
          type="button"
        >
          <ArrowLeft aria-hidden="true" /> Previous
        </button>
        <p>
          {stage === stages.length - 1
            ? "You have completed the five-minute tour."
            : `Next: ${stages[stage + 1]?.title}`}
        </p>
        <button
          className="button button--primary"
          onClick={() => goToStage(stage === stages.length - 1 ? 0 : stage + 1)}
          type="button"
        >
          {stage === stages.length - 1 ? "Restart demo" : "Next step"}
          <ArrowRight aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
