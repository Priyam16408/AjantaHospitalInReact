
import React, { useEffect, useState } from "react";
import Heading from "../../../components/UI/Heading";
import { useTranslation } from "react-i18next";
import { handleReactSelectDropDownOptions, notify } from "../../../utils/utils";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import {
  OnEditPurchaseRequest,
  PReqGetPRDetailsReport,
  PurchaGetBindAllCenter,
  PurchaGetDepartMent,
  PurchaGetItemsByCategory,
  PurchaGetSubCategoryByCategory,
  PurchaseGetItems,
  PurchaseGetItemStockDetails,
  PurchaseRequestItems,
  SavePurchaseRequest,
} from "../../../networkServices/Purchase";
import DatePicker from "../../../components/formComponent/DatePicker";
import Input from "../../../components/formComponent/Input";
import Tables from "../../../components/UI/customTable";
import TextAreaInput from "../../../components/formComponent/TextAreaInput";
import { useLocalStorage } from "../../../utils/hooks/useLocalStorage";
import { AutoComplete } from "primereact/autocomplete";
import GetPurchaseReq from "./GetPurchaseReq";
import moment from "moment";
import { RedirectURL } from "../../../networkServices/PDFURL";
const CreatePurchaseRequest = () => {
  const ip = useLocalStorage("ip", "get");
  const [t] = useTranslation();
  const [items, setItems] = useState([]);
  const [isEdit, setIsEdit] = useState(false)
  const [isFalse, setIsFalse] = useState(false)
  const [loading, setLoading] = useState(false)
  const initialItem = { ItemName: "", Quantity: "", CurStock: "", PurchaseUnit: "", NetQuantity: "", ConversionFactor: "", MaxLevel: "", IndentQuantity: "", Remark: "", narration: "" }
  const [bodyData, setBodyData] = useState([initialItem]);
  const localData = useLocalStorage("userData", "get")
  // console.log("localData",localData)
  const { VITE_DATE_FORMAT } = import.meta.env;
  const [payload, setPayload] = useState({
    storeType: { label: "Medical Store", value: "STO00001" },
    departmentTo: {},
    allCenter: {
      CentreID: 1,
      CentreName: "MOHANDAI OSWAL HOSPITAL",
      IsDefault: 0,
      label: "MOHANDAI OSWAL HOSPITAL", value: 1
    },
    category: {
      categoryID: "5",
      configID: "11",
      label: "MEDICAL STORE ITEMS",
      name: "MEDICAL STORE ITEMS",
      value: "5"
    },
    subCategory: { label: "All", value: "0", subCategoryID: "0" },
    stockDetails: {},
    ItemName: {},
    requisitionType: {
      label: "Normal",
      value: "normal"
    },
    requisitionOn: new Date(),
    narration: "",
    fromDate: new Date(),
    toDate: new Date(),
    minDays: "",
    requestFor: "",
    reOrderOption: false,
  });

  const [dropDownState, setDropDownState] = useState({
    GetDepartMent: [],
    GetBindAllCenter: [],
    GetItemsByCategory: [],
    GetItemsBySubCategory: [],

    StockDetails: [],
    GetItems: [],
  });
  const getPurchaGetBindAllCenterAPI = async () => {
    try {
      const GetBindAllCenter = await PurchaGetBindAllCenter();
      setDropDownState((val) => ({
        ...val,
        GetBindAllCenter: handleReactSelectDropDownOptions(
          GetBindAllCenter?.data,
          "CentreName",
          "CentreID"
        ),
      }));
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };

  const getItemsByCategory = async (storeID) => {
    try {
      const GetItemsByCategory = await PurchaGetItemsByCategory(storeID);
      console.log("GetItemsByCategory", GetItemsByCategory)
      setDropDownState((val) => ({
        ...val,
        GetItemsByCategory: handleReactSelectDropDownOptions(
          GetItemsByCategory?.data,
          "name",
          "categoryID"
        ),
      }));

      setPayload((preV) => ({
        ...preV,
        category: GetItemsByCategory?.data[0]
      }))
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };


  const getItemsBySubCategory = async (categoryID) => {
    console.log("firstcategoryID", categoryID)
    try {
      const GetItemsBySubCategory =
        await PurchaGetSubCategoryByCategory(categoryID);
      setDropDownState((val) => ({
        ...val,
        GetItemsBySubCategory: handleReactSelectDropDownOptions(
          GetItemsBySubCategory?.data,
          "name",
          "subCategoryID"
        ),
      }));
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };

  const renderPurchaGetDepartMentAPI = async () => {
    try {
      const GetDepartMent = await PurchaGetDepartMent();
      if (GetDepartMent?.success) {
        setDropDownState((val) => ({
          ...val,
          GetDepartMent: handleReactSelectDropDownOptions(
            GetDepartMent?.data,
            "RoleName",
            "DeptLedgerNo"
          ),
        }));
      }
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };


  const handleReactChange = (name, e, key) => {
    console.log("name", name, e)
    setPayload((val) => ({ ...val, [name]: e }));
    if (name === "category") {
      // getItemsBySubCategory(e.value);
    }
    else if (name === "storeType") {
      getItemsByCategory(e?.value);
    }
  };

  const searchHandleChange = (e) => {
    const { name, value } = e.target;
    setPayload((prevState) => ({
      ...prevState,
      [name]: moment(value).format("YYYY-MM-DD"),
    }));
  };
  useEffect(() => {
    getItemsBySubCategory(payload?.category?.categoryID);
  }, [payload?.storeType, payload?.category])

  useEffect(() => {
    getPurchaGetBindAllCenterAPI();
    getItemsByCategory(payload?.storeType?.value);
    renderPurchaGetDepartMentAPI();
    // getItemsBySubCategory(payload?.category?.value);
  }, []);

  const handleGetAutoPurchaseRequestItems = async () => {
    if (!payload.departmentTo.value) {
      notify("Please select department", "error")
      return
    }
    if (!payload.category) {
      notify("Please select category", "error")
      return
    }
    if (!payload.subCategory.subCategoryID) {
      notify("Please select subCategory", "error")
      return
    }
    try {
      let data = {
        departmentLedgerNo: payload.departmentTo.DeptLedgerNo,
        toDate: moment(payload?.toDate).format("DD-MMM-YYYY"),
        fromDate: moment(payload?.fromDate).format("DD-MMM-YYYY"),
        minDays: 0,
        reorderInDays: 0,
        includeStoreToStore: payload?.reOrderOption ? true : false,
        categoryID: payload.category.categoryID,
        subCategoryID: payload.subCategory.subCategoryID,
        reorderOrConsumption: 0
      };

      const response = await PurchaseRequestItems(data);
      // console.log("response",response)
      // notify(response.message,"error")
      if (response.data.length > 0) {
        // if (response?.success) {
        setBodyData([...(response?.data || []), initialItem])

      } else if (response.data.length <= 0) {
        // notify(response?.message, "error");
        setBodyData([...(response?.data || []), initialItem])
        notify(response.message, "error")
      }
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };

  const handleGetAutoPurchaseRequestOnConsumption = async () => {
    if (!payload.departmentTo.value) {
      notify("Please select department", "error")
      return
    }
    if (!payload.category) {
      notify("Please select category", "error")
      return
    }
    if (!payload.subCategory.subCategoryID) {
      notify("Please select subCategory", "error")
      return
    }
    if (!payload.minDays) {
      notify("Please fill Min Days", "error")
      return
    }
    if (!payload.requestFor) {
      notify("Please fill Request For", "error")
      return
    }
    try {
      let data = {
        departmentLedgerNo: payload.departmentTo.DeptLedgerNo,
        toDate: moment(payload?.toDate).format("DD-MMM-YYYY"),
        fromDate: moment(payload?.fromDate).format("DD-MMM-YYYY"),
        minDays: payload?.minDays,
        reorderInDays: payload?.requestFor,
        includeStoreToStore: payload?.reOrderOption ? true : false,
        categoryID: payload.category.categoryID,
        subCategoryID: payload.subCategory.subCategoryID,
        reorderOrConsumption: 1
      };
      const response = await PurchaseRequestItems(data);
      if (response?.success) {
        setBodyData([...(response?.data || []), initialItem])
        // console.log("response",response.message)
        notify(response?.message, "success");
      }
      // else if (response?.success) {
      //   notify(response?.message, "success");
      // }
      else {
        notify(response?.message, "error");
      }
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };


  const handleSavePurchaseRequest = async () => {

    const filteredBodyData = bodyData.slice(0, bodyData.length - 1);
    const Quantity = filteredBodyData.some((item) => item.Quantity == "");
    const Remark = filteredBodyData.some((item) => item.Remark == "");
    let department = payload?.departmentTo?.value;
    let item = bodyData

    if (!department) {
      notify("select department ", "error");
      return
    }
    if (item.length < 2) {
      notify("Please Select Item First.", "error");
      return
    }
    if (!payload.requisitionType) {
      notify("Please Select requisitionType.", "error");
      return
    }
    if (Quantity) {
      notify("Invalid Quantity ", "error");
      return
    }
    if (!payload.narration) {
      notify("Narration is Required", "error");
      return
    }
    if (Remark) {
      notify("Remark is Required", "error");
      return
    }
    try {
      let data = {
        purchaseRequestNo: "",
        storeId: payload?.storeType?.value,
        requestType: payload?.requisitionType?.value,
        issueToDepartment: payload?.departmentTo?.value,
        ipAddress: ip,
        requisitionDate: moment(payload?.requisitionOn).format("YYYY-MM-DD"),
        issueToCenterID: payload?.allCenter?.CentreID,
        narration: payload.narration,
        item: filteredBodyData?.map((item) => ({
          itemName: item?.ItemName?.ItemName,
          subCategoryID: item?.ItemName?.SubCategoryID,
          itemID: item?.ItemName?.ItemID,
          minlevel: item?.stockDetails?.MinLevel ? item.stockDetails?.MinLevel : "0",
          maxlevel: item?.stockDetails?.MaxLevel ? item.stockDetails?.MaxLevel : "0",
          quantity: Number(item?.Quantity),
          // quantity: item?.ItemName?.Qty,
          narration: item?.Remark,
          currentStock: item?.stockDetails?.StockQuantity,
          poStock: item?.stockDetails?.POQuantity,
          purchaseUnit: item?.ItemName?.MajorUnit,
          indentQuantity: 0,
          salesQuantity: 0,
          netQuantity: Number(item?.Quantity),
          indentNumber: "",
          id: 0
        }))

      }

      const response = await SavePurchaseRequest(data);
      if (response?.success) {
        // RedirectURL(response?.data);

        setBodyData([initialItem])
        setPayload((preV) => ({
          ...preV,
          narration: ""
        }))
        setLoading(!loading)

        const payload = {
          PrNumber: response?.data
        }

        try {
          const response = await PReqGetPRDetailsReport(payload)
          if (response?.success) {

            RedirectURL(response?.data?.pdfUrl);

          }
        } catch (error) {
          console.error("Error fetching data:", error);
          notify(error?.message || "An error occurred during search.", "error");
        }


      } else {
        notify(response?.message, "error");
      }
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };

  const handleUpDatePurchaseRequestAPI = async () => {
    const PurchaseRequestNo = bodyData[0].PurchaseRequestNo
    // const PurchaseRequestNo = bodyData[bodyData.length - 1].PurchaseRequestNo
    // const filteredBodyData = bodyData;
    const filteredBodyData = bodyData.slice(0, bodyData.length - 1);
    const Quantity = filteredBodyData.some((item) => item.Quantity == "");
    const Remark = filteredBodyData.some((item) => item.Remark == "");
    let department = payload?.departmentTo?.value;
    let item = bodyData


    if (!payload.narration) {
      notify("Narration is Required", "error");
      return
    }
    if (!payload.requisitionOn) {
      notify("requisitionOn is Required", "error");
      return
    }
    if (item.length < 1) {
      notify("Please Select Item First.", "error");
      return
    }
    if (!payload.requisitionType) {
      notify("Please Select requisitionType.", "error");
      return
    }
    if (Quantity) {
      notify("Invalid Quantity ", "error");
      return
    }

    try {
      let data = {
        purchaseRequestNo: payload?.PurchaseRequestNo,
        storeId: payload?.storeType?.value,
        requestType: payload?.requisitionType?.value,
        issueToDepartment: payload?.departmentTo?.value,
        ipAddress: ip,
        requisitionDate: payload?.requisitionOn,
        issueToCenterID: payload?.allCenter?.CentreID,
        narration: payload.narration,
        item: filteredBodyData?.map((item) => ({
          itemName: item?.ItemName,
          subCategoryID: item?.SubCategoryID,
          itemID: item?.ItemID,
          minlevel: item?.MinLevel ? item?.MinLevel : "0",
          maxlevel: item?.MaxLevel ? item?.MaxLevel : "0",
          quantity: Number(item?.Quantity),
          narration: item?.Remark,
          currentStock: item?.StockQuantity ? item?.StockQuantity : "0",
          poStock: item?.PoStock ? item?.PoStock : "0",
          purchaseUnit: item?.PurchaseUnit,
          indentQuantity: item?.IndentQuantity,
          salesQuantity: item?.SalesQuantity,
          netQuantity: Number(item?.Quantity),
          id: item.ID,
          // netQuantity: Number(item?.Quantity),
          indentNumber: "",


        }))

      }


      const response = await SavePurchaseRequest(data);
      if (response?.success) {
        notify("Updated successfully!", "success");
        setIsEdit(false)
        setBodyData([initialItem])
        setLoading(!loading)
        setPayload((preV) => ({
          ...preV,
          narration: ""
        }))
      } else {
        notify(response?.message, "error");
      }
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayload({ ...payload, [name]: value });

  };

  const handleCustomInput = (ind, name, value) => {
    setBodyData((prevState) => {
      const updatedData = [...prevState];
      updatedData[ind][name] = value;
      return updatedData;
    });


  };

  const THEAD = [
    { name: t("S.No."), width: "0.5%" },
    { name: t("Item Name"), width: "15%" },
    { name: t("Qty."), width: "5%" },
    { name: t("Cur. Stock"), width: "10%" },
    { name: t("Unit"), width: "5%" },
    { name: t("ReOrder Level"), width: "6%" },
    { name: t("ReOrder Qty"), width: "6%" },
    { name: t("Net Qty."), width: "6%" },
    { name: t("Min Level"), width: "6%" },
    { name: t("Max Level"), width: "6%" },
    { name: t("Panding PC"), width: "10%" },
    { name: t("C-Factor"), width: "5%" },
    { name: t("Remark"), width: "22%" },
    // { name: t("M"), width: "5%" },
  ];


  const itemTemplate = (item) => {
    return (
      <div className="p-clearfix">
        <div style={{ float: "left", fontSize: "12px", width: "100%" }}>
          {item?.ItemName}
        </div>
      </div>
    );
  };

  const handleGetLoadOPD_All_ItemsLabAutoComplete = async (prefix) => {
    let storeID = payload?.storeType?.value;

    try {
      const data = await PurchaseGetItems(prefix?.prefix, storeID);

      if (prefix?.prefix?.length >= 3) {
        let filteredData = data?.data?.filter((item) =>
          item.ItemName?.toLowerCase().startsWith(prefix?.prefix?.toLowerCase())
        );
        return filteredData
      } else {
        console.log("Prefix too short for filtering.");
        return [];
      }
    } catch (error) {
      console.error("Error fetching items:", error);
      return [];
    }
  };

  const search = async (event) => {
    if (event?.query?.length >= 3) {
      const item = await handleGetLoadOPD_All_ItemsLabAutoComplete({
        prefix: event?.query?.trim(),
      });
      setItems(item)
    }
  };


  const validateInvestigation = async (e, ind) => {
    debugger

    const { value } = e;
    let ItemID = value?.ItemID
if(value?.ScheduleType && value?.IsPRCreate === 1){
 
  notify("warn", "You cannot create a purchase request for this item.");
return
}


let listItem = [...bodyData]
if (!listItem[ind]?.ItemName) {
  listItem[ind]["ItemName"] = data
} else {
  listItem[ind] = { ItemName: data }
}
// if(value?.ScheduleType && value?.IsPRCreate === 1){

//   notify("warn", "You cannot create a purchase request for this item.");
// return
// }
setBodyData(listItem)








    let departmentLedgerID = localData?.deptLedgerNo


    const GetItemStockDetailsAPI = async (ItemID, departmentLedgerID) => {
      try {
        const StockDetails = await PurchaseGetItemStockDetails(ItemID, departmentLedgerID);

        if (StockDetails?.success) {
          const { MinLevel, MaxLevel, StockQuantity, POQuantity } = StockDetails.data;
          let data = bodyData?.find((val) => (val?.ItemName === ""))
          setBodyData((prevData) => {
            if (!data) {
              return [
                ...prevData.map((item) => ({
                  ...item,

                  stockDetails: item.stockDetails || {
                    MinLevel,
                    MaxLevel,
                    StockQuantity,
                    POQuantity,
                  },
                  // Quantity: ""
                })),
                {
                  Sno: prevData.length + 1,
                  ItemName: "",
                  Quantity: "",
                  CurStock: "",
                  Unit: "",
                  ConversionFactor:"0",
                },
              ];
            }
            return prevData;

          });
        }

      } catch (error) {
        console.error("Something went wrong:", error);
      }
    };
    GetItemStockDetailsAPI(ItemID, departmentLedgerID)
    // if (ind === bodyData.length - 1) { // If it's the last row
    //   setBodyData([...bodyData, { ...initialItem }]);  // Add a new empty row
    // }
  };

  const handleChildEdit = async (val, ind) => {

    setIsEdit(true)

    // let departmentLedgerNo = "LSHHI17";
    let requestNo = val?.PurchaseRequestNo
    try {

      const response = await OnEditPurchaseRequest(requestNo);
      if (response?.success) {
        const { details, items } = response.data;
        // setBodyData([...details, ...items]);
        const maxLength = Math.max(details.length, items.length);

        const mergedData = Array.from({ length: maxLength + 1 }).map((_, index) => ({
          ...(details[index] || {}), // If index exists in details, use it, else empty object
          ...(items[index] || {}),   // If index exists in items, use it, else empty object
        }));

        setPayload((preV) => ({
          ...preV,
          narration: mergedData[0].Narration,
          PurchaseRequestNo: requestNo,
          // requisitionOn:moment(mergedData[0]?.RequisitionDate).format("YYY-MMM-DD"),
          requisitionType: (() => {
            switch (mergedData[0]?.RequisitionType) {
              case "normal":
                return { label: t("Normal"), value: "normal" };
              case "Normal":
                return { label: t("Normal"), value: "normal" };
              case "urgent":
                return { label: t("Urgent"), value: "urgent" };
              case "immediate":
                return { label: t("Immediate"), value: "immediate" };
              case "amended":
                return { label: t("Amended"), value: "amended" };
              default:
                return "";
            }
          })(),

        }))

        setBodyData(mergedData);

      } else {
        notify(response?.message, "error");
      }
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };
  const handleCancle = () => {
    setIsEdit(false)
    setBodyData([initialItem])
  }

  return (
    <div className="mt-2 spatient_registration_card">
      <div className="patient_registration card">
        <Heading
          title={t("Auto Purchase Request Behalf Of Sales")}
          isBreadcrumb={false}
        />
        <div className="row p-2">
          <ReactSelect
            // requiredClassName={"required-fields"}
            placeholderName={t("Store Type")}
            searchable={true}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            id={"storeType"}
            name={"storeType"}
            removeIsClearable={true}
            handleChange={(name, e) => handleReactChange(name, e)}
            dynamicOptions={[
              { label: "Medical Store", value: "STO00001" },
              { label: "General Store", value: "STO00002" },
            ]}
            value={payload?.storeType?.value}

          />

          <ReactSelect
            placeholderName={t("Center To")}
            // requiredClassName={"required-fields"}
            searchable={true}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            id={"allCenter"}
            name={"allCenter"}
            removeIsClearable={true}
            handleChange={(name, e) => handleReactChange(name, e)}
            dynamicOptions={dropDownState?.GetBindAllCenter}
            value={payload?.allCenter?.value}
          />
          <ReactSelect
            placeholderName={t("Department To")}
            searchable={true}
            requiredClassName={"required-fields"}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            id={"departmentTo"}
            name={"departmentTo"}
            removeIsClearable={true}
            handleChange={(name, e) => handleReactChange(name, e)}
            dynamicOptions={dropDownState?.GetDepartMent}
            value={payload?.departmentTo?.value}
          />
          <ReactSelect
            placeholderName={t("Category")}
            searchable={true}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            id={"category"}
            name={"category"}
            removeIsClearable={true}
            handleChange={(name, e) => handleReactChange(name, e)}
            dynamicOptions={dropDownState?.GetItemsByCategory}
            value={payload?.category?.value || payload?.category?.categoryID}
          />

          <ReactSelect
            placeholderName={t("SubCategory")}
            searchable={true}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            id={"subCategory"}
            name={"subCategory"}
            removeIsClearable={true}
            handleChange={(name, e) => handleReactChange(name, e)}
            dynamicOptions={[
              { label: "All", value: "0", subCategoryID: "0" },
              ...(dropDownState?.GetItemsBySubCategory || [])
            ]}
            value={payload?.subCategory?.value}
          />


          <div className="col-xl-2 col-md-4 col-sm-6 col-12">
            <button
              className="btn btn-sm btn-primary mr-1"
              onClick={() => setIsFalse(!isFalse)}
            >
              {t("Auto Request")}
            </button>
            {
              !isFalse &&
              <button
                className="btn btn-sm btn-primary  "
                onClick={handleGetAutoPurchaseRequestItems}
              >
                {t("On ReOrder Level")}
              </button>

            }
          </div>


        </div>
        {
          isFalse &&
          (

            <div className="row p-2">



              <DatePicker
                className="custom-calendar"
                id="From Data"
                name="fromDate"
                lable={t("FromDate")}
                placeholder={VITE_DATE_FORMAT}
                respclass="col-xl-2 col-md-2 col-sm-6 col-12"
                value={
                  payload.fromDate
                    ? moment(payload.fromDate, "YYYY-MM-DD").toDate()
                    : null
                }
                maxDate={new Date()}
                handleChange={searchHandleChange}
              />
              <DatePicker
                className="custom-calendar"
                id="DOB"
                name="toDate"
                lable={t("To Date")}
                value={
                  payload.toDate
                    ? moment(payload.toDate, "YYYY-MM-DD").toDate()
                    : null
                }
                maxDate={new Date()}
                handleChange={searchHandleChange}
                placeholder={VITE_DATE_FORMAT}
                respclass="col-xl-2 col-md-2 col-sm-6 col-12"
              />
              <Input
                type="number"
                className="form-control "
                id="minDays"
                lable="Min Days"
                placeholder=" "
                required={true}
                value={payload?.minDays}
                respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                name="minDays"
                onChange={handleChange}
              />
              <Input
                type="number"
                className="form-control "
                id="requestFor"
                lable="Request For"
                placeholder=" "
                required={true}
                value={payload?.requestFor}
                respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                name="requestFor"
                onChange={handleChange}
              />
              <ReactSelect
                // requiredClassName={"required-fields"}
                placeholderName={t("ReOrder Option")}
                searchable={true}
                respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                id={"reOrderOption"}
                name={"reOrderOption"}
                removeIsClearable={true}
                handleChange={(name, e) => handleReactChange(name, e)}
                dynamicOptions={[
                  { label: "Include Store To Store Transfer", value: true },

                ]}
                value={payload?.reOrderOption?.value}

              />
              <button
                className="btn btn-sm btn-primary mx-1"
                onClick={handleGetAutoPurchaseRequestOnConsumption}
              // onClick={() => setIsFalse(!isFalse)}
              >
                {t("On Consumption")}

              </button>
              <button
                className="btn btn-sm btn-primary mx-1 mb-1"
                onClick={handleGetAutoPurchaseRequestItems}
              >
                {t("On ReOrder Level")}
              </button>

            </div>
          )
        }

      </div>
      <div className="patient_registration card">
        <div className="row p-2">
          <div className="col-12">

            <Tables
              thead={THEAD}
              tbody={bodyData?.map((val, ind) => ({
                Sno: ind + 1,
                Item: (
                  <div>

                    <AutoComplete
                      value={val?.ItemName?.ItemName ? val.ItemName?.ItemName : val?.ItemName}
                      suggestions={items}
                      completeMethod={search}
                      className="w-100 required-fields"
                      onSelect={(e) => validateInvestigation(e, ind)}  // Trigger row creation when an item is selected
                      id={`searchtest-${ind}`}  // Unique ID for each row
                      onChange={(e) => {
                        const data = typeof e.value === "object" ? e?.value : e.value;
                        let listItem = [...bodyData]
                        if (!listItem[ind]?.ItemName) {
                          listItem[ind]["ItemName"] = data
                        } else {
                          listItem[ind] = { ItemName: data }
                        }
                        // if(value?.ScheduleType && value?.IsPRCreate === 1){
 
                        //   notify("warn", "You cannot create a purchase request for this item.");
                        // return
                        // }
                        setBodyData(listItem)
                      }}
                      itemTemplate={itemTemplate}
                    />

                  </div>

                ),
                Quantity: (
                  <Input
                    type="number"
                    className="table-input required-fields"
                    // id="Qty"
                    name="Quantity"
                    placeholder="0"
                    removeFormGroupClass={true}
                    // display={"right"}
                    value={val?.Quantity}
                    // value={val?.Qty ? val?.Qty:"0"}
                    onChange={(e) => handleCustomInput(ind, "Quantity", e.target?.value)}
                  />

                ),
                CurStock: val?.CurrentStock ? val?.CurrentStock : "0",
                PurchaseUnit: val?.ItemName?.MajorUnit ? val?.ItemName?.MajorUnit : val?.PurchaseUnit
                ,
                ReOrderLevel: val?.ReorderLevel || "0",
                ReOrderQty: val?.ReorderQty || 0,
                NetQty: val?.NetQuantity,
                MinLevel: val?.MinLevel ? val?.MinLevel : "0",
                MaxLevel: val?.MaxLevel ? val?.MaxLevel : "0",
                PandingPC: "",
                CFactor: val?.ItemName?.ConversionFactor ? val?.ItemName?.ConversionFactor : val?.ConversionFactor,
                Remark: (
                  <Input
                    type="text"
                    //  className="form-control"
                    className="form-control "
                    removeFormGroupClass={true}
                    name="Remark"
                    placeholder=""
                    value={val.Remark}
                    onChange={(e) => handleCustomInput(ind, "Remark", e.target?.value)}
                  />
                ),
                // btn: "",
              }))}
            />

          </div>
        </div>
      </div>
      <div className="patient_registration card">
        <div className="row mt-2 p-2">

          <ReactSelect
            placeholderName={t("Requisition Type")}
            searchable={true}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            id={"requisitionType"}
            name={"requisitionType"}
            // requiredClassName={"required-fields"}
            removeIsClearable={true}
            handleChange={(name, e) => handleReactChange(name, e)}
            dynamicOptions={[
              { label: t("Normal"), value: "normal" },
              { label: t("Urgent"), value: "urgent" },
              { label: t("Immediate"), value: "immediate" },
              { label: t("Amended"), value: "amended" },
            ]}
            value={payload?.requisitionType?.value}
          />
          <DatePicker
            className="custom-calendar"
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            // placeholder=""
            lable={t("Requisition On")}
            // respclass={"col-xl-2 col-md-3 col-sm-4 col-12"}
            name="requisitionOn"
            id="requisitionOn"
            // name="requisitionOn"
            value={payload?.requisitionOn ? moment(payload?.requisitionOn).toDate() : ""}
            maxDate={new Date()}
            handleChange={handleChange}
            // lable={t("Requisition On")}
            placeholder={VITE_DATE_FORMAT}
          />

          <TextAreaInput
            type="text"
            id="narration"
            name="narration"
            rows={2}
            value={payload?.narration}
            onChange={handleChange}
            lable={t("Narration")}
            placeholder=" "
            respclass="col-xl-6 col-sm-6 col-md-4 col-12"
            className="form-control required-fields"

          />
          <div>
            {
              isEdit ? (
                <>

                  <button
                    className="btn btn-sm btn-primary mx-1 px-4"
                    onClick={handleUpDatePurchaseRequestAPI}
                  >
                    {t("UpDate")}
                  </button>
                  <button
                    className="btn btn-sm btn-primary mx-1 px-4"
                    // onClick={handleSavePurchaseRequestAPI}
                    onClick={handleCancle}
                  >
                    {t("Cancel")}
                  </button>
                </>
              ) : (
                <button
                  className="btn btn-sm btn-primary mx-1 px-4"
                  onClick={handleSavePurchaseRequest}
                >
                  {t("Save")}
                </button>

              )
            }

          </div>

        </div>
      </div>
      <GetPurchaseReq onEdit={handleChildEdit} storeType={payload?.storeType} loading={loading} />

    </div>
  );
};

export default CreatePurchaseRequest;

