import localeTexts from "../common/locales/en-us";
import { FailureReason } from "../common/utils/host";

/**
 * Shown when the app cannot start. Each reason has its own message and a code
 * that docs and support can key on; details stay in the browser console.
 */
export const AppFailed = ({ reason }: { reason: FailureReason }) => {
  const text = localeTexts.AppFailed[reason];
  return (
    <div className="app-failed-container">
      <div className="app-component-container" role="alert">
        <div className="app-content">
          <svg className="app-icon" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"></path>
          </svg>
          <h3>{text.title}</h3>
        </div>
        <p className="app-text">{text.body}</p>
        <p className="app-text">
          Code: <code>{text.code}</code> ·{" "}
          <a href={localeTexts.AppFailed.docsUrl} target="_blank" rel="noreferrer">
            {localeTexts.AppFailed.docsText}
          </a>
        </p>
      </div>
    </div>
  );
};
