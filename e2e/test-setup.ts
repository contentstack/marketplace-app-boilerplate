import { Before, BeforeAll, AfterAll, After } from "@cucumber/cucumber";
import { chromium, Browser } from "playwright";
import { LoginPage } from "./pages/login";
import { Marketplace } from "./types";
import { setDefaultTimeout } from "@cucumber/cucumber";

const userUid = process.env.USER_UID;
const orgUid = process.env.ORG_UID;

setDefaultTimeout(60 * 1000);

let browser: Browser;

BeforeAll(async function () {
  // Browsers are expensive in Playwright so only create 1
  browser = await chromium.launch({
    // Not headless so we can watch test runs
    headless: false,
    // Slow so we can see things happening
    slowMo: 50,
  });
});

AfterAll(async function () {
  await browser.close();
});

// Create a new test context and page per scenario
Before(async function (this: Marketplace) {
  this.baseURL = process.env.URL || "https://app.contentstack.com/";
  this.context = await browser.newContext({
    baseURL: this.baseURL,
    httpCredentials: {
      username: process.env.BASIC_AUTH_USERNAME || "",
      password: process.env.BASIC_AUTH_PASSWORD || "",
    },
    storageState: {
      cookies: [
        {
          domain: new URL(this.baseURL).hostname,
          path: "/",
          value: "true",
          name: "venus-beta",
          expires: -1,
          httpOnly: true,
          secure: true,
          sameSite: "Strict",
        },
      ],
      origins: [
        {
          origin: this.baseURL,
          localStorage: [{ name: "organization", value: `{"${userUid}":"${orgUid}"}` }],
        },
      ],
    },
  });

  this.page = await this.context.newPage();
  const loginPage = new LoginPage(this.page);
  await loginPage.login("example@contentstack.com", "#");
});

// Cleanup after each scenario
After(async function (this: Marketplace) {
  await this.page.close();
  await this.context.close();
});
