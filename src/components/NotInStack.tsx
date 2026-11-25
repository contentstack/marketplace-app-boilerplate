import localeTexts from "../common/locales/en-us";
import { appLocations, isLocalDev, locationForPath, uiHost } from "../common/utils/host";
import { AppFailed } from "./AppFailed";

const text = localeTexts.NotInStack;

/**
 * Rendered when the app is opened in its own tab instead of inside Contentstack.
 * Local development gets a guide (or, on "/", a list of every location);
 * a deployed URL gets a short message for the person who opened it.
 */
export const NotInStack = () => {
  if (!isLocalDev()) return <AppFailed reason="not-in-stack" />;

  const { pathname, origin } = window.location;
  const location = locationForPath(pathname);

  if (pathname === "/" || !location) {
    return (
      <main className="not-in-stack">
        <span className="nis-badge">{text.badge}</span>
        <h1>{text.launchpadTitle}</h1>
        <p>{text.launchpadIntro}</p>
        <table className="nis-table">
          <thead>
            <tr>
              <th scope="col">{text.colLocation}</th>
              <th scope="col">{text.colRoute}</th>
              <th scope="col">{text.colWhere}</th>
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
        <Steps origin={origin} />
      </main>
    );
  }

  return (
    <main className="not-in-stack">
      <span className="nis-badge">{text.badge}</span>
      <h1>
        {location.name} {text.titleSuffix}
      </h1>
      <p>{text.why}</p>
      <Steps origin={origin} path={location.path} where={location.where} />
      <h2>{text.whenTitle}</h2>
      <p>{text.when}</p>
      <p className="nis-links">
        <a href="/">{text.allRoutes}</a> ·{" "}
        <a href={location.docs} target="_blank" rel="noreferrer">
          {text.locationDocs}
        </a>
      </p>
    </main>
  );
};

const Steps = ({ origin, path, where }: { origin: string; path?: string; where?: string }) => (
  <>
    <h2>{text.stepsTitle}</h2>
    <ol className="nis-steps">
      <li>
        <strong>{text.step1Title}</strong>
        <p>
          {text.step1Body} <code>{origin}</code>{" "}
          <a href={`${uiHost}/#!/developerhub`} target="_blank" rel="noreferrer">
            {text.devHub}
          </a>
        </p>
      </li>
      <li>
        <strong>{text.step2Title}</strong>
        <p>{text.step2Body}</p>
        <pre>
          <code>npm run dev:stack -- --stack &lt;stack_api_key&gt;</code>
        </pre>
        <p>
          {text.step2Alt} {path && <code>{path}</code>}
        </p>
      </li>
      <li>
        <strong>{text.step3Title}</strong>
        <p>{where ?? text.step3All}</p>
      </li>
    </ol>
  </>
);
