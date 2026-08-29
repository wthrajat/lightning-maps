import type { Metadata } from "next";

import { ExplorerWorkspace } from "@/components/routing/explorer-workspace";

export const metadata: Metadata = {
  title: "Network Explorer",
  description:
    "Compare payment routes and simulate network conditions in a deterministic Lightning-inspired network.",
};

export default function ExplorePage() {
  return (
    <main id="main-content" className="explore-page">
      <div className="explore-page__title">
        <div>
          <p className="mono">NETWORK EXPLORER</p>
          <h1>Route a simulated payment</h1>
        </div>
        <p>
          A connection is a road. Liquidity is the room on it. Pick a journey and let three algorithms compare the options.
        </p>
      </div>
      <ExplorerWorkspace />
    </main>
  );
}
