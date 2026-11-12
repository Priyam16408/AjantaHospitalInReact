import React, { useEffect, useState } from "react";
import Heading from "../../../components/UI/Heading";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import {
  BindGroupIndentStatusReport,
  GetItems,
  GetStore,
  ItemBindIndentStatusReport,
} from "../../../networkServices/BillingsApi";
import { useTranslation } from "react-i18next";
import { useLocalStorage } from "../../../utils/hooks/useLocalStorage";
import {
  BindMedicineStoreDepartment,
  BindStoreGroup,
  BindToolItem,
  ReturnBindItem,
  SaveChangeMRP,
  SearchChangeMRP,
} from "../../../networkServices/InventoryApi";
import Input from "../../../components/formComponent/Input";
import CurrentStockTable from "../../../components/UI/customTable/MedicalStore/CurrentStockTable";
import { handleReactSelectDropDownOptions, notify } from "../../../utils/utils";

const ChangeCurrentStockMRP = () => {
  const [t] = useTranslation();
  const localData = useLocalStorage("userData", "get");
  const [storeList, setStoreList] = useState([]);
  const [deptList, setDeptList] = useState([]);
  const [goupItems, setGoupItems] = useState([]);
  const [itemList, setItemList] = useState([]);
  const [rowList, setRowList] = useState({});
  const [tableData, setTableData] = useState([]);
  const initialState = {
    StoreType: "STO00001",
    departmentId: localData?.deptLedgerNo,
    groupId: "ALL",
    itemId: "ALL",
  };


  const [payload, setPayload] = useState({ ...initialState });
  useEffect(() => {
    console.log("payload" , payload)
  }, [payload])

  const handleReactSelect = (name, value) => {
    setPayload((prev) => ({
      ...prev,
      [name]: value?.value || "",
    }));

    console.log("values?.value" , value?.value  , payload?.StoreType ,name, localData?.deptLedgerNo);

    switch(name){
      case "groupId" : 
      // GetReturnBindItem(value?.value , payload.StoreType , localData?.deptLedgerNo);
      GetBindToolItem();
      break;
      default:
      break;
    }
  };
    const [DropDownState, setDropDownState] = useState({
      bindStore: [],
      department: [],
      items: [],
    });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPayload({
      ...payload,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const GetBindStoreID = async () => {
    try {
      const response = await GetStore();
      setStoreList(response?.data);
    } catch (error) {
      console.error(error);
    }
  };

  const GetBindDepartment = async () => {
    const DeptID = localData?.deptLedgerNo;
    try {
      const response = await BindMedicineStoreDepartment(DeptID);
      setDeptList(response?.data);
    } catch (error) {
      console.error(error);
    }
  };

  const GetBindPurchaseGroup = async () => {
    const StoreNo = payload?.StoreType;
    try {
      const response = await BindGroupIndentStatusReport(StoreNo);
      setGoupItems(response?.data);
    } catch (error) {
      console.error(error);
    }
  };

  const GetBindToolItem = async () => {
    const SubCategoryID = payload?.groupId || "ALL";
    const StoreID = payload?.StoreType || "STO00001";
    try {
      const response = await BindToolItem(SubCategoryID, StoreID);
      console.log("Response from GetBindToolItem" , response)
      setItemList(response?.data) || [];
      // setDropDownState((prev) => ({
      //   ...prev,
      //   department: handleReactSelectDropDownOptions(
      //     response?.data,
      //     "TypeName",
      //     "ItemID"
      //   )
      // }))
    } catch (error) {
      console.error("Error fetching items:", error);
      return [];
    }
  };
  const BindSearchChangeMRP = async () => {
    const Dept = payload?.departmentId;
    const Subcategory = payload?.groupId;
    const ItemID = payload?.itemId;
    const Price = payload?.isZeroPrice === true ? 1 : 0;
    // const StoreLedgerNo = payload?.StoreType;
    const StoreLedgerNo = "STO00002";
    try {
      const response = await SearchChangeMRP(
        Dept,
        Subcategory,
        ItemID,
        Price,
        StoreLedgerNo
      );
     if(response.success){
        notify(response?.data?.message, "success");
        setTableData(response?.data) || [];
     }
     else{
        notify(response?.data?.message, "error");
        setTableData([]);
     }
    
    } catch (error) { 
       notify(response?.message, "error");
      return [];
    }
  };
  // console.log("payload?.isZeroPrice", rowList);
  const GetReturnBindItem = async (department , storeType , ledgerNo) => {
    try{
      const response = await ReturnBindItem(department , storeType , ledgerNo);
      setDropDownState((prev) => ({
        ...prev,
        department: handleReactSelectDropDownOptions(
          response?.data,
          "LedgerName",
          "LedgerNumber"
        )
      }))
    }catch(error) {
      console.log("Error fetching departmentData" , error)
    }
  }
  const handleSubmit = async () => {
    const requestBody = {
      item: [
        {
          storeLedgerNO: String(rowList?.StoreLedgerNo) || "",
          itemID: String(rowList?.ItemID) || "",
          stockID: Number(rowList?.StockID) || 0,
          sellingPrice: Number(rowList?.SellingPrice) || 0,
          newSellingPrice: Number(rowList?.newUnitPrice) || 0,
        },
      ],
    };

    try {
      const response = await SaveChangeMRP(requestBody);
      if (response?.success) {
        notify(response?.message, "success");
        setTableData([]);
      } else {
        notify(response?.message, "error");
      }
    } catch (error) {
      console.error("Error fetching items:", error);
      return [];
    }
  };

  useEffect(() => {
    GetBindStoreID();
    GetBindDepartment();
    GetBindPurchaseGroup();
    GetBindToolItem();
  }, []);
  console.log(localData);
  const thead = [
    { name: t("S.No."), width: "3%" },
    { name: t("StockID"), width: "6%" },
    { name: t("Stock Date"), width: "6%" },
    t("Item Name"),
    { name: t("Batch Number"), width: "10%" },
    { name: t("Unit Price"), width: "10%" },
    { name: t("In Hand Qty."), width: "10%" },
    { name: t("Expiry Date"), width: "10%" },
    { name: t("New Unit. Price"), width: "10%" },
  ];

  const handleCustomInput = (index, ele, name, value, type, max) => {
    console.log(ele);
    if (!isNaN(value) && Number(value) <= max) {
      const data = [...tableData];
      data[index][name] = value;
      setTableData(data);
      setRowList(ele);
    } else {
      return false;
    }
  };
  return (
    <>
      <div className="card">
        <Heading isBreadcrumb={true} />
        <div className="row p-2">
          <ReactSelect
            placeholderName={t("Store Type")}
            id={"StoreType"}
            searchable={true}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            name={"StoreType"}
            dynamicOptions={storeList?.map((ele) => ({
              label: ele?.LedgerName,
              value: ele?.LedgerNumber,
            }))}
            value={payload?.StoreType}
            handleChange={handleReactSelect}
            isDisabled
          />
          <ReactSelect
            placeholderName={t("Department")}
            id={"departmentId"}
            searchable={true}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            name={"departmentId"}
            dynamicOptions={deptList?.map((ele) => ({
              label: ele?.ledgerName,
              value: ele?.ledgerNumber,
            }))}
            value={payload?.departmentId}
            handleChange={handleReactSelect}
            isDisabled
          />
          <ReactSelect
            placeholderName={t("Group")}
            id={"groupId"}
            searchable={true}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            name={"groupId"}
            dynamicOptions={[
              { label: "ALL", value: "ALL" },
              ...goupItems?.map((ele) => ({
                label: ele?.GroupHead,
                value: ele?.SubCategoryID,
              })),
            ]}
            value={payload?.groupId}
            handleChange={handleReactSelect}
          />
          <ReactSelect
            placeholderName={t("Item")}
            id={"itemId"}
            searchable={true}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            name={"itemId"}
            dynamicOptions={[
              { label: "ALL", value: "ALL" },
              ...itemList?.map((ele) => ({
                label: ele?.TypeName,
                value: ele?.ItemID,
              })) || [],
            ]}
            // dynamicOptions={DropDownState?.items}
            value={payload?.itemId}
            handleChange={handleReactSelect}
            removeIsClearable={true}
          />
          {/* <ReactSelect
            placeholderName={t("Item")}
            id="Item"
            searchable
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            name="Item"
            dynamicOptions={DropDownState?.items}
            value={payload?.Item}
            handleChange={handleReactSelect}
            removeIsClearable={true}
          /> */}
          <div className="col-sm-1 d-flex justify-content-between">
            <div className="d-flex">
              <Input
                type="checkbox"
                placeholder=" "
                className="mt-2"
                name="isZeroPrice"
                onChange={handleChange}
                checked={payload?.isZeroPrice}
                respclass="col-md-1 col-1"
              />
              <label className="mt-2 ml-3">{t("Zero Price")}</label>
            </div>
          </div>
          <div className="col-sm-1">
            <button
              className="btn btn-sm btn-success"
              onClick={BindSearchChangeMRP}
            >
              {t("Search")}
            </button>
          </div>
        </div>
      </div>
      {tableData?.length > 0 && (
        <div className="card">
          <CurrentStockTable
            thead={thead}
            tbody={tableData}
            handleCustomInput={handleCustomInput}
          />
          <div className="row p-2 text-right">
            <div className="col-sm-12">
              <button
                className="custom_save_button btn-primary btn-sm   ml-1 required-fields"
                onClick={handleSubmit}
                style={{ borderRadius: "2px !important" }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChangeCurrentStockMRP;
