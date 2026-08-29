import type { Metadata } from "next";

import { NetworkOverview } from "@/components/network/network-overview";
import { DEFAULT_NETWORK } from "@/data/network";
import {
  calculateBottlenecks,
  calculateNetworkStats,
} from "@/lib/metrics/network";

export const metadata: Metadata = {
  title: "Network Overview",
  description:
    "Inspect connectivity, simulated liquidity, participant availability, and potential routing bottlenecks in a deterministic network.",
};

export default function NetworkPage() {
  const stats = calculateNetworkStats(DEFAULT_NETWORK);
  const bottlenecks = calculateBottlenecks(DEFAULT_NETWORK, 5);
  const nodesById = new Map(
    DEFAULT_NETWORK.nodes.map((node) => [node.id, node]),
  );
  const connectedNodes = stats.mostConnected.map((entry) => {
    const node = nodesById.get(entry.nodeId);

    return {
      ...entry,
      role: node?.role ?? "participant",
      region: node?.region ?? "Unknown",
      reliability: node?.reliability ?? 0,
      online: node?.online ?? false,
    };
  });

  return (
    <main id="main-content">
      <NetworkOverview
        bottlenecks={bottlenecks}
        connectedNodes={connectedNodes}
        generatedAt={DEFAULT_NETWORK.metadata.generatedAt}
        networkName={DEFAULT_NETWORK.metadata.name}
        seed={DEFAULT_NETWORK.metadata.seed}
        stats={stats}
      />
    </main>
  );
}
