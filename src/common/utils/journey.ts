import { AppLocation } from "./host";

export type StepStatus = "done" | "next" | "todo" | "optional" | "later";

export type JourneyStep = {
  id: "run" | "register" | "configure" | "install" | "see" | "ship";
  title: string;
  status: StepStatus;
  detail: string;
  // A command to copy, when one does the step.
  command?: string;
  // Capabilities the app declares (UI locations, webhook, OAuth), shown under "configure".
  parts?: { name: string; status: StepStatus; detail: string }[];
};

// The parts of manifest.json the journey reads; Developer Hub adds webhook and oauth when they are set up.
export type JourneyManifest = {
  uid?: string;
  organization_uid?: string;
  target_type?: string;
  ui_location?: { base_url?: string; locations?: { type: string; meta: { path: string }[] }[] };
  webhook?: { enabled?: boolean; target_url?: string };
  oauth?: { enabled?: boolean; scopes?: string[] };
};

const isLocalUrl = (url = "") => /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?\b/.test(url);

/**
 * Where a developer stands, worked out from manifest.json and the page they opened.
 * Install and "see it work" cannot be known from a tab outside Contentstack, so they stay open
 * until the app is registered, then become the next step.
 */
export const buildJourney = (manifest: JourneyManifest, origin: string, location?: AppLocation): JourneyStep[] => {
  const registered = Boolean(manifest.uid && manifest.organization_uid);
  const org = manifest.target_type === "organization";
  const locations = manifest.ui_location?.locations?.flatMap((l) => l.meta) ?? [];
  const baseUrl = manifest.ui_location?.base_url ?? "";
  const webhook = manifest.webhook;
  const oauth = manifest.oauth;

  const parts: NonNullable<JourneyStep["parts"]> = [
    locations.length
      ? {
          name: `UI locations (${locations.length})`,
          status: baseUrl === origin ? "done" : "next",
          detail:
            baseUrl === origin
              ? `Pages Contentstack loads from ${baseUrl}.`
              : `manifest.json loads them from ${baseUrl || "nowhere yet"}, but this dev server is ${origin}. Set ui_location.base_url to ${origin}.`,
        }
      : { name: "UI locations", status: "optional", detail: "None. Add one if your app shows anything inside Contentstack." },
    webhook?.enabled
      ? {
          name: "Webhook",
          status: isLocalUrl(webhook.target_url) ? "next" : "done",
          detail: isLocalUrl(webhook.target_url)
            ? "Contentstack cannot reach localhost. Expose your backend with a tunnel or deploy it, then use that URL."
            : `Install, update and uninstall events go to ${webhook.target_url}.`,
        }
      : {
          name: "Webhook",
          status: "optional",
          detail: "Only if a backend must react when the app is installed, updated or uninstalled. The URL must be public; localhost does not work.",
        },
    oauth?.enabled
      ? { name: "OAuth", status: "done", detail: `Asks for ${oauth.scopes?.length ?? 0} scopes; people approve them when they install.` }
      : {
          name: "OAuth",
          status: "optional",
          detail: "Only if the app calls Contentstack APIs as itself or as the user. Set scopes and a redirect URL in Developer Hub.",
        },
  ];

  const where = org ? "your organization" : "a stack";
  const seeDetail = location
    ? `This page is the ${location.name} location. ${location.where}`
    : locations.length
      ? "Open each location from the place listed for it in Contentstack."
      : "Check your backend's log for the install event, or call the API with the app's token.";

  return [
    { id: "run", title: "Build and run it locally", status: "done", detail: `Running at ${origin}. You are here.` },
    registered
      ? { id: "register", title: "Register the app", status: "done", detail: `Registered in Developer Hub as ${manifest.uid}.` }
      : {
          id: "register",
          title: "Register the app",
          status: "next",
          detail: "Contentstack does not know this app yet. Create it in Developer Hub, or let the CLI do it and write its uid into manifest.json.",
          command: "csdx app:create",
        },
    {
      id: "configure",
      title: "Tell Contentstack what the app does",
      // Only a part that needs fixing makes this the next step; what is declared and fine is done.
      status: parts.some((part) => part.status === "next") ? "next" : registered ? "done" : "todo",
      detail: "Declared in manifest.json; npm run dev:stack pushes it to Developer Hub.",
      parts,
    },
    {
      id: "install",
      title: `Install it in ${where}`,
      status: registered ? "next" : "todo",
      detail: "This tab cannot see installs. The command pushes manifest.json and installs in one go.",
      command: org ? undefined : "npm run dev:stack -- --stack <stack_api_key>",
    },
    { id: "see", title: "See it work in Contentstack", status: "todo", detail: seeDetail },
    { id: "ship", title: "Ship it", status: "later", detail: "Deploy the app (Launch or your own hosting), switch the base URL to it, then publish." },
  ];
};
