const localeTexts = {
  404: {
    title: "404: Not Found",
    body: "The link you tried to access doesn't seem to exist. <br />Please verify and enter the correct URL.",
    button: {
      text: "Learn More",
      url: "https://www.contentstack.com/docs/developers/developer-hub/about-ui-locations/",
    },
  },
  AssetSidebarWidget: {
    title: "Asset Sidebar Widget",
    body: "This is the iframe that contains your Asset Sidebar Widget.",
    button: {
      text: "Learn More",
      url: "https://www.contentstack.com/docs/developers/developer-hub/asset-sidebar-location/",
    },
  },
  ConfigScreen: {
    title: "App Configuration",
    body: "This is the location that contains your app configuration.",
    button: {
      text: "Learn More",
      url: "https://www.contentstack.com/docs/developers/developer-hub/app-config-location/",
    },
  },
  CustomField: {
    title: "Custom Field",
    body: "This is the iframe that contains your Custom Field.",
    button: {
      text: "Learn More",
      url: "https://www.contentstack.com/docs/developers/developer-hub/custom-field-location/",
    },
  },
  DashboardWidget: {
    title: "Dashboard Widget",
    body: "This is the location that contains your Dashboard Widget.",
    button: {
      text: "Learn More",
      url: "https://www.contentstack.com/docs/developers/developer-hub/dashboard-location/",
    },
  },
  SidebarWidget: {
    title: "Sidebar Widget",
    body: "This is the iframe that contains your Sidebar Widget.",
    button: {
      text: "Learn More",
      url: "https://www.contentstack.com/docs/developers/developer-hub/sidebar-location/",
    },
  },
  ContentTypeSidebarWidget: {
    title: "Content Type Sidebar Widget",
    body: "This is the iframe that contains your Content Type Sidebar Widget.",
    button: {
      text: "Learn More",
      url: "https://www.contentstack.com/docs/developers/developer-hub/content-type-sidebar-location",
    },
  },
  FullPage: {
    title: "Full Page App",
    body: "This is the location that contains your Full Page App.",
    button: {
      text: "Learn More",
      url: "https://www.contentstack.com/docs/developers/developer-hub/full-page-location/",
    },
  },
  GlobalFullPage: {
    title: "Global Full Page App",
    body: "This is the location that contains your Global Full Page App.",
    button: {
      text: "Learn More",
      url: "https://www.contentstack.com/docs/developers/developer-hub/global-full-page/",
    },
  },
  FieldModifier: {
    title: "Field Modifier App",
    body: "This is the location that contains your Field Modifier app.",
    button: {
      text: "Learn More",
      url: "https://www.contentstack.com/docs/developers/developer-hub/field-modifier-location/",
    },
  },
  // One entry per reason the app cannot start; `code` is shown on screen so docs and support can key on it.
  AppFailed: {
    docsUrl: "https://www.contentstack.com/docs/developers/developer-hub/marketplace-app-boilerplate/",
    docsText: "Read the docs",
    "not-in-stack": {
      code: "NOT_IN_STACK",
      title: "Open this app from Contentstack",
      body: "This page is part of a Contentstack app and only works inside a stack. Go to your stack and open the app from the place it was installed.",
    },
    "host-no-answer": {
      code: "HOST_NO_ANSWER",
      title: "Contentstack did not answer the app",
      body: "The app is inside a frame, but the page around it did not reply within 10 seconds. Reload the page. If it keeps happening, make sure you opened it from Contentstack, and that your browser is not blocking a localhost frame (Chrome: Private Network Access).",
    },
    "app-token": {
      code: "APP_TOKEN_INVALID",
      title: "This location could not be verified",
      body: "This is a signed location and its app-token was missing or not valid, so the app did not load. Reload the page. If it keeps happening, check the app's signing settings in Developer Hub and VITE_PUBLIC_KEY_BASE_URL for your region.",
    },
    "init-failed": {
      code: "SDK_INIT_FAILED",
      title: "The app could not start",
      body: "The App SDK failed to start inside Contentstack. Reload the page; the browser console has the reason.",
    },
  },
};

export default localeTexts;
