import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="grain flex min-h-screen items-center justify-center bg-background px-4 text-foreground">
      <div className="max-w-md text-center">
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">Error 404</div>
        <h1 className="mt-4 font-display text-7xl font-semibold tracking-tighter">Off the grid.</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          The page you're looking for doesn't exist — or it's been disassembled.
        </p>
        <div className="mt-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.02]"
          >
            Back home →
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "RigWise — Build Your Dream PC. Smartly." },
      { name: "description", content: "An intelligent, scroll-driven PC building companion. Pick your budget and purpose, get a balanced build." },
      { name: "author", content: "RigWise" },
      { name: "theme-color", content: "#0a0a0a" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:title", content: "RigWise — Build Your Dream PC. Smartly." },
      { name: "twitter:title", content: "RigWise — Build Your Dream PC. Smartly." },
      { property: "og:description", content: "An intelligent, scroll-driven PC building companion. Pick your budget and purpose, get a balanced build." },
      { name: "twitter:description", content: "An intelligent, scroll-driven PC building companion. Pick your budget and purpose, get a balanced build." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/54ef2785-7659-44b3-ba6f-118a241309bb/id-preview-2aa4c427--15ccf60e-f710-4756-8060-89649fac5741.lovable.app-1776527145509.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/54ef2785-7659-44b3-ba6f-118a241309bb/id-preview-2aa4c427--15ccf60e-f710-4756-8060-89649fac5741.lovable.app-1776527145509.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return <Outlet />;
}
