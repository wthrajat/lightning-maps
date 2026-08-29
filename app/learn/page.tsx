import type { Metadata } from "next";
import {
  ArrowDown,
  ArrowRight,
  CircleDollarSign,
  Clock3,
  GitBranch,
  Route,
  ShieldCheck,
  Truck,
} from "lucide-react";
import Link from "next/link";

import { AlgorithmLesson } from "@/components/education/algorithm-lesson";
import { Glossary } from "@/components/education/glossary";
import styles from "@/components/education/education-pages.module.css";

export const metadata: Metadata = {
  title: "Learn payment routing",
  description:
    "A plain-language mini-course on Bitcoin Lightning payment routes, channels, liquidity, and shortest-path algorithms.",
};

const courseStops = [
  { id: "the-problem", title: "The problem" },
  { id: "digital-payments", title: "Digital payments" },
  { id: "bitcoin", title: "Bitcoin" },
  { id: "lightning", title: "Lightning" },
  { id: "channels", title: "Channels" },
  { id: "liquidity", title: "Liquidity" },
  { id: "routing", title: "Routing" },
  { id: "difficulty", title: "Why it is difficult" },
  { id: "ecosystem-context", title: "Ecosystem context" },
] as const;

const routingFactors = [
  {
    label: "Cost",
    detail: "Every forwarding step can add a small simulated toll.",
    icon: CircleDollarSign,
  },
  {
    label: "Capacity",
    detail: "Every connection must have enough usable room in the right direction.",
    icon: Truck,
  },
  {
    label: "Reliability",
    detail: "A short route is poor if one participant often cannot forward.",
    icon: ShieldCheck,
  },
  {
    label: "Latency",
    detail: "More or slower steps can increase the estimated travel time.",
    icon: Clock3,
  },
  {
    label: "Failures",
    detail: "A closed or congested connection can force the router to try again.",
    icon: GitBranch,
  },
];

function CourseNumber({ children }: { children: string }) {
  return <span className={styles.courseNumber}>{children}</span>;
}

export default function LearnPage() {
  return (
    <main className={styles.educationPage} id="main-content">
      <section className={styles.learnHero}>
        <div className={styles.learnHeroCopy}>
          <p className={styles.heroMarker}>Learn · a nine-stop mini-course</p>
          <h1>Follow a payment before learning its vocabulary.</h1>
          <p className={styles.heroLede}>
            If you can understand a route on a map, you can understand the core
            routing problem. We start with roads and travelers, then introduce
            Bitcoin and Lightning one idea at a time.
          </p>
          <div className={styles.heroActions}>
            <a className="button button--primary" href="#course">
              Begin with A and B
              <ArrowDown aria-hidden="true" />
            </a>
            <a className="button button--secondary" href="#glossary">
              Translate the terms
            </a>
          </div>
          <p className={styles.heroNote}>
            About 10 minutes · no prior Bitcoin knowledge required
          </p>
        </div>

        <div
          aria-label="A route from You through two possible paths to Destination"
          className={styles.heroRouteMap}
          role="img"
        >
          <div className={`${styles.mapStop} ${styles.mapStopStart}`}>
            <span>You</span>
          </div>
          <div className={`${styles.mapStop} ${styles.mapStopNorth}`}>
            <span>Short</span>
            <small>busy</small>
          </div>
          <div className={`${styles.mapStop} ${styles.mapStopSouth}`}>
            <span>Longer</span>
            <small>clear</small>
          </div>
          <div className={`${styles.mapStop} ${styles.mapStopEnd}`}>
            <span>Destination</span>
          </div>
          <svg aria-hidden="true" viewBox="0 0 540 330">
            <path className={styles.heroRouteMuted} d="M70 165 C160 52 290 52 466 165" />
            <path className={styles.heroRouteSelected} d="M70 165 C176 276 310 276 466 165" />
          </svg>
          <p className={styles.mapDecision}>
            <span>Recommended</span>
            Enough room, fewer failure signals
          </p>
        </div>
      </section>

      <section className={styles.courseSection} id="course">
        <div className={styles.courseLayout}>
          <aside className={styles.courseRail}>
            <p>Your route through the ideas</p>
            <nav aria-label="Mini-course chapters">
              <ol>
                {courseStops.map((stop, index) => (
                  <li key={stop.id}>
                    <a href={`#${stop.id}`}>
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      {stop.title}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </aside>

          <ol className={styles.courseChapters}>
            <li className={styles.courseChapter} id="the-problem">
              <CourseNumber>01</CourseNumber>
              <div className={styles.chapterCopy}>
                <h2>How do you move something from A to B?</h2>
                <p className={styles.chapterLead}>
                  In a network, the sender and destination may not connect
                  directly. A journey can pass through several intermediate
                  points, and more than one path may be possible.
                </p>
                <p>
                  The route finder’s first job is simple to state: discover the
                  paths that connect the two ends. The interesting work begins
                  when those paths have different limits.
                </p>
                <a className={styles.inlineLink} href="#algorithm">
                  See the search step by step <ArrowRight aria-hidden="true" />
                </a>
              </div>
              <div
                aria-label="A branching network with two ways to reach B"
                className={styles.chapterRoute}
                role="img"
              >
                <span>A</span>
                <i />
                <b>1</b>
                <b>2</b>
                <i />
                <span>B</span>
              </div>
            </li>

            <li className={styles.courseChapter} id="digital-payments">
              <CourseNumber>02</CourseNumber>
              <div className={styles.chapterCopy}>
                <h2>Digital payments are not always direct.</h2>
                <p className={styles.chapterLead}>
                  A direct payment is one connection: sender to recipient. An
                  intermediary-based payment uses trusted or connected parties
                  in between to help value reach its destination.
                </p>
                <div className={styles.paymentComparison}>
                  <div>
                    <strong>Direct</strong>
                    <span>Alice</span>
                    <i />
                    <span>Bob</span>
                  </div>
                  <div>
                    <strong>Through a network</strong>
                    <span>Alice</span>
                    <i />
                    <span>Charlie</span>
                    <i />
                    <span>Bob</span>
                  </div>
                </div>
              </div>
            </li>

            <li className={styles.courseChapter} id="bitcoin">
              <CourseNumber>03</CourseNumber>
              <div className={styles.chapterCopy}>
                <h2>Bitcoin is the base layer.</h2>
                <p className={styles.chapterLead}>
                  Bitcoin is digital money and a public network for recording
                  ownership without a single central operator.
                </p>
                <p>
                  That is enough context for this project. We do not need mining,
                  wallets, or blockchain internals to understand how a payment
                  route is chosen.
                </p>
              </div>
              <aside className={styles.conciseNote}>
                <span>Keep this idea</span>
                <strong>Bitcoin provides the settlement foundation.</strong>
              </aside>
            </li>

            <li className={styles.courseChapter} id="lightning">
              <CourseNumber>04</CourseNumber>
              <div className={styles.chapterCopy}>
                <h2>Lightning adds a connected payment network.</h2>
                <p className={styles.chapterLead}>
                  The Lightning Network is built on top of Bitcoin. Participants
                  create connections and can route a payment through one another
                  when the sender and recipient do not share a connection.
                </p>
                <p>
                  A routed payment is conditional: the steps are designed to
                  complete together or fail rather than leave an intermediate
                  participant paying out alone.
                </p>
              </div>
            </li>

            <li className={styles.courseChapter} id="channels">
              <CourseNumber>05</CourseNumber>
              <div className={styles.chapterCopy}>
                <h2>A payment channel is a road.</h2>
                <p className={styles.chapterLead}>
                  A channel is a connection between two participants that can be
                  used to send or route payments.
                </p>
                <p>
                  Like a road, it has limits and conditions. Two nodes appearing
                  connected on the map does not guarantee that every payment can
                  pass in either direction.
                </p>
              </div>
              <div className={styles.roadAnalogy} aria-hidden="true">
                <span>Node</span>
                <div>
                  <i />
                  <small>payment channel</small>
                </div>
                <span>Node</span>
              </div>
            </li>

            <li className={styles.courseChapter} id="liquidity">
              <CourseNumber>06</CourseNumber>
              <div className={styles.chapterCopy}>
                <h2>A road can exist and still not fit the truck.</h2>
                <p className={styles.chapterLead}>
                  Liquidity is the usable value available to move through a
                  channel in a particular direction. A 50,000-sat simulated
                  payment needs at least that much usable room at every step.
                </p>
                <p>
                  Capacity describes the whole channel. Liquidity describes what
                  is available in the direction the payment needs. That is an
                  important distinction for routing.
                </p>
              </div>
              <aside className={styles.truckAnalogy}>
                <Truck aria-hidden="true" />
                <div>
                  <span>Payment size</span>
                  <strong>50,000 sats</strong>
                </div>
                <ArrowRight aria-hidden="true" />
                <div>
                  <span>Usable room</span>
                  <strong>42,000 sats</strong>
                </div>
                <p>Route unavailable: the payment is larger than this lane.</p>
              </aside>
            </li>

            <li className={styles.courseChapter} id="routing">
              <CourseNumber>07</CourseNumber>
              <div className={styles.chapterCopy}>
                <h2>Routing compares complete paths.</h2>
                <p className={styles.chapterLead}>
                  A router explores the network, removes paths that cannot carry
                  the amount, and scores the remaining choices. “Best” depends
                  on what the sender values.
                </p>
                <p>
                  A shortest-path algorithm gives us a clear foundation: add the
                  score of each connection and keep the lowest total discovered.
                </p>
              </div>
              <div className={styles.routeChoice}>
                <p>
                  <span>Shortest</span>
                  Alice → Eve → Bob
                  <strong>2 hops · low room</strong>
                </p>
                <p className={styles.routeChoiceSelected}>
                  <span>Balanced</span>
                  Alice → Charlie → Frank → Bob
                  <strong>3 hops · stronger conditions</strong>
                </p>
              </div>
            </li>

            <li className={styles.courseChapterWide}>
              <AlgorithmLesson />
            </li>

            <li className={styles.courseChapter} id="difficulty">
              <CourseNumber>08</CourseNumber>
              <div className={styles.chapterCopy}>
                <h2>The shortest route may be the wrong route.</h2>
                <p className={styles.chapterLead}>
                  Real routing decisions involve incomplete, changing
                  conditions. This simulator makes five tradeoffs visible so the
                  recommendation can be explained instead of treated as magic.
                </p>
                <dl className={styles.factorList}>
                  {routingFactors.map((factor) => (
                    <div key={factor.label}>
                      <dt>
                        <factor.icon aria-hidden="true" />
                        {factor.label}
                      </dt>
                      <dd>{factor.detail}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </li>

            <li className={styles.courseChapter} id="ecosystem-context">
              <CourseNumber>09</CourseNumber>
              <div className={styles.chapterCopy}>
                <h2>Why this problem matters in real networks.</h2>
                <p className={styles.chapterLead}>
                  Lightning infrastructure spans payments, liquidity, routing,
                  and network data. Those areas make route quality and network
                  visibility practical engineering problems, not just classroom
                  diagrams.
                </p>
                <p>
                  This project independently explores a simplified version of
                  that routing problem using deterministic synthetic data.
                </p>
              </div>
              <aside className={styles.unofficialNote}>
                <strong>Simulation, not production</strong>
                <p>
                  Lightning Maps is an educational college project and does not
                  claim to reproduce any production routing system.
                </p>
              </aside>
            </li>
          </ol>
        </div>
      </section>

      <section
        aria-labelledby="glossary-heading"
        className={styles.glossarySection}
        id="glossary"
      >
        <div className={styles.sectionHeading}>
          <p>Everyday language ↔ Lightning language</p>
          <div>
            <h2 id="glossary-heading">Translate a term at three depths.</h2>
            <p>
              Choose a term. Start with the plain meaning, use the map analogy,
              then open the technical definition when you need precision.
            </p>
          </div>
        </div>
        <Glossary />
      </section>

      <section className={styles.learnNext}>
        <div>
          <Route aria-hidden="true" />
          <p>Course complete</p>
          <h2>Now make the network answer to you.</h2>
          <span>
            Change the amount, compare objectives, and interrupt a simulated
            route. Every result stays synthetic and explainable.
          </span>
        </div>
        <Link className="button button--primary" href="/explore">
          Explore the network <ArrowRight aria-hidden="true" />
        </Link>
      </section>
    </main>
  );
}
