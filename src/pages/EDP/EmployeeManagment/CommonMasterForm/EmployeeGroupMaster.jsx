import React, { useEffect, useState } from "react";
import Heading from "../../../../components/UI/Heading";
import { useTranslation } from "react-i18next";
import {
  EDPBindUserGroup,
  EDPSaveUserGroup,
} from "../../../../networkServices/EDP/edpApi";
import { notify } from "../../../../utils/utils";
import ReactSelect from "../../../../components/formComponent/ReactSelect";
import Input from "../../../../components/formComponent/Input";
import Tables from "../../../../components/UI/customTable";
import { SelectIconSVG } from "../../../../components/SvgIcons";

const EmployeeGroupMaster = () => {
  const [t] = useTranslation();
  const [tableData, setTableData] = useState([]);
  const initialValues = {
    UserGroupName: "",
    Probation: "",
    NoticeDays: "",
    IsActive: {
      label: "Active",
      value: "1",
    },
  };
  const [values, setValues] = useState({ ...initialValues });
  console.log("TableData", tableData);
  console.log("values", values);

  const THEAD = [
    { name: t("S.No."), width: "" },
    { name: t("User Group Name"), width: "" },
    { name: t("Probation Period(Days)"), width: "" },
    { name: t("Notice Period(Days)"), width: "" },
    { name: t("Active"), width: "" },
    { name: t("Edit"), width: "" },
  ];

  const EDPBindUserGroupAPI = async () => {
    const response = await EDPBindUserGroup();
    if (response?.success) {
      setTableData(response?.data);
    } else {
      notify(response?.message, "error");
    }
  };

  const handleInputChange = (e, index, label) => {
    const { name, value } = e.target;
    setValues((val) => ({ ...val, [label]: value }));
  };

  const handleSave = async () => {
    if (!values?.UserGroupName && !values?.Probation && !values?.NoticeDays) {
      notify("Please enter All required Fields", "error");
      return;
    }
    const payloadToBe = {
      ID: values?.ID,
      saveType: values?.isEdit == 1 ? "Update" : "Save",
      name: values?.UserGroupName,
      probationDays: Number(values?.Probation),
      noticeDays: Number(values?.NoticeDays),
      isActive: Number(values?.IsActive?.value),
    };

    const response = await EDPSaveUserGroup(payloadToBe);
    if (response?.success) {
      notify(response?.message, "success");
      setValues(initialValues);
      EDPBindUserGroupAPI();
    } else {
      notify(response?.message, "error");
    }
  };

  const handleReactSelect = (label, value) => {
    setValues((val) => ({ ...val, [label]: value }));
  };

  const handleEdit = (ele) => {
    console.log("Ele", ele);

    setValues({
      ...initialValues, // Reset to default values
      UserGroupName: ele.Name || "",
      Probation: ele.ProbationDays || "",
      NoticeDays: ele.NoticeDays || "",
      IsActive:
        ele.IsActive === "Yes"
          ? { label: "Active", value: "1" }
          : { label: "Inactive", value: "0" },
      isEdit: 1,
      ID: ele?.ID,
    });
  };

  useEffect(() => {
    EDPBindUserGroupAPI();
  }, []);
  return (
    <>
      <Input
        type="UserGroupName"
        className={"form-control required-fields"}
        lable={t("User Group Name")}
        placeholder=" "
        //   id="ItemName"
        name="UserGroupName"
        onChange={(e) => handleInputChange(e, 0, "UserGroupName")}
        value={values?.UserGroupName}
        required={true}
        respclass="col-xl-2 col-md-4 col-sm-6 col-12"
      />
      <Input
        type="number"
        className={"form-control required-fields"}
        lable={t("Probation (Days)")}
        placeholder=" "
        //   id="ItemName"
        name="Probation"
        onChange={(e) => handleInputChange(e, 0, "Probation")}
        value={values?.Probation}
        required={true}
        respclass="col-xl-2 col-md-4 col-sm-6 col-12"
      />
      <Input
        type="number"
        className={"form-control required-fields"}
        lable={t("Notice (Days)")}
        placeholder=" "
        //   id="ItemName"
        name="NoticeDays"
        onChange={(e) => handleInputChange(e, 0, "NoticeDays")}
        value={values?.NoticeDays}
        required={true}
        respclass="col-xl-2 col-md-4 col-sm-6 col-12"
      />

      <ReactSelect
        placeholderName={t("Is Active")}
        //   id="IsDiscountable"
        //   requiredClassName={"required-fields"}
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

      <button
        className=" btn btn-sm btn-success ml-2 px-3"
        onClick={handleSave}
      >
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
        <Heading title={t("User Group Details")} />
        <Tables
          thead={THEAD}
          tbody={tableData?.map((ele, index) => ({
            Sno: index + 1,
            name: ele?.Name,
            ProbationPeriod: ele?.ProbationDays,
            NoticeDays: ele?.NoticeDays,
            Active: ele?.IsActive,
            Edit: (
              <div onClick={() => handleEdit(ele)} className="fa fa-edit"></div>
            ),
          }))}
        />
      </div>
    </>
  );
};

export default EmployeeGroupMaster;
