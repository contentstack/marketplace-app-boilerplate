import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  build: {
    outDir: "dist",
    rollupOptions: {
      output: {
        // Vendor code in its own long-cached chunks keeps every chunk under Vite's 500 kB warning.
        manualChunks: {
          react: ["react", "react-dom", "react-router-dom"],
          "contentstack-app-sdk": ["@contentstack/app-sdk"],
        },
      },
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  optimizeDeps: {
    esbuildOptions: {
      target: "es2020",
    },
  },
  esbuild: {
    logOverride: { "this-is-undefined-in-esm": "silent" },
  },
});
