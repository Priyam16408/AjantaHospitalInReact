import React, { useState } from "react";
import TextAreaInput from "../../../formComponent/TextAreaInput";
import { PatientBillingReject } from "../../../../networkServices/BillingsApi";
import { useLocalStorage } from "../../../../utils/hooks/useLocalStorage";
import { notify } from "../../../../utils/utils";
import store from "../../../../store/store";
import { setLoading } from "../../../../store/reducers/loadingSlice/loadingSlice";

const RejectModal = ({ data, handleModalState, GetBindBillDepartment }) => {
  const [rejectReason, setRejectReason] = useState("");

  const ip = useLocalStorage("ip", "get");

  const handleIndicator = (state) => {
    return (
      <div className="text-danger">
        (max 200 Charcter) <span className="text-dark">Remaining : </span>{" "}
        <span className="text-success">{Number(200 - state?.length)}</span>
      </div>
    );
  };

  const handleChange = (e) => {
    const { value } = e.target;
    if (value.length <= 200) setRejectReason(value);
  };

  const handleJoinID = (data) => {
    const checkedData = [];
    for (let i = 0; i < data?.length; i++) {
      const { subRow } = data[i];
      for (let j = 0; j < subRow?.subRowList?.length; j++) {
        if (subRow?.subRowList[j]?.["isChecked"] === true) {
          checkedData.push(`'${subRow?.subRowList[j]?.["LtNo"]}'`);
        }
      }
    }
    return checkedData.join(",");
  };

  console.log("datadata",data)
  const handlePatientBillingReject = async () => {
    store.dispatch(setLoading(true));
    try {
      const requestBody = {
        isSurgery: false,
        ledTnxID: Array.isArray(data)
        ? handleJoinID(data)
        : `'${String(data?.ID)}'`,
        cancelReason: String(rejectReason),
        ltNo: Array.isArray(data) ? "0" : String(data?.LedgerTransactionNo),
        ipAddress: String(ip),
      };
      // debugger
      const response = await PatientBillingReject(requestBody);

      if (response?.success) {
        handleModalState(false, null, null, null, null);
        if(GetBindBillDepartment) await GetBindBillDepartment()
         ;
      }

      notify(response?.message, response?.success ? "success" : "error");
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    } finally {
      store.dispatch(setLoading(false));
    }
  };

  return (
    <>
      <div className="row">
        <TextAreaInput
          respclass={"col-12"}
          lable={"Reason"}
          id={"Reason"}
          rows={3}
          value={rejectReason}
          onChange={(e) => handleChange(e)}
        />

        <div className="col-12">{handleIndicator(rejectReason)}</div>
      </div>

      <div className="d-flex align-items-center justify-content-end">
        <button
          className="btn btn-sm btn-primary mx-1"
          style={{ backgroundColor: "red", border: "none" }}
          onClick={handlePatientBillingReject}
        >
          Reject
        </button>
      </div>
    </>
  );
};

export default RejectModal;
