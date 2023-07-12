import React, { useState, useEffect, useRef } from "react";
import ContentstackAppSdk from "@contentstack/app-sdk";
import { IInstallationData } from "@contentstack/app-sdk/dist/src/types";
import Icon from "../../assets/appconfig.svg";
import localeTexts from "../../common/locales/en-us/index";
import parse from "html-react-parser";
import { merge } from "../../common/utils/functions";
import "../../index.css";

interface AppState {
  installationData: IInstallationData;
  setInstallationData: (event: any) => any;
  appSdkInitialized: boolean;
}

const AppConfigurationExtension: React.FC = () => {
  const usernameRef = useRef<any>("");
  const secretRef = useRef<any>("");
  const [config, setConfig] = useState<AppState>({
    installationData: {
      configuration: {
        username: usernameRef,
      },
      serverConfiguration: {
        secret: secretRef,
      },
    },
    setInstallationData: (event): any => {
      return;
    },
    appSdkInitialized: false,
  });

  useEffect(() => {
    ContentstackAppSdk.init().then(async (appSdk) => {
      const location: any = appSdk.location?.AppConfigWidget;
      const installation = location.installation;
      const installationData = await installation.getInstallationData();

      setConfig({
        ...config,
        installationData: merge(config.installationData, installationData),
        setInstallationData: installation.setInstallationData,
        appSdkInitialized: true,
      });
    });
  }, []);

  const updateConfig = async (elem: any) => {
    if (typeof config.setInstallationData !== "undefined") {
      await config.setInstallationData({
        ...config.installationData,
        configuration: { username: usernameRef.current.value },
        serverConfiguration: { secret: secretRef.current.value },
      });
    }
  };

  return (
    <div className="layout-container">
      <div className="app-config">
        <div className="app-config-container">
          <div className="app-config-icon">
            <img src={Icon} alt="icon" />
          </div>
          <div className="app-component-content">
            <h4>{localeTexts.ConfigScreen.title}</h4>
            {config.appSdkInitialized && (
              <div className="config-wrapper">
                <form>
                  {
                    <>
                      <div className="field">
                        <label htmlFor="username" className="field-label">
                          {"User Name"}
                        </label>
                        <input
                          ref={usernameRef}
                          required
                          value={usernameRef.current.value}
                          placeholder="Enter User Name"
                          name="username"
                          autoComplete="off"
                          className="field-input"
                          onChange={updateConfig}></input>
                      </div>
                      <div className="field">
                        <label htmlFor="secret" className="field-label">
                          {"Secret"}
                        </label>
                        <input
                          ref={secretRef}
                          required
                          value={secretRef.current.value}
                          placeholder="Enter Secret ID"
                          name="secret"
                          autoComplete="off"
                          className="field-input"
                          onChange={updateConfig}></input>
                      </div>
                    </>
                  }
                </form>
              </div>
            )}
            <p>{parse(localeTexts.ConfigScreen.body)}</p>

            <a target="_blank" rel="noreferrer" href={localeTexts.ConfigScreen.button.url}>
              {localeTexts.ConfigScreen.button.text}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppConfigurationExtension;
