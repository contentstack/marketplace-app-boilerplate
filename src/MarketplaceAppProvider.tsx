import React, { useEffect, useState } from "react";
import ContentstackAppSDK from "@contentstack/app-sdk";
import Extension from "@contentstack/app-sdk/dist/src/extension";
import { KeyValueObj } from "./types";
import { isNull } from "lodash";
import { useAppSdk } from "./hooks/useAppSdk";
import { useAppConfig } from "./hooks/useAppConfig";
import { AppFailed } from "./components/AppFailed";

const MARKETPLACE_APP_NAME: string = process.env
  .REACT_APP_MARKETPLACE_APP_NAME as string;

type ProviderProps = {
  children?: React.ReactNode;
};

/**
 * Marketplace App Provider
 * @param children: React.ReactNode
 */
export const MarketplaceAppProvider: React.FC<ProviderProps> = ({ children }) => {
  const [failed, setFailed] = useState<boolean>(false);
  const [appSdk, setAppSdk] = useAppSdk();
  const [, setConfig] = useAppConfig();

  // Initialize the SDK and track analytics event
  useEffect(() => {
    ContentstackAppSDK.init()
      .then(async (appSdk: Extension) => {
        setAppSdk(appSdk);
        const appConfig: KeyValueObj = await appSdk.getConfig();
        setConfig(appConfig);
      })
      .catch(() => {
        setFailed(true);
      });
  }, []);

  // wait until the SDK is initialized. This will ensure the values are set
  // correctly for appSdk atom.
  if (!failed && isNull(appSdk)) {
    return <div>Loading...</div>;
  }

  if (failed) {
    return <AppFailed />;
  }

  return <>{children}</>;
};
