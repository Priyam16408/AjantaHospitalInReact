import React, { useEffect, useState } from "react";
import TextAreaInput from "../../formComponent/TextAreaInput";
import { useTranslation } from "react-i18next";
import ReactSelect from "../../formComponent/ReactSelect";
import { BILLINGSTYPE_OPTION } from "../../../utils/constant";
import LabeledInput from "../../formComponent/LabeledInput";

const BillGenerateModal = ({ getPayloadData, currencyDetails }) => {
  const [t] = useTranslation();
  const initialValues = {
    Narration: "",
    BillingType: "",
  };
  console.log(currencyDetails);
  const [payload, setPayload] = useState({ ...initialValues });
  useEffect(() => {
    getPayloadData(payload);
  }, [payload]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayload({
      ...payload,
      [name]: value,
    });
  };
  const handleReactSelect = async (name, value) => {
    setPayload((prevData) => ({
      ...prevData,
      [name]: value?.value,
    }));
  };
  console.log(payload);
  return (
    <>
      <div className="row">
       
        <ReactSelect
          placeholderName={"Billing Type"}
          id="BillingType"
          inputId="BillingType"
          name="BillingType"
          handleChange={handleReactSelect}
          value={payload?.BillingType}
          dynamicOptions={BILLINGSTYPE_OPTION}
          searchable={true}
          respclass="col-xl-6 col-md-6 col-sm-4 col-12"
          requiredClassName={"required-fields "}
        />
         <div className="col-xl-6 col-md-6 col-sm-4 col-12">
          <TextAreaInput
            lable={t("Narration")}
            // placeholder="Narration"
            className="w-100 required-fields"
            id="Narration"
            rows={2}
            name="Narration"
            maxLength={1000}
            onChange={handleChange}
          />
        </div>
        <div className="col-xl-4 col-md-4 col-sm-6 col-12">
          <LabeledInput
            label={"Currency"}
            value={currencyDetails?.S_Currency}
          />
        </div>
        <div className="col-xl-4 col-md-4 col-sm-6 col-12">
          <LabeledInput
            label={"Notation"}
            value={currencyDetails?.S_Notation}
          />
        </div>
        <div className="col-xl-4 col-md-4 col-sm-6 col-12">
          <LabeledInput
            label={"Conversion Factor"}
            value={currencyDetails?.Selling_Specific}
          />
        </div>
      </div>
    </>
  );
};

export default BillGenerateModal;
