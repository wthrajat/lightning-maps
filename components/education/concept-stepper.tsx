"use client";

import { ArrowRight, Check } from "lucide-react";
import { useState } from "react";

const steps = [
  {
    title: "Start with a journey",
    text: "Something needs to move from you to a destination. Several paths may connect the two.",
    label: "A familiar problem",
  },
  {
    title: "Connections become roads",
    text: "Each participant is a point on the map. Each connection is a road with its own capacity and toll.",
    label: "A network appears",
  },
  {
    title: "Choose the best path",
    text: "A short path is not always cheap or dependable. The router evaluates several tradeoffs at once.",
    label: "Routing gets interesting",
  },
  {
    title: "Now call it Lightning",
    text: "Lightning is a payment network built on Bitcoin. Participants forward payments across connected channels.",
    label: "Terminology, last",
  },
];

export function ConceptStepper() {
  const [currentStep, setCurrentStep] = useState(0);
  const step = steps[currentStep];

  return (
    <div className="concept-stepper">
      <div className="concept-stepper__visual" aria-hidden="true">
        <div className={`concept-map concept-map--step-${currentStep + 1}`}>
          <span className="concept-point concept-point--start">You</span>
          <span className="concept-point concept-point--a">A</span>
          <span className="concept-point concept-point--b">B</span>
          <span className="concept-point concept-point--c">C</span>
          <span className="concept-point concept-point--end">Destination</span>
          <svg viewBox="0 0 540 310">
            <path className="concept-edge edge-one" d="M70 150 C145 88 205 92 270 145" />
            <path className="concept-edge edge-two" d="M70 150 C165 218 245 230 355 186" />
            <path className="concept-edge edge-three" d="M270 145 C350 115 400 120 475 150" />
            <path className="concept-edge edge-four" d="M355 186 C400 180 440 165 475 150" />
            <path className="concept-route" d="M70 150 C145 88 205 92 270 145 C350 115 400 120 475 150" />
          </svg>
          {currentStep >= 2 ? (
            <span className="concept-packet">
              <ArrowRight />
            </span>
          ) : null}
        </div>
        <p className="concept-stepper__caption mono">{step.label}</p>
      </div>

      <div className="concept-stepper__content">
        <div className="step-progress" aria-label={`Step ${currentStep + 1} of ${steps.length}`}>
          {steps.map((item, index) => (
            <button
              aria-label={`Show step ${index + 1}: ${item.title}`}
              aria-current={index === currentStep ? "step" : undefined}
              className={index === currentStep ? "is-current" : index < currentStep ? "is-complete" : ""}
              key={item.title}
              onClick={() => setCurrentStep(index)}
              type="button"
            >
              {index < currentStep ? <Check aria-hidden="true" /> : index + 1}
            </button>
          ))}
        </div>
        <p className="concept-stepper__count mono">
          {String(currentStep + 1).padStart(2, "0")} / {String(steps.length).padStart(2, "0")}
        </p>
        <h3>{step.title}</h3>
        <p>{step.text}</p>
        <button
          className="button button--secondary"
          onClick={() => setCurrentStep((current) => (current + 1) % steps.length)}
          type="button"
        >
          {currentStep === steps.length - 1 ? "Start again" : "Next idea"}
          <ArrowRight aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
