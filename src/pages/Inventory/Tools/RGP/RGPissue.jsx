import React, { useEffect, useState } from "react";
import Heading from "../../../../components/UI/Heading";
import ReactSelect from "../../../../components/formComponent/ReactSelect";
import { useTranslation } from "react-i18next";
import { GetStore } from "../../../../networkServices/BillingsApi";
import { handleReactSelectDropDownOptions, notify } from "../../../../utils/utils";
import { PrchaseTypeOption } from "../../../../utils/constant";
import {
  BindItemSupplair,
  ReturnBindVendor,
  SaveRGP,
  SaveSupplair,
  SearchSupplair,
} from "../../../../networkServices/InventoryApi";


import { useLocalStorage } from "../../../../utils/hooks/useLocalStorage";
import Input from "../../../../components/formComponent/Input";
import DetailsTablse from "./DetailsTablse";
import ReturnTable from "./ReturnTable";

const RGPissuer = () => {
  const [t] = useTranslation();
  const ip = useLocalStorage("ip", "get");
  const [tableData, setTableData] = useState([]);
  const [DropDownState, setDropDownState] = useState({
    bindStore: [],
    vender: [],
    items: [],
  });

  const initialPayload = {
    StoreType: "",
    venderID: "",
    Item: "",
    narration: "",
    requisition: "",
  };
  const [payload, setPayload] = useState({ ...initialPayload });

  console.log("TEST", DropDownState);

  const updatePayload = (name, value) => {
    setPayload((prev) => ({
      ...prev,
      [name]: value?.value || "",
    }));
  };
  const handleReactSelect = (name, value) => {
    updatePayload(name, value);

    switch (name) {
      case "StoreType":
        GetReturnBindVendor(value?.value);
        GetBindItemSupplair(value?.value);
        break;
      // case "venderID":
      //   GeReturnBindItem(
      //     value?.value,
      //     payload.StoreType,
      //     localdata?.deptLedgerNo
      //   );
      //   break;
      default:
        break;
    }
  };

  const GetBindStoreID = async () => {
    try {
      const response = await GetStore();
      return response?.data;
    } catch (error) {
      console.error(error);
    }
  };
  const GetReturnBindVendor = async (storeType) => {
    try {
      const response = await ReturnBindVendor(storeType);
      if (response.success) {
        const options = handleReactSelectDropDownOptions(
          response?.data,
          "LedgerName",
          "LedgerNumber"
        );

        setDropDownState((prev) => ({
          ...prev,
          vender: options,
        }));
      }
      else {
        notify("Vendor Not Found", "error");
      }
    } catch (error) {
      console.error("Error fetching department data:", error);
    }
  };
  const GetBindItemSupplair = async (storeType) => {
    try {
      const response = await BindItemSupplair(storeType);
      if (response.success) {

        setDropDownState((prev) => ({
          ...prev,
          items: handleReactSelectDropDownOptions(
            response?.data,
            "ItemName",
            "itemID"
          ),
        }));
      } else {
        notify("No Item Found", "error")
      }
    } catch (error) {
      console.error("Error fetching department data:", error);
    }
  };
  const FetchAllDropDown = async () => {
    try {
      const [BindGetStore] = await Promise.all([GetBindStoreID()]);
      const storeOptions = handleReactSelectDropDownOptions(
        BindGetStore,
        "LedgerName",
        "LedgerNumber"
      );
      const dropDownData = {
        bindStore: storeOptions
      };

      setDropDownState(dropDownData);

      // Set default value as first index item

      if (storeOptions.length > 0) {
        const defaultStore = storeOptions[0];
        console.log(defaultStore);

        setPayload((prev) => ({
          ...prev,
          StoreType: defaultStore?.LedgerNumber
        }))
        GetReturnBindVendor(defaultStore?.LedgerNumber);
        // GetBindItemSupplair(defaultStore?.LedgerNumber);

      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    FetchAllDropDown();
  }, []);
  const GeSearchSupplair = async () => {
    const ReturnOn = payload?.Type;
    const ItemID = payload?.Item;
    try {
      const response = await SearchSupplair(ReturnOn, ItemID);
      setTableData(response?.data || []);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };
  const thead = [
    { name: t("Action"), width: "0.2%" },
    { name: t("Item Name"), width: "10%" },
    { name: t("Batch No"), width: "10%" },
    { name: t("Expriy"), width: "10%" },
   
  ];
  const ListHead = [
    { name: t("S.No."), width: "3%" },
    t("Item Name"),
    { name: t("Batch No."), width: "10%" },
    { name: t("Expriy"), width: "10%" },
    { name: t("Action"), width: "3%" },
  ];
  // const handleCustomInput = (index, name, value, type, max) => {
  //   if (!isNaN(value) && Number(value) <= max) {
  //     const data = [...tableData];
  //     data[index][name] = value;
  //     setTableData(data);
  //   } else {
  //     return false;
  //   }
  // };

  const handleCustomInput = (index, name, value, type, max) => {
    if (name === "newBatchNo") {
      // Allow only letters and numbers, max 12 characters
      if (value.length > 12 || /[^A-Za-z0-9]/.test(value)) return;
    } else if (name === "ReturnQty") {
      // Allow only numbers, max 8 digits
      if (!/^\d{0,8}$/.test(value)) return;
    } else {
      if (!isNaN(value) && Number(value) <= max) {
        const data = [...tableData];
        data[index][name] = value;
        setTableData(data);
      } else {
        return;
      }
    }

    const data = [...tableData];
    data[index][name] = value;
    setTableData(data);
  };

  const handleChangeCheckbox = (e, ele, index) => {
    let data = tableData.map((val, i) => {
      if (i === index) {
        val.isChecked = e?.target?.checked;
      }
      return val;
    });
    setTableData(data);
  };
  const [list, setList] = useState([]);
  const AddRowData = () => {
    const checkedRows = tableData.filter((row) => row.isChecked === true);
    if(checkedRows?.length==0){
      notify("Please select atleast one item","warn")
      return 
    }
    setList((prevList) => [...prevList, ...checkedRows]);
    setTableData([]);
  };
  const handleRemove = (index) => {
    setList((prevState) => prevState.filter((_, i) => i !== index));
  };

  const sendReset = () => {
    setTableData([]);
    setList([]);
    setPayload({ ...initialPayload });
  };
  console.log(list);
  const handleSave = async () => {

    try {
      // const returnMeds = list?.map((ele) => {
      //   const unitPrice = Number(ele?.UnitPrice) || 0;
      //   const returnQty = Number(ele?.ReturnQty) || 0;
      //   const discountPer = Number(ele?.DiscountPer) || 0;
      //   const gstPer = Number(ele?.PurTaxPer) || 0;

      //   const discountAmount = (unitPrice * returnQty * discountPer) / 100;
      //   const gstAmount = (unitPrice * returnQty * gstPer) / 100;
      //   const totalAmount = unitPrice * returnQty - discountAmount + gstAmount;

      //   return {
      //     itemID: String(ele?.ItemID) || "",
      //     stockID: String(ele?.StockID) || "",
      //     itemName: String(ele?.ItemName) || "",
      //     batchNo: String(ele?.BatchNumber) || "",
      //     newBatchNo: String(ele?.newBatchNo) || "",
      //     subCategory: String(ele?.SubCategoryID) || "",
      //     unitPrice: unitPrice,
      //     mrp: Number(ele?.MRP) || 0,
      //     retQty: returnQty,
      //     amount: totalAmount.toFixed(2), // ✅ Corrected amount calculation
      //     discountPer: discountPer,
      //     discountAmt: discountAmount.toFixed(2), // ✅ Corrected discount amount calculation
      //     expDate: ele?.MedExpiryDate,
      //     isExpirable: String(ele?.IsExpirable) || "",
      //     purTaxPer: gstPer,
      //     saleTaxPer: Number(ele?.SaleTaxPer) || 0,
      //     igstPercent: Number(ele?.IGSTPercent) || 0,
      //     cgstPercent: Number(ele?.CGSTPercent) || 0,
      //     sgstPercent: Number(ele?.SGSTPercent) || 0,
      //     gstType: String(ele?.GSTType) || "",
      //     hsnCode: String(ele?.HSNCode) || "",
      //     grN_NO: "",
      //     invoiceNo: String(ele?.InvoiceNo) || "",
      //   };
      // });


      const Itempayload = {
        saveRGP:list.map((ele)=>({
           "stockID": Number(ele?.StockID),
           "remark": String(payload?.narration),
        }))

       }

      const response = await SaveRGP(Itempayload);
      if (response?.success) {
        notify(response?.message, "success");
        sendReset();
      } else {
        notify(response?.message, "error");
      }
    } catch (error) {
      console.error("Something went wrong", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayload((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  return (
    <>
      <div className="card">
        <Heading isBreadcrumb={true} title={t("RGP Issue")} />
        <div className="row p-2">
          <ReactSelect
            placeholderName={t("Store Type")}
            id="StoreType"
            searchable
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            name="StoreType"
            dynamicOptions={DropDownState?.bindStore}
            value={payload?.StoreType}
            handleChange={handleReactSelect}
            removeIsClearable={true}
          />
          <ReactSelect
            placeholderName={t("Supplier")}
            id={"venderID"}
            searchable={true}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            name={"venderID"}
            dynamicOptions={DropDownState?.vender}
            value={payload?.venderID}
            handleChange={handleReactSelect}
          />
          <ReactSelect
            placeholderName={t("Item")}
            id={"Item"}
            searchable={true}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            name={"Item"}
            dynamicOptions={DropDownState?.items}
            value={payload?.Item}
            handleChange={handleReactSelect}
          />
          <ReactSelect
            placeholderName={t("Type")}
            id={"Type"}
            searchable={true}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            name={"Type"}
            dynamicOptions={PrchaseTypeOption}
            value={payload?.Type}
            handleChange={handleReactSelect}
          />
          <div className="col-sm-1">
            <button
              className="btn btn-sm btn-success"
              onClick={GeSearchSupplair}
            >
              {t("Search")}
            </button>
          </div>
        </div>
      </div>
      {tableData?.length > 0 && (
        <div className="p-1">
          <DetailsTablse
            thead={thead}
            tbody={tableData}
            handleChangeCheckbox={handleChangeCheckbox}
            handleCustomInput={handleCustomInput}
          />
          {/* <div className="row p-2">
            <div className="col-sm-1">
              <div className="btn btn-sm btn-success" onClick={AddRowData}>
                {t("Add Item")}
              </div>
            </div>
          </div> */}
          <div className="row mt-2 p-2">
            <div className="col-sm-12 text-right">
              <button className="btn btn-sm btn-success" onClick={AddRowData}>
                {t("Add Item")}
              </button>
            </div>
          </div>
        </div>
      )}
      {list?.length > 0 && (
        <div className="card">
          <Heading title={"Return Items"} />
          <ReturnTable
            thead={ListHead}
            tbody={list}
            handleRemove={handleRemove}
          />
          <div className="row d-flex justify-content-end p-2">
            <Input
              type="text"
              className="form-control"
              id="narration"
              name="narration"
              value={payload?.narration}
              onChange={handleChange}
              lable={"Narration"}
              placeholder=" "
              respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
            />
           
            <div className="row p-1">
              <div className="col-sm-12 text-right">
                <button className="btn btn-sm btn-success" onClick={handleSave}>
                  {t("save")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RGPissuer;
