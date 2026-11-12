import React, { useEffect, useState } from "react";
import Heading from "../../../components/UI/Heading";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import { useTranslation } from "react-i18next";
import DatePicker from "../../../components/formComponent/DatePicker";
import Input from "../../../components/formComponent/Input";
import { AutoComplete } from "primereact/autocomplete";
import { Table } from "react-bootstrap";
import Tables from "../../../components/UI/customTable";
import { handleReactSelectDropDownOptions } from "../../../utils/utils";
import { EDPBindCategoryAPI, EDPBindPackageAPI, EDPBindSubCategoryAPI } from "../../../networkServices/EDP/edpApi";
import { GetLoadOPD_All_ItemsLabAutoComplete } from "../../../networkServices/opdserviceAPI";

const OPDpkgMasterMain = ({ data }) => {
  const [t] = useTranslation();
  const initialValues = {
    selectType: {
      label: "New",
      value: "1",
    },
    Package: {
      value: "0",
    },
    ValidFrom: new Date(),
    ValidTo: new Date(),
    CPTCode: "",
    IsActive: {
      label: "Active",
      value: "1",
    },
    Type:{value:"0"},
    Category:{value:"0"},
    subCategory:{value:"0"}
  };

  const FIRSTTHEAD = [
    { name: "S.No.", width: "1%" },
    { name: "Item Name" },
    { name: "Quantity" },
    { name: "Delete" },
  ];
  const THEAD = [
    { name: "S.No.", width: "1%" },
    { name: "Doctor Visit" },
    { name: "Department" },
    { name: "Doctor" },
    { name: "Delete" },
  ];

  const [values, setValues] = useState({ ...initialValues });
  const [items, setItems] = useState([]);
  const [dropDownData, setDropDownData] = useState({ packageList: [], categoryList: [], subCategoryList: [] });
  const [tableData, setTableData] = useState([]);
  const [newTableData, setNewTableData] = useState([]);
  const [itemTableData, setItemTableData] = useState([]);
  console.log("newTableData", newTableData);
  console.log("Values", values);

  const handleReactSelect = (label, value) => {
    // 
    if (value?.label === "Edit") {
      setValues(initialValues);
    }
    setValues((val) => ({ ...val, [label]: value }));
  };
  const handleInputChange = (e, index, label) => {
    const { name, value } = e.target;
    setValues((val) => ({ ...val, [label]: value }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newDate = new Date(value);
    setValues({
      ...values,
      [name]: value,
    });
  };

  console.log("asd", values)
  const search = async (event) => {

    const item = await GetLoadOPD_All_ItemsLabAutoComplete({
      "searchType": Number(values?.Type?.value ?? 1),
      "prefix": event?.query.trim(),
      "type": "100",
      "categoryID": values?.Category?.value ?? "0",
      "subCategoryID": values?.subCategory?.value ?? "0",
      "itemID": "",
      "doctorID": "",
      "PanelID": 1
    });

    //   {
    //     searchType: values?.searchType ?? 1,
    //     prefix: event?.query.trim(),
    //     type: "100",
    //     categoryID: values?.Category?.value ?? "0",
    //     subCategoryID: values?.subCategory?.value ?? "0",
    //     itemID: "",
    // }
    if (item?.success) {
      setItems(item?.data);
    }
    // const item = await getbindIPDPatientDetails(event?.query.trim());
    // setItems(item);
  };

  const handleReactSelectConsultaionDetail = (label, value) => {
    setTableData((val) => ({ ...val, [label]: value }));
  };
  const itemTemplate = (item) => {
    return (
      <div className="p-clearfix">
        <div style={{ float: "left", fontSize: "12px", width: "100%" }}>
          {item?.autoCompleteItemName}
        </div>
      </div>
    );
  };

  const handleSelectRow = (e) => {

    console.log("first", e?.value)
    setItemTableData((prev) => ([...prev, e?.value]))
    setValues((val) => ({ ...val, ItemName: "" }))

  };

  const handleAdd = () => {
    if (tableData?.DoctorVisit && tableData?.Department && tableData?.Doctor) {
      setNewTableData((prev) => [...prev, tableData]);
      setTableData({}); // Optional: Clear input fields after adding
    }
  };

  const handleDelete = (indexToDelete) => {
    setNewTableData((prevData) =>
      prevData.filter((_, index) => index !== indexToDelete)
    );
  };
  const handleFirstDelete = (indexToDelete) => {
    setItemTableData((prevData) =>
      prevData.filter((_, index) => index !== indexToDelete)
    );
  };


  const bindData = async () => {
    const [packageList, categoryList] = await Promise.all([
      EDPBindPackageAPI(),
      EDPBindCategoryAPI(),
      EDPBindSubCategoryAPI()
    ]);
    if (packageList?.success) {
      setDropDownData((prevData) => ({ ...prevData, packageList: [{ label: "All", value: "0" }, ...handleReactSelectDropDownOptions(packageList?.data, "Name", "PackageID")] }));
    }
    if (categoryList?.success) {
      setDropDownData((prevData) => ({ ...prevData, categoryList: [{ label: "All", value: "0" }, ...handleReactSelectDropDownOptions(categoryList?.data, "Name", "CategoryID")] }));
    }
    if (subCategoryList?.success) {
      setDropDownData((prevData) => ({ ...prevData, subCategoryList: [{ label: "All", value: "0" }, ...handleReactSelectDropDownOptions(subCategoryList?.data, "Name", "PackageID")] }));
    }
  }

  useEffect(() => {
    bindData()
  }, [])

  return (
    <div className="card">
      <Heading
        title={data?.breadcrumb}
        // isMainHeading={{ data: data, FrameMenuID: data?.FrameMenuID }}
        data={data}
        isSlideScreen={true}
        isBreadcrumb={true}
      />
      <div className="row p-2">
        <ReactSelect
          placeholderName={t("Select Type")}
          name="selectType"
          value={values?.selectType?.value}
          removeIsClearable={true}
          handleChange={(name, e) => handleReactSelect(name, e)}
          dynamicOptions={[
            { label: "New", value: "1" },
            { label: "Edit", value: "0" },
          ]}
          searchable={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <ReactSelect
          placeholderName={t("Package")}
          name="Package"
          value={values?.Package?.value}
          handleChange={(name, e) => handleReactSelect(name, e)}
          dynamicOptions={dropDownData?.packageList}
          removeIsClearable={true}
          searchable={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />

        <DatePicker
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          className="custom-calendar"
          placeholder=""
          lable="Valid From" // Corrected to "lable"
          name="ValidFrom"
          id="ValidFrom"
          value={values?.ValidFrom ? values?.ValidFrom : new Date()}
          showTime
          hourFormat="12"
          handleChange={handleChange}
        />
        <DatePicker
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          className="custom-calendar"
          placeholder=""
          lable="Valid To" // Corrected to "lable"
          name="ValidTo"
          id="ValidTo"
          value={values?.ValidTo ? values?.ValidTo : new Date()}
          showTime
          hourFormat="12"
          handleChange={handleChange}
        />
        <Input
          type="text"
          className={"form-control required-fields"}
          lable={t("CPT Code")}
          placeholder=" "
          name="CPTCode"
          onChange={(e) => handleInputChange(e, 0, "CPTCode")}
          value={values?.CPTCode}
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
      </div>
      <Heading title={"Package Details"} isBreadcrumb={false} />
      <div className="row p-2">
        <ReactSelect
          placeholderName={t("Type")}
          name="Type"
          value={values?.Type?.value}
          removeIsClearable={true}
          handleChange={(name, e) => handleReactSelect(name, e)}
          dynamicOptions={[
            { label: "Investigation", value: "0" },
            { label: "Procedures", value: "1" },
            { label: "Other Charges", value: "2" },
            { label: "All", value: "3" },
          ]}
          searchable={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <ReactSelect
          placeholderName={t("Category")}
          name="Category"
          value={values?.Category?.value}
          removeIsClearable={true}
          handleChange={(name, e) => handleReactSelect(name, e)}
          dynamicOptions={dropDownData?.categoryList}
          searchable={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <ReactSelect
          placeholderName={t("Is Vaccination")}
          name="vaccination"
          value={values?.vaccination?.value}
          handleChange={(name, e) => handleReactSelect(name, e)}
          dynamicOptions={[
            { label: "Yes", value: "0" },
            { label: "No", value: "1" },
          ]}
          searchable={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <ReactSelect
          placeholderName={t("Is Consumables")}
          name="consumables"
          value={values?.consumables?.value}
          handleChange={(name, e) => handleReactSelect(name, e)}
          dynamicOptions={[
            { label: "Yes", value: "0" },
            { label: "No", value: "1" },
          ]}
          searchable={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <ReactSelect
          placeholderName={t("Sub Category")}
          name="subCategory"
          value={values?.subCategory?.value}
          handleChange={(name, e) => handleReactSelect(name, e)}
          dynamicOptions={dropDownData?.subCategoryList}
          searchable={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <div className="col-xl-2 col-md-4 col-sm-6 col-12">
          <AutoComplete
            value={values?.ItemName ? values?.ItemName : ""}
            suggestions={items}
            completeMethod={search}
            className="required-fields w-100"
            onSelect={(e) => handleSelectRow(e)}
            id="searchtest"
            onChange={(event) => {
              console.log("ASdasd", event)
              setValues((val) => ({ ...val, ItemName: event?.target?.value?.NewItemID ? event?.target?.value?.typeName : event?.target?.value }));
            }}
            itemTemplate={itemTemplate}
          />
          <label
            className="label lable truncate ml-3"
            style={{ fontSize: "5px !important" }}
          >
            {t("Search Item")}
          </label>
        </div>

      </div>

      {itemTableData?.length > 0 && (
        <div className="card">
          <Heading title={"Package Details Table"} />
          <Tables
            thead={FIRSTTHEAD}
            tbody={itemTableData?.map((ele, index) => ({
              Sno: index + 1,
              item: ele?.typeName,
              Quantity: ele?.quantity,
              remove: (
                <div
                  className="fa fa-trash"
                  onClick={() => handleFirstDelete(index)}
                ></div>
              ),
            }))}
          />
        </div>
      )}

      <Heading title={"Doctor Consultation Detail"} isBreadcrumb={false} />
      <div className="row p-2">
        <ReactSelect
          placeholderName={t("Doctor Visit")}
          name="DoctorVisit"
          value={tableData?.DoctorVisit?.value}
          handleChange={(name, e) =>
            handleReactSelectConsultaionDetail(name, e)
          }
          // update dynamic option
          dynamicOptions={[
            { label: "Investigation", value: "0" },
            { label: "Procedures", value: "1" },
            { label: "Other Charges", value: "2" },
            { label: "All", value: "3" },
          ]}
          searchable={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <ReactSelect
          placeholderName={t("Department")}
          name="Department"
          value={tableData?.Department?.value}
          handleChange={(name, e) =>
            handleReactSelectConsultaionDetail(name, e)
          }
          // update dynamic option
          dynamicOptions={[
            { label: "Investigation", value: "0" },
            { label: "Procedures", value: "1" },
            { label: "Other Charges", value: "2" },
            { label: "All", value: "3" },
          ]}
          searchable={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <ReactSelect
          placeholderName={t("Doctor")}
          name="Doctor"
          value={tableData?.Doctor?.value}
          handleChange={(name, e) =>
            handleReactSelectConsultaionDetail(name, e)
          }
          // update dynamic option
          dynamicOptions={[
            { label: "Investigation", value: "0" },
            { label: "Procedures", value: "1" },
            { label: "Other Charges", value: "2" },
            { label: "All", value: "3" },
          ]}
          searchable={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <button
          className=" btn btn-sm btn-success ml-2 px-3"
          onClick={handleAdd}
        >
          {t("Add")}
        </button>
      </div>

      {newTableData && (
        <Tables
          thead={THEAD}
          tbody={newTableData?.map((ele, index) => ({
            Sno: index + 1,
            Visit: ele?.DoctorVisit?.label,
            Department: ele?.Department?.label,
            Doctor: ele?.Doctor?.label,
            remove: (
              <div
                className="fa fa-trash"
                onClick={() => handleDelete(index)}
              ></div>
            ),
          }))}
        />
      )}
    </div>
  );
};

export default OPDpkgMasterMain;
