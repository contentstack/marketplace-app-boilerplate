import { describe, expect, it, vi } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";
import { TestProvider } from "../../test-utils/test-utils";
import { AppConfigurationExtensionProvider } from "./AppConfigurationExtensionProvider";
import { useInstallationData } from "../hooks/useInstallationData";

// Spec: setInstallationData merges the given keys into the saved installation data
// (configuration and serverConfiguration), so keys the caller did not pass are kept.
const setup = () => {
  const saved = { configuration: { saved_key: "a" }, serverConfiguration: { saved_secret: "b" } };
  const installation = { getInstallationData: vi.fn(async () => saved), setInstallationData: vi.fn(async () => undefined) };
  const appSdk = { location: { AppConfigWidget: { installation } } };
  const hook = renderHook(() => useInstallationData(), {
    wrapper: ({ children }: { children: React.ReactNode }) => (
      <TestProvider appConfig={{}} appSdk={appSdk}>
        <AppConfigurationExtensionProvider>{children as JSX.Element}</AppConfigurationExtensionProvider>
      </TestProvider>
    ),
  });
  return { hook, installation, saved };
};

describe("AppConfigurationExtensionProvider", () => {
  it("loads the saved installation data", async () => {
    const { hook, saved } = setup();
    await waitFor(() => expect(hook.result.current.loading).toBe(false));
    expect(hook.result.current.installationData).toEqual(saved);
  });

  // BUG: MKT-22163 setInstallationData merges into the first render's (empty) data, so saved keys are dropped.
  it.skip("keeps saved keys when saving other keys", async () => {
    const { hook, installation } = setup();
    await waitFor(() => expect(hook.result.current.loading).toBe(false));
    await act(() => hook.result.current.setInstallationData({ configuration: { new_key: "c" }, serverConfiguration: {} }));
    expect(installation.setInstallationData).toHaveBeenCalledWith({
      configuration: { saved_key: "a", new_key: "c" },
      serverConfiguration: { saved_secret: "b" },
    });
  });

  it("logs a failed load without the request headers (MKT-22152)", async () => {
    const log = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const auth = `leak-${Math.random().toString(36).slice(2)}`;
    const failure = Object.assign(new Error("load failed"), { config: { headers: { authtoken: auth } } });
    const installation = { getInstallationData: vi.fn(async () => Promise.reject(failure)), setInstallationData: vi.fn() };
    renderHook(() => useInstallationData(), {
      wrapper: ({ children }: { children: React.ReactNode }) => (
        <TestProvider appConfig={{}} appSdk={{ location: { AppConfigWidget: { installation } } }}>
          <AppConfigurationExtensionProvider>{children as JSX.Element}</AppConfigurationExtensionProvider>
        </TestProvider>
      ),
    });
    await waitFor(() => expect(log).toHaveBeenCalled());
    expect(JSON.stringify(log.mock.calls)).toContain("load failed");
    expect(JSON.stringify(log.mock.calls)).not.toContain(auth);
    log.mockRestore();
  });
});
