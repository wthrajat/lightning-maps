import type { Metadata } from "next";
import {
  ArrowRight,
  BadgeCheck,
  CircleOff,
  FlaskConical,
  GitBranch,
  Route,
  ShieldAlert,
} from "lucide-react";
import Link from "next/link";

import styles from "@/components/education/education-pages.module.css";

export const metadata: Metadata = {
  title: "About the project",
  description:
    "The approach, ecosystem context, accuracy boundaries, and limitations behind the Lightning Maps educational routing simulator.",
};

const scoringSignals = [
  "routing cost",
  "estimated reliability",
  "usable liquidity",
  "route length",
  "estimated latency",
];

const methodSteps = [
  {
    title: "Build a known network",
    text: "A seeded generator creates human-readable nodes and channels, so the same scenario can be reproduced and discussed.",
  },
  {
    title: "Compare routing objectives",
    text: "Shortest, cheapest, and balanced strategies evaluate the same graph through different priorities and constraints.",
  },
  {
    title: "Explain the recommendation",
    text: "The interface reports the route, tradeoffs, bottleneck, and estimated outcome in normal language alongside the graph.",
  },
];

const boundaries = [
  {
    simulated: "A small, deterministic Lightning-inspired network",
    excluded: "The live public Lightning Network",
  },
  {
    simulated: "Estimated fees, latency, capacity, and success signals",
    excluded: "Real network measurements or guaranteed outcomes",
  },
  {
    simulated: "Graph algorithms with explainable scoring weights",
    excluded: "Any operator’s production routing algorithm",
  },
  {
    simulated: "Test payments that animate through sample channels",
    excluded: "Wallets, private keys, nodes, or real-money transfers",
  },
];

export default function AboutPage() {
  return (
    <main className={styles.educationPage} id="main-content">
      <section className={styles.aboutHero}>
        <div>
          <p className={styles.heroMarker}>About the project</p>
          <h1>A routing study you can inspect.</h1>
        </div>
        <div className={styles.aboutHeroStatement}>
          <p>
            <strong>Google Maps for Lightning Payments</strong> is an educational,
            deterministic simulation of a distributed payment network.
          </p>
          <span>
            Its job is to make graph optimization legible: what path was chosen,
            what made another path fail, and how the answer changes when the
            network changes.
          </span>
        </div>
      </section>

      <section className={styles.problemStatement}>
        <div className={styles.problemIcon}>
          <GitBranch aria-hidden="true" />
        </div>
        <div>
          <p>The problem</p>
          <h2>
            Finding a reliable route through a distributed payment network is a
            graph optimization problem.
          </h2>
        </div>
        <p>
          The fewest-hop path may lack usable capacity. The cheapest path may be
          unreliable. A strong router has to reject impossible paths, compare
          competing qualities, and communicate uncertainty honestly.
        </p>
      </section>

      <section aria-labelledby="approach-heading" className={styles.approachSection}>
        <div className={styles.aboutSectionIntro}>
          <p>Our approach</p>
          <div>
            <h2 id="approach-heading">Keep the network synthetic and the reasoning visible.</h2>
            <p>
              We use a controlled graph so an evaluator can reproduce a result,
              alter one condition, and observe exactly why the selected route
              changes.
            </p>
          </div>
        </div>

        <div className={styles.methodFlow}>
          {methodSteps.map((step, index) => (
            <article key={step.title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </div>
              {index < methodSteps.length - 1 ? (
                <ArrowRight aria-hidden="true" />
              ) : (
                <BadgeCheck aria-hidden="true" />
              )}
            </article>
          ))}
        </div>

        <div className={styles.signalBand}>
          <p>Signals compared</p>
          <ul>
            {scoringSignals.map((signal) => (
              <li key={signal}>{signal}</li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="boundaries-heading" className={styles.boundariesSection}>
        <div className={styles.aboutSectionIntro}>
          <p>Limitations</p>
          <div>
            <h2 id="boundaries-heading">Know what the demonstration can—and cannot—show.</h2>
            <p>
              The controlled data is a teaching strength and a real-world
              limitation. Results describe this simulator, not the state or
              performance of a live payment network.
            </p>
          </div>
        </div>

        <div className={styles.boundaryTable} role="table" aria-label="Project boundaries">
          <div className={styles.boundaryHeader} role="row">
            <span role="columnheader">
              <FlaskConical aria-hidden="true" /> We simulate
            </span>
            <span role="columnheader">
              <CircleOff aria-hidden="true" /> We do not do
            </span>
          </div>
          {boundaries.map((boundary) => (
            <div className={styles.boundaryRow} key={boundary.simulated} role="row">
              <span role="cell">{boundary.simulated}</span>
              <span role="cell">{boundary.excluded}</span>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="ecosystem-heading" className={styles.ecosystemSection}>
        <div className={styles.ecosystemLabel}>
          <Route aria-hidden="true" />
          <span>Ecosystem context</span>
        </div>
        <div className={styles.ecosystemCopy}>
          <h2 id="ecosystem-heading">Why this problem matters beyond the classroom.</h2>
          <p>
            Network intelligence, payments, liquidity, and routing are practical
            concerns throughout the Lightning infrastructure ecosystem. That
            context inspired this college project to explore how a routing problem
            could be visualized and taught.
          </p>
          <p>
            The project uses synthetic data and does not claim that its sample
            network, scoring formula, or routing decisions reflect any production
            system.
          </p>
        </div>
        <aside className={styles.affiliationNote}>
          <strong>Educational and independent</strong>
          <p>
            Lightning Maps is a standalone educational project and is not
            presented as a production routing service.
          </p>
        </aside>
      </section>

      <section aria-label="Important project disclaimer" className={styles.disclaimerSection}>
        <ShieldAlert aria-hidden="true" />
        <div>
          <p>Important disclaimer</p>
          <h2>
            This is an educational simulation. It does not execute real Bitcoin
            or Lightning payments.
          </h2>
          <span>
            It never asks for a wallet, seed phrase, private key, node credential,
            or real funds. All displayed participants, balances, fees, success
            probabilities, and network events are synthetic estimates.
          </span>
        </div>
      </section>

      <section className={styles.aboutNext}>
        <div>
          <p>See the method in motion</p>
          <h2>Change one constraint and inspect the next route.</h2>
        </div>
        <div>
          <Link className="button button--primary" href="/explore">
            Open the explorer <ArrowRight aria-hidden="true" />
          </Link>
          <Link className="button button--secondary" href="/learn">
            Learn from the beginning
          </Link>
        </div>
      </section>
    </main>
  );
}
