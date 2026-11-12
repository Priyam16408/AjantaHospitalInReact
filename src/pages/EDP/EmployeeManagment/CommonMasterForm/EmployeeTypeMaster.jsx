import React, { useEffect, useState } from "react";
import Heading from "../../../../components/UI/Heading";
import {
  BindUserType,
  EDPCommonMasterBindUserType,
  EDPEmployeeSetUpSaveUserType,
} from "../../../../networkServices/EDP/edpApi";
import { notify } from "../../../../utils/utils";
import Input from "../../../../components/formComponent/Input";
import { useTranslation } from "react-i18next";
import ReactSelect from "../../../../components/formComponent/ReactSelect";
import Tables from "../../../../components/UI/customTable";
import { SelectIconSVG } from "../../../../components/SvgIcons";

const EmployeeTypeMaster = () => {
  const [t] = useTranslation();
  const [tableData, setTableData] = useState([]);
  const initialValues = {
    IsActive: {
      label: "Active",
      value: "1",
    },
    UserTypeName: "",
  };
  const [values, setValues] = useState({ ...initialValues });

  const THEAD = [
    { name: t("S.No."), width: "" },
    { name: t("User Type Name"), width: "" },
    { name: t("Active"), width: "" },
    { name: t("Edit"), width: "" },
  ];

  const BindUserTypeAPI = async () => {
    const data = await EDPCommonMasterBindUserType();
    if (data?.success) {
      setTableData(data?.data);
    } else {
      notify(data?.message, "error");
    }
  };

  const handleInputChange = (e, index, label) => {
    const { name, value } = e.target;
    setValues((val) => ({ ...val, [label]: value }));
  };

  const handleReactSelect = (label, value) => {
    setValues((val) => ({ ...val, [label]: value }));
  };

  const handleSave = async () => {
    if (!values?.UserTypeName) {
      notify("Please enter user type name.", "error");
      return;
    }
    const payload = {
      userTypeID: values?.ID,
      saveType: values?.isEdit == 1 ? "Update" : "Save",
      name: values?.UserTypeName,
      isActive: Number(values?.IsActive?.value),
    };
    const response = await EDPEmployeeSetUpSaveUserType(payload);
    if (response?.success) {
      notify(response?.message, "success");
      BindUserTypeAPI();
    } else {
      notify(response?.message, "error");
    }
  };

  const handleEdit = (ele) => {
    setValues({
      ...initialValues, // Reset to default values
      UserTypeName: ele.Name || "",
      IsActive:
        ele.IsActive === "Yes"
          ? { label: "Active", value: "1" }
          : { label: "Inactive", value: "0" },
      isEdit: 1,
      ID: ele?.ID,
    });
  };

  useEffect(() => {
    BindUserTypeAPI();
  }, []);

  return (
    <>
      <Input
        type="UserTypeName"
        className={"form-control required-fields"}
        lable={t("User Type Name")}
        placeholder=" "
        //   id="ItemName"
        name="UserGroupName"
        onChange={(e) => handleInputChange(e, 0, "UserTypeName")}
        value={values?.UserTypeName}
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
        <Heading title={t("User Type Master Details")} />
        <Tables
          thead={THEAD}
          tbody={tableData?.map((ele, index) => ({
            Sno: index + 1,
            name: ele?.Name,
            Active: ele?.IsActive,
            Edit: (
              <div onClick={() => handleEdit(ele)} className="fa fa-edit">
                {/* <SelectIconSVG /> */}
              </div>
            ),
          }))}
        />
      </div>
    </>
  );
};

export default EmployeeTypeMaster;
