import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/site/Reveal";
import { presets, presetTotal, presetParts, type Preset } from "@/data/presets";
import { formatINR } from "@/data/components";

export const Route = createFileRoute("/presets")({
  head: () => ({
    meta: [
      { title: "Presets — RigWise" },
      { name: "description", content: "Six curated PC builds from ₹30k to ₹2.2L. Office, gaming, creator, studio — opinionated and balanced." },
      { property: "og:title", content: "Presets — RigWise" },
      { property: "og:description", content: "Curated, balanced PC builds for every budget and use case." },
    ],
  }),
  component: PresetsPage,
});

function PresetsPage() {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="grain min-h-screen bg-background">
      <Header />

      <section className="pt-32 pb-12">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal>
            <div className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">Presets</div>
          </Reveal>
          <Reveal delay={60}>
            <h1 className="mt-4 max-w-3xl font-display text-5xl font-semibold tracking-tighter md:text-7xl">
              Builds we'd build. <span className="text-muted-foreground">Cloned in a click.</span>
            </h1>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-hairline">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {presets.map((p) => (
              <PresetCard
                key={p.id}
                preset={p}
                open={openId === p.id}
                onToggle={() => setOpenId((cur) => (cur === p.id ? null : p.id))}
              />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function PresetCard({ preset, open, onToggle }: { preset: Preset; open: boolean; onToggle: () => void; }) {
  const total = presetTotal(preset);
  const parts = presetParts(preset);

  return (
    <div className={`group rounded-2xl border border-hairline bg-surface p-8 transition-all ${open ? "lg:col-span-3 md:col-span-2" : ""}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{preset.useCase}</div>
          <div className="mt-3 font-display text-2xl font-semibold tracking-tight">{preset.name}</div>
          <p className="mt-2 text-sm text-muted-foreground">{preset.tagline}</p>
        </div>
        <div className="text-right">
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Build</div>
          <div className="mt-1 font-mono text-lg">{formatINR(total)}</div>
        </div>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <button
          onClick={onToggle}
          className="rounded-full border border-hairline px-4 py-2 text-xs hover:bg-background"
        >
          {open ? "Hide details" : "View build"}
        </button>
        <Link
          to="/builder"
          className="rounded-full bg-foreground px-4 py-2 text-xs text-primary-foreground hover:opacity-90"
        >
          Open in Builder →
        </Link>
      </div>

      {open && (
        <div className="mt-8 grid gap-px overflow-hidden rounded-xl border border-hairline bg-hairline md:grid-cols-2">
          {parts.map((c) => (
            <div key={c.id} className="bg-surface px-5 py-4">
              <div className="text-[9px] uppercase tracking-widest text-muted-foreground">{c.category}</div>
              <div className="mt-1 text-sm">
                <span className="text-muted-foreground">{c.brand}</span> {c.name}
              </div>
              <div className="mt-2 flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                <span>
                  {c.tdp != null && <>{c.tdp}W · </>}
                  {c.capacityGB && <>{c.capacityGB}GB · </>}
                  {c.benchmark && <>score {c.benchmark}</>}
                </span>
                <span className="text-foreground">{formatINR(c.price)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
