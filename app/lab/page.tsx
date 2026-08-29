import type { Metadata } from "next";

import { ExperimentLab } from "./experiment-lab";

export const metadata: Metadata = {
  title: "Experiment Lab",
  description:
    "Run repeatable, seeded payment-routing experiments and compare shortest, cheapest, and balanced algorithms.",
};

export default function LabPage() {
  return (
    <main id="main-content">
      <ExperimentLab />
    </main>
  );
}
