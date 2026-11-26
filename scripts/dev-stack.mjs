#!/usr/bin/env node
// Push manifest.json to Developer Hub, install the app in a stack, and print where to open each location.
// Uses the Contentstack CLI (csdx) and its login; no credentials live in this repo.
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const args = process.argv.slice(2);
const flag = (name) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : undefined;
};
const stack = flag("stack");
const dryRun = args.includes("--dry-run");

const fail = (message) => {
  console.error(`\n  ${message}\n`);
  process.exit(1);
};

// Windows installs csdx as a .cmd shim, which Node only runs through a shell; every argument is validated below.
const csdx = (cmd, options = {}) =>
  execFileSync("csdx", cmd, { encoding: "utf8", shell: process.platform === "win32", ...options });
const id = /^[a-z0-9]+$/i;

if (!stack || !/^blt[a-z0-9]+$/i.test(stack)) {
  fail("Usage: npm run dev:stack -- --stack <stack_api_key> [--dry-run]\n  The stack API key starts with blt (Stack settings > API Keys).");
}

const manifest = JSON.parse(readFileSync(new URL("../manifest.json", import.meta.url), "utf8"));
if (!id.test(manifest.uid ?? "") || !id.test(manifest.organization_uid ?? "")) {
  fail(
    "manifest.json has no app uid or organization_uid.\n" +
      "  Run `csdx app:create` (it registers the app and writes both), or create the app in Developer Hub\n" +
      "  and copy its uid and organization uid into manifest.json."
  );
}

let uiHost = "https://app.contentstack.com";
try {
  uiHost = csdx(["config:get:region"]).match(/UI host:\s*(\S+)/)?.[1] ?? uiHost;
} catch (error) {
  if (error.code === "ENOENT") fail("The Contentstack CLI is not installed: npm install -g @contentstack/cli");
}

if (!dryRun) {
  try {
    csdx(["auth:whoami"], { stdio: "pipe" });
  } catch {
    fail("Log in to the Contentstack CLI first: csdx auth:login");
  }
}

const run = (cmd) => {
  console.log(`$ csdx ${cmd.join(" ")}`);
  if (dryRun) return;
  try {
    csdx(cmd, { stdio: "inherit" });
  } catch {
    fail(`csdx ${cmd[0]} failed; its message is above. Fix that and run dev:stack again.`);
  }
};

console.log(`\nApp ${manifest.uid}, base URL ${manifest.ui_location.base_url}, stack ${stack}${dryRun ? " (dry run)" : ""}\n`);
// app:update writes Developer Hub's copy back into manifest.json (version, timestamps); commit what you want to keep.
run(["app:update", "--app-manifest", "manifest.json", "--org", manifest.organization_uid]);
// A second install is fine: the CLI reports the app is already installed and carries on.
run(["app:install", "--app-uid", manifest.uid, "--stack-api-key", stack, "--org", manifest.organization_uid]);

// Where to start for each location (routes checked in the Contentstack UI).
const stackUrl = `${uiHost}/#!/stack/${stack}`;
const start = {
  "cs.cm.stack.dashboard": `${stackUrl}/dashboard`,
  "cs.cm.stack.custom_field": `${stackUrl}/content-types`,
  "cs.cm.stack.field_modifier": `${stackUrl}/content-types`,
  "cs.cm.stack.content_type_sidebar": `${stackUrl}/content-types`,
  "cs.cm.stack.rte": `${stackUrl}/content-types`,
  "cs.cm.stack.sidebar": `${stackUrl}/entries`,
  "cs.cm.stack.asset_sidebar": `${stackUrl}/assets`,
  "cs.cm.stack.full_page": "in the stack's left navigation, under the app's name",
  "cs.cm.stack.config": "in Marketplace > Installed Apps > the app > Configuration",
};
console.log("\nOpen your locations (keep `npm run dev` running):\n");
for (const location of manifest.ui_location.locations) {
  for (const meta of location.meta) {
    console.log(`  ${meta.path.padEnd(24)} ${start[location.type] ?? stackUrl}`);
  }
}
console.log(`\nWhat each one is and where it appears: ${manifest.ui_location.base_url}/\n`);
