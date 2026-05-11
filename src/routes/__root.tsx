import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";

import appCss from "../styles.css?url";

const SITE_URL = "https://pmcarsales.lovable.app";
const OG_IMAGE = "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/e5dce809-4997-4384-93d0-636322713ca9/id-preview-86132273--460eb687-172f-486f-a2b6-7a2e3b824127.lovable.app-1777967759146.png";

const autoDealerJsonLd = {
  "@context": "https://schema.org",
  "@type": "AutoDealer",
  name: "PM Car Sales",
  description: "Quality used cars dealer in Mombasa, Kenya. Hand-picked vehicles with transparent pricing.",
  url: SITE_URL,
  telephone: "+254712604775",
  email: "pmcarsalesmombasa@gmail.com",
  image: OG_IMAGE,
  priceRange: "KES",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Mombasa",
    addressCountry: "KE",
  },
  areaServed: [
    { "@type": "City", name: "Mombasa" },
    { "@type": "Country", name: "Kenya" },
  ],
  sameAs: [
    "https://www.facebook.com/share/18VCEU7hDC/",
    "https://www.tiktok.com/@piusmulatya",
  ],
};

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
      { title: "PM Car Sales — Quality Used Cars in Mombasa, Kenya" },
      { name: "description", content: "PM Car Sales: hand-picked quality used cars in Mombasa, Kenya. Browse our inventory, check prices in KES, and chat with us on WhatsApp." },
      { name: "keywords", content: "used cars Mombasa, car dealer Mombasa, cars for sale Kenya, buy car Mombasa, PM Car Sales, second hand cars Kenya" },
      { name: "author", content: "PM Car Sales" },
      { name: "robots", content: "index, follow" },
      { property: "og:site_name", content: "PM Car Sales" },
      { property: "og:title", content: "PM Car Sales — Quality Used Cars in Mombasa, Kenya" },
      { property: "og:description", content: "Hand-picked quality used cars in Mombasa. Transparent pricing in KES. Chat on WhatsApp." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: SITE_URL },
      { property: "og:locale", content: "en_KE" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "PM Car Sales — Quality Used Cars in Mombasa, Kenya" },
      { name: "twitter:description", content: "Hand-picked quality used cars in Mombasa. Transparent pricing in KES." },
      { property: "og:image", content: OG_IMAGE },
      { name: "twitter:image", content: OG_IMAGE },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "canonical", href: SITE_URL },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(autoDealerJsonLd),
      },
    ],
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
