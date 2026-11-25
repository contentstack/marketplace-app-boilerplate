import { useCallback, useEffect, useRef, useState } from "react";

import { useAppLocation } from "../hooks/useAppLocation";
import {
  AppConfigurationExtensionContext,
  InstallationData,
} from "../contexts/appConfigurationExtensionContext";
import { ChildProp } from "../types/types";
import { safeError } from "../utils/safeError";

export const AppConfigurationExtensionProvider = ({ children }: ChildProp) => {
  const [installationData, setInstallation] = useState<InstallationData>({
    configuration: {},
    serverConfiguration: {},
  });
  const [loading, setLoading] = useState<boolean>(true);
  const { location } = useAppLocation();
  // Latest data, also across saves made before a re-render, so no save overwrites another.
  const latestRef = useRef(installationData);

  useEffect(() => {
    if (location && !("installation" in location)) return;
    location?.installation
      .getInstallationData()
      .then((data: InstallationData) => {
        latestRef.current = data;
        setInstallation(data);
        setLoading(false);
      })
      .catch((err: unknown) => {
        console.error(safeError(err));
      });
  }, [location]);

  const setInstallationData = useCallback(
    async (data: {
      configuration: { [key: string]: unknown };
      serverConfiguration: { [key: string]: unknown };
    }) => {
      if (location && !("installation" in location)) return;
      const newInstallationData: InstallationData = {
        configuration: { ...latestRef.current.configuration, ...data.configuration },
        serverConfiguration: { ...latestRef.current.serverConfiguration, ...data.serverConfiguration },
      };
      const previous = latestRef.current;
      latestRef.current = newInstallationData;
      try {
        await location?.installation.setInstallationData(newInstallationData);
      } catch (err) {
        // A rejected save must not leak into the next one.
        if (latestRef.current === newInstallationData) latestRef.current = previous;
        throw err;
      }
      setInstallation(latestRef.current);
      setLoading(false);
    },
    [location]
  );

  return (
    <AppConfigurationExtensionContext.Provider
      value={{ installationData, setInstallationData, loading }}>
      {children}
    </AppConfigurationExtensionContext.Provider>
  );
};
