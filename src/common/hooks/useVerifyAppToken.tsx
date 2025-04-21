import { useEffect, useState } from "react";
import { KJUR } from "jsrsasign";
import forge from "node-forge";

export const useVerifyAppToken = (token: string | null) => {
  const [isValid, setIsValid] = useState<boolean | null>(null);

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setIsValid(true); // Skip verification if no token is present
        return;
      }

      try {
        const res = await fetch("https://app.contentstack.com/.well-known/public-keys.json");
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
        const isValidToken = KJUR.jws.JWS.verifyJWT(token, pkcs8Pem, {
          alg: ["RS256"], // specify the algorithm
        });

        isValidToken ? setIsValid(true) : setIsValid(false);
      } catch (err) {
        setIsValid(false);
      }
    };

    verify();
  }, [token]);

  return { isValid };
};
