import React, { FC } from "react";
import "../../index.css";

interface RawConfigModalProps {
  config: Record<string, unknown>;
  onClose: () => void;
}

const RawConfigModal: FC<RawConfigModalProps> = ({ config, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h4>Raw Config</h4>
          <button onClick={onClose}>X</button>
        </div>
        <div className="json-content">
          <pre>{JSON.stringify(config, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
};

export default RawConfigModal;
