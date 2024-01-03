import React from "react";
import localeTexts from "../../common/locales/en-us/index";
import parse from "html-react-parser";

const PageNotFound = () => {
  return (
    <div className="dashboard">
      <div className="dashboard-container">
        <div className="app-component-content">
          <h3>{localeTexts[404].title}</h3>
          <p>{parse(localeTexts[404].body)}</p>
          <a
            target="_blank"
            rel="noreferrer"
            href={localeTexts[404].button.url}>
            {localeTexts[404].button.text}
          </a>
        </div>
      </div>
    </div>
  );
};

export default PageNotFound;
