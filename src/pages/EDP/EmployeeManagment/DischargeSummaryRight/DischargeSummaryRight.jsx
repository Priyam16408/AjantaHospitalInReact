import React, { useEffect, useState } from "react";
import MultiSelectComp from "../../../../components/formComponent/MultiSelectComp";
import { useTranslation } from "react-i18next";
import Heading from "../../../../components/UI/Heading";
import {
  EDPApprDisMastSave,
  EDPBindEmployee,
} from "../../../../networkServices/EDP/govindedp";
import { notify } from "../../../../utils/ustil2";
import { isChecked } from "../../../../utils/constant";

const DischargeSummaryRight = (data) => {
  const [t] = useTranslation();
  const [values, setValues] = useState();

  console.log("values", values);
  const [dropDownSate, setDropDownState] = useState({
    Employees: [],
  });

  const handleMultiSelectChange = (name, selectedOptions) => {
    const updatedOptions = selectedOptions.map((option) => ({
      ...option,
    }));
    setValues({ ...values, [name]: updatedOptions });
  };

  const employeeData = async () => {
    const response = await EDPBindEmployee();

    if (response?.success) {
      let selectedValue = [];
      let data = response?.data?.map((val) => {
        let returnData = {
          name: val?.Name,
          code: val?.EmployeeID,
        };
        if (val?.EmployeeID === val?.ActiveEmployeeID) {
          selectedValue.push(returnData);
        }
        return returnData;
      });
      setValues((val) => {
        return {
          ...val,
          employee: selectedValue,
        };
      });
      setDropDownState({
        ...dropDownSate,
        Employees: data,
      });
    } else {
      notify(response?.message, "error");
    }
  };

  const handleSave = async () => {
    const payload = values?.employee?.map((ele) => ({
      empValue: ele?.code,
      isChecked: true,
    }));

    console.log("Payload", payload);

    const response = await EDPApprDisMastSave(payload);

    if (response?.success) {
      notify(response?.message, "success");
    } else {
      notify(response?.message, "error");
    }
  };

  useEffect(() => {
    employeeData();
  }, []);

  return (
    <div className="card">
      <Heading title={data?.title} isBreadcrumb={true} isSlideScreen={true} />
      <div className="row p-2">
        <MultiSelectComp
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          name="employee"
          id="employee"
          placeholderName={t("Employees")}
          dynamicOptions={dropDownSate?.Employees}
          handleChange={handleMultiSelectChange}
          value={values?.employee}
        />
        <button className="btn btn-success" onClick={handleSave}>
          {t("Save")}
        </button>
      </div>
    </div>
  );
};

export default DischargeSummaryRight;
