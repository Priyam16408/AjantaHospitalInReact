import React, { useState } from "react";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import { useTranslation } from "react-i18next";
import Heading from "../../../components/UI/Heading";
import Input from "../../../components/formComponent/Input";
import { init } from "i18next";
import TextAreaInput from "../../../components/formComponent/TextAreaInput";
import {
  EDPLoadRefDoc,
  EDPSaveRefDoc,
  EDPUpdateRefDoc,
} from "../../../networkServices/EDP/govindedp";
import { notify } from "../../../utils/ustil2";
import Tables from "../../../components/UI/customTable";
import CustomSelect from "../../../components/formComponent/CustomSelect";
import { inputBoxValidation } from "../../../utils/utils";
import { MOBILE_NUMBER_VALIDATION_REGX } from "../../../utils/constant";

const ReferDoctorMaster = () => {
  const [t] = useTranslation();

  const THEAD = [
    { name: t("S.No"), width: "1%" },
    { name: t("Doctor Name") },
    { name: t("Number") },
    { name: t("Address") },
    { name: t("Status") },
  ];
  const initialValues = {
    Name: "",
    ContactNumber: "",
    Address: "",
    Type: {
      label: "New",
      value: "New",
    },
    Title: {
      label: "Dr.",
      value: "1",
    },
    Status: { label: "Active", value: "1" },
  };
  const [tableData, setTableData] = useState([]);
  // console.log("tableData", tableData);
  const [values, setValues] = useState({ ...initialValues });
  console.log("first", values);

  const handleReactSelect = (label, value) => {
    if (label === "Type") {
      setValues(initialValues);
      setTableData([]);
    }
    setValues((val) => ({ ...val, [label]: value }));
  };

  const handleInputChange = (e, index, label) => {
    const { name, value } = e.target;
    setValues((val) => ({ ...val, [label]: value }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((val) => ({ ...val, [name]: value }));
  };

  const handleSave = async () => {
    const payload = {
      title: values?.Title?.label,
      docName: values?.Name,
      mobile: values?.ContactNumber,
      address: values?.Address,
    };

    const response = await EDPSaveRefDoc(payload);
    if (response?.success) {
      notify(response?.message, "success");
      setValues(initialValues);
    } else {
      notify(response?.message, "error");
    }
  };
  const handleSearch = async () => {
    // ;
    const payload = {
      title: values?.Title?.label,
      refDocName: values?.Name,
      type: values?.Status?.value,
    };

    const response = await EDPLoadRefDoc(payload);
    if (response?.success) {
      setTableData(response?.data);
      setValues((val) => ({
        ...val,
        Name: "",
        ContactNumber: "",
        Address: "",
      }));
    } else {
      notify(response?.message, "error");
    }
  };

  const handleTableInputChange = (e, index) => {
    const { name, value } = e.target;
    const data = [...tableData];
    data[index][name] = value;
    setTableData(data);
  };

  const handleCustomSelect = (name, e, index) => {
    // 
    const data = [...tableData];
    data[index][name] = e.value;
    setTableData(data);
  };

  const handleUpdate = async () => {
    // ;
    const payload = tableData?.map((ele) => ({
      doctorID: ele.DoctorID,
      name: ele.Name,
      mobile: ele.Mobile,
      house_No: ele.House_No,
      isActive: Number(ele.IsActive),
    }));

    const response = await EDPUpdateRefDoc(payload);
    if (response?.success) {
      notify(response?.message, "success");
      handleSearch();
    } else {
      notify(response?.message, "error");
    }
  };

  return (
    <div className="card">
      <Heading title={t("Refer Doctor Master")} isBreadcrumb={true} />
      <div className="row pt-2 px-2">
        <ReactSelect
          placeholderName={t("Type")}
          name="Type"
          value={values?.Type?.value}
          removeIsClearable={true}
          handleChange={(name, e) => handleReactSelect(name, e)}
          dynamicOptions={[
            { label: "New", value: "New" },
            { label: "Edit", value: "Edit" },
          ]}
          searchable={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <ReactSelect
          placeholderName={t("Title")}
          name="Title"
          removeIsClearable={true}
          value={values?.Title?.value}
          handleChange={(name, e) => handleReactSelect(name, e)}
          dynamicOptions={[
            { label: "Dr.", value: "1" },
            { label: "Prof Dr.", value: "0" },
          ]}
          searchable={true}
          requiredClassName={"required-fields"}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <Input
          type="text"
          className={"form-control required-fields"}
          lable={t("Name")}

          placeholder=" "
          //   id="ItemName"
          name="Name"
          onChange={(e) => handleInputChange(e, 0, "Name")}
          value={values?.Name}
          required={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        {values?.Type?.value === "Edit" && (
          <ReactSelect
            placeholderName={t("Status")}
            name="Status"
          removeIsClearable={true}

            value={values?.Status?.value}
            handleChange={(name, e) => handleReactSelect(name, e)}
            dynamicOptions={[
              { label: "Active", value: "1" },
              { label: "DeActive", value: "0" },
              { label: "Both", value: "2" },
            ]}
            searchable={true}
            requiredClassName={"required-fields"}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          />
        )}
        {values?.Type?.value === "New" && (
          <>
            <Input
              type="number"
              className={"form-control required-fields"}
              lable={t("Contact Number")}
              placeholder=" "
              //   id="ItemName"
              name="ContactNumber"
              onChange={(e) => {
                inputBoxValidation(
                  MOBILE_NUMBER_VALIDATION_REGX,
                  e,
                  handleInputChange
                );
              }}
              // onChange={(e) => handleInputChange(e, 0, "ContactNumber")}
              value={values?.ContactNumber}
              required={true}
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            />
            <TextAreaInput
              type="text"
              className={`form-textarea textAreaHeight`}
              id="Address"
              name="Address"
              value={values?.Address ? values?.Address : ""}
              onChange={handleChange}
              lable={t("Address")}
              placeholder=" "
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              rows={1}
            />
          </>
        )}
        <button
          className="btn btn-sm btn-success  px-3"
          type="button"
          onClick={values?.Type?.value === "Edit" ? handleSearch : handleSave}
        >
          {values?.Type?.value === "Edit" ? t("Search") : t("Save")}
        </button>
      </div>

      {tableData?.length > 0 && (
        <>
          <Tables
            thead={THEAD}
            
            tbody={tableData?.map((ele, i) => ({
              "S.no.": i + 1,
              DoctorName: (
                <Input
                  type="text"
                  className={"table-input required-fields"}
                  removeFormGroupClass={true}
                  placeholder=" "
                  //   id="ItemName"
                  name="Name"
                  onChange={(e) => handleTableInputChange(e, i, "Name")}
                  value={ele?.Name}
                  required={true}
                  respclass="col-12"
                />
              ),
              Number: (
                <Input
                  type="number"
                  className={"table-input required-fields"}
                  removeFormGroupClass={true}
                  placeholder=" "
                  //   id="ItemName"
                  name="Mobile"
                  onChange={(e) => handleTableInputChange(e, i, "Mobile")}
                  value={ele?.Mobile}
                  required={true}
                  respclass="col-12"
                />
              ),
              Address: (
                <Input
                  type="text"
                  className={"table-input required-fields"}
                  removeFormGroupClass={true}
                  placeholder=" "
                  //   id="ItemName"
                  name="House_No"
                  onChange={(e) => handleTableInputChange(e, i, "House_No")}
                  value={ele?.House_No}
                  required={true}
                  respclass="col-12"
                />
              ),
              Status: (
                <CustomSelect
                  isRemoveSearchable={true}
                  option={[
                    { label: "Active", value: "1" },
                    { label: "DeActive", value: "0" },
                  ]}
                  requiredClassName={"w-100"}
                  placeHolder={"IsActive"}
                  name="IsActive"
                  value={`${ele?.IsActive}`}
                  onChange={(name, e) => handleCustomSelect(name, e, i)}
                />
              ),
            }))}
            style={{ height: "58vh" }}
          />
          <div className="mt-1 mb-1  text-right">
            <button
              className=" btn-primary btn-sm px-3 ml-1 mr-2 custom_save_button"
              type="button"
              onClick={handleUpdate}
            >
              {t("Update")}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ReferDoctorMaster;
