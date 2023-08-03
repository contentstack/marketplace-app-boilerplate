import React, { useRef } from "react";
import Icon from "../../assets/GearSix.svg";
import HelpIcon from "../../assets/help_icon.svg";
import localeTexts from "../../common/locales/en-us/index";
import parse from "html-react-parser";
import "../../index.css";
import "./AppConfiguration.css";
import { useInstallationData } from "../../common/hooks/useInstallationData";

const AppConfigurationExtension: React.FC = () => {
  const { installationData, setInstallationData } = useInstallationData();

  const appConfigDataRef = useRef<any>("");
  const serverConfigDataRef = useRef<any>("");

  const updateConfig = async (elem: any) => {
    if (typeof setInstallationData !== "undefined") {
      await setInstallationData({
        configuration: { appConfigData: appConfigDataRef.current.value },
        serverConfiguration: { serverConfigData: serverConfigDataRef.current.value },
      });
    }
  };

  return (
    <div className="layout-container">
      <div className="app-config">
        <div className="app-config-logo-container">
          <img src={Icon} alt="icon" />
          <p>{localeTexts.ConfigScreen.title}</p>
        </div>

        <div className="config-wrapper">
          <div className="config-container">
            <div className="info-container-wrapper">
              <div className="info-container">
                <div className="label-wrapper">
                  <label htmlFor="appConfigData">Sample App Configuration </label>
                  <img src={HelpIcon} alt="info-icon" />
                </div>
                <p>(required)</p>
              </div>
              <div className="input-container">
                <input
                  type="text"
                  ref={appConfigDataRef}
                  required
                  value={installationData.configuration.appConfigData}
                  placeholder="Enter Field Value"
                  name="appConfigData"
                  autoComplete="off"
                  className="field-input"
                  onChange={updateConfig}></input>
              </div>
            </div>
            <div className="description-container">
              <p>
                Use this field to share non-sensitive configurations of your app with other locations.
                <span> Learn More</span>
              </p>
            </div>
          </div>

          <div className="config-container">
            <div className="info-container-wrapper">
              <div className="info-container">
                <div className="label-wrapper">
                  <label htmlFor="serverConfigData">Sample Server Configuration </label>
                  <img src={HelpIcon} alt="info-icon" />
                </div>
                <p>(required)</p>
              </div>
              <div className="input-container">
                <input
                  type="text"
                  ref={serverConfigDataRef}
                  required
                  value={installationData.serverConfiguration.serverConfigData}
                  placeholder="Enter Field Value"
                  name="serverConfigData"
                  autoComplete="off"
                  onChange={updateConfig}></input>
              </div>
            </div>
            <div className="description-container">
              <p>
                Use this field to store sensitive configurations of your app. It is directly shared withe the backend
                via webhooks. <span> Learn More</span>
              </p>
            </div>
          </div>
        </div>

        <div className="location-description">
          <p className="location-description-text">{parse(localeTexts.ConfigScreen.body)}</p>
          <a target="_blank" rel="noreferrer" href={localeTexts.ConfigScreen.button.url}>
            <span className="location-description-link">{localeTexts.ConfigScreen.button.text}</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default AppConfigurationExtension;
