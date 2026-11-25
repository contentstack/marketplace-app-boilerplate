import { expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import localeTexts from "../../common/locales/en-us/index";
import CustomFieldExtension from "./CustomField";
import { CustomFieldTestProvider, TestProvider } from "../../test-utils/test-utils";

test("CustomFieldExtension component", async () => {
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

  const customField = {
    customField: "HELLO",
    setFieldData: vi.fn(),
    loading: false,
  };

  render(<CustomFieldExtension />, {
    wrapper: ({ children }: { children?: React.ReactNode }) => (
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

  expect(screen.getByText(localeTexts.CustomField.title)).toBeInTheDocument();
});
