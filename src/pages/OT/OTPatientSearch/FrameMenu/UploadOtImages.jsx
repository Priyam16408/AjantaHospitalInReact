import React, { useState, useEffect } from "react";
import Heading from "../../../../components/UI/Heading";
import Input from "../../../../components/formComponent/Input";
import { useTranslation } from "react-i18next";
import BrowseButton from "../../../../components/formComponent/BrowseButton";
import {
  BindOTImages,
  OTImagesUpload,
  RemoveOTImages,
  UpdateOTImages,
  ViewOTImages,
} from "../../../../networkServices/OT/KaranOtApi";
import Tables from "../../../../components/UI/customTable";
import { notify } from "../../../../utils/ustil2";
import Modal from "../../../../components/modalComponent/Modal";

function OtImages({ data }) {
  const [t] = useTranslation();
  const initialState = {
    id: null,
    narration: "",
    searchImage: "",
    height: "",
    width: "",
    priority: "",
  }
  const [values, setValues] = useState(initialState);
  const [modalData, setModalData] = useState({ visible: false });
  const [isEditing, setIsEditing] = useState(false);
  const [otImagesData, setOtImagesData] = useState([]);
  const [ID, setID] = useState("");
  const theadPatientDetail = [
    { width: "5%", name: t("S.No.") },
    { width: "5%", name: t("Images") },
    { width: "5%", name: t("Narration") },
    { width: "5%", name: t("Priority") },
    { width: "5%", name: t("Photo Width") },
    { width: "5%", name: t("Photo Height") },
    { width: "5%", name: t("Edit") },
    { width: "5%", name: t("Delete") },
  ];

  const handleSave = async () => {
    const payload = {
      tid: data?.TransactionID ? data?.TransactionID : "0",
      imageFile: values?.searchImage,
      width: Number(values?.width),
      height: Number(values?.height),
      narration: values?.narration,
    };
    try {
      const apiResp = await OTImagesUpload(payload);
      if (apiResp.success) {
        notify(apiResp?.message, "success");
        handleBindOTImages();
        setValues(initialState);
      } else {
        notify(apiResp?.message, "error");
      }
    } catch (error) {
      console.error("Error while uploading image:", error);
    }
  };

  const handleImageChange = (e) => {
    const file = e?.target?.files[0];
    if (file) {
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        notify("File size exceeds 5MB. Please choose a smaller file.", "error");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader?.result.split(",")[1];
        setValues((val) => ({ ...val, [e?.target?.name]: base64String }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };


  const handleEdit = (item) => {
    setID(item?.id);
    setValues({
      id: item?.OtImageID,
      narration: item?.OtImageNarration,
      searchImage: "",
      height: parseFloat(item?.PhotoHeight),
      width: parseFloat(item?.PhotoWidth),
      priority: item?.Priority,
    });
    setIsEditing(true);
  };

  const handleUpdate = async () => {
    const payload = {
      id: ID,
      narration: values?.narration,
      priority: values?.priority || "0",
      width: values?.width,
      height: values?.height,
    };

    try {
      const apiResp = await UpdateOTImages(payload);
      if (apiResp.success) {
        notify(apiResp?.message, "success");
        handleBindOTImages();
        setValues(initialState);
        setIsEditing(false);
      } else {
        notify(apiResp?.message, "error");
      }
    } catch (error) {
      console.error("Error while updating image:", error);
    }
  };

  const handleDelete = async (item) => {
    console.log("the delete item is", item);
    try {
      const apiResp = await RemoveOTImages(item?.TransactionID, item?.OtImage);
      if (apiResp.success) {
        notify(apiResp?.message, "success");
        handleBindOTImages();
      } else {
        notify(apiResp?.message, "error");
        handleBindOTImages();
      }
    } catch (error) {
      console.error("Error while updating image:", error);
    }
  };

  const handleBindOTImages = async () => {
    try {
      const response = await BindOTImages(data?.TransactionID);
      if (response.success) {
        setOtImagesData(response?.data);
      } else {
        console.error("API returned error:", response);
        setOtImagesData([]);
      }
    } catch (error) {
      console.error("Error fetching OT images:", error);
    }
  };

  useEffect(() => {
    handleBindOTImages();
  }, []);

  const handleImageClick = async (data) => {
    let apiResp = await ViewOTImages(data?.id);
    if (apiResp?.success) {
      setModalData({ visible: true, size: "60vw", modalData: apiResp?.data, label: t("View Image") });
    }
  }

  return (
    <>

      <Modal
        visible={modalData?.visible}
        setVisible={() => { setModalData((val) => ({ ...val, visible: false })) }}
        modalData={modalData?.modalData}
        modalWidth={modalData?.width}
        Header={modalData?.label}
        footer={<></>}
      // handleAPI={modalData?.CallAPI}
      >

        <iframe
          src={modalData?.modalData}
          width="600"
          height="500">
        </iframe>
      </Modal>

      <div className="spatient_registration_card card">
        <Heading
          title={t("")}
          isBreadcrumb={true}
        />

        <div className="row p-2">
          <div className="col-xl-2 col-md-4 col-sm-6 col-12">
            <BrowseButton
              label={t("Search Image")}
              handleImageChange={handleImageChange}
              className={`btn-primary w-100 px-xl-3 mb-2`}
              value={values?.searchImage}
              name="searchImage"
            />
          </div>

          <Input
            type="text"
            placeholder=""
            className="form-control"
            id="narration"
            name="narration"
            value={values?.narration || ""}
            onChange={handleChange}
            lable={t("Narration")}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          />

          <Input
            type="number"
            placeholder=""
            className="form-control"
            id="height"
            name="height"
            value={values?.height || ""}
            onChange={handleChange}
            lable={t("height")}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          />

          <Input
            type="number"
            placeholder=""
            className="form-control"
            id="width"
            name="width"
            value={values?.width || ""}
            onChange={handleChange}
            lable={t("width")}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          />

          <div className="col-sm-2 col-xl-1">
            {isEditing ?
              <button className="btn btn-sm btn-success px-3" type="button" onClick={handleUpdate}   >
                {t("Update Image")}
              </button>
              :
              <button className="btn btn-sm btn-success px-3" type="button" onClick={handleSave}  >
                {t("Save Image")}
              </button>
            }
          </div>
        </div>

        {otImagesData.length > 0 && (
          <div className="">
            <Tables
              thead={theadPatientDetail}
              tbody={otImagesData?.map((val, index) => ({
                sno: index + 1,
                images: (
                  // <img
                  //   src={val?.imgUrl}
                  //   alt={`OtImage-${index}`}
                  //   width="25px"
                  //   height="24px"
                  // />
                  <i className="fa fa-image" onClick={() => handleImageClick(val)}></i>
                ),
                nattation: val?.OtImageNarration,
                Priority: val?.Priority,
                photoWidth: val?.PhotoWidth,
                photoHeight: val?.PhotoHeight,
                edit: (
                  <i
                    className="fa fa-edit text-primary"
                    onClick={() => handleEdit(val)}
                    style={{ cursor: "pointer" }}
                  />
                ),
                Delete: (
                  <i
                    className="fa fa-trash text-danger"
                    onClick={() => handleDelete(val)}
                  />
                ),
              }))}
              style={{ height: "60vh" }}
            />
          </div>
        )}
      </div>
    </>
  );
}

export default OtImages;
