

import Heading from "../../../components/UI/Heading";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import {
  PurchaseBindAddItems,
  PurchaseBindCategory,
  PurchaseBindGetManufacturers,
  PurchaseBindGetVendors,
  PurchaseBindSubCategory,
  PurchaseSearchQuotation,
  PurchaseSetDefault,

} from "../../../networkServices/Purchase";
import { AiOutlineClose } from "react-icons/ai";
import { AutoComplete } from "primereact/autocomplete";
import { handleReactSelectDropDownOptions, notify } from "../../../utils/utils";
import Tables from "../../../components/UI/customTable";
import PricingDetails from "./PricingDetails";
import { useSelector } from "react-redux";
import QuataionExcel from "./QuataionExcel";
import Modal from "../../../components/modalComponent/Modal";
import ColorCodingSearch from "../../../components/commonComponents/ColorCodingSearch";
export default function QuotationAndCompare() {
  const [t] = useTranslation();
  const [dropDownState, setDropDownState] = useState({
    BindCategory: [],
    BindSubCategory: [],
    BindManufacturers: [],
    BindGetVendorsAPI: [],
    BindAddItems: [],
  });

  const initialValue = {};
  const [values, setValues] = useState(initialValue);
  const [selectedItem, setSelectedItem] = useState([]);
  const [selectedDetails, setSelectDetails] = useState({});
  const [value, setValue] = useState("");
  const [items, setItems] = useState([]);
  const [handleModelData, setHandleModelData] = useState({});
  const handleClose = () => {
    setHandleModelData((val) => ({ ...val, isOpen: false }))
  }
  const [payload, setPayload] = useState({
  
    category: { name: 'GENERAL STORE ITEMS', categoryID: '8', configID: '28', label: 'GENERAL STORE ITEMS', value: '8' },
    subCategories: {},
    manufacturer: {},
    supplier: {},
    addItems: {},
  });
  const [tableData, setTableData] = useState([]);
  const THEAD = [
    { name: t("S.No."), width: "5%" },
    { name: t("Supplier"), width: "10%" },
    { name: t("Manufacturer"), width: "10%" },
    { name: t("Item Name"), width: "15%" },
    { name: t("Rate"), width: "8%" },
    { name: t("Discount"), width: "8%" },
    { name: t("Tax"), width: "8%" },
    { name: t("Deal"), width: "8%" },
    { name: t("Cost Price"), width: "8%" },
    { name: t("MRP"), width: "8%" },
    { name: t("Profit"), width: "8%" },
    { name: t("IsActive"), width: "5%" },
    { name: t("FromDate"), width: "10%" },
    { name: t("ToDate"), width: "10%" },
    { name: t("EntryDate"), width: "10%" },
    { name: t("Tolerance Qty(-)"), width: "8%" },
    { name: t("Tolerance Qty(+)"), width: "8%" },
    { name: t("Tolerance Rate(-)"), width: "8%" },
    { name: t("Tolerance Rate(+)"), width: "8%" },
    { name: t("Set Default"), width: "5%" }
];


  const renderAPI = async () => {
    try {
      const BindCategory = await PurchaseBindCategory();
      setDropDownState((val) => ({
        ...val,
        BindCategory: handleReactSelectDropDownOptions(
          BindCategory?.data,
          "Name",
          "CategoryID"
        ),
      }));
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };

  const renderSubCategoryAPI = async (id) => {
    try {
      const BindSubCategory = await PurchaseBindSubCategory(id);
      if (BindSubCategory?.success) {
        setDropDownState((val) => ({
          ...val,
          BindSubCategory: handleReactSelectDropDownOptions(
            BindSubCategory?.data,
            "Name",
            "SubCategoryID"
          ),
        }));
      }
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
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

  const renderGetVendorsAPI = async () => {
    try {
      const BindGetVendorsAPI = await PurchaseBindGetVendors();
      if (BindGetVendorsAPI?.success) {
        setDropDownState((val) => ({
          ...val,
          BindGetVendorsAPI: handleReactSelectDropDownOptions(
            BindGetVendorsAPI?.data,
            "LedgerName",
            "ID"
          ),
        }));
      }
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };


  const renderhandleAddItemsAPI = async (categoryID, subCategoryID) => {
    try {
      const payload = {
        categoryID,
        subCategoryID,
      };
      const BindAddItems = await PurchaseBindAddItems(payload);

      if (BindAddItems?.success) {
        const formattedData = BindAddItems?.data?.map((item) => ({
          name: item?.TypeName,
          code: item?.ItemId,
        }));
        setDropDownState((prevState) => ({
          ...prevState,
          BindAddItems: formattedData,
        }));
      }
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };

  const handleReactChange = (name, e, key) => {
    if (name === "category") {
      setDropDownState((prevState) => ({
        ...prevState,
        BindSubCategory: [],
      }));
      renderSubCategoryAPI(e.value);
      setPayload((val) => ({ ...val, [name]: e, subCategories: "" }));

    } else {
      setPayload((val) => ({ ...val, [name]: e }));
    }
    if (name === "subCategories") {
      renderhandleAddItemsAPI(payload?.category?.value, e.value);
    }
  };

  useEffect(() => {
    renderAPI();
    renderManufacturerAPI();
    renderGetVendorsAPI();
  }, []);


  useEffect(() => {
    if (payload?.category?.value) {
      renderSubCategoryAPI(payload?.category?.value);
    }
    if (payload?.category?.value && payload?.subCategories?.value) {
      renderhandleAddItemsAPI(payload?.category?.value, payload?.subCategories?.value)
    }
  }, [payload?.category?.value, payload?.subCategories?.value])


  const handleQuotationSearch = async (value) => {
  
    try {
      let ID = [];
      if (selectedItem) {
        selectedItem?.forEach((item) => {
          ID.push(String(item?.ItemId));
        });
      } else if (value) {
        ID.push(String(value.ItemId));
      }
      if(value?.ItemId){
        ID.push(String(value.ItemId));
      }

      const vendorID = payload?.supplier?.ID;
      let payloadData = {
        vendorID: vendorID ? vendorID : "0",
        ItemID: ID.length > 0 ? ID : [],
      };

      const response = await PurchaseSearchQuotation(payloadData);
         if(value==="True"){
         const data = response?.data?.filter((val) => val.AppStatus === value || value === "")
          if (data.length === 0) {
           
              notify("Data not Found", "error");
          }
          if (data) {
            setTableData(data)
          }
         } 
         else{
          setTableData(response.data);
         }       

    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };


  const handleGetLoadOPD_All_ItemsLabAutoComplete = async (payload) => {
    try {
      const data = await PurchaseBindAddItems(payload);

      if (!data?.data || !Array.isArray(data.data)) {
        return [];
      }

      if (payload?.prefix?.prefix && typeof payload?.prefix?.prefix === "string") {
        const filterData = data.data.filter((item) =>
          item.ItemName?.toLowerCase().startsWith(payload?.prefix?.prefix?.toLowerCase())
        );
        return filterData;
      } else {
        console.log("Prefix is empty or invalid, returning all data.");
        return data.data;
      }

    } catch (error) {
      console.log(error, "error`");
    }
  };

  const search = async (event) => {
    if (event?.query?.length >= 3) {
      const item = await handleGetLoadOPD_All_ItemsLabAutoComplete({
        categoryID: payload.category?.value ?? "0",
        subCategoryID: payload?.subCategories?.value ?? "0",
        prefix: event?.query?.trim(),
        type: values?.type,
      });
      setItems(item);
    }

  };

  const validateInvestigation = async (e) => {
    const { value } = e;
    setSelectedItem((prevItems) =>
      prevItems.includes(value) ? prevItems : [...prevItems, value]
    );
    handleQuotationSearch(value);
    setPayload((preV) => ({
      ...preV,
      addItems: {}
    }))
    setValue("");
  };

  const itemTemplate = (item) => {
    return (
      <div className="p-clearfix">
        <div style={{ float: "left", fontSize: "12px", width: "100%" }}>
          {item?.TypeName}
        </div>
      </div>
    );
  };

  const handlSelectClick = (item, index) => {

    if (!payload.supplier.ID) {
      notify("Please Select Supplier.", "error");
      return
    }
    setSelectDetails(item);
  };

  const handleRemoveItem = (index) => {
    const newItem = selectedItem?.filter((_, ind) => ind !== index);
    setSelectDetails({});
    setSelectedItem(newItem);
  };

  const handleSetDefault = async (val, ind) => {
    try {
      let data = {
        ItemID: val.ItemID,
        RateID: val.StoreRateID,
      };

      const response = await PurchaseSetDefault(data);
      if (response?.success) {
        notify(response?.message, "success");
        handleQuotationSearch()
      } else {
        notify(response?.message, "error");
      }
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };

  const handleClickModal = (Details) => {
    const { itemLabel, Component, width } = Details;
    setHandleModelData({
      isOpen: true,
      width: width,
      label: itemLabel,
      Component: Component,
    })
  }

  const handleCallViewMedReq = (item) => {
    handleQuotationSearch(item);
};


const getRowClass = (val) => {

  if (val?.AppStatus === "True") {
    return "#8fec96";
  }
};
  return (
    <div className="mt-2 spatient_registration_card">
      <div className="patient_registration card">
        <Heading title={t("Search & Compare Item Rate")} isBreadcrumb={false} />
        <div className="row p-2">
          <ReactSelect
            placeholderName={t("Category")}

            requiredClassName={"required-fields"}
            searchable={true}
            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
            id={"category"}
            name={"category"}
            removeIsClearable={true}
            handleChange={(name, e) => handleReactChange(name, e)}
            dynamicOptions={dropDownState?.BindCategory}
            value={payload?.category?.value}
          />
          <ReactSelect
            placeholderName={t("Sub Categories")}
            // requiredClassName={"required-fields"}
            searchable={true}
            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
            id={"subCategories"}
            name={"subCategories"}
            removeIsClearable={true}
            handleChange={(name, e) => handleReactChange(name, e)}
            dynamicOptions={dropDownState?.BindSubCategory}
            value={payload?.subCategories?.value}
          />
          <ReactSelect
            placeholderName={t("Manufacturer")}
            searchable={true}
            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
            id={"manufacturer"}
            name={"manufacturer"}
            removeIsClearable={true}
            handleChange={(name, e) => handleReactChange(name, e)}
            dynamicOptions={dropDownState?.BindManufacturers}
            value={payload?.manufacturer}
          />
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
            value={payload?.supplier}
          />

          <div className="col-xl-2 col-md-3 col-sm-6 col-12 mb-2">
            <AutoComplete
         
             
              value={payload.addItems}
              suggestions={items}
              completeMethod={search}
              className="w-100"
              onSelect={(e) => validateInvestigation(e, 0, 0, 1, 0, 0)}
              id="searchtest"
              onChange={(e) => {
                const data =
                  typeof e.value === "object" ? e?.value?.TypeName : e.value;

                setPayload((prev) => ({
                  ...prev,
                  addItems: data,
                }));
              }}
              itemTemplate={itemTemplate}
            />
            <label
          className="label lable truncate ml-3"
          style={{ fontSize: "5px !important" }}
        >
          {t("Search Item")}
        </label>
          </div>


          <div className="col-xl-2 col-md-3 col-sm-6 col-12 mb-2">
            <button
              className="btn btn-sm btn-primary mx-1"
              onClick={handleQuotationSearch}
            >
              
              {t("Search")}
            </button>
            <button
              className="btn btn-sm btn-primary mx-1"
              onClick={() => {
                handleClickModal({
                  itemLabel: "Approved Remark",
                  Component: <QuataionExcel
                    handleClose={handleClose}
                  />,
                  width: "20vw",

                });
              }}
            >
                {t("Import From Excel")}
             
            </button>

          </div>
          <div className="col-xl-2 col-md-3 col-sm-6 col-12">
            <button
              className="btn btn-sm btn-primary mx-1"
            >
              
              {t("Get Excel Formate")}
            </button>

          </div>
          {selectedItem && (
            <div
              className="pl-2"
            >
              {selectedItem?.map((item, index) => (
                <>
                  <p
                    style={{
                      cursor: "pointer", border: "1px solid #d1d5db", padding: "2px", borderRadius: "3px",
                      display: "inline-block",
                      marginRight: "1px", whiteSpace: "nowrap"
                    }}
                    key={index}

                  >
                    <span onClick={() => handlSelectClick(item, index)}> {item.TypeName}</span>
                    <span onClick={() => handleRemoveItem(index)} className="p-2">
                      <AiOutlineClose />
                    </span>
                  </p>
                
                </>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="patient_registration card">
        <div className="row">
          <div className="col-12">
          <Heading
                    title= {t("Search Item")}
                    secondTitle={
                        <>
                            <span className="pointer-cursor">
                                {" "}
                                <ColorCodingSearch
                                    color={"#8fec96"}
                                    label={t("Default")}
                                    onClick={() => {
                                        handleCallViewMedReq("True");
                                    }}
                                />
                            </span>
                        </>
                    }
                />
            <Tables
              thead={THEAD}
              tbody={tableData?.map((val, ind) => ({
                Sno: ind + 1,
                SupplierName: val.VendorName,
                Manufacturer: val.Name ? val.Name : "",
                ItemName: val.ItemName,
                rate: val.Rate,
                discountAmount: val.DiscAmt,
                Tax: val.TaxAmt ? val.TaxAmt : "0",
                Unit: val.IsDeal,
                CostPrice: val.CostPrice ? val.CostPrice : "0",
                mrp: val.MRP,
                Profit: val.Profit ? val.Profit : "0",
                IsActive: val.AppStatus,
                toDate: val.ToDate,
                formData: val.FromDate,
                EntryDate: val.EntryDate,
                ToleranceQtyM: val.Minimum_Tolerance_Qty
                  ? val.Minimum_Tolerance_Qty
                  : "0",
                ToleranceRateMax: val.Maximum_Tolerance_Qty
                  ? val.Maximum_Tolerance_Qty
                  : "0",
                ToleranceRateM: val.Maximum_Tolerance_Rate
                  ? val.Maximum_Tolerance_Rate
                  : "0",
                ToleranceQtyP: val.Minimum_Tolerance_Rate
                  ? val.Minimum_Tolerance_Rate
                  : "0",
                btn: (
                  <button
                    className="btn btn-sm btn-primary mx-1"
                    onClick={() => handleSetDefault(val, ind)}
                  >
                   
                    {t("Set")}
                  </button>
                ),
                colorcode: getRowClass(val),
              }))}
              tableHeight={"scrollView"}
            />
          </div>
        </div>
      </div>

      {handleModelData?.isOpen && (
        <Modal
          visible={handleModelData?.isOpen}
          setVisible={handleClose}
          modalWidth={handleModelData?.width}
          Header={t(handleModelData?.label)}
          buttonType={"button"}
          footer={<></>}
        >
          {handleModelData?.Component}
        </Modal>
      )}
      {Object.keys(selectedDetails)?.length > 0 && (
        <PricingDetails
          selectedDetails={selectedDetails}
          details={payload}
          handleQuotationSearch={handleQuotationSearch}
        />
      )}
    </div>
  );
}
