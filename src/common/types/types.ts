export interface KeyValueObj {
  [key: string]: string;
}

export type ChildProp = {
  children: string | JSX.Element | JSX.Element[];
};
