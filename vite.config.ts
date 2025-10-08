import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import VitePluginSitemap from "vite-plugin-sitemap"; // ✅ default import

export default defineConfig({
  plugins: [
    react(),
    tanstackRouter({
      target: "react",
      autoCodeSplitting: true,
    }),
    VitePluginSitemap({
      hostname: "https://ɛvivibakery.com", // your live domain
      outDir: "dist",
      readable: true,
      // ❌ 'urls' is not a valid property on this plugin
      // ✅ Use 'dynamicRoutes' for a list of manual static paths
      dynamicRoutes: [
        "/",
        "/#about",
        "/#products",
        "/#services",
        "/#contact",
        "/shop",
        "/checkout",
        "/payment-success",
      ],
      changefreq: "weekly",
      priority: 0.8,
      // ❌ Removed 'lastmod' to prevent the previous TypeScript error.
      //    It should be configured on a per-route object if needed.
    }),
  ],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  css: {
    postcss: {
      plugins: [tailwindcss, autoprefixer],
    },
  },

  build: {
    target: "esnext",
    outDir: "dist",
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return "vendor";
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },

  base: "/",
});