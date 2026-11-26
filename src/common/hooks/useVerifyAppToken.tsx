import { useEffect, useState } from "react";

const publicKeyUrl = import.meta.env.VITE_PUBLIC_KEY_BASE_URL || "https://app.contentstack.com";

// Claims Developer Hub puts in the app-token (installations.service createToken).
export type AppTokenClaims = {
  app_uid?: string;
  installation_uid?: string;
  organization_uid?: string;
  stack_api_key?: string;
};

type SdkIds = { appUID: string; installationUID: string; orgUID: string; apiKey: string };

/** A valid signature is not enough: the token must be for this app, installation, organization and stack. */
export const tokenMatchesSdk = (claims: AppTokenClaims, ids: SdkIds): boolean =>
  claims.app_uid === ids.appUID &&
  claims.installation_uid === ids.installationUID &&
  (claims.organization_uid === undefined || claims.organization_uid === ids.orgUID) &&
  // Organization apps get no stack_api_key.
  (claims.stack_api_key === undefined || claims.stack_api_key === ids.apiKey);

export const useVerifyAppToken = (token: string | null) => {
  const [isValidAppToken, setIsValidAppToken] = useState<boolean | null>(null);
  const [claims, setClaims] = useState<AppTokenClaims | null>(null);

  useEffect(() => {
    const verify = async () => {
      if (!token) return; // skip verification if no token

      try {
        const res = await fetch(`${publicKeyUrl}/.well-known/public-keys.json`);
        const data = await res.json();
        const pkcs1 = data["signing-key"];

        if (!pkcs1 || pkcs1.trim() === "") {
          throw new Error("No valid public key found");
        }

        // Loaded on demand: these two libraries are most of the bundle and only verify the token.
        const [{ KJUR }, { default: forge }] = await Promise.all([import("jsrsasign"), import("node-forge")]);
        const keyPem = pkcs1.replace(/-----BEGIN RSA PUBLIC KEY-----|-----END RSA PUBLIC KEY-----/g, "").trim();
        const keyDer = forge.util.decode64(keyPem);
        const publicKey = forge.pki.publicKeyFromAsn1(forge.asn1.fromDer(keyDer));
        const pkcs8Pem = forge.pki.publicKeyToPem(publicKey);

        // Verify the token using jsrsasign with the converted PKCS#8 key
        const isValidAppTokenToken = KJUR.jws.JWS.verifyJWT(token, pkcs8Pem, {
          alg: ["RS256"], // specify the algorithm
        });

        if (isValidAppTokenToken) setClaims(KJUR.jws.JWS.parse(token).payloadObj as AppTokenClaims);
        setIsValidAppToken(Boolean(isValidAppTokenToken));
      } catch {
        setIsValidAppToken(false);
      }
    };

    verify();
  }, [token]);

  return { isValidAppToken, claims };
};
