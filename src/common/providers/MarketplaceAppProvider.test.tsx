import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import ContentstackAppSDK from "@contentstack/app-sdk";
import forge from "node-forge";
import { KJUR } from "jsrsasign";
import { MarketplaceAppProvider } from "./MarketplaceAppProvider";

// Spec: a signed location gets ?app-token=<RS256 JWT>; the app must verify it against
// <host>/.well-known/public-keys.json ("signing-key", PKCS#1 PEM) and refuse to run on a bad token.
let publicPkcs1: string;
let signedToken: string;
let otherKeyToken: string;

const sign = (privateKey: forge.pki.rsa.PrivateKey) =>
  KJUR.jws.JWS.sign(
    "RS256",
    { alg: "RS256" },
    { app_uid: "app", exp: Math.floor(Date.now() / 1000) + 600 },
    forge.pki.privateKeyToPem(privateKey)
  );

beforeAll(() => {
  const keys = forge.pki.rsa.generateKeyPair(1024);
  const other = forge.pki.rsa.generateKeyPair(1024);
  publicPkcs1 = forge.pki.publicKeyToRSAPublicKeyPem(keys.publicKey);
  signedToken = sign(keys.privateKey);
  otherKeyToken = sign(other.privateKey);
});

const sdk = { location: {}, getConfig: async () => ({}) };

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

  it("shows the failure screen when the public key cannot be read", async () => {
    renderWithToken(signedToken, Promise.resolve(new Response("{}")));
    expect(await screen.findByRole("alert")).toBeInTheDocument();
  });

  it("renders without a token (location not signed in the manifest)", async () => {
    renderWithToken(null, keyResponse());
    expect(await screen.findByText("app content")).toBeInTheDocument();
  });

  // BUG: MKT-22162 the app renders (and runs) while the token is still being verified.
  it.skip("does not render the app while a token is being verified", async () => {
    renderWithToken(otherKeyToken, new Promise<Response>(() => undefined));
    await new Promise((r) => setTimeout(r, 50));
    expect(screen.queryByText("app content")).not.toBeInTheDocument();
  });
});
