import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";

const sdk = vi.hoisted(() => ({ init: vi.fn(), framed: false, local: true }));

vi.mock("@contentstack/app-sdk", () => ({ default: { init: sdk.init } }));
vi.mock("../utils/host", async (original) => ({
  ...(await original<typeof import("../utils/host")>()),
  isOutsideContentstack: () => !sdk.framed,
  isLocalDev: () => sdk.local,
}));

import { MarketplaceAppProvider } from "./MarketplaceAppProvider";

const renderAt = (path: string) => {
  window.history.pushState({}, "", path);
  return render(
    <MarketplaceAppProvider>
      <p>app content</p>
    </MarketplaceAppProvider>
  );
};

describe("MarketplaceAppProvider states", () => {
  beforeEach(() => {
    sdk.init.mockReset();
    sdk.framed = false;
    sdk.local = true;
  });

  test("local, own tab, on /: lists every location and never starts the SDK", () => {
    renderAt("/");
    expect(screen.getByText("Your app is running locally")).toBeInTheDocument();
    expect(screen.getByText("/custom-field")).toBeInTheDocument();
    expect(sdk.init).not.toHaveBeenCalled();
  });

  test("local, own tab, on a location route: explains that location", () => {
    renderAt("/entry-sidebar");
    expect(screen.getByText("Entry Sidebar runs inside Contentstack")).toBeInTheDocument();
    expect(screen.queryByText("app content")).not.toBeInTheDocument();
  });

  test("deployed URL, own tab: short message for whoever opened it", () => {
    sdk.local = false;
    renderAt("/custom-field");
    expect(screen.getByText("NOT_IN_STACK")).toBeInTheDocument();
    expect(screen.queryByText(/Developer Hub/)).not.toBeInTheDocument();
  });

  test("framed but the host never answers", async () => {
    sdk.framed = true;
    sdk.init.mockRejectedValue(new Error("No ack for postMessage init in http://x in 10000ms"));
    renderAt("/custom-field");
    expect(await screen.findByText("HOST_NO_ANSWER")).toBeInTheDocument();
  });

  test("framed and the SDK fails for another reason", async () => {
    sdk.framed = true;
    sdk.init.mockRejectedValue(new Error("something else"));
    renderAt("/custom-field");
    expect(await screen.findByText("SDK_INIT_FAILED")).toBeInTheDocument();
  });

  test("framed and the SDK starts: renders the app", async () => {
    sdk.framed = true;
    sdk.init.mockResolvedValue({ location: {}, getConfig: async () => ({}) });
    renderAt("/custom-field");
    expect(await screen.findByText("app content")).toBeInTheDocument();
  });
});
