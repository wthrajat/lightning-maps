"use client";

import {
  ArrowUpRight,
  Menu,
  Moon,
  Play,
  Sun,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { RouteMark } from "@/components/ui/route-mark";

const navigation = [
  { href: "/explore", label: "Explore" },
  { href: "/#how-it-works", label: "How it works" },
  { href: "/what-if", label: "What If?" },
  { href: "/learn", label: "Learn" },
  { href: "/network", label: "Network" },
  { href: "/lab", label: "Lab" },
  { href: "/about", label: "About" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  function toggleTheme() {
    const nextDarkMode = document.documentElement.dataset.theme !== "dark";
    document.documentElement.dataset.theme = nextDarkMode ? "dark" : "light";
    window.localStorage.setItem(
      "lightning-maps-theme",
      nextDarkMode ? "dark" : "light",
    );
  }

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link className="brand" href="/" aria-label="Lightning Maps home">
          <RouteMark />
          <span>Lightning Maps</span>
        </Link>

        <nav className="desktop-nav" aria-label="Primary navigation">
          {navigation.map((item) => (
            <Link
              className={pathname === item.href ? "nav-link is-active" : "nav-link"}
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="header-actions">
          <button
            aria-label="Toggle color theme"
            className="icon-button"
            onClick={toggleTheme}
            type="button"
          >
            <Sun className="theme-icon theme-icon--sun" aria-hidden="true" />
            <Moon className="theme-icon theme-icon--moon" aria-hidden="true" />
          </button>
          <Link className="demo-link" href="/demo">
            <Play aria-hidden="true" />
            Demo mode
            <ArrowUpRight aria-hidden="true" />
          </Link>
          <button
            aria-controls="mobile-navigation"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="icon-button mobile-menu-button"
            onClick={() => setMenuOpen((current) => !current)}
            type="button"
          >
            {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>
      </div>

      {menuOpen ? (
        <nav className="mobile-nav" id="mobile-navigation" aria-label="Mobile navigation">
          {navigation.map((item) => (
            <Link
              className={pathname === item.href ? "mobile-nav__link is-active" : "mobile-nav__link"}
              href={item.href}
              key={item.href}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
              <ArrowUpRight aria-hidden="true" />
            </Link>
          ))}
          <Link
            className="button button--primary mobile-nav__demo"
            href="/demo"
            onClick={() => setMenuOpen(false)}
          >
            <Play aria-hidden="true" />
            Start guided demo
          </Link>
        </nav>
      ) : null}
    </header>
  );
}
