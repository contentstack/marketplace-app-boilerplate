import React, { useContext, useCallback, useEffect, useState } from "react";
import { useAppLocation } from "./useAppLocation";
import { isEmpty, isNull } from "lodash";
// import { atom, useAtom } from "jotai";

// export const entryAtom = atom<{ [key: string]: any }>({});

/**
 * Getter and setter hook for entry data
 * @return Array of [entryData, setEntryDataFn, loadingState]
 *
 * Eg:
 * const [data, setData, loading] = useEntry();
 */
// export const useEntry = () => {
//   const [loading, setLoading] = useState<boolean>(false);
//   const { location, locationName } = useAppLocation();
//   const [entryData, setEntry] = useAtom(entryAtom);

//   if (locationName !== "SidebarWidget") {
//     throw new Error(`useEntry hook cannot be used inside ${locationName}`);
//   }

//   useEffect(() => {
//     (async () => {
//       if (!isEmpty(entryData) || isNull(location)) return;
//       setLoading(true);
//       const entry: { [key: string]: any } = await location.entry.getData();
//       setEntry(entry);
//       setLoading(false);
//     })();
//   }, [entryData, location, setLoading, setEntry]);

//   const setEntryData = useCallback(
//     async (entry: any) => {
//       setLoading(true);
//       await location.entry.setData(entry);
//       setEntry(entry);
//       setLoading(false);
//     },
//     [location, setEntry, setLoading]
//   );

//   return [entryData, setEntryData, loading];
// };

// Context

type EntryContextType = {
  entryData: { [key: string]: any };
  setEntryData: (entry: { [key: string]: any }) => void;
  loading: boolean;
};

const EntryContext = React.createContext<EntryContextType>({
  entryData: {},
  setEntryData: () => {},
  loading: false,
});

export const EntryProvider = ({ children }: any) => {
  const [entryData, setEntry] = useState<{ [key: string]: any }>({});
  const [loading, setLoading] = useState<boolean>(false);
  const { location, locationName } = useAppLocation();

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

  return <EntryContext.Provider value={{ entryData, setEntryData, loading }}>{children}</EntryContext.Provider>;
};

export const useEntry = () => {
  return useContext(EntryContext) as EntryContextType;
};
