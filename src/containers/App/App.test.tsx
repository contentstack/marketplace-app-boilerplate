import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ContentstackAppSDK from "@contentstack/app-sdk";
import manifest from "../../../manifest.json";
import localeTexts from "../../common/locales/en-us/index";
import App from "./App";

// One fake location with what every provider reads (field, entry, installation, frame).
const fakeSdk = () => ({
  location: {
    Location: {
      field: { getData: async () => "", setData: vi.fn() },
      entry: { getData: () => ({ uid: "entry_uid" }) },
      installation: {
        getInstallationData: async () => ({ configuration: {}, serverConfiguration: {} }),
        setInstallationData: vi.fn(),
      },
      frame: { updateHeight: vi.fn(), disableAutoResizing: vi.fn(), updateDimension: vi.fn() },
    },
  },
  getConfig: async () => ({}),
});

// Spec: manifest.json ui_location paths; each must render its location's title.
const titleByPath: Record<string, string> = {
  "/custom-field": localeTexts.CustomField.title,
  "/stack-dashboard": localeTexts.DashboardWidget.title,
  "/asset-sidebar": localeTexts.AssetSidebarWidget.title,
  "/content-type-sidebar": localeTexts.ContentTypeSidebarWidget.title,
  "/entry-sidebar": localeTexts.SidebarWidget.title,
  "/full-page": localeTexts.FullPage.title,
  "/field-modifier": localeTexts.FieldModifier.title,
  "/app-configuration": localeTexts.ConfigScreen.title,
};

const manifestPaths = manifest.ui_location.locations.flatMap((l) => l.meta.map((m) => ({ type: l.type, path: m.path })));

afterEach(() => vi.restoreAllMocks());

describe("App routes every manifest UI location", () => {
  it.each(manifestPaths.filter((p) => p.type !== "cs.cm.stack.rte"))("$type at $path", async ({ path }) => {
    vi.spyOn(ContentstackAppSDK, "init").mockResolvedValue(fakeSdk() as never);
    render(
      <MemoryRouter initialEntries={[path]}>
        <App />
      </MemoryRouter>
    );
    expect(await screen.findByText(titleByPath[path])).toBeInTheDocument();
  });

  // BUG: MKT-22161 the manifest declares an RTE location at /json-rte.js, but the RTE plugin was removed (bc7133e).
  it.skip("cs.cm.stack.rte has no location in the manifest unless the template ships the plugin", () => {
    expect(manifestPaths.map((p) => p.type)).not.toContain("cs.cm.stack.rte");
  });

  it("the root path lists the location paths", async () => {
    vi.spyOn(ContentstackAppSDK, "init").mockResolvedValue(fakeSdk() as never);
    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>
    );
    expect(await screen.findByRole("link", { name: "Custom Field" })).toHaveAttribute("href", "/custom-field");
  });

  it("an unknown path shows the 404 page", async () => {
    vi.spyOn(ContentstackAppSDK, "init").mockResolvedValue(fakeSdk() as never);
    render(
      <MemoryRouter initialEntries={["/no-such-location"]}>
        <App />
      </MemoryRouter>
    );
    expect(await screen.findByText(localeTexts[404].title)).toBeInTheDocument();
  });

  it("shows the failure screen when the SDK cannot initialise", async () => {
    vi.spyOn(ContentstackAppSDK, "init").mockRejectedValue(new Error("not in an iframe"));
    render(
      <MemoryRouter initialEntries={["/custom-field"]}>
        <App />
      </MemoryRouter>
    );
    expect(await screen.findByRole("alert")).toBeInTheDocument();
  });
});
