"use client";

import { RotateCcw } from "lucide-react";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="route-error" id="main-content">
      <p className="mono">ROUTE INTERRUPTED</p>
      <h1>The simulation could not finish this view.</h1>
      <p>
        Your data is local and nothing was sent. Try rebuilding this simulated route.
      </p>
      <button className="button button--primary" onClick={reset} type="button">
        <RotateCcw aria-hidden="true" /> Try again
      </button>
    </main>
  );
}
