import type { ReactNode } from "react";

export interface KeyValueObj {
  [key: string]: string;
}

export type ChildProp = {
  // ReactNode accepts everything the old union did, plus what React passes to wrappers.
  children: ReactNode;
};
