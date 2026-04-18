
## RigWise — Premium 3D PC Builder Website

A full-fledged dark-mode site with an editorial, Apple-like monochrome aesthetic (deep blacks, soft greys, crisp white type, subtle silver highlights) and a real 3D PC that assembles/disassembles as you scroll.

### Visual Direction
- **Palette:** `#0a0a0a` near-black bg, `#141414` panels, `#262626` borders, `#a3a3a3` muted text, pure white headings, subtle silver `#e5e5e5` glow accents.
- **Type:** Large display sans (Inter Tight / Geist) for hero, clean Inter for body. Generous whitespace, oversized headlines, refined micro-type.
- **Motion:** Soft springs, slow reveals, parallax. No flashy neons. Subtle grain/noise overlay for that premium texture.

### The Centerpiece — Scroll-Driven 3D PC
Built with **React Three Fiber + drei**:
- Stylized 3D parts (case, motherboard, CPU, GPU, RAM sticks, PSU, AIO cooler with fans, SSD) modeled from primitives — clean monochrome metallic materials with white edge lighting.
- Scroll progress drives part positions: components fly in from offscreen and snap into place one-by-one (CPU → RAM → motherboard → GPU → PSU → cooler → case panel).
- Reverse scroll = disassemble. Slow continuous rotation when idle.
- Floating spec labels (like your reference) appear next to each part as it locks in.
- Sticky canvas, content sections scroll over/around it.

### Pages (all 6 modules + Home)
1. **Home (`/`)** — Hero with the scroll-assembling 3D PC, "Build Your Dream PC. Smartly." + stats strip, feature highlights, preset teasers, CTA.
2. **Builder (`/builder`)** — Budget slider (₹) + use-case picker (Gaming / Editing / Office / General) → animated build reveal with components, total price, compatibility badges, benchmark mini-charts. Mock recommendation engine over realistic component data.
3. **Compare (`/compare`)** — Pick 2–3 components per category from a searchable list → side-by-side spec table with diff highlighting and bar comparisons.
4. **Benchmarks (`/benchmarks`)** — Filterable component library with Cinebench / 3DMark / CrystalDiskMark scores rendered as elegant minimal bar charts.
5. **Presets (`/presets`)** — Curated build cards (₹30k Office, ₹60k Gaming, ₹1L Creator + more) with hover detail expansion and "Open in Builder" action.
6. **Guides (`/guides`)** — Editorial article cards (Choosing a CPU, PSU sizing, Compatibility 101, etc.) with magazine-style layout.

### Global Shell
- Fixed top nav: `RIGWISE` wordmark + Builder · Compare · Benchmarks · Presets · Guides, with subtle underline-on-hover.
- Footer with project credit, references, and social/GitHub icons.
- Smooth page transitions, scroll-triggered fade-ins, custom cursor accent on interactive elements.

### Mock Data Layer
Static TS modules: ~40 realistic components (CPUs, GPUs, RAM, etc.) with prices, sockets, TDP, benchmark scores, and Amazon/Flipkart links — powers Builder, Compare, Benchmarks, Presets so everything feels real and interactive without a backend.

### Tech
- React Three Fiber + drei + three for 3D
- TanStack Router (file-based routes per page) with per-route SEO meta
- Tailwind v4 design tokens for the monochrome palette
- Framer-motion-style animation via CSS + frame-driven Three.js (no extra deps unless useful)
- Fully responsive — 3D PC gracefully simplifies on mobile

### Out of Scope (per your synopsis)
- Real backend, live price scraping, user accounts — same as your synopsis future-work list. UI is fully functional with realistic mock data.
