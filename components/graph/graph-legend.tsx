export function GraphLegend() {
  return (
    <div className="graph-legend" aria-label="Network map legend">
      <span>
        <i className="legend-node" /> Participant
      </span>
      <span>
        <i className="legend-line legend-line--route" /> Selected route
      </span>
      <span>
        <i className="legend-line legend-line--low" /> Low capacity
      </span>
      <span>
        <i className="legend-line legend-line--high" /> High capacity
      </span>
      <span>
        <i className="legend-line legend-line--blocked" /> Cannot carry amount
      </span>
    </div>
  );
}
