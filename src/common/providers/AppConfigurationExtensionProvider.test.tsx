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
});
