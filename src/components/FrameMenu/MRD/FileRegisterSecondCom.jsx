import React, { useEffect, useState } from "react";
import Heading from "../../UI/Heading";
import { useTranslation } from "react-i18next";
import Tables from "../../UI/customTable";
import {
  MRDBindgrd,
  MRDScanFileUpload,
  MRDScanFileView,
} from "../../../networkServices/MRDApi";
import Input from "../../formComponent/Input";
import { getBase64, notify } from "../../../utils/utils";
import store from "../../../store/store";
import { setLoading } from "../../../store/reducers/loadingSlice/loadingSlice";
import Modal from "../../modalComponent/Modal";
import { DownLoadSVG } from "../../SvgIcons";

const THEAD = ["Document Name", "Doc. Id", "Browse File", "Upload", "View"];

const FileRegisterSecondCom = ({ data }) => {
  const [t] = useTranslation();
  const [tableData, setTableData] = useState([]);
  const [modalState, setModalState] = useState({
    show: false,
    name: null,
    component: null,
    size: null,
    footer: null,
  });

  const handleMRDBindgrd = async (patientID, transactionID) => {
    try {
      const response = await MRDBindgrd(patientID, transactionID);
      setTableData(response?.data);
    } catch (error) {
      console.log(error, "SomeThing Sent  Wrong");
    }
  };

  const handleImage = async (e, index) => {
    const { name, files } = e.target;
    const base64 = await getBase64(files[0]);
    const data = [...tableData];
    data[index][name] = base64.split(",")[1];
    setTableData(data);
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

  const handleMRDScanFileUpload = async (row) => {
    store.dispatch(setLoading(true));
    try {
      const requestBody = {
        patientID: String(data?.patientID),
        transactionID: String(data?.transactionID),
        docID: String(row?.ID),
        docDetID: String(row?.FileDetID),
        fileUpload: String(row?.fileUpload),
      };
      const response = await MRDScanFileUpload(requestBody);
      notify(response?.message, response?.success ? "success" : "error");
      if (response?.success)
        handleMRDBindgrd(data?.patientID, data?.transactionID);
     
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    } finally {
      store.dispatch(setLoading(false));
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

  const handleMRDScanFileView = async (row) => {
    try {
      const response = await MRDScanFileView({
        DocDetID: String(row?.FileDetID)
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
    return tableData?.map((item, index) => {
      const { Name, ID } = item;
      return {
        Name: Name,
        ID: ID,
        fileUpload: (
          <Input
            type="file"
            name="fileUpload"
            removeFormGroupClass={true}
            onChange={(e) => handleImage(e, index)}
          />
        ),

        upload: (
          <button
            className="btn btn-sm btn-primary"
            onClick={() => handleMRDScanFileUpload(item)}
          >
            Upload
          </button>
        ),
        view: (
          <>
            {item?.URL &&
              <button
                className="btn btn-sm btn-primary"
                onClick={() => handleMRDScanFileView(item)}
              >
                View {console.log("item", item)}
              </button>
            }
          </>
        ),
      };
    });
  };

  useEffect(() => {
    handleMRDBindgrd(data?.patientID?data?.patientID:data?.PatientID, data?.transactionID);
  }, [data]);
  console.log("data",data)
  return (
    <>
      <div>
        <Heading title={t("Upload  Files")} isBreadcrumb={false} />
        <div className="p-1">
          <Tables thead={THEAD} tbody={handleTableData(tableData)} />
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

export default FileRegisterSecondCom;
