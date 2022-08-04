import { TrackJS } from "trackjs";
import { each } from "lodash";
import { useCallback } from "react";

const ENV: string = process.env.NODE_ENV;

/**
 * Returns functions to track errors manually
 * and set global data for all events
 */
export const useJSErrorTracking = () => {
  return {
    /**
     * Track an error manually
     * Skip tracking if env = development
     * but log the error to view in console
     */
    trackError: useCallback((error: any) => {
      if (ENV === "development") {
        console.error("TRACKJS ERROR", error);
        return;
      }
      TrackJS.track(error);
    }, []),

    /**
     * Set global data to be sent with every error log
     * Use only global properties
     */
    setErrorsMetaData: useCallback((properties: { [key: string]: string }) => {
      each(properties, (key, value) => {
        TrackJS.addMetadata(key, value);
      });
    }, []),
  };
};
