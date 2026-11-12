import React, { useState } from "react";
import ReactSelect from "../../../formComponent/ReactSelect";
import Input from "../../../formComponent/Input";
import TextAreaInput from "../../../formComponent/TextAreaInput";
import { ALLTABSAVE, AMOUNT_REGX } from "../../../../utils/constant";

const RateChange = ({ handlePatientBillingAllTabSave }) => {
  const [payload, setPayload] = useState({
    setRate: 0,
    editReason: "",
  });

  const handleChange = (e, ...rest) => {
    const { name, value } = e.target;

    if (rest?.length > 0 && rest.some((ele, _) => ele === false)) {
      return;
    }

    setPayload({ ...payload, [name]: value });
  };

  const handleSave = () => {
    const obj = { ...ALLTABSAVE };
    obj.cancelReason = payload?.editReason;
    obj.rate = Number(payload?.setRate);
    obj.type = "R"
    handlePatientBillingAllTabSave(obj);
  };
  return (
    <>
      <div className="row">
        <Input
          lable={"Set Rate"}
          type={"text"}
          respclass={"col-12"}
          className={"form-control required-fields"}
          placeholder={""}
          name="setRate"
          value={payload?.setRate}
          onChange={(e) => handleChange(e, AMOUNT_REGX(8).test(e.target.value))}
        />

        <TextAreaInput
          className={" required-fields"}
          respclass={"col-12"}
          rows={3}
          lable={"Edit Reason"}
          name="editReason"
          value={payload?.editReason}
          onChange={handleChange}
        />
      </div>

      <div className="d-flex aling-items-center justify-content-end">
        <button className="btn btn-sm btn-primary" onClick={handleSave}>
          Save
        </button>
      </div>
    </>
  );
};

export default RateChange;
