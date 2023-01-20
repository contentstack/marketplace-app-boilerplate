import { act, renderHook, waitFor } from "@testing-library/react";
import { TestProvider, CustomFieldTestProvider } from "../../test-utils/test-utils";
import { useCustomField } from "./useCustomField";

describe("useCustomField", () => {
  // const appSdkWithValue = {
  //   location: {
  //     CustomField: {
  //       field: {
  //         setData: jest.fn(),
  //         getData: async () => "HELLO",
  //       },
  //     },
  //   },
  // };

  const customField = {
    customField: "Hello",
    setFieldData: jest.fn(),
    loading: false,
  };

  it("should return the value from app SDK", async function () {
    const { result } = renderHook(() => useCustomField(), {
      wrapper: ({ children }: any) => (
        <CustomFieldTestProvider
          customField={customField.customField}
          setFieldData={customField.setFieldData}
          loading={customField.loading}>
          {children}
        </CustomFieldTestProvider>
      ),
    });

    await waitFor(() => {
      expect(result.current.customField).toBe("Hello");
    });
  });

  // it("should set the value back to SDK", async function () {
  //   const { result } = renderHook(() => useCustomField(), {
  //     wrapper: ({ children }: any) => (
  //       <CustomFieldTestProvider customField={null} setFieldData={() => {}} loading>
  //         {children}
  //       </CustomFieldTestProvider>
  //     ),
  //   });

  //   console.log("resut", result);

  //   act(() => {
  //     // call the setter function
  //     result.current.setFieldData("NEW_VALUE");
  //   });

  //   // await waitFor(() => {
  //   //   expect(result.current.customField).toBe("NEW_VALUE");
  //   // });

  //   expect(result.current.setFieldData).toHaveBeenCalledWith("NEW_VALUE");
  // });
});
