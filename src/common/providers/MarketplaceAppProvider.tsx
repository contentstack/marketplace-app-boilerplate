import React, { useEffect, useState } from "react";
import ContentstackAppSDK from "@contentstack/app-sdk";
import Extension from "@contentstack/app-sdk/dist/src/extension";
import { KeyValueObj } from "../types/types";
import { isNull } from "lodash";
import { AppFailed } from "../../components/AppFailed";
import { MarketplaceAppContext } from "../contexts/marketplaceContext";

type ProviderProps = {
  children?: React.ReactNode;
};

/**
 * Marketplace App Provider
 * @param children: React.ReactNode
 */
export const MarketplaceAppProvider: React.FC<ProviderProps> = ({ children }) => {
  const [failed, setFailed] = useState<boolean>(false);
  const [appSdk, setAppSdk] = useState<Extension | null>(null);
  const [appConfig, setConfig] = useState<KeyValueObj | null>(null);

  // Initialize the SDK and track analytics event
  useEffect(() => {
    ContentstackAppSDK.init()
      .then(async (appSdk) => {
        setAppSdk(appSdk);
        //updated Height of the Custom Field Iframe.
        appSdk.location.CustomField?.frame?.updateHeight?.(450);
        //updated Height and Width of the Field Modifier Iframe.
        appSdk.location.FieldModifierLocation?.frame?.updateDimension({ height: 380, width: 520 });
        // //updated Height of the Stack Dashboard Iframe.
        appSdk.location.DashboardWidget?.frame?.updateHeight?.(722);
        appSdk.location.DashboardWidget?.frame?.enableAutoResizing();
        const appConfig = await appSdk.getConfig();
        setConfig(appConfig);
      })
      .catch(() => {
        setFailed(true);
      });
  }, []);

  // wait until the SDK is initialized. This will ensure the values are set
  // correctly for appSdk.
  if (!failed && isNull(appSdk)) {
    return <div>Loading...</div>;
  }

  if (failed) {
    return <AppFailed />;
  }

  return <MarketplaceAppContext.Provider value={{ appSdk, appConfig }}>{children}</MarketplaceAppContext.Provider>;
};
