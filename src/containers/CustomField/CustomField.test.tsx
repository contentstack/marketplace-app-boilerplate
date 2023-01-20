import { render, screen, act, waitFor, fireEvent, getByPlaceholderText } from "@testing-library/react";
import CustomFieldExtension from "./CustomField";
import { TestProvider, CustomFieldTestProvider } from "../../test-utils/test-utils";

test("renders the custom field input", async () => {
  const appSdkMock = {
    location: {
      CustomField: {
        field: {
          setData: jest.fn(),
          getData: async () => "HELLO",
        },
      },
    },
  };

  const customField = {
    customField: "HELLO",
    setFieldData: jest.fn(),
    loading: false,
  };

  render(<CustomFieldExtension />, {
    wrapper: ({ children }: any) => (
      <TestProvider appConfig={{}} appSdk={appSdkMock}>
        <CustomFieldTestProvider
          customField={customField.customField}
          setFieldData={customField.setFieldData}
          loading={customField.loading}>
          {children}
        </CustomFieldTestProvider>
      </TestProvider>
    ),
  });

  //   await waitFor(() => {
  //     const byPlaceholderText: HTMLInputElement = screen.getByPlaceholderText(/Enter custom field/);
  //     expect(byPlaceholderText.value).toEqual("HELLO");
  //   });

  //   fireEvent.change(screen.getByPlaceholderText(/Enter custom field/i), {
  //     target: { value: "New value in field" },
  //   });

  //   await waitFor(() => {
  //     const byPlaceholderText: HTMLInputElement = screen.getByPlaceholderText(/Enter custom field/);
  //     expect(byPlaceholderText.value).toEqual("New value in field");
  //   });
});
