import React, { useRef } from "react";
import Icon from "../../assets/GearSix.svg";
import localeTexts from "../../common/locales/en-us/index";
import parse from "html-react-parser";
import styles from "./AppConfiguration.module.css";
import { useInstallationData } from "../../common/hooks/useInstallationData";
import Tooltip from "../Tooltip/Tooltip";

const AppConfigurationExtension: React.FC = () => {
  const { installationData, setInstallationData } = useInstallationData();
  const appConfigDataRef = useRef<HTMLInputElement>(null);
  const serverConfigDataRef = useRef<HTMLInputElement>(null);

  const updateConfig = async () => {
    if (typeof setInstallationData !== "undefined") {
      setInstallationData({
        configuration: { sample_app_configuration: appConfigDataRef.current?.value },
        serverConfiguration: { sampl_server_configuration: serverConfigDataRef.current?.value },
      });
    }
  };

  return (
    <div className={`${styles.layoutContainer}`}>
      <div className={`${styles.appConfig}`}>
        <div className={`${styles.appConfigLogoContainer}`}>
          <img src={Icon} alt="icon" />
          <p>{localeTexts.ConfigScreen.title}</p>
        </div>

        <div className={`${styles.configWrapper}`}>
          <div className={`${styles.configContainer}`}>
            <div className={`${styles.infoContainerWrapper}`}>
              <div className={`${styles.infoContainer}`}>
                <div className={`${styles.labelWrapper}`}>
                  <label htmlFor="appConfigData">Sample App Configuration</label>
                  <Tooltip content="You can save this field for information such as Username, Email, Number, Date, etc." />
                </div>
              </div>
              <div className={`${styles.inputContainer}`}>
                <input
                  type="text"
                  ref={appConfigDataRef}
                  required
                  value={installationData.configuration.sample_app_configuration as string}
                  placeholder="Enter Field Value"
                  name="appConfigData"
                  autoComplete="off"
                  className={`${styles.fieldInput}`}
                  onChange={updateConfig} />
              </div>
            </div>
            <div className={`${styles.descriptionContainer}`}>
              <p>Use this field to share non-sensitive configurations of your app with other locations.</p>
            </div>
          </div>

          <div className={`${styles.configContainer}`}>
            <div className={`${styles.infoContainerWrapper}`}>
              <div className={`${styles.infoContainer}`}>
                <div className={`${styles.labelWrapper}`}>
                  <label htmlFor="serverConfigData">Sample Server Configuration Field </label>
                  <Tooltip content="You can use this field for information such as Passwords, API Key, Client Secret, Client ID, etc." />
                </div>
              </div>
              <div className={`${styles.inputContainer}`}>
                <input
                  type="text"
                  ref={serverConfigDataRef}
                  required
                  value={installationData.serverConfiguration.sample_app_configuration as string}
                  placeholder="Enter Field Value"
                  name="serverConfigData"
                  autoComplete="off"
                  onChange={updateConfig} />
              </div>
            </div>
            <div className={`${styles.descriptionContainer}`}>
              <p>
                Use this field to store sensitive configurations of your app. It is directly shared with the backend via
                webhooks.
              </p>
            </div>
          </div>
        </div>

        <div className={`${styles.locationDescription}`}>
          <p className={`${styles.locationDescriptionText}`}>{parse(localeTexts.ConfigScreen.body)}</p>
          <a target="_blank" rel="noreferrer" href={localeTexts.ConfigScreen.button.url}>
            <span className={`${styles.locationDescriptionLink}`}>{localeTexts.ConfigScreen.button.text}</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default AppConfigurationExtension;
