import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

const DEFAULT_SITE_URL = "https://swastik-lift-elevate-main.vercel.app";

const normalizeSiteUrl = (value?: string) => {
  if (!value) return DEFAULT_SITE_URL;

  try {
    const parsed = new URL(value.startsWith("http") ? value : `https://${value}`);
    return parsed.origin.replace(/\/+$/, "");
  } catch {
    return DEFAULT_SITE_URL;
  }
};

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const siteUrl = normalizeSiteUrl(
    process.env.VITE_SITE_URL ||
      process.env.SITE_URL ||
      process.env.VERCEL_PROJECT_PRODUCTION_URL ||
      process.env.VERCEL_URL
  );

  return {
    server: {
      host: "::",
      port: 8080,
      proxy: {
        '/api': {
          target: 'http://localhost:5001',
          changeOrigin: true,
        },
      },
    },
    plugins: [
      react(),
      {
        name: "html-seo-site-url",
        transformIndexHtml(html) {
          return html.replace(/__SITE_URL__/g, siteUrl);
        },
      },
      mode === 'development' &&
      componentTagger(),
    ].filter(Boolean),
    define: {
      __SITE_URL__: JSON.stringify(siteUrl),
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
