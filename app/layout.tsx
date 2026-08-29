import type { Metadata, Viewport } from "next";
import "@xyflow/react/dist/style.css";
import "./globals.css";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

export const metadata: Metadata = {
  title: {
    default: "Lightning Maps — Payment routing, made visible",
    template: "%s · Lightning Maps",
  },
  description:
    "An interactive simulation that visualizes how payments can be routed through a Lightning-inspired distributed network.",
  keywords: [
    "Lightning Network",
    "graph algorithms",
    "payment routing",
    "network simulation",
    "education",
  ],
  openGraph: {
    title: "Google Maps for Lightning Payments",
    description:
      "Find, compare, and visualize the best route for a simulated payment.",
    type: "website",
    siteName: "Lightning Maps",
  },
};

export const viewport: Viewport = {
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#121014" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{const t=localStorage.getItem('lightning-maps-theme');document.documentElement.dataset.theme=t||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light')}catch{}",
          }}
        />
      </head>
      <body>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
