import React, { useEffect, useState } from "react";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import { useTranslation } from "react-i18next";
import Heading from "../../../components/UI/Heading";
import Input from "../../../components/formComponent/Input";
import MultiSelectComp from "../../../components/formComponent/MultiSelectComp";
import Tables from "../../../components/UI/customTable";
import {
  EDPBindAllCategory,
  EDPBindAllItems,
  EDPBindAllSubCategory,
  EDPBindIPDPackageMaster,
  EDPBindPackageDetails,
  EDPBindPkgCategory,
  EDPBindPkgSubCategory,
  EDPLoadPanelCompany,
  EDPLoadRoomType,
  EDPSavePackage,
} from "../../../networkServices/EDP/govindedp";
import { handleReactSelectDropDownOptions } from "../../../utils/utils";
import { notify } from "../../../utils/ustil2";
import { useLocalStorage } from "../../../utils/hooks/useLocalStorage";
import { AutoComplete } from "primereact/autocomplete";
import LabeledInput from "../../../components/formComponent/LabeledInput";

const IPDpkgMasterMain = ({ data }) => {
  const localData = useLocalStorage("userData", "get");
  const ip = useLocalStorage("ip", "get");
  console.log("localData", localData);
  const [t] = useTranslation();
  const [searchvalue, setSearchValue] = useState("");
  const [itemList, setItemList] = useState([]);
  console.log("ITEM", itemList);
  const THEAD = [
    { name: "S.No.", width: "1%" },
    { name: "Room Type" },
    { name: "Package Type" },
    {
      name: "Category",
    },
    { name: "SubCategory" },
    { name: "Item Name" },
    {
      name: " Quantity",
    },
    {
      name: "Amount",
    },
    { name: "Delete" },
  ];
  const initialValues = {
    selectType: {
      label: "New",
      value: "1",
    },
  };

  const [dropDownSate, setDropDownState] = useState({
    Category: [],
    SubCategory: [],
    PackageType: [],
    Panel: [],
    RoomType: [],
    PkgCategory: [],
    PkgSubCategory: [],
  });
  console.log("DROP", dropDownSate);
  const [values, setValues] = useState({ ...initialValues });

  console.log("values", values);
  const [newTableData, setNewTableData] = useState([]);

  console.log("newTableData", newTableData);

  const handleInputChange = (e, index, label) => {
    const { name, value } = e.target;
    setValues((val) => ({ ...val, [label]: value }));
  };
  const handleMultiSelectChange = (name, selectedOptions) => {
    setValues({ ...values, [name]: selectedOptions });
  };

  const handleDelete = (ele, indexToDelete) => {
    console.log("Table", newTableData);
    setNewTableData((prevData) =>
      prevData.filter((_, index) => index !== indexToDelete)
    );
  };
  const handleReactSelect = (label, value) => {
    setValues((val) => ({ ...val, [label]: value }));
  };

  const handleAdd = () => {
    ;
    if (
      !values?.RoomType?.length ||
      !values?.PkgCategory?.value ||
      !values?.Quantity ||
      !values?.Amount
    ) {
      notify("Please fill all the fields.", "error");
      return;
    }

    const newEntries = values?.RoomType?.map((room, idx) => ({
      index: newTableData.length + idx,
      srNo: newTableData.length + idx + 1,
      roomType: room.name,
      roomTypeID: room.code,
      packageType: values?.PkgCategory?.label || "",
      packageTypeID: values?.PkgCategory?.value || "",
      category: values?.Category?.label || "",
      categoryID: values?.Category?.value || "",
      subCategory: values?.subCategory?.label || "",
      subCategoryID: values?.subCategory?.value || "",
      pkgCategrory: values?.PkgCategory?.label || "",
      pkgCategoryID: values?.PkgCategory?.value || "",
      pkgSubCategory: values?.PkgSubCategory?.label || "",
      pkgSubCategoryID: values?.PkgSubCategory?.value || "",
      itemID: values?.SelectedItem?.VALUE ? values?.SelectedItem?.VALUE : 0,
      itemName: values?.SelectedItem?.NAME || "",
      quantity: values?.Quantity || "",
      amount: values?.Amount || "",
      isSurgery: values?.IsActive?.value || "",
      isAmount: values?.particularItem?.value || "OP",
    }));

    setNewTableData((prev) => [...prev, ...newEntries]);
  };

  const handleSave = async () => {
    console.log("values", values);
    
    ;
    const payload = {
      categoryID: values?.Category?.value || "",
      subCategoryID: values?.subCategory?.value || "",
      packageID: values?.SelectPackage?.ID || "",
      packageName: values?.PackageName || "",
      vaidityDays: values?.validitiy || "",
      isActive: values?.IsActive?.value || "",
      packageItemID: "",
      panelID: values?.ShowInPanel?.map((p) => p.code).join(",") || "",
      ipAddress: ip,
      packageDetails: newTableData.map((item) => ({
        roomTypeID: item.roomTypeID || "",
        packageType: item.packageTypeID || "",
        categoryID: item.pkgCategoryID?.split("#")[0] || "",
        subCategoryID: item.pkgSubCategoryID?.split("#")[0] || "",
        itemID: item.itemID || "",
        quantity: item.quantity || "",
        amount: item.amount || "",
        isSurgery: item.isSurgery || "",
        isAmount: 0,
      })),
    };

    console.log("Payload to be sent", payload);

    const response = await EDPSavePackage(payload);

    if (response?.success) {
      notify(response?.message, "success");
      setNewTableData([]);
      setValues(initialValues);
    } else {
      notify(response?.message, "error");
    }
  };

  const bindCategroy = async () => {
    const Category = await EDPBindPkgCategory();

    setDropDownState((val) => ({
      ...val,
      Category: handleReactSelectDropDownOptions(
        Category?.data,
        "NAME",
        "CategoryID"
      ),
    }));
  };
  const bindSubCategory = async () => {
    const payload = {
      CategoryID: values?.Category?.CategoryID,
    };
    const Category = await EDPBindPkgSubCategory(payload);

    setDropDownState((val) => ({
      ...val,
      SubCategory: handleReactSelectDropDownOptions(
        Category?.data,
        "NAME",
        "SubCategoryID"
      ),
    }));
  };

  const BindIPDPackageMaster = async () => {
    const payload = {
      CategoryID: values?.Category?.CategoryID,
      subCategory: values?.subCategory?.SubCategoryID,
    };
    const Category = await EDPBindIPDPackageMaster(payload);

    setDropDownState((val) => ({
      ...val,
      PackageType: handleReactSelectDropDownOptions(
        Category?.data,
        "Name",
        "ID"
      ),
    }));
  };
  const BindPackageDetails = async () => {
    const packageID = values?.SelectPackage?.ID;
    const Category = await EDPBindPackageDetails(packageID);

    setDropDownState((val) => ({
      ...val,
      SelectedPkg: handleReactSelectDropDownOptions(
        Category?.data,
        "Name",
        "ID"
      ),
    }));
  };

  const bindPanel = async () => {
    const response = await EDPLoadPanelCompany();

    if (response?.success) {
      setDropDownState((val) => ({
        ...val,
        Panel: handleReactSelectDropDownOptions(
          response?.data,
          "Company_Name",
          "PanelID"
        ),
      }));
    }
  };
  const bindRoom = async () => {
    const response = await EDPLoadRoomType();

    if (response?.success) {
      setDropDownState((val) => ({
        ...val,
        RoomType: handleReactSelectDropDownOptions(
          response?.data,
          "Name",
          "IPDCaseTypeID"
        ),
      }));
    }
  };
  const bindAllCategory = async () => {
    const response = await EDPBindAllCategory();

    if (response?.success) {
      setDropDownState((val) => ({
        ...val,
        PkgCategory: handleReactSelectDropDownOptions(
          response?.data,
          "NAME",
          "CategoryID"
        ),
      }));
    }
  };
  const bindAllSubCategory = async () => {
    const categoryID = values?.PkgCategory?.CategoryID;
    const userValidateId = localData?.userValidateID;
    const response = await EDPBindAllSubCategory(categoryID);

    if (response?.success) {
      setDropDownState((val) => ({
        ...val,
        PkgSubCategory: handleReactSelectDropDownOptions(
          response?.data,
          "NAME",
          "SubCategoryID"
        ),
      }));
    }
  };

  const bindAllItems = async (query) => {
    const payload = {
      searchType: 1, // pending
      prefix: query,
      type: 0, // pending
      categoryID: values?.PkgCategory?.value?.split("#")[0],
      subCategoryID: values?.PkgSubCategory?.value?.split("#")[0],
      itemID: "", // pending
    };
    const response = await EDPBindAllItems(payload);
    if (response?.success) {
      return response?.data;
    } else {
      // notify(response?.message, "error");
    }
  };

  const handleSearch = async (event, index) => {
    const query = event.query.trim();
    const items = await bindAllItems(query);

    const filteredData = items?.map((ele) => ({
      NAME: ele.TypeName,
      VALUE: ele.ItemID,
    }));
    setItemList(filteredData);
  };

  const handleSelectRow = (e, index) => {
    const { value } = e;
    setValues((val) => ({
      ...val,
      SelectedItem: {
        NAME: value?.NAME,
        VALUE: value?.VALUE,
      },
    }));
    setSearchValue("");
  };

  const itemTemplate = (item) => {
    return (
      <div className="p-clearfix">
        <div style={{ float: "left", fontSize: "12px", width: "100%" }}>
          {item?.NAME}
        </div>
      </div>
    );
  };

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    const data = [...newTableData];
    data[index][name] = value;
    setNewTableData(data);
  };

  useEffect(() => {
    bindCategroy();
    bindPanel();
    bindRoom();
    bindAllCategory();
  }, []);

  useEffect(() => {
    bindSubCategory();
  }, [values?.Category?.CategoryID]);

  useEffect(() => {
    BindIPDPackageMaster();
  }, [values?.subCategory?.SubCategoryID]);

  useEffect(() => {
    if (values?.PkgCategory?.value) {
      bindAllSubCategory();
    }
  }, [values?.PkgCategory?.value]);
  console.log("values?.PkgCategory?.value", dropDownSate.PkgCategory);
  useEffect(() => {
    BindPackageDetails();
  }, [values?.SelectPackage?.value]);

  useEffect(() => {
    setValues((val) => ({
      ...val,
      SelectedItem: "",
    }));
  }, [values?.PkgCategory?.value, values?.PkgSubCategory?.value]);
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
          handleChange={(name, e) => handleReactSelect(name, e)}
          dynamicOptions={[
            { label: "New", value: "1" },
            { label: "Edit", value: "0" },
          ]}
          searchable={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <ReactSelect
          placeholderName={t("Category")}
          requiredClassName={"required-fields"}
          name="Category"
          value={values?.Category?.value}
          handleChange={(name, e) => handleReactSelect(name, e)}
          dynamicOptions={dropDownSate?.Category}
          searchable={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <ReactSelect
          placeholderName={t("Sub Category")}
          requiredClassName={"required-fields"}
          name="subCategory"
          value={values?.subCategory?.value}
          handleChange={(name, e) => handleReactSelect(name, e)}
          dynamicOptions={dropDownSate?.SubCategory}
          searchable={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <Input
          type="text"
          className={"form-control required-fields"}
          lable={t("Package Name")}
          placeholder=" "
          name="PackageName"
          onChange={(e) => handleInputChange(e, 0, "PackageName")}
          value={values?.PackageName}
          required={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <Input
          type="text"
          className={"form-control"}
          lable={t("Validity Days")}
          placeholder=" "
          name="validitiy"
          onChange={(e) => handleInputChange(e, 0, "validitiy")}
          value={values?.validitiy}
          required={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <ReactSelect
          placeholderName={t("Is Active")}
          name="IsActive"
          value={values?.IsActive?.value}
          handleChange={(name, e) => handleReactSelect(name, e)}
          dynamicOptions={[
            { label: "Yes", value: "1" },
            { label: "No", value: "0" },
          ]}
          searchable={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <ReactSelect
          placeholderName={t("Select Package")}
          name="SelectPackage"
          requiredClassName={"required-fields"}
          value={values?.SelectPackage?.value}
          handleChange={(name, e) => handleReactSelect(name, e)}
          dynamicOptions={dropDownSate?.PackageType}
          searchable={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />

        <MultiSelectComp
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          name="ShowInPanel"
          id="ShowInPanel"
          placeholderName={t("Show In Panel")}
          dynamicOptions={dropDownSate?.Panel?.map((ele, i) => ({
            name: ele?.Company_Name,
            code: ele?.value,
          }))}
          handleChange={handleMultiSelectChange}
          value={values?.ShowInPanel}
        />

        <MultiSelectComp
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          name="RoomType"
          id="RoomType"
          requiredClassName={"required-fields"}
          placeholderName={t("Room Type")}
          dynamicOptions={dropDownSate?.RoomType?.map((ele, i) => ({
            name: ele?.Name,
            code: ele?.IPDCaseTypeID,
          }))}
          handleChange={handleMultiSelectChange}
          value={values?.RoomType}
        />
      </div>

      <Heading title={"Add Package Items"} isBreadcrumb={false} />
      <div className="row p-2">
        <ReactSelect
          placeholderName={t("Category")}
          name="PkgCategory"
          value={values?.PkgCategory?.value}
          requiredClassName={"required-fields"}
          handleChange={(name, e) => handleReactSelect(name, e)}
          dynamicOptions={dropDownSate?.PkgCategory}
          searchable={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <ReactSelect
          placeholderName={t("Sub Category")}
          name="PkgSubCategory"
          requiredClassName={"required-fields"}
          value={values?.PkgSubCategory?.value}
          handleChange={(name, e) => handleReactSelect(name, e)}
          dynamicOptions={dropDownSate?.PkgSubCategory}
          searchable={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <AutoComplete
          requiredClassName={"required-fields"}
          placeholder={t("Items")}
          value={searchvalue}
          suggestions={itemList}
          field="NAME"
          completeMethod={(e) => handleSearch(e, 0)}
          className="col-xl-2 col-md-4 col-sm-6 col-12"
          onSelect={(e) => handleSelectRow(e, 0)}
          itemTemplate={itemTemplate}
          onChange={(e) => {
            setSearchValue(e?.value);
          }}
        />
        <Input
          type="text"
          className={"form-control required-fields"}
          lable={t("Quantity")}
          placeholder=" "
          name="Quantity"
          onChange={(e) => handleInputChange(e, 0, "Quantity")}
          value={values?.Quantity}
          required={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <Input
          type="text"
          className={"form-control required-fields"}
          lable={t("Amount")}
          placeholder=" "
          name="Amount"
          onChange={(e) => handleInputChange(e, 0, "Amount")}
          value={values?.Amount}
          required={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <LabeledInput
          label={t("Selected Items")}
          value={values?.SelectedItem?.NAME}
          className="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <button
          className=" btn btn-sm btn-success ml-2 px-3"
          onClick={handleAdd}
        >
          {t("Add")}
        </button>
        {/* {values?.SelectedItem?.length > 0 && (
          <div className="col-12 mt-3">
            <label className="displayShow">{t("Selected items")}</label>
            <div
              className="doctorBind"
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "5px",
                padding: "8px 6px",
              }}
            >
              {values?.SelectedItem?.map((item, index) => (
                <div
                  key={index}
                  style={{
                    border: "1px solid #ccc",
                    padding: "5px 10px",
                    borderRadius: "5px",
                    display: "inline-flex",
                    alignItems: "center",
                    backgroundColor: "#f9f9f9",
                  }}
                >
                  <span style={{ marginRight: "8px" }}>{item?.NAME}</span>
                </div>
              ))}
            </div>
          </div>
        )} */}
      </div>

      {newTableData?.length > 0 && (
        <div>
          <Heading title={"Package Details"} isBreadcrumb={false} />

          <Tables
            thead={THEAD}
            tbody={newTableData?.map((ele, index) => ({
              Sno: index + 1,
              RoomType: ele?.roomType,
              packageType: ele?.packageType,
              category: ele?.pkgCategrory,
              subCategory: ele?.pkgSubCategory,
              itemName: ele?.itemName,
              quantity: (
                <Input
                  type="text"
                  className="table-input"
                  name={"quantity"}
                  removeFormGroupClass={true}
                  value={ele?.quantity}
                  onChange={(e) => handleChange(e, index)}
                />
              ),
              amount: (
                <Input
                  type="text"
                  className="table-input"
                  name={"amount"}
                  removeFormGroupClass={true}
                  value={ele?.amount}
                  onChange={(e) => handleChange(e, index)}
                />
              ),
              remove: (
                <div
                  className="fa fa-trash"
                  onClick={() => handleDelete(ele, index)}
                ></div>
              ),
            }))}
          />

          <div className="w-100 d-flex justify-content-end">
            <button
              className=" btn btn-sm btn-success col-xl-1 m-2 col-md-4 col-sm-6 col-12 "
              onClick={handleSave}
            >
              {values?.selectType?.value == 1 ? t("Save") : t("Update")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default IPDpkgMasterMain;
