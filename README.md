# Contentstack Marketplace App Boilerplate

## Provider

`<MarketplaceAppProvider>`

This provider is responsible for the following actions

- Initialize the contentstack SDK
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
const { apiKey } = useAppIds();

if (managementClient && apiKey) {
  const stack = await managementClient.stack({ api_key: apiKey });
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
