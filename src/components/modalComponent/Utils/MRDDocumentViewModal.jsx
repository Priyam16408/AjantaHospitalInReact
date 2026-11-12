import React, { useEffect, useState } from "react";
import {
  MRDBindPatientDetails,
  MRDScanFileView,
  MRDSearch,
} from "../../../networkServices/MRDApi";
import Heading from "../../UI/Heading";
import { useTranslation } from "react-i18next";
import LabeledInput from "../../formComponent/LabeledInput";
import Tables from "../../UI/customTable";
import { DownLoadSVG } from "../../SvgIcons";
import Modal from "../Modal";



const MrdDocumentViewModal = ({ data }) => {
  const [t] = useTranslation();

  const [patientDetails, setPatientDetails] = useState({
    Details: {},
    tableData: [],
  });

  const [modalState, setModalState] = useState({
    show: false,
    name: null,
    component: null,
    size: null,
    footer: null,
  });
  const THEAD = [t("DocumentName"),t( "DocId"), t("Upload")];
  const handleMRDBindPatientDetails = async (patient_id, Transaction_id) => {
    try {
      const [BindPatientDetails, MRDTableData] = await Promise.all([
        MRDBindPatientDetails(Transaction_id),
        MRDSearch(patient_id, Transaction_id),
      ]);

      const responseData = {
        Details: BindPatientDetails?.data[0],
        tableData: MRDTableData?.data,
      };

      setPatientDetails(responseData);
    } catch (error) {
      console.log(error, "SomThing Went Wrong");
    }
  };

  const handleImageDownload = (url, Name) => {
    const link = document.createElement("a");

    link.href = url;
    link.download = `${Name}.jpg`; // The file name for the downloaded image
    link.target = "_blank"; // Open in a new tab (optional)

    // Append link to the body and trigger the download
    document.body.appendChild(link);
    link.click();

    // Clean up by removing the link element
    document.body.removeChild(link);
  };

  const handleModalState = (show, name, component, size, footer) => {
    setModalState({
      show: show,
      name: name,
      component: component,
      size: size,
      footer: footer,
    });
  };

  const handleMRDScanFileView = async (row) => {
    try {
      const response = await MRDScanFileView({
        docID: String(row?.ID),
        patientId: String(data?.patient_id),
        transactionID: String(data?.Transaction_id),
      });

      if (response?.success) {
        handleModalState(
          true,
          "view Document",
          <>
            <div
              className="d-flex justify-content-end align-items-center"
              onClick={() => handleImageDownload(response?.data, row?.Name)}
            >
              <DownLoadSVG />
            </div>
            <img src={response?.data} className="img-fluid mt-2" />
          </>,
          "80vw",
          <></>
        );
      }
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };

  const handleTableData = (tableData) => {
    return tableData?.map((row, index) => {
      const { Name, ID, UploadStatus } = row;
      return {
        Name: Name,
        ID: ID,
        UploadStatus:
          UploadStatus === "true" ? (
            <button
              className="btn btn-sm btn-primary"
              onClick={() => handleMRDScanFileView(row)}
            >
              {" "}
              {t("view")}
            </button>
          ) : (
            ""
          ),
      };
    });
  };

  useEffect(() => {
    handleMRDBindPatientDetails(data?.patient_id, data?.Transaction_id);
  }, [data]);
  return (
    <>
      <div className="mt-2 spatient_registration_card">
        <div className="patient_registration card">
          <Heading title={t("Patient Information")} isBreadcrumb={false} />
          <div className="row p-2">
            <LabeledInput
              label={t("Patient Name")}
              className={"col-12 col-md-4 col-lg-3"}
              value={patientDetails?.Details?.PName}
            />
            <LabeledInput
              label={t("UHID")}
              className={"col-12 col-md-4 col-lg-3"}
              value={patientDetails?.Details?.PatientID}
            />
            <LabeledInput
              label={t("DOB/Gender")}
              className={"col-12 col-md-4 col-lg-3"}
              value={
                patientDetails?.Details?.Age +
                "/" +
                patientDetails?.Details?.Gender
              }
            />
            <LabeledInput
              label={t("Patient Type")}
              className={"col-12 col-md-4 col-lg-3"}
              value={patientDetails?.Details?.Type}
            />
          </div>
        </div>
      </div>

      <div className="patient_registration card">
        <div className="row">
          <div className="col-12">
            <Tables
              thead={THEAD}
              tbody={handleTableData(patientDetails?.tableData)}
            />
          </div>
        </div>
      </div>

      <Modal
        Header={modalState?.name}
        modalWidth={modalState?.size}
        visible={modalState?.show}
        setVisible={() => {
          handleModalState(false, null, null, null, <></>);
        }}
        footer={modalState?.footer}
      >
        {modalState?.component}
      </Modal>
    </>
  );
};

export default MrdDocumentViewModal;
