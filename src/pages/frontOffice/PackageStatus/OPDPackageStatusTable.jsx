import React, { useEffect, useState } from "react";
import { Tooltip } from "primereact/tooltip";
import { BillPRINTTYPE, ReceiptPRINTTYPE } from "../../../utils/constant";
import { ReprintSVG } from "../../../components/SvgIcons";
import { OpenPDFURL, RedirectURL } from "../../../networkServices/PDFURL";

import { CommonReceiptPdf, StickersReceiptPdf } from "../../../networkServices/BillingsApi";
import { notify } from "../../../utils/utils";
import Tables from "../../../components/UI/customTable";


const OPDPackageStatusTable = (props) => {
  const { THEAD, tbody, values, handleCustomSelect } = props;

  const stickerTypeMapping = {
    3: "NewReg",
    4: "ReVisit",
    5: "NewFiSmSt",
    6: "NewFiPlSt",
    7: "NewFiSt",
  };

  const CommonReceiptPdfAPI = async (item, index) => {
    
    if (tbody[index]?.PrintType > 2) {
      const postData = {
        ledgerTransactionNo: tbody[index]?.LedgerTransactionNo,
        Type: stickerTypeMapping[tbody[index]?.PrintType],
        PatientID: tbody[index]?.depositor,
        TransactionID: tbody[index]?.TransactionID,
      };

      const reportResp = await StickersReceiptPdf({...postData, });
      if (reportResp?.data) {
        RedirectURL(reportResp?.data?.pdfUrl);
      } else {
        notify(reportResp?.message, "success");
      }
    }

    
    
    else {
      if (tbody[index]?.TypeOfTnx !== "IPD") {
        if (tbody[index]?.PrintType === "2") {
          let pDetail = {
            PatientID: tbody[index]?.depositor,
            TransactionID: tbody[index]?.TransactionID,
            App_ID: tbody[index]?.AppID,
          };
          OpenPDFURL("DoctorPrescriptionPrint", pDetail);
          return false;
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
        // OpenPDFURL("CommonReceiptPdf", tbody[index]);
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

















  const [bodyData, setBodyData] = useState(tbody);

  useEffect(() => {
    setBodyData(tbody);
  }, [tbody?.length]);

  return (
    <>
      {bodyData?.map((item, index) => (
        <Tooltip
          key={index}
          target={`#doctorName-${index}, #visitType-${index}`}
          position="top"
        />
      ))}


      {/* {console.log(values?.PrintType, "values?.PrintType")} */}
      <Tables
        thead={THEAD}
        tbody={bodyData?.map((ele, index) => ({
          "Sr. No.": index + 1,
        //   UHID: ele?.depositor,
          PatientName: ele?.PName,
          Address: ele?.Address,
        //   ReceiptNo: ele?.ReceiptNo,
          BillNo: ele?.BillNo,
          Date: ele?.DATE,
          BillAmount: ele?.AmountPaid,


          Print: (
            <select
              id="PrintType"
              name="PrintType"
              disabled={ele?.IsConsultation ? false : true}
              value={values?.PrintType?.value}
              onChange={(e) =>
                // {console.log(e.target.value,values?.PrintType, "values?.PrintType?.value")}
                // handleCustomSelect(index, "PrintType", e.target.value)
                handleCustomSelect(index, "PrintType", e.target.value)
              }
            >
              {(values?.rblCon?.value === "1" || values?.rblCon === "1"
                ? BillPRINTTYPE
                : ReceiptPRINTTYPE
              )?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ),
          Original: (
            <div style={{ textAlign: "center" }}>
              <input
                type="checkbox"
                name="IsAllowedOriginalPrintValue"
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
              style={{ textAlign: "center" }}
              onClick={() => {
                CommonReceiptPdfAPI(ele, index);
              }}
            >
              <ReprintSVG />
            </div>
          ),
        }))}
        style={{ maxHeight: "60vh" }}
      />
    </>
  );
};


export default OPDPackageStatusTable;
