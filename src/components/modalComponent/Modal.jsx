import React from "react";
import { Dialog } from "primereact/dialog";
import { Divider } from "primereact/divider";
import SaveButton from "@components/UI/SaveButton";
import CancelButton from "../UI/CancelButton";
import { useLocalStorage } from "@app/utils/hooks/useLocalStorage";
import { t } from "i18next";

const Modal = ({
  setVisible,
  visible,
  children,
  Header,
  buttons,
  modalWidth,
  setModalData,
  modalData,
  handleAPI,
  buttonName,
  footer,
  CancelbuttonName,
  IsCancelFlag = false,
  handleCancelComment,
  style
}) => {
  const isMobile = window.innerWidth <= 768;
  const theme = useLocalStorage("theme", "get");

  const handleSubmit = () => {
    handleAPI(modalData);
  };
  
  

  const footerContent = (
    <div >
      <div className="ftr_btn">
        {buttons}
        <SaveButton
          btnName={buttonName ? buttonName : t("Save")}
          onClick={handleSubmit}
        />
        <CancelButton
          cancleBtnName={CancelbuttonName ? CancelbuttonName : t("Cancel")}
          onClick={() => {
            setVisible(false);
            IsCancelFlag ? handleCancelComment() : null;
          }}
        />
      </div>
    </div>
  );
  return (
    <>
    
    
      <Dialog
        header={Header}
        visible={visible}
        style={{ width: isMobile ? "900vw" : modalWidth ,...style}}
        onHide={() => {setVisible(false,modalData);}}
        draggable={false}
        className={theme}
        footer={footer ? footer : footerContent}
      >
        <Divider className={`custom-divider-header ${theme}`} />
        <p className={`m-0 ${theme}`}>{children}</p>
      </Dialog>
    </>
  );
};

export default Modal;
