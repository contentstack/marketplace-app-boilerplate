/// <reference types="vitest/config" />
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
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["src/setupTests.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
    coverage: {
      provider: "v8",
      include: ["src/**/*.{ts,tsx}"],
      exclude: ["src/**/*.test.{ts,tsx}", "src/**/*.d.ts", "src/test-utils/**", "src/setupTests.ts", "src/common/types/**"],
      // ratchet target 90 — MKT-22151: measured floor; raise as tests are added, never lower.
      // Re-measured on Vitest 4, which counts statements from the AST (same tests; v3 read 88/88/70/73).
      thresholds: { lines: 79, statements: 79, branches: 58, functions: 62 },
    },
  },
  esbuild: {
    logOverride: { "this-is-undefined-in-esm": "silent" },
  },
});
