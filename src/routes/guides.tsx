import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/site/Reveal";
import { guides, type Guide } from "@/data/guides";

export const Route = createFileRoute("/guides")({
  head: () => ({
    meta: [
      { title: "Guides — RigWise" },
      { name: "description", content: "Plain-spoken, no-fluff guides on choosing a CPU, sizing a PSU, picking a GPU and more." },
      { property: "og:title", content: "Guides — RigWise" },
      { property: "og:description", content: "Editorial guides on PC building fundamentals." },
    ],
  }),
  component: GuidesPage,
});

function GuidesPage() {
  const [active, setActive] = useState<Guide | null>(null);

  return (
    <div className="grain min-h-screen bg-background">
      <Header />

      <section className="pt-32 pb-12">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal>
            <div className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">Guides</div>
          </Reveal>
          <Reveal delay={60}>
            <h1 className="mt-4 max-w-3xl font-display text-5xl font-semibold tracking-tighter md:text-7xl">
              Read once. <span className="text-muted-foreground">Build with confidence.</span>
            </h1>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-hairline">
        <div className="mx-auto max-w-7xl px-6 py-12">
          {/* Featured */}
          <Reveal>
            <article
              onClick={() => setActive(guides[0])}
              className="group grid cursor-pointer gap-8 rounded-2xl border border-hairline bg-surface p-8 transition-colors hover:bg-surface-elevated md:grid-cols-12 md:p-12"
            >
              <div className="md:col-span-5">
                <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{guides[0].kicker} · Featured</div>
                <div className="mt-4 font-display text-3xl font-semibold tracking-tight md:text-5xl text-balance">
                  {guides[0].title}
                </div>
              </div>
              <div className="md:col-span-7">
                <p className="text-base text-muted-foreground md:text-lg">{guides[0].excerpt}</p>
                <div className="mt-6 flex items-center gap-3 text-[11px] uppercase tracking-widest text-muted-foreground">
                  <span>{guides[0].readMin} min read</span>
                  <span className="h-px w-8 bg-hairline" />
                  <span className="story-link text-foreground">Read article →</span>
                </div>
              </div>
            </article>
          </Reveal>

          {/* Grid */}
          <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-hairline bg-hairline md:grid-cols-2 lg:grid-cols-3">
            {guides.slice(1).map((g) => (
              <button
                key={g.id}
                onClick={() => setActive(g)}
                className="group bg-background p-8 text-left transition-colors hover:bg-surface"
              >
                <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{g.kicker}</div>
                <div className="mt-4 font-display text-xl font-semibold tracking-tight">{g.title}</div>
                <p className="mt-3 text-sm text-muted-foreground">{g.excerpt}</p>
                <div className="mt-6 flex items-center justify-between text-[11px] uppercase tracking-widest text-muted-foreground">
                  <span>{g.readMin} min</span>
                  <span className="text-foreground transition-transform group-hover:translate-x-1">→</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Reader modal */}
      {active && (
        <div className="fixed inset-0 z-[80] flex items-end justify-center bg-background/80 p-0 backdrop-blur-md md:items-center md:p-6 animate-fade-in">
          <div className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-t-3xl border border-hairline bg-surface p-8 md:rounded-3xl md:p-12">
            <button
              onClick={() => setActive(null)}
              className="absolute right-6 top-6 rounded-full border border-hairline px-3 py-1.5 text-xs hover:bg-background"
            >
              Close
            </button>
            <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{active.kicker} · {active.readMin} min</div>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight md:text-5xl text-balance">{active.title}</h2>
            <div className="mt-2 text-base text-muted-foreground md:text-lg">{active.excerpt}</div>
            <div className="mt-8 space-y-5 text-base leading-relaxed text-foreground/90">
              {active.body.map((p, i) => <p key={i}>{p}</p>)}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
