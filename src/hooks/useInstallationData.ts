import { useCallback, useEffect, useState } from "react";
import { useAppLocation } from "./useAppLocation";
import { isEmpty } from "lodash";
import { atom, useAtom } from "jotai";

type InstallationData = {
  configuration: { [key: string]: any };
  serverConfiguration: { [key: string]: any };
};

export const installationDataAtom = atom<InstallationData>({ configuration: {}, serverConfiguration: {} });

/**
 * Getter & Setter for installation data
 */
export const useInstallationData = (): [InstallationData, Function, boolean] => {
  const [loading, setLoading] = useState<boolean>(false);
  const { location } = useAppLocation();
  const [installationData, setInstallation] = useAtom(installationDataAtom);

  useEffect(() => {
    (async () => {
      if (!isEmpty(installationData)) return;
      setLoading(true);
      const data: InstallationData = await location.installation.getInstallationData();
      setInstallation(data);
      setLoading(false);
    })();
  }, [installationData, location, setLoading, setInstallation]);

  const setInstallationData = useCallback(
    async (data: { [key: string]: any }) => {
      setLoading(true);
      const newInstallationData: InstallationData = {
        configuration: { ...installationData.configuration, ...data },
        serverConfiguration: installationData.serverConfiguration,
      };
      await location.installation.setInstallationData(newInstallationData);
      setInstallation(newInstallationData);
      setLoading(false);
    },
    [location, setInstallation, setLoading]
  );

  return [installationData, setInstallationData, loading];
};
