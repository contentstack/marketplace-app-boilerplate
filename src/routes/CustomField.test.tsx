import React from "react";
import { render, screen, act, waitFor, fireEvent, getByPlaceholderText } from "@testing-library/react";
import CustomFieldExtension from "./CustomField";
import { TestProvider } from "../test-utils/test-utils";

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
  render(<CustomFieldExtension />, {
    wrapper: ({ children }: any) => (
      <TestProvider appConfig={{}} appSdk={appSdkMock}>
        {children}
      </TestProvider>
    ),
  });

  await waitFor(() => {
    const byPlaceholderText: HTMLInputElement = screen.getByPlaceholderText(/Enter custom field/);
    expect(byPlaceholderText.value).toEqual("HELLO");
  });

  fireEvent.change(screen.getByPlaceholderText(/Enter custom field/i), {
    target: { value: "New value in field" },
  });

  await waitFor(() => {
    const byPlaceholderText: HTMLInputElement = screen.getByPlaceholderText(/Enter custom field/);
    expect(byPlaceholderText.value).toEqual("New value in field");
  });
});
