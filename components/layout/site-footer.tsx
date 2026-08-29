import Link from "next/link";

import { RouteMark } from "@/components/ui/route-mark";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="footer-brand">
          <RouteMark />
          <div>
            <strong>Lightning Maps</strong>
            <p>A synthetic network. No real payments.</p>
          </div>
        </div>
        <nav aria-label="Footer navigation">
          <Link href="/learn">How it works</Link>
          <Link href="/about">Method & limitations</Link>
          <Link href="/lab">Experiment lab</Link>
        </nav>
        <p className="footer-note">Built to make graph routing visible.</p>
      </div>
    </footer>
  );
}
