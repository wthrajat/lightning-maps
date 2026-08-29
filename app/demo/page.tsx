import type { Metadata } from "next";

import { GuidedDemo } from "@/components/demo/guided-demo";

export const metadata: Metadata = {
  title: "Guided Demo",
  description:
    "A five-step guided demonstration of payment routing, failures, and repeatable experiments.",
};

export default function DemoPage() {
  return (
    <main id="main-content" className="explore-page">
      <div className="explore-page__title">
        <div>
          <p className="mono">FIVE-MINUTE TOUR</p>
          <h1>Follow the payment</h1>
        </div>
        <p>
          Network → route → payment → failure → experiment. Advance at your own
          pace; every value comes from the same deterministic model.
        </p>
      </div>
      <GuidedDemo />
    </main>
  );
}
