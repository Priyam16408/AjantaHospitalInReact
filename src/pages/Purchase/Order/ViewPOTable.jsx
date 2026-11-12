import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Tables from "../../../components/UI/customTable";
import Modal from "../../../components/modalComponent/Modal";
// import ViewItem from "./ViewItem";
import { getPOItemsDetails, PReqGetPRDetailsReport, PRGetPRDetailsByPRNo, RNPOApprovalPOReport, ViewPurchaseOrderAddRemark } from "../../../networkServices/Purchase";
import { RedirectURL } from "../../../networkServices/PDFURL";
import Input from "../../../components/formComponent/Input";
import { notify } from "../../../utils/ustil2";
import AddRemarks from "./AddRemarks";
import Heading from "../../../components/UI/Heading";

const ViewPOTable = ({ THEAD, tbody, }) => {
  const [pOviewDetails,setPOviewDetails]=useState()
  const [t] = useTranslation();
  const [modalData, setModalData] = useState({
    visible: false,
    component: null,
    size: null,
    Header: null,
    setVisible: false,
    prescription: null,
  });
// ViewPurchaseOrderAddRemark 

  const tHeadViewDetails=[
        { name: t("S.No."), width: "3%" },
        { name: t("Item Name"), width: "7%" },
        { name: t("Gate Entry No"), width: "7%" },
        { name: t("GRN NO"), width: "7%" },
        { name: t("Rate"), width: "7%" },
        { name: t("MRP"), width: "7%" },
        { name: t("GSTType"), width: "7%" },
        { name: t("ManufactureName"), width: "7%" },
        { name: t("VendorName"), width: "7%" },
        { name: t("IsFree"), width: "7%" },
       
    ];
  const handleSetModeldata = ( val) => {
    setModalData({
      visible: true,
      // prescription: prescription ? prescription : modalData?.prescription,
      component: (<AddRemarks val={val} setModalData={setModalData}/>
      
      ),
      size: "30vw",
      Header: ("Add Remark"
       
      ),
      // Header:`${t("Purchase Request Detail")} `,
      setVisible: false,
      footer: (
        <>
          {/* <button
            className="btn btn-sm btn-success mx-1"
            onClick={()=>addRemark(val)}
          >
         {t("Save")}
          </button>{" "}
          <button
            className="btn btn-sm btn-success mx-1"
            onClick={() => setModalData((val) => ({ ...val, visible: false }))}
          >
         {t("Close")}
          </button>{" "} */}
        </>
      ),
    });
  };


  const GetViewIndent = async (val) => {
    // let PurchaseRequestNo = val?.PurchaseRequestNo
    // try {
    //   const response = await PRGetPRDetailsByPRNo(PurchaseRequestNo);
    //   console.log(response);
    //   let data = response?.data

      handleSetModeldata( val);
    // } catch (error) {
    //   console.error(error);
    }
  const GetViewDetails = async (val) => {
 debugger
 try {
  const response=await getPOItemsDetails(val?.PurchaseOrderNo);
  if(response?.success){
    setPOviewDetails(response?.data)
  }
  else{
    notify(response?.message)
  }
 } catch (error) {
  console.log("error",error)
 }
  //  setPOviewDetails(val)
  };

   const handlePOClick = async (PurchaseOrderNo) => {
        const payload=  {
              
                poNumber:PurchaseOrderNo
              }
  
          try {
              const response = await RNPOApprovalPOReport(payload)
              if (response?.success) {
              
                  RedirectURL(response?.data?.pdfUrl);
  
              }
          } catch (error) {
              console.error("Error fetching data:", error);
              notify(error?.message || "An error occurred during search.", "error");
          }
  
      };
  

  const getRowClass = (val) => {

    if (val?.Status === "Open") {
      return "#09a115";
    }
    if (val?.Status === "Close") {
      return "#9acd32";
    }
    if (val?.Status === "Reject") {
      return "#ffb6c1";
    }
    if (val?.Status === "Pending") {
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

<div className="mb-2">
        <Tables
  thead={THEAD}
  handleDoubleClick={(rowData, rowIndex) => {
    handlePOClick(rowData?.PurchaseOrderNo); // Example function
  }}
  tbody={tbody?.map((item, index) => ({
  
    
    "Sr No": index + 1,
    PurchaseOrderNo: item?.PurchaseOrderNo,
    // LedgerName: item?.LedgerName,
    Narration: item?.Narration,
    // Subject: item?.Subject,
    TotalCose: item?.NetTotal,
    Type: item?.Type,
    STATUS: item?.Status,
    RaisedDate: item?.RaisedDate,
    Supplier: item?.VendorName,

    Remarks: (
      <i className="fa fa-plus" onClick={() => GetViewIndent(item)}></i>
    ),
    view: (
      <i className="fa fa-eye" onClick={() => GetViewDetails(item)}></i>
    ),
    colorcode: getRowClass(item),
    // handleDoubleClic: onDoubleClick: () => handlePOClick(item?.PurchaseRequestNo), // Event on entire row
  }))}
  tableHeight={"tableHeight"}
  style={{ maxHeight: "200px" }}
/>
</div>
{
  
  pOviewDetails?.length>0 &&
  <>

   <Heading
                    title={t("View PO Details")}
                    isBreadcrumb={false}
                />
                  <div className="row px-2">
                 <Tables
  thead={tHeadViewDetails}
  // handleDoubleClick={(rowData, rowIndex) => {
  //   handlePOClick(rowData?.PurchaseOrderNo); // Example function
  // }}
  tbody={pOviewDetails?.map((item, index) => ({


      "Sr No": index + 1,
    ItemName: item?.ItemName,
    GateEntryNo: item?.GateEntryNo,
    GRNNO: item?.GRNNO,
    Rate: item?.Rate,
    MRP: item?.MRP,
    GSTType: item?.GSTType,
    ManufactureName: item?.ManufactureName,
    VendorName: item?.VendorName,
    IsFree: item?.IsFree,
   

   
    colorcode: getRowClass(item),
    // handleDoubleClic: onDoubleClick: () => handlePOClick(item?.PurchaseRequestNo), // Event on entire row
  }))}
  tableHeight={"tableHeight"}
  style={{ maxHeight: "200px" }}
/>
</div>
  </>
     
}
  
    </>
  );
};

export default ViewPOTable;
