/**
 * useAppSdk
 * @return the appSdk instance after initialization
 */
import { atom, useAtom } from "jotai";
import Extension from "@contentstack/app-sdk/dist/src/extension";

// export const appSdkRefAtom = atom<Extension | null>(null);

// /**
//  * Getter and setter for appSdk instance.
//  * To be used during Sdk initialisation
//  */
// export const useAppSdk = (): [Extension | null, Function] => {
//   return useAtom(appSdkRefAtom);
// };

import React, { useContext, useState } from "react";
import { KeyValueObj } from "../types/types";

type AppSdkContextType = {
  appSdk: Extension | null;
  updateAppSdk: (appSdk: Extension | null) => void;
  appConfig: KeyValueObj;
  updateAppConfig: (appConfig: KeyValueObj) => void;
};

const AppSdkContext = React.createContext<AppSdkContextType>({
  appSdk: null,
  updateAppSdk: () => {},
  appConfig: {},
  updateAppConfig: () => {},
});

export const AppSdkProvider = ({ children }: any) => {
  const [appSdk, setAppSdk] = useState(null);
  const [appConfig, setAppConfig] = useState({});

  const updateAppSdk = (appSdk: any) => {
    setAppSdk(appSdk);
    console.log("ooooo", appSdk);
  };

  const updateAppConfig = (appConfig: any) => {
    setAppConfig(appConfig);
    console.log("appConfig", appConfig);
  };

  return (
    <AppSdkContext.Provider value={{ appSdk, updateAppSdk, appConfig, updateAppConfig }}>
      {children}
    </AppSdkContext.Provider>
  );
};

export const useAppSdk = () => {
  return useContext(AppSdkContext) as AppSdkContextType;
};
