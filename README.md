# ContentStack Marketplace App Boilerplate

## Provider

`<MarketplaceAppProvider>`

This provider is responsible for the following actions

- Initialise the contentstack SDK
- Make the SDK instance available via hooks to avoid props drilling
- Set global properties for Analytics and Error tracking
- Send "App Initialised / Failed" event

## Hooks

- useAnalytics
- useAppConfig
- useAppLocation
- useAppSdk
- useCustomField
- useEntry
- useFrame
- useHostUrl
- useInstallationData
- useJSErrorTracking
- useSdkDataByPath
- ...*more to be added as needed*

## Routes

Each route represents one location. It is recommended to lazy load the route components to reduce the bundle
size. 

#### Adding new route

- Create a new Route component inside route. Use default export
  - Inside `App.tsx`, lazy load the route component.  
    - eg: `const CustomFieldExtension = React.lazy(() => import("./routes/CustomField"))`
  - Add the route wrapped inside `Suspense`. 
    - Eg: ``` <Route path="/new" element={<Suspense><CustomFieldExtension /></Suspense>} />```

## Testing

- All e2e test files are stored in e2e folder
- run `npm run test:e2e` to run e2e tests
- Unit & integration tests are stored in `src/__tests__` folder
- run `npm run test` to run unit and integration tests


## Styling

- This setup uses `Tailwind CSS` for styling
- Instead of writing CSS, it allows styling by adding classes in HTML
- Use `(text|border|bg|*)-primary` to use the primary color for respective property
