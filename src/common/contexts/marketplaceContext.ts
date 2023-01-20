import React from "react";
import Extension from "@contentstack/app-sdk/dist/src/extension";
import { KeyValueObj } from "../types/types";

export type MarketplaceContextType = {
  appSdk: Extension | null;
  appConfig: KeyValueObj | null;
};

export const MarketplaceContext = React.createContext<MarketplaceContextType>({
  appSdk: null,
  appConfig: null,
});
