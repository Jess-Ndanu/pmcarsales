import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
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
      { title: "Pius Mulatya" },
      { name: "description", content: "Hand-picked premium pre-owned cars. Browse our inventory of luxury sedans, SUVs, sports cars, and EVs with transparent pricing." },
      { property: "og:title", content: "Pius Mulatya" },
      { property: "og:description", content: "Hand-picked premium pre-owned cars. Browse our inventory of luxury sedans, SUVs, sports cars, and EVs with transparent pricing." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Pius Mulatya" },
      { name: "twitter:description", content: "Hand-picked premium pre-owned cars. Browse our inventory of luxury sedans, SUVs, sports cars, and EVs with transparent pricing." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/e5dce809-4997-4384-93d0-636322713ca9/id-preview-86132273--460eb687-172f-486f-a2b6-7a2e3b824127.lovable.app-1777967759146.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/e5dce809-4997-4384-93d0-636322713ca9/id-preview-86132273--460eb687-172f-486f-a2b6-7a2e3b824127.lovable.app-1777967759146.png" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
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
  return (
    <>
      <Outlet />
      <Toaster richColors position="top-center" />
    </>
  );
}
