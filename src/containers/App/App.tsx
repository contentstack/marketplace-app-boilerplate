import React, { Suspense } from "react";
import { ErrorBoundary } from "../../components/ErrorBoundary";
import { MarketplaceAppProvider } from "../../common/providers/MarketplaceAppProvider";
import { Route, Routes } from "react-router-dom";
import { AppSdkProvider } from "../../common/hooks/useAppSdk";

/**
 * All the routes are Lazy loaded.
 * This will ensure the bundle contains only the core code and respective route bundle
 */
const CustomFieldExtension = React.lazy(() => import("../CustomField/CustomField"));
const EntrySidebarExtension = React.lazy(() => import("../SidebarWidget/EntrySidebar"));
const AppConfigurationExtension = React.lazy(() => import("../ConfigScreen/AppConfiguration"));
const AssetSidebarExtension = React.lazy(() => import("../AssetSidebarWidget/AssetSidebar"));
const StackDashboardExtension = React.lazy(() => import("../DashboardWidget/StackDashboard"));
const PageNotFound = React.lazy(() => import("../404/404"));
const DefaultPage = React.lazy(() => import("../index"));

function App() {
  return (
    <ErrorBoundary>
      <AppSdkProvider>
        <MarketplaceAppProvider>
          <Routes>
            <Route path="/" element={<DefaultPage />} />
            <Route
              path="/custom-field"
              element={
                <Suspense>
                  <CustomFieldExtension />
                </Suspense>
              }
            />
            <Route
              path="/entry-sidebar"
              element={
                <Suspense>
                  <EntrySidebarExtension />
                </Suspense>
              }
            />
            <Route
              path="/app-configuration"
              element={
                <Suspense>
                  <AppConfigurationExtension />
                </Suspense>
              }
            />
            <Route
              path="/asset-sidebar"
              element={
                <Suspense>
                  <AssetSidebarExtension />
                </Suspense>
              }
            />
            <Route
              path="/stack-dashboard"
              element={
                <Suspense>
                  <StackDashboardExtension />
                </Suspense>
              }
            />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </MarketplaceAppProvider>
      </AppSdkProvider>
    </ErrorBoundary>
  );
}

export default App;
