import React, { useEffect, useState } from "react";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import { useTranslation } from "react-i18next";
import MultiSelectComp from "../../../components/formComponent/MultiSelectComp";
import Heading from "../../../components/UI/Heading";
import {
  EDPBindRole,
  EDPIPDBillGenBindEmployee,
  EDPSaveBillAuthorized,
} from "../../../networkServices/EDP/govindedp";
import { EDPLoadEmployee } from "../../../networkServices/edpApi";
import { handleReactSelectDropDownOptions } from "../../../utils/utils";
import { notify } from "../../../utils/ustil2";

const IPDbillGeneration = () => {
  const [t] = useTranslation();
  const [values, setValues] = useState();
  console.log("values", values);
  const [dropDownSate, setDropDownState] = useState({});

  const handleReactSelect = (name, value) => {
    setValues((val) => {
      return {
        ...val,
        [name]: value,
      };
    });
  };

  const handleMultiSelectChange = (name, selectedOptions) => {
    setValues({ ...values, [name]: selectedOptions });
  };

  const employeeData = async () => {
    const roleID = values?.loginType?.value;
    const response = await EDPIPDBillGenBindEmployee(roleID);
    if (response?.success) {
      let selectedValue = [];
      let data = response?.data?.map((val) => {
        let returnData = {
          name: val?.Name,
          code: val?.EmployeeID,
        };
        if (val?.isExist === "true") {
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
      setDropDownState((prev) => ({
        ...prev,
        Employees: data,
      }));
    } else {
      setDropDownState((prev) => ({
        ...prev,
        Employees: [],
      }));
    }
  };

  const EDPBindRoleAPI = async () => {
    const response = await EDPBindRole();

    if (response?.success) {
      setDropDownState((val) => ({
        ...val,
        loginType: handleReactSelectDropDownOptions(
          response?.data,
          "RoleName", // Ensure it matches API response
          "ID"
        ),
      }));
    }
  };

  useEffect(() => {
    if (values?.loginType?.value) {
      employeeData();
    }
  }, [values?.loginType?.value]);

  const handleSave = async () => {
    const payload = {
      values: values?.employee?.map((ele) => ele?.code),
      roleID: values?.loginType?.value,
    };

    const response = await EDPSaveBillAuthorized(payload);

    if (response?.success) {
      notify(response?.message, "success");
    } else {
      notify(response?.message, "error");
    }
  };

  useEffect(() => {
    EDPBindRoleAPI();
  }, []);

  return (
    <div className="card">
      <Heading title={""} isBreadcrumb={true} />
      <div className="row p-2">
        <ReactSelect
          placeholderName={t("Login Type")}
          requiredClassName={"required-fields"}
          name="loginType"
          value={values?.loginType?.value}
          handleChange={(name, e) => handleReactSelect(name, e)}
          dynamicOptions={dropDownSate?.loginType}
          searchable={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <MultiSelectComp
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          name="employee"
          id="employee"
          placeholderName={t("Employees")}
          dynamicOptions={dropDownSate?.Employees}
          handleChange={handleMultiSelectChange}
          value={values?.employee}
        />
        <button className="btn btn-sm btn-success" onClick={() => handleSave()}>
          {t("Save")}
        </button>
      </div>
    </div>
  );
};

export default IPDbillGeneration;
