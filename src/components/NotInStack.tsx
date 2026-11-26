import manifest from "../../manifest.json";
import { appLocations, isLocalDev, locationForPath, uiHost } from "../common/utils/host";
import { buildJourney, JourneyManifest, StepStatus } from "../common/utils/journey";
import { AppFailed } from "./AppFailed";

const STATUS_LABEL: Record<StepStatus, string> = { done: "Done", next: "Next", todo: "To do", optional: "If needed", later: "Later" };

/**
 * Rendered when the app is opened in its own tab instead of inside Contentstack.
 * Local development gets a map of where the app stands on the way to running in Contentstack;
 * a deployed URL gets a short message for the person who opened it.
 */
export const NotInStack = () => {
  if (!isLocalDev()) return <AppFailed reason="not-in-stack" />;

  const { pathname, origin } = window.location;
  const location = locationForPath(pathname);
  const steps = buildJourney(manifest as JourneyManifest, origin, location);
  const next = steps.find((step) => step.status === "next");
  const done = steps.filter((step) => step.status === "done").length;

  return (
    <main className="not-in-stack">
      <span className="nis-badge">
        Local development · step {done + 1} of {steps.length}
      </span>
      <h1>Your app runs inside Contentstack, and it is not there yet</h1>
      <p>
        A Contentstack app is a set of pages and services that Contentstack loads, in a frame, once the app is registered and installed. This tab is
        your app on its own, so there is nothing to show here yet. {next && <strong>Next step: {next.title}.</strong>}
      </p>

      <ol className="nis-journey">
        {steps.map((step) => (
          <li key={step.id} className={`nis-step is-${step.status}`} aria-current={step === next ? "step" : undefined}>
            <span className="nis-status">{STATUS_LABEL[step.status]}</span>
            <div>
              <h2>{step.title}</h2>
              <p>{step.detail}</p>
              {step.command && (
                <pre>
                  <code>{step.command}</code>
                </pre>
              )}
              {step.id === "register" && step.status === "next" && (
                <p>
                  <a href={`${uiHost}/#!/developerhub/`} target="_blank" rel="noreferrer">
                    Open Developer Hub
                  </a>
                </p>
              )}
              {step.parts && (
                <ul className="nis-parts">
                  {step.parts.map((part) => (
                    <li key={part.name} className={`is-${part.status}`}>
                      <span className="nis-status">{STATUS_LABEL[part.status]}</span> <strong>{part.name}</strong>: {part.detail}
                    </li>
                  ))}
                </ul>
              )}
              {step.id === "see" && !location && appLocations.length > 0 && (
                <div className="nis-table-wrap">
                  <table className="nis-table">
                    <thead>
                      <tr>
                        <th scope="col">Location</th>
                        <th scope="col">Route</th>
                        <th scope="col">Where it appears in Contentstack</th>
                      </tr>
                    </thead>
                    <tbody>
                      {appLocations.map((item) => (
                        <tr key={`${item.type}${item.path}`}>
                          <td>
                            <a href={item.docs} target="_blank" rel="noreferrer">
                              {item.name}
                            </a>
                          </td>
                          <td>
                            <a href={item.path}>
                              <code>{item.path}</code>
                            </a>
                          </td>
                          <td>{item.where}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {step.id === "see" && location && (
                <p>
                  <a href={location.docs} target="_blank" rel="noreferrer">
                    Docs for the {location.name} location
                  </a>{" "}
                  · <a href="/">All locations</a>
                </p>
              )}
            </div>
          </li>
        ))}
      </ol>

      <p className="nis-foot">
        Seeing this inside Contentstack instead? Then something failed while loading, and the app shows its own message and code there.
      </p>
    </main>
  );
};
