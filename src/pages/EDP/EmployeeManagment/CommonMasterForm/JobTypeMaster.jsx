import React, { useEffect, useState } from "react";
import {
  EDPBindJobType,
  EDPSaveJobType,
} from "../../../../networkServices/EDP/edpApi";
import Input from "../../../../components/formComponent/Input";
import ReactSelect from "../../../../components/formComponent/ReactSelect";
import { useTranslation } from "react-i18next";
import Heading from "../../../../components/UI/Heading";
import Tables from "../../../../components/UI/customTable";
import { SelectIconSVG } from "../../../../components/SvgIcons";
import { notify } from "../../../../utils/utils";
import { BindJobType } from "../../../../networkServices/EDP/govindedp";

const JobTypeMaster = () => {
  const [t] = useTranslation();

  const initialValues = {
    JobType: "",
    IsActive: {
      label: "Active",
      value: "1",
    },
  };

  const [tableData, setTableData] = useState([]);
  const [values, setValues] = useState({ ...initialValues });
  console.log("Values", values);

  const THEAD = [
    { name: t("S.No."), width: "" },
    { name: t("Name"), width: "" },
    { name: t("Active"), width: "" },
    { name: t("Edit"), width: "" },
  ];

  const EDPBindJobTypeAPI = async () => {
    const response = await BindJobType();
    if (response?.success) {
      setTableData(response?.data);
    } else {
      // notify(response?.message, "error");
    }
  };
  const handleReactSelect = (label, value) => {
    setValues((val) => ({ ...val, [label]: value }));
  };

  const handleInputChange = (e, index, label) => {
    const { name, value } = e.target;
    setValues((val) => ({ ...val, [label]: value }));
  };
  const handleEdit = (ele) => {
    console.log("Ele", ele);

    setValues({
      ...initialValues, // Reset to default values
      JobType: ele.Name || "",
      ID: ele?.ID,
      IsActive:
        ele.IsActive === "Yes"
          ? { label: "Active", value: "1" }
          : { label: "Inactive", value: "0" },
      isEdit: 1,
    });
  };

  const handleSave = async () => {
    if (!values?.JobType) {
      notify("Please enter Job Type.", "error");
      return;
    }
    const payload = {
      id: values?.ID,
      saveType: values?.isEdit === 1 ? "Update" : "Save",
      name: values?.JobType,
      isActive: Number(values?.IsActive?.value),
    };

    const response = await EDPSaveJobType(payload);

    if (response?.success) {
      notify(response?.message, "success");
      EDPBindJobTypeAPI();
    } else {
      notify(response?.message, "error");
    }
  };

  useEffect(() => {
    EDPBindJobTypeAPI();
  }, []);
  return (
    <>
      <Input
        type="text"
        className={"form-control required-fields"}
        lable={t("Job Type")}
        placeholder=" "
        name="JobType"
        onChange={(e) => handleInputChange(e, 0, "JobType")}
        value={values?.JobType}
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
        <Heading title={t("Job Type Master Details")} />
        <Tables
          thead={THEAD}
          tbody={tableData?.map((ele, index) => ({
            Sno: index + 1,
            Name: ele?.Name,
            Active: ele?.IsActive,
            Edit: (
              <div onClick={() => handleEdit(ele)} className="fa fa-edit">
                
              </div>
            ),
          }))}
        />
      </div>
    </>
  );
};

export default JobTypeMaster;
