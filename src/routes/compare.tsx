import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/site/Reveal";
import { byCategory, formatINR, type Category } from "@/data/components";

export const Route = createFileRoute("/compare")({
  head: () => ({
    meta: [
      { title: "Compare — RigWise" },
      { name: "description", content: "Compare PC components side-by-side. Specs, prices, benchmarks — all in one view." },
      { property: "og:title", content: "Compare — RigWise" },
      { property: "og:description", content: "Side-by-side component comparison with diff highlighting." },
    ],
  }),
  component: ComparePage,
});

const CATEGORIES: { key: Category; label: string }[] = [
  { key: "cpu", label: "CPUs" },
  { key: "gpu", label: "GPUs" },
  { key: "motherboard", label: "Motherboards" },
  { key: "ram", label: "Memory" },
  { key: "storage", label: "Storage" },
  { key: "psu", label: "Power Supplies" },
  { key: "cooler", label: "Coolers" },
  { key: "case", label: "Cases" },
];

function ComparePage() {
  const [category, setCategory] = useState<Category>("cpu");
  const list = byCategory(category);
  const [selected, setSelected] = useState<string[]>(() => list.slice(0, 2).map((c) => c.id));
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return byCategory(category).filter((c) =>
      `${c.brand} ${c.name}`.toLowerCase().includes(q)
    );
  }, [category, query]);

  const items = selected
    .map((id) => byCategory(category).find((c) => c.id === id))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));

  const toggle = (id: string) => {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 3) return [prev[1], prev[2], id];
      return [...prev, id];
    });
  };

  const onCategoryChange = (cat: Category) => {
    setCategory(cat);
    setSelected(byCategory(cat).slice(0, 2).map((c) => c.id));
  };

  // numeric fields to compare
  const numericFields: { key: string; label: string; get: (c: NonNullable<(typeof items)[number]>) => number | undefined }[] = [
    { key: "price", label: "Price", get: (c) => c.price },
    { key: "tdp", label: "TDP (W)", get: (c) => c.tdp },
    { key: "capacityGB", label: "Capacity (GB)", get: (c) => c.capacityGB },
    { key: "speedMHz", label: "Speed (MT/s)", get: (c) => c.speedMHz },
    { key: "benchmark", label: "Benchmark score", get: (c) => c.benchmark },
  ];

  return (
    <div className="grain min-h-screen bg-background">
      <Header />

      <section className="pt-32 pb-12">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal>
            <div className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">Compare</div>
          </Reveal>
          <Reveal delay={60}>
            <h1 className="mt-4 max-w-3xl font-display text-5xl font-semibold tracking-tighter md:text-7xl">
              Two parts. <span className="text-muted-foreground">One honest answer.</span>
            </h1>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-hairline">
        <div className="mx-auto max-w-7xl px-6 py-8">
          {/* Category tabs */}
          <div className="-mx-6 mb-8 overflow-x-auto px-6">
            <div className="flex gap-2">
              {CATEGORIES.map((c) => (
                <button
                  key={c.key}
                  onClick={() => onCategoryChange(c.key)}
                  className={`whitespace-nowrap rounded-full border px-4 py-2 text-xs uppercase tracking-widest transition-all ${
                    category === c.key
                      ? "border-foreground bg-foreground text-primary-foreground"
                      : "border-hairline text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-12">
            {/* Picker */}
            <div className="lg:col-span-4">
              <div className="rounded-2xl border border-hairline bg-surface p-6">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search components…"
                  className="w-full rounded-md border border-hairline bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-foreground focus:outline-none"
                />
                <div className="mt-2 text-[11px] text-muted-foreground">
                  Pick up to 3 · {selected.length} selected
                </div>
                <div className="mt-4 max-h-[480px] space-y-1 overflow-y-auto pr-1">
                  {filtered.map((c) => {
                    const on = selected.includes(c.id);
                    return (
                      <button
                        key={c.id}
                        onClick={() => toggle(c.id)}
                        className={`flex w-full items-center justify-between gap-3 rounded-md border px-3 py-2 text-left text-sm transition-colors ${
                          on
                            ? "border-foreground bg-background"
                            : "border-transparent hover:bg-background"
                        }`}
                      >
                        <span className="truncate">
                          <span className="text-muted-foreground">{c.brand}</span> {c.name}
                        </span>
                        <span className="shrink-0 font-mono text-[11px] text-muted-foreground">{formatINR(c.price)}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Comparison table */}
            <div className="lg:col-span-8">
              {items.length === 0 ? (
                <div className="rounded-2xl border border-hairline p-12 text-center text-muted-foreground">
                  Pick at least one component to compare.
                </div>
              ) : (
                <div className="overflow-hidden rounded-2xl border border-hairline">
                  <div className="grid" style={{ gridTemplateColumns: `180px repeat(${items.length}, minmax(0,1fr))` }}>
                    <div className="border-b border-hairline bg-surface px-5 py-4 text-[10px] uppercase tracking-widest text-muted-foreground">
                      Component
                    </div>
                    {items.map((c) => (
                      <div key={c.id} className="border-b border-l border-hairline bg-surface px-5 py-4">
                        <div className="font-display text-sm font-semibold">{c.brand}</div>
                        <div className="text-xs text-muted-foreground">{c.name}</div>
                      </div>
                    ))}
                    {numericFields.map((f) => {
                      const values = items.map((c) => f.get(c));
                      const max = Math.max(...values.map((v) => v ?? -Infinity));
                      const min = Math.min(...values.map((v) => v ?? Infinity));
                      // For price, lower is better; for everything else higher is better.
                      const lowerBetter = f.key === "price";
                      const best = lowerBetter ? min : max;
                      return (
                        <RowGroup key={f.key} label={f.label}>
                          {items.map((c, idx) => {
                            const v = values[idx];
                            const isBest = v != null && v === best && Number.isFinite(best);
                            return (
                              <div key={c.id} className="border-l border-hairline px-5 py-4">
                                {v == null ? (
                                  <span className="text-muted-foreground">—</span>
                                ) : (
                                  <div className="flex items-center gap-3">
                                    <div className={`font-mono text-sm ${isBest ? "text-foreground" : "text-muted-foreground"}`}>
                                      {f.key === "price" ? formatINR(v) : v.toLocaleString()}
                                    </div>
                                    {isBest && <span className="rounded-full border border-hairline px-1.5 py-0.5 text-[9px] uppercase tracking-widest">Best</span>}
                                  </div>
                                )}
                                {v != null && Number.isFinite(max) && max > 0 && (
                                  <div className="mt-2 h-1 w-full rounded-full bg-hairline">
                                    <div
                                      className={`h-1 rounded-full ${isBest ? "bg-foreground" : "bg-muted-foreground/60"}`}
                                      style={{ width: `${Math.min(100, ((v ?? 0) / max) * 100)}%` }}
                                    />
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </RowGroup>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function RowGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <>
      <div className="border-t border-hairline bg-background px-5 py-4 text-[11px] uppercase tracking-widest text-muted-foreground">
        {label}
      </div>
      <div className="contents">{children}</div>
    </>
  );
}
