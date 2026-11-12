import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Input from "../../../components/formComponent/Input";
import ReactSelect from "../../../components/formComponent/ReactSelect";

const BasicMasterEditModal = ({ values, setValues, onSave }) => {
  const [t] = useTranslation();
  const [values1, setValues1] = useState(values);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    setValues1((val) => ({ ...val, [name]: value }));
  };

  const handleReactSelect = (name, value) => {
    setValues1((val) => {
      return {
        ...val,
        [name]: value,
      };
    });
  };

  useEffect(() => {
    setValues({ ...values1 });
  }, [values1]);

  return (
    <div>
      <div className="row p-2">
        <Input
          type="text"
          className={"form-control required-fields"}
          lable={t("Name")}
          placeholder=" "
          name="Name"
          onChange={(e) => handleInputChange(e)}
          value={values1?.Name}
          required={true}
          respclass="col-xl-4 col-md-4 col-sm-6 col-12"
        />
        <ReactSelect
          placeholderName={t("Status")}
          name="Status"
          value={values1?.Status?.value}
          handleChange={handleReactSelect}
          dynamicOptions={[
            { label: "Active", value: "1" },
            { label: "InActive", value: "0" },
            { label: "Both", value: "2" },
          ]}
          searchable={true}
          respclass="col-xl-4 col-md-4 col-sm-6 col-12"
        />
        <button
          onClick={() => onSave(values1)}
          className="btn btn-sm btn-success"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default BasicMasterEditModal;
