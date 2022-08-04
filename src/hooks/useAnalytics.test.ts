import { renderHook } from "@testing-library/react";
import { useAnalytics } from "./useAnalytics";
import mixpanel from "mixpanel-browser";
import { getEnv } from "../Env";

jest.mock("../Env");

describe("useAnalytics", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  describe("trackEvent", () => {
    const eventName = "EVENT_NAME";
    const eventProps = { name: "John" };

    it("should call the mixpanel.track function", function () {
      // @ts-ignore
      getEnv.mockImplementation(() => "production");
      const { result } = renderHook(() => useAnalytics());
      expect(mixpanel.track).not.toHaveBeenCalled();

      result.current.trackEvent(eventName, eventProps);
      expect(mixpanel.track).toHaveBeenCalledWith(eventName, eventProps);
    });

    it("should not call track if development environment", function () {
      // @ts-ignore
      getEnv.mockImplementation(() => "development");
      const { result } = renderHook(() => useAnalytics());

      result.current.trackEvent(eventName, eventProps);
      expect(mixpanel.track).not.toHaveBeenCalled();
    });
  });

  describe("setUserId", () => {
    const userId: string = "USER_ID";
    it("should call the identity function with params", function () {
      // @ts-ignore
      getEnv.mockImplementation(() => "production");
      const { result } = renderHook(() => useAnalytics());
      expect(mixpanel.identify).not.toHaveBeenCalled();

      result.current.setUserId(userId);
      expect(mixpanel.identify).toHaveBeenCalledWith(userId);
    });

    it("should not call identify if development environment", function () {
      // @ts-ignore
      getEnv.mockImplementation(() => "development");
      const { result } = renderHook(() => useAnalytics());

      result.current.setUserId(userId);
      expect(mixpanel.identify).not.toHaveBeenCalled();
    });
  });

  describe("setEventsGlobalData", () => {
    const globalProps: object = { key: "USER_ID" };
    it("should call the register function with passed params", function () {
      // @ts-ignore
      getEnv.mockImplementation(() => "production");
      const { result } = renderHook(() => useAnalytics());
      expect(mixpanel.register).not.toHaveBeenCalled();

      result.current.setEventsGlobalData(globalProps);
      expect(mixpanel.register).toHaveBeenCalledWith(globalProps);
    });

    it("should not call identify if development environment", function () {
      // @ts-ignore
      getEnv.mockImplementation(() => "development");
      const { result } = renderHook(() => useAnalytics());

      result.current.setEventsGlobalData(globalProps);
      expect(mixpanel.register).not.toHaveBeenCalled();
    });
  });
});
