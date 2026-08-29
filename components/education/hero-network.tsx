const points = [
  { id: "alice", label: "Alice", x: 88, y: 284, active: true },
  { id: "diana", label: "Diana", x: 185, y: 392, active: false },
  { id: "charlie", label: "Charlie", x: 240, y: 236, active: true },
  { id: "north", label: "North Hub", x: 390, y: 135, active: false },
  { id: "central", label: "Central Hub", x: 422, y: 280, active: true },
  { id: "julia", label: "Julia", x: 335, y: 410, active: false },
  { id: "merchant", label: "Merchant A", x: 570, y: 385, active: false },
  { id: "bob", label: "Bob", x: 655, y: 215, active: true },
];

const ordinaryEdges = [
  "M88 284 C124 326 150 370 185 392",
  "M185 392 C240 410 285 415 335 410",
  "M240 236 C280 185 330 150 390 135",
  "M390 135 C485 115 575 145 655 215",
  "M422 280 C482 308 520 350 570 385",
  "M335 410 C410 430 500 420 570 385",
  "M570 385 C615 350 642 290 655 215",
  "M185 392 C220 340 228 285 240 236",
];

export function HeroNetwork() {
  return (
    <figure className="hero-network" aria-labelledby="hero-network-caption">
      <div className="hero-network__toolbar" aria-hidden="true">
        <span className="window-dot" />
        <span className="window-dot" />
        <span className="window-dot" />
        <p>Simulated network · normal conditions</p>
        <span className="live-indicator">Live route</span>
      </div>
      <svg
        className="hero-network__canvas"
        viewBox="0 0 740 500"
        role="img"
        aria-label="A network map with a highlighted route from Alice through Charlie and Central Hub to Bob"
      >
        <defs>
          <pattern id="map-dots" width="28" height="28" patternUnits="userSpaceOnUse">
            <circle className="map-dot" cx="1" cy="1" r="1" />
          </pattern>
          <filter id="route-soft-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <path
            id="hero-route-motion"
            d="M88 284 C140 250 182 248 240 236 C312 220 350 250 422 280 C500 305 576 252 655 215"
          />
        </defs>
        <rect className="map-field" width="740" height="500" fill="url(#map-dots)" />

        <g className="ordinary-connections">
          {ordinaryEdges.map((edge) => (
            <path d={edge} key={edge} />
          ))}
        </g>

        <path
          className="hero-route-glow"
          d="M88 284 C140 250 182 248 240 236 C312 220 350 250 422 280 C500 305 576 252 655 215"
        />
        <path
          className="hero-route-line"
          d="M88 284 C140 250 182 248 240 236 C312 220 350 250 422 280 C500 305 576 252 655 215"
        />
        <circle className="hero-packet" r="5" filter="url(#route-soft-glow)">
          <animateMotion dur="3s" repeatCount="indefinite">
            <mpath href="#hero-route-motion" />
          </animateMotion>
        </circle>

        {points.map((point) => (
          <g
            className={point.active ? "hero-node is-route-node" : "hero-node"}
            key={point.id}
            transform={`translate(${point.x} ${point.y})`}
          >
            <circle r={point.active ? 10 : 7} />
            <circle className="hero-node__core" r={point.active ? 4 : 2.5} />
            <text y={point.y > 350 ? 26 : -18}>{point.label}</text>
          </g>
        ))}

        <g className="route-readout" transform="translate(32 34)">
          <rect width="222" height="80" rx="9" />
          <text className="route-readout__label" x="15" y="24">
            RECOMMENDED ROUTE
          </text>
          <text className="route-readout__path" x="15" y="48">
            Alice → Charlie → Bob
          </text>
          <text className="route-readout__metrics" x="15" y="67">
            12 sats · 3 hops · 96% est. success
          </text>
        </g>
      </svg>
      <figcaption id="hero-network-caption">
        <span>Route 01</span>
        <p>
          The magenta thread is the recommended path. Every other line is a
          usable alternative.
        </p>
      </figcaption>
    </figure>
  );
}
