import React, { useCallback, useState } from "react";
import localeTexts from "../../common/locales/en-us/index";
import parse from "html-react-parser";
import { useAppConfig } from "../../common/hooks/useAppConfig";
import "../index.css";
import styles from "./FieldModifier.module.css";
import Icon from "../../assets/Field-Modifier-Icon.svg";
import ReadOnly from "../../assets/lock.svg";
import JsonView from "../../assets/JsonView.svg";
import RawConfigModal from "../../components/ConfigModal/ConfigModal";

const FieldModifierExtension = () => {
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
    sampleAppConfig.length > 10 ? `${sampleAppConfig.substring(0, 10)}...` : sampleAppConfig;

  return (
    <div className={`layout-container ${styles.layoutContainer}`}>
      <div className={`ui-location-wrapper ${styles.uiLocationWrapper}`}>
        <div className="ui-location">
          <div className={`ui-container ${styles.uiContainer}`}>
            <div className="logo-container">
              <img src={Icon} alt="Logo" />
              <p>{localeTexts.FieldModifier.title}</p>
            </div>
            <div className={`config-container ${styles.configContainer}`}>
              <div className="label-container">
                <p className={`label ${styles.label}`}>Sample App Configuration</p>
                <p className={`info ${styles.info}`}>(read only)</p>
              </div>
              <div className="input-wrapper">
                <div className="input-container">
                  <p className="config-value">{trimmedSampleAppConfig}</p>
                  <img src={ReadOnly} alt="ReadOnlyLogo" />
                </div>

                <img src={JsonView} alt="Show-Json-CTA" className="show-json-cta" onClick={handleViewRawConfig} />
                {isRawConfigModalOpen && appConfig && <RawConfigModal config={appConfig} onClose={handleCloseModal} />}
              </div>
            </div>
            <div className={`location-description ${styles.locationDescription}`}>
              <p className={`location-description-text ${styles.locationDescriptionText}`}>
                {parse(localeTexts.FieldModifier.body)}
              </p>
              <a target="_blank" rel="noreferrer" href={localeTexts.FieldModifier.button.url}>
                <span className="location-description-link">{localeTexts.FieldModifier.button.text}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FieldModifierExtension;
