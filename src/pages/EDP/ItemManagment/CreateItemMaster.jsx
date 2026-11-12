import React, { useEffect, useState } from "react";
import Heading from "../../../components/UI/Heading.jsx";
import {
  GetCategory,
  GetDepartment,
  GetGST,
  getSubCategory,
  LoadItems,
  SaveItem,
  UpdateItem,
} from "../../../networkServices/EDP/edpApi.js";
import { handleReactSelectDropDownOptions, notify } from "../../../utils/utils.js";
import ReactSelect from "../../../components/formComponent/ReactSelect.jsx";
import { useTranslation } from "react-i18next";
import Input from "../../../components/formComponent/Input.jsx";
import LabeledInput from "../../../components/formComponent/LabeledInput.jsx";
import { useLocalStorage } from "../../../utils/hooks/useLocalStorage.js";

const ItemMaster = ({ data, setVisible }) => {
  const localData = useLocalStorage("userData", "get");
  const ip = useLocalStorage("ip", "get");
  const [t] = useTranslation();

  const THEAD = [
    { name: t("S.No."), width: "1%" },
    { name: t("Category"), width: "10%" },
    { name: t("Sub Category"), width: "10%" },
    { name: t("Item Name"), width: "10%" },
    { name: t("Department"), width: "5%" },
    { name: t("CPT Code"), width: "10%" },
    { name: t("Rate Edit"), width: "10%" },
    { name: t("Is Discount"), width: "8%" },
    { name: t("Active"), width: "5%" },
    { name: t("GST Type"), width: "10%" },
  ];

  const EditableOptions = [
    { label: t("New"), value: "1" },
    { label: t("Edit"), value: "2" },
  ];

  const RateEditableOptions = [
    { label: t("Yes"), value: "1" },
    { label: t("No"), value: "0" },
    { label: t("Both"), value: "2" },
  ];

  const ConditionOptions = [
    { label: t("Active"), value: "1" },
    { label: t("DeActive"), value: "0" },
    { label: t("Both"), value: "2" },
  ];

  const IsDiscountAble = [
    { label: t("Yes"), value: "1" },
    { label: t("No"), value: "0" },
  ];

  const initialState = {
    SubCategory: { value: "" },
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
  const [tableData, setTableData] = useState([]);

  const [dropDownState, setDropDownState] = useState({
    GetCategory: [],
    GetSubCategory: [],
    GST: [],
    GetDepartment: [],
  });

  useEffect(() => {
    if (data?.ItemID) {
      const { SubCategoryID, CategoryID, TypeName, ItemCode, DeptID, RateEditable, IsDiscountable, GSTType, IsActive } = data
      handleReactSelect("Category", { value: CategoryID })
      setValues({
        Category: { value: CategoryID },
        SubCategory: { value: SubCategoryID },
        ItemName: TypeName,
        CPTcode: ItemCode,
        Department: { value: DeptID },
        RateEditable: RateEditable,
        IsDiscountable: IsDiscountable,
        GSTType: GSTType,
        Status: { value: IsActive }
      })
    }

  }, [])
  const GetCategoryAPI = async () => {
    try {
      const GetCategoryDetails = await GetCategory();
      setDropDownState((val) => ({
        ...val,
        GetCategory: handleReactSelectDropDownOptions(
          GetCategoryDetails?.data,
          "categoryName",
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
        gstType: values?.GSTType?.label,
        igstPercent: IGST ? IGST : 0,
        sgstPercent: SGST,
        cgstPercent: CGST,
        hsnCode: "1", // Hardcoded value
        itemID: 0, // Hardcoded value
        isActive: 1, // Hardcoded value
      };

      const saveItemDetails = await SaveItem(payloadToBe);


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



  const handleUpdate = async () => {
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

      const { CGST, SGST, IGST } = extractTaxValues(values?.GSTType?.label);
      const payloadToBe = {
        ipAddress: ip,
        dataItem: [{
          typeName: values?.TypeName || "",
          subCategoryID: values?.SubCategory?.value || null,
          itemCode: values?.ItemCode || "",
          rateEditable: values?.RateEditable?.value || 0,
          departmentID: values?.Department?.value || null,
          isDiscountable: values?.IsDiscountable?.value || 0,
          manufactureName: "", //PENDING
          gstType: values?.GSTType?.label || "",
          igstPercent: IGST,
          sgstPercent: SGST,
          cgstPercent: CGST,
          hsnCode: "", //PENDING
          itemID: values?.ItemID || 0,
          isActive: values?.IsActive || 1,
        }]
      };


      // Call API to update
      const response = await UpdateItem(payloadToBe);
      if (response?.success) {
        notify("Record updated successfully!", "success");
        setValues({
          CPTcode: "",
          ItemName: "",
          Edit: {
            label: "New",
            value: "1",
          },
        });
        setVisible()
      } else {
        notify(response?.message || "Update failed", "error");
      }
    } catch (e) {
      console.error("Error in handleUpdate:", e);
    }
  };

  const handleReactSelect = async (label, value) => {
    if (label == "Edit") {
      setValues([]);
      setTableData([]);
    }
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
    GetCategoryAPI();
    GetDepartmentAPI();
    GSTAPI();
  }, []);




  return (<>
    <div className="mt-2 card">
      <Heading
        title={data?.breadcrumb}
        // isMainHeading={{ data: data, FrameMenuID: data?.FrameMenuID }}
        data={data}
        isSlideScreen={true}
        isBreadcrumb={true}

      />
      <div className="row p-2 ">

        <ReactSelect
          placeholderName={t("Category")}
          id="Category"
          requiredClassName={"required-fields"}
          name="Category"
          value={values?.Category?.value}
          handleChange={(name, e) => handleReactSelect(name, e)}
          removeIsClearable={true}
          dynamicOptions={dropDownState?.GetCategory}
          searchable={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <ReactSelect
          placeholderName={t("Sub Category")}
          id="SubCategory"
          requiredClassName={"required-fields"}
          name="SubCategory"
          value={values?.SubCategory?.value}
          handleChange={(name, e) => handleReactSelect(name, e)}
          removeIsClearable={true}
          dynamicOptions={dropDownState?.GetSubCategory}
          searchable={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <Input
          type="text"
          className={"form-control required-fields"}
          lable={t("Item Name")}
          placeholder=" "
          id="ItemName"
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
          id="CPTcode"
          name="CPTcode"
          onChange={(e) => handleInputChange(e, 0, "CPTcode")}
          value={values?.CPTcode}
          required={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <ReactSelect
          placeholderName={t("Department")}
          id="Department"
          requiredClassName={"required-fields"}
          name="Department"
          value={values?.Department?.value}
          handleChange={(name, e) => handleReactSelect(name, e)}
          removeIsClearable={true}
          dynamicOptions={dropDownState?.GetDepartment}
          searchable={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <ReactSelect
          placeholderName={t("Rate Editable")}
          name="RateEditable"
          id="RateEditable"
          value={values?.RateEditable?.value}
          handleChange={(name, e) => handleReactSelect(name, e)}
          dynamicOptions={RateEditableOptions}
          searchable={true}
          removeIsClearable={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />

        <ReactSelect
          placeholderName={t("Status")}
          name="Status"
          id="Status"
          value={values?.Status?.value}
          handleChange={(name, e) => handleReactSelect(name, e)}
          removeIsClearable={true}
          dynamicOptions={ConditionOptions}
          searchable={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />

        <ReactSelect
          placeholderName={t("Is Discountable")}
          name="IsDiscountable"
          id="IsDiscountable"
          value={values?.IsDiscountable?.value}
          removeIsClearable={true}
          handleChange={(name, e) => handleReactSelect(name, e)}
          dynamicOptions={IsDiscountAble}
          searchable={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <ReactSelect
          placeholderName={t("GST Type")}
          removeIsClearable={true}
          id="GSTType"
          name="GSTType"
          value={values?.GSTType?.value}
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
        {data?.ItemID ?
          <button
            className=" btn btn-sm btn-success ml-2 px-3"
            onClick={handleUpdate}
          >
            {t("Update")}
          </button>
          :
          <button
            className=" btn btn-sm btn-success ml-2 px-3"
            onClick={handleSave}
          >
            {t("Save")}
          </button>
        }



      </div>

    </div>

  </>
  );
};

export default ItemMaster;
