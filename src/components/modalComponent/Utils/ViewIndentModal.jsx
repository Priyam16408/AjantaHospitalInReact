import React, { useState } from "react";
import Tables from "../../UI/customTable";
import { useTranslation } from "react-i18next";
import Input from "../../formComponent/Input";
import { Approve, Reject } from "../../../networkServices/InventoryApi";
import { notify } from "../../../utils/utils";

const ViewIndentModal = ({
  view,
  handleSelect,
  setModalData,
  val,
  handleSearchViewReqDetails,
}) => {
  const [t] = useTranslation();
  const initialValues = {
    RejectResion: "",
  };
  const [payload, setPayload] = useState({ ...initialValues });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayload({
      ...payload,
      [name]: value,
    });
  };

  const ViewRequisitionHead = [
    t("S.No."),
    t("Action"),
    t("Requisition No."),
    t("Department From"),
    t("Department To"),
    t("Item Name"),
    t("Status"),
    t("Req.Dept Current Stock"),
    t("Unit Type"),
    t("Req. Qty."),
    t("Rec. Qty."),
    t("Pending"),
    t("Rej. Qty."),
    t("Remarks"),
    t("Date"),
    t("Raised By"),
    t("Last Consume"),

    t("Rejected By"),
  ];
  const [indexRow, setIndexRow] = useState();
  const addItem = (item) => {
    console.log("ITEM" ,item);
    setIndexRow(item);
  };

  const GetReject = async () => {
    const RejectResion = payload?.RejectResion;
    const ItemID = indexRow?.itemID;
    const IndentNo = indexRow?.indentNo;
    console.log("RejectResion", RejectResion , "iTEMid" ,ItemID,"IndentNo" , IndentNo);
    try {
      if (indexRow?.indentNo) {
        if (payload?.RejectResion) {
          const response = await Reject(RejectResion, ItemID, IndentNo);
          if (response?.success) {
            notify(response?.message, "success");
            setModalData((val) => ({ ...val, visible: false }));
            handleSearchViewReqDetails();
          } else {
            notify(response?.message, "error");
          }
        } else {
          notify("Reject Reason is required", "error");
        }
      } else {
        notify("Please Check Atleast One row of the table", "error");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const GetApprove = async () => {
    const IndentNo = indexRow?.indentNo;
    try {
      const response = await Approve(IndentNo);
      if (response?.success) {
        notify(response?.message, "success");
        setModalData((val) => ({ ...val, visible: false }));
        handleSearchViewReqDetails();
      } else {
        notify(response?.message, "error");
      }
    } catch (error) {
      console.error(error);
    }
  };
  const getRowClass = (value,index) => {

    
    let val = view[index];
    console.log("val", val?.statusNew);
    if(val?.statusNew === "CLOSE"){
      return "color-indicator-11-bg";
    }
    if(val?.StatusNew === "PENDING"){
      return "color-indicator-16-bg";
    }
    if (val?.statusNew === "APPROVED") {
      return "color-indicator-1-bg";
    }
    if (val?.statusNew === "REJECT") {
      return "color-indicator-2-bg";
    }
    if (val?.statusNew === "OPEN") {
      return "color-indicator-16-bg";
    }
    if(val?.statusNew === "ISSUED"){
      return "color-indicator-19-bg";
    }
    if (val?.statusNew === "PARTIAL") {
      return "color-indicator-4-bg";
    }
  };

  return (

    <>
    
      <Tables
        thead={ViewRequisitionHead}
        tbody={view?.map((item, index) => ({
          "Sr No": index + 1,
          Reject: (
            <input
              type="checkbox"
              name="isReject"
              disabled={item?.statusNew === "OPEN" ? false : true}
              checked={item?.isReject}
              onChange={(e) => {
                handleSelect(e, index, item, view), addItem(item);
              }}
            />
          ),
          "Requisition No.": item?.indentNo,
          "Department From": item?.deptFrom,
          "Department To": item?.deptTo,
          "Item Name": item?.itemName,
          Status: item?.currentStock,
          "Req.Dept Current Stock": item?.availQty,
          "Unit Type": item?.unitType,
          "Req. Qty.": item?.reqQty,
          "Rec. Qty.": item?.receiveQty,
          Pending: item?.pendingQty,
          "Rej. Qty.": item?.rejectQty,
          Remarks: item?.narration,
          Date: item?.date,
          "Raised By": item?.empName,
          "Last Consume": item?.last_Mon_Cosmp,

          "Reject By": item?.rejectBy,
          // colorcode: getRowClass(item)
        }))}
        getRowClass={getRowClass}
        tableHeight={"scrollView"}
        style={{ height: "auto" }}
      />
      {indexRow?.statusNew === "OPEN" || val?.StatusNew === "OPEN" ? (
        <div className="row mt-2">
          <Input
            type="text"
            className="form-control required-fields"
            lable={t("Reject Reason")}
            placeholder=" "
            id="RejectResion"
            name="RejectResion"
            onChange={handleChange}
            value={payload?.RejectResion}
            required={true}
            respclass="col-xl-6 col-md-4 col-sm-4 col-12"
          />
          <div className="col-sm-1 d-flex justify-content-between">
            <button className="btn btn-sm btn-success mx-1" onClick={GetReject}>
              {t("Reject")}
            </button>
            <button
              className="btn btn-sm btn-success mx-1"
              onClick={GetApprove}
            >
              {t("Approved")}
            </button>
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default ViewIndentModal;
