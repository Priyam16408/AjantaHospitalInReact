import React from "react";
import "./pageDisableOverlay.css";
const PageDisableOverlay = ({ children, isDisable }) => {
  return (
    <div style={{ position: "relative" }}>
      {isDisable && <div className="page-overlay"></div>}
      {children}
    </div>
  );
};

export default PageDisableOverlay;
