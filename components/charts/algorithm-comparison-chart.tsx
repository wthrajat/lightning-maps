"use client";

import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { AlgorithmExperimentResult } from "@/lib/experiments/types";
import type { RoutingStrategy } from "@/lib/routing/types";

import styles from "./experiment-lab.module.css";

type ChartMetric =
  | "successRate"
  | "averageFee"
  | "averageHops"
  | "averageLatencyMs";

type AlgorithmComparisonChartProps = {
  results: AlgorithmExperimentResult[];
};

const algorithmNames: Record<RoutingStrategy, string> = {
  shortest: "Shortest path",
  cheapest: "Lowest fee",
  intelligent: "Balanced score",
};

const metrics: Record<
  ChartMetric,
  { label: string; shortLabel: string; format: (value: number) => string }
> = {
  successRate: {
    label: "Success rate",
    shortLabel: "Success",
    format: (value) => `${(value * 100).toFixed(1)}%`,
  },
  averageFee: {
    label: "Average successful fee",
    shortLabel: "Fee",
    format: (value) => `${value.toFixed(1)} sats`,
  },
  averageHops: {
    label: "Average successful hops",
    shortLabel: "Hops",
    format: (value) => value.toFixed(1),
  },
  averageLatencyMs: {
    label: "Average successful latency",
    shortLabel: "Latency",
    format: (value) => `${value.toFixed(0)} ms`,
  },
};

export function AlgorithmComparisonChart({
  results,
}: AlgorithmComparisonChartProps) {
  const [selectedMetric, setSelectedMetric] =
    useState<ChartMetric>("successRate");
  const selectedDefinition = metrics[selectedMetric];
  const chartData = results.map((result) => ({
    name: algorithmNames[result.algorithm],
    value: result[selectedMetric],
  }));

  return (
    <div className={styles.chartShell}>
      <div className={styles.chartTabs} aria-label="Chart metric">
        {(Object.keys(metrics) as ChartMetric[]).map((metric) => (
          <button
            aria-pressed={selectedMetric === metric}
            className={selectedMetric === metric ? styles.chartTabActive : styles.chartTab}
            key={metric}
            onClick={() => setSelectedMetric(metric)}
            type="button"
          >
            {metrics[metric].shortLabel}
          </button>
        ))}
      </div>

      <p className={styles.chartLabel}>{selectedDefinition.label}</p>
      <div className={styles.chartCanvas}>
        <ResponsiveContainer height="100%" width="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ bottom: 8, left: 4, right: 28, top: 8 }}
          >
            <CartesianGrid
              horizontal={false}
              stroke="var(--color-line)"
              strokeDasharray="3 5"
            />
            <XAxis
              axisLine={false}
              domain={selectedMetric === "successRate" ? [0, 1] : [0, "auto"]}
              tick={{ fill: "var(--color-muted)", fontSize: 11 }}
              tickFormatter={(value: number) => selectedDefinition.format(value)}
              tickLine={false}
              type="number"
            />
            <YAxis
              axisLine={false}
              dataKey="name"
              tick={{ fill: "var(--color-ink-soft)", fontSize: 12 }}
              tickLine={false}
              type="category"
              width={112}
            />
            <Tooltip
              contentStyle={{
                background: "var(--color-panel)",
                border: "1px solid var(--color-line)",
                borderRadius: "var(--radius-sm)",
                boxShadow: "var(--shadow-low)",
                color: "var(--color-ink)",
                fontSize: "0.75rem",
              }}
              cursor={{ fill: "var(--color-surface)" }}
              formatter={(value) => [
                selectedDefinition.format(Number(value)),
                selectedDefinition.label,
              ]}
            />
            <Bar
              dataKey="value"
              fill="var(--color-primary)"
              isAnimationActive={false}
              maxBarSize={34}
              radius={[0, 5, 5, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
