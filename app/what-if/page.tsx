import type { Metadata } from "next";

import { ExplorerWorkspace } from "@/components/routing/explorer-workspace";

export const metadata: Metadata = {
  title: "What If? Network Simulator",
  description:
    "Disable participants, add congestion, and reduce simulated liquidity to watch payment routes adapt.",
};

export default function WhatIfPage() {
  return (
    <main id="main-content" className="explore-page">
      <div className="explore-page__title">
        <div>
          <p className="mono">WHAT IF? MODE</p>
          <h1>Stress the network</h1>
        </div>
        <p>
          Change conditions, rerun the same journey, and measure how fees,
          distance, and estimated success respond.
        </p>
      </div>
      <ExplorerWorkspace initialWhatIfOpen />
    </main>
  );
}
