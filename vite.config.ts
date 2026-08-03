import { fileURLToPath, URL } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  base: "/cantos_totonaco_iecees/",
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "prompt",
      includeAssets: ["favicon-192.png", "apple-touch-icon.png"],
      manifest: {
        name: "Cristo Es El Señor",
        short_name: "Cristo Es El Señor",
        description: "Himnario evangélico disponible sin conexión",
        theme_color: "#0b2447",
        background_color: "#f8f7f2",
        display: "standalone",
        orientation: "any",
        start_url: "/cantos_totonaco_iecees/",
        scope: "/cantos_totonaco_iecees/",
        lang: "es",
        icons: [
          { src: "pwa-192x192.png", sizes: "192x192", type: "image/png" },
          { src: "pwa-512x512.png", sizes: "512x512", type: "image/png" },
          { src: "pwa-maskable-512x512.png", sizes: "512x512", type: "image/png", purpose: "maskable" }
        ]
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,json,woff2}"],
        maximumFileSizeToCacheInBytes: 8 * 1024 * 1024
      },
      devOptions: { enabled: true }
    })
  ],
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("cantos_espanol.json")) return "cantos-espanol";
          if (id.includes("cantos_totonaku.json")) return "cantos-totonaku";
          if (id.includes("RVR1960_vid_149.json")) return "biblia-rvr1960";
          if (id.includes("RVA2015_vid_1782.json")) return "biblia-rva2015";
        }
      }
    }
  }
});
