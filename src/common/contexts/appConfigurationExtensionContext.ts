import React from "react";

export type InstallationData = {
  configuration: { [key: string]: unknown };
  serverConfiguration: { [key: string]: unknown };
};

export type AppConfigurationExtensionContextType = {
  installationData: InstallationData;
  setInstallationData: (installationData: InstallationData) => void;
  loading: boolean;
};

export const AppConfigurationExtensionContext =
  React.createContext<AppConfigurationExtensionContextType>({
    installationData: {
      configuration: {},
      serverConfiguration: {},
    },
    setInstallationData: () => ({}),
    loading: false,
  });
