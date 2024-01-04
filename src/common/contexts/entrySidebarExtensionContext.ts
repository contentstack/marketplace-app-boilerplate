import React from "react";

export type EntrySidebarExtensionContextType = {
  entryData: { [key: string]: unknown };
  loading: boolean;
};

export const EntrySidebarExtensionContext =
  React.createContext<EntrySidebarExtensionContextType>({
    entryData: {},
    loading: false,
  });
