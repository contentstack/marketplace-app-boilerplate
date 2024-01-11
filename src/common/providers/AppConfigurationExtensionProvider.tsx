import React, { useCallback, useEffect, useState } from "react";

import { useAppLocation } from "../hooks/useAppLocation";
import {
  AppConfigurationExtensionContext,
  InstallationData,
} from "../contexts/appConfigurationExtensionContext";
import { ChildProp } from "../types/types";

export const AppConfigurationExtensionProvider = ({ children }: ChildProp) => {
  const [installationData, setInstallation] = useState<InstallationData>({
    configuration: {},
    serverConfiguration: {},
  });
  const [loading, setLoading] = useState<boolean>(true);
  const { location } = useAppLocation();

  useEffect(() => {
    if (location && !("installation" in location)) return;
    location?.installation
      .getInstallationData()
      .then((data: InstallationData) => {
        setInstallation(data);
        setLoading(false);
      })
      .catch((err: Error) => {
        console.error(err);
      });
  }, [installationData, location, setLoading, setInstallation]);

  const setInstallationData = useCallback(
    async (data: {
      configuration: { [key: string]: unknown };
      serverConfiguration: { [key: string]: unknown };
    }) => {
      const newInstallationData: InstallationData = {
        configuration: { ...installationData.configuration, ...data.configuration },
        serverConfiguration: { ...installationData.serverConfiguration, ...data.serverConfiguration },
      };
      if (location && !("installation" in location)) return;
      await location?.installation.setInstallationData(newInstallationData);
      setInstallation(newInstallationData);
      setLoading(false);
    },
    [location, setInstallation, setLoading]
  );

  return (
    <AppConfigurationExtensionContext.Provider
      value={{ installationData, setInstallationData, loading }}>
      {children}
    </AppConfigurationExtensionContext.Provider>
  );
};
