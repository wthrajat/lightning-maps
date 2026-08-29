"use client";

import {
  Activity,
  CircleHelp,
  RadioTower,
  Route,
  ShieldCheck,
  WalletCards,
  Waypoints,
} from "lucide-react";
import { useState } from "react";

import type {
  BottleneckMetric,
  NetworkStats,
} from "@/lib/metrics/types";
import type { NodeRole } from "@/lib/network/types";

import styles from "./network-overview.module.css";

type ConnectedNode = {
  nodeId: string;
  name: string;
  connections: number;
  role: NodeRole;
  region: string;
  reliability: number;
  online: boolean;
};

type NetworkOverviewProps = {
  stats: NetworkStats;
  bottlenecks: BottleneckMetric[];
  connectedNodes: ConnectedNode[];
  networkName: string;
  seed: number;
  generatedAt: string;
};

type MetricId =
  | "participants"
  | "channels"
  | "liquidity"
  | "reliability"
  | "density";

const compactNumber = new Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 1,
});

const wholeNumber = new Intl.NumberFormat("en");

function percent(value: number, digits = 1) {
  return `${(value * 100).toFixed(digits)}%`;
}

function titleCase(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function NetworkOverview({
  stats,
  bottlenecks,
  connectedNodes,
  networkName,
  seed,
  generatedAt,
}: NetworkOverviewProps) {
  const [selectedMetric, setSelectedMetric] =
    useState<MetricId>("participants");

  const metrics = [
    {
      id: "participants" as const,
      label: "Participants",
      value: wholeNumber.format(stats.nodeCount),
      context: `${stats.activeNodes} currently active`,
      icon: RadioTower,
      explanation:
        "A participant is a point in the network that can send, receive, or forward a payment. More participants create more possible destinations, but useful coverage depends on how they connect.",
    },
    {
      id: "channels" as const,
      label: "Connections",
      value: wholeNumber.format(stats.channelCount),
      context: `${stats.enabledChannels} available`,
      icon: Waypoints,
      explanation:
        "A connection is a simulated payment channel—the road between two participants. Only enabled connections can carry a route in the current network state.",
    },
    {
      id: "liquidity" as const,
      label: "Available liquidity",
      value: `${compactNumber.format(stats.totalLiquidity)} sats`,
      context: `${percent(stats.totalLiquidity / stats.totalCapacity)} of capacity`,
      icon: WalletCards,
      explanation:
        "Liquidity is the usable room on every connection. This total adds the currently available simulated balance across channels; a route still needs enough liquidity on every road it uses.",
    },
    {
      id: "reliability" as const,
      label: "Avg. reliability",
      value: percent(stats.averageReliability),
      context: "Across all channels",
      icon: ShieldCheck,
      explanation:
        "Reliability estimates how often a connection can forward successfully under the model. The network average is useful context, but a single weak connection can still reduce a route’s chance of success.",
    },
    {
      id: "density" as const,
      label: "Network density",
      value: percent(stats.networkDensity, 2),
      context: `${stats.averageConnections} avg. links per node`,
      icon: Route,
      explanation:
        "Density compares enabled connections with every connection that could exist between these participants. A sparse network can still route well when hubs bridge otherwise distant groups.",
    },
  ];
  const activeMetric =
    metrics.find((metric) => metric.id === selectedMetric) ?? metrics[0];
  const activeShare = stats.nodeCount
    ? (stats.activeNodes / stats.nodeCount) * 100
    : 0;
  const highestCentrality = bottlenecks[0]?.betweennessCentrality ?? 0;

  return (
    <div className={styles.page}>
      <header className={styles.intro}>
        <div className={styles.kickerRow}>
          <p className={styles.kicker}>NETWORK / BASELINE SNAPSHOT</p>
          <span className={styles.snapshotStatus}>
            <Activity aria-hidden="true" /> {networkName}
          </span>
        </div>
        <div className={styles.introGrid}>
          <h1>Read the network before choosing a route.</h1>
          <div>
            <p className={styles.lede}>
              See where payments have room to move, which participants connect
              the map, and where too many shortest paths depend on one place.
            </p>
            <p className={styles.snapshotMeta}>
              Deterministic seed {seed} · snapshot {generatedAt.slice(0, 10)}
            </p>
          </div>
        </div>
      </header>

      <section className={styles.metricSection} aria-labelledby="metric-title">
        <div className={styles.sectionHeading}>
          <div>
            <p className={styles.eyebrow}>Network index</p>
            <h2 id="metric-title">Five ways to read this map</h2>
          </div>
          <p>Select any metric for a plain-language explanation.</p>
        </div>

        <div className={styles.metricIndex}>
          {metrics.map((metric) => {
            const Icon = metric.icon;
            const selected = selectedMetric === metric.id;

            return (
              <button
                aria-pressed={selected}
                className={selected ? styles.metricSelected : styles.metric}
                key={metric.id}
                onClick={() => setSelectedMetric(metric.id)}
                type="button"
              >
                <span className={styles.metricTopline}>
                  <Icon aria-hidden="true" />
                  {metric.label}
                  <CircleHelp aria-hidden="true" />
                </span>
                <strong>{metric.value}</strong>
                <small>{metric.context}</small>
              </button>
            );
          })}
        </div>

        <div className={styles.metricExplanation} aria-live="polite">
          <p>What “{activeMetric.label}” tells you</p>
          <strong>{activeMetric.explanation}</strong>
        </div>
      </section>

      <div className={styles.analysisLayout}>
        <div className={styles.ledgerColumn}>
          <section className={styles.statusPanel} aria-labelledby="status-title">
            <div className={styles.sectionHeading}>
              <div>
                <p className={styles.eyebrow}>Availability</p>
                <h2 id="status-title">Who can forward right now?</h2>
              </div>
              <p>
                Offline participants and disabled channels are excluded from
                route searches.
              </p>
            </div>

            <div
              aria-label={`${stats.activeNodes} active and ${stats.inactiveNodes} offline participants`}
              className={styles.availabilityBar}
              role="img"
            >
              <span
                className={styles.activeBar}
                style={{ width: `${activeShare}%` }}
              />
              <span
                className={styles.offlineBar}
                style={{ width: `${100 - activeShare}%` }}
              />
            </div>
            <dl className={styles.statusLegend}>
              <div>
                <dt><span className={styles.activeDot} /> Active</dt>
                <dd>{stats.activeNodes}</dd>
              </div>
              <div>
                <dt><span className={styles.offlineDot} /> Offline</dt>
                <dd>{stats.inactiveNodes}</dd>
              </div>
              <div>
                <dt>Disabled connections</dt>
                <dd>{stats.disabledChannels}</dd>
              </div>
            </dl>
            {stats.inactiveNodes === 0 ? (
              <p className={styles.statusNote}>
                This baseline has no offline participants. Failure simulations
                can change this state and force routes around unavailable hubs.
              </p>
            ) : null}
          </section>

          <section className={styles.hubLedger} aria-labelledby="hub-title">
            <div className={styles.sectionHeading}>
              <div>
                <p className={styles.eyebrow}>Connection ledger</p>
                <h2 id="hub-title">Most connected participants</h2>
              </div>
              <p>More links offer more routing choices, but can also concentrate traffic.</p>
            </div>

            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th scope="col">Participant</th>
                    <th scope="col">Role / region</th>
                    <th scope="col">Status</th>
                    <th scope="col">Reliability</th>
                    <th scope="col">Links</th>
                  </tr>
                </thead>
                <tbody>
                  {connectedNodes.map((node, index) => (
                    <tr key={node.nodeId}>
                      <th scope="row">
                        <span className={styles.rank}>{index + 1}</span>
                        {node.name}
                      </th>
                      <td>{titleCase(node.role)} · {node.region}</td>
                      <td>
                        <span className={node.online ? styles.online : styles.offline}>
                          {node.online ? "Active" : "Offline"}
                        </span>
                      </td>
                      <td>{percent(node.reliability)}</td>
                      <td><strong>{node.connections}</strong></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <aside className={styles.bottleneckRail} aria-labelledby="bottleneck-title">
          <div className={styles.railHeading}>
            <p className={styles.eyebrow}>Shortest-path dependency</p>
            <h2 id="bottleneck-title">Potential bottlenecks</h2>
            <p>
              Betweenness centrality measures how often a participant sits on
              the shortest path between other pairs. Higher is more dependent-on,
              not automatically unhealthy.
            </p>
          </div>

          <ol className={styles.bottleneckList}>
            {bottlenecks.map((node, index) => {
              const relativeWidth = highestCentrality
                ? (node.betweennessCentrality / highestCentrality) * 100
                : 0;

              return (
                <li key={node.nodeId}>
                  <div className={styles.bottleneckName}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <strong>{node.name}</strong>
                    <em className={styles[`risk${titleCase(node.risk)}`]}>
                      {node.risk} risk
                    </em>
                  </div>
                  <div className={styles.centralityTrack} aria-hidden="true">
                    <span style={{ width: `${relativeWidth}%` }} />
                  </div>
                  <div className={styles.centralityData}>
                    <span>{node.connections} connections</span>
                    <span>{node.betweennessCentrality.toFixed(3)} centrality</span>
                  </div>
                  <p>{node.explanation}</p>
                </li>
              );
            })}
          </ol>

          <div className={styles.academicNote}>
            <strong>Why this matters to routing</strong>
            <p>
              If a high-centrality participant goes offline, routes may need
              more hops, pay more fees, or become impossible. Centrality describes
              topology; it does not use real-world Lightning traffic.
            </p>
          </div>
        </aside>
      </div>

      <aside className={styles.syntheticCaveat} aria-label="Data caveat">
        <span>SYNTHETIC DATA</span>
        <p>
          Every participant, connection, balance, reliability score, and
          bottleneck on this page is generated from a fixed seed for education.
          This snapshot contains no live Lightning nodes and should not be used
          for real payment decisions.
        </p>
      </aside>
    </div>
  );
}
