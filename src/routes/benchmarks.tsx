import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/site/Reveal";
import { components, formatINR, type Category } from "@/data/components";

export const Route = createFileRoute("/benchmarks")({
  head: () => ({
    meta: [
      { title: "Benchmarks — RigWise" },
      { name: "description", content: "Cinebench, 3DMark, NVMe scores for 40+ PC components — visualised, sortable, searchable." },
      { property: "og:title", content: "Benchmarks — RigWise" },
      { property: "og:description", content: "An honest, visual look at component performance." },
    ],
  }),
  component: BenchmarksPage,
});

const CATS: { key: Category | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "cpu", label: "CPU" },
  { key: "gpu", label: "GPU" },
  { key: "ram", label: "RAM" },
  { key: "storage", label: "Storage" },
  { key: "motherboard", label: "Motherboard" },
  { key: "psu", label: "PSU" },
  { key: "cooler", label: "Cooler" },
];

type SortKey = "score" | "price" | "value";

function BenchmarksPage() {
  const [cat, setCat] = useState<(typeof CATS)[number]["key"]>("cpu");
  const [sort, setSort] = useState<SortKey>("score");

  const items = useMemo(() => {
    const base = cat === "all" ? components : components.filter((c) => c.category === cat);
    const withScore = base.filter((c) => (c.benchmark ?? 0) > 0);
    const sorted = withScore.slice().sort((a, b) => {
      if (sort === "price") return a.price - b.price;
      if (sort === "value") {
        const va = (a.benchmark ?? 1) / Math.max(1, a.price);
        const vb = (b.benchmark ?? 1) / Math.max(1, b.price);
        return vb - va;
      }
      return (b.benchmark ?? 0) - (a.benchmark ?? 0);
    });
    return sorted;
  }, [cat, sort]);

  const max = Math.max(...items.map((c) => c.benchmark ?? 0), 1);

  return (
    <div className="grain min-h-screen bg-background">
      <Header />

      <section className="pt-32 pb-12">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal>
            <div className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">Benchmarks</div>
          </Reveal>
          <Reveal delay={60}>
            <h1 className="mt-4 max-w-3xl font-display text-5xl font-semibold tracking-tighter md:text-7xl">
              The numbers <br />
              <span className="text-muted-foreground">that matter.</span>
            </h1>
          </Reveal>
          <Reveal delay={140}>
            <p className="mt-6 max-w-xl text-muted-foreground">
              Headline scores normalised 0–100 so you can compare across categories. Detailed
              benchmarks shown when available.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-hairline">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {CATS.map((c) => (
                <button
                  key={c.key}
                  onClick={() => setCat(c.key)}
                  className={`rounded-full border px-3 py-1.5 text-[11px] uppercase tracking-widest transition-all ${
                    cat === c.key
                      ? "border-foreground bg-foreground text-primary-foreground"
                      : "border-hairline text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 text-[11px] uppercase tracking-widest">
              <span className="text-muted-foreground">Sort</span>
              {(["score", "price", "value"] as SortKey[]).map((s) => (
                <button
                  key={s}
                  onClick={() => setSort(s)}
                  className={`rounded-full border px-3 py-1.5 transition-all ${
                    sort === s
                      ? "border-foreground bg-foreground text-primary-foreground"
                      : "border-hairline text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-10 space-y-px">
            {items.map((c, i) => (
              <div
                key={c.id}
                className="group grid grid-cols-12 items-center gap-4 border-b border-hairline px-2 py-5 transition-colors hover:bg-surface"
              >
                <div className="col-span-1 font-mono text-xs text-muted-foreground">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div className="col-span-11 md:col-span-4">
                  <div className="font-display text-base font-medium">
                    {c.brand} <span className="text-muted-foreground">{c.name}</span>
                  </div>
                  <div className="mt-1 text-[10px] uppercase tracking-widest text-muted-foreground">
                    {c.category}
                  </div>
                </div>

                <div className="col-span-12 md:col-span-5">
                  <div className="flex items-center gap-3">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-hairline">
                      <div
                        className="h-1.5 rounded-full bg-foreground transition-[width] duration-500"
                        style={{ width: `${((c.benchmark ?? 0) / max) * 100}%` }}
                      />
                    </div>
                    <div className="w-10 text-right font-mono text-sm">{c.benchmark}</div>
                  </div>
                  {c.benchmarks && (
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[10px] font-mono text-muted-foreground">
                      {Object.entries(c.benchmarks).map(([k, v]) => (
                        <span key={k}>
                          {k}: <span className="text-foreground">{v.toLocaleString()}</span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="col-span-12 text-right font-mono text-sm md:col-span-2">
                  {formatINR(c.price)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
