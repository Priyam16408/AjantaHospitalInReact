import React from "react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Heading from "../../../components/UI/Heading";
import Tables from "../../../components/UI/customTable";
import {
  EDPBindDocDepartment,
  EDPDoctorSetupSaveDoc,
  EDPUpdateDocDepartment,
} from "../../../networkServices/EDP/govindedp";
import { notify } from "../../../utils/ustil2";
import { SelectIconSVG } from "../../../components/SvgIcons";
import Input from "../../../components/formComponent/Input";

const Department = () => {
  const [t] = useTranslation();
  const initialValues = {
    DocName: "",
  };
  const [values, setValues] = useState({ ...initialValues });
  const THEAD = [
    { name: t("S.No."),width:"1%" },
    { name: t("Department") },
    { name: t("Edit"),width:"1%" },
  ];

  const [tableData, setTableData] = useState([]);

  const handleInputChange = (e, index, label) => {
    const { name, value } = e.target;
    setValues((val) => ({ ...val, [label]: value }));
  };
  const handleEdit = (ele) => {
    setValues({
      ...initialValues, // Reset to default values
      DocName: ele.Name || "",
      DocID: ele?.ID || "",
      IsActive:
        ele.IsActive === "Yes"
          ? { label: "Active", value: "1" }
          : { label: "Inactive", value: "0" },
      isEdit: 1,
    });
  };
  const handleSave = async () => {
    console.log("payload", values);
    const payload = {
      docName: values?.DocName,
    };

    const response = await EDPDoctorSetupSaveDoc(payload);

    if (response?.success) {
      notify(response?.message, "success");
      setValues(initialValues);
      BindDoctorDept();
    } else {
      notify(response?.message, "error");
    }
  };
  const handleUpdate = async (ele) => {
    console.log("payload", values);
    const payload = {
      id: values?.DocID,
      docDepartmentName: values?.DocName,
    };

    const response = await EDPUpdateDocDepartment(payload);

    if (response?.success) {
      notify(response?.message, "success");
      setValues(initialValues);
      BindDoctorDept();
    } else {
      notify(response?.message, "error");
    }
  };

  const BindDoctorDept = async () => {
    const response = await EDPBindDocDepartment();
    if (response?.success) {
      setTableData(response?.data);
    } else {
      notify(response?.message, "error");
    }
  };

  useEffect(() => {
    BindDoctorDept();
  }, []);
  return (
    <div className="card">
      <Heading isBreadcrumb={true} isSlideScreen={false} />
      <div className="row p-2">
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
        <button
          className="btn btn-sm btn-success ml-2 px-3"
          onClick={values?.isEdit === 1 ? handleUpdate : handleSave}
        >
          {values?.isEdit === 1 ? t("Update") : t("Save")}
        </button>
      </div>
      <Heading title={t("Doctor Department Master")} className="px-2" />
      <Tables
        thead={THEAD}
        isSearch={true}
        tbody={tableData?.map((ele, index) => ({
          Sno: index + 1,
          Doc_Name: ele?.Name,
          Edit: (
            <i className="fa fa-edit" onClick={() => handleEdit(ele)}> </i>
            
          ),
        }))}
        style={{ height: "54vh" }}
      />
    </div>
  );
};

export default Department;
