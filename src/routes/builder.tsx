import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/site/Reveal";
import { byCategory, formatINR, type Category, type PCComponent } from "@/data/components";

export const Route = createFileRoute("/builder")({
  head: () => ({
    meta: [
      { title: "Builder — RigWise" },
      { name: "description", content: "Set your budget and use case. RigWise picks a balanced, compatibility-checked PC build for you." },
      { property: "og:title", content: "Builder — RigWise" },
      { property: "og:description", content: "Smart budget-aware PC build recommendations." },
    ],
  }),
  component: BuilderPage,
});

type UseCase = "Gaming" | "Editing" | "Office" | "General";

interface Build {
  cpu?: PCComponent;
  motherboard?: PCComponent;
  ram?: PCComponent;
  gpu?: PCComponent;
  storage?: PCComponent;
  psu?: PCComponent;
  cooler?: PCComponent;
  case?: PCComponent;
}

function pickBest(list: PCComponent[], maxPrice: number, prefer?: (c: PCComponent) => number): PCComponent | undefined {
  const within = list.filter((c) => c.price <= maxPrice);
  if (!within.length) return list.slice().sort((a, b) => a.price - b.price)[0];
  return within.slice().sort((a, b) => (prefer?.(b) ?? b.benchmark ?? 0) - (prefer?.(a) ?? a.benchmark ?? 0))[0];
}

function buildFor(budget: number, useCase: UseCase): Build {
  // Budget allocation by use case (fractions roughly sum to 1)
  const allocByCase: Record<UseCase, Record<keyof Build, number>> = {
    Gaming:  { cpu: 0.18, motherboard: 0.10, ram: 0.06, gpu: 0.40, storage: 0.07, psu: 0.08, cooler: 0.04, case: 0.07 },
    Editing: { cpu: 0.30, motherboard: 0.10, ram: 0.12, gpu: 0.22, storage: 0.10, psu: 0.07, cooler: 0.04, case: 0.05 },
    Office:  { cpu: 0.30, motherboard: 0.18, ram: 0.10, gpu: 0.0,  storage: 0.12, psu: 0.10, cooler: 0.06, case: 0.14 },
    General: { cpu: 0.22, motherboard: 0.12, ram: 0.10, gpu: 0.25, storage: 0.10, psu: 0.08, cooler: 0.05, case: 0.08 },
  };
  const alloc = allocByCase[useCase];

  const cpu = pickBest(byCategory("cpu"), budget * alloc.cpu);
  const motherboard = pickBest(
    byCategory("motherboard").filter((m) => !cpu?.socket || m.socket === cpu.socket),
    budget * alloc.motherboard
  );
  const ram = pickBest(byCategory("ram"), budget * alloc.ram, (c) => (c.capacityGB ?? 0) * 0.4 + (c.benchmark ?? 0));
  const gpu = alloc.gpu > 0 ? pickBest(byCategory("gpu"), budget * alloc.gpu) : undefined;
  const storage = pickBest(byCategory("storage"), budget * alloc.storage);
  const minPsu = (cpu?.tdp ?? 65) + (gpu?.tdp ?? 0) + 150;
  const psu = pickBest(
    byCategory("psu").filter((p) => (p.tdp ?? 0) >= minPsu),
    budget * alloc.psu
  ) ?? pickBest(byCategory("psu"), budget * alloc.psu);
  const cooler = pickBest(byCategory("cooler"), budget * alloc.cooler);
  const caseC = pickBest(byCategory("case"), budget * alloc.case);

  return { cpu, motherboard, ram, gpu, storage, psu, cooler, case: caseC };
}

function totalOf(b: Build) {
  return Object.values(b).reduce((s, c) => s + (c?.price ?? 0), 0);
}

function compatBadges(b: Build) {
  const issues: string[] = [];
  const ok: string[] = [];
  if (b.cpu && b.motherboard) {
    if (b.cpu.socket === b.motherboard.socket) ok.push("Socket match");
    else issues.push("Socket mismatch");
  }
  const required = (b.cpu?.tdp ?? 0) + (b.gpu?.tdp ?? 0) + 150;
  if (b.psu) {
    if ((b.psu.tdp ?? 0) >= required) ok.push("PSU headroom");
    else issues.push("PSU under-sized");
  }
  if (b.ram && b.cpu?.socket === "AM5" && b.ram.name.includes("DDR4")) issues.push("DDR4 on AM5");
  if (!issues.length) ok.push("Build validated");
  return { ok, issues };
}

const CATEGORIES_ORDER: { key: keyof Build; label: string }[] = [
  { key: "cpu", label: "CPU" },
  { key: "cooler", label: "Cooler" },
  { key: "motherboard", label: "Motherboard" },
  { key: "ram", label: "Memory" },
  { key: "gpu", label: "Graphics" },
  { key: "storage", label: "Storage" },
  { key: "psu", label: "Power" },
  { key: "case", label: "Case" },
];

function BuilderPage() {
  const [budget, setBudget] = useState(80000);
  const [useCase, setUseCase] = useState<UseCase>("Gaming");

  const build = useMemo(() => buildFor(budget, useCase), [budget, useCase]);
  const total = totalOf(build);
  const { ok, issues } = compatBadges(build);

  return (
    <div className="grain min-h-screen bg-background">
      <Header />
      <section className="pt-32 pb-16">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal>
            <div className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">Builder</div>
          </Reveal>
          <Reveal delay={60}>
            <h1 className="mt-4 max-w-3xl font-display text-5xl font-semibold tracking-tighter md:text-7xl">
              Set the brief. <span className="text-muted-foreground">We do the rest.</span>
            </h1>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-hairline">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-12 lg:grid-cols-12">
          {/* CONTROLS */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-10 rounded-2xl border border-hairline bg-surface p-8 glow-ring">
              <div>
                <div className="flex items-baseline justify-between">
                  <label className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">Budget</label>
                  <div className="font-display text-3xl font-semibold tracking-tight">{formatINR(budget)}</div>
                </div>
                <input
                  type="range"
                  min={25000}
                  max={300000}
                  step={2500}
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="mt-6 w-full accent-foreground"
                />
                <div className="mt-2 flex justify-between text-[10px] font-mono text-muted-foreground">
                  <span>₹25k</span><span>₹3L</span>
                </div>
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">Use case</label>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {(["Gaming", "Editing", "Office", "General"] as UseCase[]).map((u) => (
                    <button
                      key={u}
                      onClick={() => setUseCase(u)}
                      className={`rounded-lg border px-4 py-3 text-sm font-medium transition-all ${
                        useCase === u
                          ? "border-foreground bg-foreground text-primary-foreground"
                          : "border-hairline bg-background text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {u}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-hairline pt-6">
                <div className="flex items-baseline justify-between">
                  <div className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">Estimated total</div>
                  <div className="font-display text-2xl font-semibold">{formatINR(total)}</div>
                </div>
                <div className="mt-2 text-[11px] text-muted-foreground">
                  {total <= budget ? `${formatINR(budget - total)} under budget` : `${formatINR(total - budget)} over budget`}
                </div>
              </div>

              <div className="space-y-2">
                {ok.map((b) => (
                  <div key={b} className="flex items-center gap-2 text-xs text-foreground">
                    <span className="h-1.5 w-1.5 rounded-full bg-foreground" /> {b}
                  </div>
                ))}
                {issues.map((b) => (
                  <div key={b} className="flex items-center gap-2 text-xs text-destructive">
                    <span className="h-1.5 w-1.5 rounded-full bg-destructive" /> {b}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* BUILD */}
          <div className="lg:col-span-8">
            <div className="overflow-hidden rounded-2xl border border-hairline">
              {CATEGORIES_ORDER.map(({ key, label }, i) => {
                const c = build[key];
                if (!c) {
                  return (
                    <div key={key} className={`flex items-center justify-between px-6 py-6 ${i ? "border-t border-hairline" : ""}`}>
                      <div>
                        <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
                        <div className="mt-1 text-sm text-muted-foreground">— Not included —</div>
                      </div>
                    </div>
                  );
                }
                return (
                  <div
                    key={key}
                    className={`group flex flex-col gap-4 px-6 py-6 transition-colors hover:bg-surface md:flex-row md:items-center md:justify-between ${
                      i ? "border-t border-hairline" : ""
                    }`}
                    style={{ animation: `fade-in 0.5s ease-out ${i * 60}ms both` }}
                  >
                    <div className="flex items-start gap-6">
                      <div className="w-20 shrink-0 text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
                      <div>
                        <div className="font-display text-lg font-medium">{c.brand} <span className="text-muted-foreground">{c.name}</span></div>
                        <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-[11px] font-mono text-muted-foreground">
                          {c.socket && <span>Socket {c.socket}</span>}
                          {c.tdp != null && <span>{c.tdp}W</span>}
                          {c.capacityGB && <span>{c.capacityGB} GB</span>}
                          {c.speedMHz && <span>{c.speedMHz} MT/s</span>}
                          {c.benchmark && <span>Score {c.benchmark}</span>}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      {c.benchmark != null && (
                        <div className="hidden w-32 md:block">
                          <div className="h-1 w-full rounded-full bg-hairline">
                            <div className="h-1 rounded-full bg-foreground" style={{ width: `${c.benchmark}%` }} />
                          </div>
                        </div>
                      )}
                      <div className="font-mono text-base">{formatINR(c.price)}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-hairline bg-surface p-6">
              <div>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Final price</div>
                <div className="font-display text-3xl font-semibold">{formatINR(total)}</div>
              </div>
              <div className="flex gap-3">
                <Link to="/compare" className="rounded-full border border-hairline px-5 py-2.5 text-sm hover:bg-background">
                  Compare parts
                </Link>
                <Link to="/presets" className="rounded-full bg-foreground px-5 py-2.5 text-sm text-primary-foreground hover:opacity-90">
                  Browse presets
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
