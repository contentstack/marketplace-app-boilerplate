import React, { useState, useEffect, useRef } from "react";
import ContentstackAppSdk from "@contentstack/app-sdk";
import { IInstallationData } from "@contentstack/app-sdk/dist/src/types";
import Icon from "../../assets/appconfig.svg";
import localeTexts from "../../common/locales/en-us/index";
import parse from "html-react-parser";
import "../../index.css";
import { useInstallationData } from "../../common/hooks/useInstallationData";


const AppConfigurationExtension: React.FC = () => {
  const { installationData, setInstallationData } = useInstallationData();

  const usernameRef = useRef<any>("");
  const secretRef = useRef<any>("");

  const updateConfig = async (elem: any) => {

    if (typeof setInstallationData !== "undefined") {
      await setInstallationData({
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
            {installationData && (
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
                          value={installationData.configuration.username}
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
                          value={installationData.serverConfiguration.secret}
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
