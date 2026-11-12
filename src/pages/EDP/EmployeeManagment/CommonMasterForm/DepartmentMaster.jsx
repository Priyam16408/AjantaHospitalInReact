import React, { useEffect, useState } from "react";
import Input from "../../../../components/formComponent/Input";
import ReactSelect from "../../../../components/formComponent/ReactSelect";
import { useTranslation } from "react-i18next";
import Heading from "../../../../components/UI/Heading";
import Tables from "../../../../components/UI/customTable";
import { SelectIconSVG } from "../../../../components/SvgIcons";
import {
  EDPBindDepartmentHead,
  EDPBindDepartmenttableinMaster,
  EDPSaveDepartment,
} from "../../../../networkServices/EDP/govindedp";
import {
  handleReactSelectDropDownOptions,
  notify,
} from "../../../../utils/utils";

const DepartmentMaster = () => {
  const [t] = useTranslation();

  const THEAD = [
    { name: "S.No" },
    { name: "Department" },
    { name: "Emp. Required" },
    { name: "Active" },
    { name: "Edit" },
  ];

  const initialValues = {
    IsActive: {
      label: "",
      value: "",
    },
    Department: "",
    EmployeeRequired: "",
  };

  const [DropDownState, setDropDownState] = useState({
    Head: [],
  });
  console.log("DropDownState", DropDownState);

  const [values, setValues] = useState({ ...initialValues });
  const [tableData, setTableData] = useState([]);
  const handleReactSelect = (label, value) => {
    setValues((val) => ({ ...val, [label]: value }));
  };

  const handleInputChange = (e, index, label) => {
    const { name, value } = e.target;
    setValues((val) => ({ ...val, [label]: value }));
  };

  const handleSave = async () => {
    if (!values.Department && !values.EmployeeRequired) {
      notify("Please enter All required Fields", "error");
      return;
    }

    const payload = {
      departmentName: values?.Department,
      empRequired: values?.EmployeeRequired,
      isActive: values?.IsActive?.value,
      activity: values?.Activity ? values?.Activity : 1,
      deptID: values?.ID ? values?.ID : 0,
      deptHeadID: values?.DepartmentHead?.DeptHeadID,
      DepartmentHead: DropDownState?.Head.find(
        (obj) => obj.DeptHeadID === values?.DeptHeadID
      ),
    };

    const response = await EDPSaveDepartment(payload);

    if (response?.success) {
      notify(response?.message, "success");
      setValues(initialValues);
      BindDepartment();
    } else {
      notify(response?.message, "error");
    }
  };

  const bindDepartmentHead = async (deptID) => {
    const response = await EDPBindDepartmentHead(deptID ? deptID : 0);

    if (response?.success) {
      setDropDownState((prev) => ({
        ...prev,
        Head: handleReactSelectDropDownOptions(
          response?.data,
          "NAME",
          "DeptHeadID"
        ),
      }));
    }
  };

  const handleEdit = (ele) => {
    console.log("Ele", ele);

    bindDepartmentHead(ele?.Dept_ID);
    // ;
    setValues({
      ...initialValues, // Reset to default values
      Department: ele.Dept_Name || "",
      ID: ele?.Dept_ID,
      EmployeeRequired: ele?.EmployeeRequired,
      // DepartmentHead:DropDownState?.Head,
      IsActive:
        ele.IsActive === "Yes"
          ? { label: "Active", value: "1" }
          : { label: "Inactive", value: "0" },
      isEdit: 1,
      Activity: 2,
    });
  };

  const BindDepartment = async () => {
    const response = await EDPBindDepartmenttableinMaster();

    if (response?.success) {
      setTableData(response?.data);
    } else {
      notify(response?.message, "error");
    }
  };

  // useEffect(() => {
  //   bindDepartmentHead();
  // }, [values?.isEdit])

  useEffect(() => {
    BindDepartment();
    bindDepartmentHead();
  }, []);

  return (
    <>
      <Input
        type="text"
        className={"form-control required-fields"}
        lable={t("Department")}
        placeholder=" "
        //   id="ItemName"
        name="Department"
        onChange={(e) => handleInputChange(e, 0, "Department")}
        value={values?.Department}
        required={true}
        respclass="col-xl-2 col-md-4 col-sm-6 col-12"
      />
      <Input
        type="number"
        className={"form-control required-fields"}
        lable={t("Employee Required")}
        placeholder=" "
        //   id="ItemName"
        name="EmployeeRequired"
        onChange={(e) => handleInputChange(e, 0, "EmployeeRequired")}
        value={values?.EmployeeRequired}
        required={true}
        respclass="col-xl-2 col-md-4 col-sm-6 col-12"
      />
      <ReactSelect
        placeholderName={t("Is Active")}
        name="IsActive"
        value={values?.IsActive?.value}
        handleChange={(name, e) => handleReactSelect(name, e)}
        dynamicOptions={[
          { label: "Active", value: "1" },
          { label: "Inactive", value: "0" },
        ]}
        searchable={true}
        respclass="col-xl-2 col-md-4 col-sm-6 col-12"
      />

      <ReactSelect
        placeholderName={t("Department Head")}
        name="DepartmentHead"
        value={values?.DepartmentHead?.value}
        handleChange={(name, e) => handleReactSelect(name, e)}
        dynamicOptions={DropDownState?.Head}
        searchable={true}
        respclass="col-xl-2 col-md-4 col-sm-6 col-12"
      />

      <button className="btn btn-sm btn-success ml-2 px-3" onClick={handleSave}>
        {values?.isEdit === 1 ? t("Update") : t("Save")}
      </button>
      <button
        className=" btn btn-sm btn-success ml-2 px-3"
        onClick={() => {
          setValues(initialValues);
        }}
      >
        {t("Reset")}
      </button>
      <div className="col-12 pt-2">
        <Heading title={t("Job Type Master Details")} />
        <Tables
          thead={THEAD}
          tbody={tableData?.map((ele, index) => ({
            Sno: index + 1,
            Dept_Name: ele?.Dept_Name,
            EmployeeRequired: ele?.EmployeeRequired,
            Active: ele?.IsActive,
            Edit: (
              <div onClick={() => handleEdit(ele)}>
                <SelectIconSVG />
              </div>
            ),
          }))}
          style={{ maxHeight: "70vh" }}
        />
      </div>
    </>
  );
};

export default DepartmentMaster;
