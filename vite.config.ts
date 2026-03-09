// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve("./src"),
    },
  },
  server: {
    allowedHosts: [
      // allow your ngrok domain (specific)
      "factorable-expiratory-abbigail.ngrok-free.dev",

      // or allow all ngrok domains if you don’t want to update every time (all)
      ".ngrok-free.dev",

      // allow cloudflared tunnel (all)
      ".trycloudflare.com",

      "https://isa-writers-hosted-ball.trycloudflare.com"
    ],
  },
});
