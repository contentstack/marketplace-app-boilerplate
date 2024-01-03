import React from "react";
import { KeyValueObj } from "../types/types";
import UiLocation from "@contentstack/app-sdk/dist/src/uiLocation";

export type MarketplaceAppContextType = {
  appSdk: UiLocation | null;
  appConfig: KeyValueObj | null;
};

export const MarketplaceAppContext =
  React.createContext<MarketplaceAppContextType>({
    appSdk: null,
    appConfig: null,
  });
