import React, { useState } from "react";
import Tables from "..";
import { ReprintSVG } from "../../../SvgIcons";
import { BindItemForLabelPrint } from "../../../../networkServices/InventoryApi";
import ViewItemLabelModal from "../../../modalComponent/Utils/MedicalStore/ViewItemLabelModal";
import Modal from "../../../modalComponent/Modal";
import { t } from "i18next";

const ViewIssueReturnTable = ({ tbody, handleDoubleClick, BillingType }) => {
  const thead = [
    { name: t("Label"), width: "1%" },
    { name: t("S.No."), width: "1%" },
    { name: t("Date"), width: "5%" },
    { name: t("Bill Number"), width: "5%" },
    { name: BillingType === "1" ? t("ReceiptNo") : t("IPD No."), width: "5%" },
    { name: t("UHID"), width: "4%" },
    { name: t("Patient  Name"), width: "10%" },
    { name: t("Age"), width: "2%" },
    { name: t("Type"), width: "4%" },
    { name: t("Bill Amount"), width: "2%" },
  ];
  const [viewDetails, setViewDetails] = useState([]);
  const [ReportVisible, setReportVisible] = useState(false);
  // console.log("BillingType", BillingType)

  const GetViewDetails = async (val) => {
    const LedgerTnxID = val?.LedgerTransactionNo;
    try {
      const response = await BindItemForLabelPrint(LedgerTnxID);
      setViewDetails(response?.data);
    } catch (error) {
      console.error(error);
    }
  };
  const PrintLabel = () => {
    let labelString = "";
  
    if (!viewDetails || viewDetails.length === 0) {
      alert("Please select an item to print.");
      return;
    }
  
    viewDetails.forEach((row) => {
      if (row?.isChecked) {
        let itemName = row.TypeName || "N/A";  
        let dose = row.Dose?.value || "N/A";
        let times = row.Time?.value || "N/A";
        let duration = row.Duration?.value || "N/A";
        let sideEffect = row.Side_Effect || "N/A";
        let meals = row.Meal?.value || "N/A";
        let caution = row.Caution?.value || "N/A";
        let pName = row.PName || "Unknown";
        let patientID = row.PatientID || "Unknown";
        let medExpiry = row.MedExpiryDate || "Unknown";
  
        // Convert NoOfPrints to a number and default to 1
        let printQty = Number(row.NoOfPrints) || 1;
  
        for (let i = 0; i < printQty; i++) {
          labelString += `HOSPEDIA HIMS v9.5#
  D-170A, Sector- 50, Noida (201301)#
  Tel:  +91 9971055922#
  ${pName}#
  ${patientID}#
  ${itemName}#
  ${dose}#
  ${times}#
  ${duration}#
  ${sideEffect}#
  ${meals}#
  ${caution}#
  ${medExpiry}`.trim() + "\n";
        }
      }
    });
  
    if (!labelString) {
      alert("No items selected for printing.");
      return;
    }
  
    console.log("Generated Label String:\n", labelString);
  
    // Send data for printing
    WriteToFile(labelString);
  };
  
  const WriteToFile = (data) => {
    try {
      const barcodeURL = `barcode://?cmd=${encodeURIComponent(data)}&test=1&source=Barcode_Source_Pharmacy`;
      window.location.href = barcodeURL;
    } catch (error) {
      alert("Printing Error: " + error.message);
    }
  };
  
  

  const handleCustomSelect = (index, name, e, ele) => {
    const updatedData = [...viewDetails];
    if (name === "Dose") {
      updatedData[index][name] = {
        Text: e?.value?.Text ?? "",
        HindiText: e?.value?.HindiText ?? "",
        ID: e?.value?.ID ?? null,
      };
    } else {
      updatedData[index][name] = e.value;
    }
    setViewDetails(updatedData);
  };

  //   const handleCustomSelect = (index, name, e,ele) => {
  // console.log(index,name,e,ele)
  //     const data = [...viewDetails];
  //     data[index][name] = e.value;
  //     setViewDetails(data);
  //   };
  const handleItemsChange = (index, name, e) => {
    const data = [...viewDetails];
    data[index][name] = e ? e : e.value;
    setViewDetails(data);
  };

  console.log("viewDetails", viewDetails);
  return (
    <>
      {ReportVisible && (
        <Modal
          modalWidth={"70vw"}
          visible={ReportVisible}
          setVisible={setReportVisible}
          Header={t("Select Report Type")}
          footer={
            <>
              <button
                className="btn btn-sm btn-success mx-2"
                onClick={PrintLabel}
                disabled={true}
              >
                {t("Print")}
              </button>
            </>
          }
        >
          <ViewItemLabelModal
            viewDetails={viewDetails}
            setViewDetails={setViewDetails}
            handleCustomSelect={handleCustomSelect}
            handleItemsChange={handleItemsChange}
          />
        </Modal>
      )}
      <Tables
        style={{ height: "55vh" }}
        thead={thead}
        tbody={tbody?.map((ele, index) => ({
          label: (
            <>
              {BillingType === "1" && (
                <div
                  onClick={() => {
                    GetViewDetails(ele);
                    setReportVisible({
                      ReportVisible: true,
                      showData: {},
                    });
                  }}
                >
                  <ReprintSVG />
                </div>
              )}
            </>
          ),
          SrNo: index + 1,
          Date: ele?.Date,
          BillNo: ele?.BillNo,
          ReceiptNo: BillingType === "1" ? ele?.ReceiptNo : ele?.IPDNo,
          PatientID: ele?.PatientID,
          PName: ele?.PName,
          age: <div className="text-right">{ele?.age}</div>,
          TypeOfTnx: ele?.TypeOfTnx,
          colorcode:
            ele?.TypeOfTnx === "Issue"
              ? "rgb(160, 216, 160)"
              : ele?.TypeOfTnx === "Return"
                ? "rgb(196, 173, 233)"
                : "yellow",
          NetAmount: <div className="text-right">{ele?.NetAmount}</div>,
        }))}
        handleDoubleClick={handleDoubleClick}
      />
    </>
  );
};

export default ViewIssueReturnTable;
