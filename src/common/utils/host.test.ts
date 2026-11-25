import { describe, expect, test } from "vitest";
import manifest from "../../../manifest.json";
import { appLocations, isOutsideContentstack, locationForPath, reasonFromInitError } from "./host";

describe("host", () => {
  test("a page in its own tab is outside Contentstack", () => {
    expect(isOutsideContentstack()).toBe(true);
  });

  test("an init that gets no answer is told apart from other init failures", () => {
    expect(reasonFromInitError(new Error("No ack for postMessage init in http://x in 10000ms"))).toBe("host-no-answer");
    expect(reasonFromInitError(new Error("Window does not have a parent"))).toBe("init-failed");
    expect(reasonFromInitError("boom")).toBe("init-failed");
  });

  test("every manifest location is described, so the guide cannot drift from the manifest", () => {
    const paths = manifest.ui_location.locations.flatMap((l) => l.meta.map((m) => m.path));
    expect(appLocations.map((l) => l.path)).toEqual(paths);
    appLocations.forEach((l) => {
      expect(l.name).not.toBe(l.type);
      expect(l.where).not.toBe("");
    });
  });

  test("a route maps to its location", () => {
    expect(locationForPath("/custom-field")?.name).toBe("Custom Field");
    expect(locationForPath("/nope")).toBeUndefined();
  });
});
