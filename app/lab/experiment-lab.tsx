"use client";

import {
  Beaker,
  Check,
  CopyCheck,
  Play,
  RefreshCw,
  SlidersHorizontal,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { AlgorithmComparisonChart } from "@/components/charts/algorithm-comparison-chart";
import styles from "@/components/charts/experiment-lab.module.css";
import { runExperiment } from "@/lib/experiments/runner";
import type {
  ExperimentConfig,
  ExperimentResult,
} from "@/lib/experiments/types";
import type { RoutingStrategy } from "@/lib/routing/types";

type ControlState = {
  networkSize: number;
  failureRate: number;
  paymentAmount: number;
  iterations: number;
  seed: number;
};

const INITIAL_CONTROLS: ControlState = {
  networkSize: 50,
  failureRate: 0.08,
  paymentAmount: 50_000,
  iterations: 1_000,
  seed: 7_301,
};

const algorithmNames: Record<RoutingStrategy, string> = {
  shortest: "Shortest path",
  cheapest: "Lowest fee",
  intelligent: "Balanced score",
};

const numberFormatter = new Intl.NumberFormat("en");
const compactFormatter = new Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 1,
});

function toControlState(config: Required<ExperimentConfig>): ControlState {
  return {
    networkSize: config.networkSize,
    failureRate: config.failureRate,
    paymentAmount: config.paymentAmount,
    iterations: config.iterations,
    seed: config.seed,
  };
}

export function ExperimentLab() {
  const [controls, setControls] = useState(INITIAL_CONTROLS);
  const [result, setResult] = useState<ExperimentResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isStale, setIsStale] = useState(false);
  const [repeatMatched, setRepeatMatched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lastResultId = useRef<string | null>(null);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current !== null) window.clearTimeout(timer.current);
    };
  }, []);

  const summary = useMemo(() => {
    if (!result) return null;
    const bySuccess = [...result.algorithms].sort(
      (first, second) => second.successRate - first.successRate,
    );
    const successfulAlgorithms = result.algorithms.filter(
      (algorithm) => algorithm.successful > 0,
    );
    const byFee = [...successfulAlgorithms].sort(
      (first, second) => first.averageFee - second.averageFee,
    );
    const byHops = [...successfulAlgorithms].sort(
      (first, second) => first.averageHops - second.averageHops,
    );

    return {
      mostSuccessful: bySuccess[0],
      lowestFee: byFee[0],
      fewestHops: byHops[0],
      failures: result.algorithms.reduce(
        (total, algorithm) => total + algorithm.failed,
        0,
      ),
    };
  }, [result]);

  function updateControl<Key extends keyof ControlState>(
    key: Key,
    value: ControlState[Key],
  ) {
    setControls((current) => ({ ...current, [key]: value }));
    if (result) setIsStale(true);
    setRepeatMatched(false);
  }

  function executeExperiment(config: ExperimentConfig) {
    if (timer.current !== null) window.clearTimeout(timer.current);
    setIsRunning(true);
    setError(null);
    setRepeatMatched(false);

    timer.current = window.setTimeout(() => {
      try {
        const nextResult = runExperiment(config);
        setRepeatMatched(lastResultId.current === nextResult.id);
        lastResultId.current = nextResult.id;
        setResult(nextResult);
        setIsStale(false);
      } catch (caughtError) {
        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "The experiment could not be completed with these settings.",
        );
      } finally {
        setIsRunning(false);
        timer.current = null;
      }
    }, 220);
  }

  function repeatExactRun() {
    if (!result) return;
    const repeatedControls = toControlState(result.config);
    setControls(repeatedControls);
    executeExperiment(repeatedControls);
  }

  return (
    <div className={styles.page}>
      <header className={styles.intro}>
        <div className={styles.introMark} aria-hidden="true">
          <Beaker />
          <span>LAB / 01</span>
        </div>
        <div className={styles.introCopy}>
          <p className={styles.kicker}>ROUTING EXPERIMENTS</p>
          <h1>Change one condition. Measure what routes do.</h1>
          <p>
            Run the same synthetic payment workload through three algorithms.
            A fixed seed makes every setup reproducible—for a fair comparison
            in a report, demo, or viva.
          </p>
        </div>
      </header>

      <div className={styles.workspace}>
        <aside className={styles.controlRail} aria-labelledby="controls-title">
          <div className={styles.railHeading}>
            <span><SlidersHorizontal aria-hidden="true" /> Variables</span>
            <strong id="controls-title">Experiment setup</strong>
          </div>

          <div className={styles.rangeControl}>
            <div className={styles.controlLabel}>
              <label htmlFor="network-size">Network size</label>
              <output htmlFor="network-size">{controls.networkSize} nodes</output>
            </div>
            <input
              id="network-size"
              max="100"
              min="20"
              onChange={(event) =>
                updateControl("networkSize", Number(event.target.value))
              }
              step="5"
              type="range"
              value={controls.networkSize}
            />
            <div className={styles.rangeEnds}><span>20</span><span>100</span></div>
          </div>

          <div className={styles.rangeControl}>
            <div className={styles.controlLabel}>
              <label htmlFor="failure-rate">Failure rate</label>
              <output htmlFor="failure-rate">
                {(controls.failureRate * 100).toFixed(0)}%
              </output>
            </div>
            <input
              id="failure-rate"
              max="0.3"
              min="0"
              onChange={(event) =>
                updateControl("failureRate", Number(event.target.value))
              }
              step="0.01"
              type="range"
              value={controls.failureRate}
            />
            <div className={styles.rangeEnds}><span>0%</span><span>30%</span></div>
          </div>

          <div className={styles.rangeControl}>
            <div className={styles.controlLabel}>
              <label htmlFor="payment-amount">Payment size</label>
              <output htmlFor="payment-amount">
                {compactFormatter.format(controls.paymentAmount)} sats
              </output>
            </div>
            <input
              id="payment-amount"
              max="1000000"
              min="10000"
              onChange={(event) =>
                updateControl("paymentAmount", Number(event.target.value))
              }
              step="10000"
              type="range"
              value={controls.paymentAmount}
            />
            <div className={styles.rangeEnds}><span>10k</span><span>1M</span></div>
          </div>

          <div className={styles.rangeControl}>
            <div className={styles.controlLabel}>
              <label htmlFor="iterations">Payments per algorithm</label>
              <output htmlFor="iterations">
                {numberFormatter.format(controls.iterations)}
              </output>
            </div>
            <input
              id="iterations"
              max="2000"
              min="100"
              onChange={(event) =>
                updateControl("iterations", Number(event.target.value))
              }
              step="100"
              type="range"
              value={controls.iterations}
            />
            <div className={styles.rangeEnds}><span>100</span><span>2,000</span></div>
          </div>

          <div className={styles.seedControl}>
            <label htmlFor="experiment-seed">Reproduction seed</label>
            <input
              id="experiment-seed"
              inputMode="numeric"
              max="999999"
              min="1"
              onChange={(event) =>
                updateControl("seed", Number(event.target.value))
              }
              type="number"
              value={controls.seed}
            />
            <p>Same settings + same seed = same result ID and values.</p>
          </div>

          <button
            className={styles.runButton}
            disabled={isRunning}
            onClick={() => executeExperiment(controls)}
            type="button"
          >
            {isRunning ? <RefreshCw aria-hidden="true" /> : <Play aria-hidden="true" />}
            {isRunning ? "Running simulation…" : result ? "Run new setup" : "Run experiment"}
          </button>

          {result ? (
            <button
              className={styles.repeatButton}
              disabled={isRunning}
              onClick={repeatExactRun}
              type="button"
            >
              <CopyCheck aria-hidden="true" />
              Repeat exact run
            </button>
          ) : null}

          <p className={styles.syntheticTag}>
            <span /> SYNTHETIC · LOCAL · NO REAL PAYMENTS
          </p>
        </aside>

        <section className={styles.resultsSurface} aria-labelledby="results-title">
          {isRunning ? (
            <div className={styles.loadingState} aria-live="polite" role="status">
              <div className={styles.loadingGlyph} aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
              <p className={styles.kicker}>EXPERIMENT IN PROGRESS</p>
              <h2 id="results-title">Testing the same journeys three ways.</h2>
              <ol>
                <li className={styles.loadingActive}>Building seeded network</li>
                <li>Applying simulated failures</li>
                <li>Comparing route outcomes</li>
              </ol>
            </div>
          ) : error ? (
            <div className={styles.errorState} role="alert">
              <p className={styles.kicker}>EXPERIMENT STOPPED</p>
              <h2 id="results-title">These settings could not be tested.</h2>
              <p>{error}</p>
              <button onClick={() => executeExperiment(controls)} type="button">
                Try again
              </button>
            </div>
          ) : result && summary ? (
            <div className={styles.resultContent}>
              <div className={styles.resultHeader}>
                <div>
                  <p className={styles.kicker}>EXPERIMENT COMPLETE</p>
                  <h2 id="results-title">
                    {numberFormatter.format(result.config.iterations)} journeys,
                    repeated per algorithm.
                  </h2>
                </div>
                <div className={styles.resultIdentity}>
                  <span>{result.id.replace("experiment-", "RUN ")}</span>
                  {repeatMatched ? (
                    <strong><Check aria-hidden="true" /> Exact repeat matched</strong>
                  ) : null}
                </div>
              </div>

              {isStale ? (
                <p className={styles.staleNotice}>
                  Controls changed. Results below still describe the last completed run.
                </p>
              ) : null}

              <dl className={styles.summaryStrip}>
                <div>
                  <dt>Best success rate</dt>
                  <dd>{summary.mostSuccessful
                    ? `${(summary.mostSuccessful.successRate * 100).toFixed(1)}%`
                    : "—"}</dd>
                  <small>{summary.mostSuccessful
                    ? algorithmNames[summary.mostSuccessful.algorithm]
                    : "No routes succeeded"}</small>
                </div>
                <div>
                  <dt>Lowest successful fee</dt>
                  <dd>{summary.lowestFee
                    ? `${summary.lowestFee.averageFee.toFixed(1)} sats`
                    : "—"}</dd>
                  <small>{summary.lowestFee
                    ? algorithmNames[summary.lowestFee.algorithm]
                    : "No successful fees"}</small>
                </div>
                <div>
                  <dt>Fewest average hops</dt>
                  <dd>{summary.fewestHops
                    ? summary.fewestHops.averageHops.toFixed(1)
                    : "—"}</dd>
                  <small>{summary.fewestHops
                    ? algorithmNames[summary.fewestHops.algorithm]
                    : "No successful routes"}</small>
                </div>
                <div>
                  <dt>Total failed trials</dt>
                  <dd>{numberFormatter.format(summary.failures)}</dd>
                  <small>Across {numberFormatter.format(result.totalSimulatedPayments)} trials</small>
                </div>
              </dl>

              <div className={styles.plotSection}>
                <div className={styles.plotHeading}>
                  <div>
                    <p className={styles.kicker}>ALGORITHM COMPARISON</p>
                    <h3>One workload, three definitions of “best.”</h3>
                  </div>
                  <p>
                    Switch the measured outcome; the test population and failure
                    pattern stay fixed for every algorithm.
                  </p>
                </div>
                <AlgorithmComparisonChart results={result.algorithms} />
              </div>

              <div className={styles.resultTableWrap}>
                <table>
                  <caption>Complete outcome ledger for this run</caption>
                  <thead>
                    <tr>
                      <th scope="col">Algorithm</th>
                      <th scope="col">Success</th>
                      <th scope="col">Avg. fee</th>
                      <th scope="col">Avg. hops</th>
                      <th scope="col">Latency</th>
                      <th scope="col">Failed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.algorithms.map((algorithm) => (
                      <tr key={algorithm.algorithm}>
                        <th scope="row">{algorithmNames[algorithm.algorithm]}</th>
                        <td>{(algorithm.successRate * 100).toFixed(1)}%</td>
                        <td>{algorithm.averageFee.toFixed(1)} sats</td>
                        <td>{algorithm.averageHops.toFixed(1)}</td>
                        <td>{algorithm.averageLatencyMs.toFixed(0)} ms</td>
                        <td>{numberFormatter.format(algorithm.failed)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <aside className={styles.methodNote}>
                <div>
                  <p className={styles.kicker}>HOW TO READ THIS EXPERIMENT</p>
                  <h3>A controlled comparison, not a prediction.</h3>
                </div>
                <div className={styles.methodColumns}>
                  <p><strong>Independent variable</strong>The route-selection algorithm changes.</p>
                  <p><strong>Controlled variables</strong>Network, payment pairs, amount, failures, and random seed stay fixed.</p>
                  <p><strong>Measured outcomes</strong>Success, forwarding fee, route length, latency, and failure count.</p>
                  <p><strong>Limitation</strong>Generated topology and estimated probabilities do not represent live Lightning behavior.</p>
                </div>
              </aside>
            </div>
          ) : (
            <div className={styles.emptyState}>
              <div className={styles.emptyDiagram} aria-hidden="true">
                <span>A</span><i /><span>B</span><i /><span>C</span>
              </div>
              <p className={styles.kicker}>NO RESULTS YET</p>
              <h2 id="results-title">Set the conditions, then run the same map three ways.</h2>
              <p>
                Start with the baseline to compare a route optimized for hops,
                one optimized for fees, and one that balances cost with route quality.
              </p>
              <button onClick={() => executeExperiment(controls)} type="button">
                <Play aria-hidden="true" /> Run the baseline
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
