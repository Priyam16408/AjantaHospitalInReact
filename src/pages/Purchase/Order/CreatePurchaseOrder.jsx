import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  getBase64,
  handleReactSelectDropDownOptions,
  notify,
} from "../../../utils/utils";
import {
  CreatePurchaseOrderGetCategorys,
  CreatePurchaseOrderSave,
  OnEditGetPurchaseOrderItemDetails,
  OnEditPurchaseRequest,
  OrderGetPurchaseItems,
  PurchaGetDepartMent,
  PurchaGetItemsByCategory,
  PurchaseBindGetManufacturers,
  PurchaseBindGetVendors,
  PurchaseGetTaxGroup,
  PurchaseOrderGetSubCategory,
} from "../../../networkServices/Purchase";
import DatePicker from "../../../components/formComponent/DatePicker";
import Input from "../../../components/formComponent/Input";
import Tables from "../../../components/UI/customTable";
import TextAreaInput from "../../../components/formComponent/TextAreaInput";
import { useLocalStorage } from "../../../utils/hooks/useLocalStorage";
import { AutoComplete } from "primereact/autocomplete";

import ReactSelect from "../../../components/formComponent/ReactSelect";
import Heading from "../../../components/UI/Heading";
import BrowseButton from "../../../components/formComponent/BrowseButton";
import SearchPoDetails from "./SearchPoDetails";
import CustomSelect from "../../../components/formComponent/CustomSelect";
import Modal from "../../../components/modalComponent/Modal";
import SupplierAdvance from "./SupplierAdvance";
import ViewPR from "./ViewPR";
import moment from "moment";
import { GST_TYPE_OPTION } from "../../../utils/constant";
import { GRNSameStateBuyierSupplier } from "../../../networkServices/InventoryApi";
import { handleDecimalKeyDown, validateDecimalInput } from "../../../utils/commonFunction";


const CreatePurchaseOrder = () => {
  const { VITE_DATE_FORMAT } = import.meta.env;
  const ip = useLocalStorage("ip", "get");
  const [t] = useTranslation();
  const [items, setItems] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [purchaseItem, setPurchaseItem] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);

  const [termsConditionsUpdateList, setTermsConditionsUpdateList] = useState([])
  const [poNumber, setPoNumber] = useState("")

  const [isPoByPr, setIsPoByPr] = useState(false)

  const localData = useLocalStorage("userData", "get");
  const initialItem = {
    ItemName: "",
    Qty: "",
    Quantity: "",
    CurStock: "",
    Unit: "",
    MainStore: "",
    Rate: "",
    MRP: "",
    Discount: "",
    GSTGroup: "",
    GSTType: {
      "label": "CGST&SGST",
      "value": "CGST&SGST"
    },
    Specification: "",
    GSTAmount: "",
    NetAmount: "",
    manufacturer: null,
    supplier: null,
    Free: { label: "No", value: "No" },
    RateAD: { label: "RateAD", value: "RateAD" },
    requisitionType: {},
    TermsCondition: "",
    isSplit: true,
  };

  const [bodyData, setBodyData] = useState([initialItem]);
  const [backupValues, setBackUpValues] = useState([initialItem]);

  console.log(bodyData, "bodyData");

  const [Image, setImage] = useState();
  const [modalData, setModalData] = useState({ visible: false });
  const [netAmount, setNetAmount] = useState(0);
  const [handleModelData, setHandleModelData] = useState({});
  const [isFlag, setIsFlag] = useState(true);
  const [isNormalPo, setIsNormalPo] = useState(false)
  const [payload, setPayload] = useState({
    storeType: { label: "Medical Store", value: "STO00001" }, // Default value
    requisitionType: { label: "Normal", value: "normal" },
    poType: { label: "PO By Item", value: "1" },
    poTypeService: { label: "No Service", value: "0" },
    category: {
      name: "MEDICAL STORE ITEMS",
      categoryID: "5",
      configID: "11",
      label: "MEDICAL STORE ITEMS",
      value: "5",
    },
    subCategory: { label: "All", value: "0", subCategoryID: "0" },
    supplier: {},
    validDate: moment().format("YYYY-MM-DD"),
    poDate: moment().format("YYYY-MM-DD"),
    deliveryDate: moment().format("YYYY-MM-DD"),
    netAmount: "",
    roundOff: "",
    remarks: "",
    subject: "",
  });

  const [dropDownState, setDropDownState] = useState({
    BindGetVendorsAPI: [],
    GetDepartMent: [],
    GetPoType: [],
    GetItemsByCategory: [],
    getItemsBySubCategory: [],
    StockDetails: [],
    GetItems: [],
    BindManufacturers: [],
    GetTaxGroup: [],
    Free: [],
  });

  const PurchaseItems = async () => {
    let payloadData = {
      vendorID: payload.poType.value === "2" ? payload?.supplier.VendorID : "" || 0,
      categoryID: payload?.category.value,
      purchaseOrderType: payload?.poTypeService.value,
    };
    try {
      const response = await OrderGetPurchaseItems(payloadData);
      setPurchaseItem(response?.data);
      // console.log("data",data)
      // if (!data?.data || !Array.isArray(data.data)) {
      //   return [];
      // }

      // if (prefix?.prefix && typeof prefix?.prefix === "string") {
      //   const filterData = data.data.filter((item) =>
      //     item.ItemName?.toLowerCase().startsWith(prefix?.prefix?.toLowerCase())
      //   );
      //   console.log("filterData",filterData)
      //   return filterData;
      // } else {
      //   console.log("Prefix is empty or invalid, returning all data.");
      //   return data.data;
      // }
    } catch (error) {
      console.error("Error fetching items:", error);
      return [];
    }
  };

  // const handleReactChange = (name, e, key) => {
  //   setPayload((val) => ({ ...val, [name]: e }));

  //   if (name === "storeType") {

  //     if (e.value === 'STO00002') {
  //       // setPayload((preV)=>({
  //       //   ...preV,
  //       //   category:{
  //       //      name: 'GENERAL STORE ITEMS', categoryID: '8', configID: '28',
  //       //      label: 'GENERAL STORE ITEMS', value: '8' },
  //       // }))
  //       getItemsBySubCategory("5")
  //     }
  //     else if (e.value === 'STO00001') {
  //       setPayload((preV) => ({
  //         ...preV,
  //         category: {
  //           "name": "MEDICAL STORE ITEMS",
  //           "categoryID": "5",
  //           "configID": "11",
  //           "label": "MEDICAL STORE ITEMS",
  //           "value": "5"
  //         }
  //       }))
  //       getItemsBySubCategory("8")
  //     }
  //     getItemsByCategory()
  //   } else if (name === "allCenter") {
  //     renderPurchaGetDepartMentAPI();
  //   } else if (name === "category") {

  //     getItemsBySubCategory(e.value);
  //   }
  //   else if (name === "poType") {
  //     if (e.value === "4") {

  //       setIsFlag(false)
  //     }
  //     else {
  //       setIsFlag(true)
  //     }
  //   }

  // };

  const handleReactChange = (name, e, key) => {
    console.log("name", name, e);
    setPayload((val) => ({ ...val, [name]: e }));
    if (name === "category") {
      // getItemsBySubCategory(e.value);
    } else if (name === "storeType") {
      getItemsByCategory(e?.value);
    }
  };

  useEffect(() => {
    if (payload?.poType) {
      PurchaseItems();
    }
  }, [payload?.poType]);
  // useEffect(() => {
  //   PurchaseItems();
  // }, [])
  const getItemsByCategory = async (storeID) => {
    try {
      const GetItemsByCategory = await PurchaGetItemsByCategory(storeID);
      // const GetItemsByCategory = await CreatePurchaseOrderGetCategorys(storeID);
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
        category: GetItemsByCategory?.data[0],
      }));
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };

  const getItemsBySubCategory = async (categoryID) => {
    try {
      const getItemsBySubCategory =
        await PurchaseOrderGetSubCategory(categoryID);
      setDropDownState((val) => ({
        ...val,
        getItemsBySubCategory: handleReactSelectDropDownOptions(
          getItemsBySubCategory?.data,
          "name",
          "subCategoryID"
        ),
      }));
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };

  useEffect(() => {
    getItemsBySubCategory(payload?.category?.categoryID);
  }, [payload?.storeType, payload?.category]);

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

  const itemTemplate = (item) => {
    return (
      <div className="p-clearfix">
        <div style={{ float: "left", fontSize: "12px", width: "100%" }}>
          {item?.ItemName}
        </div>
      </div>
    );
  };

  const search = async (event) => {
    if (event?.query?.length >= 3) {
      if (!purchaseItem || !Array.isArray(purchaseItem)) {
        return [];
      }

      if (event?.query && typeof event?.query === "string") {
        const filterData = purchaseItem.filter((item) =>
          item.ItemName?.toLowerCase().startsWith(event?.query?.toLowerCase())
        );

        if (filterData?.length == 0) {
          notify("No Data Found", "warn");
          return;
        }
        setItems(filterData);
        return filterData;
      } else {
        setItems(purchaseItem);
        return purchaseItem;
      }
    }
  };

  // useEffect(() => {
  //   getItemsBySubCategory("5")
  //   setPayload((preV) => ({
  //     ...preV,
  //     category: {
  //       "name": "MEDICAL STORE ITEMS",
  //       "categoryID": "5",
  //       "configID": "11",
  //       "label": "MEDICAL STORE ITEMS",
  //       "value": "5"
  //     }
  //   }))
  // }, [])
  // },[payload?.category])
  const handleMissingValues = () => {
    const refinedData = bodyData.slice(0, bodyData.length - 1)
    console.log(refinedData, "refinedData")
    let error = {}
    if (isNormalPo) {
      refinedData.map((val, index) => {
        console.log("vv", val)
        debugger
        if (!val?.ItemID) {
          error[`ItemName${index}`] = `Please Select Valid Item In Row ${index + 1}`
        } else if (!val?.supplier?.value || val?.supplier?.value === "0" || val?.supplier?.value?.length < 1) {
          error[`supplier${index}`] = `Please select supplier In Row ${index + 1}`
        } else if (!val?.Quantity) {
          error[`Quantity${index}`] = `Please Enter Quantity  In Row ${index + 1}`
        } else if (!val?.Rate) {
          error[`Rate${index}`] = `Please Enter Rate In Row ${index + 1}`
        } else if (!val?.MRP) {
          error[`MRP${index}`] = `Please Enter MRP In Row ${index + 1}`
        }


      })
    } else {
      refinedData.map((val, index) => {
        console.log("vv", val)
        debugger
        if (!val?.ItemName?.ItemID) {
          error[`ItemName${index}`] = `Please Select Valid Item In Row ${index + 1}`
        } else if (!val?.supplier?.value) {
          error[`supplier${index}`] = `Please select supplier In Row ${index + 1}`
        } else if (!val?.Quantity) {
          error[`Quantity${index}`] = `Please Enter Quantity  In Row ${index + 1}`
        } else if (!val?.Rate) {
          error[`Rate${index}`] = `Please Enter Rate In Row ${index + 1}`
        } else if (!val?.MRP) {
          error[`MRP${index}`] = `Please Enter MRP In Row ${index + 1}`
        }
      })
    }

    return error
  }

  const handleSavePurchase = async () => {
    debugger
    const filteredBodyData = bodyData.slice(0, bodyData.length - 1);
    console.log(filteredBodyData, "filteredBodyData")
    let errors = handleMissingValues()
    if (Object.keys(errors).length > 0) {
      notify(Object.values(errors)[0], "error")
      return 0
    }

    const payloaded = filteredBodyData.map((item) => {

      return {
        ItemName: item?.ItemName?.ItemName || item?.ItemName,
        ManufactureID: item?.ItemName?.ManufactureID || item?.ManufactureID,
        Manufacturer: item?.manufacturer?.label || item?.Manufacturer,
        // HSNCode: item?.ItemName?.HSNCode || "",
        ItemID: item?.ItemName?.ItemID || item?.ItemID,
        // MajorUnit: item?.ItemName?.MajorUnit || "",
        // Stock: item?.ItemName?.Stock || 0,
        // GSTGroup: item?.GSTGroup?.value || "0",
        GSTGroup: item?.GSTGroup?.value || item?.ItemName?.GSTGroup,
        // Pack: item?.ItemName?.Pack || 1,
        Qty: item?.Qty || item?.ItemName?.Quantity || item?.Quantity,
        Rate: item?.Rate || "0",
        Discount: item?.Discount || "0",
        MRP: item?.MRP || "0",
        // NetAmount: item?.NetAmount || "0",
        GSTAmount: item?.GSTAmount || "0",
        manufacturerID: item?.manufacturer?.value || null,
        supplierID: item?.supplier?.VendorID,
        // GSTGroup: item.GSTGroup,
        supplier: item.supplier,
        specification: item.Specification,
      };
    });
    const isEmptyQty = payloaded.some(
      (item) =>
        item?.supplierID === "0" || item?.Qty == null || item?.Qty === undefined
    );

    // const isEmptyQty = payloaded.some((item) => item?.Qty === "0" || undefined || null);
    const isEmptyRate = payloaded.some(
      (item) => item?.Rate === "0" || undefined
    );
    const isEmptyMRP = payloaded.some((item) => item?.MRP === "0" || undefined);
    console.log("filteredBodyData", filteredBodyData)
    // const isEmptysupplierID =   filteredBodyData?.find((item)=> !item?.supplier?.VendorID && !item?.supplierID )
    const isEmptysupplierID = filteredBodyData.some(
      (item) =>
        (item?.supplier?.VendorID || item?.supplierID)
    );

    //  item?.supplier?.VendorID === "" &&
    //  ( item?.supplierID === "" ||
    //   item?.supplierID === undefined ||
    //   item?.supplierID == null)
    debugger
    // const isEmptysupplierID = payloaded.some((item) => item?.supplierID === "0" || undefined || null);
    const GSTGroup = payloaded.some(
      (item) => {
        debugger
        !item?.GSTGroup || Object.keys(item.GSTGroup).length === 0
      }
    );
    // const Supplier = payloaded.some((item) => !item?.supplier || Object.keys(item.supplier).length === 0);
    // console.log("item",item?.supplierID)

    if (filteredBodyData >= 0) {
      notify("Please Select Items ", "error");

      return;
    }

    const isMRPGreaterThanRate = payloaded.some(
      (item) => parseFloat(item.MRP) < parseFloat(item.Rate)
    );
    const subjectdata = payload?.subject?.length > 1000;
    const remakrsData = payload?.remarks?.length > 1000;
    if (isMRPGreaterThanRate) {
      notify("MRP should be greater than Rate", "error");
      return;
    }

    if (!isEmptysupplierID) {
      notify("Please Select Supplier ", "error");
      return;
    }

    if (isEmptyQty) {
      notify("Invalid Quantity ", "error");
      return;
    }
    if (isEmptyRate) {
      notify("Invalid Rate ", "error");
      return;
    }
    if (isEmptyMRP) {
      notify("Invalid MRP ", "error");
      return;
    }

    if (isEmptyMRP > isEmptyRate) {
      notify("Invalid MRP ", "error");
      return;
    }

    if (GSTGroup) {
      notify("Invalid GSTGroup", "error");
      return;
    }

    if (subjectdata) {
      notify("Subject should not exceed 1000 characters.", "warn");
      return;
    }
    if (remakrsData) {
      notify("Remark should not exceed 1000 characters.", "warn");
      return;
    }
    if (payload.remarks === "") {
      notify(" Please Enter Remark", "error");
      return;
    }

    setModalData({
      visible: true,
      width: "80vw",
      Heading: "60vh",
      label: "Supplier Advance",
      footer: <></>,
      Component: (
        <SupplierAdvance
          bodyData={filteredBodyData}
          payload={payload}
          setPayload={setPayload}
          Image={Image}
          handleClose={handleClose}
          setBodyData={setBodyData}
          initialItem={initialItem}
          setDataLoading={setDataLoading}
          termsConditionsUpdateList={termsConditionsUpdateList}
          isEdit={isEdit}
          setIsPoByPr={setIsPoByPr}
          supplierList={dropDownState?.BindGetVendorsAPI}
        />
      ),
    });
  };
  console.log(dropDownState?.BindGetVendorsAPI, "dropDownState?.BindGetVendorsAPI")
  const handleUpDatePurchaseRequestAPI = async () => {
    debugger
    const PurchaseOrderNo = bodyData[0].PurchaseOrderNo;
    // const PurchaseRequestNo = bodyData[0].PurchaseRequestNo
    // const PurchaseRequestNo = bodyData[bodyData.length - 1].PurchaseRequestNo
    // const filteredBodyData = bodyData;
    const filteredBodyData = bodyData.slice(0, bodyData.length - 1);
    const Quantity = filteredBodyData.some((item) => item.Quantity == "");
    const remarks = filteredBodyData.some((item) => item.remarks == "");
    let department = payload?.departmentTo?.value;
    let item = bodyData;


    // if (!department) {
    //   notify("select department ", "error");
    //   return
    // }
    if (!payload.remarks) {
      notify("Remarks is Required", "error");
      return;
    }
    if (item.length < 1) {
      notify("Please Select Item First.", "error");
      return;
    }
    if (!payload.requisitionType) {
      notify("Please Select requisitionType.", "error");
      return;
    }
    if (Quantity) {
      notify("Invalid Quantity ", "error");
      return;
    }
    console.log("bodyData", bodyData)
    console.log("payload", payload)
    try {

      // const payloadData =

      // {
      //   data: filteredBodyData.map((item) => ({
      //     id: "",
      //     pUnit: String(item?.pUnit ?? ''),
      //     stock: item?.Stock || 0,
      //     itemName: String(item?.ItemName?.ItemName || item?.ItemName),
      //     itemID: String(item?.ItemName?.ItemID || item?.ItemID),
      //     deal: "",
      //     rate: Number(item?.Rate || 0),
      //     discount: Number(item?.Discount || 0),
      //     // gstGroup: String(item?.GSTGroup?.value || item?.TaxGroupLabel),
      //     gstGroup: String(item?.GSTGroup?.value || item?.GSTGroup),
      //     gstType: String(item?.GSTGroup?.value || item?.GSTGroup),
      //     // gstGroup: String(item?.GSTGroup?.TaxGroup || item?.GSTType),
      //     mrp: Number(item?.MRP || 0),
      //     quantity: Number(item?.Quantity || 0),
      //     taxOn: String(item?.RateAD?.value || item?.TaxOn),
      //     igstPercent: Number(item?.GSTGroup?.IGSTPer || item.IGSTPercent) ?? 0,
      //     igstAmt: Number(item?.IGSTAmt ?? 0),
      //     cgstPercent: Number(item?.GSTGroup?.CGSTPer || item?.CGSTPercent) ?? 0,
      //     cgstAmt: Number(item?.CGSTAmt) || 0,
      //     sgstPercent: Number(item?.GSTGroup?.SGSTPer || item?.SGSTPercent) ?? 0,
      //     sgstAmt: Number(item?.SGSTAmt) || 0,
      //     taxAmt: Number(item?.GSTAmount) || 0,
      //     // taxAmt: Number(item?.TaxAmt) || 0,
      //     supplier: String(item?.supplier?.LedgerName || item?.Supplier),
      //     // supplierID: String(item?.supplier?.value || item?.supplierID) || "",
      //     supplierID: String(
      //       item?.supplier?.ID ||
      //       item?.supplier?.value ||
      //       item?.supplierID ||
      //       ""
      //     ),
      //     netAmount: Number(item?.NetAmount || 0),
      //     // itemID:  Number(item?.ItemID || 0),
      //     free: String(item?.Free?.value || "No"),
      //     hsnCode: String(item?.HSNCode || ""),
      //     // purchaseRequestsNo:PurchaseRequestNo,
      //     purchaseRequestsNo: String(item?.PurchaseRequestsNo || ""),
      //     centreID: String(localData?.centreID),
      //     manuFacturer: String(item?.manufacturer?.Name || item?.Manufacturer || ""),
      //     manufactureID: Number(item?.manufacturer?.ManufactureID || item?.ManufactureID || 0),
      //     subCategoryID: Number(item?.SubCategoryID || ""),
      //     vat: Number(item?.GSTGroup?.TotalGST ?? item?.VAT ?? 0),
      //     currency: String(item?.Currency ?? ""),
      //     currencyFactor: Number(item?.CurrencyFactor ?? 0),
      //     currencyCountryID: Number(item?.CurrencyCountryID ?? 0),
      //     minimum_Tolerance_Qty: 0,
      //     maximum_Tolerance_Qty: 0,
      //     minimum_Tolerance_Rate: 0,
      //     maximum_Tolerance_Rate: 0,
      //     // gstType: String(item?.GSTType) || "",
      //   })),
      //   supplierAdvanceDetails: bodyData.map((value) => ({
      //     supplierID: value?.supplier?.ID || "",
      //     advanceAmount: 0,
      //     paymentModeID: 0,
      //   })),
      //   // supplierAdvanceDetails: bodyData.map((item)=>({
      //   //     supplierID: String(item?.supplier?.ID || item.supplier),
      //   //     advanceAmount: Number(item?.advanceAmt)? Number(item?.advanceAmt):"0",
      //   //     paymentModeID: Number(item?.PaymentMode?.value || ""),
      //   // })),

      //   supplierAdvanceTermsDetails: filteredBodyData.map((value) => ({
      //     poNumber: value?.PurchaseOrderNo || 0,
      //     detailsID: 0,
      //     details: "",
      //     supplierID: String(
      //       item?.supplier?.ID ||
      //       item?.supplier?.value ||
      //       item?.supplierID ||
      //       ""
      //     )
      //   })),
      //   // supplierAdvanceTermsDetails:[],

      //   poAmount: 0,
      //   roundOff: 0,
      //   freightCharges: 0,
      //   poDate: moment(payload?.poDate).format("YYYY-MMM-DD"),
      //   validDate: moment(payload?.validDate).format("YYYY-MMM-DD"),
      //   deliveryDate: moment(payload?.deliveryDate).format("YYYY-MMM-DD"),
      //   poType: String(payload?.poType?.value),
      //   remarks: String(payload?.remarks),
      //   subject: String(payload?.subject),
      //   storeType: String(payload?.storeType?.value),
      //   purchaseOrderNumber: PurchaseOrderNo,
      //   // purchaseOrderNumber: payload?.purchaseOrderNumber || "",
      //   isConsolidated: false,
      //   draftID: "",
      //   otherCharges: 0,
      //   isService: 0,
      //   documentBase64: Image?.Document_Base64 || ""
      // };

      console.log("filteredBodyDatafilteredBodyData", filteredBodyData[1]?.ItemName?.SubCategoryID)

      setModalData({
        visible: true,
        width: "80vw",
        Heading: "60vh",
        label: "Supplier Advance",
        footer: <></>,
        Component: (
          <SupplierAdvance
            bodyData={filteredBodyData}
            payload={payload}
            setPayload={setPayload}
            Image={Image}
            handleClose={handleClose}
            setBodyData={setBodyData}
            initialItem={initialItem}
            setDataLoading={setDataLoading}
            termsConditionsUpdateList={termsConditionsUpdateList}
            isEdit={isEdit}
            setIsEdit={setIsEdit}
            PurchaseOrderNo={poNumber}
            setIsPoByPr={setIsPoByPr}
            supplierList={dropDownState?.BindGetVendorsAPI}
          />
        ),
      });


      // let updatedData = filteredBodyData.map((val) => {

      //   return {
      //     id: "",
      //     pUnit: String(val?.pUnit ?? ''),
      //     stock: val?.Stock || 0,
      //     itemName: String(val?.ItemName?.ItemName || val?.ItemName),
      //     itemID: String(val?.ItemName?.ItemID || val?.ItemID),
      //     deal: "",
      //     rate: Number(val?.Rate || 0),
      //     discount: Number(val?.Discount || 0),
      //     gstGroup: String(val?.GSTGroup?.value || val?.GSTGroup),
      //     gstType: val.isSplit ? "CGST&SGST" : "IGST",
      //     mrp: Number(val?.MRP || 0),
      //     quantity: Number(val?.Quantity || 0),
      //     taxOn: String(val?.RateAD?.value || val?.TaxOn),
      //     igstPercent: Number(val?.GSTGroup?.IGSTPer || val?.IGSTPercent || 0),
      //     igstAmt: Number(val?.IGSTAmt ?? 0),
      //     cgstPercent: Number(val?.GSTGroup?.CGSTPer || val?.CGSTPercent || 0),
      //     cgstAmt: Number(val?.CGSTAmt ?? 0),
      //     sgstPercent: Number(val?.GSTGroup?.SGSTPer || val?.SGSTPercent || 0),
      //     sgstAmt: Number(val?.SGSTAmt ?? 0),
      //     taxAmt: Number(val?.GSTAmount || 0),
      //     specification: String(val?.Specification || 0),
      //     supplier: String(val?.supplier?.LedgerName || val?.Supplier || ""),
      //     subCategoryID: val?.ItemName?.SubCategoryID ? String(val?.ItemName?.SubCategoryID) : val?.SubCategoryID ? String(val?.SubCategoryID) : "",
      //     supplierID: String(
      //       val?.supplier?.VendorID ||
      //       val?.supplier?.value ||
      //       val?.supplierID ||
      //       ""
      //     ),
      //     netAmount: Number(val?.NetAmount || 0),
      //     free: String(val?.Free?.value || val?.Free || "No"),
      //     hsnCode: String(val?.HSNCode || ""),
      //     purchaseRequestsNo: String(val?.PurchaseRequestsNo || ""),
      //     centreID: String(localData?.centreID),
      //     manuFacturer: String(val?.manufacturer?.Name || val?.Manufacturer || ""),
      //     manufactureID: Number(val?.manufacturer?.ManufactureID || val?.ManufactureID || 0),
      //     vat: Number(val?.GSTGroup?.TotalGST ?? val?.VAT ?? 0),
      //     currency: String(val?.Currency ?? ""),
      //     currencyFactor: Number(val?.CurrencyFactor ?? 0),
      //     currencyCountryID: Number(val?.CurrencyCountryID ?? 0),
      //     minimum_Tolerance_Qty: 0,
      //     maximum_Tolerance_Qty: 0,
      //     minimum_Tolerance_Rate: 0,
      //     maximum_Tolerance_Rate: 0,
      //   }
      // })

      // const payloadData = {
      //   data: updatedData,

      //   supplierAdvanceDetails: bodyData.map((item) => ({
      //     supplierID: String(
      //       item?.supplier?.VendorID ||
      //       item?.supplier?.value ||
      //       item?.supplierID ||
      //       ""
      //     ),
      //     // supplierID: value?.supplier?.ID || "",
      //     advanceAmount: 0,
      //     paymentModeID: 0,
      //   })),

      //   supplierAdvanceTermsDetails: bodyData.map((item) => ({
      //     poNumber: item?.PurchaseOrderNo || 0,
      //     detailsID: 0,
      //     details: "",
      //     supplierID: String(
      //       item?.supplier?.VendorID ||
      //       item?.supplier?.value ||
      //       item?.supplierID ||
      //       ""
      //     ),
      //   })),

      //   poAmount: 0,
      //   roundOff: 0,
      //   freightCharges: 0,
      //   poDate: moment(payload?.poDate).format("YYYY-MMM-DD"),
      //   validDate: moment(payload?.validDate).format("YYYY-MMM-DD"),
      //   deliveryDate: moment(payload?.deliveryDate).format("YYYY-MMM-DD"),
      //   poType: String(payload?.poType?.value),
      //   remarks: String(payload?.remarks),
      //   subject: String(payload?.subject),
      //   storeType: String(payload?.storeType?.value),
      //   purchaseOrderNumber: PurchaseOrderNo,
      //   isConsolidated: false,
      //   draftID: "",
      //   otherCharges: 0,
      //   isService: 0,
      //   documentBase64: Image?.Document_Base64 || "",
      // };
      // const response = await CreatePurchaseOrderSave(payloadData);
      // if (response?.success) {
      //   console.log("Updated successfully!");
      //   notify("Updated successfully!", "success");
      //   setIsEdit(false);
      //   setBodyData([initialItem]);
      //   setPayload({
      //     storeType: { label: "Medical Store", value: "STO00001" }, // Default value
      //     requisitionType: { label: "Normal", value: "normal" },
      //     poType: { label: "PO By Item", value: "1" },
      //     poTypeService: { label: "No Service", value: "0" },
      //     category: {
      //       name: "MEDICAL STORE ITEMS",
      //       categoryID: "5",
      //       configID: "11",
      //       label: "MEDICAL STORE ITEMS",
      //       value: "5",
      //     },
      //     subCategory: { label: "All", value: "0", subCategoryID: "0" },
      //     supplier: {},
      //     validDate: moment().format("YYYY-MM-DD"),
      //     poDate: moment().format("YYYY-MM-DD"),
      //     deliveryDate: moment().format("YYYY-MM-DD"),
      //     netAmount: "",
      //     roundOff: "",
      //     remarks: "",
      //     subject: "",
      //   });
      //   setDataLoading(!dataLoading);
      //   setPayload((preV) => ({
      //     ...preV,
      //     remarks: "",
      //     subject: "",
      //     // subCategory:""
      //   }));
      // } else {
      //  console.log("something went wrong")
      // }
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };



  const renderGetVendorsAPI = async () => {
    try {
      const response = await PurchaseBindGetVendors();

      if (response?.success) {
        setDropDownState((val) => ({
          ...val,
          BindGetVendorsAPI: handleReactSelectDropDownOptions(
            response?.data,
            "LedgerName",
            "VendorID"

          ),
        }));
        if (response?.data.length > 0) {
          setPayload((prevPayload) => ({
            ...prevPayload,
            supplier: { ...response?.data[0], value: response?.data[0]?.VendorID },
          }));
        }
      }
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };
  useEffect(() => {
    renderGetVendorsAPI();
  }, []);

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setPayload({ ...payload, [name]: value });
  // };
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (value.length <= 1000) {
      setPayload({ ...payload, [name]: value });
    } else {
      notify("Value cannot exceed 1000 characters", "warn");
    }
  };


  const handleGRNSameStateBuyierSupplier = async (VendorID) => {
    try {
      const response = await GRNSameStateBuyierSupplier(VendorID);
      if (response.success) {
        return response;
      } else {
        return false;
      }
    } catch (error) {
      return false;
      console.error("Something went wrong", error);
    }
  };
  //   const StateBuyierSupplier=()=>{
  //     const update=bodyData?.map((preV)=>({
  // ...preV,

  //     }))
  //   }

  // const handleCustomInput = async (ind, name, value) => {
  //   console.log("first ind", ind)
  //   console.log("first name", name)
  //   console.log("first value", value)
  //   debugger
  //   // if (name === "supplier") {
  //   const updatedBodyData = [...bodyData];
  //   // updatedBodyData[ind]["isSplit"] = true

  //   if (name === "Specification" && value?.length > 1000) {
  //     notify("Specification cannot exceed 1000 characters", "warn");
  //     return;
  //   }
  //   if (name === "supplier") {
  //     // updatedBodyData[ind]["isSplit"] = await handleGRNSameStateBuyierSupplier(
  //     //   value?.VendorID || updatedBodyData[ind]?.VendorID
  //     // );
  //     const vendorID = value?.VendorID || updatedBodyData[ind]?.VendorID;

  //     if (vendorID) {
  //       const response = await handleGRNSameStateBuyierSupplier(vendorID);
  //       if (updatedBodyData[ind]["GSTType"]) {
  //         updatedBodyData[ind]["GSTType"] = response?.data?.[0]?.GSTType;
  //       }
  //     }

  //     // updatedBodyData[ind]["isSplit"] = await handleGRNSameStateBuyierSupplier(value?.VendorID)
  //     updatedBodyData[ind][name] = value;

  //     updatedBodyData[ind]["IGSTPercent"] = updatedBodyData[ind]["GSTType"]?.value === "CGST&UTGST"
  //       || updatedBodyData[ind]["GSTType"]?.value === "CGST&SGST"
  //       ? "0"
  //       : Number(updatedBodyData[ind]["GSTGroup"]) ||
  //       Number(updatedBodyData[ind]["GSTGroup"]?.value);

  //     updatedBodyData[ind]["CGSTPercent"] = updatedBodyData[ind]["GSTType"]?.value === "CGST&UTGST"
  //       || updatedBodyData[ind]["GSTType"]?.value === "CGST&SGST"
  //       ? Number(updatedBodyData[ind]["GSTGroup"]) / 2 ||
  //       Number(updatedBodyData[ind]["GSTGroup"]?.value) / 2
  //       : "0";

  //     updatedBodyData[ind]["SGSTPercent"] = updatedBodyData[ind]["GSTType"]?.value === "CGST&UTGST"
  //       || updatedBodyData[ind]["GSTType"]?.value === "CGST&SGST"
  //       ? Number(updatedBodyData[ind]["GSTGroup"]) / 2 ||
  //       Number(updatedBodyData[ind]["GSTGroup"]?.value) / 2
  //       : "0";

  //     const Qty = parseFloat(
  //       updatedBodyData[ind]?.Qty || updatedBodyData[ind]?.Quantity || 0
  //     );
  //     const Rate = parseFloat(updatedBodyData[ind]?.Rate || 0);
  //     const TotalGST = parseFloat(
  //       Number(updatedBodyData[ind]["GSTGroup"]) ||
  //       Number(updatedBodyData[ind]["GSTGroup"]?.value) ||
  //       Number(updatedBodyData[ind]["ItemName"]["GSTGroup"])
  //     );
  //     // const TotalGST = parseFloat(updatedBodyData[ind]?.GSTType?.value || 0);
  //     const discAmt =
  //       ((Rate * Qty) / 100) * parseFloat(updatedBodyData[ind]?.Discount || 0);
  //     if ((Qty > 0 && Rate > 0) || TotalGST > 0) {
  //       // updatedBodyData[ind]["GSTAmount"] = ((Qty * Rate) * TotalGST || 1) / 100;
  //       updatedBodyData[ind]["GSTAmount"] =
  //         ((Qty * Rate - discAmt) * (TotalGST || 0)) / 100;
  //       updatedBodyData[ind]["NetAmount"] =
  //         Qty * Rate -
  //         discAmt +
  //         ((Qty * Rate - discAmt) * (TotalGST || 0)) / 100;
  //       // updatedBodyData[ind]["NetAmount"] = ((Qty * Rate) + ((Qty * Rate) * TotalGST || 1) / 100)+updatedBodyData[ind]["GSTAmount"];
  //       // updatedBodyData[ind]["NetAmount"] = ((Qty * Rate) + ((Qty * Rate) * TotalGST || 1) / 100) - discAmt;
  //       console.log(
  //         "updatedBodyData[ind]NetAmount",
  //         updatedBodyData[ind]["NetAmount"]
  //       );
  //       // if (Qty > 0 && Rate > 0 || TotalGST > 0) {
  //       //   updatedBodyData[ind]["GSTAmount"] = ((Qty * Rate) * TotalGST || 1) / 100;
  //       //   updatedBodyData[ind]["NetAmount"] = ((Qty * Rate) + ((Qty * Rate) * TotalGST || 1) / 100) - discAmt;
  //       //   console.log("updatedBodyData[ind]NetAmount", updatedBodyData[ind]["NetAmount"])
  //     } else {
  //       updatedBodyData[ind]["GSTAmount"] = 0;
  //       updatedBodyData[ind]["NetAmount"] = 0;
  //     }
  //     setBodyData(updatedBodyData);
  //   } else if (name === "GSTGroup") {
  //     const updatedBodyData = [...bodyData];
  //     // updatedBodyData[ind]["isSplit"] = await handleGRNSameStateBuyierSupplier(
  //     //   updatedBodyData[ind]?.supplier?.VendorID
  //     // );


  //     // const vendorID = value?.VendorID || updatedBodyData[ind]?.supplier?.VendorID;

  //     // if (vendorID) {
  //     //   const response = await handleGRNSameStateBuyierSupplier(vendorID);
  //     //   if (updatedBodyData[ind]["GSTType"]) {
  //     //     updatedBodyData[ind]["GSTType"] = response?.data?.[0]?.GSTType;
  //     //   }
  //     // }


  //     // updatedBodyData[ind]["isSplit"] = await handleGRNSameStateBuyierSupplier(value?.VendorID)
  //     updatedBodyData[ind][name] = value;

  //     updatedBodyData[ind]["IGSTPercent"] = updatedBodyData[ind]["GSTType"]?.value === "CGST&UTGST"
  //       || updatedBodyData[ind]["GSTType"]?.value === "CGST&SGST"
  //       || updatedBodyData[ind]["GSTType"] === "CGST&UTGST"
  //       || updatedBodyData[ind]["GSTType"] === "CGST&SGST"
  //       ? "0"
  //       : Number(updatedBodyData[ind]["GSTGroup"]) ||
  //       Number(updatedBodyData[ind]["GSTGroup"]?.value);

  //     updatedBodyData[ind]["CGSTPercent"] = updatedBodyData[ind]["GSTType"]?.value === "CGST&UTGST"
  //       || updatedBodyData[ind]["GSTType"]?.value === "CGST&SGST"
  //       || updatedBodyData[ind]["GSTType"] === "CGST&UTGST"
  //       || updatedBodyData[ind]["GSTType"] === "CGST&SGST"
  //       ? Number(updatedBodyData[ind]["GSTGroup"]) / 2 ||
  //       Number(updatedBodyData[ind]["GSTGroup"]?.value) / 2
  //       : "0";
  //     updatedBodyData[ind]["SGSTPercent"] = updatedBodyData[ind]["GSTType"]?.value === "CGST&UTGST"
  //       || updatedBodyData[ind]["GSTType"]?.value === "CGST&SGST"
  //       updatedBodyData[ind]["GSTType"] === "CGST&UTGST"
  //       || updatedBodyData[ind]["GSTType"] === "CGST&SGST"
  //       ? Number(updatedBodyData[ind]["GSTGroup"]) / 2 ||
  //       Number(updatedBodyData[ind]["GSTGroup"]?.value) / 2
  //       : "0";

  //     const Qty = parseFloat(
  //       updatedBodyData[ind]?.Qty || updatedBodyData[ind]?.Quantity || 0
  //     );
  //     const Rate = parseFloat(updatedBodyData[ind]?.Rate || 0);
  //     const TotalGST = parseFloat(
  //       Number(updatedBodyData[ind]["GSTGroup"]) ||
  //       Number(updatedBodyData[ind]["GSTGroup"]?.value) ||
  //       Number(updatedBodyData[ind]["ItemName"]["GSTGroup"])
  //     );

  //     // const TotalGST = parseFloat(updatedBodyData[ind]?.GSTType?.value || 0);
  //     const discAmt =
  //       ((Rate * Qty) / 100) * parseFloat(updatedBodyData[ind]?.Discount || 0);
  //     if ((Qty > 0 && Rate > 0) || TotalGST > 0) {
  //       // updatedBodyData[ind]["GSTAmount"] = ((Qty * Rate) * TotalGST || 1) / 100;
  //       updatedBodyData[ind]["GSTAmount"] =
  //         ((Qty * Rate - discAmt) * (TotalGST || 0)) / 100;
  //       updatedBodyData[ind]["NetAmount"] =
  //         Qty * Rate -
  //         discAmt +
  //         ((Qty * Rate - discAmt) * (TotalGST || 0)) / 100;
  //       // updatedBodyData[ind]["NetAmount"] = ((Qty * Rate) + ((Qty * Rate) * TotalGST || 1) / 100)+updatedBodyData[ind]["GSTAmount"];
  //       // updatedBodyData[ind]["NetAmount"] = ((Qty * Rate) + ((Qty * Rate) * TotalGST || 1) / 100) - discAmt;
  //       console.log(
  //         "updatedBodyData[ind]NetAmount",
  //         updatedBodyData[ind]["NetAmount"]
  //       );
  //       // if (Qty > 0 && Rate > 0 || TotalGST > 0) {
  //       //   updatedBodyData[ind]["GSTAmount"] = ((Qty * Rate) * TotalGST || 1) / 100;
  //       //   updatedBodyData[ind]["NetAmount"] = ((Qty * Rate) + ((Qty * Rate) * TotalGST || 1) / 100) - discAmt;
  //       //   console.log("updatedBodyData[ind]NetAmount", updatedBodyData[ind]["NetAmount"])
  //     } else {
  //       updatedBodyData[ind]["GSTAmount"] = 0;
  //       updatedBodyData[ind]["NetAmount"] = 0;
  //     }
  //     setBodyData(updatedBodyData);
  //   }

  //   // else if(isEdit){
  //   //
  //   //   const updatedBodyData = [...bodyData];
  //   //   updatedBodyData[ind][name] = value;

  //   //   updatedBodyData[ind]["IGSTPercent"] =  updatedBodyData[ind]["isSplit"]  ?  "0" :Number(updatedBodyData[ind]["GSTGroup"])|| Number(updatedBodyData[ind]["GSTGroup"]?.value || updatedBodyData[ind]["GSTGroup"]);
  //   //   updatedBodyData[ind]["CGSTPercent"] =  updatedBodyData[ind]["isSplit"]  ?  Number(updatedBodyData[ind]["GSTGroup"]?.value || updatedBodyData[ind]["GSTGroup"]?.value)/2 : "0";
  //   //   updatedBodyData[ind]["SGSTPercent"] =  updatedBodyData[ind]["isSplit"]  ?  Number(updatedBodyData[ind]["GSTGroup"]?.value || updatedBodyData[ind]["GSTGroup"]?.value)/2 : "0";

  //   //   const Qty = parseFloat(updatedBodyData[ind]?.Qty || updatedBodyData[ind]?.Quantity|| 0);
  //   //   const Rate = parseFloat(updatedBodyData[ind]?.Rate || 0);
  //   //   const TotalGST = parseFloat(updatedBodyData[ind]?.GSTType?.value || 0);
  //   //   const discAmt =   Rate * Qty /100 * (parseFloat(updatedBodyData[ind]?.Discount || 0));

  //   //   if (Qty > 0 && Rate > 0 || TotalGST > 0) {
  //   //     updatedBodyData[ind]["GSTAmount"] = ((Qty * Rate) * TotalGST || 1) / 100;
  //   //     updatedBodyData[ind]["NetAmount"] = ((Qty * Rate) + ((Qty * Rate) * TotalGST || 1) / 100) - discAmt;
  //   //     console.log("updatedBodyData[ind]NetAmount",updatedBodyData[ind]["NetAmount"])
  //   //   } else {
  //   //     updatedBodyData[ind]["GSTAmount"] = 0;
  //   //     updatedBodyData[ind]["NetAmount"] = 0;
  //   //   }
  //   //   setBodyData(updatedBodyData);

  //   // }
  //   else {
  //     const updatedBodyData = [...bodyData];
  //     updatedBodyData[ind][name] = value;

  //     updatedBodyData[ind]["IGSTPercent"] = updatedBodyData[ind]["GSTType"]?.value === "CGST&UTGST"
  //       || updatedBodyData[ind]["GSTType"]?.value === "CGST&SGST"
  //       || updatedBodyData[ind]["GSTType"] === "CGST&UTGST"
  //       || updatedBodyData[ind]["GSTType"] === "CGST&SGST"
  //       ? "0"
  //       : Number(updatedBodyData[ind]["GSTGroup"]) ||
  //       Number(
  //         updatedBodyData[ind]["GSTGroup"]?.value ||
  //         updatedBodyData[ind]["GSTGroup"]
  //       );
  //     updatedBodyData[ind]["CGSTPercent"] = updatedBodyData[ind]["GSTType"]?.value === "CGST&UTGST"
  //       || updatedBodyData[ind]["GSTType"]?.value === "CGST&SGST"
  //       || updatedBodyData[ind]["GSTType"] === "CGST&UTGST"
  //       || updatedBodyData[ind]["GSTType"] === "CGST&SGST"
  //       ? Number(
  //         updatedBodyData[ind]["GSTGroup"]?.value ||
  //         updatedBodyData[ind]["GSTGroup"]?.value
  //       ) / 2
  //       : "0";
  //     updatedBodyData[ind]["SGSTPercent"] = updatedBodyData[ind]["GSTType"]?.value === "CGST&UTGST"
  //       || updatedBodyData[ind]["GSTType"]?.value === "CGST&SGST"
  //       || updatedBodyData[ind]["GSTType"] === "CGST&UTGST"
  //       || updatedBodyData[ind]["GSTType"] === "CGST&SGST"
  //       ? Number(
  //         updatedBodyData[ind]["GSTGroup"]?.value ||
  //         updatedBodyData[ind]["GSTGroup"]?.value
  //       ) / 2
  //       : "0";

  //     const Qty = parseFloat(
  //       updatedBodyData[ind]?.Qty || updatedBodyData[ind]?.Quantity || 0
  //     );
  //     const Rate = parseFloat(updatedBodyData[ind]?.Rate || 0);
  //     // const TotalGST = parseFloat(updatedBodyData[ind]?.GSTType?.value || 0);
  //     const TotalGST = parseFloat(
  //       Number(updatedBodyData[ind]["GSTGroup"]) ||
  //       Number(updatedBodyData[ind]["GSTGroup"]?.value) ||
  //       Number(updatedBodyData[ind]["ItemName"]["GSTGroup"])
  //     );

  //     const discAmt =
  //       ((Rate * Qty) / 100) * parseFloat(updatedBodyData[ind]?.Discount || 0);

  //     if ((Qty > 0 && Rate > 0) || TotalGST > 0) {
  //       // updatedBodyData[ind]["GSTAmount"] = ((Qty * Rate) * TotalGST || 1) / 100;
  //       updatedBodyData[ind]["GSTAmount"] =
  //         ((Qty * Rate - discAmt) * (TotalGST || 0)) / 100;
  //       updatedBodyData[ind]["NetAmount"] =
  //         Qty * Rate -
  //         discAmt +
  //         ((Qty * Rate - discAmt) * (TotalGST || 0)) / 100;
  //       // updatedBodyData[ind]["NetAmount"] = ((Qty * Rate) + ((Qty * Rate) * TotalGST || 1) / 100)+updatedBodyData[ind]["GSTAmount"];
  //       // updatedBodyData[ind]["NetAmount"] = ((Qty * Rate) + ((Qty * Rate) * TotalGST || 1) / 100) - discAmt;
  //       console.log(
  //         "updatedBodyData[ind]NetAmount",
  //         updatedBodyData[ind]["NetAmount"]
  //       );
  //     } else {
  //       updatedBodyData[ind]["GSTAmount"] = 0;
  //       updatedBodyData[ind]["NetAmount"] = 0;
  //     }
  //     setBodyData(updatedBodyData);
  //   }
  // };


  const getGSTValue = (input) => Number(input?.value ?? input ?? 0);

  const isSplitGST = (type) =>
    type === "CGST&SGST" || type === "CGST&UTGST";

  const updateGSTPercents = (data) => {
    const GSTType = data?.GSTType?.value || data?.GSTType;
    const GSTGroupValue = getGSTValue(data?.GSTGroup);

    if (isSplitGST(GSTType)) {
      data.IGSTPercent = "0";
      data.CGSTPercent = GSTGroupValue / 2;
      data.SGSTPercent = GSTGroupValue / 2;
    } else {
      data.IGSTPercent = GSTGroupValue;
      data.CGSTPercent = "0";
      data.SGSTPercent = "0";
    }
  };

  const calculateAmounts = (data) => {
    const Qty = parseFloat(data?.Qty || data?.Quantity || 0);
    const Rate = parseFloat(data?.Rate || 0);
    const Discount = parseFloat(data?.Discount || 0);
    const GSTGroup = getGSTValue(data?.GSTGroup ?? data?.ItemName?.GSTGroup);
    const discAmt = ((Rate * Qty) * Discount) / 100;

    if ((Qty > 0 && Rate > 0) || GSTGroup > 0) {
      const gstAmt = ((Qty * Rate - discAmt) * GSTGroup) / 100;
      data.GSTAmount = gstAmt;
      data.NetAmount = Qty * Rate - discAmt + gstAmt;
    } else {
      data.GSTAmount = 0;
      data.NetAmount = 0;
    }
  };



  const handleCustomInput = async (ind, name, value) => {
    debugger
    const updatedBodyData = [...bodyData];
    const row = updatedBodyData[ind];

    if (!row) return;

    if (name === "Specification" && value?.length > 1000) {
      notify("Specification cannot exceed 1000 characters", "warn");
      return;
    }

    if (name === "supplier") {
      const vendorID = value?.VendorID || row?.VendorID;

      if (vendorID) {
        const response = await handleGRNSameStateBuyierSupplier(vendorID);
        const gstType = response?.data?.[0]?.GSTType;
        if (gstType) row["GSTType"] = gstType;
      }

      row[name] = value;
      updateGSTPercents(row);
      calculateAmounts(row);
      setBodyData(updatedBodyData);
      return;
    }

    if (name === "GSTGroup") {
      row[name] = value;
      updateGSTPercents(row);
      calculateAmounts(row);
      setBodyData(updatedBodyData);
      return;
    }

    // other inputs
    row[name] = value;
    updateGSTPercents(row);
    calculateAmounts(row);
    setBodyData(updatedBodyData);
  };




  //   const handleCustomInput = async (ind, name, value) => {
  //   const updatedBodyData = [...bodyData];
  //   const row = updatedBodyData[ind];

  //   if (!row) return;

  //   const getGSTValue = (input) => 
  //     Number(input?.value ?? input ?? 0);

  //   const isSplitGST = (type) =>
  //     type === "CGST&SGST" || type === "CGST&UTGST";

  //   const calculateAmounts = (data) => {
  //     const Qty = parseFloat(data?.Qty || data?.Quantity || 0);
  //     const Rate = parseFloat(data?.Rate || 0);
  //     const Discount = parseFloat(data?.Discount || 0);
  //     const GSTGroup = getGSTValue(data?.GSTGroup ?? data?.ItemName?.GSTGroup);
  //     const discAmt = ((Rate * Qty) * Discount) / 100;

  //     if ((Qty > 0 && Rate > 0) || GSTGroup > 0) {
  //       const gstAmt = ((Qty * Rate - discAmt) * GSTGroup) / 100;
  //       data.GSTAmount = gstAmt;
  //       data.NetAmount = Qty * Rate - discAmt + gstAmt;
  //     } else {
  //       data.GSTAmount = 0;
  //       data.NetAmount = 0;
  //     }
  //   };

  //   const updateGSTPercents = (data) => {
  //     const GSTType = data?.GSTType?.value || data?.GSTType;
  //     const GSTGroupValue = getGSTValue(data?.GSTGroup);

  //     if (isSplitGST(GSTType)) {
  //       data.IGSTPercent = "0";
  //       data.CGSTPercent = GSTGroupValue / 2;
  //       data.SGSTPercent = GSTGroupValue / 2;
  //     } else {
  //       data.IGSTPercent = GSTGroupValue;
  //       data.CGSTPercent = "0";
  //       data.SGSTPercent = "0";
  //     }
  //   };

  //   // === SPECIFICATION VALIDATION ===
  //   if (name === "Specification" && value?.length > 1000) {
  //     notify("Specification cannot exceed 1000 characters", "warn");
  //     return;
  //   }

  //   // === SUPPLIER ===
  //   if (name === "supplier") {
  //     const vendorID = value?.VendorID || row?.VendorID;

  //     if (vendorID) {
  //       const response = await handleGRNSameStateBuyierSupplier(vendorID);
  //       const gstType = response?.data?.[0]?.GSTType;
  //       if (gstType) row["GSTType"] = gstType;
  //     }

  //     row[name] = value;
  //     updateGSTPercents(row);
  //     calculateAmounts(row);
  //     setBodyData(updatedBodyData);
  //     return;
  //   }

  //   // === GST GROUP ===
  //   if (name === "GSTGroup") {
  //     row[name] = value;
  //     updateGSTPercents(row);
  //     calculateAmounts(row);
  //     setBodyData(updatedBodyData);
  //     return;
  //   }

  //   // === OTHER FIELDS ===
  //   row[name] = value;
  //   updateGSTPercents(row);
  //   calculateAmounts(row);
  //   setBodyData(updatedBodyData);
  // };




  // const handleCustomInput = async (ind, name, value) =>  {

  //   if (name === "supplier") {
  //
  //     const updatedBodyData = [...bodyData];
  //   updatedBodyData[ind]["isSplit"] = await handleGRNSameStateBuyierSupplier(value?.VendorID)
  //   updatedBodyData[ind][name] = value;

  //   updatedBodyData[ind]["IGSTPercent"] =  updatedBodyData[ind]["isSplit"]  ?  "0" : Number(updatedBodyData[ind]["GSTGroup"])|| Number(updatedBodyData[ind]["GSTGroup"]?.value) || Number(updatedBodyData[ind]["ItemName"]["GSTGroup"] );
  //   updatedBodyData[ind]["CGSTPercent"] =  updatedBodyData[ind]["isSplit"]  ?  Number(updatedBodyData[ind]["GSTGroup"]?.value)/2 || Number(updatedBodyData[ind]["ItemName"]["GSTGroup"])/2 : "0";
  //   updatedBodyData[ind]["SGSTPercent"] =  updatedBodyData[ind]["isSplit"]  ?  Number(updatedBodyData[ind]["GSTGroup"]?.value)/2 || Number(updatedBodyData[ind]["ItemName"]["GSTGroup"])/2 : "0";

  //   const Qty = parseFloat(updatedBodyData[ind]?.Qty || updatedBodyData[ind]?.Quantity|| 0);
  //   const Rate = parseFloat(updatedBodyData[ind]?.Rate || 0);
  //   const TotalGST = parseFloat(updatedBodyData[ind]?.GSTType?.value || 0);
  //   const discAmt =   Rate * Qty /100 * (parseFloat(updatedBodyData[ind]?.Discount || 0));

  //   if (Qty > 0 && Rate > 0 || TotalGST > 0) {
  //     updatedBodyData[ind]["GSTAmount"] = ((Qty * Rate) * TotalGST || 1) / 100;
  //     updatedBodyData[ind]["NetAmount"] = ((Qty * Rate) + ((Qty * Rate) * TotalGST || 1) / 100) - discAmt;
  //     console.log("updatedBodyData[ind]NetAmount",updatedBodyData[ind]["NetAmount"])
  //   } else {
  //     updatedBodyData[ind]["GSTAmount"] = 0;
  //     updatedBodyData[ind]["NetAmount"] = 0;
  //   }
  //   ;
  //   setBodyData(updatedBodyData);

  // }

  // else{
  //
  //   const updatedBodyData = [...bodyData];
  //   updatedBodyData[ind][name] = value;

  //   updatedBodyData[ind]["IGSTPercent"] =  updatedBodyData[ind]["isSplit"]  ?  "0" :Number(updatedBodyData[ind]["GSTGroup"])|| Number(updatedBodyData[ind]["GSTGroup"]?.value || updatedBodyData[ind]["GSTGroup"]);
  //   updatedBodyData[ind]["CGSTPercent"] =  updatedBodyData[ind]["isSplit"]  ?  Number(updatedBodyData[ind]["GSTGroup"]?.value || updatedBodyData[ind]["GSTGroup"]?.value)/2 : "0";
  //   updatedBodyData[ind]["SGSTPercent"] =  updatedBodyData[ind]["isSplit"]  ?  Number(updatedBodyData[ind]["GSTGroup"]?.value || updatedBodyData[ind]["GSTGroup"]?.value)/2 : "0";

  //   const Qty = parseFloat(updatedBodyData[ind]?.Qty || updatedBodyData[ind]?.Quantity|| 0);
  //   const Rate = parseFloat(updatedBodyData[ind]?.Rate || 0);
  //   const TotalGST = parseFloat(updatedBodyData[ind]?.GSTType?.value || 0);
  //   const discAmt =   Rate * Qty /100 * (parseFloat(updatedBodyData[ind]?.Discount || 0));

  //   if (Qty > 0 && Rate > 0 || TotalGST > 0) {
  //     updatedBodyData[ind]["GSTAmount"] = ((Qty * Rate) * TotalGST || 1) / 100;
  //     updatedBodyData[ind]["NetAmount"] = ((Qty * Rate) + ((Qty * Rate) * TotalGST || 1) / 100) - discAmt;
  //     console.log("updatedBodyData[ind]NetAmount",updatedBodyData[ind]["NetAmount"])
  //   } else {
  //     updatedBodyData[ind]["GSTAmount"] = 0;
  //     updatedBodyData[ind]["NetAmount"] = 0;
  //   }
  //   setBodyData(updatedBodyData);

  // }

  // };
  // const handleCustomInput = (ind, name, value) => {

  //   const updatedBodyData = [...bodyData];

  //   // updatedBodyData[ind] = value;

  //   updatedBodyData[ind][name] = value;
  //   const Qty = parseFloat(updatedBodyData[ind]?.Qty || updatedBodyData[ind]?.Quantity|| 0);
  //   const Rate = parseFloat(updatedBodyData[ind]?.Rate || 0);
  //   const TotalGST = parseFloat(updatedBodyData[ind]?.GSTGroup?.TotalGST || 0);

  //   if (Qty > 0 && Rate > 0 && TotalGST > 0) {
  //     updatedBodyData[ind]["GSTAmount"] = ((Qty * Rate) * TotalGST) / 100;
  //     updatedBodyData[ind]["NetAmount"] = ((Qty * Rate) + ((Qty * Rate) * TotalGST) / 100);
  //     console.log("updatedBodyData[ind]NetAmount",updatedBodyData[ind]["NetAmount"])
  //   } else {
  //     updatedBodyData[ind]["GSTAmount"] = 0;
  //     updatedBodyData[ind]["NetAmount"] = 0;
  //   }
  //   setBodyData(updatedBodyData);
  // };
  // const THEAD = [
  //   "S.No.",
  //   {
  //     name: "Item Name",
  //   },
  //   { name: "Manufacturer" },
  //   { name: "Supplier" },
  //   "UOM",
  //   "Pack",
  //   "Main Store",
  //   "Qty.",
  //   "Rate",
  //   "MRP",
  //   "Discount",
  //   {
  //     name: "GST Group",

  // //   },
  // //   "IGST",
  // //   "CGST",
  // //   "SGST/UTGST",
  // //   "Tax On",
  // //   "Total GST%",
  // //   "GST Amount",
  // //   "Net Amount",
  // //   "Budget",
  // //   "Free",
  // // ];
  // ]

  // const [t] = useTranslation();

  const THEAD = [
    t("SNo"),
    { name: t("ItemName") },
    { name: t("Manufacturer") },
    { name: t("Supplier"), width: "4%" },
    t("UOM"),
    t("Pack"),
    t("MainStore"),
    t("Quantity"),
    t("Rate"),
    t("MRP"),
    t("Disc %"),
    { name: t("GST %") },
    { name: t("GST Type"), width: "3%" },

    t("IGST"),
    t("CGST"),
    t("SGSTUTGST"),
    t("TaxOn"),
    t("TotalGSTPercent"),
    t("GSTAmountonBill"),
    t("NetAmount"),
    t("Budget"),
    t("Free"),
    t("Specification"),
    t("Action")
  ];

  const validateInvestigation = async (e, ind) => {
    debugger
    const { value: selectedItem } = e;
    console.log("selectedItem", selectedItem);
    const updatedBodyData = [...bodyData];
    updatedBodyData[ind] = {
      ...updatedBodyData[ind],
      ItemName: selectedItem,
      manufacturer: {
        value: selectedItem.ManufactureID,
        label: selectedItem.Manufacturer,
      },
      RateAD: { label: `${t("Rate AD")}`, value: "RateAD" },
      Free: { label: "No", value: "No" },
      // GSTGroup: {
      //   value: selectedItem.GSTGroup,

      // },
    };

    const hasEmptyRow = updatedBodyData.some((row) => row?.ItemName === "");
    if (!hasEmptyRow) {
      updatedBodyData.push({
        Sno: updatedBodyData.length + 1,
        ItemName: "",
        Qty: "",
        CurStock: "",
        Unit: "",
        RateAD: { label: `${t("Rate AD")}`, value: "RateAD" },
        Free: { label: "No", value: "No" },
      });
    }
    setBodyData(updatedBodyData);
  };

  const renderManufacturerAPI = async () => {
    try {
      const BindManufacturers = await PurchaseBindGetManufacturers();
      if (BindManufacturers?.success) {
        setDropDownState((val) => ({
          ...val,
          BindManufacturers: handleReactSelectDropDownOptions(
            BindManufacturers?.data,
            "Name",
            "ManufactureID"
          ),
        }));
      }
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };

  const handleChildEdit = async (val, ind) => {
    debugger
    let orderNo = val?.PONo;
    let departmentLedgerID = localData?.deptLedgerNo;
    setPoNumber(val?.PONo)
    try {
      const response = await OnEditGetPurchaseOrderItemDetails(
        orderNo,
        departmentLedgerID
      );
      if (response?.success) {
        debugger
        setIsEdit(true);
        console.log("response?.data", response?.data);

        if (Number(response?.data[0]?.isPOByPR) > 0) {
          setIsPoByPr(true)
        }
        //  let editData=response?.data?.map(()=>({

        //  }))
        // setBodyData(...response?.data,orderNo=orderNo)
        // setBodyData(response?.data)

        const upaded = response?.data?.map((preV) => (
          {
            ...preV,
            supplier: {
              label: preV?.Supplier,
              // value: "LSHHI57291",
              value: preV?.VendorID,


            },
            GSTGroup: String(preV?.VAT),
            isSplit: preV?.GSTType === "CGST&SGST" ? true : false
          }
        ))
        setPayload((preV) => ({
          ...preV,
          remarks: upaded[0]?.remarks,
          subject: upaded[0]?.subjects,
        }));
        setBodyData(upaded);
        // if(){

        //   setIsPoByPr(true)
        // }
      } else {
        notify(response?.message, "error");
      }
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };

  const handleChildData = (getData) => {
    debugger
    console.log("getData", getData);
    const updatedBodyData = getData.map((val) => {
      return { ...val, isSplit: true, supplier: { value: val?.supplierID }, GSTGroup: String(Number(val?.GSTGroup)) }
    })

    // setBodyData(updatedBodyData || []);

    const finalData = updatedBodyData.map((row) => {
      updateGSTPercents(row);
      calculateAmounts(row);
      return row;
    });
    setBodyData(finalData || []);
    setBackUpValues(getData);



    setIsPoByPr(true)
  };

  const handlePurchaseRequest = () => {
    if (!payload.storeType.value) {
      notify("please Select storeType ", "error");
      return;
    }

    setModalData({
      visible: true,
      width: "80vw",
      Heading: "60vh",
      label: "Purchase Request's",
      footer: <></>,
      Component: (
        <ViewPR
          storeType={payload?.storeType}
          handleClose={handleClose}
          getData={handleChildData}
          setIsFlag={setIsFlag}
          setIsNormalPo={setIsNormalPo}
        />
      ),
    });
  };

  const GetTaxGroup = async () => {
    try {
      const GetTaxGroup = await PurchaseGetTaxGroup();
      setDropDownState((val) => ({
        ...val,
        GetTaxGroup: handleReactSelectDropDownOptions(
          GetTaxGroup?.data,
          "TaxGroupLabel",
          "TaxGroupLabel",
          "id"
        ),
      }));
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };

  const handleImageChange = (e) => {
    const file = e?.target?.files[0];

    if (file) {
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        alert("File size exceeds 5MB. Please choose a smaller file.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader?.result.split(",")[1];
        const fileExtension = file?.name.split(".").pop();
        setImage({
          ...Image,
          SelectFile: file,
          Document_Base64: base64String,
          FileExtension: fileExtension,
        });
      };
      reader.readAsDataURL(file); // Convert file to base64
    }
  };

  useEffect(() => {
    // const filteredBodyData = bodyData.slice(0, bodyData.length - 1);
    const filteredBodyData = bodyData.slice(0, bodyData.length);
    console.log("filteredBodyData", filteredBodyData);
    const totalAmount = filteredBodyData.reduce((accumulator, item) => {
      return accumulator + (parseFloat(item?.NetAmount) || 0);
    }, 0);

    setNetAmount(totalAmount);

    const lastItem = bodyData && bodyData[bodyData.length - 1];

    if (lastItem?.ItemName?.toString().trim() !== "") {
      setBodyData((prev) => [...prev, initialItem]);
    }
  }, [bodyData]);

  useEffect(() => {
    renderManufacturerAPI();
    // getItemsByCategory();
    getItemsByCategory(payload?.storeType?.value);
    GetTaxGroup();
  }, []);

  const handleClose = () => {
    setModalData((val) => ({ ...val, visible: false }));
  };
  const handleCancle = () => {
    setIsEdit(false);
    setBodyData([initialItem]);
    setPayload({
      storeType: { label: "Medical Store", value: "STO00001" }, // Default value
      requisitionType: { label: "Normal", value: "normal" },
      poType: { label: "PO By Item", value: "1" },
      poTypeService: { label: "No Service", value: "0" },
      category: {
        name: "MEDICAL STORE ITEMS",
        categoryID: "5",
        configID: "11",
        label: "MEDICAL STORE ITEMS",
        value: "5",
      },
      subCategory: { label: "All", value: "0", subCategoryID: "0" },
      supplier: {},
      validDate: moment().format("YYYY-MM-DD"),
      poDate: moment().format("YYYY-MM-DD"),
      deliveryDate: moment().format("YYYY-MM-DD"),
      netAmount: "",
      roundOff: "",
      remarks: "",
      subject: "",
    });
  };

  console.log(backupValues, "backupValuesbackupValues🐱‍🐉🐱‍🐉")
  const handleRemoveItem = (index) => {
    debugger
    const newItems = bodyData?.filter((item, i) => i !== index);
    setBodyData(newItems );
  };

  return (
    <div className="mt-2 spatient_registration_card">
      <div className="patient_registration card">
        <Heading title={t("Purchase Order Type")} isBreadcrumb={true} />
        <div className="row p-2">
          <ReactSelect
            requiredClassName={"required-fields"}
            placeholderName={t("Store Type")}
            searchable={true}
            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
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
            placeholderName={t("PO Type")}
            searchable={true}
            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
            id={"poTypeService"}
            name={"poTypeService"}
            removeIsClearable={true}
            handleChange={(name, e) => handleReactChange(name, e)}
            dynamicOptions={[
              { label: "No Service", value: "0" },
              { label: "Service", value: "1" },
            ]}
            value={payload?.poTypeService?.value}
          />
          <ReactSelect
            placeholderName={t("Category")}
            searchable={true}
            // requiredClassName={"required-fields"}
            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
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
            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
            id={"subCategory"}
            name={"subCategory"}
            removeIsClearable={true}
            handleChange={(name, e) => handleReactChange(name, e)}
            dynamicOptions={[
              { label: "All", value: 0 },
              ...(dropDownState?.getItemsBySubCategory || []),
            ]}
            value={payload?.subCategory?.value}
          />
          <ReactSelect
            // requiredClassName={"required-fields"}

            placeholderName={t("PO Type")}
            searchable={true}
            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
            id={"poType"}
            name={"poType"}
            removeIsClearable={true}
            handleChange={(name, e) => handleReactChange(name, e)}
            dynamicOptions={[
              { label: "PO By Item", value: "1" },
              { label: "PO By Supplier", value: "2" },
              { label: "PO By PR", value: "4" },
            ]}
            value={payload?.poType?.value}
          />
          {payload?.poType?.value === "2" && (
            <ReactSelect
              placeholderName={t("Supplier")}
              searchable={true}
              // requiredClassName={"required-fields"}
              respclass="col-xl-2 col-md-3 col-sm-6 col-12"
              id={"supplier"}
              name={"supplier"}
              removeIsClearable={true}
              handleChange={(name, e) => handleReactChange(name, e)}
              dynamicOptions={dropDownState?.BindGetVendorsAPI}
              value={payload?.supplier?.value}
            />
          )}

          {payload?.poType?.value === "4" && (
            <button
              className="btn btn-sm btn-primary mx-1"
              onClick={handlePurchaseRequest}
            >
              {t("Purchase Request")}
            </button>
          )}
        </div>
      </div>
      {isFlag ? (
        <div className="patient_registration card">
          <div className="row p-2">
            <div className="col-12">

              <Tables
                thead={THEAD}
                tbody={bodyData?.map((val, ind) => ({

                  Sno: ind + 1,
                  Item: (
                    <div style={{ width: "200px" }}>

                      <AutoComplete
                        value={
                          val.ItemName?.ItemName
                            ? val.ItemName?.ItemName
                            : val.ItemName
                        }
                        suggestions={items}
                        completeMethod={search}
                        onSelect={(e) => validateInvestigation(e, ind)}
                        className="w-100 required-fields"
                        id={`searchtest-${ind}`} // Unique ID for each row
                        onChange={(e) => {

                          const data =
                            typeof e?.value === "object" ? e?.value : e?.value;
                          let listItem = [...bodyData];
                          if (!listItem[ind]?.ItemName) {
                            listItem[ind]["ItemName"] = data;
                          } else {
                            listItem[ind] = { ...listItem[ind], ItemName: data };
                          }
                          setBodyData(listItem);
                        }}
                        itemTemplate={itemTemplate}
                        disabled={ind === bodyData?.length - 1 && isPoByPr}
                      />
                    </div>
                  ),

                  Manufacturer: (
                    <CustomSelect
                      placeHolder={t("Manufacturer")}
                      name="manufacturer"
                      onChange={(name, e) => {
                        handleCustomInput(ind, "manufacturer", e);
                      }}
                      value={
                        val?.manufacturer?.value || Number(val?.ManufactureID)
                      }
                      option={dropDownState?.BindManufacturers}
                      isDisable={ind === bodyData?.length - 1 && isPoByPr}
                    />
                  ),

                  Supplier: (
                    <div>

                      <CustomSelect
                        placeHolder={t("Supplier")}
                        name="supplier"
                        requiredClassName="required-fields"
                        onChange={(name, e) => {
                          handleCustomInput(ind, "supplier", e);
                        }}
                        // value={val?.supplier?.value }
                        value={val?.supplier?.value ? val?.supplier?.value : val?.supplier}
                        option={dropDownState?.BindGetVendorsAPI}
                        isDisable={ind === bodyData?.length - 1 && isPoByPr}
                      />
                    </div>
                  ),
                  UOM: val?.ItemName?.MajorUnit
                    ? val?.ItemName?.MajorUnit
                    : val?.PUnit,
                  Pack: val?.ItemName?.Pack ? val?.ItemName?.Pack : val?.Pack,
                  MainStore: (
                    <div style={{ width: "50px" }}>
                      <Input
                        type="number"
                        className="table-input"
                        removeFormGroupClass={true}
                        name="MainStore"
                        placeholder=""
                        value={val.MainStore ? val.MainStore : val?.MainStore}
                        onChange={(e) =>
                          handleCustomInput(ind, "MainStore", e.target.value)
                        }
                        disabled={ind === bodyData?.length - 1 && isPoByPr}
                      />
                    </div>
                  ),
                  Qty: (
                    <div style={{ width: "50px" }}>
                      {" "}
                      {/* <Input
                        type="text"
                        className="table-input required-fields"
                        removeFormGroupClass={true}
                        // allowDecimal={true}
                        // decimalScale={2}
                        name="Quantity"
                        placeholder=""
                        value={val?.Quantity}
                        // value={val?.Qty || val?.Quantity}
                        // value={val?.Qty}
                        onChange={(e) =>
                          handleCustomInput(ind, "Quantity", e.target.value)
                        }
                      /> */}
                      <Input
                        type="text"
                        name="Quantity"
                        value={val?.Quantity}

                        // max={isPoByPr? backupValues?.items[ind].Quantity : 600}
                        className="table-input required-fields"
                        placeholder=""
                        onKeyDown={(e) => handleDecimalKeyDown(e, 4)}
                        onChange={(e) => {
                          debugger
                          const newValue = e.target.value;
                          if (isPoByPr && Number(backupValues[ind].Quantity) < Number(newValue)) {
                            return;
                          } else {
                            if (validateDecimalInput(newValue, 13, 4)) {
                              handleCustomInput(ind, "Quantity", newValue);
                            }
                          }
                        }}
                        disabled={ind === bodyData?.length - 1 && isPoByPr}
                      />
                    </div>
                  ),
                  Rate: (
                    <div style={{ width: "50px" }}>
                      <Input
                        type="text"
                        className="table-input required-fields"
                        removeFormGroupClass={true}
                        allowDecimal={true}
                        decimalScale={2}
                        name="Rate"
                        placeholder=""
                        value={val.Rate}
                        onKeyDown={(e) => handleDecimalKeyDown(e, 4)}
                        onChange={(e) => {
                          const newValue = e.target.value;
                          if (validateDecimalInput(newValue, 13, 4)) {
                            handleCustomInput(ind, "Rate", newValue);
                          }
                        }}
                        disabled={ind === bodyData?.length - 1 && isPoByPr}
                      />
                    </div>
                  ),
                  MRP: (
                    <div style={{ width: "50px" }}>
                      <Input
                        type="text"
                        className="table-input required-fields"
                        removeFormGroupClass={true}
                        allowDecimal={true}
                        decimalScale={2}
                        name="MRP"
                        placeholder=""
                        value={val.MRP}

                        onKeyDown={(e) => handleDecimalKeyDown(e, 4)}
                        onChange={(e) => {
                          const newValue = e.target.value;
                          if (validateDecimalInput(newValue, 13, 4)) {
                            handleCustomInput(ind, "MRP", newValue);
                          }
                        }}
                        disabled={ind === bodyData?.length - 1 && isPoByPr}
                      />
                    </div>
                  ),
                  Discount: (
                    <div style={{ width: "50px" }}>
                      <Input
                        type="text"
                        className="table-input"
                        allowDecimal={true}
                        decimalScale={2}
                        removeFormGroupClass={true}
                        name="Discount"
                        placeholder=""
                        value={val.Discount}
                        onKeyDown={(e) => handleDecimalKeyDown(e, 4)}
                        onChange={(e) => {
                          const newValue = e.target.value;
                          if (validateDecimalInput(newValue, 13, 4)) {
                            handleCustomInput(ind, "Discount", newValue);
                          }
                        }}
                        disabled={ind === bodyData?.length - 1 && isPoByPr}
                      />
                    </div>
                  ),
                  // GSTType: (

                  //   <div style={{ width: "130px" }}>
                  //    {
                  //     console.log("gst",val ,val.ItemName?.GSTType)
                  //    }
                  //    {
                  //     console.log("GST_TYPE_OPTION",)
                  //    }
                  //     <CustomSelect
                  //       placeHolder={t("GST Type")}
                  //       name="GSTType"
                  //       onChange={(name, e) => { handleCustomInput(ind, "GSTType", e) }}
                  //       value={val?.GSTType?.value || (val.ItemName?.GSTType)}
                  //       // value={val?.GSTType || (val.ItemName?.GSTType)}
                  //       // value={val?.GSTGroup?.value || (val.GSTGroup)}
                  //       // value={val?.GSTGroup?.value?val?.GSTGroup?.value:val.GSTGroup}
                  //       option={GST_TYPE_OPTION}

                  //     />
                  //   </div>

                  // ),
                  GSTGroup: (
                    <div style={{ width: "130px" }}>

                      <CustomSelect
                        placeHolder={t("GST %")}
                        name="GSTGroup"
                        onChange={(name, e) => {
                          handleCustomInput(ind, "GSTGroup", e);
                        }}
                        // value={val?.GSTType?.value || (val.ItemName?.GSTType)}
                        // value={val?.GSTType || (val.ItemName?.GSTType)}
                        // value={val?.GSTGroup?.value?val?.GSTGroup?.value: val?.GSTGroup}
                        value={
                          (val?.ItemName?.GSTGroup ? val?.ItemName?.GSTGroup : val?.GSTGroup?.value || val?.GSTGroup)
                        }
                        // value={val?.GSTGroup?.value || (val.GSTGroup)}
                        // value={val?.GSTGroup?.value?val?.GSTGroup?.value:val.GSTGroup}
                        option={GST_TYPE_OPTION}
                        isDisable={ind === bodyData?.length - 1 && isPoByPr}
                      />
                    </div>
                  ),
                  gstTyp: (
                    <div style={{ width: "130px" }}>

                      <CustomSelect
                        placeHolder={t("GST Type")}
                        name="GSTType"
                        onChange={(name, e) => {
                          handleCustomInput(ind, "GSTType", e);
                        }}
                        // value={val?.GSTType?.value || (val.ItemName?.GSTType)}
                        // value={val?.GSTType || (val.ItemName?.GSTType)}
                        // value={val?.GSTGroup?.value?val?.GSTGroup?.value: val?.GSTGroup}
                        value={
                          (val?.GSTType?.value || val?.GSTType)
                        }
                        // value={val?.GSTGroup?.value || (val.GSTGroup)}
                        // value={val?.GSTGroup?.value?val?.GSTGroup?.value:val.GSTGroup}
                        option={[
                          { label: "IGST", value: "IGST" },
                          { label: "CGST&SGST", value: "CGST&SGST" },
                          { label: "CGST&UTGST", value: "CGST&UTGST" }
                        ]}
                        isDisable={ind === bodyData?.length - 1 && isPoByPr}
                      />
                    </div>
                  ),
                  // gstTyp: (
                  //   <div style={{ width: "100px" }}>
                  //     <Input
                  //       type="text"
                  //       className="table-input"
                  //       value={val?.isSplit ? "CGST&SGST" : "IGST"}
                  //       readOnly={true}
                  //       disabled={ind === bodyData?.length-1 && isPoByPr}
                  //     />
                  //   </div>
                  // ),
                  IGST: val?.IGSTPercent ? val?.IGSTPercent : "0",
                  CGST: val?.CGSTPercent ? val?.CGSTPercent : "0",
                  "SGST/UTGST": val?.SGSTPercent ? val?.SGSTPercent : "0",
                  "Tax On": (
                    <div style={{ width: "70px" }}>
                      {console.log("va", val?.RateAD?.value, val?.TaxOn)}
                      <CustomSelect
                        placeHolder={t("Tax On")}
                        name="RateAD"
                        onChange={(name, e) => {
                          handleCustomInput(ind, "RateAD", e);
                        }}
                        // value={val?.RateAD?.value }
                        value={val?.TaxOn || val?.RateAD?.value}
                        // value={val?.RateAD?.value || (val?.TaxOn)}
                        option={[{ label: `${t("Rate AD")}`, value: "RateAD" }]}
                        isDisable={ind === bodyData?.length - 1 && isPoByPr}
                      />
                    </div>
                  ),

                  "Total GST%": val?.GSTGroup?.TotalGST
                    ? val?.GSTGroup?.TotalGST
                    : val?.TotalTaxPercent || "0",
                  // "Total GST%": val?.GSTGroup?.TotalGST ? val?.GSTGroup?.TotalGST : val?.TotalTaxPercent || "0",
                  "GST Amount": val.GSTAmount ? Number(val.GSTAmount).toFixed(2) : "0",
                  "Net Amount": Number(val.NetAmount).toFixed(2) || "0",
                  Budget: "",
                  Free: (
                    <div style={{ width: "50px" }}>
                      <CustomSelect
                        placeHolder={t("Free")}
                        name="Free"
                        onChange={(name, e) => {
                          handleCustomInput(ind, "Free", e);
                        }}
                        value={val?.Free?.value || val?.Free}
                        option={[
                          { label: "Yes", value: "Yes" },
                          { label: "No", value: "No" },
                        ]}
                        isDisable={ind === bodyData?.length - 1 && isPoByPr}
                      />
                    </div>
                  ),
                  specification: <div style={{ width: "150px" }}>
                    <Input
                      type="text"
                      className="table-input"
                      removeFormGroupClass={true}
                      name="Specification"
                      placeholder=""
                      value={val.Specification}
                      onChange={(e) =>
                        handleCustomInput(ind, "Specification", e.target.value)
                      }
                      disabled={ind === bodyData?.length - 1 && isPoByPr}
                    />
                  </div>,
                  Action: (
                    <i
                      className="fa fa-trash text-danger text-center p-2"
                      // onClick={() => {
                      //   if (index === values?.items?.length - 1 && isPoByGateEntry) {
                      //     return
                      //   } else {
                      //     handleRemoveItem(ind)

                      //   }

                      // }}
                      onClick={() => {
                        
                          handleRemoveItem(ind)


                      }}

                    />
                  )
                }))}
                tableHeight={"scrollView"}
              />
            </div>
          </div>
        </div>
      ) : null}

      <div className="patient_registration card">
        <div className="row mt-2 p-2">
          <Input
            type="text"
            className="form-control "
            lable={t("NetAmount")}
            placeholder=" "
            required={true}
            value={Number(netAmount).toFixed(2)}
            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
            name="netAmount"
            onChange={handleChange}
            disabled={true}
          />
          <Input
            type="text"
            className="form-control "
            id="roundOff"
            lable={t("Round Off")}
            placeholder=" "
            required={true}
            value={payload?.roundOff}
            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
            name="roundOff"
            onChange={handleChange}
            disabled={true}
          />
          <ReactSelect
            placeholderName={t("requisitionType")}
            searchable={true}
            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
            id={"requisitionType"}
            name={"requisitionType"}
            // requiredClassName={"required-fields"}
            removeIsClearable={true}
            handleChange={(name, e) => handleReactChange(name, e)}
            dynamicOptions={[
              { label: "Normal", value: "normal" },
              { label: "Urgent", value: "urgent" },
              { label: "Immediate", value: "immediate" },
              { label: "Amended", value: "amended" },
            ]}
            value={payload?.requisitionType?.value}
          />
          <DatePicker
            className="custom-calendar"
            placeholder=""
            lable={t("PO Date")}
            respclass={"col-xl-2 col-md-3 col-sm-6 col-12"}
            name="poDate"
            id="poDate"
            value={payload?.poDate ? moment(payload?.poDate).toDate() : ""}
            // value={payload?.deliveryDate}
            showTime
            maxDate={new Date()}
            hourFormat="12"
            handleChange={handleChange}
          />
          <DatePicker
            className="custom-calendar"
            placeholder=""
            lable={t("Valid Date")}
            respclass={"col-xl-2 col-md-3 col-sm-6 col-12"}
            name="validDate"
            id="validDate"
            value={
              payload?.validDate ? moment(payload?.validDate).toDate() : ""
            }
            // value={payload?.deliveryDate}
            showTime
            maxDate={new Date()}
            hourFormat="12"
            handleChange={handleChange}
          />
          <DatePicker
            className="custom-calendar"
            placeholder=""
            lable={t("Delivery Date")}
            respclass={"col-xl-2 col-md-3 col-sm-6 col-12"}
            name="deliveryDate"
            id="deliveryDate"
            value={
              payload?.deliveryDate
                ? moment(payload?.deliveryDate).toDate()
                : ""
            }
            // value={payload?.deliveryDate}
            showTime
            maxDate={new Date()}
            hourFormat="12"
            handleChange={handleChange}
          />
          <TextAreaInput
            type="text"
            name="subject"
            rows={2}
            value={payload?.subject}
            onChange={handleChange}
            lable={t("Subject")}
            placeholder=" "
            respclass=" col-sm-6 col-12"
            className="form-control "
          />
          <TextAreaInput
            type="text"
            name="remarks"
            rows={2}
            value={payload?.remarks}
            onChange={handleChange}
            lable={t("Remarks")}
            placeholder=" "
            respclass=" col-sm-6 col-12"
            className="form-control required-fields"
          />
          <div
            //  className="col-xl-2 col-md-4 col-sm-6  mb-2"
            className="ml-2"
          >
            <div className="">
              <BrowseButton
                label={t("Select File")}
                handleImageChange={handleImageChange}
              />
            </div>
          </div>
          <div className=" ">
            {isEdit ? (
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
                onClick={handleSavePurchase}
              >
                {t("Save")}
              </button>
            )}
          </div>{" "}
        </div>
      </div>
      <SearchPoDetails onEdit={handleChildEdit} dataLoading={dataLoading} setTermsConditionsUpdateList={setTermsConditionsUpdateList}

      />
      {modalData?.visible && (
        <Modal
          visible={modalData?.visible}
          setVisible={() => {
            setModalData({ visible: false });
          }}
          modalData={modalData?.URL}
          modalWidth={modalData?.width}
          Header={modalData?.label}
          buttonType="button"
          footer={modalData?.footer}
        >
          {modalData?.Component}
        </Modal>
      )}
    </div>
  );
};

export default CreatePurchaseOrder;
