import React from "react";

const ImageUploadComponent = ({ isOpen, onClose, children }) => {
  return (
    <>
      <div className={`imageUpload ${isOpen ? "open" : ""}`}>
        <div className="imageUpload-content">
          <button className="close-btn-Upload" onClick={onClose}>
            Close
          </button>
          {children}
        </div>
      </div>
    </>
  );
};

export default ImageUploadComponent;
