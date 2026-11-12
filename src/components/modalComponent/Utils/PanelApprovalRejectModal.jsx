import React, { useState } from "react";
import Input from "../../formComponent/Input";
import { useTranslation } from "react-i18next";
import { PanelApprovalReject } from "../../../networkServices/BillingsApi";
import { notify } from "../../../utils/utils";
import { useLocalStorage } from "../../../utils/hooks/useLocalStorage";

const PanelApprovalRejectModal = (visible, tableData, data) => {
  console.log("visible", visible);
  console.log("tableData", tableData);
  console.log("Data", data);
  const [t] = useTranslation();
  const ip = useLocalStorage("ip", "get");
  const [payload, setPayload] = useState({ CancelReason: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayload({
      ...payload,
      [name]: value,
    });
  };

  const handlePanelApprovalReject = async () => {
    const payload1 = {
      id: visible?.tableData?.ID,
      transactionID: visible?.tableData?.TransactionID,
      panelApprovedAmt: visible?.tableData?.PanelApprovedAmt,
      cancelReason: payload?.CancelReason,
      ipAddress: ip,
    };

    try {
      let apiResp = await PanelApprovalReject(payload1);
      if (apiResp?.success) {
        notify(apiResp?.data);
      } else {
        notify(apiResp?.message, "error");
        notify([]);
      }

      if (apiResp?.status !== 200) {
        notify(apiResp?.data?.message, "error");
      }
    } catch (error) {
      notify("Error occurred while processing request", "error");
    }
  };

  return (
    <>
      <div className="row m-2">
        <Input
          type="text"
          className="form-control"
          id="CancelReason"
          name="CancelReason"
          lable={t("Cancel Reason")}
          placeholder=" "
          respclass="col-10"
          onChange={handleChange}
        />

        <div className="col-2 ml-auto">
          <button
            className="btn btn-sm btn-danger"
            style={{ background: "red", color: "white", border: "none" }}
            onClick={handlePanelApprovalReject}
          >
            Reject
          </button>
        </div>
      </div>
    </>
  );
};
export default PanelApprovalRejectModal;
