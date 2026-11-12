import React, { useEffect, useState } from "react";
import TextAreaInput from "../../../formComponent/TextAreaInput";
import {
  BillingRemarkLoadRemarks,
  BillingRemarkSaveRemark,
} from "../../../../networkServices/BillingsApi";
import { notify } from "../../../../utils/utils";
import { useTranslation } from "react-i18next";

const BiilingRemarkModal = ({
  pateintDetails,
  handleModalState,
  GetBindBillDepartment,
}) => {
  const [t] = useTranslation();
  const [billingRemark, setBillingRemark] = useState("");

  const handleIndicator = (state) => {
    return (
      <div className="text-danger">
        {t("max 200 Charcter")}{" "}
        <span className="text-dark">{t("Remaining")} : </span>{" "}
        <span className="text-success">{Number(200 - state?.length)}</span>
      </div>
    );
  };

  const handleChange = (e) => {
    const { value } = e.target;
    if (value.length <= 200) setBillingRemark(value);
  };

  const handleBillingRemarkLoadRemarks = async (TransactionID) => {
    try {
      const response = await BillingRemarkLoadRemarks(TransactionID);
      if (response?.success) {
        setBillingRemark(response?.data);
      } else {
        setBillingRemark("");
      }
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };

  const handleBillingRemarkSaveRemark = async () => {
    try {
      const response = await BillingRemarkSaveRemark(
        pateintDetails?.TransactionID,
        billingRemark
      );

      notify(response?.message, response?.success ? "success" : "error");
      if (response?.success) {
        handleModalState(false, null, null, null, <></>);
        GetBindBillDepartment();
      }
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };

  useEffect(() => {
    handleBillingRemarkLoadRemarks(pateintDetails?.TransactionID);
  }, []);
  return (
    <>
      <div className="row">
        <TextAreaInput
          respclass={"col-12"}
          lable={t("Remark")}
          id={"Remark"}
          rows={3}
          value={billingRemark}
          onChange={(e) => handleChange(e)}
        />

        <div className="col-12">{handleIndicator(billingRemark)}</div>
      </div>

      <div className="d-flex align-items-center justify-content-end">
        <button
          className="btn btn-sm btn-primary mx-1"
          onClick={handleBillingRemarkSaveRemark}
        >
          {t("Remark")}
        </button>
      </div>
    </>
  );
};

export default BiilingRemarkModal;
