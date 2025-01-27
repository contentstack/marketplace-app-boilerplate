import React, { Suspense } from "react";
import { ErrorBoundary } from "../../components/ErrorBoundary";
import { MarketplaceAppProvider } from "../../common/providers/MarketplaceAppProvider";
import { Route, Routes } from "react-router-dom";
import { EntrySidebarExtensionProvider } from "../../common/providers/EntrySidebarExtensionProvider";
import { AppConfigurationExtensionProvider } from "../../common/providers/AppConfigurationExtensionProvider";
import { CustomFieldExtensionProvider } from "../../common/providers/CustomFieldExtensionProvider";
import FieldModifierExtension from "../FieldModifier/FieldModifier";

/**
 * All the routes are Lazy loaded.
 * This will ensure the bundle contains only the core code and respective route bundle
 * improving the page load time
 */
const CustomFieldExtension = React.lazy(() => import("../CustomField/CustomField"));
const EntrySidebarExtension = React.lazy(() => import("../SidebarWidget/EntrySidebar"));
const AppConfigurationExtension = React.lazy(() => import("../AppConfiguration/AppConfiguration"));
const AssetSidebarExtension = React.lazy(() => import("../AssetSidebarWidget/AssetSidebar"));
const StackDashboardExtension = React.lazy(() => import("../DashboardWidget/StackDashboard"));
const FullPageExtension = React.lazy(() => import("../FullPage/FullPage"));
const PageNotFound = React.lazy(() => import("../404/404"));
const DefaultPage = React.lazy(() => import("../index"));

function App() {
  // Log the current route
  console.log("APP RENDER", window.location.pathname);
  return (
    <ErrorBoundary>
      <MarketplaceAppProvider>
        <Routes>
          <Route
            path="/"
            element={
              <Suspense>
                <CustomFieldExtensionProvider>
                  <CustomFieldExtension />
                </CustomFieldExtensionProvider>
              </Suspense>
            }
          />
          <Route
            path="/custom-field"
            element={
              <>
                HELLO WORLD
                {/* <Suspense>
                  <CustomFieldExtensionProvider>
                    <CustomFieldExtension />
                  </CustomFieldExtensionProvider>
                </Suspense> */}
              </>
            }
          />
          <Route
            path="/entry-sidebar"
            element={
              <Suspense>
                <EntrySidebarExtensionProvider>
                  <EntrySidebarExtension />
                </EntrySidebarExtensionProvider>
              </Suspense>
            }
          />
          <Route
            path="/app-configuration"
            element={
              <Suspense>
                <AppConfigurationExtensionProvider>
                  <AppConfigurationExtension />
                </AppConfigurationExtensionProvider>
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
          <Route
            path="/full-page"
            element={
              <Suspense>
                <FullPageExtension />
              </Suspense>
            }
          />
          <Route
            path="/field-modifier"
            element={
              <Suspense>
                <FieldModifierExtension />
              </Suspense>
            }
          />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </MarketplaceAppProvider>
    </ErrorBoundary>
  );
}

export default App;
