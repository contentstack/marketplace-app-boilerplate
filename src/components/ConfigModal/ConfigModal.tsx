import React, { FC } from "react";
import "./ConfigModal.css";
import Close from "../../assets/close-button.svg";

interface RawConfigModalProps {
  config: Record<string, unknown>;
  onClose: () => void;
}

const ConfigModal: FC<RawConfigModalProps> = ({ config, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="header-container">
          <div className="header-text">
            <p>Raw Config</p>
          </div>
          <img src={Close} alt="close" onClick={onClose} />
        </div>
        <div className="body-container">
          <div className="json-window">
            <pre>{JSON.stringify(config, null, 4)}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfigModal;
