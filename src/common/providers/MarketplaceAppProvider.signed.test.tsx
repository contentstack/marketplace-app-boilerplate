import { afterEach, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import ContentstackAppSDK from "@contentstack/app-sdk";
import { MarketplaceAppProvider } from "./MarketplaceAppProvider";

// Spec: a location marked `signed: true` in the manifest always receives an app-token.
vi.mock("../../../manifest.json", () => ({
  default: {
    ui_location: {
      locations: [
        { type: "cs.cm.stack.custom_field", meta: [{ path: "/custom-field", signed: true }] },
        { type: "cs.cm.stack.sidebar", meta: [{ path: "/entry-sidebar", signed: false }] },
      ],
    },
  },
}));

const renderAt = (path: string) => {
  window.history.pushState({}, "", path);
  vi.spyOn(ContentstackAppSDK, "init").mockResolvedValue({ location: {}, getConfig: async () => ({}) } as never);
  render(
    <MarketplaceAppProvider>
      <p>app content</p>
    </MarketplaceAppProvider>
  );
};

afterEach(() => vi.restoreAllMocks());

it("fails closed on a signed location opened without an app-token", async () => {
  renderAt("/custom-field");
  expect(await screen.findByRole("alert")).toBeInTheDocument();
  expect(screen.queryByText("app content")).not.toBeInTheDocument();
});

it("renders an unsigned location without an app-token", async () => {
  renderAt("/entry-sidebar");
  expect(await screen.findByText("app content")).toBeInTheDocument();
});
