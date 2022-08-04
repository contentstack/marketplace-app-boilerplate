import React from "react";
import { TrackJS } from "trackjs";

const ENV: string = process.env.NODE_ENV;

/**
 * Initialize TrackJS
 */
TrackJS.install({
  token: `${process.env.REACT_APP_TRACKER_TOKEN}`,
  application: process.env.REACT_APP_TRACKER_ENV,
  console: { display: ENV === "development" }, // show console.log in development
});

/**
 * Global Error Boundary component
 * Errors are logged on to TrackJS service
 */
export class ErrorBoundary extends React.Component {
  state: { hasError: boolean };

  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    // You can also log the error to an error reporting service
    if (ENV === "development") {
      console.error(error);
    }
    TrackJS.track(error);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>;
    }

    // @ts-ignore
    return this.props.children;
  }
}
