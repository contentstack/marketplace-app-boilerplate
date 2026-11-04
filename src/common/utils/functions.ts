import UILocation from "@contentstack/app-sdk/dist/src/uiLocation";

import { get, isEmpty, keys } from "lodash";
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
export const isSignedLocation = (pathname: string): boolean =>
  manifest.ui_location.locations.some((l) => l.meta.some((m) => m.path === pathname && m.signed));
