"use client";

import {
  Background,
  BackgroundVariant,
  Controls,
  MarkerType,
  MiniMap,
  ReactFlow,
  type Edge,
  type NodeTypes,
} from "@xyflow/react";
import { useMemo } from "react";

import {
  LightningNodeView,
  type LightningFlowNode,
} from "@/components/graph/lightning-node";
import { PaymentEdge } from "@/components/graph/payment-edge";
import type {
  LightningNode,
  PaymentNetwork,
} from "@/lib/network/types";
import type { PaymentRoute } from "@/lib/routing/types";

type NetworkGraphProps = {
  network: PaymentNetwork;
  amount: number;
  selectedRoute: PaymentRoute | null;
  activeChannelId?: string | null;
  activeNodeId?: string | null;
  onNodeSelect: (node: LightningNode) => void;
  compact?: boolean;
};

const nodeTypes: NodeTypes = { lightning: LightningNodeView };
const edgeTypes = { payment: PaymentEdge };

export function NetworkGraph({
  network,
  amount,
  selectedRoute,
  activeChannelId = null,
  activeNodeId = null,
  onNodeSelect,
  compact = false,
}: NetworkGraphProps) {
  const nodes = useMemo<LightningFlowNode[]>(() => {
    const routeNodeIds = new Set(selectedRoute?.nodeIds ?? []);

    return network.nodes.map((node) => ({
      id: node.id,
      type: "lightning",
      position: node.position,
      data: {
        node,
        isOnRoute: routeNodeIds.has(node.id),
        isSource: selectedRoute?.source === node.id,
        isTarget: selectedRoute?.target === node.id,
        isActiveHop: activeNodeId === node.id,
        onSelect: onNodeSelect,
      },
    }));
  }, [activeNodeId, network.nodes, onNodeSelect, selectedRoute]);

  const edges = useMemo<Edge[]>(() => {
    const routeChannels = new Set(selectedRoute?.channelIds ?? []);

    return network.channels.map((channel) => {
      const isRoute = routeChannels.has(channel.id);
      const isInsufficient = channel.availableLiquidity < amount;
      const isUnavailable = !channel.enabled;
      const routeIndex = selectedRoute?.channelIds.indexOf(channel.id) ?? -1;
      const isActive = channel.id === activeChannelId;

      return {
        id: channel.id,
        source: channel.source,
        target: channel.target,
        type: isRoute ? "payment" : "default",
        animated: isRoute && !isActive,
        data: {
          paymentActive: isActive,
          label: `${Math.round(channel.availableLiquidity)} sats available`,
          routeIndex,
        },
        markerEnd: isRoute
          ? {
              type: MarkerType.ArrowClosed,
              width: 12,
              height: 12,
              color: "var(--color-primary)",
            }
          : undefined,
        className: [
          "network-edge",
          isRoute ? "is-route" : "",
          isInsufficient ? "is-insufficient" : "",
          isUnavailable ? "is-unavailable" : "",
        ]
          .filter(Boolean)
          .join(" "),
        style: {
          stroke: isRoute
            ? "var(--color-primary)"
            : isUnavailable
              ? "var(--color-danger)"
              : isInsufficient
                ? "var(--color-warning)"
                : "var(--color-line-strong)",
          strokeWidth: isRoute
            ? 4
            : Math.max(1, Math.min(3, channel.availableLiquidity / 600_000)),
          opacity: isUnavailable ? 0.28 : isInsufficient ? 0.42 : 0.72,
        },
      };
    });
  }, [activeChannelId, amount, network.channels, selectedRoute]);

  return (
    <div className={compact ? "network-graph is-compact" : "network-graph"}>
      <ReactFlow
        colorMode="system"
        defaultEdges={edges}
        defaultNodes={nodes}
        edges={edges}
        edgeTypes={edgeTypes}
        fitView
        fitViewOptions={{ padding: compact ? 0.08 : 0.14 }}
        maxZoom={1.8}
        minZoom={0.28}
        nodeTypes={nodeTypes}
        nodes={nodes}
        nodesConnectable={false}
        proOptions={{ hideAttribution: true }}
      >
        <Background
          color="var(--color-line)"
          gap={28}
          size={1.2}
          variant={BackgroundVariant.Dots}
        />
        <Controls position="bottom-right" showInteractive={false} />
        {!compact ? (
          <MiniMap
            className="network-minimap"
            maskColor="color-mix(in oklch, var(--color-canvas) 78%, transparent)"
            nodeColor="var(--color-line-strong)"
            position="bottom-left"
            pannable
            zoomable
          />
        ) : null}
      </ReactFlow>
    </div>
  );
}
