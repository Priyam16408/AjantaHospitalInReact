"use client";

import { useEffect, useState } from "react";
import { Card } from "primereact/card";
import { FileUpload } from "primereact/fileupload";
import { Button } from "primereact/button";
import { Image } from "primereact/image";
import { notify } from "../../../utils/utils";
import { useLocalStorage } from "../../../utils/hooks/useLocalStorage";
import SaveButton from "../../UI/SaveButton";
import CancelButton from "../../UI/CancelButton";
import { updateSignatureApi } from "../../../networkServices/HeaderApi";

const UploadSignature = ({ setHandleModelData }) => {
  const localData = useLocalStorage("userData", "get");
  const [userData, setUserData] = useState(localData);
  const [imageUrl, setImageUrl] = useState(localData?.employeeSignature);
  const [base64String, setBase64String] = useState("");

  const onUpload = (event) => {
    // debugger
    const file = event.files[0];
    if (!file) return;

    if (file.type !== "image/png") return notify("Only PNG images are allowed.","error");
    if (file.size > 30000) return notify("File size must be 30KB or less.","error");

    const reader = new FileReader();
    reader.onload = () => {
      setUserData({ ...userData, employeeSignature: reader.result });
      setBase64String(reader.result);
    };
    reader.readAsDataURL(file);

    setImageUrl(URL.createObjectURL(file));
    event.options.clear();
  };

  const removeImage = () => {
    if (imageUrl) URL.revokeObjectURL(imageUrl);
    setImageUrl(null);
    setBase64String("");
  };

  const updateSignature = async () => {
    const payload = {
      EmailId: localData?.email,
      MobileNo: localData?.mobile,
      EmployeeSignature: base64String,
      preview: localData?.employeePhoto,
    };

    const apiResponse = await updateSignatureApi(payload, localData?.employeeID);
    if (apiResponse?.success) {
      useLocalStorage("userData", "set", apiResponse?.data?.loginResponse);
      notify(apiResponse?.message, "success");
      setHandleModelData((prev) => ({ ...prev, isOpen: false }));
    } else {
      notify(apiResponse?.message || apiResponse?.data?.message, "error");
    }
  };

  return (
    <div className="container mt-4">
      <Card className="shadow-sm p-4">
        <div className="row g-4">
          <div className="col-md-6">
            <div className="border rounded h-100 d-flex align-items-center justify-content-center bg-light overflow-hidden">
              {imageUrl ? (
                <Image src={imageUrl} alt="Uploaded image preview" imageClassName="img-fluid" preview />
              ) : (
                <div className="text-secondary text-center">
                  <i className="pi pi-image display-4 mb-2"></i>
                  <p>No image uploaded</p>
                </div>
              )}
            </div>
          </div>

          <div className="col-md-6 d-flex flex-column justify-content-center gap-3">
            <h3 className="h5">Image Upload</h3>
            <p className="text-muted">Upload an image to preview it</p>
            <p className="text-muted">Max Size: 30KB</p>
            <FileUpload mode="basic" name="image" 
            accept="image/png" 
            // maxFileSize={30000} 
            customUpload uploadHandler={onUpload} auto chooseLabel="Browse" className="mb-3" />
            {imageUrl && <Button icon="pi pi-trash" label="Remove Image" severity="danger" onClick={removeImage} className="btn btn-outline-danger" />}
          </div>
        </div>
      </Card>
      <div className="ftr_btn mt-2">
        <SaveButton btnName="Save" onClick={updateSignature} />
        <CancelButton cancleBtnName="Cancel" onClick={() => setHandleModelData((prev) => ({ ...prev, isOpen: false }))} />
      </div>
    </div>
  );
};

export default UploadSignature;