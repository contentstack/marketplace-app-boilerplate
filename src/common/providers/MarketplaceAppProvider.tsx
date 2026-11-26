import React, { useEffect, useState } from "react";
import ContentstackAppSDK from "@contentstack/app-sdk";
import UiLocation from "@contentstack/app-sdk/dist/src/uiLocation";
import isNull from "lodash/isNull";

import { KeyValueObj } from "../types/types";
import { AppFailed } from "../../components/AppFailed";
import { NotInStack } from "../../components/NotInStack";
import { MarketplaceAppContext } from "../contexts/marketplaceContext";
import { tokenMatchesSdk, useVerifyAppToken } from "../hooks/useVerifyAppToken";
import { getTokenFromUrl, isSignedLocation } from "../utils/functions";
import { FailureReason, isOutsideContentstack, reasonFromInitError } from "../utils/host";

type ProviderProps = {
  children?: React.ReactNode;
};

/**
 * Marketplace App Provider
 * @param children: React.ReactNode
 */
export const MarketplaceAppProvider: React.FC<ProviderProps> = ({ children }) => {
  const [failure, setFailure] = useState<FailureReason | null>(null);
  // Opened in its own tab: the SDK cannot start, so skip it and explain instead.
  const outside = isOutsideContentstack();
  const [appSdk, setAppSdk] = useState<UiLocation | null>(null);
  const [appConfig, setConfig] = useState<KeyValueObj | null>(null);
  const token = getTokenFromUrl();
  // A signed location without a token is never verified, so it must not run.
  const missingToken = !token && isSignedLocation(window.location.pathname);
  const { isValidAppToken, claims } = useVerifyAppToken(token);

  // Initialize the SDK and track analytics event
  useEffect(() => {
    if (outside) return;
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
      .catch((error) => {
        // Message only: SDK errors can carry request headers and tokens.
        console.error("App SDK failed to start:", error instanceof Error ? error.message : String(error));
        setFailure(reasonFromInitError(error));
      });
  }, [outside]);

  if (outside) return <NotInStack />;

  // A token minted for another app or installation is as bad as a forged one.
  const foreignToken = Boolean(appSdk && claims && !tokenMatchesSdk(claims, appSdk.ids));

  // Token rejected or foreign, or a signed location came without one.
  if (isValidAppToken === false || missingToken || foreignToken) return <AppFailed reason="app-token" />;
  if (failure) return <AppFailed reason={failure} />;

  // Wait until the SDK is initialized and, when there is a token, until it is verified.
  if (isNull(appSdk) || (token && isValidAppToken === null)) {
    return <div>Loading...</div>;
  }

  return <MarketplaceAppContext.Provider value={{ appSdk, appConfig }}>{children}</MarketplaceAppContext.Provider>;
};
