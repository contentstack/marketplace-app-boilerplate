/**
 * useAppSdk
 * @return the appSdk instance after initialization
 */
import { MarketplaceContext, MarketplaceContextType } from "../contexts/marketplaceContext";
import { useContext } from "react";

/**
 * Getter and setter for appSdk instance.
 * To be used during Sdk initialisation
 */
export const useAppSdk = () => {
  const { appSdk } = useContext(MarketplaceContext) as MarketplaceContextType;
  return appSdk;
};
