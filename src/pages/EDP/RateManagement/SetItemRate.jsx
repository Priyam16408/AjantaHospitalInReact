


import React, { useEffect, useState } from "react";
import Heading from "../../../components/UI/Heading";
import {
  GetCategory,
  GetDepartment,
  GetGST,
  getSubCategory,
  LoadItems,
  SaveItem,
} from "../../../networkServices/EDP/edpApi.js";
import { handleReactSelectDropDownOptions, notify } from "../../../utils/utils";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import { useTranslation } from "react-i18next";
import Input from "../../../components/formComponent/Input";
import LabeledInput from "../../../components/formComponent/LabeledInput";
import { useLocalStorage } from "../../../utils/hooks/useLocalStorage";
import Tables from "../../../components/UI/customTable";

const SetItemRate = () => {
  const localData = useLocalStorage("userData", "get");
  const ip = useLocalStorage("ip", "get");
  const [t] = useTranslation();

  const THEAD = [
    { name: "S.No.", width: "1%" },
    { name: "Category", width: "10%" },
    { name: "Sub Category", width: "10%" },
    { name: "Item Name", width: "10%" },
    { name: "Department", width: "5%" },
    { name: "CPT Code", width: "10%" },
    { name: "Rate Edit", width: "10%" },
    { name: "Is Discount", width: "8%" },
    { name: "Active", width: "5%" },
  ];

  const Department = [
    { label: "OPD", value: "0" },
    { label: "IPDs", value: "1" },
  ];

  const RateEditableOptions = [
    { label: "Yes", value: "1" },
    { label: "No", value: "0" },
    { label: "Both", value: "2" },
  ];

  const ConditionOptions = [
    { label: "Active", value: "1" },
    { label: "DeActive", value: "0" },
    { label: "Both", value: "2" },
  ]

  const initialState = {
    Edit: {
      label: "New",
      value: "1",
    },
    Category: {
      configID: "",
      categoryName: "",
      categoryID: "",
      label: "",
      value: "",
    },
    ItemName: "",
  };

  const [values, setValues] = useState({ ...initialState });
  console.log("Values", values);
  const [tableData, setTableData] = useState([]);
  console.log("tableData", tableData);

  const [dropDownState, setDropDownState] = useState({
    GetCategory: [],
    GetSubCategory: [],
    GST: [],
    GetDepartment: [],
  });

  const GetCategoryAPI = async () => {
    try {
      const GetCategoryDetails = await GetCategory();
      setDropDownState((val) => ({
        ...val,
        GetCategory: handleReactSelectDropDownOptions(
          GetCategoryDetails?.data,
          "categoryName", // Ensure this matches the API response
          "categoryID"
        ),
      }));
    } catch (e) {
      console.log("Something Went Wrong", e);
    }
  };

  const GetDepartmentAPI = async () => {
    try {
      const GetDepartmentDetails = await GetDepartment();
      setDropDownState((val) => ({
        ...val,
        GetDepartment: handleReactSelectDropDownOptions(
          GetDepartmentDetails?.data,
          "Name",
          "ID"
        ),
      }));
    } catch (e) {
      console.log("Something Went Wrong", e);
    }
  };

  const GetSubCategoryAPI = async (payload) => {
    try {
      const getSubCategoryDetails = await getSubCategory(payload);
      console.log("GetSubCategoryDetails", getSubCategoryDetails);

      setDropDownState((val) => ({
        ...val,
        GetSubCategory: handleReactSelectDropDownOptions(
          getSubCategoryDetails?.data,
          "displayName", // Ensure it matches API response
          "subCategoryID"
        ),
      }));
    } catch (e) {
      console.log("Something Went Wrong", e);
    }
  };

  const GSTAPI = async () => {
    try {
      const GSTDetails = await GetGST();
      setDropDownState((val) => ({
        ...val,
        GST: handleReactSelectDropDownOptions(
          GSTDetails?.data,
          "TaxGroup", // Ensure it matches API response
          "ID"
        ),
      }));
    } catch (e) {
      console.log("Something Went Wrong", e);
    }
  };

  const extractTaxValues = (taxGroup) => {
    if (!taxGroup) return { CGST: 0, SGST: 0, IGST: 0 };

    const isIGST = taxGroup.includes("IGST_");
    const match = taxGroup.match(/(\d+(\.\d+)?)/); // Extract numeric value
    const taxValue = match ? parseFloat(match[0]) : 0;

    if (isIGST) {
      return { CGST: 0, SGST: 0, IGST: taxValue }; // Only IGST applied
    }

    return { CGST: taxValue / 2, SGST: taxValue / 2, IGST: 0 }; // CGST & SGST applied, IGST = 0
  };

  const extractTaxType = (taxGroup) => {
    if (!taxGroup) return "";

    const match = taxGroup.match(/^(CGST&SGST|CGST&UTGST|IGST)/);
    return match ? match[0] : "";
  };

  const handleSave = async () => {
    try {
      if (!values?.Category?.value) {
        notify("Please select Category", "error");
        return;
      }
      if (!values?.SubCategory?.value) {
        notify("Please select SubCategory", "error");
        return;
      }
      if (!values?.ItemName) {
        notify("Please enter Item Name", "error");
        return;
      }
      if (!values?.Department?.value) {
        notify("Please select Department", "error");
        return;
      }

      const gstType = extractTaxType(values?.GSTType?.TaxGroup);

      const payloadToBe = {
        ipAddress: ip,
        typeName: values?.ItemName,
        subCategoryID: values?.SubCategory?.value,
        itemCode: values?.CPTcode,
        rateEditable: values?.RateEditable?.value,
        departmentID: values?.Department?.value,
        isDiscountable: values?.IsDiscountable?.value,
        manufactureName: "",
        gstType: gstType,
        igstPercent: IGST ? IGST : 0,
        sgstPercent: SGST,
        cgstPercent: CGST,
        hsnCode: "1", // Hardcoded value
        itemID: 0, // Hardcoded value
        isActive: 1, // Hardcoded value
      };

      const saveItemDetails = await SaveItem(payloadToBe);
      console.log("saveItemDetails", saveItemDetails);

      if (saveItemDetails?.success === true) {
        // ;
        notify("Record Saved Sucessfully");
        setValues({
            Edit: {
              label: "",
              value: "",
            },
            Category: {
              configID: "",
              categoryName: "",
              categoryID: "",
              label: "",
              value: "",
            },
            ItemName: "",
            CPTcode: "",
          });
      } else {
        notify(saveItemDetails?.message, "error");
      }
    } catch (e) {
      console.log("Something Went Wrong", e);
    }
  };

  const handleEdit = async () => {
    const payloadToBe = {
      CategoryID: values?.Category?.value || "",
      SubCategoryID: values?.SubCategory?.value || "",
      ItemName: values?.ItemName || "",
      CPTCode: values?.CPTcode || "",
      Type: "1",
      RateEditable: values?.RateEditable?.value || "2",
      DepartmentID: values?.Department?.value || "",
      IsDiscountable: values?.IsDiscountable?.value || "0",
    };
    const saveItemDetails = await LoadItems(payloadToBe);

    if (saveItemDetails?.success === true) {
      setTableData(saveItemDetails?.data);
      notify(saveItemDetails?.message, "Success");
    } else {
      notify(saveItemDetails?.message, "error");
    }
  };

  const handleReactSelect = async (label, value) => {
    // 
    setValues((val) => ({ ...val, [label]: value }));
    if (label === "Category") {
      await GetSubCategoryAPI(value?.value);
    }
  };

  const handleInputChange = (e, index, label) => {
    const { name, value } = e.target;
    setValues((val) => ({ ...val, [label]: value }));
  };
  const { CGST, SGST, IGST } = extractTaxValues(values?.GSTType?.TaxGroup);

  useEffect(() => {
    // GetCategoryAPI();
    // GetDepartmentAPI();
    // GSTAPI();
  }, []);

  return (
    <div className="mt-2 card">
      <Heading title="Item Master" />
      <div className="row p-2 ">
        <ReactSelect
          placeholderName={t("Type")}
          //   id="Edit"
          removeIsClearable={true}
          //   requiredClassName={"required-fields"}
          name="Edit"
          value={values?.Edit?.value}
          handleChange={(name, e) => handleReactSelect(name, e)}
          dynamicOptions={Department}
          searchable={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <ReactSelect
          placeholderName={t("Category")}
          //   id="Category"
          requiredClassName={"required-fields"}
          name="Category"
          value={values?.Category}
          handleChange={(name, e) => handleReactSelect(name, e)}
          dynamicOptions={dropDownState?.GetCategory}
          searchable={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <ReactSelect
          placeholderName={t("Sub Category")}
          id="SubCategory"
          requiredClassName={"required-fields"}
          name="SubCategory"
          value={values?.SubCategory}
          handleChange={(name, e) => handleReactSelect(name, e)}
          dynamicOptions={dropDownState?.GetSubCategory}
          searchable={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <Input
          type="ItemName"
          className={"form-control required-fields"}
          lable={t("Item Name")}
          placeholder=" "
          //   id="ItemName"
          name="ItemName"
          onChange={(e) => handleInputChange(e, 0, "ItemName")}
          value={values?.ItemName}
          required={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <Input
          type="CPTcode"
          className={`form-control`}
          lable={t("CPT Code")}
          placeholder=" "
          //   id="CPTcode"
          name="CPTcode"
          onChange={(e) => handleInputChange(e, 0, "CPTcode")}
          value={values?.CPTcode}
          required={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <ReactSelect
          placeholderName={t("Department")}
          //   id="Department"
          requiredClassName={"required-fields"}
          name="Department"
          value={values?.Department}
          handleChange={(name, e) => handleReactSelect(name, e)}
          dynamicOptions={dropDownState?.GetDepartment}
          searchable={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <ReactSelect
          placeholderName={t("Rate Editable")}
          //   id="RateEditable"
          //   requiredClassName={"required-fields"}
          name="RateEditable"
          value={values?.RateEditable}
          handleChange={(name, e) => handleReactSelect(name, e)}
          dynamicOptions={RateEditableOptions}
          searchable={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        {values?.Edit?.value == 2 && (
          <ReactSelect
            placeholderName={t("Condition")}
            //   id="Condition"
            // requiredClassName={"required-fields"}
            name="Condition"
            value={values?.RateEditable || ConditionOptions.find(option => option?.value === values?.RateEditable)}
            handleChange={(name, e) => handleReactSelect(name, e)}
            dynamicOptions={ConditionOptions}
            searchable={true}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          />
        )}
        <ReactSelect
          placeholderName={t("Is Discountable")}
          //   id="IsDiscountable"
          //   requiredClassName={"required-fields"}
          name="IsDiscountable"
          value={values?.IsDiscountable}
          handleChange={(name, e) => handleReactSelect(name, e)}
          dynamicOptions={[
            { label: "Yes", value: "1" },
            { label: "No", value: "0" },
          ]}
          searchable={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <ReactSelect
          placeholderName={t("GST Type")}
          //   id="GSTType"
          //   requiredClassName={"required-fields"}
          name="GSTType"
          value={values?.GSTType}
          handleChange={(name, e) => handleReactSelect(name, e)}
          dynamicOptions={dropDownState?.GST}
          searchable={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <LabeledInput
          className="col-xl-1 col-md-4 col-sm-6 col-12 mb-2"
          value={CGST}
          label={t("CGST %")}
        />
        <LabeledInput
          className="col-xl-1 col-md-4 col-sm-6 col-12 mb-2"
          value={SGST}
          label={t("SGST %")}
        />
        <LabeledInput
          className="col-xl-1 col-md-4 col-sm-6 col-12 mb-2"
          value={IGST}
          label={t("IGST %")}
        />

        {values?.Edit?.value == 2 && (
          <button
            className=" btn btn-sm btn-success ml-2 px-3"
            onClick={handleEdit}
          >
            {t("Search")}
          </button>
        )}

        {values?.Edit?.value == 1 && (
          <button
            className=" btn btn-sm btn-success ml-2 px-3"
            onClick={handleSave}
          >
            {t("Save")}
          </button>
        )}
      </div>
      <div className="card">
        <Heading title={t("Item Master")} isBreadcrumb={false} />
        <Tables
          isSearch={true}
          thead={THEAD}
          tbody={tableData?.map((val, index) => ({
            SNo: index + 1,
            Category: val?.Category,
            SubCategory: val?.SubCategory,
            ItemName: (
              <Input
                type="ItemName"
                className={"form-control required-fields form-fields"}
                placeholder=" "
                //   id="ItemName"
                name="ItemName"
                onChange={(e) => handleInputChange(e, 0, "ItemName")}
                value={val?.TypeName}
                required={true}
                respclass="col-xl-12 col-md-4 col-sm-6 col-12"
              />
            ),
            Department: val?.Department,
            CPTCode: (
              <Input
                type="CPTcode"
                className={`form-control form-fields`}
                placeholder=" "
                //   id="CPTcode"
                name="CPTcode"
                onChange={(e) => handleInputChange(e, 0, "CPTcode")}
                value={val?.ItemCode}
                required={true}
                respclass="col-xl-12 col-md-4 col-sm-6 col-12"
              />
            ),
            RateEditable: (
              <ReactSelect
                placeholderName={t("Rate Editable")}
                //   id="RateEditable"
                //   requiredClassName={"required-fields"}
                name="RateEditable"
                value={values?.RateEditable}
                handleChange={(name, e) => handleReactSelect(name, e)}
                dynamicOptions={[
                  { label: "Yes", value: "1" },
                  { label: "No", value: "0" },
                  { label: "Both", value: "2" },
                ]}
                searchable={true}
                respclass="col-xl-12 col-md-4 col-sm-6 col-12 w-full"
              />
            ),
            IsDiscountable: (
              <ReactSelect
                placeholderName={t("Is Discountable")}
                //   id="IsDiscountable"
                //   requiredClassName={"required-fields"}
                name="IsDiscountable"
                value={val?.isDiscountable}
                handleChange={(name, e) => handleReactSelect(name, e)}
                dynamicOptions={[
                  { label: "Yes", value: "1" },
                  { label: "No", value: "0" },
                ]}
                searchable={true}
                respclass="col-xl-12 col-md-4 col-sm-6 col-12"
              />
            ),
            GSTType: val?.gstType,
          }))}
        />
      </div>
    </div>
  );
};

export default SetItemRate;
