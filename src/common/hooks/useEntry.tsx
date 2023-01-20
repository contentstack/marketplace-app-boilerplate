import {
  EntrySidebarExtensionContext,
  EntrySidebarExtensionContextType,
} from "../contexts/entrySidebarExtensionContext";
import { useContext } from "react";

/**
 * Getter and setter hook for entry data
 * @return Array of [entryData, setEntryDataFn, loadingState]
 *
 * Eg:
 * const [data, setData, loading] = useEntry();
 */
export const useEntry = () => {
  const { entryData, loading } = useContext(EntrySidebarExtensionContext) as EntrySidebarExtensionContextType;

  return { entryData, loading };
};
