import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="route-error" id="main-content">
      <p className="mono">404 · NO CONNECTION</p>
      <h1>This destination is not on the map.</h1>
      <p>Return to the network explorer and choose a participant that exists.</p>
      <Link className="button button--primary" href="/explore">
        <ArrowLeft aria-hidden="true" /> Open explorer
      </Link>
    </main>
  );
}
