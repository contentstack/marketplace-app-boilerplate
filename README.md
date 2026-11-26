# Contentstack Marketplace App Boilerplate

A React + TypeScript + Vite starter for Contentstack Marketplace apps, with one route per UI location.

## Quickstart

Every route is a UI location, and locations run only inside Contentstack: they get their entry, field, config and user through the App SDK.

1. **Node**: a current LTS release.
2. **Install and start**:

   ```bash
   npm ci
   npm run dev
   ```

   The dev server on `http://localhost:3000` prints where the app stands. Opening a route in its own tab shows what that
   location is and the next step; `http://localhost:3000/` lists every location in `manifest.json`.
3. **Register the app once**: `csdx app:create`, or in Developer Hub create an app (**+ New App**), set **Hosting** to
   **Custom Hosting** with `http://localhost:3000`, and copy its uid and organization uid into `manifest.json`.
4. **Install it and open it**: `npm run dev:stack -- --stack <stack_api_key>` (after `csdx auth:login`) pushes
   `manifest.json`, installs the app in that stack and prints where to open each location. `--dry-run` prints the
   commands only. Locations load from your dev server with hot reload.

If you mark a UI location **signed** in Developer Hub, set `signed: true` for its path in `manifest.json` too: the app
refuses a signed location opened without a valid app-token for this installation.

Inside Contentstack, a failure shows its own message and code: `APP_TOKEN_INVALID` (signed location not verified),
`HOST_NO_ANSWER` (the page around the app did not answer), `SDK_INIT_FAILED`. A deployed URL opened in its own tab
shows `NOT_IN_STACK`.

| Script | What it does |
|---|---|
| `npm run dev` | Dev server on port 3000 |
| `npm run dev:stack -- --stack <key>` | Push `manifest.json` and install the app in a stack (Contentstack CLI) |
| `npm run build` | Production build into `dist/` |
| `npm run build:check` | Type-check, then build |
| `npm run lint` / `npm run typecheck` | ESLint / TypeScript checks |
| `npm test` / `npm run test:coverage` | Unit tests (Vitest), with coverage |
| `npm run test:chrome` | Playwright e2e tests (see [Testing](#testing)) |

## Provider

`<MarketplaceAppProvider>`

This provider is responsible for the following actions

- Initialize the ContentStack SDK
- Make the SDK instance available via hooks to avoid props drilling
- Set global properties for Analytics and Error tracking
- Send "App Initialized / Failed" event

## Available Hooks

- useApi
- useAppConfig
- useAppLocation
- useAppSdk
- useCustomField
- useEntry
- useFrame
- useHostUrl
- useInstallationData
- useManagementClient
- useSdkDataByPath

### Hook Details

#### `useApi`
Context-aware API hook that provides structured access to Contentstack App SDK API with clear separation between Contentstack CMA operations and direct API access.

**Returns:**
- `callCmaApi(endpoint, options)` - Call Contentstack CMA API endpoints
- `callDirectApi(url, options)` - Direct API access for custom use cases
- `isApiReady` - Boolean indicating if the API is ready to use

**Example:**
```typescript
const { callCmaApi, callDirectApi, isApiReady } = useApi();

// Contentstack CMA operations
const response = await callCmaApi('/v3/content_types');
const contentTypes = await response.json();

// Direct API access
const response = await callDirectApi('/custom-endpoint');
const data = await response.json();
```

#### `useManagementClient`
Hook to get Contentstack Management SDK client instance. Returns the initialized management client for direct SDK operations.

**Returns:**
- `managementClient` - The initialized Management SDK client or null

**Example:**
```typescript
const managementClient = useManagementClient();
const appSdk = useAppSdk();

if (managementClient && appSdk) {
  const stack = await managementClient.stack({ api_key: appSdk.ids.apiKey });
  const entries = await stack.contentType('blog').entry().query().find();
}
```

## Routes

Each route represents one location. It is recommended to lazy load the route components to reduce the bundle
size.

#### Adding new route

- Create a new Route component inside route. Use default export
  - Inside `App.tsx`, lazy load the route component.
    - eg: `const CustomFieldExtension = React.lazy(() => import("./routes/CustomField"))`
  - Add the route wrapped inside `Suspense`.
    - Eg: ` <Route path="/new" element={<Suspense><CustomFieldExtension /></Suspense>} />`

## Testing

- All e2e test files are stored in e2e folder
- Create a `.env` file in the root directory & add environment variables as shown in `.env.sample` file.
- Please refer the below commands to run e2e tests locally and setup the perquisites before running them.
- `Note`: To run the below commands make sure the app is running in the background i.e on port `http://localhost:3000`

  ```
    "test:chrome": "npx playwright test --config=playwright.config.ts --project=Chromium",
    "test:firefox": "npx playwright test --config=playwright.config.ts --project=firefox",
    "test:chrome-headed": "npx playwright test --headed --config=playwright.config.ts --project=Chromium",
    "test:firefox-headed": "npx playwright test --headed --config=playwright.config.ts --project=firefox"
  ```

- Unit & integration tests are stored in `src/__tests__` folder
- run `npm run test` to run unit and integration tests

## Styling

- This setup uses basic CSS for styling

## Reference to documentation

- [Marketplace App Boilerplate](https://www.contentstack.com/docs/developers/developer-hub/marketplace-app-boilerplate/)
