import React, { useEffect, useState } from "react";
import LabeledInput from "../../../formComponent/LabeledInput";
import Input from "../../../formComponent/Input";
import ReactSelect from "../../../formComponent/ReactSelect";
import TextAreaInput from "../../../formComponent/TextAreaInput";
import { AMOUNT_REGX, ROUNDOFF_VALUE } from "../../../../utils/constant";
import {
  BindDisApprovalList,
  GetDiscReasonList,
} from "../../../../networkServices/opdserviceAPI";
import { notify, reactSelectOptionList } from "../../../../utils/utils";
import { PatientBillingSaveEdit } from "../../../../networkServices/BillingsApi";
import { useLocalStorage } from "../../../../utils/hooks/useLocalStorage";
import { useTranslation } from "react-i18next";
const EditItemModal = ({ data, handleModalState, GetBindBillDepartment }) => {
  const [t]=useTranslation();
  const ip = useLocalStorage("ip", "get");

  const [discounts, setDiscounts] = useState({
    discountApprovalList: [],
    discountReasonList: [],
  });

  const [payload, setPayload] = useState({
    rate: data?.Rate,
    DiscountPercentage: data?.DiscPer,
    DiscountAmt: data?.DiscAmt,
    Qty: data?.Quantity,

    DiscountReason: data?.DiscountReason,
    EditReason: "",
  });

  const GetDiscListAPI = async () => {
    try {
      const [discountReasonListRes] = await Promise.all([
        GetDiscReasonList("OPD"),
      ]);

      setDiscounts({
        ...discounts,
        discountReasonList: discountReasonListRes?.data,
      });
    } catch (error) {
      console.log(error, "Something Went Wrong");
    }
  };

  const handlePatientBillingSaveEdit = async () => {
    try {
      const requestBody = {
        eDiscPer: Number(payload?.DiscountPercentage),
        eDiscAmt: Number(payload?.DiscountAmt),
        eRate: Number(payload?.rate),
        editReason: String(payload?.EditReason),
        ltdNo: String(data?.LtNo),
        eQty: Number(payload?.Qty),
        ipAddress: String(ip),
        chkSetRate: false,
        nonPayable: true,
        controlDiscountReason: String(payload?.DiscountReason),
        rateChange: false,
      };
      const response = await PatientBillingSaveEdit(requestBody);
      notify(response?.message, response?.success ? "success" : "error");
      if (response?.success) {
        handleModalState(false, null, null, null);
        await GetBindBillDepartment();
      }
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };

  const handleIndicator = (state) => {
    return (
      <div className="text-danger">
        (max 200 Charcter) <span className="text-dark">Remaining : </span>{" "}
        <span className="text-success">{Number(200 - state?.length)}</span>
      </div>
    );
  };

  const handleCalulateOfTableData = (modifiedData, name) => {
    if (!["EditReason"].includes(name)) {
      if (name !== "DiscountAmt") {
        modifiedData.DiscountAmt = Number(
          Number(modifiedData.rate) *
            Number(modifiedData?.Qty) *
            Number(modifiedData?.DiscountPercentage) *
            0.01
        ).toFixed(ROUNDOFF_VALUE);
      }

      // Check if rate and Qty are not zero to avoid division by zero
      if (name !== "DiscountPercentage") {
        if (
          Number(modifiedData.rate) !== 0 &&
          Number(modifiedData?.Qty) !== 0
        ) {
          modifiedData.DiscountPercentage = Number(
            (Number(modifiedData.DiscountAmt) * 100) /
              (Number(modifiedData.rate) * Number(modifiedData?.Qty))
          ).toFixed(ROUNDOFF_VALUE);
        } else {
          // Set DiscountPercentage to 0 or a default value if division by zero would occur
          modifiedData.DiscountPercentage = "0.00";
        }
      }
    }

    return modifiedData;
  };

  const handleReactChange = (name, e) => {
    setPayload({ ...payload, [name]: e?.label });
  };

  const handleChange = (e, ...rest) => {
    const { name, value } = e.target;
    if (rest.length > 0 && rest.some((ele, _) => ele === false)) {
      return;
    }

    const modifiedData = {
      ...payload,
      [name]: value,
    };
    debugger;
    const resultData = handleCalulateOfTableData(modifiedData, name);
    setPayload(resultData);
  };

  useEffect(() => {
    GetDiscListAPI();
  }, []);

  return (
    <>
      <div className="row">
        <LabeledInput
          className={"col-12 col-md-4 col-lg-6 col-xl-6"}
          value={data?.ItemName}
          label={t("Item Name")}
        />

        <Input
          className={"form-control"}
          respclass={"col-12 col-md-4 col-lg-3 col-xl-3"}
          lable={t("Rate")}
          display={"right"}
          value={payload?.rate}
          type={"text"}
          name={"rate"}
          onChange={(e) =>
            handleChange(e, AMOUNT_REGX(8).test(e?.target?.value))
          }
        />

        <Input
          className={"form-control"}
          respclass={"col-12 col-md-4 col-lg-3 col-xl-3"}
          lable={t("Disc. %")}
          a
          display={"right"}
          value={payload?.DiscountPercentage}
          type={"text"}
          name={"DiscountPercentage"}
          onChange={(e) =>
            handleChange(
              e,
              AMOUNT_REGX(8).test(e?.target?.value),
              Number(e?.target?.value) <= 100
            )
          }
        />

        <Input
          className={"form-control"}
          respclass={"col-12 col-md-4 col-lg-3 col-xl-3"}
          lable={t("Disc. Amt.")}
          display={"right"}
          value={payload?.DiscountAmt}
          type={"text"}
          name={"DiscountAmt"}
          onChange={(e) =>
            handleChange(e, AMOUNT_REGX(8).test(e?.target?.value))
          }
        />

        <Input
          className={"form-control"}
          respclass={"col-12 col-md-4 col-lg-3 col-xl-3"}
          lable={t("Qty")}
          display={"right"}
          value={payload?.Qty}
          type={"text"}
          name={"Qty"}
          onChange={(e) =>
            handleChange(e, AMOUNT_REGX(8).test(e?.target?.value))
          }
        />

        <ReactSelect
          respclass={"col-12 col-md-4 col-lg-6 col-xl-6"}
          placeholderName={t("Discount Reason")}
          value={payload?.DiscountReason}
          name={"DiscountReason"}
          dynamicOptions={reactSelectOptionList(
            discounts?.discountReasonList,
            "DiscountReason",
            "ID"
          )}
          handleChange={handleReactChange}
        />
        <div className="col-12">
          <TextAreaInput
            lable={t("Edit. Reason")}
            rows={3}
            value={payload?.EditReason}
            name={"EditReason"}
            onChange={handleChange}
          />
          <div className="col-12">{handleIndicator(payload?.EditReason)}</div>
        </div>
      </div>

      <div className="d-flex align-items-center justify-content-end">
        <button
          className="btn btn-sm btn-primary"
          onClick={handlePatientBillingSaveEdit}
        >
          {t("Save")}
        </button>
      </div>
    </>
  );
};

export default EditItemModal;
