"use client";

import { ArrowRight } from "lucide-react";
import { useState } from "react";

import styles from "./education-pages.module.css";

type GlossaryEntry = {
  term: string;
  everyday: string;
  simple: string;
  analogy: string;
  technical: string;
};

const glossaryEntries: GlossaryEntry[] = [
  {
    term: "Bitcoin",
    everyday: "A shared money system",
    simple:
      "A digital currency and public network that can transfer and record value without one central operator.",
    analogy:
      "Think of a shared account book that many computers check together instead of one bank keeping the only copy.",
    technical:
      "A decentralized peer-to-peer monetary network whose ledger is secured by proof of work. One bitcoin contains 100 million satoshis.",
  },
  {
    term: "Lightning Network",
    everyday: "A network of connected roads",
    simple:
      "A payment network built on Bitcoin that lets payments travel through connections between participants.",
    analogy:
      "Bitcoin is the settlement map; Lightning is a network of quicker local roads drawn on top of it.",
    technical:
      "A layer-two protocol that uses payment channels and conditional multi-hop payments, with channel opening and closing anchored to Bitcoin.",
  },
  {
    term: "Node",
    everyday: "A person or place",
    simple:
      "A participant in the network that can connect to others and may forward payments.",
    analogy:
      "A node is a stop on a map: a place where routes meet and a journey can continue in more than one direction.",
    technical:
      "Lightning software that maintains peer connections and channels, exchanges routing information, and can forward conditional payments.",
  },
  {
    term: "Payment channel",
    everyday: "A road",
    simple:
      "A connection between two participants that they can use to send or route payments.",
    analogy:
      "A two-way road between two towns. It may exist, but each direction can have a different amount of usable room.",
    technical:
      "A two-party relationship backed by bitcoin in which updated balances can be exchanged off-chain until the channel is closed.",
  },
  {
    term: "Liquidity",
    everyday: "Usable room",
    simple:
      "How much value is currently available for a payment to move through a connection in one direction.",
    analogy:
      "The room left on your side of a road. A road can be wide overall while the lane you need is already full.",
    technical:
      "The directional channel balance currently available to forward a payment. It is private in real networks and is not the same as total capacity.",
  },
  {
    term: "Routing",
    everyday: "Trip planning",
    simple:
      "Choosing a sequence of connections that can carry a payment from sender to recipient.",
    analogy:
      "A map weighs distance, tolls, closures, and traffic before suggesting a journey.",
    technical:
      "Path selection over a channel graph using known constraints and estimates such as fees, hop count, capacity signals, and reliability.",
  },
  {
    term: "Routing fee",
    everyday: "A toll",
    simple:
      "The amount a forwarding participant may charge for helping a payment continue.",
    analogy:
      "A small toll collected when a traveler uses one segment of a route.",
    technical:
      "A forwarding charge usually composed of a fixed base fee plus a proportional fee based on the amount being forwarded.",
  },
  {
    term: "Hop",
    everyday: "One road segment",
    simple:
      "One move from one participant to the next along a payment route.",
    analogy:
      "Traveling from one station to the next is one hop, even when the complete trip uses several stations.",
    technical:
      "A single edge traversal in a route. More hops can add fees, delay, and additional opportunities for failure.",
  },
  {
    term: "Satoshi / sat",
    everyday: "A small unit",
    simple:
      "The smallest unit of bitcoin, often shortened to sat.",
    analogy:
      "A sat relates to bitcoin the way a very small denomination relates to a larger currency unit.",
    technical:
      "One satoshi equals one hundred-millionth of a bitcoin: 0.00000001 BTC.",
  },
  {
    term: "Capacity",
    everyday: "The road’s total size",
    simple:
      "The total value committed to a payment channel across both directions.",
    analogy:
      "The full width of a two-way road. It does not tell you how much space is free in the direction you want to travel.",
    technical:
      "The total bitcoin locked into a channel. Directional usable liquidity is a portion of that capacity, not a synonym for it.",
  },
];

const definitionLayers = [
  { key: "simple", label: "Start here", description: "Plain meaning" },
  { key: "analogy", label: "Picture it", description: "Map analogy" },
  { key: "technical", label: "Go deeper", description: "Technical meaning" },
] as const;

export function Glossary() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedEntry = glossaryEntries[selectedIndex];

  return (
    <div className={styles.glossary}>
      <div className={styles.glossaryTerms} aria-label="Lightning glossary terms">
        {glossaryEntries.map((entry, index) => (
          <button
            aria-controls="glossary-definition"
            aria-pressed={selectedIndex === index}
            className={
              selectedIndex === index
                ? `${styles.glossaryTerm} ${styles.glossaryTermActive}`
                : styles.glossaryTerm
            }
            key={entry.term}
            onClick={() => setSelectedIndex(index)}
            type="button"
          >
            <span>{entry.everyday}</span>
            <ArrowRight aria-hidden="true" />
            <strong>{entry.term}</strong>
          </button>
        ))}
      </div>

      <article
        aria-live="polite"
        className={styles.glossaryDefinition}
        id="glossary-definition"
      >
        <p className={styles.glossaryTranslation}>
          <span>{selectedEntry.everyday}</span>
          <ArrowRight aria-hidden="true" />
          <strong>{selectedEntry.term}</strong>
        </p>
        <h3>{selectedEntry.term}</h3>
        <dl className={styles.definitionLayers}>
          {definitionLayers.map((layer) => (
            <div key={layer.key}>
              <dt>
                <strong>{layer.label}</strong>
                <span>{layer.description}</span>
              </dt>
              <dd>{selectedEntry[layer.key]}</dd>
            </div>
          ))}
        </dl>
      </article>
    </div>
  );
}
