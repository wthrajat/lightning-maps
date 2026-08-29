import {
  ArrowRight,
  CheckCircle2,
  CircleDollarSign,
  Gauge,
  GitBranch,
  Play,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";

import { ConceptStepper } from "@/components/education/concept-stepper";
import { HeroNetwork } from "@/components/education/hero-network";

const factors = [
  {
    icon: CircleDollarSign,
    title: "Cost",
    value: "12 sats",
    description: "The simulated toll paid along a route.",
  },
  {
    icon: ShieldCheck,
    title: "Reliability",
    value: "97%",
    description: "How consistently the participants have forwarded payments.",
  },
  {
    icon: Gauge,
    title: "Available room",
    value: "1.8M sats",
    description: "The smallest usable capacity along the route.",
  },
  {
    icon: GitBranch,
    title: "Distance",
    value: "3 hops",
    description: "How many connections the payment crosses.",
  },
];

export default function HomePage() {
  return (
    <main id="main-content">
      <section className="home-hero">
        <div className="home-hero__copy">
          <p className="synthetic-label">Interactive educational simulation</p>
          <h1>
            Google Maps for
            <span>Lightning Payments</span>
          </h1>
          <p className="home-hero__lede">
            Find, compare, and visualize the best route for a payment across a
            distributed network.
          </p>
          <p className="home-hero__support">
            Explore how cost, usable capacity, reliability, and network
            failures change the journey—without a wallet or real money.
          </p>
          <div className="home-hero__actions">
            <Link className="button button--primary" href="/explore">
              Explore the network
              <ArrowRight aria-hidden="true" />
            </Link>
            <Link className="button button--secondary" href="#how-it-works">
              How does this work?
            </Link>
          </div>
          <ul className="hero-assurances" aria-label="Simulation assurances">
            <li>
              <CheckCircle2 aria-hidden="true" /> No keys or wallet
            </li>
            <li>
              <CheckCircle2 aria-hidden="true" /> Reproducible data
            </li>
            <li>
              <CheckCircle2 aria-hidden="true" /> Every route explained
            </li>
          </ul>
        </div>
        <HeroNetwork />
      </section>

      <section className="home-teach section" id="how-it-works">
        <div className="shell">
          <div className="section-heading section-heading--split">
            <p className="section-heading__marker">First principles</p>
            <div>
              <h2>You already understand the hard part.</h2>
              <p>
                Think roads before payment channels. This four-step story adds
                the technical vocabulary only after the idea is clear.
              </p>
            </div>
          </div>
          <ConceptStepper />
        </div>
      </section>

      <section className="route-factors section">
        <div className="shell">
          <div className="section-heading section-heading--split">
            <p className="section-heading__marker">One route, five tradeoffs</p>
            <div>
              <h2>Shortest does not always mean best.</h2>
              <p>
                The simulator compares measurable qualities rather than hiding
                the result behind a black box.
              </p>
            </div>
          </div>

          <div className="factor-board">
            <div className="factor-board__route">
              <p className="mono">BALANCED ROUTE</p>
              <div className="route-itinerary" aria-label="Alice to Bob through Charlie and Frank">
                <span>Alice</span>
                <i />
                <span>Charlie</span>
                <i />
                <span>Frank</span>
                <i />
                <span>Bob</span>
              </div>
              <strong>Recommended</strong>
              <p>
                Slightly more expensive than the cheapest option, but every
                connection has enough room and stronger reliability.
              </p>
            </div>
            <div className="factor-list">
              {factors.map((factor) => (
                <article key={factor.title}>
                  <factor.icon aria-hidden="true" />
                  <div>
                    <p>{factor.title}</p>
                    <strong className="mono">{factor.value}</strong>
                  </div>
                  <span>{factor.description}</span>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="home-cta">
        <div className="home-cta__route" aria-hidden="true">
          <i />
          <i />
          <i />
          <i />
        </div>
        <div>
          <p className="mono">READY FOR DEPARTURE</p>
          <h2>Send a payment that cannot spend a sat.</h2>
          <p>
            Choose two participants, compare three algorithms, then interrupt
            the network and watch it find another way.
          </p>
        </div>
        <div className="home-cta__actions">
          <Link className="button button--primary" href="/explore">
            Open explorer <ArrowRight aria-hidden="true" />
          </Link>
          <Link className="button button--secondary" href="/demo">
            <Play aria-hidden="true" /> Watch guided demo
          </Link>
        </div>
      </section>
    </main>
  );
}
