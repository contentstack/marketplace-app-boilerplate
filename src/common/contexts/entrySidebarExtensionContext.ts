import React from "react";

export type EntrySidebarExtensionContextType = {
  entryData: { [key: string]: any };
  setEntryData: (entry: { [key: string]: any }) => void;
  loading: boolean;
};

export const EntrySidebarExtensionContext = React.createContext<EntrySidebarExtensionContextType>({
  entryData: {},
  setEntryData: () => {},
  loading: false,
});
