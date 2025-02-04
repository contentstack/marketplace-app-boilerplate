import React, { useEffect, useState } from "react";
import { isEmpty, isNull } from "lodash";

import { useAppLocation } from "../hooks/useAppLocation";
import { EntrySidebarExtensionContext } from "../contexts/entrySidebarExtensionContext";
import { ChildProp } from "../types/types";

export const EntrySidebarExtensionProvider = ({ children }: ChildProp) => {
  const [entryData, setEntry] = useState({});
  const [loading, setLoading] = useState<boolean>(false);
  const { location } = useAppLocation();

  useEffect(() => {
    (async () => {
      if (!isEmpty(entryData) || isNull(location)) return;
      setLoading(true);
      if ('entry' in location) {
        const entry: { [key: string]: unknown } | undefined = location?.entry?.getData();
        if (entry) {
          setEntry(entry);
        }
      }
      setLoading(false);
    })();
  }, [entryData, location, setLoading, setEntry]);

  return (
    <EntrySidebarExtensionContext.Provider value={{ entryData, loading }}>
      {children}
    </EntrySidebarExtensionContext.Provider>
  );
};
