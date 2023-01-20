import { MarketplaceAppContext, MarketplaceAppContextType } from "../contexts/marketplaceContext";
import { useContext } from "react";

/**
 * Getter and setter hook for App config
 */
export const useAppConfig = () => {
  const { appConfig } = useContext(MarketplaceAppContext) as MarketplaceAppContextType;

  return appConfig;
};
