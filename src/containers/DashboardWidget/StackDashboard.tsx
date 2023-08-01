import { useEffect, useState } from "react";
import Icon from "../../assets/Icon.svg";
import localeTexts from "../../common/locales/en-us/index";
import parse from "html-react-parser";
import { useAppConfig } from "../../common/hooks/useAppConfig";
import RawConfigButton from "../../components/ViewRawConfig/RawConfigButton";
import RawConfigModal from "../../components/ViewRawConfig/RawConfigModal";

const StackDashboardExtension = () => {
  const appConfig = useAppConfig();

  const [isRawConfigModalOpen, setRawConfigModalOpen] = useState(false);

  const handleViewRawConfig = () => {
    setRawConfigModalOpen(true);
  };

  const handleCloseModal = () => {
    setRawConfigModalOpen(false);
  };

  const name = appConfig?.appConfigData || "";

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        <div className="dashboard-icon">
          <img src={Icon} alt="icon" />
        </div>
        <div className="app-component-content">
          <h4>{localeTexts.DashboardWidget.title}</h4>
          <p className="configValues">
            <b>appConfigData: </b>
            {name}
            <RawConfigButton onClick={handleViewRawConfig} />
          </p>
          {isRawConfigModalOpen && <RawConfigModal config={appConfig!} onClose={handleCloseModal} />}
          <p>{parse(localeTexts.DashboardWidget.body)}</p>
          <a target="_blank" rel="noreferrer" href={localeTexts.DashboardWidget.button.url}>
            {localeTexts.DashboardWidget.button.text}
          </a>
        </div>
      </div>
    </div>
  );
};

export default StackDashboardExtension;
