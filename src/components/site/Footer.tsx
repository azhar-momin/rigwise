import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="border-t border-hairline bg-background">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="font-display text-2xl font-semibold tracking-tight">
              RIG<span className="text-muted-foreground">WISE</span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              An intelligent PC building companion — pick your budget, pick your purpose, and
              get a build that actually fits.
            </p>
            <p className="mt-6 text-xs uppercase tracking-widest text-muted-foreground">
              A BCA Final-Year Project · 2025
            </p>
          </div>

          <div>
            <div className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Product</div>
            <ul className="mt-4 space-y-3 text-sm">
              <li><Link to="/builder" className="story-link">Builder</Link></li>
              <li><Link to="/compare" className="story-link">Compare</Link></li>
              <li><Link to="/benchmarks" className="story-link">Benchmarks</Link></li>
              <li><Link to="/presets" className="story-link">Presets</Link></li>
              <li><Link to="/guides" className="story-link">Guides</Link></li>
            </ul>
          </div>

          <div>
            <div className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Resources</div>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li>Component data: PCPartPicker, TechPowerUp</li>
              <li>Benchmarks: Cinebench, 3DMark</li>
              <li>Pricing: Amazon.in, Flipkart</li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-hairline pt-8 text-xs text-muted-foreground md:flex-row md:items-center">
          <div>© 2025 RigWise. Designed & built for academic submission.</div>
          <div className="flex items-center gap-6">
            <span className="font-mono">v1.0.0</span>
            <span>Mock data — UI demo</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
