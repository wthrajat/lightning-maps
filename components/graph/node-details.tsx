"use client";

import { Activity, CircleDot, Droplets, RadioTower, X } from "lucide-react";

import type { LightningNode } from "@/lib/network/types";
import { formatCompactSats, formatPercent } from "@/utils/format";

type NodeDetailsProps = {
  node: LightningNode;
  routeRole: "sender" | "receiver" | "forwarder" | "not-on-route";
  onClose: () => void;
};

export function NodeDetails({ node, routeRole, onClose }: NodeDetailsProps) {
  return (
    <aside className="node-details" aria-label={`Details for ${node.name}`}>
      <div className="node-details__header">
        <div>
          <p className="mono">NODE DETAILS</p>
          <h2>{node.name}</h2>
          <span className={node.online ? "status-pill is-online" : "status-pill is-offline"}>
            {node.online ? "Online" : "Offline"}
          </span>
        </div>
        <button aria-label="Close node details" className="icon-button" onClick={onClose} type="button">
          <X aria-hidden="true" />
        </button>
      </div>
      <p className="node-details__region">{node.region} · {node.role}</p>
      <dl>
        <div>
          <dt><Activity aria-hidden="true" /> Reliability</dt>
          <dd className="mono">{formatPercent(node.reliability)}</dd>
        </div>
        <div>
          <dt><RadioTower aria-hidden="true" /> Connections</dt>
          <dd className="mono">{node.connectionCount}</dd>
        </div>
        <div>
          <dt><CircleDot aria-hidden="true" /> Total capacity</dt>
          <dd className="mono">{formatCompactSats(node.totalCapacity)} sats</dd>
        </div>
        <div>
          <dt><Droplets aria-hidden="true" /> Available liquidity</dt>
          <dd className="mono">{formatCompactSats(node.availableLiquidity)} sats</dd>
        </div>
      </dl>
      <div className="node-details__note">
        <span>Role in selected route</span>
        <strong>{routeRole.replaceAll("-", " ")}</strong>
      </div>
      <p className="node-details__plain-language">
        Think of this participant as a place on a map. Its connections are the roads a payment may use.
      </p>
    </aside>
  );
}
