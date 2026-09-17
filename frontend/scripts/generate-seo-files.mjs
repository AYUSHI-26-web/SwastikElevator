import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const DEFAULT_SITE_URL = "https://swastik-lift-elevate-main.vercel.app";

const publicRoutes = [
  { path: "/", priority: "1.0", changefreq: "weekly" },
  { path: "/about", priority: "0.8", changefreq: "monthly" },
  { path: "/services", priority: "0.9", changefreq: "weekly" },
  { path: "/projects", priority: "0.7", changefreq: "monthly" },
  { path: "/gallery", priority: "0.7", changefreq: "monthly" },
  { path: "/contact", priority: "0.9", changefreq: "weekly" },
];

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = resolve(__dirname, "..", "public");

const normalizeSiteUrl = (value) => {
  if (!value) return DEFAULT_SITE_URL;

  try {
    const parsed = new URL(value.startsWith("http") ? value : `https://${value}`);
    return parsed.origin.replace(/\/+$/, "");
  } catch {
    return DEFAULT_SITE_URL;
  }
};

const siteUrl = normalizeSiteUrl(
  process.env.VITE_SITE_URL ||
    process.env.SITE_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL ||
    process.env.VERCEL_URL ||
    DEFAULT_SITE_URL
);

const lastmod = process.env.SITEMAP_LASTMOD || new Date().toISOString().slice(0, 10);

const routeUrl = (path) => `${siteUrl}${path === "/" ? "/" : path}`;

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${publicRoutes
  .map(
    (route) => `  <url>
    <loc>${routeUrl(route.path)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>
`;

const robots = `User-agent: *
Allow: /
Disallow: /api/

Sitemap: ${siteUrl}/sitemap.xml
`;

await mkdir(publicDir, { recursive: true });
await Promise.all([
  writeFile(resolve(publicDir, "sitemap.xml"), sitemap),
  writeFile(resolve(publicDir, "robots.txt"), robots),
]);

console.log(`SEO crawl files generated for ${siteUrl}`);
