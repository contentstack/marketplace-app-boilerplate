# CLAUDE.md

Guide for coding agents and developers working on the **Contentstack Marketplace App Boilerplate**: a React + Vite front end that runs inside Contentstack UI locations through the App SDK.

**Built an app from this template?** This file describes the boilerplate; keep what fits your app and delete or adapt the rest (the review rules below are this repository's).

## Commands

| Task | Command |
|---|---|
| Install | `npm ci` |
| Dev server (port 3000) | `npm run dev` |
| Lint | `npm run lint` |
| Typecheck | `npm run typecheck` |
| Unit tests (Vitest) | `npm test` |
| Coverage (thresholds in `vite.config.ts`) | `npm run test:coverage` |
| Build | `npm run build` |
| E2E (Playwright, needs `.env` from `.env.sample` and the app running) | `npm run test:chrome` |

## Layout

- `src/containers/App/App.tsx`: one route per UI location. Every `path` in `manifest.json` (`ui_location.locations[].meta[].path`) must have a route here, and every route a manifest entry.
- `src/common/providers/`: `MarketplaceAppProvider` initialises the App SDK and verifies the `app-token` of signed locations; location providers load field, entry and installation data.
- `src/common/hooks/`: SDK access (`useAppSdk`, `useAppConfig`, `useInstallationData`, `useAppSdkApi`, `useManagementClient`, …). Use them instead of passing the SDK around.
- `e2e/`: Playwright suites and helpers. `manifest.json`: the app manifest for Developer Hub.

## Rules

- **Never log a whole error.** Axios and SDK errors carry request headers (`authtoken`, `api_key`), bodies and query strings. Log a summary: message, status, code, URL without query.
- **Never hand tokens or whole API responses to the UI.** Call APIs through `appSdk.api()` / `useAppSdkApi` (the host adds credentials); pass parsed data, not the response object.
- **Secrets stay server-side.** `serverConfiguration` goes to the app's backend via webhooks; `configuration` is readable by every location. Never put real values in `.env.sample` or commit `.env`, `data.json` or `storageState.json`.
- Signed locations: keep the app-token check; do not render the app on an unverified token.
- Keep the manifest and the routes in step (see Layout).

## Review rules

These are this repository's rules (GitHub ruleset "Default branch protection rules for releases branch", active on the default branch: `gh api repos/contentstack/marketplace-app-boilerplate/rulesets`).

- Work on a branch and open a pull request to `main`; never push to `main`.
- `main` needs one approving review from a code owner (`CODEOWNERS`), with the last push approved, stale approvals dismissed and every review thread resolved.
- Required checks: GitGuardian, Snyk (security, code, licence), `security-sca`, `security-policy`, `security-license`. All green before merge.
- Never bypass a hook (`--no-verify`) or weaken a check to get green.

## Definition of Done

- CI is green: lint, typecheck and `npm run test:coverage` pass; `npm run build` succeeds.
- Changed behaviour has a unit test written from the spec (manifest, docs), not from the code's output; the e2e suite still passes where it applies.
- No secrets or whole error objects in code, logs or fixtures; Snyk shows no new High/Critical issue.
- `manifest.json`, routes and README describe the same locations.
- The pull request says what changed and why, and links its ticket.

## Changing the template itself

Every change here is copied into each new app: keep it minimal and working, and say in the pull request why it makes sense for an app built from the template.
