import React, { useEffect, useState } from "react";
import ContentstackAppSDK from "@contentstack/app-sdk";
import UiLocation from "@contentstack/app-sdk/dist/src/uiLocation";
import { isNull } from "lodash";

import { KeyValueObj } from "../types/types";
import { AppFailed } from "../../components/AppFailed";
import { MarketplaceAppContext } from "../contexts/marketplaceContext";
import { useVerifyAppToken } from "../hooks/useVerifyAppToken";
import { getTokenFromUrl, isSignedLocation } from "../utils/functions";

type ProviderProps = {
  children?: React.ReactNode;
};

/**
 * Marketplace App Provider
 * @param children: React.ReactNode
 */
export const MarketplaceAppProvider: React.FC<ProviderProps> = ({ children }) => {
  const [failed, setFailed] = useState<boolean>(false);
  const [appSdk, setAppSdk] = useState<UiLocation | null>(null);
  const [appConfig, setConfig] = useState<KeyValueObj | null>(null);
  const token = getTokenFromUrl();
  // A signed location without a token is never verified, so it must not run.
  const missingToken = !token && isSignedLocation(window.location.pathname);
  const { isValidAppToken } = useVerifyAppToken(token);

  // Initialize the SDK and track analytics event
  useEffect(() => {
    ContentstackAppSDK.init()
      .then(async (appSdk) => {
        setAppSdk(appSdk);
        //updated Height of the Custom Field Iframe.
        appSdk.location.DashboardWidget?.frame?.disableAutoResizing();
        await appSdk.location.CustomField?.frame?.updateHeight?.(450);
        //updated Height and Width of the Field Modifier Iframe.
        appSdk.location.FieldModifierLocation?.frame?.disableAutoResizing();
        await appSdk.location.FieldModifierLocation?.frame?.updateDimension({ height: 380, width: 520 });
        // //updated Height of the Stack Dashboard Iframe.
        appSdk.location.DashboardWidget?.frame?.disableAutoResizing();
        await appSdk.location.DashboardWidget?.frame?.updateHeight?.(722);
        const appConfig = await appSdk.getConfig();

        setConfig(appConfig);
      })
      .catch(() => {
        setFailed(true);
      });
  }, []);

  // Token validation failed, or a signed location came without a token
  if (isValidAppToken === false || failed || missingToken) {
    return <AppFailed />;
  }

  // wait until the SDK is initialized and, for a signed location, the app-token is verified.
  if (isNull(appSdk) || (token && isValidAppToken === null)) {
    return <div>Loading...</div>;
  }

  return <MarketplaceAppContext.Provider value={{ appSdk, appConfig }}>{children}</MarketplaceAppContext.Provider>;
};
