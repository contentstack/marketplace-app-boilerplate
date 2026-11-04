import { describe, expect, it, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { TestProvider } from "../../test-utils/test-utils";
import { EntrySidebarExtensionProvider } from "../providers/EntrySidebarExtensionProvider";
import { useEntry } from "./useEntry";
import { useFrame } from "./useFrame";
import { useManagementClient } from "./useManagementClient";

// Spec: README "Available Hooks" and each hook's doc comment.
const wrap = (appSdk: unknown, inner?: (c: JSX.Element) => JSX.Element) =>
  function Wrapper({ children }: { children: React.ReactNode }) {
    const c = children as JSX.Element;
    return (
      <TestProvider appConfig={{}} appSdk={appSdk}>
        {inner ? inner(c) : c}
      </TestProvider>
    );
  };

describe("location hooks", () => {
  it("useEntry returns the entry of the sidebar location", async () => {
    const appSdk = { location: { SidebarWidget: { entry: { getData: () => ({ uid: "entry_uid" }) } } } };
    const { result } = renderHook(() => useEntry(), {
      wrapper: wrap(appSdk, (c) => <EntrySidebarExtensionProvider>{c}</EntrySidebarExtensionProvider>),
    });
    await waitFor(() => expect(result.current.entryData).toEqual({ uid: "entry_uid" }));
  });

  it("useFrame returns the location for a custom field", () => {
    const customField = { frame: {} };
    const { result } = renderHook(() => useFrame(), { wrapper: wrap({ location: { CustomField: customField } }) });
    expect(result.current).toBe(customField);
  });

  it("useFrame refuses locations without a frame", () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    expect(() =>
      renderHook(() => useFrame(), { wrapper: wrap({ location: { SidebarWidget: { entry: {} } } }) })
    ).toThrow("useFrame hook cannot be used at SidebarWidget location");
  });

  it("useManagementClient is null without the SDK and a client with it", async () => {
    expect(renderHook(() => useManagementClient(), { wrapper: wrap(null) }).result.current).toBeNull();
    const appSdk = { createAdapter: () => vi.fn(), endpoints: { CMA: "https://api.example.test" } };
    const { result } = renderHook(() => useManagementClient(), { wrapper: wrap(appSdk) });
    await waitFor(() => expect(typeof result.current?.stack).toBe("function"));
  });
});
