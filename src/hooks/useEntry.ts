import { useCallback, useEffect, useState } from "react";
import { useAppLocation } from "./useAppLocation";
import { isEmpty, isNull } from "lodash";
import { atom, useAtom } from "jotai";

export const entryAtom = atom<{ [key: string]: any }>({});

/**
 * Getter and setter hook for entry data
 * @return Array of [entryData, setEntryDataFn, loadingState]
 *
 * Eg:
 * const [data, setData, loading] = useEntry();
 */
export const useEntry = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { location, locationName } = useAppLocation();
  const [entryData, setEntry] = useAtom(entryAtom);

  if (locationName !== "SidebarWidget") {
    throw new Error(`useEntry hook cannot be used inside ${locationName}`);
  }

  useEffect(() => {
    (async () => {
      if (!isEmpty(entryData) || isNull(location)) return;
      setLoading(true);
      const entry: { [key: string]: any } = await location.entry.getData();
      setEntry(entry);
      setLoading(false);
    })();
  }, [entryData, location, setLoading, setEntry]);

  const setEntryData = useCallback(
    async (entry: any) => {
      setLoading(true);
      await location.entry.setData(entry);
      setEntry(entry);
      setLoading(false);
    },
    [location, setEntry, setLoading]
  );

  return [entryData, setEntryData, loading];
};
