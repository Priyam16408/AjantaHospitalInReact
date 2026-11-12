import React, { useEffect, useState } from "react";
import Input from "../../../formComponent/Input";
import { reactSelectOptionList } from "../../../../utils/utils";
import { GetDiscReasonList } from "../../../../networkServices/opdserviceAPI";
import { ALLTABSAVE, AMOUNT_REGX } from "../../../../utils/constant";
import ReactSelect from "../../../formComponent/ReactSelect";

const Discountchange = ({ handlePatientBillingAllTabSave }) => {
  const [payload, setPayload] = useState({
    discount: 0,
    DiscountReason: "",
  });

  const [discounts, setDiscounts] = useState({
    discountApprovalList: [],
    discountReasonList: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (AMOUNT_REGX(3).test(value) && Number(value) <= 100) {
      setPayload({
        ...payload,
        [name]: value,
      });
    }
  };

  const handleReactChange = (name, e) => {
    setPayload({ ...payload, [name]: e.value });
  };

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

  const handleSave = () => {
    const obj = { ...ALLTABSAVE };
    obj.cancelReason = payload?.DiscountReason;
    obj.itemDiscPer = Number(payload?.discount);
    obj.type = "D";
    handlePatientBillingAllTabSave(obj);
  };

  useEffect(() => {
    GetDiscListAPI();
  }, []);
  return (
    <>
      <div className="row">
        <Input
          type={"text"}
          lable={"Discount(%)"}
          placeholder={""}
          respclass={"col-12"}
          className={"form-control required-fields"}
          name={"discount"}
          value={payload?.discount}
          onChange={handleChange}
        />
        <ReactSelect
          respclass={"col-12"}
          placeholderName={"Discount Reason"}
          requiredClassName={"required-fields"}
          value={payload?.DiscountReason}
          name={"DiscountReason"}
          dynamicOptions={reactSelectOptionList(
            discounts?.discountReasonList,
            "DiscountReason",
            "ID"
          )}
          handleChange={handleReactChange}
        />
      </div>

      <div className="d-flex align-items-center justify-content-end">
        <button className="btn btn-sm btn-primary" onClick={handleSave}>
          Save
        </button>
      </div>
    </>
  );
};

export default Discountchange;
