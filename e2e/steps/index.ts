import { Given, When, Then } from "@cucumber/cucumber";
import assert from "assert";
import { Marketplace } from "../types";

Given("User is logged into contentstack", async function (this: Marketplace) {});

Given("User navigates to edit entry page", async function (this: Marketplace) {
  await this.page.goto("/#!/stack/<api-key>/content-type/one/en-us/entry/<entry-uid>/edit", {
    waitUntil: "networkidle",
  });
});

Given("User edits the custom field", async function (this: Marketplace) {
  await this.page.locator(`#c-test`).click();
  await this.page.locator(`#c-test`).fill("This is new content");
});

Given("User saves the entry", async function (this: Marketplace) {});

Given("Open the sidebar widget", async function (this: Marketplace) {});

Then("See the value same as edited entry", async function (this: Marketplace) {
  const heading1Text = (await this.page.textContent("h1")) as string;
  assert.strictEqual(trimExcessWhiteSpace(heading1Text), "Accessibility statement");
});
// textContent includes whitespace, so use this method to trim
// See https://stackoverflow.com/a/42921059
const trimExcessWhiteSpace = (s: string) => s.replace(/[\n\r]+|[\s]{2,}/g, " ").trim();
