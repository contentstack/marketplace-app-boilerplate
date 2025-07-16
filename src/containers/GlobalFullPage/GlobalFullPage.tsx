import React, { useCallback, useState } from "react";
import localeTexts from "../../common/locales/en-us/index";
import parse from "html-react-parser";
import { useAppConfig } from "../../common/hooks/useAppConfig";
import Icon from "../../assets/Full-Page-Logo.svg";
import ReadOnly from "../../assets/lock.svg";
import JsonView from "../../assets/JsonView.svg";
import ConfigModal from "../../components/ConfigModal/ConfigModal";

import "../index.css";
import "./GlobalFullPage.css";

const GlobalFullPageExtension = () => {
  const appConfig = useAppConfig();
  const [isRawConfigModalOpen, setRawConfigModalOpen] = useState<boolean>(false);

  const handleViewRawConfig = useCallback(() => {
    setRawConfigModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setRawConfigModalOpen(false);
  }, []);

  const sampleAppConfig = appConfig?.["sample_app_configuration"] || "";
  const trimmedSampleAppConfig =
    sampleAppConfig.length > 19 ? `${sampleAppConfig.substring(0, 19)}...` : sampleAppConfig;

  return (
    <div className="layout-container">
      <div className="ui-location">
        <div className="ui-container">
          <div className="logo-container">
            <img src={Icon} alt="Logo" />
            <p>{localeTexts.GlobalFullPage.title}</p>
          </div>
          <div className="config-container">
            <div className="label-container">
              <p className="label">Sample App Configuration</p>
              <p className="info">(read only)</p>
            </div>
            <div className="input-wrapper">
              <div className="input-container">
                <p className="config-value">{trimmedSampleAppConfig}</p>
                <img src={ReadOnly} alt="ReadOnlyLogo" />
              </div>

              <img src={JsonView} alt="Show-Json-CTA" className="show-json-cta" onClick={handleViewRawConfig} />
              {isRawConfigModalOpen && <ConfigModal config={appConfig!} onClose={handleCloseModal} />}
            </div>
          </div>
          <div className="location-description">
            <p className="location-description-text">{parse(localeTexts.GlobalFullPage.body)}</p>
            <a target="_blank" rel="noreferrer" href={localeTexts.GlobalFullPage.button.url}>
              <span className="location-description-link">{localeTexts.GlobalFullPage.button.text}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
export default GlobalFullPageExtension;
