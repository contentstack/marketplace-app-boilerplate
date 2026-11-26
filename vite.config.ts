/// <reference types="vitest/config" />
import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { readFileSync } from "fs";
import { buildJourney } from "./src/common/utils/journey";

// Prints where the app stands on its way into Contentstack under the dev server URLs (same steps as the page).
const insideContentstackHint = (): Plugin => ({
  name: "inside-contentstack-hint",
  configureServer(server) {
    const printUrls = server.printUrls;
    server.printUrls = () => {
      printUrls();
      const origin = (server.resolvedUrls?.local[0] ?? "http://localhost:3000/").replace(/\/$/, "");
      const manifest = JSON.parse(readFileSync(path.resolve(__dirname, "manifest.json"), "utf8"));
      const mark = { done: "✔", next: "→", todo: "·", optional: "·", later: "·" };
      const lines = buildJourney(manifest, origin).map(
        (step) => `    ${mark[step.status]} ${step.title}${step.status === "next" && step.command ? `   ${step.command}` : ""}`
      );
      server.config.logger.info(
        "\n  This app runs inside Contentstack, not in its own browser tab. Where it stands:\n" +
          lines.join("\n") +
          "\n  Open the Local URL for the details of each step.\n"
      );
    };
  },
});

export default defineConfig({
  plugins: [react(), insideContentstackHint()],
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
