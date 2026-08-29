"use client";

import {
  BaseEdge,
  getBezierPath,
  type Edge,
  type EdgeProps,
} from "@xyflow/react";

type PaymentEdgeData = {
  paymentActive?: boolean;
  label?: string;
} & Record<string, unknown>;

type PaymentFlowEdge = Edge<PaymentEdgeData, "payment">;

export function PaymentEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style,
  data,
}: EdgeProps<PaymentFlowEdge>) {
  const [path] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  });

  return (
    <>
      <BaseEdge id={id} path={path} style={style} />
      {data?.paymentActive ? (
        <circle className="flow-payment-packet" r="5">
          <animateMotion dur="0.9s" path={path} repeatCount="indefinite" />
        </circle>
      ) : null}
    </>
  );
}
