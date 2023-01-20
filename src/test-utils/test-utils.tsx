import React from "react";
import { Provider } from "jotai";
import { render } from "@testing-library/react";
import { useAppSdk } from "../common/hooks/useAppSdk";
import { useAppConfig } from "../common/hooks/useAppConfig";

export const TestProvider = ({
  children,
  appSdk,
  appConfig = {},
}: {
  appConfig: any;
  children?: React.ReactNode;
  appSdk: any;
}) => {
  return (
    <Provider
      // @ts-ignore
      initialValues={[
        [useAppSdk, appSdk],
        [useAppConfig, appConfig],
      ]}>
      {children}
    </Provider>
  );
};

const AllTheProviders = ({ children, initialProps }: any) => {
  return (
    <TestProvider appConfig={initialProps?.appConfig} appSdk={initialProps?.appSdk}>
      {children}
    </TestProvider>
  );
};

const customRender = (ui: any, options?: object) => render(ui, { wrapper: AllTheProviders, ...options });

// re-export everything
//@ts-ignore
export * from "@testing-library/react";

// override render method
export { customRender as render };
