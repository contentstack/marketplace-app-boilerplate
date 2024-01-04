import React from "react";
import { renderHook } from "@testing-library/react";
import { TestProvider } from "../../test-utils/test-utils";
import { useAppConfig } from "./useAppConfig";

describe("useAppConfig", () => {
  it("should return the config data", async function () {
    const appConfig = { key: "value" };
    const { result } = renderHook(() => useAppConfig(), {
      wrapper: ({ children }) => (
        <TestProvider appConfig={appConfig} appSdk={{}}>
          {children}
        </TestProvider>
      ),
    });

    expect(result.current).toBe(appConfig);
  });
});
