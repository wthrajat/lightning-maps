---
name: Lightning Maps
description: A precise route-control interface that makes payment-network tradeoffs visible.
colors:
  canvas: "oklch(1 0 0)"
  surface: "oklch(0.975 0.004 340)"
  surface-strong: "oklch(0.945 0.008 340)"
  panel: "oklch(0.995 0.002 340)"
  ink: "oklch(0.17 0.018 340)"
  ink-soft: "oklch(0.39 0.018 340)"
  muted: "oklch(0.49 0.014 340)"
  line: "oklch(0.89 0.01 340)"
  line-strong: "oklch(0.78 0.018 340)"
  signal-rose: "oklch(0.5 0.2 340)"
  signal-rose-hover: "oklch(0.44 0.19 340)"
  signal-rose-soft: "oklch(0.94 0.04 340)"
  marine: "oklch(0.35 0.11 225)"
  healthy: "oklch(0.48 0.13 165)"
  warning: "oklch(0.48 0.15 52)"
  danger: "oklch(0.55 0.2 25)"
typography:
  display:
    fontFamily: "Geist, SF Pro Display, Segoe UI, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(3.2rem, 6.4vw, 5.8rem)"
    fontWeight: 680
    lineHeight: 1.08
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Geist, SF Pro Display, Segoe UI, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.3rem, 5vw, 4.6rem)"
    fontWeight: 650
    lineHeight: 1.08
    letterSpacing: "-0.04em"
  title:
    fontFamily: "Geist, SF Pro Display, Segoe UI, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.2rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Geist, SF Pro Display, Segoe UI, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: "normal"
  label:
    fontFamily: "Geist Mono, SFMono-Regular, Consolas, Liberation Mono, monospace"
    fontSize: "0.68rem"
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: "0.02em"
rounded:
  xs: "4px"
  sm: "7px"
  md: "12px"
  lg: "16px"
  pill: "999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  section: "96px"
components:
  button-primary:
    backgroundColor: "{colors.signal-rose}"
    textColor: "{colors.canvas}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "12px 16px"
    height: "44px"
  button-primary-hover:
    backgroundColor: "{colors.signal-rose-hover}"
    textColor: "{colors.canvas}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "12px 16px"
    height: "44px"
  button-secondary:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "12px 16px"
    height: "44px"
  input:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.sm}"
    padding: "8px 12px"
    height: "44px"
  route-chip:
    backgroundColor: "{colors.signal-rose-soft}"
    textColor: "{colors.signal-rose}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "8px 12px"
---

# Design System: Lightning Maps

## 1. Overview

**Creative North Star: "The Signal Atlas"**

Lightning Maps feels like a precise route-control surface projected in a bright classroom: clear at a glance, credible under scrutiny, and calm enough to teach. A nearly pure white field keeps the dense topology readable. Deep signal rose is reserved for the path currently being discussed, while marine and semantic colors describe the network without competing for attention.

The signature is the **live route thread**—a thin, animated signal that moves through the same graph the algorithm evaluates. It is functional state, not atmosphere. The interface rejects cryptocurrency spectacle and lets map conventions, structured data, and plain language carry the experience.

**Key Characteristics:**

- Route-first visual hierarchy with the graph occupying the dominant surface.
- Restrained product color; signal rose appears only on active paths and primary actions.
- One sans family across product UI, with mono reserved for measured data and system labels.
- Mostly flat layers, precise dividers, and compact radii that support dense information.
- Structural responsiveness: graph first and horizontally scrollable comparisons on mobile.

## 2. Colors

The palette is a white cartographic field marked by graphite data, deep signal rose routes, marine infrastructure, and explicit semantic states.

### Primary

- **Signal Rose** (`oklch(0.5 0.2 340)`): Selected routes, primary actions, focus, and the one current teaching emphasis.
- **Signal Rose Hover** (`oklch(0.44 0.19 340)`): Active primary-action state only.
- **Signal Rose Wash** (`oklch(0.94 0.04 340)`): Selected rows, route nodes, and instructional focus regions.

### Secondary

- **Deep Marine** (`oklch(0.35 0.11 225)`): Neutral online infrastructure and ordinary participant-node cores.

### Tertiary

- **Healthy Teal** (`oklch(0.48 0.13 165)`): Online, completed, and successful states.
- **Capacity Amber** (`oklch(0.48 0.15 52)`): Congestion, reduced room, and recoverable constraints.
- **Failure Red** (`oklch(0.55 0.2 25)`): Offline, failed, and unavailable states only.

### Neutral

- **Pure Canvas** (`oklch(1 0 0)`): Page background and primary panels.
- **Rose-Trace Surface** (`oklch(0.975 0.004 340)`): Toolbars, grouped controls, and quiet section separation.
- **Graphite Ink** (`oklch(0.17 0.018 340)`): Primary text and dark call-to-action surfaces.
- **Soft Graphite** (`oklch(0.39 0.018 340)`): Supporting prose.
- **Measured Gray** (`oklch(0.49 0.014 340)`): Secondary labels that remain readable.
- **Map Line** (`oklch(0.89 0.01 340)`) and **Strong Map Line** (`oklch(0.78 0.018 340)`): Dividers and non-selected channels.

### Named Rules

**The One Route Rule.** Signal rose occupies no more than roughly ten percent of a working screen. Its scarcity tells the user where the current decision lives.

**The State Is Not Decoration Rule.** Teal, amber, and red appear only when they encode success, constraint, or failure, and always with a text or icon cue.

## 3. Typography

**Display Font:** Geist-style system sans (with SF Pro Display, Segoe UI, and system sans fallbacks)  
**Body Font:** Geist-style system sans (with the same native fallbacks)  
**Label/Mono Font:** Geist Mono-style system mono (with SFMono-Regular and Consolas fallbacks)

**Character:** The single sans vocabulary makes the product familiar and dependable. Mono does not make the interface look like a terminal; it quietly distinguishes reproducible measurements, route states, and simulation labels.

### Hierarchy

- **Display** (680, `clamp(3.2rem, 6.4vw, 5.8rem)`, 1.08): Landing thesis only; letter spacing never tighter than `-0.04em`.
- **Headline** (650, `clamp(2.3rem, 5vw, 4.6rem)`, 1.08): Major explanatory sections.
- **Title** (700, `1.2rem`, 1.2): Product panels, result sections, and dialogs.
- **Body** (400, `1rem`, 1.55): Plain-language explanations capped around 68 characters where practical.
- **Label** (700, `0.68rem`, slight positive tracking): Data markers, scenario state, and metric values; sentence case for controls and uppercase only for short system readouts.

### Named Rules

**The Teaching Voice Rule.** Familiar words lead; technical terms follow. A user reads “available room” before “liquidity” and “connections” before “channels.”

## 4. Elevation

The system is flat by default. Borders and slight tonal shifts establish most hierarchy. Shadows appear only when one surface genuinely floats over another: the hero map, node-detail panel, small control cluster, or route glow.

### Shadow Vocabulary

- **Control Lift** (`0 2px 8px oklch(0.17 0.018 340 / 0.08)`): Compact floating map controls and node orbs.
- **Panel Lift** (`0 8px 14px oklch(0.17 0.018 340 / 0.08)`): Hero map and selected-node detail panel; never paired with a decorative wide blur.
- **Route Signal** (`0 0 12px oklch(0.72 0.18 340 / 0.3)`): Moving payment packet and active hand-off only.

### Named Rules

**The Flat Until Floating Rule.** A panel at rest uses a divider or tonal layer. Shadow is earned by physical overlap or active route state.

## 5. Components

### Buttons

- **Shape:** Compact gently curved corners (`7px`) with a minimum `44px` height.
- **Primary:** Signal Rose fill, white text, `12px 16px` padding, one clear verb.
- **Hover / Focus:** Darker signal rose on hover; a `3px` signal-rose focus outline with `3px` offset.
- **Secondary / Ghost:** Secondary uses a strong map-line border without shadow. Ghost controls use a tonal hover layer.

### Chips

- **Style:** Full pills are reserved for filters, scenarios, state, and route stops—not containers.
- **State:** Selected chips use Signal Rose Wash plus Signal Rose text; unselected chips use a strong neutral line.

### Cards / Containers

- **Corner Style:** Panels use `12px`; the largest bounded compositions top out at `16px`.
- **Background:** Pure Canvas for content and Rose-Trace Surface for toolbars or grouped controls.
- **Shadow Strategy:** Flat at rest; see the elevation rules.
- **Border:** One `1px` Map Line around bounded surfaces.
- **Internal Padding:** `16–24px` for product panels and `32px+` only for page-level teaching compositions.

### Inputs / Fields

- **Style:** `44px` high, `7px` radius, Strong Map Line border, and Panel background.
- **Focus:** Signal Rose outline plus an explicit label; never color alone.
- **Error / Disabled:** Failure Red or reduced opacity paired with plain-language direction.

### Navigation

Sticky white/transparent top bar with a single bottom divider. Active items use a quiet surface and a `2px` signal-rose inset marker. Mobile navigation becomes a full-width list of standard links; it does not invent a custom gesture.

### Live Route Thread

Selected React Flow edges use a `4px` signal-rose stroke, small directional arrows, and a controlled dash animation. During a simulated payment, a compact white packet with a rose outline travels only along the active channel. Reduced-motion mode removes the packet and preserves the highlighted static route.

## 6. Do's and Don'ts

### Do:

- **Do** make the graph the dominant product surface and repeat essential results in semantic text.
- **Do** use Signal Rose (`oklch(0.5 0.2 340)`) only for the current route, primary action, selection, or focus.
- **Do** keep body text at or above WCAG AA contrast and show every state with words or icons as well as color.
- **Do** label all data and probabilities as synthetic or estimated.
- **Do** restructure mobile around a graph-first journey, scrollable comparisons, and touch targets of at least `44px`.

### Don't:

- **Don't** resemble a cryptocurrency trading dashboard or a toy student project.
- **Don't** use giant Bitcoin logos, spinning coins, hacker imagery, excessive neon, generic crypto gradients, or blockchain cubes.
- **Don't** use ornamental glassmorphism, generic Tailwind card grids, unsupported AI claims, or dense blockchain internals before the routing concept is understood.
- **Don't** use gradient text, colored side-stripe callouts, nested cards, decorative grid backgrounds outside an actual map canvas, or radii above `16px` on panels.
- **Don't** animate content for spectacle; motion must explain selection, forwarding, recalculation, or completion and must respect reduced motion.
