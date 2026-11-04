import { describe, expect, it } from "vitest";
import axios, { AxiosAdapter } from "axios";
import { safeError } from "./safeError";

// Built at run time so no secret-looking literal sits in the fixture.
const leak = (name: string) => `leak-${name}-${Math.random().toString(36).slice(2)}`;
const KEY = leak("key");
const AUTH = leak("auth");
const PASSWORD = leak("password");
const BODY = leak("body");
const QS = leak("qs");
const SECRETS = [KEY, AUTH, PASSWORD, BODY, QS];

describe("safeError", () => {
  it("keeps message, status, code and url; drops headers, body and query", () => {
    const out = safeError({
      message: "Request failed with status code 401",
      code: "ERR_BAD_REQUEST",
      response: { status: 401, data: BODY },
      config: {
        url: `https://api.example.test/v3/assets/1?token=${QS}`,
        data: JSON.stringify({ user: { password: PASSWORD } }),
        headers: { api_key: KEY, authtoken: AUTH },
      },
    });
    expect(out).toEqual({
      message: "Request failed with status code 401",
      status: 401,
      code: "ERR_BAD_REQUEST",
      url: "https://api.example.test/v3/assets/1",
    });
    SECRETS.forEach((v) => expect(JSON.stringify(out)).not.toContain(v));
  });

  it("a real axios error (authtoken header, password body) logged through safeError carries neither", async () => {
    const adapter: AxiosAdapter = (config) => Promise.reject(Object.assign(new Error("boom"), { config, isAxiosError: true }));
    const logged = await axios
      .post(
        `https://api.example.test/v3/user-session?token=${QS}`,
        { user: { email: "e2e@example.test", password: PASSWORD } },
        { adapter, headers: { api_key: KEY, authtoken: AUTH } }
      )
      .then(
        () => "",
        (e) => JSON.stringify(safeError(e))
      );
    expect(logged).toContain("boom");
    expect(logged).toContain("https://api.example.test/v3/user-session");
    SECRETS.forEach((v) => expect(logged).not.toContain(v));
  });

  it("tolerates a non-error value", () => {
    expect(safeError(undefined)).toEqual({ message: undefined, status: undefined, code: undefined, url: undefined });
  });
});
