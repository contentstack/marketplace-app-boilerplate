import React, { useState, useEffect } from "react";
import ContentstackAppSdk from "@contentstack/app-sdk";
import { IInstallationData } from "@contentstack/app-sdk/dist/src/types";
import Icon from "../../assets/appconfig.svg";
import localeTexts from "../../common/locales/en-us/index";
import parse from "html-react-parser";
import { merge } from "../../common/utils/functions";
import "../../index.css";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";

interface AppState {
  installationData: IInstallationData;
  setInstallationData: (event: any) => any;
  appSdkInitialized: boolean;
}

const AppConfigurationExtension: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [config, setConfig] = useState<AppState>({
    installationData: {
      configuration: {
        username: "",
      },
      serverConfiguration: {
        email: "",
      },
    },
    setInstallationData: (event): any => {
      return;
    },
    appSdkInitialized: false,
  });
  const [loader, setLoader] = useState<boolean>();

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

      setLoader(true);
      setTimeout(() => {
        setLoader(false);
      }, 2000);
    });
  }, []);

  const updateConfig = async (elem: any) => {
    if (elem.target.name === "username") {
      setUsername(elem.target.value);
    } else if (elem.target.name === "email") {
      setEmail(elem.target.value);
    }

    const updatedConfig = { ...config.installationData.configuration, username };
    const updatedServerConfig = { ...config.installationData.serverConfiguration, email };

    if (typeof config.setInstallationData !== "undefined") {
      await config.setInstallationData({
        ...config.installationData,
        configuration: updatedConfig,
        serverConfiguration: updatedServerConfig,
      });
    }
  };

  console.log("config", config);

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
                  {!loader ? (
                    <>
                      <div className="field">
                        <label htmlFor="username" className="field-label">
                          {"User Name"}
                        </label>
                        <input
                          required
                          value={username}
                          placeholder="Enter User Name"
                          name="username"
                          autoComplete="off"
                          className="field-input"
                          onChange={updateConfig}></input>
                      </div>
                      <div className="field">
                        <label htmlFor="email" className="field-label">
                          {"Email"}
                        </label>
                        <input
                          required
                          value={email}
                          placeholder="Enter Email ID"
                          name="email"
                          autoComplete="off"
                          className="field-input"
                          onChange={updateConfig}></input>
                      </div>
                    </>
                  ) : (
                    <div className="skeleton-field">
                      <LoadingSpinner />
                    </div>
                  )}
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
