import { MarketplaceContext, MarketplaceContextType } from "../contexts/marketplaceContext";
import { useContext } from "react";

/**
 * Getter and setter hook for App config
 */
export const useAppConfig = () => {
  const { appConfig } = useContext(MarketplaceContext) as MarketplaceContextType;

  return appConfig;
};
