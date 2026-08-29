export default function Loading() {
  return (
    <main className="route-loading" id="main-content" aria-live="polite">
      <div className="route-loading__map" aria-hidden="true">
        <i />
        <i />
        <i />
        <span />
      </div>
      <p className="mono">BUILDING NETWORK</p>
      <h1>Preparing the simulated map…</h1>
      <p>Placing participants, connecting channels, and checking liquidity.</p>
    </main>
  );
}
