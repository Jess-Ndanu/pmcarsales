import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

const SITE_URL = "https://pmcarsales.lovable.app";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const staticPaths = ["/", "/inventory", "/about", "/contact"];
        const today = new Date().toISOString().split("T")[0];

        const { data: cars } = await supabase
          .from("cars")
          .select("id, updated_at")
          .eq("sold", false)
          .order("updated_at", { ascending: false })
          .limit(1000);

        const urls = [
          ...staticPaths.map(
            (p) =>
              `<url><loc>${SITE_URL}${p}</loc><lastmod>${today}</lastmod><changefreq>${p === "/" || p === "/inventory" ? "daily" : "monthly"}</changefreq><priority>${p === "/" ? "1.0" : "0.8"}</priority></url>`
          ),
          ...(cars ?? []).map(
            (c) =>
              `<url><loc>${SITE_URL}/inventory/${c.id}</loc><lastmod>${(c.updated_at ?? today).split("T")[0]}</lastmod><changefreq>weekly</changefreq><priority>0.7</priority></url>`
          ),
        ];

        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
