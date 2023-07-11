import { useEffect } from "react";
import Icon from "../../assets/Icon.svg";
import localeTexts from "../../common/locales/en-us/index";
import parse from "html-react-parser";
import { useAppConfig } from "../../common/hooks/useAppConfig";

const StackDashboardExtension = () => {
  const appConfig = useAppConfig();
  console.log("appConfig", appConfig);

  useEffect(() => {
    console.log("appConfig:", appConfig);
  }, [appConfig]);

  const name = appConfig?.username || "";

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        <div className="dashboard-icon">
          <img src={Icon} alt="icon" />
        </div>
        <div className="app-component-content">
          <h4>{localeTexts.DashboardWidget.title}</h4>
          <p className="configValues">
            <b>Username: </b>
            {name}
          </p>
          <p>{parse(localeTexts.DashboardWidget.body)}</p>
          <a target="_blank" rel="noreferrer" href={localeTexts.DashboardWidget.button.url}>
            {localeTexts.DashboardWidget.button.text}
          </a>
        </div>
      </div>
    </div>
  );
};

export default StackDashboardExtension;
