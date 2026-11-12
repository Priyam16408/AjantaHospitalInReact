import React, { useEffect, useState } from "react";
import Tables from "..";
import { Tooltip } from "primereact/tooltip";
import { BillPRINTTYPE, ReceiptPRINTTYPE } from "../../../../utils/constant";
import { ReprintSVG } from "../../../../components/SvgIcons/index";
import { OpenPDFURL, RedirectURL } from "../../../../networkServices/PDFURL";
import { CardPrintPrintCard, CommonReceiptPdf, StickersReceiptPdf } from "../../../../networkServices/BillingsApi";
import { notify } from "../../../../utils/utils";
import { useTranslation } from "react-i18next";
import { ReceiptBillClose } from "../../../../networkServices/opdserviceAPI";

import { Checkbox } from "primereact/checkbox";
const ReceiptReprintTable = (props) => {
  const { tbody, values, handleCustomSelect,handleSubmit } = props;
  const [t] = useTranslation();
// console.log("BillPRINTTYPE",BillPRINTTYPE)
// console.log("ReceiptPRINTTYPE",ReceiptPRINTTYPE)
  const [bodyData, setBodyData] = useState(tbody);
  const [selectedData, setSelectedData] = useState([]); // ✅ Single state for selected data
console.log("selectedData",selectedData)
  useEffect(() => {
    setBodyData(tbody);
  }, [tbody]);

  const stickerTypeMapping = {
    3: "NewReg",
    4: "ReVisit",
    5: "NewFiSmSt",
    6: "NewFiPlSt",
    7: "NewFiSt",
  };

  const CommonReceiptPdfAPI = async (item, index) => {
    // debugger
  
    if (tbody[index]?.PrintType > 2) {
      const postData = {
        ledgerTransactionNo: tbody[index]?.LedgerTransactionNo,
        Type: stickerTypeMapping[tbody[index]?.PrintType],
        PatientID: tbody[index]?.depositor,
        TransactionID: tbody[index]?.TransactionID,
      };

      const reportResp = await StickersReceiptPdf({ ...postData });
      if (reportResp?.data) {
        RedirectURL(reportResp?.data?.pdfUrl);
      } else {
        notify(reportResp?.message, "success");
      }
    } else {
      if (tbody[index]?.TypeOfTnx !== "IPD") {
        if (tbody[index]?.PrintType === "2") {
          // let pDetail = {
          //   PatientID: tbody[index]?.depositor,
          //   TransactionID: tbody[index]?.TransactionID,
          //   App_ID: tbody[index]?.AppID,
          // };
          

          OpenPDFURL("PrintCardPrintOut", tbody[index]?.depositor , tbody[index]?.LedgerTransactionNo )
          // changed by shiv sir 
          // OpenPDFURL("PrintCardPrintOut", tbody[index]?.depositor , tbody[index]?.TransactionID )
        //   const response=await CardPrintPrintCard(payload)

        //  if(response?.success){
        //   OpenPDFURL(response?.data?.pdfUrl);
        // }
          // OpenPDFURL("DoctorPrescriptionPrint", pDetail);
          // return false;
        } else {
          const reportResp = await CommonReceiptPdf({
            ledgerTransactionNo: tbody[index]?.LedgerTransactionNo,
            isBill: tbody[index]?.PrintType === "1" ? 1 : 0,
            receiptNo: tbody[index]?.ReceiptNo,
            duplicate: tbody[index]?.IsAllowedOriginalPrintValue ? 0 : 1,
            type: "OPD",
            supplierID: "",
            billNo: "",
            isEMGBilling: "",
            isOnlinePrint: "",
            isRefound: 0,
          });
          if (reportResp?.success) {
            RedirectURL(reportResp?.data?.pdfUrl);
          } else {
            notify(reportResp?.data?.message, "error");
          }
        }
      } else {
        const reportResp = await CommonReceiptPdf({
          ledgerTransactionNo: "",
          isBill: tbody[index]?.PrintType === "1" ? 1 : 0,
          receiptNo: tbody[index]?.ReceiptNo,
          duplicate: tbody[index]?.IsAllowedOriginalPrintValue ? 0 : 1,
          type: "IPD",
          supplierID: "",
          billNo: "",
          isEMGBilling: "",
          isOnlinePrint: "",
          isRefound: 0,
        });
        if (reportResp?.success) {
          RedirectURL(reportResp?.data?.pdfUrl);
        } else {
          notify(reportResp?.data?.message, "error");
        }
      }
    }
  };

  const handleRowSelect = (index) => {
    const updated = [...selectedData];
    const rowData = tbody[index];

    const exists = updated.find(item => item?.ReceiptNo === rowData?.ReceiptNo);

    if (exists) {
      setSelectedData(updated.filter(item => item?.ReceiptNo !== rowData?.ReceiptNo));
    } else {
      updated.push(rowData);
      setSelectedData(updated);
    }

    console.log("Selected Data:", updated);
  };

  const handleSelectAll = () => {
    if (selectedData.length === tbody.length) {
      setSelectedData([]); // Deselect All
    } else {
      setSelectedData([...tbody]); // Select All
    }
    console.log("Selected Data After Select All:", selectedData.length === tbody.length ? [] : tbody);
  };

  const isMobile = window.innerWidth <= 800;

  const THEAD = [
   
    {
      width: "0.5%",  name:t("SrNo")},
    t("UHID"),
    t("Patient_Name"),
    {
      width: "15%",  name:t("Address")},
    t("Receipt No"),
    t("Bill_No"),
    t("Date"),
    t("Bill_Amount"),
    t("Print"),
    t("Original"),
   
    t("Action"),
    // t("Bill Status"),
    // {
    //   width: "0.5%",
    //   name: isMobile
    //     ? t("check")
    //     : (
    //     //  <span className="gap-2">
         
    //       <input
    //       className="ml-1"
    //         type="checkbox"
    //         checked={selectedData.length === tbody.length}
    //         onChange={handleSelectAll}
    //       />
    //     //    IsBill Close
    //     //  </span>
    //     ),
    // },
  ];

  const handleBillClose=async()=>{
    const payload=
    selectedData?.map((item)=>({
    "tid": item?.TransactionID,
    "isBillClose": 1
  
}))
    
    try {
      const response=await ReceiptBillClose(payload)
      if(response?.success){
        notify(response?.message,"success")
        setSelectedData([])
        handleSubmit()
      }
      else{
        notify(response?.message,"error")
      }
    } catch (error) {
      console.log("error",error)
    }
  }
  return (
    <>
      {bodyData?.map((item, index) => (
        <Tooltip
          key={index}
          target={`#doctorName-${index}, #visitType-${index}`}
          position="top"
        />
      ))}

      <Tables
        thead={THEAD}
        tbody={bodyData?.map((ele, index) => ({
          "Sr. No.": index + 1,
          UHID: ele?.depositor,
          PatientName: ele?.PName,
          Address: ele?.Address,
          ReceiptNo: ele?.ReceiptNo,
          BillNo: ele?.BillNo,
          Date: ele?.DATE,
          BillAmount: ele?.AmountPaid,
          Print: (
            <select
              id="PrintType"
              name="PrintType"
              // disabled={ele?.IsConsultation ? false : true}
              value={values?.PrintType?.value}
              onChange={(e) => handleCustomSelect(index, "PrintType", e.target.value)}
               // Disable if bill is closed
               style={{
                minWidth: "100%",
               }}

            >
             {(
  values?.rblCon?.value === "1" || values?.rblCon === "1"
    ? ele?.IsConsultation === 0 ? BillPRINTTYPE.slice(0, -3) : BillPRINTTYPE
    : ReceiptPRINTTYPE
)
  ?.filter(option => {
   
    if (ele?.IsOPDCardAllow === 0 && option.value === "2") {
      return false; // Hide "OPD Card"
    }
    return true;
  })
  .map(option => (
    <option key={option.value} value={option.value}>
      {option.label}
    </option>
  ))
}
{/* change by by shiv sir....  */}

              {/* {
              (values?.rblCon?.value === "1" || values?.rblCon === "1"
                ? ele?.IsConsultation === 0? BillPRINTTYPE.slice(0, -3) : BillPRINTTYPE
                : ReceiptPRINTTYPE
              )?.map((option) => (
                <option key={option.value} value={option.value}  >
                  {option.label}
                </option>
              ))} */}
            </select>
          ),
          Original: (
            <div style={{ textAlign: "center" }}>
             {/* { console.log("first",ele?.IsAllowedOriginalPrintValue)} */}
              <input
                type="checkbox"
                name="IsAllowedOriginalPrintValue"
                className="table-checkbox"
                checked={ele?.IsAllowedOriginalPrintValue}
                
                disabled={ele?.IsAllowedOriginalPrint}
                onChange={(e) =>
                  handleCustomSelect(
                    index,
                    "IsAllowedOriginalPrintValue",
                    e.target.checked
                  )
                }
              />
              
            </div>
          ),
          isActionCreator: (
            <div
              style={{ textAlign: "center", cursor: "pointer" }}
              onClick={() => CommonReceiptPdfAPI(ele, index)}
            >
              <ReprintSVG />
            </div>
          ),
          // status: ele?.isBillClosed===1? <span style={{color:"red"}}>Close</span>:"Open",

          //  bill: (
          //   <div style={{ textAlign: "center" }}>
          //     <input
          //       type="checkbox"
          //       checked={selectedData.some(item => item?.ReceiptNo === ele?.ReceiptNo)}
          //       onChange={() => handleRowSelect(index)}
          //       disabled={ele?.isBillClosed === 1} 
          //     />
          //   </div>
          // ),

        }))}
        style={{ maxHeight: "60vh" }}
        scrollView={"scrollView"}
      />
    <div style={{ display: "flex", justifyContent: "flex-end" }}>
     
                                     {
       selectedData?.length>0 && <button  className="btn btn-sm btn-success m-2 text-end"  onClick={handleBillClose}>
    { t("Bill Close")}
       </button>
     }
      </div>
    
    </>
  );
};

export default ReceiptReprintTable;


// import React, { useEffect, useState } from "react";
// import Tables from "..";
// import { Tooltip } from "primereact/tooltip";
// import { BillPRINTTYPE, ReceiptPRINTTYPE } from "../../../../utils/constant";
// import { ReprintSVG } from "../../../../components/SvgIcons/index";
// import { OpenPDFURL, RedirectURL } from "../../../../networkServices/PDFURL";
// import {
//   CommonReceiptPdf,
//   StickersReceiptPdf,
// } from "../../../../networkServices/BillingsApi";
// import { notify } from "../../../../utils/utils";
// import { useTranslation } from "react-i18next";

// const ReceiptReprintTable = (props) => {
//   const { tbody, values, handleCustomSelect } = props;
//   const [t] = useTranslation();

//   const [bodyData, setBodyData] = useState(tbody);
//   const [selectionState, setSelectionState] = useState({
//     selectedRows: [],
//     selectAll: false,
//   });

//   const stickerTypeMapping = {
//     3: "NewReg",
//     4: "ReVisit",
//     5: "NewFiSmSt",
//     6: "NewFiPlSt",
//     7: "NewFiSt",
//   };

//   const CommonReceiptPdfAPI = async (item, index) => {
//     if (tbody[index]?.PrintType > 2) {
//       const postData = {
//         ledgerTransactionNo: tbody[index]?.LedgerTransactionNo,
//         Type: stickerTypeMapping[tbody[index]?.PrintType],
//         PatientID: tbody[index]?.depositor,
//         TransactionID: tbody[index]?.TransactionID,
//       };

//       const reportResp = await StickersReceiptPdf({ ...postData });
//       if (reportResp?.data) {
//         RedirectURL(reportResp?.data?.pdfUrl);
//       } else {
//         notify(reportResp?.message, "success");
//       }
//     } else {
//       if (tbody[index]?.TypeOfTnx !== "IPD") {
//         if (tbody[index]?.PrintType === "2") {
//           let pDetail = {
//             PatientID: tbody[index]?.depositor,
//             TransactionID: tbody[index]?.TransactionID,
//             App_ID: tbody[index]?.AppID,
//           };
//           OpenPDFURL("DoctorPrescriptionPrint", pDetail);
//           return false;
//         } else {
//           const reportResp = await CommonReceiptPdf({
//             ledgerTransactionNo: tbody[index]?.LedgerTransactionNo,
//             isBill: tbody[index]?.PrintType === "1" ? 1 : 0,
//             receiptNo: tbody[index]?.ReceiptNo,
//             duplicate: tbody[index]?.IsAllowedOriginalPrintValue ? 0 : 1,
//             type: "OPD",
//             supplierID: "",
//             billNo: "",
//             isEMGBilling: "",
//             isOnlinePrint: "",
//             isRefound: 0,
//           });
//           if (reportResp?.success) {
//             RedirectURL(reportResp?.data?.pdfUrl);
//           } else {
//             notify(reportResp?.data?.message, "error");
//           }
//         }
//       } else {
//         const reportResp = await CommonReceiptPdf({
//           ledgerTransactionNo: "",
//           isBill: tbody[index]?.PrintType === "1" ? 1 : 0,
//           receiptNo: tbody[index]?.ReceiptNo,
//           duplicate: tbody[index]?.IsAllowedOriginalPrintValue ? 0 : 1,
//           type: "IPD",
//           supplierID: "",
//           billNo: "",
//           isEMGBilling: "",
//           isOnlinePrint: "",
//           isRefound: 0,
//         });
//         if (reportResp?.success) {
//           RedirectURL(reportResp?.data?.pdfUrl);
//         } else {
//           notify(reportResp?.data?.message, "error");
//         }
//       }
//     }
//   };

//   useEffect(() => {
//     setBodyData(tbody);
//   }, [tbody?.length]);

//   const handleRowSelect = (index) => {
//     const updatedRows = [...selectionState.selectedRows];
//     const rowData = tbody[index];

//     const exists = updatedRows.find(item => item?.ReceiptNo === rowData?.ReceiptNo);

//     if (exists) {
//       const filteredRows = updatedRows.filter(item => item?.ReceiptNo !== rowData?.ReceiptNo);
//       setSelectionState({
//         selectedRows: filteredRows,
//         selectAll: false,
//       });
//     } else {
//       updatedRows.push(rowData);
//       const isAllSelected = updatedRows.length === tbody.length;
//       setSelectionState({
//         selectedRows: updatedRows,
//         selectAll: isAllSelected,
//       });
//     }

//     console.log("Selected Rows (full data):", updatedRows);
//   };

//   const handleSelectAll = () => {
//     if (selectionState.selectAll) {
//       setSelectionState({
//         selectedRows: [],
//         selectAll: false,
//       });
//     } else {
//       setSelectionState({
//         selectedRows: [...tbody],
//         selectAll: true,
//       });
//     }

//     console.log("Selected All Rows (full data):", !selectionState.selectAll ? tbody : []);
//   };

//   const isMobile = window.innerWidth <= 800;

//   const THEAD = [
//     {
//       width: "0.5%",
//       name: isMobile ? t("check") : (
//         <input
//           type="checkbox"
//           checked={selectionState.selectAll}
//           onChange={handleSelectAll}
//         />
//       ),
//     },
//     t("SrNo"),
//     t("UHID"),
//     t("Patient_Name"),
//     t("Address"),
//     t("Receipt No"),
//     t("Bill_No"),
//     t("Date"),
//     t("Bill_Amount"),
//     t("Print"),
//     t("Original"),
//     t("Action"),
//   ];

//   return (
//     <>
//       {bodyData?.map((item, index) => (
//         <Tooltip
//           key={index}
//           target={`#doctorName-${index}, #visitType-${index}`}
//           position="top"
//         />
//       ))}

//       <Tables
//         thead={THEAD}
//         tbody={bodyData?.map((ele, index) => ({
//           Select: (
//             <div style={{ textAlign: "center" }}>
//               <input
//                 type="checkbox"
//                 checked={selectionState.selectedRows.some(item => item?.ReceiptNo === ele?.ReceiptNo)}
//                 onChange={() => handleRowSelect(index)}
//               />
//             </div>
//           ),
//           "Sr. No.": index + 1,
//           UHID: ele?.depositor,
//           PatientName: ele?.PName,
//           Address: ele?.Address,
//           ReceiptNo: ele?.ReceiptNo,
//           BillNo: ele?.BillNo,
//           Date: ele?.DATE,
//           BillAmount: ele?.AmountPaid,
//           Print: (
//             <select
//               id="PrintType"
//               name="PrintType"
//               disabled={ele?.IsConsultation ? false : true}
//               value={values?.PrintType?.value}
//               onChange={(e) =>
//                 handleCustomSelect(index, "PrintType", e.target.value)
//               }
//             >
//               {(values?.rblCon?.value === "1" || values?.rblCon === "1"
//                 ? BillPRINTTYPE
//                 : ReceiptPRINTTYPE
//               )?.map((option) => (
//                 <option key={option.value} value={option.value}>
//                   {option.label}
//                 </option>
//               ))}
//             </select>
//           ),
//           Original: (
//             <div style={{ textAlign: "center" }}>
//               <input
//                 type="checkbox"
//                 name="IsAllowedOriginalPrintValue"
//                 checked={ele?.IsAllowedOriginalPrintValue}
//                 disabled={ele?.IsAllowedOriginalPrint}
//                 onChange={(e) =>
//                   handleCustomSelect(
//                     index,
//                     "IsAllowedOriginalPrintValue",
//                     e.target.checked
//                   )
//                 }
//               />
//             </div>
//           ),
//           isActionCreator: (
//             <div
//               style={{ textAlign: "center", cursor: "pointer" }}
//               onClick={() => {
//                 CommonReceiptPdfAPI(ele, index);
//               }}
//             >
//               <ReprintSVG />
//             </div>
//           ),
//         }))}
//         style={{ maxHeight: "60vh" }}
//       />
//     </>
//   );
// };

// export default ReceiptReprintTable;



// import React, { useEffect, useState } from "react";
// import Tables from "..";
// import { Tooltip } from "primereact/tooltip";
// import { BillPRINTTYPE, ReceiptPRINTTYPE } from "../../../../utils/constant";
// import { ReprintSVG } from "../../../../components/SvgIcons/index";
// import { OpenPDFURL, RedirectURL } from "../../../../networkServices/PDFURL";
// import {
//   CommonReceiptPdf,
//   StickersReceiptPdf,
// } from "../../../../networkServices/BillingsApi";
// import { notify } from "../../../../utils/utils";
// import { useTranslation } from "react-i18next";

// const ReceiptReprintTable = (props) => {
//   const { tbody, values, handleCustomSelect } = props;
//   const [t] = useTranslation();

//   const [bodyData, setBodyData] = useState(tbody);
//   const [selectedRows, setSelectedRows] = useState([]);
//   const [selectAll, setSelectAll] = useState(false);

//   const isMobile = window.innerWidth <= 800;

//   useEffect(() => {
//     setBodyData(tbody);
//   }, [tbody?.length]);

//   const stickerTypeMapping = {
//     3: "NewReg",
//     4: "ReVisit",
//     5: "NewFiSmSt",
//     6: "NewFiPlSt",
//     7: "NewFiSt",
//   };

//   const CommonReceiptPdfAPI = async (item, index) => {
//     if (tbody[index]?.PrintType > 2) {
//       const postData = {
//         ledgerTransactionNo: tbody[index]?.LedgerTransactionNo,
//         Type: stickerTypeMapping[tbody[index]?.PrintType],
//         PatientID: tbody[index]?.depositor,
//         TransactionID: tbody[index]?.TransactionID,
//       };

//       const reportResp = await StickersReceiptPdf({ ...postData });
//       if (reportResp?.data) {
//         RedirectURL(reportResp?.data?.pdfUrl);
//       } else {
//         notify(reportResp?.message, "success");
//       }
//     } else {
//       if (tbody[index]?.TypeOfTnx !== "IPD") {
//         if (tbody[index]?.PrintType === "2") {
//           let pDetail = {
//             PatientID: tbody[index]?.depositor,
//             TransactionID: tbody[index]?.TransactionID,
//             App_ID: tbody[index]?.AppID,
//           };
//           OpenPDFURL("DoctorPrescriptionPrint", pDetail);
//           return false;
//         } else {
//           const reportResp = await CommonReceiptPdf({
//             ledgerTransactionNo: tbody[index]?.LedgerTransactionNo,
//             isBill: tbody[index]?.PrintType === "1" ? 1 : 0,
//             receiptNo: tbody[index]?.ReceiptNo,
//             duplicate: tbody[index]?.IsAllowedOriginalPrintValue ? 0 : 1,
//             type: "OPD",
//             supplierID: "",
//             billNo: "",
//             isEMGBilling: "",
//             isOnlinePrint: "",
//             isRefound: 0,
//           });
//           if (reportResp?.success) {
//             RedirectURL(reportResp?.data?.pdfUrl);
//           } else {
//             notify(reportResp?.data?.message, "error");
//           }
//         }
//       } else {
//         const reportResp = await CommonReceiptPdf({
//           ledgerTransactionNo: "",
//           isBill: tbody[index]?.PrintType === "1" ? 1 : 0,
//           receiptNo: tbody[index]?.ReceiptNo,
//           duplicate: tbody[index]?.IsAllowedOriginalPrintValue ? 0 : 1,
//           type: "IPD",
//           supplierID: "",
//           billNo: "",
//           isEMGBilling: "",
//           isOnlinePrint: "",
//           isRefound: 0,
//         });
//         if (reportResp?.success) {
//           RedirectURL(reportResp?.data?.pdfUrl);
//         } else {
//           notify(reportResp?.data?.message, "error");
//         }
//       }
//     }
//   };

//   const handleRowSelect = (index) => {
//     const updated = [...selectedRows];
//     const rowData = tbody[index]; // Full object here

//     const exists = updated.find(item => item?.ReceiptNo === rowData?.ReceiptNo);

//     if (exists) {
//       setSelectedRows(updated.filter(item => item?.ReceiptNo !== rowData?.ReceiptNo));
//     } else {
//       updated.push(rowData);
//     }

//     setSelectedRows(updated);
//     console.log("Selected Rows (full data):", updated);
//   };

//   const handleSelectAll = () => {
//     if (selectAll) {
//       setSelectedRows([]);
//     } else {
//       setSelectedRows([...tbody]);
//       console.log("Selected All Rows (full data):", tbody);
//     }
//     setSelectAll(!selectAll);
//   };

//   const THEAD = [
//     {
//       width: "0.5%",
//       name: isMobile ? t("check") : (
//         <input
//           type="checkbox"
//           checked={selectAll}
//           onChange={handleSelectAll}
//         />
//       ),
//     },
//     t("SrNo"),
//     t("UHID"),
//     t("Patient_Name"),
//     t("Address"),
//     t("Receipt No"),
//     t("Bill_No"),
//     t("Date"),
//     t("Bill_Amount"),
//     t("Print"),
//     t("Original"),
//     t("Action"),
//   ];

//   return (
//     <>
//       {bodyData?.map((item, index) => (
//         <Tooltip
//           key={index}
//           target={`#doctorName-${index}, #visitType-${index}`}
//           position="top"
//         />
//       ))}

//       <Tables
//         thead={THEAD}
//         tbody={bodyData?.map((ele, index) => ({
//           Select: (
//             <div style={{ textAlign: "center" }}>
//               <input
//                 type="checkbox"
//                 checked={selectedRows.some(item => item?.ReceiptNo === ele?.ReceiptNo)}
//                 onChange={() => handleRowSelect(index)}
//               />
//             </div>
//           ),
//           "Sr. No.": index + 1,
//           UHID: ele?.depositor,
//           PatientName: ele?.PName,
//           Address: ele?.Address,
//           ReceiptNo: ele?.ReceiptNo,
//           BillNo: ele?.BillNo,
//           Date: ele?.DATE,
//           BillAmount: ele?.AmountPaid,
//           Print: (
//             <select
//               id="PrintType"
//               name="PrintType"
//               disabled={!ele?.IsConsultation}
//               value={values?.PrintType?.value}
//               onChange={(e) =>
//                 handleCustomSelect(index, "PrintType", e.target.value)
//               }
//             >
//               {(values?.rblCon?.value === "1" || values?.rblCon === "1"
//                 ? BillPRINTTYPE
//                 : ReceiptPRINTTYPE
//               )?.map((option) => (
//                 <option key={option.value} value={option.value}>
//                   {option.label}
//                 </option>
//               ))}
//             </select>
//           ),
//           Original: (
//             <div style={{ textAlign: "center" }}>
//               <input
//                 type="checkbox"
//                 name="IsAllowedOriginalPrintValue"
//                 checked={ele?.IsAllowedOriginalPrintValue}
//                 disabled={ele?.IsAllowedOriginalPrint}
//                 onChange={(e) =>
//                   handleCustomSelect(
//                     index,
//                     "IsAllowedOriginalPrintValue",
//                     e.target.checked
//                   )
//                 }
//               />
//             </div>
//           ),
//           isActionCreator: (
//             <div
//               style={{ textAlign: "center", cursor: "pointer" }}
//               onClick={() => {
//                 CommonReceiptPdfAPI(ele, index);
//               }}
//             >
//               <ReprintSVG />
//             </div>
//           ),
//         }))}
//         style={{ maxHeight: "60vh" }}
//       />
//     </>
//   );
// };

// export default ReceiptReprintTable;




// import React, { useEffect, useState } from "react";
// import Tables from "..";
// import { Tooltip } from "primereact/tooltip";
// import { BillPRINTTYPE, ReceiptPRINTTYPE } from "../../../../utils/constant";
// import { ReprintSVG } from "../../../../components/SvgIcons/index";
// import { OpenPDFURL, RedirectURL } from "../../../../networkServices/PDFURL";
// import {
//   CommonReceiptPdf,
//   StickersReceiptPdf,
// } from "../../../../networkServices/BillingsApi";
// import { notify } from "../../../../utils/utils";
// import { useTranslation } from "react-i18next";

// const ReceiptReprintTable = (props) => {
//   const { tbody, values, handleCustomSelect } = props;
//   const [t] = useTranslation();

//   const stickerTypeMapping = {
//     3: "NewReg",
//     4: "ReVisit",
//     5: "NewFiSmSt",
//     6: "NewFiPlSt",
//     7: "NewFiSt",
//   };

//   const CommonReceiptPdfAPI = async (item, index) => {
//     if (tbody[index]?.PrintType > 2) {
//       const postData = {
//         ledgerTransactionNo: tbody[index]?.LedgerTransactionNo,
//         Type: stickerTypeMapping[tbody[index]?.PrintType],
//         PatientID: tbody[index]?.depositor,
//         TransactionID: tbody[index]?.TransactionID,
//       };

//       const reportResp = await StickersReceiptPdf({ ...postData });
//       if (reportResp?.data) {
//         RedirectURL(reportResp?.data?.pdfUrl);
//       } else {
//         notify(reportResp?.message, "success");
//       }
//     } else {
//       if (tbody[index]?.TypeOfTnx !== "IPD") {
//         if (tbody[index]?.PrintType === "2") {
//           let pDetail = {
//             PatientID: tbody[index]?.depositor,
//             TransactionID: tbody[index]?.TransactionID,
//             App_ID: tbody[index]?.AppID,
//           };
//           OpenPDFURL("DoctorPrescriptionPrint", pDetail);
//           return false;
//         } else {
//           const reportResp = await CommonReceiptPdf({
//             ledgerTransactionNo: tbody[index]?.LedgerTransactionNo,
//             isBill: tbody[index]?.PrintType === "1" ? 1 : 0,
//             receiptNo: tbody[index]?.ReceiptNo,
//             duplicate: tbody[index]?.IsAllowedOriginalPrintValue ? 0 : 1,
//             type: "OPD",
//             supplierID: "",
//             billNo: "",
//             isEMGBilling: "",
//             isOnlinePrint: "",
//             isRefound: 0,
//           });
//           if (reportResp?.success) {
//             RedirectURL(reportResp?.data?.pdfUrl);
//           } else {
//             notify(reportResp?.data?.message, "error");
//           }
//         }
//       } else {
//         const reportResp = await CommonReceiptPdf({
//           ledgerTransactionNo: "",
//           isBill: tbody[index]?.PrintType === "1" ? 1 : 0,
//           receiptNo: tbody[index]?.ReceiptNo,
//           duplicate: tbody[index]?.IsAllowedOriginalPrintValue ? 0 : 1,
//           type: "IPD",
//           supplierID: "",
//           billNo: "",
//           isEMGBilling: "",
//           isOnlinePrint: "",
//           isRefound: 0,
//         });
//         if (reportResp?.success) {
//           RedirectURL(reportResp?.data?.pdfUrl);
//         } else {
//           notify(reportResp?.data?.message, "error");
//         }
//       }
//     }
//   };

//   const [bodyData, setBodyData] = useState(tbody);
//   const [selectedRows, setSelectedRows] = useState([]);
//   const [selectAll, setSelectAll] = useState(false);

//   useEffect(() => {
//     setBodyData(tbody);
//   }, [tbody?.length]);

//   const handleRowSelect = (index) => {
//     const updated = [...selectedRows];
//     const rowId = tbody[index]?.ReceiptNo;

//     if (updated.includes(rowId)) {
//       setSelectedRows(updated.filter((id) => id !== rowId));
//     } else {
//       updated.push(rowId);
//     }

//     setSelectedRows(updated);
//     console.log("Selected Rows:", updated);
//   };

//   const handleSelectAll = () => {
//     if (selectAll) {
//       setSelectedRows([]);
//     } else {
//       const allIds = tbody?.map((item) => item?.ReceiptNo);
//       setSelectedRows(allIds);
//       console.log("Selected All Rows:", allIds);
//     }
//     setSelectAll(!selectAll);
//   };
//   const isMobile = window.innerWidth <= 800;
//   const THEAD = [
//     {
//       width: "0.5%", name: isMobile ? (t("check")) : ( <input
//         type="checkbox"
//         checked={selectAll}
//         onChange={handleSelectAll}
//       />)
//   },
//   //  ( <input
//   //     type="checkbox"
//   //     checked={selectAll}
//   //     onChange={handleSelectAll}
//   //   />),
//     t("SrNo"),
//     t("UHID"),
//     t("Patient_Name"),
//     t("Address"),
//     t("Receipt No"),
//     t("Bill_No"),
//     t("Date"),
//     t("Bill_Amount"),
//     t("Print"),
//     t("Original"),
//     // t("IsBill Close"),
//     t("Action"),
//   ];

//   return (
//     <>
//       {bodyData?.map((item, index) => (
//         <Tooltip
//           key={index}
//           target={`#doctorName-${index}, #visitType-${index}`}
//           position="top"
//         />
//       ))}

//       <Tables
//         thead={THEAD}
//         tbody={bodyData?.map((ele, index) => ({
//           Select: (
//             <div style={{ textAlign: "center" }}>
//               <input
//                 type="checkbox"
//                 checked={selectedRows.includes(ele)}
//                 // checked={selectedRows.includes(ele?.ReceiptNo)}
//                 onChange={() => handleRowSelect(index)}
//               />
//             </div>
//           ),
//           "Sr. No.": index + 1,
//           UHID: ele?.depositor,
//           PatientName: ele?.PName,
//           Address: ele?.Address,
//           ReceiptNo: ele?.ReceiptNo,
//           BillNo: ele?.BillNo,
//           Date: ele?.DATE,
//           BillAmount: ele?.AmountPaid,
//           Print: (
//             <select
//               id="PrintType"
//               name="PrintType"
//               disabled={ele?.IsConsultation ? false : true}
//               value={values?.PrintType?.value}
//               onChange={(e) =>
//                 handleCustomSelect(index, "PrintType", e.target.value)
//               }
//             >
//               {(values?.rblCon?.value === "1" || values?.rblCon === "1"
//                 ? BillPRINTTYPE
//                 : ReceiptPRINTTYPE
//               )?.map((option) => (
//                 <option key={option.value} value={option.value}>
//                   {option.label}
//                 </option>
//               ))}
//             </select>
//           ),
//           Original: (
//             <div style={{ textAlign: "center" }}>
//               <input
//                 type="checkbox"
//                 name="IsAllowedOriginalPrintValue"
//                 checked={ele?.IsAllowedOriginalPrintValue}
//                 disabled={ele?.IsAllowedOriginalPrint}
//                 onChange={(e) =>
//                   handleCustomSelect(
//                     index,
//                     "IsAllowedOriginalPrintValue",
//                     e.target.checked
//                   )
//                 }
//               />
//             </div>
//           ),
//           isActionCreator: (
//             <div
//               style={{ textAlign: "center", cursor: "pointer" }}
//               onClick={() => {
//                 CommonReceiptPdfAPI(ele, index);
//               }}
//             >
//               <ReprintSVG />
//             </div>
//           ),
//         }))}
//         style={{ maxHeight: "60vh" }}
//       />
//     </>
//   );
// };

// export default ReceiptReprintTable;



// import React, { useEffect, useState } from "react";
// import Tables from "..";
// import { Tooltip } from "primereact/tooltip";
// import { BillPRINTTYPE, ReceiptPRINTTYPE } from "../../../../utils/constant";
// import { ReprintSVG } from "../../../../components/SvgIcons/index";
// import { OpenPDFURL, RedirectURL } from "../../../../networkServices/PDFURL";
// import {
//   CommonReceiptPdf,
//   StickersReceiptPdf,
// } from "../../../../networkServices/BillingsApi";
// import { notify } from "../../../../utils/utils";
// import { useTranslation } from "react-i18next";
// const ReceiptReprintTable = (props) => {
//   const {  tbody, values, handleCustomSelect } = props;
//   // const { THEAD, tbody, values, handleCustomSelect } = props;
//  const [t] = useTranslation();
//   const stickerTypeMapping = {
//     3: "NewReg",
//     4: "ReVisit",
//     5: "NewFiSmSt",
//     6: "NewFiPlSt",
//     7: "NewFiSt",
//   };

//   const CommonReceiptPdfAPI = async (item, index) => {
//     if (tbody[index]?.PrintType > 2) {
//       const postData = {
//         ledgerTransactionNo: tbody[index]?.LedgerTransactionNo,
//         Type: stickerTypeMapping[tbody[index]?.PrintType],
//         PatientID: tbody[index]?.depositor,
//         TransactionID: tbody[index]?.TransactionID,
//       };

//       const reportResp = await StickersReceiptPdf({
//         ...postData,
//       });
//       if (reportResp?.data) {
//         RedirectURL(reportResp?.data?.pdfUrl);
//       } else {
//         notify(reportResp?.message, "success");
//       }
//     } else {
//       if (tbody[index]?.TypeOfTnx !== "IPD") {
//         if (tbody[index]?.PrintType === "2") {
//           let pDetail = {
//             PatientID: tbody[index]?.depositor,
//             TransactionID: tbody[index]?.TransactionID,
//             App_ID: tbody[index]?.AppID,
//           };
//           OpenPDFURL("DoctorPrescriptionPrint", pDetail);
//           return false;
//         } else {
//           const reportResp = await CommonReceiptPdf({
//             ledgerTransactionNo: tbody[index]?.LedgerTransactionNo,
//             isBill: tbody[index]?.PrintType === "1" ? 1 : 0,
//             receiptNo: tbody[index]?.ReceiptNo,
//             duplicate: tbody[index]?.IsAllowedOriginalPrintValue ? 0 : 1,
//             type: "OPD",
//             supplierID: "",
//             billNo: "",
//             isEMGBilling: "",
//             isOnlinePrint: "",
//             isRefound: 0,
//           });
//           if (reportResp?.success) {
//             RedirectURL(reportResp?.data?.pdfUrl);
//           } else {
//             notify(reportResp?.data?.message, "error");
//           }
//         }
//         // OpenPDFURL("CommonReceiptPdf", tbody[index]);
//       } else {
//         const reportResp = await CommonReceiptPdf({
//           ledgerTransactionNo: "",
//           isBill: tbody[index]?.PrintType === "1" ? 1 : 0,
//           receiptNo: tbody[index]?.ReceiptNo,
//           duplicate: tbody[index]?.IsAllowedOriginalPrintValue ? 0 : 1,
//           type: "IPD",
//           supplierID: "",
//           billNo: "",
//           isEMGBilling: "",
//           isOnlinePrint: "",
//           isRefound: 0,
//         });
//         if (reportResp?.success) {
//           RedirectURL(reportResp?.data?.pdfUrl);
//         } else {
//           notify(reportResp?.data?.message, "error");
//         }
//       }
//     }
//   };

//   const [bodyData, setBodyData] = useState(tbody);
//   useEffect(() => {
//     setBodyData(tbody);
//   }, [tbody?.length]);

//   const THEAD = [
//     t("SrNo"),
//     t("UHID"),
//     t("Patient_Name"),
//     t("Address"),
//     t("Receipt No"),
//     t("Bill_No"),
//     t("Date"),
//     t("Bill_Amount"),
//     t("Print"),
//     t("Original"),
//     t("IsBill Close"),
//     t("Action"),
//   ];
//   return (
//     <>
//       {bodyData?.map((item, index) => (
//         <Tooltip
//           key={index}
//           target={`#doctorName-${index}, #visitType-${index}`}
//           position="top"
//         />
//       ))}
//       {/* {console.log(values?.PrintType, "values?.PrintType")} */}
//       <Tables
      
//         thead={THEAD}
//         tbody={bodyData?.map((ele, index) => ({
//           "Sr. No.": index + 1,
//           UHID: ele?.depositor,
//           PatientName: ele?.PName,
//           Address: ele?.Address,
//           ReceiptNo: ele?.ReceiptNo,
//           BillNo: ele?.BillNo,
//           Date: ele?.DATE,
//           BillAmount: ele?.AmountPaid,
//           Print: (
//             <select
//               id="PrintType"
//               name="PrintType"
//               disabled={ele?.IsConsultation ? false : true}
//               value={values?.PrintType?.value}
//               onChange={(e) =>
//                 // {console.log(e.target.value,values?.PrintType, "values?.PrintType?.value")}
//                 // handleCustomSelect(index, "PrintType", e.target.value)
//                 handleCustomSelect(index, "PrintType", e.target.value)
//               }
//             >
//               {(values?.rblCon?.value === "1" || values?.rblCon === "1"
//                 ? BillPRINTTYPE
//                 : ReceiptPRINTTYPE
//               )?.map((option) => (
//                 <option key={option.value} value={option.value}>
//                   {option.label}
//                 </option>
//               ))}
//             </select>
//           ),
//           Original: (
//             <div style={{ textAlign: "center" }}>
//               <input
//                 type="checkbox"
//                 name="IsAllowedOriginalPrintValue"
//                 checked={ele?.IsAllowedOriginalPrintValue}
//                 disabled={ele?.IsAllowedOriginalPrint}
//                 onChange={(e) =>
//                   handleCustomSelect(
//                     index,
//                     "IsAllowedOriginalPrintValue",
//                     e.target.checked
//                   )
//                 }
//               />
//             </div>
//           ),
//           isActionCreator: (
//             <div
//               style={{ textAlign: "center" }}
//               onClick={() => {
//                 CommonReceiptPdfAPI(ele, index);
//               }}
//             >
//               <ReprintSVG />
//             </div>
//           ),
//         }))}
//         style={{ maxHeight: "60vh" }}
//       />
//     </>
//   );
// };

// export default ReceiptReprintTable;
