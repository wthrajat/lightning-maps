"use client";

import { ArrowRight, Play, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";

import styles from "./education-pages.module.css";

type NodeName = "A" | "B" | "C" | "D";
type EdgeName = "AB" | "AC" | "BD" | "CD";

type ExplorationStep = {
  title: string;
  explanation: string;
  current: NodeName;
  visited: NodeName[];
  route: EdgeName[];
  distances: Record<NodeName, string>;
};

const explorationSteps: ExplorationStep[] = [
  {
    title: "Begin at A",
    explanation:
      "The search starts at A with a total score of 0. Its connected paths are still unknown.",
    current: "A",
    visited: [],
    route: [],
    distances: { A: "0", B: "∞", C: "∞", D: "∞" },
  },
  {
    title: "Inspect A’s neighbours",
    explanation:
      "A can reach B with score 2 and C with score 1. C is the smallest unfinished option, so it goes next.",
    current: "C",
    visited: ["A"],
    route: ["AB", "AC"],
    distances: { A: "0", B: "2", C: "1", D: "∞" },
  },
  {
    title: "Follow the best known option",
    explanation:
      "From C, the route to D would total 5. The search records that possibility, then returns to the cheaper unfinished B.",
    current: "B",
    visited: ["A", "C"],
    route: ["AC", "CD"],
    distances: { A: "0", B: "2", C: "1", D: "5" },
  },
  {
    title: "Improve the route to D",
    explanation:
      "Going through B reaches D with total score 4. That replaces the previous score of 5 found through C.",
    current: "D",
    visited: ["A", "C", "B"],
    route: ["AB", "BD"],
    distances: { A: "0", B: "2", C: "1", D: "4" },
  },
  {
    title: "Select A → B → D",
    explanation:
      "D is now the lowest-scoring unfinished point. The selected path has a total score of 4.",
    current: "D",
    visited: ["A", "B", "C", "D"],
    route: ["AB", "BD"],
    distances: { A: "0", B: "2", C: "1", D: "4" },
  },
];

const nodes: { name: NodeName; x: number; y: number }[] = [
  { name: "A", x: 64, y: 120 },
  { name: "B", x: 220, y: 56 },
  { name: "C", x: 220, y: 184 },
  { name: "D", x: 386, y: 120 },
];

const edges: {
  name: EdgeName;
  from: NodeName;
  to: NodeName;
  weight: number;
  path: string;
  labelX: number;
  labelY: number;
}[] = [
  {
    name: "AB",
    from: "A",
    to: "B",
    weight: 2,
    path: "M64 120 L220 56",
    labelX: 140,
    labelY: 75,
  },
  {
    name: "AC",
    from: "A",
    to: "C",
    weight: 1,
    path: "M64 120 L220 184",
    labelX: 140,
    labelY: 176,
  },
  {
    name: "BD",
    from: "B",
    to: "D",
    weight: 2,
    path: "M220 56 L386 120",
    labelX: 306,
    labelY: 75,
  },
  {
    name: "CD",
    from: "C",
    to: "D",
    weight: 4,
    path: "M220 184 L386 120",
    labelX: 306,
    labelY: 176,
  },
];

export function AlgorithmLesson() {
  const [stepIndex, setStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const step = explorationSteps[stepIndex];

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);

    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);
    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    if (!isPlaying) {
      return;
    }

    const timer = window.setTimeout(() => {
      const nextStep = Math.min(
        stepIndex + 1,
        explorationSteps.length - 1,
      );

      setStepIndex(nextStep);
      if (nextStep === explorationSteps.length - 1) {
        setIsPlaying(false);
      }
    }, 950);

    return () => window.clearTimeout(timer);
  }, [isPlaying, stepIndex]);

  function runExploration() {
    if (prefersReducedMotion) {
      setStepIndex(explorationSteps.length - 1);
      setIsPlaying(false);
      return;
    }

    setStepIndex(0);
    setIsPlaying(true);
  }

  function resetExploration() {
    setIsPlaying(false);
    setStepIndex(0);
  }

  function showNextStep() {
    setIsPlaying(false);
    setStepIndex((current) =>
      Math.min(current + 1, explorationSteps.length - 1),
    );
  }

  return (
    <section
      aria-labelledby="algorithm-lesson-title"
      className={styles.algorithmLesson}
      id="algorithm"
    >
      <div className={styles.algorithmHeading}>
        <div>
          <p className={styles.algorithmMarker}>Interactive shortest-path lesson</p>
          <h3 id="algorithm-lesson-title">
            Watch a good answer replace an earlier one.
          </h3>
        </div>
        <p>
          Each line has a simple score. The search always expands the lowest
          total it currently knows, then updates a destination when it discovers
          something better.
        </p>
      </div>

      <div className={styles.algorithmWorkspace}>
        <div className={styles.algorithmCanvas}>
          <svg
            aria-hidden="true"
            className={styles.algorithmGraph}
            viewBox="0 0 450 240"
          >
            {edges.map((edge) => {
              const isActive = step.route.includes(edge.name);
              const isFinal =
                stepIndex === explorationSteps.length - 1 &&
                (edge.name === "AB" || edge.name === "BD");

              return (
                <g key={edge.name}>
                  <path
                    className={
                      isFinal
                        ? styles.algorithmEdgeFinal
                        : isActive
                          ? styles.algorithmEdgeActive
                          : styles.algorithmEdge
                    }
                    d={edge.path}
                  />
                  <g
                    className={styles.edgeWeight}
                    transform={`translate(${edge.labelX} ${edge.labelY})`}
                  >
                    <circle r="13" />
                    <text dy="4">{edge.weight}</text>
                  </g>
                </g>
              );
            })}
            {nodes.map((node) => {
              const isCurrent = step.current === node.name;
              const isVisited = step.visited.includes(node.name);

              return (
                <g
                  className={
                    isCurrent
                      ? styles.algorithmNodeCurrent
                      : isVisited
                        ? styles.algorithmNodeVisited
                        : styles.algorithmNode
                  }
                  key={node.name}
                  transform={`translate(${node.x} ${node.y})`}
                >
                  <circle r="25" />
                  <text dy="6">{node.name}</text>
                </g>
              );
            })}
          </svg>
          <p className={styles.graphCaption}>
            <span>Line number = score</span>
            <span>Highlighted point = inspecting now</span>
          </p>
        </div>

        <div className={styles.algorithmReadout}>
          <p className={styles.stepCounter}>
            Step {stepIndex + 1} of {explorationSteps.length}
          </p>
          <div aria-atomic="true" aria-live="polite">
            <h4>{step.title}</h4>
            <p>{step.explanation}</p>
          </div>

          <dl className={styles.distanceReadout}>
            {Object.entries(step.distances).map(([node, distance]) => (
              <div key={node}>
                <dt>Best to {node}</dt>
                <dd>{distance}</dd>
              </div>
            ))}
          </dl>

          <div className={styles.algorithmActions}>
            <button
              className="button button--primary"
              disabled={isPlaying}
              onClick={runExploration}
              type="button"
            >
              <Play aria-hidden="true" />
              {isPlaying ? "Exploring…" : "Run exploration"}
            </button>
            <button
              aria-label="Reset algorithm lesson"
              className="button button--secondary"
              onClick={resetExploration}
              type="button"
            >
              <RotateCcw aria-hidden="true" />
              Reset
            </button>
            <button
              className="button button--ghost"
              disabled={
                isPlaying || stepIndex === explorationSteps.length - 1
              }
              onClick={showNextStep}
              type="button"
            >
              Next step
              <ArrowRight aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      <div className={styles.scoreFormula}>
        <p>Beyond this small example</p>
        <code>
          score = cost + reliability penalty + liquidity penalty + hop penalty
        </code>
        <span>
          Our simulator can change these weights by objective. This formula is
          educational and does not claim to represent any company’s production
          router.
        </span>
      </div>
    </section>
  );
}
