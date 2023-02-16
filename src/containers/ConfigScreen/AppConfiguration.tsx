import Icon from "../../assets/appconfig.svg";
import localeTexts from "../../common/locales/en-us/index";
import parse from "html-react-parser";

const AppConfigurationExtension = () => {
  return (
    <div className="app-config">
      <div className="app-config-container">
        <div className="app-config-icon">
          <img src={Icon} alt="icon" />
        </div>
        <div className="app-component-content">
          <h4>{localeTexts.ConfigScreen.title}</h4>
          <p>{parse(localeTexts.ConfigScreen.body)}</p>
          <a
            target="_blank"
            rel="noreferrer"
            href="https://www.contentstack.com/docs/developers/developer-hub/app-config-location/">
            {localeTexts.ConfigScreen.button.learnMore}
          </a>
        </div>
      </div>
    </div>
  );
};

export default AppConfigurationExtension;
