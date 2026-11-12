import React, { useEffect, useState } from "react";
import Heading from "../../../components/UI/Heading";
import Input from "../../../components/formComponent/Input";
import { useTranslation } from "react-i18next";
import DatePicker from "../../../components/formComponent/DatePicker";
import moment from "moment";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import { GetStore } from "../../../networkServices/BillingsApi";
import {
  GetExpiryItems,
  SaveItemExpiry,
} from "../../../networkServices/InventoryApi";
import { handleReactSelectDropDownOptions, notify } from "../../../utils/utils";
import { useLocalStorage } from "../../../utils/hooks/useLocalStorage";
import RenewExpiryItemTable from "../../../components/UI/customTable/MedicalStore/RenewExpiryItemTable";

const RenewExpiryItem = () => {
  const [t] = useTranslation();
  const userData = useLocalStorage("userData", "get");
  const { VITE_DATE_FORMAT } = import.meta.env;
  const [storeList, setStoreList] = useState([]);
  const [tableData, setTableData] = useState([]);
  const initialState = {
    ignoreDetails:{value:"0",label:"No"},
    fromDate: new Date(),
    toDate: new Date(),
    StoreType: "STO00001",
    itemName: "",
  };
  const [payload, setPayload] = useState({ ...initialState });
  const handleChange = (e) => {
    const { name, value, checked, type } = e?.target;
    setPayload({
      ...payload,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    });
  };


    const IgnoreDates= [
    {value:"1",label:"Yes"},
    {value:"0",label:"No"}, 
  ]


  const handleChangeDate = (e, index) => {
    const { name, value } = e?.target;
    const updatedTableData = tableData?.map((item, i) => {
      if (i === index) {
        return {
          ...item,
          [name]: value,
        };
      }
      return item;
    });

    setTableData(updatedTableData);
  };

  const handleReactSelect = (name, value) => {
    setPayload((prev) => ({
      ...prev,
      [name]: value?.value || "",
    }));
  };

  const GetBindStoreID = async () => {
    try {
      const response = await GetStore();
      setStoreList(response?.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearch = async () => {
    
    const reqBody = {
      storeLedNo: String(payload?.StoreType) || "",
      fromDate: moment(payload?.fromDate).format("YYYY-MM-DD"),
      toDate: moment(payload?.toDate).format("YYYY-MM-DD"),
      itemName: String(payload?.itemName) || "",
      itemType: "",
      filter: "",
      department: String(userData?.deptLedgerNo) || "",
      isExpirable: 0,
    };
    try {
      const response = await GetExpiryItems(reqBody);
      const newRes = response?.data?.map((ele) => ({
        ...ele,
        expDate: "",
      }));
      if (response?.success) {
        notify(response?.message, "success");
        setTableData(newRes);
      } else {
        notify(response?.message, "error");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleSaveItemExpiry = async (item) => {
  console.log("item",item)
    const reqBody = {
      stockID: String(item?.StockID) || "",
      itemId: String(item?.ItemID) || "",
      oldExpDate: item?.MedExpiryDate,
      expDate: item?.MedExpiryDate,
      hsnCode: item?.HSNCode,
      expDate:item?.expDate? moment(item?.expDate).format("DD-MMM-YYYY") : moment().format("DD-MMM-YYYY"),
      batchNumber:String(item?.BatchNumber)
    };

    // {
    //   "stockID": "string",
    //   "itemId": "string",
    //   "oldExpDate": val?.MedExpiryDate,
    //   "expDate": "2025-04-17T11:35:05.119Z",
    //   "hsnCode": "string",
    //   "batchNumber": "string"
    // }
    try {
      const response = await SaveItemExpiry(reqBody);
      if (response?.success) {
        handleSearch();
        notify(response?.message, "success");
      } else {
        notify(response?.message, "error");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    GetBindStoreID();
  }, []);

 


  const thead = [
    { name: t("Item Name"), width: "50%" },
    { name: t("Expiry Date"), width: "20%" },
    { name: t("Batch No."), width: "10%" },
    { name: t("HSN Code"), width: "10%" },
    { name: t("Quantity"), width: "10%" },
    { name: t("Edit"), width: "5%" },
  ];
  const handleChangeCheckbox = (e, ele, index) => {
    let data = tableData?.map((val, i) => {
      if (i === index) {
        val.isChecked = e?.target?.checked;
      }
      return val;
    });
    setTableData(data);
  };

  console.log(payload?.ignoreDetails,"payload value");

  return (
    <>
      <div className="card">
        <Heading isBreadcrumb={true} />
        <div className="row p-2">


          {/* <div className="d-flex">
            <Input
              type="checkbox"
              placeholder=" "
              className="mt-2"
              name="isActive"
              onChange={handleChange}
              checked={payload?.isActive}
              respclass="col-md-1 col-1"
            />
            <label className="mt-2 ml-3">{t("Ignore Dates")}</label>
          </div> */} 

              <ReactSelect
            placeholderName={t("Ignore Dates")}
            id={"ignoreDetails"}
            searchable={true}
            respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
            name={"ignoreDetails"}
            // dynamicOptions={IgnoreDates}
              dynamicOptions={[
                          { value: "0", label: "No" },
                          ...handleReactSelectDropDownOptions(
                            IgnoreDates, 
                            "label",
                            "value"
                          ),
                        ]}
            value={payload?.ignoreDetails?.value}
            handleChange={handleReactSelect}
          />

          <DatePicker
            className="custom-calendar"
            respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
            id="fromDate"
            name="fromDate"
            value={
              payload.fromDate
                ? moment(payload?.fromDate, "YYYY-MM-DD").toDate()
                : null
            }
            handleChange={handleChange}
            lable={t("FromDate")}
            placeholder={VITE_DATE_FORMAT}
            disable={payload.ignoreDetails?.value == 0 ? true : false}
          />
          <DatePicker
            className="custom-calendar"
            respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
            id="toDate"
            name="toDate"
            value={
              payload.toDate
                ? moment(payload?.toDate, "YYYY-MM-DD").toDate()
                : null
            }
            handleChange={handleChange}
            lable={t("ToDate")}
            placeholder={VITE_DATE_FORMAT}
          />
          <ReactSelect
            placeholderName={t("Store Type")}
            id={"StoreType"}
            searchable={true}
            respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
            name={"StoreType"}
            dynamicOptions={storeList?.map((ele) => ({
              label: ele?.LedgerName,
              value: ele?.LedgerNumber,
            }))}
            value={payload?.StoreType}
            handleChange={handleReactSelect}
          />
          <Input
            type="text"
            className="form-control"
            id="itemName"
            name="itemName"
            value={payload?.itemName}
            onChange={handleChange}
            lable={t("Item Name")}
            placeholder=" "
            respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
          />
          <div className="col-sm-1 d-flex justify-content-between">
            <button
              className="btn btn-sm btn-success mx-1"
              onClick={handleSearch}
            >
              {t("Search")}
            </button>
            <button className="btn btn-sm btn-success mx-1">{t("Report")}</button>
          </div>
        </div>
      </div>
      <div className="card">
        {console.log("tableData",tableData)}
        <RenewExpiryItemTable
          thead={thead}
          tbody={tableData}
          handleChangeCheckbox={handleChangeCheckbox}
          handleSaveItemExpiry={handleSaveItemExpiry}
          handleChangeDate={handleChangeDate}
        />
      </div>
    </>
  );
};

export default RenewExpiryItem;
