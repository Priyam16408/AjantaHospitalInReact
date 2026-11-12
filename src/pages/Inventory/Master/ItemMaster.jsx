import React, { useState, useEffect } from "react";
import Input from "../../../components/formComponent/Input";
import Heading from "../../../components/UI/Heading";
import { exportToExcel } from "../../../utils/exportLibrary";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  BindManufactureData,
  ItemMasterBindGroup,
  BindVatType,
  BindVatLine,
  BindSaleVatType,
  BindSaleVatLine,
  BindDrugCategoryMaster,
  BindMajorUnit,
  BindMinorUnit,
  BindServiceItems,
  Bind_Active_salt,
  ManufactureReportList,
  SaveVendor,
  SearchVendor,
  VendorReportList,
  GetItemNameList,
  BindGST,
  SaveNewItem,
  BindSaltItem,
  ItemMasterBindDetail,
  BindUnitMaster,
  BindItemIdList,
  GenericDeleteitem,
} from "../../../networkServices/InventoryApi";
import Modal from "../../../components/modalComponent/Modal";
import { useLocalStorage } from "../../../utils/hooks/useLocalStorage";
import {
  handleReactSelectDropDownOptions,
  notify,
  reactSelectOptionList,
} from "../../../utils/utils";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import { setLoading } from "../../../store/reducers/loadingSlice/loadingSlice";
import store from "../../../store/store";
import { BindCategory } from "../../../networkServices/BillingsApi";
import Tables from "../../../components/UI/customTable";
import {
  Active_OPTION,
  EXPIRABLE_OPTION,
  GST_TYPE_OPTION,
  Is_Consignment_OPTION,
  Is_CSSD_OPTION,
  Is_Laundry_OPTION,
  MapGeneric_OPTION,
} from "../../../utils/constant";
import { PurchaseReport } from "../../../networkServices/Purchase";
import DrugCategoryMasterModal from "./DrugCategoryMasterModal";
import GenericDetailTable from "../../../components/UI/customTable/MedicalStore/GenericDetailTable";

const ItemMaster = () => {
  const localData = useLocalStorage("userData", "get");
  const [t] = useTranslation();
  const [unitMaster, setUnitMaster] = useState([]);
  //   const ip = useLocalStorage("ip", "get");
  const [tableData, setTableData] = useState([]);
  debugger
  const [listTableData, setListTableData] = useState([]);

  console.log("listTableData", listTableData)
  const [ReportVisible, setReportVisible] = useState(false);

  const initialPayload = {
    // Category: "",
    IsAsset: false,
    SubCategoryID: 0,
    SubcategoryName: "",
    SearchItemName: "",
    IsExpirable: "No",
    IsActive: "1",
    isCSSDItem: 0,
    isLaundry: 0,
    IsStent: 0,
    SearchbyData: { label: "Search by First Name", value: "FirstName" },
    TypeName: "",
    ItemCode: "",
    ItemCatalog: "",
    Description: "",
    HSNCode: "",
    ManuFacturer: "",
    ManufactureID: 0,
    SaltID: 0,
    rack: 0,
    shelf: 0,
    minlevel: 0,
    maxLevel: 0,
    reorderLevel: 0,
    reorderqty: 0,
    Dose: "",
    packing: "",
    ScheduleType: "",
    MajorUnit: "",
    MinorUnit: "",
    ConversionFactor: "",
    CommodityCode: "",
    GSTType: "",
    CGSTPercent: "",
    SGSTPercent: "",
    DrugCategory: 0,
    IsStockable: "1",
    ItemType: "",
    ItemGroup: "",
    TaxGroup: "",
    MapGeneric: "0",
    MapGenericList: "",
    CategoryID: 0,
    isAssetActive: false,
    Quantity: 0,
    ExtraSellingCharge: "",
    Pharmacy: "",
    PurchaseRate: "",
    TradeName: "",
    Commudity: "",
    MRP: "",
    isPRCreate: 0,
  };

  const initialItemSearchPayload = {
    Category: "",
    IsAsset: false,
    SubCategoryID: 0,
    SubcategoryName: "",
    SearchItemName: "",
    IsExpirable: "No",
    IsActive: "1",
    isCSSDItem: "0",
    isLaundry: "0",
    IsStent: "0",
    SearchbyData: "",
    TypeName: "",
    ItemCode: "",
    ItemCatalog: "",
    Description: "",
    HSNCode: "",
    ManuFacturer: "",
    ManufactureID: 0,
    SaltID: 0,
    rack: 0,
    shelf: 0,
    minlevel: 0,
    maxLevel: 0,
    reorderLevel: 0,
    reorderqty: 0,
    Dose: "",
    packing: "",
    ScheduleType: "",
    MajorUnit: "",
    MinorUnit: "",
    ConversionFactor: "",
    CommodityCode: "",
    GSTType: "",
    CGSTPercent: "",
    SGSTPercent: "",
    DrugCategory: 0,
    IsStockable: "1",
    ItemType: "",
    TaxGroup: "",
    MapGeneric: "0",
    MapGenericList: "",
    ItemGroup: "",
  };

  const [payload, setPayload] = useState({ ...initialPayload });

  const [apiData, setApiData] = useState({
    getCategoryData: [],
    getGroupsData: [],
    getForItemGroupsData: [],
    getManufactureData: [],
    getVatType: [],
    getVatLine: [],
    getSaleVatType: [],
    getSaleVatLine: [],
    getDrugCategoryMaster: [],
    getMajorUnit: [],
    getMinorUnit: [],
    getServiceItems: [],
    get_Active_salt: [],
    getGSTList: [],
    getTrandeName: [],
    getPharmacyType: [],
    getCommodity: []
  });

  // console.log("apiData", apiData);
  const [Category, setCategory] = useState("");
  const [SearchCategory, setSearchCategory] = useState("");
  // console.log("SearchCategory" , SearchCategory)
  const [SearchItemNameList, setSearchItemNameList] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [modalData, setModalData] = useState({ visible: false });
  const [ItemNameSearchpayload, setItemNameSearch] = useState({
    ...initialItemSearchPayload,
  });
  const getBindUnitMaster = async () => {
    try {
      const response = await BindUnitMaster();
      setUnitMaster(response?.data);
    } catch (error) {
      notify("Something Went's Wrong", "error");
    }
  };
  useEffect(() => {
    renderApiCalls();
    getBindUnitMaster();

    // fetchGST();
  }, []);

  const renderApiCalls = async () => {
    store.dispatch(setLoading(true));
    try {
      const [
        getCategoryData,
        // getGroupsData,
        getManufactureData,
        getVatType,
        getVatLine,
        getSaleVatType,
        getSaleVatLine,
        getDrugCategoryMaster,
        getMajorUnit,
        getMinorUnit,
        getServiceItems,
        get_Active_salt,
        getGSTList,
        getTrandeName,
        getPharmacyType,
        getCommodity
      ] = await Promise.all([
        await BindCategory(7),
        // await ItemMasterBindGroup(payload?.IsAsset,parseInt(payload?.Category?.value),payload?.Category?.label),
        await BindManufactureData(payload?.isAssetActive),
        await BindVatType(),
        await BindVatLine(),
        await BindSaleVatType(),
        await BindSaleVatLine(),
        await BindDrugCategoryMaster(),
        await BindMajorUnit(),
        await BindMinorUnit(),
        await BindServiceItems(),
        await Bind_Active_salt(),
        await BindGST(),
        await ItemMasterBindDetail(6),
        await ItemMasterBindDetail(7),
        await ItemMasterBindDetail(8),
      ]);

      const reponseData = {
        getCategoryData: handleReactSelectDropDownOptions(
          getCategoryData?.data,
          "name",
          "categoryID",
          "configID"
        ),

        // getGroupsData: reactSelectOptionList(
        //     getGroupsData?.data,
        //   "Name",
        //   "SubCategoryID"
        // ),
        getManufactureData: reactSelectOptionList(
          getManufactureData?.data,
          "Name",
          "ManufactureID"
        ),
        getVatType: reactSelectOptionList(getVatType?.data, "Id", "VatType"),
        getVatLine: reactSelectOptionList(getVatLine?.data, "Id", "VatLine"),
        getSaleVatType: reactSelectOptionList(
          getSaleVatType?.data,
          "Id",
          "VatType"
        ),
        getSaleVatLine: reactSelectOptionList(
          getSaleVatLine?.data,
          "Id",
          "VatLine"
        ),
        getDrugCategoryMaster: reactSelectOptionList(
          getDrugCategoryMaster?.data,
          "drugcategoryName",
          "id"
        ),
        getMajorUnit: reactSelectOptionList(
          getMajorUnit?.data,
          "UnitName",
          "UnitName"
        ),
        getMinorUnit: reactSelectOptionList(
          getMinorUnit?.data,
          "UnitName",
          "UnitName"
        ),
        getServiceItems: reactSelectOptionList(
          getServiceItems?.data,
          "ItemID",
          "TypeName"
        ),
        get_Active_salt: reactSelectOptionList(
          get_Active_salt?.data,
          "Name",
          "VALUE"
        ),
        getGSTList: handleReactSelectDropDownOptions(
          getGSTList?.data,
          "TaxGroupLabel",
          "TaxGroupLabel"
        ),
        getTrandeName: handleReactSelectDropDownOptions(
          getTrandeName?.data,
          "NAME",
          "ID"
        ),
        getPharmacyType: handleReactSelectDropDownOptions(
          getPharmacyType?.data,
          "NAME",
          "ID"
        ),
        getCommodity: handleReactSelectDropDownOptions(
          getCommodity?.data,
          "NAME",
          "ID"
        ),
      };

      setApiData(reponseData);
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    } finally {
      store.dispatch(setLoading(false));
    }
  };

  const handleReactSelect = async (name, value) => {


    setPayload((prevPayload) => {
      const updatedPayload = { ...prevPayload };

      // Update the payload with the selected value
      updatedPayload[name] = value.value;

      // Apply specific logic only when name is "IsStent"
      if (name === "IsStent") {
        // Reset related fields
        updatedPayload.isCSSDItem = 0;
        updatedPayload.isLaundry = 0;
        updatedPayload.IsStent = 0;

        // Set specific field based on value
        switch (value.value) {
          case "1": // Is Stent
            updatedPayload.IsStent = 1;
            break;
          case "2": // Is CSSD
            updatedPayload.isCSSDItem = 1;
            break;
          case "3": // Is Laundry
            updatedPayload.isLaundry = 1;
            break;
          default:
            break;
        }
      }

      // console.log("Updated Payload:", updatedPayload);
      return updatedPayload;
    });

    if (name === "Commudity" || name === "TradeName" || name === "Pharmacy") {

      setPayload((prevPayload) => {
        const updatedPayload = { ...prevPayload };

        // Update the payload with the selected value
        updatedPayload[name] = value.NAME;


        return updatedPayload;
      });
    }

    // Specific logic for "MapGenericList"
    if (name === "MapGenericList") {
      setPayload((val) => ({ ...val, ["SaltId"]: value }));
    }

    // Specific logic for "Category"
    if (name === "Category") {
      try {
        const dataState = await ItemMasterBindGroup(
          payload?.IsAsset || false,
          parseInt(value?.configID),
          value?.label
        );

        setApiData((prev) => ({
          ...prev,
          getGroupsData: reactSelectOptionList(
            dataState?.data,
            "Name",
            "SubCategoryID"
          ),
        }));
        setCategory(value.value);
      } catch (error) {
        console.log(error);
      }
    }

    // Specific logic for "ManufactureID"
    if (name === "ManufactureID") {
      setPayload((val) => ({ ...val, ["ManuFacturer"]: value.label }));
    }

    // Specific logic for "MapGeneric"
    if (name === "MapGeneric") {
      setPayload((val) => ({ ...val, ["MapGenericList"]: value }));
    }
  };

  console.log("payloadpayload", payload);

  // const handleReactSelect = (name, value) => {
  //   console.log("Name:", name, "Value:", value);

  //   // const selectedValue = value?.label || "";
  //   // console.log("Selected Value:", selectedValue);

  //   setPayload((prevPayload) => {
  //     const updatedPayload = { ...prevPayload };

  //     // Update the Category normally
  //     // updatedPayload[name] = selectedValue;

  //     // Apply specific logic only when name is "IsStent"
  //     if (name === "IsStent") {
  //       // Reset related fields
  //       updatedPayload.isCSSDItem = 0;
  //       updatedPayload.isLaundry = 0;
  //       updatedPayload.IsStent = 0;

  //       // Set specific field based on value
  //     //   switch (selectedValue) {
  //     //     case "1": // Is Stent
  //     //       updatedPayload.IsStent = 1;
  //     //       break;
  //     //     case "2": // Is CSSD
  //     //       updatedPayload.isCSSDItem = 1;
  //     //       break;
  //     //     case "3": // Is Laundry
  //     //       updatedPayload.isLaundry = 1;
  //     //       break;
  //     //     default:
  //     //       break;
  //     //   }
  //      }

  //     console.log("Updated Payload:", updatedPayload);
  //     return updatedPayload;
  //   });
  // };

  const handleItemNameSearch = async (name, value) => {
    setPayload((val) => ({ ...val, [name]: value.value }));
    // debugger;
    if (name == "Category") {
      try {
        const dataState = await ItemMasterBindGroup(
          payload?.IsAsset || false,
          parseInt(value?.configID),
          value?.label
        );

        setApiData((prev) => ({
          ...prev,
          getForItemGroupsData: reactSelectOptionList(
            dataState?.data,
            "Name",
            "SubCategoryID"
          ),
        }));
        // setApiData((prev) => ({
        //   ...prev,
        //   getGroupsData: [
        //     { label: "All", value: 0 },
        //     ...reactSelectOptionList(dataState?.data, "Name", "SubCategoryID"),
        //   ],
        // }));
        setSearchCategory(value.value);
      } catch (error) {
        console.log(error);
      }
    }
    if (name != "Category") {
      setItemNameSearch((val) => ({ ...val, [name]: value.value }));
    }
  };

  const handleChange = async (e) => {
    const { name, value, type, checked } = e.target;
    setPayload({ ...payload, [name]: type === "checkbox" ? checked : value });
    if (name == "isAssetActive") {
      const response = await BindManufactureData(checked);
      setApiData((prev) => ({
        ...prev,
        getManufactureData: reactSelectOptionList(
          response?.data,
          "Name",
          "ManufactureID"
        ),
      }));
    }
  };

  // console.log("Payload after ", payload);

  const handleItemNameChange = (e) => {
    const { name, value, type, checked } = e.target;
    // console.log("Name" , name , "Value" , value)
    setPayload({ ...payload, [name]: type === "checkbox" ? checked : value });
    setItemNameSearch({
      ...ItemNameSearchpayload,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleGSTChange = async (name, value) => {
    setPayload((prevPayload) => ({
      ...prevPayload,
      GSTType: value.value, // Update GSTType
      CGSTPercent: value.CGSTPer || 0,
      SGSTPercent: value.SGSTPer || 0,
      IGSTPercent: value.IGSTPer || 0,
      TaxGroup: value.TaxGroup || "",
    }));
  };

  const handleSearch = async () => {
    try {
      if (parseInt(SearchCategory || 0) == 0) {
        return notify("Please select Category", "error");
      }
      if (ItemNameSearchpayload?.SearchItemName == "") {
        return notify("Please enter Search By Name/Code", "error");
      }
      if (!ItemNameSearchpayload?.SearchbyData) {
        return notify("Please select Search Type", "error");
      }
      const payload1 = {
        SearchName: ItemNameSearchpayload?.SearchItemName,
        Type: ItemNameSearchpayload?.SearchbyData,
        CategoryID: parseInt(SearchCategory || 0),
        SubCategoryID: parseInt(ItemNameSearchpayload?.SubCategoryID || 0),
      };
      const response = await GetItemNameList(payload1);
      // console.log("GetItemNameList", response);
      if (response.success && response.data.length > 0) {
        setSearchItemNameList(response.data);
      } else {
        notify(response.message, "error");
      }
      //   }
    } catch (error) {
      notify("Something Went's Wrong", "error");
    }
  };

  const ExceldataFormatter = (tableData) => {
    const HardCopy = JSON.parse(JSON.stringify(tableData));
    // debugger;
    const modifiedResponseData = HardCopy?.map((ele, index) => {
      // delete ele?.TypeID;
      // delete ele?.TypeName;
      // delete ele?.DetailID;
      // delete ele?.ColorCode;

      return { ...ele };
    });

    return modifiedResponseData;
  };

  const handleReport = async (ele) => {
    const CategroyId = payload?.Category;
    const SearchTyep = payload?.SearchItemName;
    const SubCategoryID = payload?.SubCategoryID;
    const UserValidateID = localData?.userValidateID;
    try {
      const response = await PurchaseReport({
        CategoryID: CategroyId,
        SearchTyep: SearchTyep,
        SubCategoryID: SubCategoryID,
        UserValidateID: UserValidateID,
      });
      if (response.success) {
        setTableData(response.data);
        exportToExcel(ExceldataFormatter(tableData), "Item Msater Report");
      }
    } catch (error) {
      console.log("Error", error);
    }
  };

  // const ExceldataFormatter = (DataList) => {
  //   const HardCopy = JSON.parse(JSON.stringify(DataList));

  //   return HardCopy?.map((ele) => {
  //     return { ...ele };
  //   });
  // };

  const thead = [
    { name: t("Select"), width: "3%" },
    t("ItemName"),
    t("HSNCode"),
    t("ManuFacturer"),
    t("Creater Name"),
    t("Created Date"),
    t("Description"),
    t("IsActive"),
    t("Purchase Unit"),
    t("Sale Unit"),
    t("Issue Factor"),
    t("SubcategoryName"),
    t("CommodityCode"),
  ];

  const handleCancle = () => {
    setSelectedIndex(null);
    setCategory("");
    setPayload({ ...initialPayload });
    setListTableData([])
  };

  const resetForm = () => {
    setPayload({ ...initialPayload });
    setCategory("");
    setSelectedIndex(null);
  };

  const getSelectedValue = (payload) => {
    if (payload?.isCSSDItem === 1) return "2";
    if (payload?.isLaundry === 1) return "3";
    if (payload?.IsStent === 1) return "1";
    return "";
  };
  const theadgenric = [
    { name: t("S.No"), width: "3%" },
    t("Generic Name"),
    { name: t("Strength"), width: "1" },
    { name: t("Unit"), width: "1" },
    t("Delete"),
  ];
  const handleRemove = async (index, item) => {
    debugger
    const filterData = listTableData?.filter((val) => val?.saltname !== item?.saltname)
    setListTableData(filterData)
    console.log("filterData", filterData)
    //   console.log(index), console.log(item);
    //   const itemId = item?.ItemID;
    //   const saltid = item?.ID;
    //   try {
    //     const response = await GenericDeleteitem(itemId, saltid);

    //     if (response?.success) {
    //       notify(response?.message, "success");
    //       setTableData((prevTableData) =>
    //         prevTableData.filter((_, i) => i !== index)
    //       );
    //     } else {
    //       notify(response?.message, "error");
    //     }
    //   } catch (error) {
    //     notify("Something Went's Wrong", "error");
    //   }
    // };
    // const bindList=async(val)=>{

    //   try {
    //      const tabresponse = await BindItemIdList(val);
    //     if (tabresponse?.success) {

    //       setListTableData(tabresponse?.data);

    //     }
    //   } catch (error) {
    //     console.log("error",error)
    //   }
  }
  const bindList = async (val) => {
    debugger
    try {
      const tabresponse = await BindItemIdList(val);
      if (tabresponse?.success) {

        setListTableData(tabresponse?.data);
// setListTableData((preV)=>({
//   ...preV,
// SaltID:tabresponse?.data?.SaltID
// }))
      }
    } catch (error) {
      console.log("error", error)
    }
  }
  const handleAddItem = () => {
    if (!payload?.SaltId?.value) {
      notify("Please Select Map Generic List", "warn")
      return
    }
    if (!payload?.Quantity) {
      notify("Please Fill Strength", "warn")
      return
    }
    if (!payload?.Unit) {
      notify("Please Select Unit", "warn")
      return
    }
    const newItem = {
      saltname: payload?.SaltId?.label,
      SaltID: payload?.SaltId?.value,
      Strength: payload?.Quantity,
      Unit: payload?.Unit,
    };

    setListTableData((prev) => [...prev, newItem]);
    setPayload((preV)=>({
      ...preV,
     Quantity:""
    }))
  };

  //     const handleAddItem=()=>{
  //       let newItem=[]
  //       setListTableData((preV)=>({
  // ...preV,
  // saltname:payload?.SaltId?.label,
  // Strength:payload?.Quantity,
  // Unit:payload?.Unit,

  //       }))
  //       // const item={}
  //     }
  console.log("first listTableData", listTableData)

  const handleSaveItemMaster = async () => {
    // debugger;
    try {
      // Validation checks
      if (payload.TypeName == "") {
        return notify("Please enter Item Name", "error");
      }
      if (
        payload.ConversionFactor == "" ||
        parseInt(payload.ConversionFactor) == 0
      ) {
        return notify("Please enter Issue Factor", "error");
      }
      if (payload.GSTType == "") {
        return notify("Please select GST Tax Type", "error");
      }
      if (payload.MajorUnit == "") {
        return notify("Please enter Purchase Unit", "error");
      }
      if (payload.MinorUnit == "") {
        return notify("Please enter Sale Unit", "error");
      }
      if (payload.ManufactureID == "" || parseInt(payload.ManufactureID) == 0) {
        return notify("Please select Manufacturer", "error");
      }
      if (payload.SubCategoryID == "" || parseInt(payload.SubCategoryID) == 0) {
        return notify("Please select Groups", "error");
      }
      // if (payload?.MapGeneric == "1" && payload?.Quantity == 0) {
      //   return notify("Please enter Strength", "error");
      // }
      if (!payload?.ExtraSellingCharge || payload?.ExtraSellingCharge === "") {
        return notify("Please enter ExtraSellingCharge", "error");
      }

      // Ensure `saltID` is always a numeric value
      const saltIDValue =
        payload?.MapGenericList?.value !== undefined
          ? parseInt(payload.MapGenericList.value) // Extract numeric value from the object
          : parseInt(payload?.MapGenericList || 0); // Fallback to 0 if undefined or invalid

      const newItemSavepayload = {
        isEffectingInventory: false,
        isExpirable:
          payload?.IsExpirable == "Yes" || payload?.IsExpirable == "1"
            ? true
            : false,
        isTrigger: true,
        isActive:
          payload?.IsActive == "1" || payload?.IsActive == "Yes" ? true : false,
        startTime: "",
        endTime: "",
        bufferTime: "",
        itemName: payload?.Description,
        itemType: payload?.ItemType || "",
        itemTypeName: payload?.ItemType || "",
        serviceItemsId: 0,
        serviceItemsName: "",
        isService: true,
        gstType: payload?.GSTType,
        igstPercent: parseFloat(payload?.IGSTPercent),
        cgstPercent: parseFloat(payload?.CGSTPercent),
        sgstPercent: parseFloat(payload?.SGSTPercent),
        hsNcode: payload?.HSNCode,
        isAsset: payload?.IsAsset || false,
        isCSSD: payload?.isCSSDItem,
        isLaundry: payload?.isLaundry,
        IsStent: payload?.IsStent,
        saveType:
          isNaN(parseFloat(payload?.ItemID)) || payload?.ItemID === ""
            ? ""
            : "Update",
        majorUnit: payload?.MajorUnit,
        majorUnitId: 0,
        ItemID:
          isNaN(parseInt(payload?.ItemID)) || payload?.ItemID === ""
            ? 0
            : parseInt(payload?.ItemID),
        description: payload?.Description,
        pulse: "",
        billingUnit: payload?.MajorUnit,
        subcategoryID: payload?.SubCategoryID || 0,
        SubcategoryName: payload?.SubcategoryName || "",
        typeName: payload?.TypeName || "",
        ItemName: payload?.TypeName || "",
        rack: payload?.rack || "",
        shelf: payload?.shelf || "",
        maxLevel: isNaN(parseInt(payload?.maxLevel))
          ? 0
          : parseInt(payload?.maxLevel),
        minLevel: isNaN(parseInt(payload?.minlevel))
          ? 0
          : parseInt(payload?.minlevel),
        reorderLevel: isNaN(parseInt(payload?.reorderLevel))
          ? 0
          : parseInt(payload?.reorderLevel),
        reorderQty: isNaN(parseInt(payload?.reorderqty))
          ? 0
          : parseInt(payload?.reorderqty),
        maxReorderQty: 0,
        minReorderQty: 0,
        packing: payload?.packing,
        manufactureID: payload?.ManufactureID,
        itemForDept: "",
        serviceItemId: "",
        toBeBilled: 0,
        isUsable: "",
        serviceName: "",
        usrID: "",
        saleTaxPer: 0,
        itemCode: payload?.ItemCode,
        itemCatalog: payload?.ItemCatalog,
        minorUnit: payload?.MinorUnit,
        minorUnitId: 0,
        cFactor: parseInt(payload?.ConversionFactor),
        ScheduleType:
          payload?.ScheduleType == "1"
            ? "H1-Schedule Type"
            : payload?.ScheduleType == "2"
              ? "H2-Schedule Type"
              : "",
        isPRCreate: payload?.isPRCreate,
        deptLedgerNo: "",
        commodityCode: payload?.CommodityCode,
        Dose: payload?.Dose || "",
        medicineType: "",
        route: "",
        isGenericExist: payload?.MapGeneric == "1" ? "Yes" : "No",
        saltID: saltIDValue, // Use the numeric value here
        strength: payload?.MapGeneric == "1" ? "0" : 0,
        // strength: payload?.MapGeneric == "1" ? payload?.Quantity : 0,
        hsnCode: payload?.HSNCode,
        igst: parseFloat(payload?.IGSTPercent),
        sgst: parseFloat(payload?.SGSTPercent),
        cgst: parseFloat(payload?.CGSTPercent),
        manufactureName: payload?.ManuFacturer,
        isOnSellingPrice: 0,
        sellingMargin: 0,
        drugCategoryMasterID: isNaN(parseInt(payload?.DrugCategory))
          ? 0
          : parseInt(payload?.DrugCategory),
        isStockAble:
          payload?.IsStockable == "1" || payload?.IsStockable == "Yes" ? 1 : 0,
        vatType: "",
        vatLine: "",
        saleVatType: "",
        saleVatLine: "",
        saleVat: "",
        Usabletype: "",
        MapGeneric: payload?.MapGeneric || "0",

        // MapGenericList: payload?.MapGenericList?.value,

        isAsset: payload?.IsAsset || false,

        extraSellingCharge: Number(payload?.ExtraSellingCharge) || 0,
        pharmacy: payload?.Pharmacy,
        purchaseRate: Number(payload?.PurchaseRate) || 0,
        commidity: payload?.Commudity,
        tradeName: payload?.TradeName,
        mrp: Number(payload?.MRP) || 0,
        genericitemlist: listTableData?.map((val) => ({
          // "saltID": val?.saltname,
          "saltID": val?.SaltID,
          "strength": val?.Strength,
          "minorUnit": val?.Unit
        }))
      };

      // Update payload state if needed
      // console.log("newItemSavepayload" , newItemSavepayload)
      // debugger
      setPayload((prevPayload) => ({
        ...prevPayload,
        MapGeneric: newItemSavepayload.MapGeneric,
        MapGenericList:
          newItemSavepayload.MapGenericList === undefined
            ? "0"
            : newItemSavepayload.MapGenericList,
      }));
      setListTableData([])
      // Save or update the item
      const response = await SaveNewItem(newItemSavepayload);
      if (response?.success) {
        notify(response?.message, "success");
        setPayload({ ...initialPayload });
        setCategory("");
        setItemNameSearch({ ...initialItemSearchPayload }); // 🔹 Clears SearchItemName
        setSearchItemNameList([]); // Clears search results
        setSelectedIndex(null);
        //
        //
        resetForm();
      } else {
        notify(response?.message, "error");
      }
    } catch (error) {
      console.error("Something went wrong", error);
      notify("An unexpected error occurred. Please try again later.", "error");
    }
  };

  const handleItemChange = (index, ele) => {
    console.log("Ele", ele);

    setCategory(ele?.CategoryID ?? "");

    setSelectedIndex(index);
    EditItems(ele);
  };

  const EditItems = async (ele) => {
    
    setPayload((initialPayload) => ({
      ...initialPayload,
      isPRCreate: ele?.IsPRCreate,
    }));
    bindList(ele.ItemID);
    try {
      const data = await BindSaltItem(ele?.ItemID);
      const saltID = apiData.get_Active_salt.find(
        (item) => String(item?.value) === String(data?.data?.saltID)
      );

      if (saltID) {
        setPayload((prev) => ({
          ...prev,
          MapGenericList: saltID?.value,
          MapGeneric: "1",
          // Quantity: parseFloat(data?.data?.Quantity),
        }));
      }
      console.log("Full ele object:", ele);

      // getSelectedValue(payload)

      // setApiData((prev) => ({
      //   ...prev,
      //   get_Active_salt: reactSelectOptionList(
      //     apiData.get_Active_salt,
      //     "saltName",
      //     "saltID"
      //   ),
      // }));

      const configID = apiData.getCategoryData.find(
        (item) => item?.value === String(ele?.CategoryID)
      )?.configID;

      const label = apiData.getCategoryData.find(
        (item) => item?.value === String(ele?.CategoryID)
      )?.label;

      const dataset = await ItemMasterBindGroup(
        ele?.IsAsset || false,
        configID,
        label
      );

      setApiData((prev) => ({
        ...prev,
        getGroupsData: reactSelectOptionList(
          dataset?.data,
          "Name",
          "SubCategoryID"
        ),
      }));

      // setApiData((prev) => ({
      //   ...prev,
      //   get_Active_salt: reactSelectOptionList(
      //     apiData.get_Active_salt,
      //     "saltName",
      //     "saltID"
      //   ),
      // }));

      if (data?.length > 0) {
        ele.MapGeneric = "1";
        ele.MapGenericList = saltID;
      }
    } catch (error) {
      console.error("Error in EditItems:", error);
    }
    setPayload((prev) => ({ ...prev, ...ele }));
    // setPayload((prev) => ({ ...prev, ...ele , isPRCreate: ele?.isPRCreate || 0,
    // }));
  };

  const handleOpenIndent = async ({
    label,
    width,
    type,

    buttonName,
    data,
  }) => {
    setModalData({
      visible: true,
      width: width,
      label: label,
      buttonName: buttonName,
      footer: <></>,

      Component: (
        <DrugCategoryMasterModal
        // payload2={data}
        // dataoption={DropDownState.BindVendorData}
        // setModalData={setModalData}
        // handeAdd={handeAdd}
        />
      ),
    });
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    console.log("Name", name, "Checked", checked);
    setPayload((prev) => ({
      ...prev,
      [name]: checked ? 1 : 0,
    }));
  };

  return (
    <>
      {modalData?.visible && (
        <Modal
          visible={modalData?.visible}
          setVisible={() => {
            setModalData({ visible: false });
          }}
          modalData={modalData?.modalData}
          modalWidth={modalData?.width}
          Header={modalData?.label}
          buttonType="button"
          buttonName={modalData?.buttonName}
          footer={modalData?.footer}
          handleAPI={modalData?.CallAPI}
        >
          {modalData?.Component}
        </Modal>
      )}

      <div className="card">
        <Heading isBreadcrumb={true} />
        <div className="row p-2">
          <ReactSelect
            placeholderName={t("Category")}
            id={"Category"}
            searchable={true}
            removeIsClearable={true}
            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
            dynamicOptions={apiData.getCategoryData}
            name="Category"
            handleChange={handleReactSelect}
            value={Category}
            requiredClassName="required-fields"
          />

          <ReactSelect
            placeholderName={t("SubCategory")}
            id={"SubCategoryID"}
            searchable={true}
            removeIsClearable={true}
            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
            dynamicOptions={apiData.getGroupsData}
            name="SubCategoryID"
            handleChange={handleReactSelect}
            value={payload?.SubCategoryID}
            requiredClassName="required-fields"
          />
          <Input
            type="text"
            className="form-control required-fields"
            id="TypeName"
            name="TypeName"
            onChange={handleChange}
            value={payload.TypeName}
            lable={t("ItemName")}
            placeholder=" "
            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
          />
          <Input
            type="text"
            className="form-control"
            id="ItemCode "
            name="ItemCode"
            onChange={handleChange}
            value={payload.ItemCode}
            lable={t("Item Code")}
            placeholder=" "
            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
          />
          <Input
            type="text"
            className="form-control"
            id="ItemCatalog "
            name="ItemCatalog"
            onChange={handleChange}
            value={payload.ItemCatalog}
            lable={t(t("Item Catalog No"))}
            placeholder=" "
            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
          />
          <Input
            type="text"
            className="form-control"
            id="Description "
            name="Description"
            onChange={handleChange}
            value={payload.Description}
            lable={t("Description")}
            placeholder=" "
            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
          />
          <Input
            type="text"
            className="form-control"
            id="HSNCode "
            name="HSNCode"
            onChange={handleChange}
            value={payload.HSNCode}
            lable={t("Item HSN Code")}
            placeholder=" "
            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
          />
          {/* Item Name group */}

          {/* ManuFacturer */}
          <ReactSelect
            placeholderName={t("ManuFacturer")}
            id={"ManufactureID"}
            searchable={true}
            removeIsClearable={true}
            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
            dynamicOptions={apiData.getManufactureData}
            name="ManufactureID"
            handleChange={handleReactSelect}
            value={payload?.ManufactureID}
            requiredClassName="required-fields"
          />

          <Input
            type="text"
            className="form-control"
            id="rack "
            name="rack"
            onChange={handleChange}
            value={payload.rack || ""}
            lable={t("Rack")}
            placeholder=" "
            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
          />
          <Input
            type="text"
            className="form-control"
            id="shelf"
            name="shelf"
            onChange={handleChange}
            value={payload.shelf || ""}
            lable={t("Shelf")}
            placeholder=" "
            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
          />
          <Input
            type="number"
            className="form-control"
            id="minlevel"
            name="minlevel"
            onChange={handleChange}
            value={payload.minlevel || ""}
            lable={t("MinLevel")}
            placeholder=" "
            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
          />

          <Input
            type="number"
            className="form-control"
            id="maxLevel"
            name="maxLevel"
            onChange={handleChange}
            value={payload.maxLevel || ""}
            lable={t("MaxLevel")}
            placeholder=" "
            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
          />
          <Input
            type="number"
            className="form-control"
            id="reorderLevel"
            name="reorderLevel"
            onChange={handleChange}
            value={payload.reorderLevel || ""}
            lable={t("ReorderLevel")}
            placeholder=" "
            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
          />
          <Input
            type="number"
            className="form-control"
            id="reorderqty"
            name="reorderqty"
            onChange={handleChange}
            value={payload.reorderqty || ""}
            lable={t("ReorderQty")}
            placeholder=" "
            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
          />
          <Input
            type="text"
            className="form-control"
            id="Dose"
            name="Dose"
            onChange={handleChange}
            value={payload.Dose}
            lable={t("Dose")}
            placeholder=" "
            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
          />
          <Input
            type="text"
            className="form-control"
            id="packing"
            name="packing"
            onChange={handleChange}
            value={payload.packing}
            lable={t("Packing")}
            placeholder=" "
            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
          />
          <ReactSelect
            placeholderName={t("Dangerous Drug")}
            id={"ScheduleType"}
            searchable={true}
            removeIsClearable={true}
            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
            dynamicOptions={[
              { label: "Select", value: "0" },
              { label: "H1-Schedule Type", value: "1" },
              { label: "H2-Schedule Type", value: "2" },
            ]}
            name="ScheduleType"
            handleChange={handleReactSelect}
            value={payload?.ScheduleType}
          // requiredClassName="required-fields"
          />
          <ReactSelect
            placeholderName={t("Purchase Unit")}
            id={"MajorUnit"}
            searchable={true}
            removeIsClearable={true}
            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
            dynamicOptions={apiData.getMajorUnit}
            name="MajorUnit"
            handleChange={handleReactSelect}
            value={payload?.MajorUnit}
            requiredClassName="required-fields"
          />
          <ReactSelect
            placeholderName={t("Sale Unit")}
            id={"MinorUnit"}
            searchable={true}
            removeIsClearable={true}
            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
            dynamicOptions={apiData.getMinorUnit}
            name="MinorUnit"
            handleChange={handleReactSelect}
            value={payload?.MinorUnit}
            requiredClassName="required-fields"
          />
          <Input
            type="number"
            className="form-control required-fields"
            id="ConversionFactor"
            name="ConversionFactor"
            onChange={handleChange}
            value={payload.ConversionFactor}
            lable={t("Issue Factor")}
            placeholder=" "
            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
          />
          <Input
            type="text"
            className="form-control"
            id="CommodityCode"
            name="CommodityCode"
            onChange={handleChange}
            value={payload.CommodityCode}
            lable={t("CommodityCode")}
            placeholder=" "
            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
          />

          <ReactSelect
            placeholderName={t("GST Type")}
            id={"GSTType"}
            searchable={true}
            removeIsClearable={true}
            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
            dynamicOptions={GST_TYPE_OPTION}
            handleChange={handleGSTChange}
            // handleChange={(val, e) => handleGSTChange(val, e)}

            value={payload?.GSTType}
            requiredClassName="required-fields"
          />

          {false && (
            <>
              {payload.TaxGroup !== "IGST" && (
                <>
                  <Input
                    type="text"
                    className="form-control"
                    id="CGSTPercent"
                    name="CGSTPercent"
                    // onChange={handleChange}
                    value={payload.CGSTPercent || 0}
                    lable={t("CGST Tax Per")}
                    placeholder=" "
                    respclass="col-xl-2 col-md-3 col-sm-6 col-12"
                    disabled={true}
                  />
                  <Input
                    type="text"
                    className="form-control"
                    id="SGSTPercent"
                    name="SGSTPercent"
                    // onChange={handleChange}
                    value={payload.SGSTPercent || 0}
                    lable={t("SGST Tax Per")}
                    placeholder=" "
                    respclass="col-xl-2 col-md-3 col-sm-6 col-12"
                    disabled={true}
                  />
                </>
              )}

              {payload.TaxGroup === "IGST" && (
                <Input
                  type="text"
                  className="form-control"
                  id="IGSTPercent"
                  name="IGSTPercent"
                  // onChange={handleChange}
                  value={payload.IGSTPercent || 0}
                  lable={t("IGST Tax Per")}
                  placeholder=" "
                  respclass="col-xl-2 col-md-3 col-sm-6 col-12"
                  disabled={true}
                />
              )}
            </>
          )}
          <ReactSelect
            placeholderName={t("Drug Category")}
            id={"DrugCategory"}
            searchable={true}
            removeIsClearable={true}
            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
            dynamicOptions={apiData.getDrugCategoryMaster}
            name="DrugCategory"
            handleChange={handleReactSelect}
            value={payload?.DrugCategory}
          // requiredClassName="required-fields"
          />
          <ReactSelect
            placeholderName={t("Stock Type")}
            id={"IsStockable"}
            searchable={true}
            removeIsClearable={true}
            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
            dynamicOptions={[
              { label: "Stockable", value: "1" },
              { label: "Non-Stockable", value: "0" },
              // { label: "H2-Schedule Type", value: "2" },
            ]}
            name="IsStockable"
            handleChange={handleReactSelect}
            value={payload?.IsStockable}
          // requiredClassName="required-fields"
          />
          <ReactSelect
            placeholderName={t("ItemType")}
            id={"ItemType"}
            searchable={true}
            removeIsClearable={true}
            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
            dynamicOptions={[
              { label: "Select", value: "" },
              { label: "Vital", value: "Vital" },
              { label: "Essential", value: "Essential" },
              { label: "Deseriable", value: "Deseriable" },
            ]}
            name="ItemType"
            handleChange={handleReactSelect}
            value={payload?.ItemType}
          // requiredClassName="required-fields"
          />

          {/* <Input
            type="number"
            className="form-control"
            id="ConversionFactor"
            name="ConversionFactor"
            onChange={handleChange}
            value={payload.ConversionFactor}
            lable={t("Issue Factor")}
            placeholder=" "
            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
          /> */}
          <ReactSelect
            placeholderName={t("Expirable")}
            id={"IsExpirable"}
            searchable={true}
            removeIsClearable={true}
            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
            dynamicOptions={EXPIRABLE_OPTION}
            name="IsExpirable"
            handleChange={handleReactSelect}
            value={payload?.IsExpirable}
          // requiredClassName="required-fields"
          />
          <ReactSelect
            placeholderName={t("Active")}
            id={"IsActive"}
            searchable={true}
            removeIsClearable={true}
            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
            dynamicOptions={Active_OPTION}
            name="IsActive"
            handleChange={handleReactSelect}
            value={payload?.IsActive}
          // requiredClassName="required-fields"
          />

          <ReactSelect
            placeholderName={t("ItemGroup")}
            id="IsStent"
            searchable={true}
            removeIsClearable={true}
            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
            dynamicOptions={Is_Consignment_OPTION}
            name="IsStent"
            handleChange={handleReactSelect}
            value={getSelectedValue(payload)}
          />
          {/* <ReactSelect
            placeholderName={"Is CSSD"}
            id={"isCSSDItem"}
            searchable={true}
            removeIsClearable={true}
            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
            dynamicOptions={Is_CSSD_OPTION}
            name="isCSSDItem"
            handleChange={handleReactSelect}
            value={payload?.isCSSDItem}
            isDisabled
          // requiredClassName="required-fields"
          />
          <ReactSelect
            placeholderName={"Is Laundry"}
            id={"isLaundry"}
            searchable={true}
            removeIsClearable={true}
            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
            dynamicOptions={Is_Laundry_OPTION}
            name="isLaundry"
            handleChange={handleReactSelect}
            value={payload?.isLaundry}
            isDisabled
          // requiredClassName="required-fields"
          /> */}
          <ReactSelect
            placeholderName={t("Map Generic")}
            id={"MapGeneric"}
            searchable={true}
            removeIsClearable={true}
            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
            dynamicOptions={MapGeneric_OPTION}
            name="MapGeneric"
            handleChange={handleReactSelect}
            value={payload?.MapGeneric}
          // isDisabled
          // requiredClassName="required-fields"
          />

          <Input
            type="number"
            className="form-control required-fields"
            id="ExtraSellingCharge"
            name="ExtraSellingCharge"
            onChange={handleChange}
            value={payload.ExtraSellingCharge}
            lable={t("Extra Selling Charge(%)")}
            placeholder=" "
            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
          />

          <ReactSelect
            placeholderName={t("Pharmacy")}
            id={"Pharmacy"}
            searchable={true}
            removeIsClearable={true}
            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
            dynamicOptions={apiData?.getPharmacyType}
            name="Pharmacy"
            handleChange={handleReactSelect}
            value={payload?.Pharmacy}
          />

          <Input
            type="number"
            className="form-control"
            id="PurchaseRate"
            name="PurchaseRate"
            onChange={handleChange}
            value={payload.PurchaseRate}
            lable={t("Purchase Rate")}
            placeholder=""
            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
          />
          <ReactSelect
            placeholderName={t("Trade Name")}
            id={"TradeName"}
            searchable={true}
            removeIsClearable={true}
            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
            dynamicOptions={apiData?.getTrandeName}
            name="TradeName"
            handleChange={handleReactSelect}
            value={payload?.TradeName}
          />

          <ReactSelect
            placeholderName={t("Commudity")}
            id={"Commudity"}
            searchable={true}
            removeIsClearable={true}
            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
            dynamicOptions={apiData?.getCommodity}
            name="Commudity"
            handleChange={handleReactSelect}
            value={payload?.Commudity}
          />

          <Input
            type="number"
            className="form-control"
            id="MRP"
            name="MRP"
            onChange={handleChange}
            value={payload?.MRP}
            lable={t("MRP")}
            placeholder=" "
            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
          />
          {
            console.log("payload", payload)
          }
          {payload?.MapGeneric == "1" && (
            <>
              <ReactSelect
                placeholderName={t("Map Generic List")}
                id={"MapGenericList"}
                searchable={true}
                removeIsClearable={true}
                respclass="col-xl-2 col-md-3 col-sm-6 col-12"
                dynamicOptions={apiData.get_Active_salt}
                name="MapGenericList"
                handleChange={handleReactSelect}
                value={payload?.MapGenericList}
              // isDisabled
              // requiredClassName="required-fields"
              />
              <Input
                type="number"
                className={` form-control required-fields-active}`}
                id="Quantity "
                name="Quantity"
                onChange={handleChange}
                value={payload?.Quantity}
                lable={t("Strength")}
                placeholder=" "
                respclass="col-xl-2 col-md-3 col-sm-6 col-12"
              // respclass="d-flex col-xl-2 col-md-4 col-sm-6 col-12"
              //  className="d-flex col-xl-2 col-md-4 col-sm-6 col-12"
              />

              <ReactSelect
                placeholderName={t("Unit")}
                id={"Unit"}
                searchable={true}
                respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                name={"Unit"}
                dynamicOptions={unitMaster?.map((ele) => ({
                  label: ele?.UnitName,
                  value: ele?.UnitName,
                }))}
                value={payload?.Unit}
                handleChange={handleReactSelect}
              />
              {/* <div> */}
              <button
                className="btn btn-sm btn-primary"

                onClick={handleAddItem}
                // disabled={isDisableInputs}
                type="button"
              >
                <i className="fa fa-plus-circle fa-sm new_record_pluse "></i>
              </button>
              {/* </div>   */}
            </>
          )}

          {Category === "8" ? (
            <div className="form-check d-flex align-items-center me-3">
              <input
                type="checkbox"
                className="form-check-input me-2"
                name="isAssetActive"
                id="isAssetActive"
                onChange={handleChange}
                checked={payload?.isAssetActive}
              />
              <label
                className="form-check-label mx-2"
                style={{ fontWeight: "bold" }}
                htmlFor="isAssetActive"
              >
                {t("IsAsset")}
              </label>
            </div>
          ) : (
            ""
          )}

          {/* -------------------------------------------------------------------------------------------------------- */}

          {/* {payload?.ScheduleType === "1" ? (
            <div className="form-check d-flex align-items-center me-3">
              <input
                type="checkbox"
                className="form-check-input me-2"
                name="dangerPO"
                id="dangerPO"
                onChange={handleChangeIsdangerPO}
                checked={payload?.dangerPO}
              />
              <label
                className="form-check-label mx-2"
                style={{ fontWeight: "bold" }}
                htmlFor="dangerPO"
              >
                {t("Danger PO")}
              </label>
            </div>

          ) : (
            ""  
          )} */}
          {console.log("payload?.isPRCreate", payload?.isPRCreate)}
          {payload?.ScheduleType && (
            <div className="form-check d-flex align-items-center me-3 mb-2">
              <input
                type="checkbox"
                className="form-check-input me-2"
                name="isPRCreate"
                id="isPRCreate"
                onChange={handleCheckboxChange}
                checked={payload?.isPRCreate === 1}
              />
              <label
                className="form-check-label mx-2"
                style={{ fontWeight: "bold" }}
                htmlFor="isPRCreate"
              >
                {t("Create Danger PO")}
              </label>
            </div>
          )}
          {/* 
          <div
            className={
              parseInt(Category || 0) == 0
                ? "d-none"
                : "col-sm-1 d-flex justify-content-between"
            }
          >
            <button
              className="btn btn-sm btn-success mx-1"
              onClick={handleSaveItemMaster}
            >
              {isNaN(Number(payload.ItemID)) || payload.ItemID === ""
                ? `${t("Save")}`
                : Number(payload.ItemID) === 0
                  ? `${t("Save")}`
                  : `${t("Update")}`}
            </button>

          
            <button
              className="btn btn-sm btn-success mx-1"
              // onClick={() => handleCancle()}
              onClick={handleCancle}
            >
              {t("Cancel")}
            </button>
          </div> */}

        </div>
        {listTableData?.length > 0 && <div className="card">
          <Heading title={t("Generic List")} />


          <Tables
            thead={theadgenric}
            // tbody={listTableData}
            tbody={listTableData?.map((ele, index) => ({
              index: index + 1,
              saltname: ele?.saltname,
              Strength: ele?.Strength,
              unit: ele?.Unit,
              Remove: (
                <i
                  onClick={() => handleRemove(index, ele)}
                  className="fa fa-trash text-danger text-center"
                  style={{ color: "red" }}
                  aria-hidden="true"
                ></i>
              ),
            }))}
          // handleRemove={handleRemove}
          />
        </div>
        }
        <div class="row p-1">
          <div
            className={
              parseInt(Category || 0) == 0
                ? "d-none"
                  : "col-12 d-flex justify-content-end"
            }
          >
            <button
              className="btn btn-sm btn-success mx-1"
              onClick={handleSaveItemMaster}
            >
              {isNaN(Number(payload.ItemID)) || payload.ItemID === ""
                ? `${t("Save")}`
                : Number(payload.ItemID) === 0
                  ? `${t("Save")}`
                  : `${t("Update")}`}
            </button>

            {/* <button
              className="btn btn-sm btn-success mx-1"
              onClick={() => {
                setReportVisible({
                  ReportVisible: true,
                  showData: {},
                });
              }}
            >
              Add New
            </button> */}
            <button
              className="btn btn-sm btn-success mx-1"
              // onClick={() => handleCancle()}
              onClick={handleCancle}
            >
              {t("Cancel")}
            </button>
          </div>
        </div>
      </div>

      <div className="card">
        <Heading title={t("Search ItemName List")} />

        <div className="row p-2">
          <ReactSelect
            placeholderName={t("Category")}
            id={"Category"}
            searchable={true}
            removeIsClearable={true}
            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
            dynamicOptions={apiData.getCategoryData}
            name="Category"
            handleChange={handleItemNameSearch}
            value={SearchCategory}
            requiredClassName="required-fields"
          />
          <ReactSelect
            placeholderName={t("SubCategory")}
            id={"SubCategoryID"}
            searchable={true}
            removeIsClearable={true}
            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
            dynamicOptions={[
              { label: "ALL", value: "0" },
              ...(apiData?.getForItemGroupsData?.map((ele) => ({
                label: ele?.label,
                value: ele?.value, // Corrected this line
              })) || []),
            ]}
            name="SubCategoryID"
            handleChange={handleItemNameSearch}
            value={ItemNameSearchpayload?.SubCategoryID}
          // requiredClassName="required-fields"
          />
          <Input
            type="text"
            className="form-control required-fields"
            id="SearchItemName "
            name="SearchItemName"
            onChange={handleItemNameChange}
            value={ItemNameSearchpayload.SearchItemName}
            lable={t("Search By Name/Code")}
            placeholder=" "
            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
          />
          <ReactSelect
            placeholderName={t("Search Type")}
            id={"SearchbyData"}
            searchable={true}
            removeIsClearable={true}
            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
            dynamicOptions={[
              { label: "Search by First Name", value: "FirstName" },
              { label: "Search by Word", value: "Word" },
              { label: "Search by Item Code", value: "ItemCode" },
            ]}
            name="SearchbyData"
            handleChange={handleItemNameSearch}
            value={ItemNameSearchpayload?.SearchbyData}
            requiredClassName="required-fields"
          />
          <div className="col-sm-1 d-flex justify-content-between">
            <button
              className="btn btn-sm btn-success mx-1"
              onClick={handleSearch}
            >
              {t("Search")}
            </button>
            <button
              className="btn btn-sm btn-success mx-1"
              onClick={handleReport}
            // onClick={handleCancle}
            >
              {t("Download Item Master")}
            </button>

            <div className="col-sm-1">
              <button
                className="btn btn-sm btn-success"
                onClick={() => {
                  handleOpenIndent({
                    label: t("Create Drug Category"),
                    width: "60vw",
                    // type: "draft",
                    // buttonName: "Search",
                    // data: values,
                  });
                }}
              >
                {t("Create Drug Category")}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        {SearchItemNameList.length > 0 && (
          <>
            <Tables
              thead={thead}
              tbody={SearchItemNameList?.map((ele, index) => ({
                // Select: <input type="checkbox" onChange={() => handleItemChange(index, ele)} />,
                // Checkbox for selection
                Select: (
                  <input
                    type="checkbox"
                    checked={selectedIndex === index}
                    onChange={() => handleItemChange(index, ele)}
                  />
                ),
                "Item Name": ele.TypeName || "", // Assuming TypeName is the item name
                "HSN Code": ele.HSNCode || "",
                ManuFacturer: ele.ManuFacturer || "",
                "Creater Name": ele.Name || "",
                "Created Date": ele.CreaterDateTime || "",
                Description: ele.Description || "",
                "Is Active": ele.IsActive ? "Yes" : "No", // Convert 1/0 to Yes/No
                "Purchase Unit": ele.MajorUnit || "",
                "Sale Unit": ele.MinorUnit || "",
                "Issue Factor": ele.ConversionFactor || "",
                "Subcategory Name": ele.SubcategoryName || "",
                "Commodity Code": ele.CommodityCode || "",
              }))}
              tableHeight={"tableHeight scrollView"}
              style={{ maxHeight: "150px" }}
            />
          </>
        )}
      </div>

      {/* {tableData?.length > 0 && (
        <div className="card">
          <Heading title={"Item Details"} />
          <div className="row">
            <VendorDetailTable
              thead={thead}
              tbody={tableData}
              setTableData={setTableData}
              ip={ip}
              handleSearch={handleSearch}
            />
          </div>
        </div>
      )}
      {ReportVisible && (
        <Modal
          modalWidth={"1000px"}
          visible={ReportVisible}
          setVisible={setReportVisible}
          Header="Add New Supplier"
          footer={
            <>
              <button
                className="btn btn-sm btn-success mx-2"
                onClick={handleSaveManufacture}
              >
                Save
              </button>
              <button
                className="btn btn-sm btn-success mx-2"
                onClick={handleCancle}
              >
                Cancle
              </button>
            </>
          }
        >
          <ViewVendorMasterModal handeAdd={handeAdd} payload1={payload} />
        </Modal>
      )} */}
    </>
  );
};

export default ItemMaster;
