import { expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import ContentstackAppSDK from "@contentstack/app-sdk";
import localeTexts from "./common/locales/en-us/index";

// Spec: manifest.json custom_field path "/custom-field"; the real entry (BrowserRouter) must render it.
it("the real entry renders the location at its manifest path", async () => {
  vi.spyOn(ContentstackAppSDK, "init").mockResolvedValue({
    location: { CustomField: { field: { getData: async () => "", setData: vi.fn() } } },
    getConfig: async () => ({}),
  } as never);
  document.body.innerHTML = '<div id="root"></div>';
  window.history.pushState({}, "", "/custom-field");
  await import("./main");
  expect(await screen.findByText(localeTexts.CustomField.title)).toBeInTheDocument();
});
