import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// Says where the app runs right under the dev server URLs, so nobody expects it to work in its own tab.
const insideContentstackHint = (): Plugin => ({
  name: "inside-contentstack-hint",
  configureServer(server) {
    const printUrls = server.printUrls;
    server.printUrls = () => {
      printUrls();
      server.config.logger.info(
        "\n  This app runs inside Contentstack, not in its own browser tab." +
          "\n  Open the Local URL for each location and how to see it in a stack." +
          "\n  Test in a stack: npm run dev:stack -- --stack <stack_api_key>\n"
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
