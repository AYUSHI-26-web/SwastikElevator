// vite.config.ts
import { defineConfig } from "file:///C:/Users/ayush/Documents/swastik-lift-elevate-main/swastik-lift-elevate-main/frontend/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/ayush/Documents/swastik-lift-elevate-main/swastik-lift-elevate-main/frontend/node_modules/@vitejs/plugin-react-swc/index.js";
import path from "path";
import { componentTagger } from "file:///C:/Users/ayush/Documents/swastik-lift-elevate-main/swastik-lift-elevate-main/frontend/node_modules/lovable-tagger/dist/index.js";
var __vite_injected_original_dirname = "C:\\Users\\ayush\\Documents\\swastik-lift-elevate-main\\swastik-lift-elevate-main\\frontend";
var DEFAULT_SITE_URL = "https://swastik-lift-elevate-main.vercel.app";
var normalizeSiteUrl = (value) => {
  if (!value) return DEFAULT_SITE_URL;
  try {
    const parsed = new URL(value.startsWith("http") ? value : `https://${value}`);
    return parsed.origin.replace(/\/+$/, "");
  } catch {
    return DEFAULT_SITE_URL;
  }
};
var vite_config_default = defineConfig(({ mode }) => {
  const siteUrl = normalizeSiteUrl(
    process.env.VITE_SITE_URL || process.env.SITE_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL
  );
  return {
    server: {
      host: "::",
      port: 8080,
      proxy: {
        "/api": {
          target: "http://localhost:5001",
          changeOrigin: true
        }
      }
    },
    plugins: [
      react(),
      {
        name: "html-seo-site-url",
        transformIndexHtml(html) {
          return html.replace(/__SITE_URL__/g, siteUrl);
        }
      },
      mode === "development" && componentTagger()
    ].filter(Boolean),
    define: {
      __SITE_URL__: JSON.stringify(siteUrl)
    },
    resolve: {
      alias: {
        "@": path.resolve(__vite_injected_original_dirname, "./src")
      }
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxheXVzaFxcXFxEb2N1bWVudHNcXFxcc3dhc3Rpay1saWZ0LWVsZXZhdGUtbWFpblxcXFxzd2FzdGlrLWxpZnQtZWxldmF0ZS1tYWluXFxcXGZyb250ZW5kXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxheXVzaFxcXFxEb2N1bWVudHNcXFxcc3dhc3Rpay1saWZ0LWVsZXZhdGUtbWFpblxcXFxzd2FzdGlrLWxpZnQtZWxldmF0ZS1tYWluXFxcXGZyb250ZW5kXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9heXVzaC9Eb2N1bWVudHMvc3dhc3Rpay1saWZ0LWVsZXZhdGUtbWFpbi9zd2FzdGlrLWxpZnQtZWxldmF0ZS1tYWluL2Zyb250ZW5kL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcbmltcG9ydCByZWFjdCBmcm9tIFwiQHZpdGVqcy9wbHVnaW4tcmVhY3Qtc3djXCI7XG5pbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xuaW1wb3J0IHsgY29tcG9uZW50VGFnZ2VyIH0gZnJvbSBcImxvdmFibGUtdGFnZ2VyXCI7XG5cbmNvbnN0IERFRkFVTFRfU0lURV9VUkwgPSBcImh0dHBzOi8vc3dhc3Rpay1saWZ0LWVsZXZhdGUtbWFpbi52ZXJjZWwuYXBwXCI7XG5cbmNvbnN0IG5vcm1hbGl6ZVNpdGVVcmwgPSAodmFsdWU/OiBzdHJpbmcpID0+IHtcbiAgaWYgKCF2YWx1ZSkgcmV0dXJuIERFRkFVTFRfU0lURV9VUkw7XG5cbiAgdHJ5IHtcbiAgICBjb25zdCBwYXJzZWQgPSBuZXcgVVJMKHZhbHVlLnN0YXJ0c1dpdGgoXCJodHRwXCIpID8gdmFsdWUgOiBgaHR0cHM6Ly8ke3ZhbHVlfWApO1xuICAgIHJldHVybiBwYXJzZWQub3JpZ2luLnJlcGxhY2UoL1xcLyskLywgXCJcIik7XG4gIH0gY2F0Y2gge1xuICAgIHJldHVybiBERUZBVUxUX1NJVEVfVVJMO1xuICB9XG59O1xuXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKCh7IG1vZGUgfSkgPT4ge1xuICBjb25zdCBzaXRlVXJsID0gbm9ybWFsaXplU2l0ZVVybChcbiAgICBwcm9jZXNzLmVudi5WSVRFX1NJVEVfVVJMIHx8XG4gICAgICBwcm9jZXNzLmVudi5TSVRFX1VSTCB8fFxuICAgICAgcHJvY2Vzcy5lbnYuVkVSQ0VMX1BST0pFQ1RfUFJPRFVDVElPTl9VUkwgfHxcbiAgICAgIHByb2Nlc3MuZW52LlZFUkNFTF9VUkxcbiAgKTtcblxuICByZXR1cm4ge1xuICAgIHNlcnZlcjoge1xuICAgICAgaG9zdDogXCI6OlwiLFxuICAgICAgcG9ydDogODA4MCxcbiAgICAgIHByb3h5OiB7XG4gICAgICAgICcvYXBpJzoge1xuICAgICAgICAgIHRhcmdldDogJ2h0dHA6Ly9sb2NhbGhvc3Q6NTAwMScsXG4gICAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuICAgIHBsdWdpbnM6IFtcbiAgICAgIHJlYWN0KCksXG4gICAgICB7XG4gICAgICAgIG5hbWU6IFwiaHRtbC1zZW8tc2l0ZS11cmxcIixcbiAgICAgICAgdHJhbnNmb3JtSW5kZXhIdG1sKGh0bWwpIHtcbiAgICAgICAgICByZXR1cm4gaHRtbC5yZXBsYWNlKC9fX1NJVEVfVVJMX18vZywgc2l0ZVVybCk7XG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgbW9kZSA9PT0gJ2RldmVsb3BtZW50JyAmJlxuICAgICAgY29tcG9uZW50VGFnZ2VyKCksXG4gICAgXS5maWx0ZXIoQm9vbGVhbiksXG4gICAgZGVmaW5lOiB7XG4gICAgICBfX1NJVEVfVVJMX186IEpTT04uc3RyaW5naWZ5KHNpdGVVcmwpLFxuICAgIH0sXG4gICAgcmVzb2x2ZToge1xuICAgICAgYWxpYXM6IHtcbiAgICAgICAgXCJAXCI6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi9zcmNcIiksXG4gICAgICB9LFxuICAgIH0sXG4gIH07XG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBK2IsU0FBUyxvQkFBb0I7QUFDNWQsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sVUFBVTtBQUNqQixTQUFTLHVCQUF1QjtBQUhoQyxJQUFNLG1DQUFtQztBQUt6QyxJQUFNLG1CQUFtQjtBQUV6QixJQUFNLG1CQUFtQixDQUFDLFVBQW1CO0FBQzNDLE1BQUksQ0FBQyxNQUFPLFFBQU87QUFFbkIsTUFBSTtBQUNGLFVBQU0sU0FBUyxJQUFJLElBQUksTUFBTSxXQUFXLE1BQU0sSUFBSSxRQUFRLFdBQVcsS0FBSyxFQUFFO0FBQzVFLFdBQU8sT0FBTyxPQUFPLFFBQVEsUUFBUSxFQUFFO0FBQUEsRUFDekMsUUFBUTtBQUNOLFdBQU87QUFBQSxFQUNUO0FBQ0Y7QUFHQSxJQUFPLHNCQUFRLGFBQWEsQ0FBQyxFQUFFLEtBQUssTUFBTTtBQUN4QyxRQUFNLFVBQVU7QUFBQSxJQUNkLFFBQVEsSUFBSSxpQkFDVixRQUFRLElBQUksWUFDWixRQUFRLElBQUksaUNBQ1osUUFBUSxJQUFJO0FBQUEsRUFDaEI7QUFFQSxTQUFPO0FBQUEsSUFDTCxRQUFRO0FBQUEsTUFDTixNQUFNO0FBQUEsTUFDTixNQUFNO0FBQUEsTUFDTixPQUFPO0FBQUEsUUFDTCxRQUFRO0FBQUEsVUFDTixRQUFRO0FBQUEsVUFDUixjQUFjO0FBQUEsUUFDaEI7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLElBQ0EsU0FBUztBQUFBLE1BQ1AsTUFBTTtBQUFBLE1BQ047QUFBQSxRQUNFLE1BQU07QUFBQSxRQUNOLG1CQUFtQixNQUFNO0FBQ3ZCLGlCQUFPLEtBQUssUUFBUSxpQkFBaUIsT0FBTztBQUFBLFFBQzlDO0FBQUEsTUFDRjtBQUFBLE1BQ0EsU0FBUyxpQkFDVCxnQkFBZ0I7QUFBQSxJQUNsQixFQUFFLE9BQU8sT0FBTztBQUFBLElBQ2hCLFFBQVE7QUFBQSxNQUNOLGNBQWMsS0FBSyxVQUFVLE9BQU87QUFBQSxJQUN0QztBQUFBLElBQ0EsU0FBUztBQUFBLE1BQ1AsT0FBTztBQUFBLFFBQ0wsS0FBSyxLQUFLLFFBQVEsa0NBQVcsT0FBTztBQUFBLE1BQ3RDO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
