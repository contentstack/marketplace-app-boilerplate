import React, { FC } from "react";
import "../../index.css";

interface ViewRawConfigButtonProps {
  onClick: () => void;
}

const RawConfigButton: FC<ViewRawConfigButtonProps> = ({ onClick }) => {
  return (
    <button className="view-raw-config-button" onClick={onClick}>
      <span>{"{ }"}</span>
    </button>
  );
};

export default RawConfigButton;
