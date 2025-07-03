import { useEffect, useState } from "react";
import { KJUR } from "jsrsasign";
import forge from "node-forge";

const publicKeyUrl = import.meta.env.VITE_PUBLIC_KEY_BASE_URL || "https://app.contentstack.com";

export const useVerifyAppToken = (token: string | null) => {
  const [isValidAppToken, setIsValidAppToken] = useState<boolean | null>(null);

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

        const keyPem = pkcs1.replace(/-----BEGIN RSA PUBLIC KEY-----|-----END RSA PUBLIC KEY-----/g, "").trim();
        const keyDer = forge.util.decode64(keyPem);
        const publicKey = forge.pki.publicKeyFromAsn1(forge.asn1.fromDer(keyDer));
        const pkcs8Pem = forge.pki.publicKeyToPem(publicKey);

        // Verify the token using jsrsasign with the converted PKCS#8 key
        const isValidAppTokenToken = KJUR.jws.JWS.verifyJWT(token, pkcs8Pem, {
          alg: ["RS256"], // specify the algorithm
        });

        isValidAppTokenToken ? setIsValidAppToken(true) : setIsValidAppToken(false);
      } catch (err) {
        setIsValidAppToken(false);
      }
    };

    verify();
  }, [token]);

  return { isValidAppToken };
};
