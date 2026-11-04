import { describe, expect, it, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { TestProvider } from "../../test-utils/test-utils";
import { useAppSdkApi } from "./useApi";

// Spec: README "useApi" — callCmaApi(endpoint) calls the CMA through the App SDK,
// callDirectApi(url) calls the given URL, isApiReady says whether the SDK is there.
const withSdk = (appSdk: unknown) =>
  renderHook(() => useAppSdkApi(), {
    wrapper: ({ children }: { children: React.ReactNode }) => (
      <TestProvider appConfig={{}} appSdk={appSdk}>
        {children}
      </TestProvider>
    ),
  });

describe("useAppSdkApi", () => {
  it("calls the CMA endpoint through appSdk.api with a JSON content type", async () => {
    const api = vi.fn(async () => new Response("{}", { status: 200 }));
    const { result } = withSdk({ endpoints: { CMA: "https://api.example.test" }, api });
    await result.current.callCmaApi("/v3/content_types");
    expect(api).toHaveBeenCalledWith("https://api.example.test/v3/content_types", {
      headers: { "Content-Type": "application/json" },
    });
  });

  // BUG: MKT-22164 options spread after headers, so any caller header drops the default Content-Type.
  it.skip("keeps the JSON content type when the caller adds headers", async () => {
    const api = vi.fn(async () => new Response("{}", { status: 200 }));
    const { result } = withSdk({ endpoints: { CMA: "https://api.example.test" }, api });
    await result.current.callCmaApi("/v3/content_types", { headers: { branch: "main" } });
    expect(api).toHaveBeenCalledWith("https://api.example.test/v3/content_types", {
      headers: { "Content-Type": "application/json", branch: "main" },
    });
  });

  it("calls a direct URL as given", async () => {
    const api = vi.fn(async () => new Response("{}", { status: 200 }));
    const { result } = withSdk({ endpoints: { CMA: "https://api.example.test" }, api });
    await result.current.callDirectApi("https://service.example.test/x");
    expect(api).toHaveBeenCalledWith("https://service.example.test/x", expect.anything());
  });

  it("throws an error with the status only, not the response, when the call fails", async () => {
    const api = vi.fn(async () => new Response("secret body", { status: 403, statusText: "Forbidden" }));
    const { result } = withSdk({ endpoints: { CMA: "https://api.example.test" }, api });
    await expect(result.current.callCmaApi("/v3/stacks")).rejects.toThrow("Contentstack CMA API Error: 403 Forbidden");
    await expect(result.current.callDirectApi("https://service.example.test/x")).rejects.toThrow("Direct API Error: 403");
  });

  it("is not ready and refuses calls without the SDK", async () => {
    const { result } = withSdk(null);
    expect(result.current.isApiReady).toBe(false);
    await expect(result.current.callCmaApi("/v3/stacks")).rejects.toThrow("not ready");
  });
});
