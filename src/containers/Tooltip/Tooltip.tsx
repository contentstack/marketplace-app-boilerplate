import React, { useState } from "react";
import styles from "./Tooltip.module.css";
import HelpIcon from "../../assets/help_icon.svg";

const Tooltip = ({ content }: { content: string }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleMouseEnter = () => {
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  return (
    <div className={styles.tooltipWrapper} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <div className={styles.tooltipIcon}>
        <img src={HelpIcon} alt="info-icon" />
      </div>
      {showTooltip && <div className={styles.tooltipContent}>{content}</div>}
    </div>
  );
};

export default Tooltip;
