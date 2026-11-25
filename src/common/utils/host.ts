// Named import: only the locations ship in the bundle, not app or organization ids.
import { ui_location } from "../../../manifest.json";

export type FailureReason = "not-in-stack" | "host-no-answer" | "app-token" | "init-failed";

// The UI host of your region; the same variable the app-token check uses.
export const uiHost = import.meta.env.VITE_PUBLIC_KEY_BASE_URL || "https://app.contentstack.com";

/**
 * True when the page was opened in its own tab. The App SDK talks to Contentstack through
 * window.parent (or window.opener), so with neither it can never start.
 */
export const isOutsideContentstack = (): boolean => window.self === window.top && !window.opener;

export const isLocalDev = (): boolean => ["localhost", "127.0.0.1", "[::1]"].includes(window.location.hostname);

// post-robot rejects with "No ack for postMessage init ..." when a frame never answers.
export const reasonFromInitError = (error: unknown): FailureReason =>
  /no ack for postmessage/i.test(error instanceof Error ? error.message : String(error)) ? "host-no-answer" : "init-failed";

type LocationInfo = { name: string; where: string; docs: string };

const DOCS = "https://www.contentstack.com/docs/developers/developer-hub/";

// Where each manifest location type appears for the person using the stack.
const LOCATION_INFO: Record<string, LocationInfo> = {
  "cs.cm.stack.custom_field": {
    name: "Custom Field",
    where: "In the entry editor. Add the app's field to a content type first, then open an entry of that type.",
    docs: `${DOCS}custom-field-location/`,
  },
  "cs.cm.stack.dashboard": {
    name: "Stack Dashboard",
    where: "On the stack's Dashboard, as a widget.",
    docs: `${DOCS}dashboard-location/`,
  },
  "cs.cm.stack.asset_sidebar": {
    name: "Asset Sidebar",
    where: "In the asset editor: open any asset, then the app's icon in the right sidebar.",
    docs: `${DOCS}asset-sidebar-location/`,
  },
  "cs.cm.stack.content_type_sidebar": {
    name: "Content Type Sidebar",
    where: "In the content type builder, in the right sidebar.",
    docs: `${DOCS}content-type-sidebar-location`,
  },
  "cs.cm.stack.sidebar": {
    name: "Entry Sidebar",
    where: "In the entry editor: open any entry, then the app's icon in the right sidebar.",
    docs: `${DOCS}sidebar-location/`,
  },
  "cs.cm.stack.full_page": {
    name: "Full Page",
    where: "In the stack's left navigation, under the app's name.",
    docs: `${DOCS}full-page-location/`,
  },
  "cs.cm.stack.field_modifier": {
    name: "Field Modifier",
    where: "In the entry editor, on the fields the location is enabled for.",
    docs: `${DOCS}field-modifier-location/`,
  },
  "cs.cm.stack.config": {
    name: "App Configuration",
    where: "In Marketplace: Installed Apps, open the app, then Configuration.",
    docs: `${DOCS}app-config-location/`,
  },
  "cs.cm.stack.rte": {
    name: "JSON RTE Plugin",
    where: "In the JSON Rich Text Editor toolbar. This path is a script the editor loads, not a page.",
    docs: `${DOCS}about-ui-locations/`,
  },
  "cs.org.global_full_page": {
    name: "Global Full Page",
    where: "At organization level, outside any stack, from the app's entry in Contentstack.",
    docs: `${DOCS}global-full-page/`,
  },
};

export type AppLocation = LocationInfo & { type: string; path: string };

type ManifestLocation = { type: string; meta: { path: string }[] };

/** Every UI location in manifest.json, so the guide stays in step with the manifest. */
export const appLocations: AppLocation[] = (ui_location.locations as ManifestLocation[]).flatMap((location) =>
  location.meta.map((meta) => ({
    type: location.type,
    path: meta.path,
    ...(LOCATION_INFO[location.type] ?? { name: location.type, where: "", docs: `${DOCS}about-ui-locations/` }),
  }))
);

export const locationForPath = (pathname: string): AppLocation | undefined =>
  appLocations.find((location) => location.path === pathname);
