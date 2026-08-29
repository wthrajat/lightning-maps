"use client";

import { Check, LoaderCircle, Send, X } from "lucide-react";

import type { PaymentSimulation } from "@/lib/simulation/types";

type PaymentTimelineProps = {
  simulation: PaymentSimulation | null;
  currentStepIndex: number;
  sending: boolean;
  onSend: () => void;
  disabled: boolean;
};

export function PaymentTimeline({
  simulation,
  currentStepIndex,
  sending,
  onSend,
  disabled,
}: PaymentTimelineProps) {
  return (
    <section className="payment-panel" aria-labelledby="payment-panel-title">
      <div className="payment-panel__heading">
        <div>
          <p className="mono">SIMULATED PAYMENT</p>
          <h2 id="payment-panel-title">Watch the hand-off</h2>
        </div>
        <button
          className="button button--primary"
          disabled={disabled || sending}
          onClick={onSend}
          type="button"
        >
          {sending ? <LoaderCircle className="is-spinning" aria-hidden="true" /> : <Send aria-hidden="true" />}
          {sending ? "Payment moving…" : "Send test payment"}
        </button>
      </div>

      {!simulation ? (
        <p className="payment-panel__empty">
          The route is ready. Start the test to see each participant forward it.
        </p>
      ) : (
        <ol className="payment-timeline" aria-live="polite">
          {simulation.steps.map((step, index) => {
            const reached = index <= currentStepIndex;
            const active = index === currentStepIndex && sending;
            const failed = reached && step.state === "failed";

            return (
              <li className={active ? "is-active" : reached ? "is-reached" : ""} key={`${step.nodeId}-${step.index}`}>
                <span className={failed ? "timeline-status is-failed" : "timeline-status"}>
                  {failed ? <X aria-hidden="true" /> : reached ? <Check aria-hidden="true" /> : index + 1}
                </span>
                <div>
                  <strong>{step.nodeName}</strong>
                  <p>{reached ? step.message : "Waiting"}</p>
                </div>
              </li>
            );
          })}
        </ol>
      )}

      {simulation && !sending && currentStepIndex === simulation.steps.length - 1 ? (
        <div className={simulation.status === "success" ? "payment-result is-success" : "payment-result is-failed"} role="status">
          {simulation.status === "success" ? (
            <>
              <Check aria-hidden="true" /> Payment reached the destination
            </>
          ) : (
            <>
              <X aria-hidden="true" /> The simulated payment stopped before arrival
            </>
          )}
        </div>
      ) : null}
    </section>
  );
}
