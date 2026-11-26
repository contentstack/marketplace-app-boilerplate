import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import ContentstackAppSDK from "@contentstack/app-sdk";
import forge from "node-forge";
import { KJUR } from "jsrsasign";
import { MarketplaceAppProvider } from "./MarketplaceAppProvider";
import { tokenMatchesSdk } from "../hooks/useVerifyAppToken";

// Spec: a signed location gets ?app-token=<RS256 JWT>; the app must verify it against
// <host>/.well-known/public-keys.json ("signing-key", PKCS#1 PEM) and refuse to run on a bad token.
let publicPkcs1: string;
let signedToken: string;
let otherKeyToken: string;
let foreignToken: string;

const ids = { appUID: "app", installationUID: "inst", orgUID: "org", apiKey: "stack" };
const claimsFor = (installation: string) => ({
  app_uid: "app",
  installation_uid: installation,
  organization_uid: "org",
  stack_api_key: "stack",
  exp: Math.floor(Date.now() / 1000) + 600,
});

const sign = (privateKey: forge.pki.rsa.PrivateKey, installation = "inst") =>
  KJUR.jws.JWS.sign("RS256", { alg: "RS256" }, claimsFor(installation), forge.pki.privateKeyToPem(privateKey));

beforeAll(() => {
  const keys = forge.pki.rsa.generateKeyPair(1024);
  const other = forge.pki.rsa.generateKeyPair(1024);
  publicPkcs1 = forge.pki.publicKeyToRSAPublicKeyPem(keys.publicKey);
  signedToken = sign(keys.privateKey);
  otherKeyToken = sign(other.privateKey);
  foreignToken = sign(keys.privateKey, "another-installation");
});

const sdk = { ids, location: {}, getConfig: async () => ({}) };

const renderWithToken = (token: string | null, keyResponse: Promise<Response>) => {
  window.history.pushState({}, "", token ? `/custom-field?app-token=${token}` : "/custom-field");
  vi.spyOn(ContentstackAppSDK, "init").mockResolvedValue(sdk as never);
  vi.spyOn(window, "fetch").mockReturnValue(keyResponse);
  render(
    <MarketplaceAppProvider>
      <p>app content</p>
    </MarketplaceAppProvider>
  );
};

const keyResponse = () => Promise.resolve(new Response(JSON.stringify({ "signing-key": publicPkcs1 })));

afterEach(() => vi.restoreAllMocks());

describe("MarketplaceAppProvider app-token check", () => {
  it("renders the app for a token signed with the published key", async () => {
    renderWithToken(signedToken, keyResponse());
    expect(await screen.findByText("app content")).toBeInTheDocument();
  });

  it("shows the failure screen for a token signed with another key", async () => {
    renderWithToken(otherKeyToken, keyResponse());
    expect(await screen.findByRole("alert")).toBeInTheDocument();
    expect(screen.queryByText("app content")).not.toBeInTheDocument();
  });

  it("shows the failure screen for a validly signed token minted for another installation", async () => {
    renderWithToken(foreignToken, keyResponse());
    expect(await screen.findByRole("alert")).toBeInTheDocument();
    expect(screen.queryByText("app content")).not.toBeInTheDocument();
  });

  it("shows the failure screen when the public key cannot be read", async () => {
    renderWithToken(signedToken, Promise.resolve(new Response("{}")));
    expect(await screen.findByRole("alert")).toBeInTheDocument();
  });

  it("renders without a token (location not signed in the manifest)", async () => {
    renderWithToken(null, keyResponse());
    expect(await screen.findByText("app content")).toBeInTheDocument();
  });

  // MKT-22162: nothing of the app runs on an unverified token.
  it("does not render the app while a token is being verified", async () => {
    renderWithToken(otherKeyToken, new Promise<Response>(() => undefined));
    await new Promise((r) => setTimeout(r, 50));
    expect(screen.queryByText("app content")).not.toBeInTheDocument();
  });
});

describe("tokenMatchesSdk", () => {
  const base = { app_uid: "app", installation_uid: "inst", organization_uid: "org" };
  it("accepts an organization app's token, which has no stack_api_key", () => {
    expect(tokenMatchesSdk(base, ids)).toBe(true);
  });
  it("rejects a token for another stack or app", () => {
    expect(tokenMatchesSdk({ ...base, stack_api_key: "other" }, ids)).toBe(false);
    expect(tokenMatchesSdk({ ...base, app_uid: "other" }, ids)).toBe(false);
  });
});
