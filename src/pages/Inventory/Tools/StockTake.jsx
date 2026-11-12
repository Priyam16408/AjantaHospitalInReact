import React, { useState, useEffect } from 'react';
import { GetStore, BindSubGroup, BindStoreDepartment, ToolBindDepartment } from "../../../networkServices/BillingsApi";
import Heading from "../../../components/UI/Heading";
import Input from "../../../components/formComponent/Input";
import { GetDataToFill } from "../../../networkServices/InventoryApi";

import ReactSelect from "../../../components/formComponent/ReactSelect";
import { useTranslation } from "react-i18next";
import { notify, handleReactSelectDropDownOptions } from '../../../utils/utils';
import Tables from '../../../components/UI/customTable';
import { StockTakeSaveData } from '../../../networkServices/InventoryApi';
import {  GetSubCategoryByCategory } from "../../../networkServices/BillingsApi";
import { useLocalStorage } from "../../../utils/hooks/useLocalStorage";





const StockTake = () => {
  const { VITE_DATE_FORMAT } = import.meta.env;
  const [t] = useTranslation();
  const [filter, setFilter] = useState({
    category: '',
    subCategory: '',
    department: '',
    itemName: ''
  });

  const [storeType, setStoreType] = useState([]);
  const [SubGroupType, setSubGroup] = useState([]);
  const [Department, setDepartment] = useState([]);
  const [ItemListData, setItemListData] = useState([]);
  const localData = useLocalStorage("userData", "get");


  const [errors, setErrors] = useState({});


  const initialState = {
    StoreType: "5",
    SubCategory: "",
    Department: localData?.deptLedgerNo?localData?.deptLedgerNo:"",
    Quantity: "",
    Remarks: "",
    fromDate: new Date(),
    toDate: new Date(),
    itemName: "",
  };
  const [payload, setPayload] = useState({ ...initialState });
  useEffect(() => {
    console.log("Payload", payload);
  },[payload])
  const GetBindStoreID = async () => {
    try {
      const response = await GetStore();
      setStoreType(response?.data);
    } catch (error) {
      console.error(error);
    }
  };
  const GetSubGroup = async () => {
    try {
      if (payload.StoreType == "") {
        setSubGroup([]);
      }
      const response = await GetSubCategoryByCategory(payload.StoreType);
      setSubGroup(response?.data);
    } catch (error) {
      console.error(error);
      setSubGroup([]);
    }
    // const getBindSubcategory = async (val) => {
    //   try {
    //     const response = await GetSubCategoryByCategory(val?.categoryID);
    //     return response?.data;
    //   } catch (error) {
    //     console.error(error);
    //   }
    // };
  };
  const GetDepartmentData = async () => {
    try {
      const response = await ToolBindDepartment();
      setDepartment(response?.data);
    } catch (error) {
      console.error(error);
      setDepartment([]);
    }
  };
  useEffect(() => {
    GetBindStoreID();
    GetSubGroup();
    GetDepartmentData();
  }, []);

  useEffect(() => {
    GetSubGroup();
  }, [payload.StoreType]);

  const handleReactSelect = (name, value) => {
    setPayload((val) => ({ ...val, [name]: value?.value || "" }));
  };

  const handleChange = (e) => {
    // debugger
    const { name, value } = e.target;
    console.log("Namez" , name , "Value" , value)
    setPayload((val) => ({ ...val, [name]: value }));
  };
  const ErrorHandling = (data) => {
    let errors = {};
    if (!data?.StoreType) {
      errors.StoreType = "Store Type Is Required";
    }
    if (!data?.SubCategory) {
      errors.SubCategory = "Sub Category Is Required";
    }
    // if (data?.Type == "MI") {
    if (!data?.Department) {
      errors.Department = "Department Is Required";
    }
    return errors;
  };
  const handleSearch = async (data) => {
    const customerrors = ErrorHandling(data);

    if (Object.keys(customerrors)?.length > 0) {
      if (Object.values(customerrors)[0]) {
        notify(Object.values(customerrors)[0], "error");
        setErrors(customerrors);
      }
      return;
    }
    const payLoadList = {
      categoryID: payload.StoreType,
      subCategoryID: payload.SubCategory,
      itemName: payload.itemName,
      department: payload?.Department
    };
    try {
      const response = await GetDataToFill(payLoadList);

      console.log("response from GETDATATOFILL" , response)
      if (response?.success) {
        setItemListData(response.data);
      }
      else{
        notify(response.message,'error')
        setItemListData([]);

      }
    } catch (error) {
      console.error("Error fetching item names: ", error);
      notify(response.message,'error')

      setItemListData([]);

    }
  };
  const PhysicalCountChange = (e, index) => {
    const { value } = e.target;

    setItemListData((prevData) =>
      prevData.map((item, i) =>
        i === index
          ? { ...item, PhysicalCount: value, Variance: value - item.InitialCount }
          : item
      )
    );
  };

  const THEAD = [
    t("S.No."),
    t("Stock ID"),
    t("SubCategory"),
    t("ItemName"),
    t("BatchNo"),
    t("ExpiryDate"),
    t("UnitPrice"),
    t("MRP"),
    t("AvailableQty"),
    t("Physical Qty"),
    t("Variance Qty"),
  ]
  const formatRowData = (item, index) => {
    return {
      SN: index + 1, // Serial number
      StockID: item.StockID || "-",
      SubCategory: item.SubCategory || "-",
      ItemName: item.ItemName || "-",
      BatchNo: item.BatchNumber || "-",
      ExpiryDate: item.MedExpiryDate || "-", // Format if necessary
      UnitPrice: item.UnitPrice || "0.00",
      MRP: item.MRP || "0.00",
      AvailableQty: item.InitialCount || "0",
      PhysicalCount: <Input
        type="text"
        className="table-input"
        removeFormGroupClass={true}
        display={"right"}
        name={"PhysicalCount"}
        value={item?.PhysicalCount}
        onChange={(e) => PhysicalCountChange(e, index)}
        disabled={item.IsRequestPending == '0' ? false : true}
      />,
      Variance: item?.Variance||0, // type="text" Calculate variance
    };
  };
  const handleSave = async () => {
    // Ensure ItemListData is an array of objects
    const payload = {
      Data: Array.isArray(ItemListData) ? ItemListData : [ItemListData],
    };

    const filteredData = payload.Data.filter((item) => item.PhysicalCount > 0);
    const SendingPayload = {
      Data:Array.isArray(filteredData) ? filteredData : [filteredData]
    }
    console.log("FilteredData" , filteredData)
    if (filteredData.length === 0) {
      notify("Please enter physical count for at least one item", "error");
      return;
    }
  
    try {
      // console.log("Payload")
      const response = await StockTakeSaveData(SendingPayload);
  
      if (response?.success) {
        notify(response?.message, "success");
        setPayload(initialState);
        setItemListData([]);
      } else {
        notify(response?.message, "error");
        setPayload(initialState);

        setItemListData([]);

      }
    } catch (error) {
      notify(error?.message || "An error occurred", "error");
      setPayload(initialState);

      setItemListData([]);

    }
  };
  
  return (
    <>
      <div className="card patient_registration border">
        <Heading title={"Admitted Patients"} isBreadcrumb={true} />
        <div className="row p-2">
          <ReactSelect
            placeholderName={t("Category")}
            id={"StoreType"}
            searchable={true}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            name={"StoreType"}
            removeIsClearable={true}
            dynamicOptions={[
              { label: " Medical Store Items", value: "5" },
              { label: "General Store Items", value: "8" },
            ]}
            value={payload?.StoreType}
            handleChange={handleReactSelect}
            requiredClassName={`required-fields ${errors?.StoreType ? "required-fields-active" : ""}`}
          />
          <ReactSelect
            placeholderName={t("Sub Category")}
            id={"SubCategory"}
            searchable={true}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            name={"SubCategory"}
            dynamicOptions={handleReactSelectDropDownOptions(SubGroupType, "name", "subCategoryID")}
            value={payload?.SubCategory}
            handleChange={handleReactSelect}

            requiredClassName={`required-fields ${errors?.SubCategory ? "required-fields-active" : ""}`}
          />
          {console.log("Department" , Department)}
          <ReactSelect
            placeholderName={t("Department")}
            id={"Department"}
            searchable={true}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            name={"Department"}
            dynamicOptions={handleReactSelectDropDownOptions(Department, "ledgerName", "ledgerNumber")}
            value={payload?.Department}
            handleChange={handleReactSelect}

            requiredClassName={`required-fields ${errors?.Department ? "required-fields-active" : ""}`}
          />
          <Input
            type="text"
            className="form-control"
            lable={t("Item Name")}
            placeholder=" "
            id="itemName"
            name="itemName"
            value={payload?.itemName}
            onChange={handleChange}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          />
          <button className="btn btn-primary" onClick={() => { handleSearch(payload) }} >{t("Search")}</button>
        </div>
      </div>
      {console.log("ItemLisstData" , ItemListData)}
      <div className= {ItemListData.length>0?"card ":"d-none"}>
        <Heading title={"Item Details"} />
        <div className="row">
          <div className="col-sm-12">

            <Tables thead={THEAD} tbody={ItemListData.map((item, index) => formatRowData(item, index))} tableHeight="tableHeight" style={{ maxHeight: "auto" }} />
          </div></div>
        <div className="row p-2">

          <div className="col-12 d-flex justify-content-md-end">

            <button className="btn btn-primary save-button mx-2"
            onClick={handleSave}
            >{t("Save")}</button>
          </div>
        </div>


      </div>
    </>
  );
};

export default StockTake;
