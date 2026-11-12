import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import NestedRowTable from "../NestedRowTable";
import { useLocalStorage } from "../../../../utils/hooks/useLocalStorage";
import { ReprintSVG } from "../../../SvgIcons";
import { OpenPDFURL, RedirectURL } from "../../../../networkServices/PDFURL";
import {
  PrintRequisition,
  ViewIndent,
} from "../../../../networkServices/InventoryApi";
import { notify } from "../../../../utils/utils";

const ViewReqTable = ({ tbody, tableHeight, payload,Tid }) => {
  const [t] = useTranslation();
  const [bodyData, setBodyData] = useState([]);

  const thead = [
    { name: t("SNo"), width: "1%" },
    { name: t("Requisition Date"), width: "10%" },
    t("Requisition No"),
    // t("ItemName"),
    // t("UnitType"),
    t("Department From"),
    t("RaisedBy"),
    { name: t("Print"), width: "1%" },
    { name: "View", width: "1%" },
  ];
  console.log("payload", payload);
  const seondThead = [
    { name: t("SNo"), width: "1%" },
    t("Department From"),
    t("DepartmentTo"),
    { name: "Item Name", width: "1%" },
    { name: "Unit Type", width: "1%" },
    { name: t("Requested Qty"), width: "1%" },
    { name: t("Received Qty"), width: "1%" },
    { name: t("Pending Qty"), width: "1%" },
    { name: t("Rejected Qty"), width: "1%" },
    { name: "Narration", width: "1%" },
    { name: "Date", width: "1%" },
  ];
  const thirdThead = [
    { name: t("S.No."), width: "1%" },
    { name: t("Department From"), width: "15%" },
    t("Item Name"),
    { name: t("RequestedQty"), width: "15%" },
    { name: "Narration", width: "15%" },
    { name: "Date", width: "15%" },
  ];
  console.log(tbody);
  const handleClickEdit = async (val, index, isopen) => {
    console.log(val);
    const IndentNo = val?.IndentNo;
    const Status = val?.StatusNew ? val?.StatusNew : "Open";
    const Type = payload?.Type;
    const TID = Tid;
    const apiResp = await ViewIndent(IndentNo, Status, Type,TID);
    tbody[index]["isopen"] = !isopen;
    if (apiResp?.success) {
      tbody[index]["SecondBodyDataList"] = apiResp?.data?.dtnew;
    } else {
      notify(apiResp?.message, "error");
    }
    bindBodyData(tbody);
  };

  const handleClickReport = async (val) => {
    console.log(val);
    const IndentNo = val?.IndentNo;
    const Status = val?.StatusNew ? val?.StatusNew : "Open";
    const Type = payload?.Type;
    let apiResp = await PrintRequisition(IndentNo, Status, Type);
    if (apiResp?.success) {
      RedirectURL(apiResp?.data?.pdfUrl);
    } else {
      notify(apiResp?.message, "error");
    }
  };

  // const getRowClass = (val, index) => {
  //   console.log(tbody[index]["StatusNew"])
  //   const status = tbody[index]["StatusNew"];
  //   console.log(status)
  //   if (status === "Open") {
  //     return "md-record-RequisitionDone";
  //   }
  //   if (status === "Reject") {
  //     return "md-record-PendingRequisition";
  //   }
  //   if (status === "Closed") {
  //     return "md-record-Completed ";
  //   }
  //   if (status === "Partial") {
  //     return "md-record-Running";
  //   }
  // };

  const getRowClass = (val, index) => {
    if (!tbody || !tbody[index]) {
      console.error(`Row data not found for index: ${index}`);
      return "";
    }

    const status = tbody[index]?.StatusNew;

    switch (status) {
      case "Open":
        return "md-record-RequisitionDone";
      case "Closed":
        return "md-record-PendingRequisition";
      case "Reject":
        return "md-record-Completed";
      case "Partial":
        return "md-record-Running";
      default:
        return ""; // Return a default or empty string if status doesn't match
    }
  };

  const bindBodyData = (tbody) => {
    let list = [];
    tbody?.map((val, index) => {
      let secondTbody = [];

      val?.SecondBodyDataList?.length > 0 &&
        val?.SecondBodyDataList?.map((item, i) => {
          const obj =
            payload?.Type === "MI"
              ? {
                  sno: i + 1,
                  deptFrom: item?.deptFrom,
                  deptTo: item?.deptTo,
                  itemName: item?.itemName,
                  unitType: item?.unitType,
                  reqQty: item?.reqQty,
                  receiveQty: item?.receiveQty,
                  pendingQty: item?.pendingQty,
                  rejectQty: item?.rejectQty,
                  Narration: item?.narration,
                  DATE: item?.date,
                }
              : {
                  sno: i + 1,
                  deptFrom: item?.deptFrom,
                  itemName: item?.itemName,
                  reqQty: <div className="text-right">{item?.reqQty}</div>,
                  Narration: item?.narration,
                  DATE: item?.dtEntry,
                };

          secondTbody.push(obj);
        });
      let obj = {};

      obj.sno = index + 1;
      (obj.dtentry = val?.dtentry),
        (obj.IndentNo = val?.IndentNo),
        (obj.Deptfrom = val?.Deptfrom),
        (obj.EmpName = val?.EmpName),
        (obj.print = (
          <span
            onClick={() => {
              handleClickReport(val);
            }}
          >
            <ReprintSVG />
          </span>
        )),
        (obj.index = (
          <span
            onClick={() => {
              handleClickEdit(val, index, val?.isopen);
            }}
          >
            {val?.isopen > 0 ? (
              <i className="fa fa-minus" aria-hidden="true"></i>
            ) : (
              <i className="fa fa-plus" aria-hidden="true"></i>
            )}
          </span>
        ));
      obj.subRow = { subRowList: secondTbody, isopen: val?.isopen };
      list.push(obj);
    });
    setBodyData(list);
  };
  useEffect(() => {
    bindBodyData(tbody);
  }, [tbody]);

  // const getRowClass = (val) => {
  //   if (val?.STATUS === "Completed") {
  //     return "medicationTbaleRowColor";
  //   }
  //   if (val?.STATUS === "Stopped") {
  //     return "medicationTbaleRowColorStopped";
  //   }
  //   if (val?.STATUS === "Not Issued") {
  //     return "medicationTbaleRowColorNotIssued";
  //   }
  //   if (val?.STATUS === "Running") {
  //     return "medicationTbaleRowColorRunning";
  //   }
  //   if (val?.STATUS === "Today Medicine") {
  //     return "medicationTbaleRowColorTodayMedicine";
  //   }
  // };
  console.log(bodyData);
  return (
    <>
      <NestedRowTable
        thead={thead}
        seondThead={payload?.Type === "MI" ? seondThead : thirdThead}
        tbody={bodyData}
        tableHeight={tableHeight}
        getRowClass={getRowClass}
      />
    </>
  );
};

export default ViewReqTable;
