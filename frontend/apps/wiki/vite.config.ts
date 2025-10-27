import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  publicDir: path.resolve(__dirname, "../../public"),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@omnieconomy/shared-styles": path.resolve(
        __dirname,
        "../../packages/shared-styles/src"
      ),
      "@omnieconomy/shared-config": path.resolve(
        __dirname,
        "../../packages/shared-config/src"
      ),
      "@omnieconomy/shared-components": path.resolve(
        __dirname,
        "../../packages/shared-components/src"
      ),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5002",
        changeOrigin: true,
      },
      "/socket.io": {
        target: "http://localhost:5002",
        ws: true,
      },
    },
  },
});
