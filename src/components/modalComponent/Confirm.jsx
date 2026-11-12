import React from "react";
import { ConfirmDialog } from "primereact/confirmdialog";

const Confirm = ({
  confirmBoxvisible,
  alertMessage,
  lableMessage,
  children,
}) => {
  const isMobile = window.innerWidth <= 768;
  return (
    <>
      <ConfirmDialog
        group="declarative"
        visible={confirmBoxvisible?.show}
        message={alertMessage}
        header={lableMessage}
        icon="pi pi-exclamation-triangle"
        draggable={false}
        footer={children}
        
        style={{ width: isMobile ? "80vw" : "20vw" }}
        closable={false}
      />
    </>
  );
};

export default Confirm;
