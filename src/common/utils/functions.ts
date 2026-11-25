import UILocation from "@contentstack/app-sdk/dist/src/uiLocation";

import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import keys from "lodash/keys";

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
