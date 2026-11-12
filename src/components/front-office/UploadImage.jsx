import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import ImageUploadComponent from "./ImageUploadComponent";
import noImange from "../../assets/image/avatar.gif"


const UploadImage = () => {
  const [t] = useTranslation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  return (
    <>
      <div
        onClick={toggleSidebar}
        style={{
          position: "absolute",
          zIndex: "1",
          top: "0px",
          right:"8px"
        }}
      >
      <p 
    //   style={{color:"white"}}
      >{t("Upload Image")}</p>
      {/* <i className="fa fa-chevron-down" aria-hidden="true"></i> */}
      {/* <i className="fa fa-picture" aria-hidden="true"></i> */}
        {/* <i className="fa fa-ellipsis-v" aria-hidden="true"></i> */}
      </div>

      <ImageUploadComponent
        isOpen={isSidebarOpen}
        onClose={toggleSidebar}
        className="imageUpload"
      >
        <div className="row">
          {/* <div className="col-md-8 ">
            <div className="form-group">
              <button
                className="btn btn-primary btn-sm  btn-block"
                type="button"
              >
                {t("OldPatient")}
              </button>
            </div>
          </div> */}
          <div className="col-sm-12 ">
            <div className="imgUplod">
              <img
                src={noImange}
                className="img-card "
                alt="Responsive image"
              />
            </div>
            {/* <button
              className="btn btn-primary btn-sm  btn-block mt-1"
              type="button"
            >
              {t("ducument", {
                quantity: "0",
              })}
            </button> */}
          </div>
        </div>
      </ImageUploadComponent>
    </>
  );
};

export default UploadImage;
