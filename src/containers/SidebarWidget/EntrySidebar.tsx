import { useState } from "react";
import localeTexts from "../../common/locales/en-us/index";
import parse from "html-react-parser";
import { useAppConfig } from "../../common/hooks/useAppConfig";
import "./EntrySidebar.css";
import Icon from "../../assets/Entry-Sidebar-Logo.svg";
import ReadOnly from "../../assets/lock.svg";
//TODO:  need to update the CTA button
import Copy from "../../assets/Copy.svg";
//TODO:  need to update the RC modal
import RawConfigModal from "../../components/ViewRawConfig/RawConfigModal";

const EntrySidebarExtension = () => {
  const appConfig = useAppConfig();

  const [isRawConfigModalOpen, setRawConfigModalOpen] = useState(false);

  const handleViewRawConfig = () => {
    setRawConfigModalOpen(true);
  };

  const handleCloseModal = () => {
    setRawConfigModalOpen(false);
  };

  const sampleAppConfig = appConfig?.appConfigData || "";
  const trimmedSampleAppConfig = sampleAppConfig.length > 17 ? `${sampleAppConfig.substring(0, 17)}...` : sampleAppConfig;

  return (
    <div className="layout-container">
      <div className="ui-location-wrapper">
        <div className="ui-location">
          <div className="ui-container">
            <div className="logo-container">
              <img src={Icon} alt="Logo" />
              <p>Sidebar Widget</p>
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

                <img src={Copy} alt="Show-Json-CTA" className="show-json-cta" onClick={handleViewRawConfig} />
                {isRawConfigModalOpen && <RawConfigModal config={appConfig!} onClose={handleCloseModal} />}
              </div>
            </div>
            <div className="location-description">
              <p className="location-description-text">{parse(localeTexts.SidebarWidget.body)}</p>
              <a target="_blank" rel="noreferrer" href={localeTexts.SidebarWidget.button.url}>
                <span className="location-description-link">{localeTexts.SidebarWidget.button.text}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EntrySidebarExtension;
