/**
 * useAppSdk
 * @return the appSdk instance after initialization
 */
import { atom, useAtom } from "jotai";
import Extension from "@contentstack/app-sdk/dist/src/extension";

export const appSdkRefAtom = atom<Extension | null>(null);

/**
 * Getter and setter for appSdk instance.
 * To be used during Sdk initialisation
 */
export const useAppSdk = (): [Extension | null, Function] => {
  return useAtom(appSdkRefAtom);
};
