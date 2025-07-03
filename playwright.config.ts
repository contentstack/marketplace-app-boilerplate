import type { PlaywrightTestConfig } from "@playwright/test";
import { devices } from "@playwright/test";
import dotenv from "dotenv";

dotenv.config(); // Load variables from .env before using them

const config: PlaywrightTestConfig = {
  /**
   * Global setup & teardown of test data
   */
  globalSetup: require.resolve("./global-setup"),
  globalTeardown: require.resolve("./global-teardown"),

  testDir: "./e2e/tests",
  timeout: 30 * 10000,
  expect: {
    timeout: 5000,
  },

  // Fail build on test.only in CI
  forbidOnly: !!process.env.CI,

  // Retry on CI only
  retries: process.env.CI ? 1 : 0,

  // Run serially on CI
  workers: process.env.CI ? 1 : undefined,

  reporter: [["html", { open: "never" }]],

  use: {
    storageState: "storageState.json",
    actionTimeout: 0,
    screenshot: "off",
    video: "off",
    viewport: { width: 1920, height: 720 },
    trace: "on-first-retry",
    baseURL: process.env.ENV_URL || "http://localhost:3000",
  },

  projects: [
    {
      name: "Chromium",
      use: {
        browserName: "chromium",
      },
    },
    {
      name: "Safari",
      use: { ...devices["Desktop Safari"] },
    },
    {
      name: "Firefox",
      use: {
        browserName: "firefox",
      },
    },
  ],
};

export default config;
