import UILocation from "@contentstack/app-sdk/dist/src/uiLocation";

import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import keys from "lodash/keys";
import manifest from "../../../manifest.json";

export function getAppLocation(sdk: UILocation): string {
  const locations = keys(sdk?.location);
  let locationName = "";
  for (let i = 0; i <= locations.length; i++) {
    if (!isEmpty(get(sdk, `location.${locations[i]}`, undefined))) {
      locationName = locations[i];
      break;
    }
  }
  return locationName;
}

export const getTokenFromUrl = (): string | null => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("app-token");
};

// A location marked `signed: true` in manifest.json always gets an app-token from the host.
// Keep its `signed` flags in step with Developer Hub. Assumes the app is served from the root, not a sub-path.
export const isSignedLocation = (pathname: string): boolean => {
  const path = pathname.replace(/\/+$/, ""); // the router also matches "/custom-field/"
  return manifest.ui_location.locations.some((l) => l.meta.some((m) => m.path === path && m.signed));
};
