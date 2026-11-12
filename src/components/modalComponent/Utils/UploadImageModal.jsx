import React, { useEffect, useRef, useState } from "react";
import nurse from "../../../assets/image/nurse.png";
import { useDispatch, useSelector } from "react-redux";
import { GetPanelDocument } from "../../../store/reducers/common/CommonExportFunction";
import Modal from "../Modal";
import WebcamCapture from "../../commonComponents/WebcamCapture";
import { useTranslation } from "react-i18next";
const UploadImageModal = ({
  isuploadOpen,
  closeCameraStream,
  setIsuploadOpen,
  handleImageChange,
  startCamera,
  cameraStream,
  handleAPI,
  setModalData,
  modalData,
  takePhoto,
  canvasRef
}) => {
  //
  const [t]=useTranslation();
  const isMobile = window.innerWidth <= 768;
  return (
    <Modal
      visible={isuploadOpen}
      handleAPI={handleAPI}
      setModalData={setModalData}
      modalData={modalData}
      setVisible={() => {
        closeCameraStream("close"); // Close camera stream before closing modal
        setIsuploadOpen(false);
      }}
      modalWidth={`500px`}
      buttonName="Add"
      Header="Upload Image"
      buttons={
        <>
          <input
            type="file"
            id="fileInput"
            onChange={handleImageChange}
            style={{ display: "none" }}
            accept="image/png, image/gif, image/jpeg"
          />
          <button className="btn btn-sm">
            <label htmlFor="fileInput" className="text-white file-type-browse">
              {t("Browse")}
            </label>
          </button>
          {!isMobile && <button className="text-white" onClick={startCamera}>
            {t("Webcam")}
          </button>}

        </>
      }
    >
    
      <div className={`d-flex upload-image-model text-center justify-content-center`}>
        {modalData?.preview && !cameraStream?.active ? (
          <div style={{ height: "150px" }}>
            <img src={modalData?.preview} alt="Preview" width="200" height="150" />
          </div>
        ) : (
          <WebcamCapture height={"150"} width={'200'} takePhoto={takePhoto} canvasRef={canvasRef}/>
        )}
      </div>
    </Modal>
  );
};

export default UploadImageModal;
