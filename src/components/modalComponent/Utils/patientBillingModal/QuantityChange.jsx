import React, { useState } from "react";
import { ALLTABSAVE, AMOUNT_REGX } from "../../../../utils/constant";
import Input from "../../../formComponent/Input";
import TextAreaInput from "../../../formComponent/TextAreaInput";

const QuantityChange = ({handlePatientBillingAllTabSave}) => {
  const [payload, setPayload] = useState({
    quantity: null,
    editReason: null,
  });

  const handleChange = (e, ...rest) => {
    const { name, value } = e.target;
    if (rest.length > 0 && rest.some((ele, _) => ele === false)) {
      return;
    }
    setPayload({
      ...payload,
      [name]: value,
    });
  };

  const handleSave = async () => {
    const obj = { ...ALLTABSAVE };
    obj.cancelReason = payload?.editReason;
    obj.qty = Number(payload?.quantity);
    obj.type = "Q";
    handlePatientBillingAllTabSave(obj);
  };

  return (
    <>
      <div className="row">
        <Input
          lable={"Set Quantity"}
          type={"text"}
          respclass={"col-12"}
          className={"form-control required-fields"}
          placeholder={""}
          name="quantity"
          value={payload?.quantity}
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

export default QuantityChange;
