import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Tables from "../../../components/UI/customTable";
import Modal from "../../../components/modalComponent/Modal";
import ViewItem from "./ViewItem";
import { PReqGetPRDetailsReport, PRGetPRDetailsByPRNo } from "../../../networkServices/Purchase";
import { RedirectURL } from "../../../networkServices/PDFURL";

const ViewDetails = ({ THEAD, tbody, }) => {
  const [t] = useTranslation();
  const [modalData, setModalData] = useState({
    visible: false,
    component: null,
    size: null,
    Header: null,
    setVisible: false,
    prescription: null,
  });

  const handleSetModeldata = (data, prescription, val) => {
    setModalData({
      visible: true,
      prescription: prescription ? prescription : modalData?.prescription,
      component: (<ViewItem data={data} />
      ),
      size: "55vw",
      Header: (
        <span>
          {t("Purchase Request Detail")} -{" "}
          <span style={{ background:  "green", fontWeight: "bold ", marginRight:"5px" }}>
            { t("Not Rejected")}
          </span>
          <span style={{ background:  "#f88891", fontWeight: "bold" }}>
            { t("Rejected")}
          </span>
        </span>
      ),
      // Header:`${t("Purchase Request Detail")} `,
      setVisible: false,
      footer: (
        <>
          <button
            className="btn btn-sm btn-success mx-1"
            onClick={() => setModalData((val) => ({ ...val, visible: false }))}
          >
         {t("Close")}
          </button>{" "}
        </>
      ),
    });
  };


  const GetViewIndent = async (val, prescription) => {
    let PurchaseRequestNo = val?.PurchaseRequestNo
    try {
      const response = await PRGetPRDetailsByPRNo(PurchaseRequestNo);
      console.log(response);
      let data = response?.data

      handleSetModeldata(data, prescription, val);
    } catch (error) {
      console.error(error);
    }
  };

   const handlePRClick = async (currentPRNo) => {
        const payload=  {
              PrNumber:currentPRNo
              }
  
          try {
              const response = await PReqGetPRDetailsReport(payload)
              if (response?.success) {
              
                  RedirectURL(response?.data?.pdfUrl);
  
              }
          } catch (error) {
              console.error("Error fetching data:", error);
              notify(error?.message || "An error occurred during search.", "error");
          }
  
      };
  

  const getRowClass = (val) => {

    if (val?.STATUS === "Open") {
      return "#09a115";
    }
    if (val?.STATUS === "Close") {
      return "#9acd32";
    }
    if (val?.STATUS === "Reject") {
      return "#ffb6c1";
    }
    if (val?.STATUS === "Pending") {
      return "#ffff00";
    }
  };
  return (
    <>
      {modalData.visible && (
        <Modal
          visible={modalData.visible}
          Header={modalData.Header}
          modalWidth={modalData?.size}
          onHide={modalData?.setVisible}
          setVisible={() => {
            setModalData((val) => ({ ...val, visible: false }));
          }}
          footer={modalData?.footer}
        >
          {modalData?.component}
        </Modal>
      )}

      <Tables
  thead={THEAD}
  handleDoubleClick={(rowData, rowIndex) => {
    handlePRClick(rowData?.PurchaseRequestNo); // Example function
  }}
  tbody={tbody?.map((item, index) => ({
    "Sr No": index + 1,
    PurchaseRequestNo: item?.PurchaseRequestNo,
    LedgerName: item?.LedgerName,
    Subject: item?.Subject,
    Type: item?.Type,
    STATUS: item?.STATUS,
    PartialSTATUS: item?.PartialSTATUS,
    RaisedDate: item?.RaisedDate,
    NAME: item?.NAME,
    View: (
      <i className="fa fa-eye" onClick={() => GetViewIndent(item)}></i>
    ),
    colorcode: getRowClass(item),
    // handleDoubleClic: onDoubleClick: () => handlePRClick(item?.PurchaseRequestNo), // Event on entire row
  }))}
  tableHeight={"tableHeight"}
  style={{ maxHeight: "200px" }}
/>

    </>
  );
};

export default ViewDetails;
