import React, { useEffect, useState } from "react";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import { useTranslation } from "react-i18next";
import { StoreTypeOptions } from "../../../utils/constant";
import Heading from "../../../components/UI/Heading";
import Input from "../../../components/formComponent/Input";
import { AutoComplete } from "primereact/autocomplete";
import {
  BindStock,
  ConsumeBindItem,
  SaveConsume,
  SearchStock,
  ShowStock,
} from "../../../networkServices/InventoryApi";
import { useLocalStorage } from "../../../utils/hooks/useLocalStorage";
import Tables from "../../../components/UI/customTable";
import ConsumeItemDetails from "../../../components/UI/customTable/MedicalStore/ConsumeItemDetails";
import { notify } from "../../../utils/utils";
import DatePicker from "../../../components/formComponent/DatePicker";
import ConsumeSearchTable from "../../../components/UI/customTable/MedicalStore/ConsumeSearchTable";
import moment from "moment";
import { GetStore } from "../../../networkServices/BillingsApi";

const ConsumeItem = () => {
  const { VITE_DATE_FORMAT } = import.meta.env;
  const [t] = useTranslation();
  const localData = useLocalStorage("userData", "get");
  const ip = useLocalStorage("ip", "get");
  const [items, setItems] = useState([]);
  const [stockShow, setStockShow] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [searchedItems, setSearchedItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState({});
  const [value, setValue] = useState("");
  const [errors, setErrors] = useState({});
  const initialState = {
    StoreType: "STO00001",
    Quantity: "",
    Remarks: "",
    fromDate: new Date(),
    toDate: new Date(),
    itemName: "",
  };
  const [payload, setPayload] = useState({ ...initialState });
  const [storeType, setStoreType] = useState([]);
  const GetBindStoreID = async () => {
    try {
      const response = await GetStore();
      setStoreType(response?.data);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    GetBindStoreID();
  }, []);

  const handleReactSelect = (name, value) => {
    setPayload((val) => ({ ...val, [name]: value?.value || "" }));
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayload({
      ...payload,
      [name]: value,
    });
  };
  console.log(payload?.StoreType);
  const search = async () => {
    const ConfigID = payload?.StoreType === "STO00001" ? 11 : 28;
    const Dept = localData?.deptLedgerNo;

    try {
      const item = await ConsumeBindItem(ConfigID, Dept);
      setItems(item?.data);
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };

  const itemTemplate = (item) => {
    return (
      <div className="p-clearfix">
        <div style={{ float: "left", fontSize: "12px", width: "100%" }}>
          {item?.itemName}
        </div>
      </div>
    );
  };

  const getShowStock = async (val) => {
    const ItemID = val?.ItemID;
    const DeptLedNo = localData?.deptLedgerNo;
    try {
      const response = await ShowStock(ItemID, DeptLedNo);
      setStockShow(response?.data);
    } catch (error) {
      console.error(error);
    }
  };
  //   const getBindStock = async () => {
  //     const ItemID = selectedItem?.ItemID;
  //     const DeptLedNo = localData?.deptLedgerNo;
  //     try {
  //       const response = await BindStock(ItemID, DeptLedNo);
  //       setTableData(response?.data);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };

  const handleSelectRow = (e) => {
    const { value } = e;
    console.log(value);
    setSelectedItem(value);
    getShowStock(value);
    setPayload({
      ...payload,
      itemName: value?.ItemID,
    });
  };

  const thead = [
    t("Batch No."),
    t("Expiry Date"),
    { name: t("Avl.Qty."), width: "4%" },
    t("Unit"),
  ];
  const ItemHearder = [
    { name: t("S.No."), width: "3%" },
    t("Item Name"),
    { name: t("Batch No."), width: "10%" },
    { name: t("Expiry"), width: "10%" },
    { name: t("Quantity"), width: "4%" },
    { name: t("Unit"), width: "4%" },
    { name: t("Remove"), width: "4%" },
  ];
  const searchHeader = [
    { name: t("S.No."), width: "3%" },
    t("Item Name"),
    { name: t("Batch No."), width: "10%" },
    { name: t("Expiry"), width: "5%" },
    t("Consume By"),
    { name: t("Consume Date"), width: "5%" },
    { name: t("Unit Price"), width: "4%" },
    { name: t("Quantity"), width: "4%" },
    { name: t("Unit Cost"), width: "4%" },
  ];
  const handleDelete = (ele, index) => {
    const updatedItems = tableData?.filter((_, i) => i !== index);
    setTableData(updatedItems);
  };
  const handleSaveConsumeItems = async () => {
    const itemDetails = tableData?.map((val) => ({
      stockID: String(val?.stockid),
      itemID: Number(val?.ItemID),
      itemName: String(val?.ItemName),
      batchNumber: String(val?.BatchNumber),
      expiry: val?.MedExpiryDate,
      subCategory: Number(val?.SubCategoryID),
      unitType: 0,
      unitPrice: Number(val?.UnitPrice),
      mrp: Number(val?.MRP),
      qty: Number(val?.AvlQty),
      issueQty: 0,
      amount: 0,
      isExpirable: 0,
      purTaxPer: 0,
      saleTaxPer: 0,
    }));

    const bodyData = {
      remarks: String(payload?.Remarks),
      ipAddress: ip,
      storeType: 11,
      dtItem: itemDetails,
    };

    try {
      const response = await SaveConsume(bodyData);
      if (response?.success) {
        notify(response?.message, "success");
        setTableData([]);
        setStockShow([]);
        setValue("");
        setPayload(initialState);
      } else {
        notify(response?.message, "error");
      }
    } catch (error) {
      console.error("Something Went Wrong", error);
    }
  };

  const ErrorHandling = (data) => {
    let errors = {};
    if (!data?.itemName) {
      errors.itemName = "Item Name Is Required";
    }
    // if (data?.Type == "MI") {
    if (!data?.Quantity) {
      errors.Quantity = "Quantity Is Required";
    }
    if (!data?.StoreType) {
      errors.StoreType = "Store Type Is Required";
    }

    return errors;
  };

  const AddRowData = (data) => {
    const customerrors = ErrorHandling(data);
    if (Object.keys(customerrors)?.length > 0) {
      if (Object.values(customerrors)[0]) {
        notify(Object.values(customerrors)[0], "error");
        setErrors(customerrors);
      }
      return;
    }
    let list = [];
    let quantity = 0;
    if (data?.Quantity === "") {
      notify("Quantity Is Required", "error");
    } else {
      stockShow?.map((ele, index) => {
        if (quantity < Number(data?.Quantity)) {
          if (Number(data?.Quantity) - quantity > ele?.AvlQty) {
            list.push(ele);
            quantity += ele?.AvlQty;
          } else {
            list.push({ ...ele, AvlQty: Number(data?.Quantity) - quantity });
            quantity += Number(data?.Quantity) - quantity;
          }
        }
      });

      setTableData(list);
    }
  };

  const handleSearch = async () => {
    const resbody = {
      centreID: String(localData?.centreID),
      categoryID: "",
      subcategoryID: "",
      itemID: "",
      deptledgerNo: String(localData?.deptLedgerNo),
      fromDate: moment(payload?.fromDate).format("YYYY-MM-DD"),
      toDate: moment(payload?.toDate).format("YYYY-MM-DD"),
      storeLedgerNo: String(payload?.StoreType),
      tranType: "0",
    };
    try {
      // if (!payload?.itemName) {
      //   notify("Item Name Is Required", "error");
      // } else {
      const response = await SearchStock(resbody);
      setSearchedItems(response?.data);
      //   handleSaveConsumeItems();
      if (response?.success) {
        notify(response?.message, "success");
      } else {
        notify(response?.message, "error");
      }
      // }
    } catch (error) {
      console.error("Something Went Wrong", error);
    }
  };

  return (
    <>
      <div className="card patient_registration border">
        <Heading title={"Admitted Patients"} isBreadcrumb={true} />
        <div className="row p-2">
          <ReactSelect
            placeholderName={t("Store Type")}
            id={"StoreType"}
            searchable={true}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            name={"StoreType"}
            dynamicOptions={storeType?.map((ele) => {
              return {
                label: ele?.LedgerName,
                value: ele?.LedgerNumber,
              };
            })}
            value={payload?.StoreType}
            handleChange={handleReactSelect}
            requiredClassName={`required-fields ${errors?.StoreType ? "required-fields-active" : ""}`}
          />

          <div className="col-xl-4 col-md-4 col-sm-4 col-12 pb-2">
            <AutoComplete
              style={{ width: "100%" }}
              value={value}
              suggestions={items}
              completeMethod={search}
              //   className="w-100 required-fields"
              className={`w-100 required-fields ${errors?.Quantity ? "required-fields-active" : ""}`}
              onSelect={(e) => handleSelectRow(e)}
              id="searchtest"
              onChange={(e) => {
                const data =
                  typeof e.value === "object" ? e?.value?.itemName : e.value;
                setValue(data);
              }}
              itemTemplate={itemTemplate}
            />
            <label htmlFor={"searchtest"} className="lable searchtest">
              Search By Name
            </label>
          </div>
          <Input
            type="number"
            // className="form-control required-fields"
            className={`form-control required-fields ${errors?.Quantity ? "required-fields-active" : ""}`}
            lable={t("Quantity")}
            placeholder=" "
            id="Quantity"
            name="Quantity"
            display={"right"}
            onChange={handleChange}
            value={payload?.Quantity}
            required={true}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          />
          <div className="col-xl-3 col-md-3 col-sm-3 col-">
            <Tables
              thead={thead}
              tbody={stockShow?.map((ele, index) => ({
                "Batch No.": ele?.BatchNumber,
                "Expiry Date": (
                  <div className="text-center">{ele?.MedExpiryDate}</div>
                ),
                "Avl.Qty.": <div className="text-right">{ele?.AvlQty}</div>,
                "Unit Type": ele?.UnitType,
              }))}
              style={{ height: "50px" }}
            />
          </div>
          <div className="col-sm-1 pb-2">
            <button
              className="btn btn-sm btn-success"
              onClick={() => {
                AddRowData(payload);
              }}
            >
              Add Items
            </button>
          </div>
        </div>
      </div>
      {tableData?.length > 0 && (
        <>
          <div className="card my-2">
            <div className="row">
              <div className="col-sm-8">
                <ConsumeItemDetails
                  thead={ItemHearder}
                  tbody={tableData}
                  handleDelete={handleDelete}
                />
              </div>
              <div className="col-sm-4">
                <div className="row mt-2">
                  <Input
                    type="text"
                    className="form-control"
                    lable={t("Remarks")}
                    placeholder=" "
                    id="Remarks"
                    name="Remarks"
                    onChange={handleChange}
                    value={payload?.Remarks}
                    required={true}
                    respclass="col-xl-10 col-md-4 col-sm-4 col-12"
                  />
                  <div className="col-sm-2 pb-2">
                    <button
                      className="btn btn-sm btn-success"
                      onClick={handleSaveConsumeItems}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* <div className="card mt-1">
            <div className="row p-2">
              <Input
                type="text"
                className="form-control"
                lable={t("Remarks")}
                placeholder=" "
                id="Remarks"
                name="Remarks"
                onChange={handleChange}
                value={payload?.Remarks}
                required={true}
                respclass="col-xl-2 col-md-4 col-sm-4 col-12"
              />
              <div className="col-sm-2 pb-2">
                <button
                  className="btn btn-sm btn-success"
                  onClick={handleSaveConsumeItems}
                >
                  Save
                </button>
              </div>
            </div>
          </div> */}
        </>
      )}
      <div className="card mt-1">
        <div className="row p-2">
          <DatePicker
            className="custom-calendar"
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            id="fromDate"
            name="fromDate"
            value={
              payload.fromDate
                ? moment(payload?.fromDate, "YYYY-MM-DD").toDate()
                : null
            }
            handleChange={handleChange}
            lable={t("FrontOffice.OPD.OPDSetellment.label.FromDate")}
            placeholder={VITE_DATE_FORMAT}
          />
          <DatePicker
            className="custom-calendar"
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            id="toDate"
            name="toDate"
            value={
              payload.toDate
                ? moment(payload?.toDate, "YYYY-MM-DD").toDate()
                : null
            }
            handleChange={handleChange}
            lable={t("FrontOffice.OPD.OPDSetellment.label.ToDate")}
            placeholder={VITE_DATE_FORMAT}
          />
          <div className="col-sm-2 pb-2">
            <button className="btn btn-sm btn-success" onClick={handleSearch}>
              Search
            </button>
          </div>
        </div>
        <div className="row">
          <ConsumeSearchTable thead={searchHeader} tbody={searchedItems} />
        </div>
      </div>
    </>
  );
};

export default ConsumeItem;
