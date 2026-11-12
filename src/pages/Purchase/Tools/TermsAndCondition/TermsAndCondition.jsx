import React, { useEffect, useState, useRef } from "react";

import { useTranslation } from "react-i18next";
import Input from "../../../../components/formComponent/Input";
import ReactSelect from "../../../../components/formComponent/ReactSelect";
import Tables from "../../../../components/UI/customTable";
import { AiOutlineClose } from "react-icons/ai";
import Heading from "../../../../components/UI/Heading";
import {
  PurchaseTermsandConditionDelete,
  PurchaseTermsandConditionSave,
  PurchaseTermsandConditionSearch,
  PurchaseTermsandConditionUpdate,
} from "../../../../networkServices/purchaseDepartment";
import { notify } from "../../../../utils/utils";

const TermsAndCondition = () => {
  const [t] = useTranslation();
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedPRNOs, setSelectedPRNOs] = useState([]);
  const [values, setValues] = useState({
    name: "",
    status: "",
    Id: "",
  });
  console.log("values", values);
  const [isEdit, setIsEdit] = useState(false);
  const selectAllRef = useRef(null);
  const [tableData, setTableData] = useState([
    {
      "S.No.": "1",
    },
  ]);
  const areAllSelected = selectedRows.length === tableData.length;
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "isDefaut") {
      setValues((val) => ({ ...val, [name]: e.target.checked }));
    }
    setValues((val) => ({ ...val, [name]: value }));
  };
  const getItems = async () => {
    try {
      const response = await PurchaseTermsandConditionSearch();
      if (response.success) {
        setTableData(response.data);
      } else {
        notify(apiResp?.message, "error");
      }
    } catch (error) {
      console.error("Error fetching department data:", error);
      notify(apiResp?.message, "error");
    }
  };

  const handleSave = async () => {
    try {
      let payload = {
        name: values.name,
        type: values?.status?.value,
        isDefault: values?.IsDefault?.value || "0",
      };

      if (payload?.name === "" || payload?.type === "") {
        notify("Please Fill All Fields", "error");
        return;
      }
      const response = await PurchaseTermsandConditionSave(payload);
      if (response.success) {
        notify("Record Saved Sucessfully", "success");
        setValues({
          name: "",
          status: "",
          Id: "",
        });
        getItems();
      } else {
        notify(apiResp?.message, "error");
      }
    } catch (error) {
      console.error("Error fetching department data:", error);
      notify(apiResp?.message, "error");
    }
  };

  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate =
        selectedRows.length > 0 && selectedRows.length < tableData.length;
    }
  }, [selectedRows, tableData.length]);

  useEffect(() => {
    getItems();
  }, []);

  const handleReactChange = (name, e, key) => {
    setValues((val) => ({ ...val, [name]: e }));
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allIndices = tableData.map((_, index) => index);
      const allPRNOs = tableData.map((row) => row.PurchaseRequestNo);
      setSelectedRows(allIndices);
      setSelectedPRNOs(allPRNOs);
    } else {
      setSelectedRows([]);
      setSelectedPRNOs([]);
    }
  };
  const THEAD = [
    {
      width: "0.5%",
      name: (
        <input
          type="checkbox"
          ref={selectAllRef}
          checked={areAllSelected}
          onChange={handleSelectAll}
        />
      ),
    },
    { name: t("S.No."), width: "0.2%" },
    {
      name: t("Terms And Condition"), //  width: "15%"
    },
    { name: t("Is Default"), width: "7%" },
    { name: t("Status"), width: "7%" },
    { name: t("Edit"), width: "5%" },
    { name: t("Delete"), width: "5%" },
  ];
  const handleEdit = (val) => {
    debugger;
    setIsEdit(true);
    setValues((preV) => ({
      ...preV,
      name: val?.Terms,
      status:
        val?.Active === "Active"
          ? { label: "Active", value: "1" }
          : { label: "De-Active", value: "0" },
      Id: val?.Id,
      IsDefault:
        val?.IsDefault === "Yes"
          ? { label: "Yes", value: "1" }
          : { label: "No", value: "0" },
    }));
  };

  const handleUpdate = async () => {
    try {
      let payload = {
        name: values.name,
        type: values?.status?.value,
        Id: values.Id,
        isDefault: Number(values?.IsDefault?.value),
      };
      const response = await PurchaseTermsandConditionUpdate(payload);
      if (response.success) {
        getItems();
        setIsEdit(false);
        setValues({
          name: "",
          status: "",
          Id: "",
        });
        notify("Update Sucessfully", "success");
      } else {
        notify(apiResp?.message, "error");
      }
    } catch (error) {
      notify(apiResp?.message, "error");
    }
  };
  const HandleDelete = async (ID) => {
    try {
      const response = await PurchaseTermsandConditionDelete(ID);
      if (response.success) {
        notify("Deleted Sucessfully", "success");
        getItems();
      } else {
        notify(apiResp?.message, "error");
      }
    } catch (error) {
      console.error("Error fetching department data:", error);
      notify(apiResp?.message, "error");
    }
  };
  const handleCancel = () => {
    setValues((PreV) => ({
      ...PreV,
      name: "",
      status: "",
    }));
    setIsEdit(!isEdit);
  };

  const handleCheckboxChange = (e) => {
    const { name } = e.target;
    debugger;
  };
  return (
    <div className=" spatient_registration_card card">
      <Heading title={t("Terms And Condition")} isBreadcrumb={true} />
      <div className="row p-2">
        <Input
          type="text"
          className="form-control required-fields"
          id={t("name")}
          lable={t("Name")}
          // placeholder=" "
          value={values?.name}
          respclass="col-xl-2 col-md-3 col-sm-6 col-12"
          name="name"
          onChange={handleChange}
        />

        <ReactSelect
          placeholderName={t("Status")}
          searchable={true}
          respclass="col-xl-2 col-md-3 col-sm-6 col-12"
          id={"status"}
          name={"status"}
          removeIsClearable={true}
          handleChange={(name, e) => handleReactChange(name, e)}
          dynamicOptions={[
            { label: "Active", value: "1" },
            { label: "De-Active", value: "0" },
          ]}
          value={values?.status.value}
        />
        {/* <input
          type="checkbox"
          lable={t("Name")}
          value={values?.isdefault}
          name="isdefault"
          onChange={handleCheckboxChange}
        /> */}
        <ReactSelect
          placeholderName={t("Is Default")}
          searchable={true}
          respclass="col-xl-2 col-md-3 col-sm-6 col-12"
          id={"IsDefault"}
          name={"IsDefault"}
          removeIsClearable={true}
          handleChange={(name, e) => handleReactChange(name, e)}
          dynamicOptions={[
            { label: "Yes", value: "1" },
            { label: "No", value: "0" },
          ]}
          value={values?.IsDefault?.value}
        />
        {isEdit ? (
          <div className="col-xl-2 col-md-3 col-sm-6 col-12">
            <button
              className="btn btn-sm btn-primary mx-1 px-4"
              onClick={handleUpdate}
            >
              {t("Update")}
            </button>
            <button
              className="btn btn-sm btn-primary mx-1 px-4"
              onClick={() => handleCancel()}
            >
              {t("Cancel")}
            </button>
          </div>
        ) : (
          <div className="col-xl-2 col-md-3 col-sm-6 col-12">
            <button
              className="btn btn-sm btn-primary mx-1 px-4"
              onClick={handleSave}
            >
              {t("Save")}
            </button>
          </div>
        )}
      </div>
      <Heading title={t("Items Pricing Detail")} isBreadcrumb={false} />
      <div className="patient_registration card">
        <div className="row">
          <div className="col-12">
            <Tables
              thead={THEAD}
              tbody={tableData?.map((val, ind) => ({
                checkbox: <input type="checkbox" />,
                Sno: ind + 1,
                TermsAndCondition: val?.Terms,
                IsDefault: val?.IsDefault,
                Status: val?.Active,
                Edit: (
                  <span onClick={() => handleEdit(val)}>
                    <i className="fa fa-edit" />
                  </span>
                ),
                Delete: (
                  <span onClick={() => HandleDelete(val.Id)}>
                    <i className="fa fa-trash text-danger" />
                  </span>
                ),
              }))}
              tableHeight={"scrollView"}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndCondition;
