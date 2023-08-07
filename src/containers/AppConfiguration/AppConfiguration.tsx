import React, { useRef } from "react";
import Icon from "../../assets/GearSix.svg";
import localeTexts from "../../common/locales/en-us/index";
import parse from "html-react-parser";
import styles from "./AppConfiguration.module.css";
import { useInstallationData } from "../../common/hooks/useInstallationData";
import Tooltip from "../Tooltip/Tooltip";

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
                  <label htmlFor="appConfigData">Sample App Configuration </label>
                  {/* <img src={HelpIcon} alt="info-icon" /> */}
                  <Tooltip content="Use this field to store sensitive configurations of your app. It is directly shared withe the backend." />
                </div>
                <p>(required)</p>
              </div>
              <div className={`${styles.inputContainer}`}>
                <input
                  type="text"
                  ref={appConfigDataRef}
                  required
                  value={installationData.configuration.appConfigData}
                  placeholder="Enter Field Value"
                  name="appConfigData"
                  autoComplete="off"
                  className={`${styles.fieldInput}`}
                  onChange={updateConfig}></input>
              </div>
            </div>
            <div className={`${styles.descriptionContainer}`}>
              <p>
                Use this field to share non-sensitive configurations of your app with other locations.
                <span> Learn More</span>
              </p>
            </div>
          </div>

          <div className={`${styles.configContainer}`}>
            <div className={`${styles.infoContainerWrapper}`}>
              <div className={`${styles.infoContainer}`}>
                <div className={`${styles.labelWrapper}`}>
                  <label htmlFor="serverConfigData">Sample Server Configuration </label>
                  {/* <img src={HelpIcon} alt="info-icon" /> */}
                  <Tooltip content="Use this field to share sensitive configurations of your app with other locations." />
                </div>
                <p>(required)</p>
              </div>
              <div className={`${styles.inputContainer}`}>
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
            <div className={`${styles.descriptionContainer}`}>
              <p>
                Use this field to store sensitive configurations of your app. It is directly shared withe the backend
                via webhooks. <span> Learn More</span>
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
