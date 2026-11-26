// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";

// Tests stand in for Contentstack, so the page counts as opened by the host, not in its own tab.
// Tests of the own-tab case set window.opener to null themselves.
Object.defineProperty(window, "opener", { value: {}, writable: true, configurable: true });
