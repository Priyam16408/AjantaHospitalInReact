import React, { useEffect, useState } from "react";
import {
  EDPBindDocumentMaster,
  EDPSaveDocumentMaster,
} from "../../../../networkServices/EDP/govindedp";
import { useTranslation } from "react-i18next";
import { notify } from "../../../../utils/utils";
import Input from "../../../../components/formComponent/Input";
import ReactSelect from "../../../../components/formComponent/ReactSelect";
import Heading from "../../../../components/UI/Heading";
import Tables from "../../../../components/UI/customTable";
import { SelectIconSVG } from "../../../../components/SvgIcons";

const DocumentMaster = () => {
  const [t] = useTranslation();
  const THEAD = [
    { name: "S.No." },
    { name: "Document Name" },
    { name: "Description" },
    { name: "Active" },
    { name: "Edit" },
  ];

  const initialValues = {
    DocName: "",
    DocID: "",
    Description: "",
    IsActive: { label: "Active", value: "1" },
  };
  const [tableData, setTableData] = useState([]);
  const [values, setValues] = useState({ ...initialValues });
  console.log("values", values);

  const EDPBindDocumentMasterAPI = async (deptID) => {
    const response = await EDPBindDocumentMaster();

    if (response?.success) {
      // setDropDownState((prev) => ({
      //   ...prev,
      //   Head: handleReactSelectDropDownOptions(
      //     response?.data,
      //     "NAME",
      //     "DeptHeadID"
      //   ),
      // }));
      setTableData(response?.data);
    } else {
      notify(response?.message, "error");
    }
  };

  const handleInputChange = (e, index, label) => {
    const { name, value } = e.target;
    setValues((val) => ({ ...val, [label]: value }));
  };

  const handleReactSelect = (label, value) => {
    setValues((val) => ({ ...val, [label]: value }));
  };

  const handleEdit = (ele) => {
    console.log("Ele", ele);

    setValues({
      ...initialValues, // Reset to default values
      DocName: ele.Doc_Name || "",
      DocID: ele?.DocID,
      Description: ele?.Description,
      IsActive:
        ele.IsActive === "Yes"
          ? { label: "Active", value: "1" }
          : { label: "Inactive", value: "0" },
      isEdit: 1,
      Activity: 2,
    });
  };

  const handleSave = async () => {
    console.log("payload", values);
    if (!values?.DocName && !values?.Description) {
      notify("Please enter All required Fields", "error");
      return;
    }
    const payload = {
      docName: values?.DocName,
      desc: values?.Description,
      seq: 0,
      isActive: values?.IsActive?.value,
      activity: values?.Activity ? values?.Activity : 1,
      docID: Number(values?.DocID),
    };

    const response = await EDPSaveDocumentMaster(payload);

    if (response?.success) {
      notify(response?.message, "success");
      setValues(initialValues);
      EDPBindDocumentMasterAPI();
    } else {
      notify(response?.message, "error");
    }
  };

  useEffect(() => {
    EDPBindDocumentMasterAPI();
  }, []);
  return (
    <>
      <Input
        type="text"
        className={"form-control required-fields"}
        lable={t("Document Name")}
        placeholder=" "
        //   id="ItemName"
        name="DocName"
        onChange={(e) => handleInputChange(e, 0, "DocName")}
        value={values?.DocName}
        required={true}
        respclass="col-xl-2 col-md-4 col-sm-6 col-12"
      />
      <Input
        type="text"
        className={"form-control required-fields"}
        lable={t("Description")}
        placeholder=" "
        //   id="ItemName"
        name="Description"
        onChange={(e) => handleInputChange(e, 0, "Description")}
        value={values?.Description}
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
            Doc_Name: ele?.Doc_Name,
            Description: ele?.Description,
            IsActive: ele?.IsActive,
            Edit: (
              <div onClick={() => handleEdit(ele)}>
                <SelectIconSVG />
              </div>
            ),
          }))}
        />
      </div>
    </>
  );
};

export default DocumentMaster;
