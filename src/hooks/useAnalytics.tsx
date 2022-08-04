import mixpanel from "mixpanel-browser";
import { useCallback } from "react";
import { getEnv } from "../Env";

const ENV: string = process.env.NODE_ENV;

/**
 * Initialise Mixpanel
 */
mixpanel.init(`${process.env.REACT_APP_MIXPANEL_TOKEN}`, {
  debug: ENV === "development", // debug: true in development mode
  ignore_dnt: true,
});

type AnalyticsApi = { trackEvent: Function; setUserId: Function; setEventsGlobalData: Function };

/**
 * useAnalytics hook to track user actions and events in application
 */
export const useAnalytics = (): AnalyticsApi => {
  /**
   * Logs the events to MixPanel service.
   * Wont log in development mode
   */
  const trackEvent = useCallback((event: string, eventData: { [key: string]: string } = {}) => {
    // skip tracking if env is development
    if (getEnv() === "production") {
      mixpanel.track(event, eventData);
    } else {
      console.info("MIXPANEL_TRACK", event, eventData);
    }
  }, []);

  /**
   * Mixpanel api to identify a user
   */
  const setUserId = useCallback((userId: string) => {
    if (getEnv() === "production") {
      mixpanel.identify(userId);
    }
  }, []);

  /**
   * Properties passed to this function will be sent with every event
   * Choose global properties only
   */
  const setEventsGlobalData = useCallback((properties: { [key: string]: string }) => {
    if (getEnv() === "production") {
      mixpanel.register(properties);
    }
  }, []);

  return { setUserId, setEventsGlobalData, trackEvent };
};
