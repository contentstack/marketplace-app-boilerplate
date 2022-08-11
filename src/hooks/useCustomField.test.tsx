import React from "react";
import { act, renderHook, waitFor } from "@testing-library/react";
import { TestProvider } from "../test-utils/test-utils";
import { useCustomField } from "./useCustomField";

describe("useCustomField", () => {
  const appSdkWithValue = {
    location: {
      CustomField: {
        field: {
          setData: jest.fn(),
          getData: async () => "HELLO",
        },
      },
    },
  };

  it("should return the default value if not present", async function () {
    const appSdkMock = {
      location: {
        CustomField: {
          field: {
            setData: jest.fn(),
            getData: async () => "",
          },
        },
      },
    };
    const { result } = renderHook(() => useCustomField(""), {
      wrapper: ({ children }: any) => (
        <TestProvider appConfig={{}} appSdk={appSdkMock}>
          {children}
        </TestProvider>
      ),
    });

    await waitFor(() => {
      expect(result.current[0]).toBe("");
    });
  });

  it("should return the value from app SDK", async function () {
    const { result } = renderHook(() => useCustomField(""), {
      wrapper: ({ children }: any) => (
        <TestProvider appConfig={{}} appSdk={appSdkWithValue}>
          {children}
        </TestProvider>
      ),
    });

    await waitFor(() => {
      expect(result.current[0]).toBe("HELLO");
    });
  });

  it("should set the value back to SDK", async function () {
    const { result } = renderHook(() => useCustomField(""), {
      wrapper: ({ children }: any) => (
        <TestProvider appConfig={{}} appSdk={appSdkWithValue}>
          {children}
        </TestProvider>
      ),
    });

    act(() => {
      // call the setter function
      result.current[1]("NEW_VALUE");
    });

    await waitFor(() => {
      expect(result.current[0]).toBe("NEW_VALUE");
    });

    expect(appSdkWithValue.location.CustomField.field.setData).toHaveBeenCalledWith("NEW_VALUE");
  });
});
