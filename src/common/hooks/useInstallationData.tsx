import { useContext } from "react";
import {
  AppConfigurationExtensionContext,
  AppConfigurationExtensionContextType,
} from "../contexts/appConfigurationExtensionContext";

/**
 * Getter & Setter for installation data
 */
export const useInstallationData = () => {
  const { installationData, loading } = useContext(
    AppConfigurationExtensionContext
  ) as AppConfigurationExtensionContextType;
  return { installationData, loading };
};
