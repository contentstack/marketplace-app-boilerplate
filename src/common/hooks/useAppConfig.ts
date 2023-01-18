import { useAtom } from "jotai";
import { appConfigAtom } from "../../store";
import { KeyValueObj } from "../types/types";

/**
 * Getter and setter hook for App config
 */
export const useAppConfig = (): [KeyValueObj, Function] => {
  return useAtom(appConfigAtom);
};
