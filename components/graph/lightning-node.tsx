"use client";

import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";
import { Building2, CircleUserRound, RadioTower, Store } from "lucide-react";

import type { LightningNode } from "@/lib/network/types";
import { formatCompactSats, formatPercent } from "@/utils/format";

export type LightningNodeData = {
  node: LightningNode;
  isOnRoute: boolean;
  isSource: boolean;
  isTarget: boolean;
  isActiveHop: boolean;
  onSelect: (node: LightningNode) => void;
} & Record<string, unknown>;

export type LightningFlowNode = Node<LightningNodeData, "lightning">;

const roleIcons = {
  participant: CircleUserRound,
  hub: RadioTower,
  merchant: Store,
  relay: Building2,
};

export function LightningNodeView({ data, selected }: NodeProps<LightningFlowNode>) {
  const { node } = data;
  const RoleIcon = roleIcons[node.role];
  const className = [
    "flow-node",
    !node.online ? "is-offline" : "",
    data.isOnRoute ? "is-on-route" : "",
    data.isSource ? "is-source" : "",
    data.isTarget ? "is-target" : "",
    data.isActiveHop ? "is-active-hop" : "",
    selected ? "is-selected" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      <Handle className="flow-handle" type="target" position={Position.Left} />
      <button
        aria-label={`${node.name}, ${node.online ? "online" : "offline"}, ${formatPercent(node.reliability)} reliability`}
        className={className}
        onClick={() => data.onSelect(node)}
        type="button"
      >
        <span className="flow-node__orb">
          <RoleIcon aria-hidden="true" />
        </span>
        <span className="flow-node__label">{node.name}</span>
        {data.isSource || data.isTarget ? (
          <span className="flow-node__endpoint">
            {data.isSource ? "Start" : "Arrival"}
          </span>
        ) : null}
        <span className="flow-node__tooltip" role="tooltip">
          <strong>{node.name}</strong>
          <span className={node.online ? "is-healthy" : "is-danger"}>
            {node.online ? "Online" : "Offline"}
          </span>
          <span>Reliability {formatPercent(node.reliability)}</span>
          <span>{node.connectionCount} connections</span>
          <span>{formatCompactSats(node.availableLiquidity)} sats available</span>
        </span>
      </button>
      <Handle className="flow-handle" type="source" position={Position.Right} />
    </>
  );
}
