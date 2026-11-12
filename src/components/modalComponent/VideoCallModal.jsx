

import React, { useState } from "react";
import { Dialog } from "primereact/dialog";
import { Divider } from "primereact/divider";
import SaveButton from "@components/UI/SaveButton";
import CancelButton from "../UI/CancelButton";
import { useLocalStorage } from "@app/utils/hooks/useLocalStorage";

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
  footer
}) => {
  const isMobile = window.innerWidth <= 768;
  const theme = useLocalStorage("theme", "get");

  // New state for minimizing the modal
  const [isMinimized, setIsMinimized] = useState(false);

  const handleSubmit = () => {
    handleAPI(modalData);
  };

  const footerContent = (
    <div>
      <div className="ftr_btn">
        {buttons}
        <SaveButton btnName={buttonName ? buttonName : "Save"} onClick={handleSubmit} />
        {/* <CancelButton
          cancleBtnName={"Cancel"}
          onClick={() => setVisible(false)}
        /> */}
      </div>
    </div>
  );

  return (
    <div
  
  >
    {console.log("modalWidth",isMinimized,isMobile,modalWidth)}
      <Dialog
        header={
          // <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div >
            <span>{Header}</span>

            <button onClick={() => setIsMinimized(!isMinimized)} style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}>
              {isMinimized ? '🔼' : '🔽'} {/* Icon for minimize/maximize */}
            </button>
          </div>
        }
        visible={visible}
        style={{
          // width:"1100px",
          width: isMinimized ? '300px' : "1000px",
          // width: isMinimized ? '300px' : (isMobile ? "90vw" : modalWidth),
          height: isMinimized ? '345px' : 'auto',
          position: isMinimized ? 'fixed' : 'relative',
          left:"0px",
          top:"0px"
          // bottom: isMinimized ? '0px' : 'auto',
         // // right: isMinimized ? '0px' : 'auto',
        }}
        onHide={() => setVisible(false)}
        // draggable={false}
        // className={`custom-modals ${theme}`} 
        // className={`${theme} ${isMinimized ? 'custom-modal-minimized' : 'custom-modal'}`}
        className={`${theme} ${isMinimized ? 'custom-modal-minimized' : 'custom-modal'}`}
        modal={true}
        footer={footer ? footer : footerContent}
        // baseZIndex={0}
        // blockScroll={false}
        // focusOnShow={false}
        maskStyle={{
          // background:"red",
          position: isMinimized ? "relative":"fixed"
        }}
        // draggable={isMinimized ? true:false}
        // draggable={true}
      >
        <Divider className={`custom-divider-header ${theme}`} />
        <div
          className={`mt-0 ${theme}`}
          style={{
            maxHeight: isMinimized ? '345px' : 'none',
            overflowY: isMinimized ? 'auto' : 'visible',
            pointerEvents: 'auto', // Ensure interaction
            background: isMinimized ? 'lightgray' : 'transparent' // Optional background for minimized state
          }}
        >
          {children}
        </div>
      </Dialog>
    </div>
  );
};

export default Modal;









