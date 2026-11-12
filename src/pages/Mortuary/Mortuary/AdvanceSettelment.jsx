import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Input from "../../../components/formComponent/Input";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import Heading from "../../../components/UI/Heading";

const AdvanceSettelment = () => {
  const [t] = useTranslation();
  const [values, setValues] = useState({});
  const handleReactSelect = (name, value) => {
    setValues((val) => {
      return {
        ...val,
        [name]: value,
      };
    });
  };

  const handleInputChange = (e, index, label) => {
    const { name, value } = e.target;
    setValues((val) => ({ ...val, [label]: value }));
  };
  return (
    <div className="card">
      <Heading title={t("")} isBreadcrumb={true} />
      <div className="row p-2">
        <ReactSelect
          placeholderName={t("Status")}
          name="status"
          value={values?.status?.value}
          handleChange={handleReactSelect}
          dynamicOptions={[
            { lable: "ALL", value: "0" },
            { label: "YRS", value: "1" },
            { label: "MONTH(S)", value: "2" },
            { label: "DAY(S)", value: "3" },
          ]}
          searchable={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <Input
          type="text"
          className={"form-control required-fields"}
          lable={t("Deposit No.")}
          placeholder=" "
          name="DepositNo"
          onChange={(e) => handleInputChange(e, 0, "DepositNo")}
          value={values?.DepositNo}
          required={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <Input
          type="text"
          className={"form-control required-fields"}
          lable={t("Corpse Name")}
          placeholder=" "
          name="CorpseName"
          onChange={(e) => handleInputChange(e, 0, "CorpseName")}
          value={values?.CorpseName}
          required={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <Input
          type="text"
          className={"form-control required-fields"}
          lable={t("Corpse No.")}
          placeholder=" "
          name="CorpseNo"
          onChange={(e) => handleInputChange(e, 0, "CorpseNo")}
          value={values?.CorpseNo}
          required={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <button className="btn btn-sm btn-success ml-2">{t("Search")}</button>
      </div>
    </div>
  );
};

export default AdvanceSettelment;
