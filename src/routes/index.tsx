import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef } from "react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/site/Reveal";
import { PCScene, useScrollProgress, ASSEMBLY_STAGES } from "@/components/three/PCScene";
import { presets, presetTotal } from "@/data/presets";
import { formatINR } from "@/data/components";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "RigWise — Build Your Dream PC. Smartly." },
      { name: "description", content: "An intelligent PC building companion. Pick your budget, pick your purpose, watch your rig come together — part by part, in 3D." },
      { property: "og:title", content: "RigWise — Build Your Dream PC. Smartly." },
      { property: "og:description", content: "Scroll-driven 3D PC builder with budget-aware recommendations, benchmarks, and curated presets." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const assemblyRef = useRef<HTMLElement>(null);
  const progress = useScrollProgress(assemblyRef);

  return (
    <div className="grain min-h-screen bg-background text-foreground">
      <Header />

      {/* HERO */}
      <section className="relative isolate flex min-h-screen items-center overflow-hidden pt-16">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
          }}
        />
        <div className="mx-auto grid w-full max-w-7xl gap-12 px-6 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7">
            <Reveal>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-hairline bg-surface/50 px-3 py-1 text-[11px] uppercase tracking-widest text-muted-foreground backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-foreground" />
                A smarter way to build a PC
              </div>
            </Reveal>
            <Reveal delay={80}>
              <h1 className="font-display text-[clamp(2.5rem,7vw,6rem)] font-semibold leading-[0.95] tracking-tighter text-balance">
                Build your <br />
                dream PC. <span className="silver-text">Smartly.</span>
              </h1>
            </Reveal>
            <Reveal delay={160}>
              <p className="mt-8 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
                Tell RigWise your budget and what you do. We'll assemble a balanced,
                compatibility-checked build — with real benchmarks and real prices —
                so you can stop second-guessing and start building.
              </p>
            </Reveal>
            <Reveal delay={240}>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <Link
                  to="/builder"
                  className="group relative inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-primary-foreground transition-all hover:scale-[1.02]"
                >
                  Start building
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </Link>
                <Link
                  to="/presets"
                  className="inline-flex items-center gap-2 rounded-full border border-hairline px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-surface"
                >
                  Browse presets
                </Link>
              </div>
            </Reveal>

            <Reveal delay={320}>
              <div className="mt-16 grid grid-cols-3 gap-6 border-t border-hairline pt-8">
                {[
                  { k: "40+", v: "Components" },
                  { k: "6", v: "Presets" },
                  { k: "4", v: "Use cases" },
                ].map((s) => (
                  <div key={s.v}>
                    <div className="font-display text-2xl font-semibold md:text-3xl">{s.k}</div>
                    <div className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">{s.v}</div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          <div className="relative h-[440px] lg:col-span-5 lg:h-[600px]">
            <div className="absolute inset-0 float-soft">
              <PCScene progress={0.5} className="h-full w-full" />
            </div>
            <div className="pointer-events-none absolute -inset-10 rounded-[40px] bg-gradient-to-tr from-white/[0.02] via-transparent to-white/[0.04]" />
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          scroll to assemble ↓
        </div>
      </section>

      {/* SCROLL-ASSEMBLY SECTION */}
      <section ref={assemblyRef} className="relative" style={{ height: "500vh" }}>
        <div className="sticky top-0 flex h-screen items-center overflow-hidden">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 hidden w-[42%] flex-col justify-center px-12 lg:flex xl:px-20">
            <div className="text-[10px] font-medium uppercase tracking-[0.3em] text-muted-foreground">
              Assembly · {Math.round(progress * 100)}%
            </div>
            <div className="relative mt-8 h-[260px]">
              {ASSEMBLY_STAGES.map((s, i) => {
                const next = ASSEMBLY_STAGES[i + 1]?.at ?? 1.1;
                const active = progress >= s.at - 0.05 && progress < next - 0.02;
                return (
                  <div
                    key={s.title}
                    className={`absolute inset-0 transition-all duration-700 ${
                      active ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                    }`}
                  >
                    <div className="font-display text-5xl font-semibold leading-tight tracking-tighter md:text-6xl">
                      {s.title}
                    </div>
                    <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground">
                      {s.body}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="mt-12 flex items-center gap-2">
              {ASSEMBLY_STAGES.map((s) => (
                <div
                  key={s.title}
                  className={`h-px transition-all duration-500 ${
                    progress >= s.at - 0.05 ? "w-10 bg-foreground" : "w-6 bg-hairline"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="absolute inset-x-0 top-20 z-10 px-6 lg:hidden">
            <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              Assembly · {Math.round(progress * 100)}%
            </div>
          </div>

          <div className="absolute inset-0">
            <PCScene progress={progress} className="h-full w-full" />
          </div>
        </div>
      </section>

      {/* WHY */}
      <section className="relative border-t border-hairline py-32">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal>
            <div className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">Why RigWise</div>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="mt-4 max-w-3xl font-display text-4xl font-semibold tracking-tight text-balance md:text-6xl">
              Buying parts is easy. <span className="text-muted-foreground">Buying the right parts isn't.</span>
            </h2>
          </Reveal>

          <div className="mt-20 grid gap-px bg-hairline md:grid-cols-3">
            {[
              { k: "01", t: "Budget-aware", d: "Tell us your number — we balance the build instead of blowing it on one part." },
              { k: "02", t: "Compatibility-checked", d: "Sockets, chipsets, RAM generations, PSU headroom — all validated before you buy." },
              { k: "03", t: "Real benchmarks", d: "Cinebench, 3DMark, NVMe read/write — the numbers that actually predict experience." },
              { k: "04", t: "Use-case tuned", d: "Gaming, editing, office, general — different jobs need different silicon." },
              { k: "05", t: "Side-by-side", d: "Compare any two components on specs, price, and benchmark in one view." },
              { k: "06", t: "Curated presets", d: "Six pre-built rigs from ₹30k to ₹2.2L — opinionated, balanced, ready to clone." },
            ].map((f) => (
              <div key={f.k} className="group bg-background p-10 transition-colors hover:bg-surface">
                <div className="font-mono text-xs text-muted-foreground">{f.k}</div>
                <div className="mt-6 font-display text-2xl font-semibold tracking-tight">{f.t}</div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRESETS TEASER */}
      <section className="relative border-t border-hairline py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex items-end justify-between">
            <div>
              <div className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">Presets</div>
              <h2 className="mt-4 font-display text-4xl font-semibold tracking-tight md:text-6xl">
                Start from a build <br /> we already balanced.
              </h2>
            </div>
            <Link to="/presets" className="story-link hidden text-sm md:inline-block">
              See all presets →
            </Link>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {presets.slice(0, 3).map((p) => (
              <Reveal key={p.id} delay={100}>
                <Link
                  to="/presets"
                  className="group block rounded-2xl border border-hairline bg-surface p-8 transition-all hover:-translate-y-1 hover:bg-surface-elevated glow-ring"
                >
                  <div className="text-[11px] uppercase tracking-widest text-muted-foreground">{p.useCase}</div>
                  <div className="mt-4 font-display text-2xl font-semibold tracking-tight">{p.name}</div>
                  <p className="mt-2 text-sm text-muted-foreground">{p.tagline}</p>
                  <div className="mt-8 flex items-end justify-between">
                    <div>
                      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Build cost</div>
                      <div className="mt-1 font-mono text-xl">{formatINR(presetTotal(p))}</div>
                    </div>
                    <span className="text-xs text-muted-foreground transition-transform group-hover:translate-x-1">→</span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative border-t border-hairline py-40">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <Reveal>
            <h2 className="font-display text-5xl font-semibold leading-[0.95] tracking-tighter text-balance md:text-7xl">
              Your next rig is <br className="hidden md:block" />
              <span className="silver-text">a few clicks away.</span>
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="mx-auto mt-8 max-w-xl text-muted-foreground">
              No accounts. No noise. Just a clean, intelligent path from budget to build.
            </p>
          </Reveal>
          <Reveal delay={200}>
            <Link
              to="/builder"
              className="mt-10 inline-flex items-center gap-2 rounded-full bg-foreground px-8 py-4 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.02]"
            >
              Open the Builder →
            </Link>
          </Reveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}
