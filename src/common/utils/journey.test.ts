import { describe, expect, test } from "vitest";
import { buildJourney } from "./journey";
import { locationForPath } from "./host";

const origin = "http://localhost:3000";
const ui = { base_url: origin, locations: [{ type: "cs.cm.stack.custom_field", meta: [{ path: "/custom-field" }] }] };
const status = (steps: ReturnType<typeof buildJourney>) => Object.fromEntries(steps.map((s) => [s.id, s.status]));

describe("buildJourney", () => {
  test("a fresh clone: running, not registered, so registering is next", () => {
    const steps = buildJourney({ ui_location: ui }, origin);
    expect(status(steps)).toEqual({ run: "done", register: "next", configure: "todo", install: "todo", see: "todo", ship: "later" });
    expect(steps.find((s) => s.id === "register")?.command).toBe("csdx app:create");
  });

  test("registered with a sound manifest: install is the one next step, and offers dev:stack", () => {
    const steps = buildJourney({ uid: "app1", organization_uid: "org1", ui_location: ui }, origin);
    expect(status(steps)).toMatchObject({ register: "done", configure: "done", install: "next" });
    expect(steps.filter((s) => s.status === "next")).toHaveLength(1);
    expect(steps.find((s) => s.id === "install")?.command).toContain("dev:stack");
  });

  test("a base URL that is not this dev server is flagged", () => {
    const steps = buildJourney({ ui_location: { ...ui, base_url: "http://localhost:4000" } }, origin);
    const part = steps.find((s) => s.id === "configure")?.parts?.[0];
    expect(part?.status).toBe("next");
    expect(status(steps).configure).toBe("next");
    expect(part?.detail).toContain(origin);
  });

  test("a webhook pointing at localhost is flagged: Contentstack cannot reach it", () => {
    const steps = buildJourney({ ui_location: ui, webhook: { enabled: true, target_url: "http://localhost:8000/hook" } }, origin);
    const webhook = steps.find((s) => s.id === "configure")?.parts?.find((p) => p.name === "Webhook");
    expect(webhook?.status).toBe("next");
    expect(webhook?.detail).toMatch(/cannot reach localhost/);
  });

  test("webhook and OAuth not declared are optional, not missing", () => {
    const parts = buildJourney({ ui_location: ui }, origin).find((s) => s.id === "configure")?.parts ?? [];
    expect(parts.filter((p) => p.name !== "UI locations (1)").map((p) => p.status)).toEqual(["optional", "optional"]);
  });

  test("an organization app installs in the organization, without the stack command", () => {
    const install = buildJourney({ uid: "a", organization_uid: "o", target_type: "organization" }, origin).find((s) => s.id === "install");
    expect(install?.title).toContain("organization");
    expect(install?.command).toBeUndefined();
  });

  test("on a location route, 'see it work' names that location and where it appears", () => {
    const see = buildJourney({ ui_location: ui }, origin, locationForPath("/custom-field")).find((s) => s.id === "see");
    expect(see?.detail).toContain("Custom Field");
    expect(see?.detail).toContain("entry editor");
  });
});
