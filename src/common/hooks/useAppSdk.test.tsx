import { expect, test, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { TestProvider } from "../../test-utils/test-utils";
import { useAppSdk } from "./useAppSdk";

test("useAppSdk", async () => {
  const appSdkMock = {
    location: {
      CustomField: {
        field: {
          setData: vi.fn(),
          getData: async () => "HELLO",
        },
      },
    },
  };
  const { result } = renderHook(() => useAppSdk(), {
    wrapper: ({ children }) => (
      <TestProvider appConfig={{}} appSdk={appSdkMock}>
        {children}
      </TestProvider>
    ),
  });

  expect(result.current).toBe(appSdkMock);
});
