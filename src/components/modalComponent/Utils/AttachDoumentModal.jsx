import React, { useEffect, useState } from "react";
import nurse from "../../../assets/image/nurse.png";
import { useDispatch, useSelector } from "react-redux";
import {
  GetPanelDocument,
  GetPatientUploadDocument,
} from "../../../store/reducers/common/CommonExportFunction";
import Modal from "../Modal";
import BrowseButton from "../../formComponent/BrowseButton";
import Button from "../../formComponent/Button";
import { useTranslation } from "react-i18next";

const AttachDoumentModal = ({
  isuploadOpen,
  setIsuploadOpen,
  // handleImageChange,
  modelHeader,
  handleAPI,
  documentsViewList,
  values,
}) => {
  const dispatch = useDispatch();
  const [t] = useTranslation();

  const [isActive, setIsActive] = useState(0);
  const [preview, setPreview] = useState({});
  const [documentsList, setDocumentsList] = useState();

  const patientList = async () => {
    // console.log(values);
    // debugger
    let data = await dispatch(GetPatientUploadDocument({ PanelID: 88 }));
    if (data?.payload?.success) {
      let respdata = data?.payload?.data;
      if (values?.documentvalue?.length > 0) {
        const datass = (respdata = respdata?.map((val) => {
          const prevImage = values?.documentvalue?.find(
            (v) => v?.documentID === val?.DocumentID
          );
          if (prevImage) {
            // debugger;
            val = {
              Document: val?.Document,
              DocumentID: val?.DocumentID,
              image:prevImage?.base64
            };
          }
          return val;
        }));
      }
      setDocumentsList(respdata);
      setPreview(data?.payload?.data[0]);
    }
  };

  console.log("ssssssssssss",documentsList)
  useEffect(() => {
    if (documentsViewList?.length > 0) {
      setDocumentsList(documentsViewList);
      setPreview(documentsViewList[0]);
    } else {
      patientList();
    }
  }, [dispatch]);

  const handleActive = (index, value) => {
    setPreview(value);
    setIsActive(index);
  };

  const handleImageChange = (e) => {
    e.preventDefault();
    let reader = new FileReader();
    let file = e.target.files[0];
    reader.onloadend = () => {
      setPreview((val) => ({ ...val, image: reader.result }));
      const data = JSON.parse(JSON.stringify(documentsList));
      data?.splice(isActive, 1, { ...preview, image: reader.result });
      setDocumentsList(data);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  return (
    <Modal
      visible={isuploadOpen}
      modalData={documentsList}
      handleAPI={handleAPI}
      setVisible={() => {
        // closeCameraStream();
        setIsuploadOpen(false);
      }}
      modalWidth={`70vw`}
      Header={modelHeader}
      buttons={
        <>
          <BrowseButton
            handleImageChange={handleImageChange}
            accept="image/*"
          />
          <Button
            name={t("Scan Document")}
            type={"button"}
            className={"text-white"}
            handleClick={() => {}}
          />
        </>
      }
    >
      {/* name, type, className ,handleClick */}
      <div className="row">
        <div className="col-sm-12 col-md-4">
          <div
            style={{
              minHeight: "300px",
              overflow: "scroll",
              borderRight: "3px solid grey",
              padding: "10px",
            }}
          >
            <button
              className="btn btn-sm my-1 btn-warning text-white w-100"
              style={{ background: "green" }}
            >
              {t("Panel Required Document's")}
            </button>
            {documentsList?.map((data, index) => (
              <div
                className={`btn btn-sm my-1 btn-info text-white w-100 ${isActive === index && "active-upload-document"} `}
                key={index}
                onClick={() => {
                  handleActive(index, data);
                }}
              >
                {data?.Document}
              </div>
            ))}
          </div>
        </div>
        <div className="col-sm-12 col-md-8">
          <div className="w-100">
            {/* <img className="w-100" src={nurse} /> */}
            <img
              src={preview?.image}
              alt="Preview"
              width="100%"
              height="auto"
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AttachDoumentModal;
