import { defineConfig } from "eslint/config";
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import react from "@eslint-react/eslint-plugin";
import globals from "globals";

export default defineConfig(
  { ignores: ["node_modules/", "dist/", "coverage/", "playwright-report/", "test-results/", "src/test-utils"] },
  js.configs.recommended,
  tseslint.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    ...react.configs["recommended-typescript"],
    rules: {
      ...react.configs["recommended-typescript"].rules,
      // Setter names are the template's choice; keep the rest of the rule.
      "@eslint-react/use-state": ["warn", { enforceSetterName: false }],
    },
  },
  {
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
    rules: { "@typescript-eslint/no-explicit-any": "error" },
  }
);
