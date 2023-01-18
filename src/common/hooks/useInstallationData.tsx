import React, { useContext, useCallback, useEffect, useState } from "react";
import { useAppLocation } from "./useAppLocation";
import { isEmpty } from "lodash";
import { atom, useAtom } from "jotai";

type InstallationData = {
  configuration: { [key: string]: any };
  serverConfiguration: { [key: string]: any };
};

// export const installationDataAtom = atom<InstallationData>({
//   configuration: {},
//   serverConfiguration: {},
// });

// /**
//  * Getter & Setter for installation data
//  */
// export const useInstallationData = (): [
//   InstallationData,
//   Function,
//   boolean
// ] => {
//   const [loading, setLoading] = useState<boolean>(false);
//   const { location } = useAppLocation();
//   const [installationData, setInstallation] = useAtom(installationDataAtom);

//   useEffect(() => {
//     if (!isEmpty(installationData)) return;
//     setLoading(true);
//     location.installation
//       .getInstallationData()
//       .then((data: InstallationData) => {
//         setInstallation(data);
//         setLoading(false);
//       })
//       .catch((err: Error) => {
//         console.error(err);
//       });
//   }, [installationData, location, setLoading, setInstallation]);

//   const setInstallationData = useCallback(
//     async (data: { [key: string]: any }) => {
//       setLoading(true);
//       const newInstallationData: InstallationData = {
//         configuration: { ...installationData.configuration, ...data },
//         serverConfiguration: installationData.serverConfiguration,
//       };
//       await location.installation.setInstallationData(newInstallationData);
//       setInstallation(newInstallationData);
//       setLoading(false);
//     },
//     [location, setInstallation, setLoading]
//   );

//   return [installationData, setInstallationData, loading];
// };

// Context

type InstallationDataContextType = {
  installationData: InstallationData;
  setInstallationData: (installationData: InstallationData) => void;
  loading: boolean;
};

const InstallationDataContext = React.createContext<InstallationDataContextType>({
  installationData: {
    configuration: {},
    serverConfiguration: {},
  },
  setInstallationData: () => {},
  loading: false,
});

export const InstallationDataProvider = ({ children }: any) => {
  const [installationData, setInstallation] = useState<InstallationData>({
    configuration: {},
    serverConfiguration: {},
  });
  const [loading, setLoading] = useState<boolean>(false);
  const { location } = useAppLocation();

  useEffect(() => {
    if (!isEmpty(installationData)) return;
    setLoading(true);
    location.installation
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

  return (
    <InstallationDataContext.Provider value={{ installationData, setInstallationData, loading }}>
      {children}
    </InstallationDataContext.Provider>
  );
};

export const useInstallationData = () => {
  return useContext(InstallationDataContext) as InstallationDataContextType;
};
