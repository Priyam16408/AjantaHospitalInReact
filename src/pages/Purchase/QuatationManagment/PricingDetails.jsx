import React, { useEffect, useState } from "react";
import Heading from "../../../components/UI/Heading";
import DatePicker from "../../../components/formComponent/DatePicker";
import Input from "../../../components/formComponent/Input";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import TextAreaInput from "../../../components/formComponent/TextAreaInput"; 
import Tables from "../../../components/UI/customTable";
import {
  AddItems,
  PurchaseGetCurrencyFactor,
  PurchaseGetTaxAmount,
  PurchaseGetTaxGroup,
  PurchaseSaveQuotation,
  QuotationGetPurchaseMarkUpPercent,
} from "../../../networkServices/Purchase";
import { AiOutlineClose } from "react-icons/ai";

import { useTranslation } from "react-i18next";
import {
  handleReactSelectDropDownOptions,
  notify,
  purchaseQuotationAdd,
  purchaseSaveQuotation,
} from "../../../utils/utils";
import moment from "moment";
import { useSelector } from "react-redux";
const PricingDetails = ({
  selectedDetails,
  details,
  handleQuotationSearch,
}) => {
  const [t] = useTranslation();
  const [gstAmount, setGstAmount] = useState();
  const [currencyDetails, setCurrencyDetails] = useState([])
  const [centerWiseMarkUp, setCenterWiseMarkUp] = useState([])
  const [selectItem, setSelectItem] = useState([]);
  const { VITE_DATE_FORMAT } = import.meta.env;
  const THEAD = [
    { width: "5%", name:  t("S No.") },
    { width: "10%", name: t("Supplier Name") },
    { width: "10%", name: t("Manufacturer") },
    { width: "10%", name: t("Item Name") },
    { width: "5%", name: t("Unit") },
    { width: "10%", name: t("FromDate") },
    { width: "10%", name: t("To Date") },
    { width: "5%", name: t("MRP") },
    { width: "5%", name: t("Rate") },
    { width: "5%", name: t("Dis. Amt") },
    { width: "5%", name: t("Dis. Per") },
    { width: "5%", name: t("GST") },
    { width: "10%", name: t("GST Group") },
    { width: "10%", name: t("HSNCode") },
    { width: "5%", name: t("GST Amt.") },
    { width: "5%", name: t("Net Amt") },
    { width: "5%", name: t("Tolerance Qty(-)") },
    { width: "5%", name: t("Tolerance Qty(+)") },
    { width: "5%", name: t("Tolerance Rate(-)") },
    { width: "5%", name: t("Tolerance Rate(+)") },
    { width: "5%", name: t("IsDefault") },
    { width: "5%", name: t("Currency") },
    { width: "5%", name: t("Remove")}
  ];

  
  
  const [dropDownState, setDropDownState] = useState({
    GetCurrencyFactor: [],
    GetTaxGroup: [],
    GetTaxAmount: [],
  });
  const { BindResource } = useSelector((state) => state?.CommonSlice);


  
  const [payload, setPayload] = useState({
    FromDate: new Date(),
    ToDate: new Date(),
    mrp: "",
    rate: "",
    isdeal1: "",
    isdeal2: "",
    currrency: "",
    HSNCode: "",
    VatPersentage: "",
    DiscountAmount: "",
    DiscountPercent: "",
    TaxCalculatedOn: { label: "RateAD", value: "RateAD" },
    IsDefault: { label: "Yes", value: "True" },
    GSTGroup: {},
    Remaks: "",
    minimumToleranceQty: "",
    maximumToleranceQty: "",
    minimumToleranceRate: "",
    maximumToleranceRate: "",
  });

  useEffect(()=>{
setPayload({
  FromDate: new Date(),
  ToDate: new Date(),
  mrp: "",
  rate: "",
  isdeal1: "",
  isdeal2: "",
  currrency: "",
  HSNCode: "",
  VatPersentage: "",
  DiscountAmount: "",
  DiscountPercent: "",
  TaxCalculatedOn: { label: "RateAD", value: "RateAD" },
  IsDefault: { label: "Yes", value: "True" },
  GSTGroup: {},
  Remaks: "",
  minimumToleranceQty: "",
  maximumToleranceQty: "",
  minimumToleranceRate: "",
  maximumToleranceRate: "",
});
  },[selectedDetails])
  const GetPurchaseMarkUpPercent = async () => {
    try {
      const GetPurchaseMarkUpPercent = await QuotationGetPurchaseMarkUpPercent();
      if (GetPurchaseMarkUpPercent?.success) {
        setCenterWiseMarkUp(GetPurchaseMarkUpPercent?.data)

      }
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };

  const calculateItemMRP = (data) => {
    var rate = data.rate;
    var quantity = data.quantity;
    var netAmount = data.netAmount;
    var markUpPercent = data.markUpPercent;

    if (!markUpPercent) {
      var filterMarkup = [];
      filterMarkup = centerWiseMarkUp?.filter((item) => item.itemId === data.ItemID && item.MarkUpType === "CentreWiseItemWise");
      if (filterMarkup.length == 0) {
        filterMarkup = centerWiseMarkUp?.filter((item) => item.itemId === data.ItemID && item.MarkUpType === "UniversalItemWise");

      }
      if (filterMarkup.length == 0) {
        filterMarkup = centerWiseMarkUp?.filter((item) => { return item.SubCategoryID == data.subCategoryID && item.MarkUpType == "UniversalSubCategoryWise" && item.ToRate >= data.rate });
      }
      if (filterMarkup.length == 0) {
        filterMarkup = centerWiseMarkUp?.filter((item) => { return item.MarkUpType == "UniversalSubCategoryWise" });

      }
      if (filterMarkup.length > 0) {
        markUpPercent = filterMarkup[0].MarkUpPercentage;
      }
      else {
        markUpPercent = 0;
      }


    }
    var itemMRP = (netAmount + (netAmount * markUpPercent * 0.01)) / quantity
    return { itemMRP: itemMRP, markUpPercent: markUpPercent };

  }
  const onRateChange = (data) => {
    const rate = Number(data?.rate) || 0;
    const discountAmt = Number(data.DiscountAmount) || 0;
    const vatPersentage = Number(data?.VatPersentage) || 0;
    const discountPercent =
      Number(data.DiscountPercent) || 0;
    const discountAmount = (rate * discountPercent) / 100;
    const taxAmount = ((rate - discountAmt) * vatPersentage) / 100
    const NetAmount = ((rate + taxAmount) - discountAmount)
    let d = calculateItemMRP(
      {
        rate: rate,
        quantity: 1,
        netAmount: NetAmount,
        markUpPercent: "",
        subCategoryID: selectedDetails?.SubCategoryID,
        itemId: selectedDetails?.ItemId

      }

    )
    setPayload((prevPayload) => ({
      ...prevPayload,
      mrp: d?.itemMRP,
      DiscountAmount: discountAmount
    }));
  }

  const onDiscountPercentChange = function (DiscountPercent) {
    let rate = Number(payload?.rate);
    let discountPercent = Number(DiscountPercent);
    let discountAmount = (rate * discountPercent / 100);
    if (Number(BindResource?.IsGSTApplicable) === 0) {
      var taxPercent = Number(DiscountPercent);
      var taxAmount = ((rate - discountAmount) * taxPercent) / 100;
      var netAmount = (rate + taxAmount) - (discountAmount);
      var subCategoryID = selectedDetails?.subCategoryID
      var ItemID = selectedDetails?.ItemId
      var d = calculateItemMRP({
        rate: rate,
        quantity: 1,
        netAmount: netAmount,
        markUpPercent: '',
        centerWiseMarkUp: centerWiseMarkUp,
        subCategoryID: subCategoryID,
        itemId: ItemID
      });
      setPayload((prevPayload) => ({
        ...prevPayload,
        mrp: d?.itemMRP,
      }));
    }
    setPayload((prevPayload) => ({
      ...prevPayload,
      DiscountAmount: discountAmount
    }));

  }


  const onDiscountAmountChange = (discountAmount) => {
    var rate = Number(payload.rate)
    if (Number(discountAmount) > rate) {
      notify('Dicsount Amount Should be Less Than Or Equal To Rate', "error");
      discountAmount = 0;

    }

    var discountPercent = Number((discountAmount * 100) / rate);
    if (Number(BindResource?.IsGSTApplicable) === 0) {
      var taxPercent = Number(payload?.VatPersentage);
      var taxAmount = ((rate - discountAmount) * taxPercent) / 100;
      var netAmount = (rate + taxAmount) - (discountAmount)
      var subCategoryID = selectedDetails?.subCategoryID
      var ItemID = selectedDetails?.ItemId
      var d = calculateItemMRP({
        rate: rate,
        quantity: 1,
        netAmount: netAmount,
        markUpPercent: '',
        subCategoryID: subCategoryID,
        itemId: ItemID
      });

      setPayload((prevPayload) => ({
        ...prevPayload,
        mrp: d?.itemMRP,
      }));
    }
    setPayload((prevPayload) => ({
      ...prevPayload,
      DiscountPercent: discountPercent
    }));

  }
  useEffect(() => {
    console.log("Updated selectItem:", selectItem);
  }, [selectItem]);
  const GetTaxAmount = async (itemID) => {
    try {
      const GetTaxAmount = await PurchaseGetTaxAmount(itemID);
      setGstAmount(GetTaxAmount?.data?.[0]);
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
      let data = GetTaxGroup?.data?.find(
        (val) => val?.TaxGroupLabel === GetTaxAmount?.data?.[0]?.GSTType
      );
      setPayload((prev) => ({
        ...prev,
        GSTGroup: { ...data, value: data?.TaxGroupLabel },
      }));
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };

  const handleQuotationAdd = async () => {
    // debugger
    let data = purchaseQuotationAdd(selectedDetails, payload, details, currencyDetails);

    if (!data.mrp || !data.rate || data.mrp < data.rate) {
      if ((BindResource?.IsGSTApplicable) === "1") {
        if (data.mrp < 1) {
          notify("Please Enter MRP", "error")

        }
        if (data.rate < 1) {
          notify("Please Enter Rate", "error")

        }
        if (data.mrp < data.rate) {
          notify("MRP Can't Less Then Rate.", "error");

        }
      }

      return;
    }

    try {
      const response = await AddItems(data);
      if (response.data) {
        setSelectItem((preV) => [...preV, response.data]);
      }

      if (!response?.success) {
        notify(response?.message, "error");
      }
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };

  const handleReactChange = (name, e, key) => {
    setPayload((val) => ({ ...val, [name]: e }));
  };


  const handleChange = (e) => {
    const { name, value } = e.target;

    setPayload((prevPayload) => ({
      ...prevPayload,
      [name]: value,
    }));

    if (name === "rate") {
      if (BindResource?.IsGSTApplicable === "0") {
        onRateChange(payload)
      }
    }

    if (name === "DiscountAmount") {
      onDiscountAmountChange(value)
    }
    if (name === "DiscountPercent") {
      onDiscountPercentChange(value)
    }
  };
  const handleRemove = (index) => {
    let newItem = selectItem.filter((_, ind) => ind !== index);
    setSelectItem(newItem);
  };

  const handleSaveQuotation = async () => {
    let data = purchaseSaveQuotation(selectItem);
    try {
      const response = await PurchaseSaveQuotation(data);
      if (response?.success) {
        setSelectItem([]);
        handleQuotationSearch();
        notify(response?.message, "success");
      } else {
        notify(response?.message, "error");
      }
    } catch (error) { }
  };

  const GetCurrencyFactor = async (id) => {
    try {
      const GetCurrencyFactor = await PurchaseGetCurrencyFactor(id);
      setCurrencyDetails(GetCurrencyFactor?.data)

      if (GetCurrencyFactor?.success) {
        const newCurrency = GetCurrencyFactor.data;

        setPayload((prevState) => ({
          ...prevState,
          currrency: newCurrency,
        }));
      }
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
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

  const handleAllClear = () => {
    setSelectItem([]);
  };

  useEffect(() => {
    GetTaxAmount(selectedDetails?.ItemId);
    GetCurrencyFactor(details?.supplier?.Currency);
    GetTaxGroup();
    GetPurchaseMarkUpPercent()
  }, []);
    const searchHandleChange = (e) => {
        const { name, value } = e.target;
        setPayload((prevState) => ({
          ...prevState,
          [name]: moment(value).format("YYYY-MM-DD"),
        }));
      };

  return (
    <div className="patient_registration card">
      <Heading title={t("Items Pricing Detail")} isBreadcrumb={false} />

      <div className="row p-2">
        <div className="p-2" respclass={"col-xl-2 col-md-3 col-sm-6 col-12"}>
          <label htmlFor="">{t("Quotation For ")} : </label>
          <span> {selectedDetails?.TypeName} </span>
        </div>
        <div className="p-2" respclass={"col-xl-2 col-md-3 col-sm-6 col-12"}>
          <label htmlFor=""> {t("Supplier From")}: </label>
          <span> {details?.supplier?.LedgerName} </span>
        </div>
        <div className="p-2" respclass={"col-xl-2 col-md-3 col-sm-6 col-12"}>
          <label htmlFor=""> {t("Manufacturer")} : </label>
          <span> {details?.manufacturer?.label} </span>
        </div>
        <div className="p-2" respclass={"col-xl-2 col-md-3 col-sm-6 col-12"}>
          <label htmlFor=""> {t("Purchase Unit")} :</label>
          <span> {selectedDetails?.majorUnit}</span>
        </div>

      </div>
      <div className="row p-2">
        {/* <DatePicker
          className="custom-calendar"
          placeholder=""

          lable={t("FromDate")}
          respclass={"col-xl-2 col-md-3 col-sm-6 col-12"}
          name="FromDate"
          id="fromDate"
          value={payload?.FromDate}
          showTime
          hourFormat="12"
          handleChange={handleChange}
        />
        <DatePicker
          className="custom-calendar"
          placeholder=""
          lable={t("to Date")}

          respclass={"col-xl-2 col-md-3 col-sm-6 col-12"}
          name="ToDate"
          id="ToDate"
          value={payload?.ToDate}
          showTime
          hourFormat="12"
          handleChange={handleChange}
        /> */}

          
<DatePicker
              className="custom-calendar"
              id="From Data"
              name="FromDate"
              lable={t("From Date")}
              placeholder={VITE_DATE_FORMAT}
              respclass="col-xl-2 col-md-3 col-sm-6 col-12"
              value={
                payload.FromDate
                  ? moment(payload.FromDate, "YYYY-MM-DD").toDate()
                  : null
              }
              maxDate={new Date()}
              handleChange={searchHandleChange}
            />
         <DatePicker
                      className="custom-calendar"
                      id="ToDate"
                      name="ToDate"
                      lable={t("To Date")}
                      value={
                        payload.ToDate
                          ? moment(payload.ToDate, "YYYY-MM-DD").toDate()
                          : null
                      }
                      maxDate={new Date()}
                      handleChange={searchHandleChange}
                      placeholder={VITE_DATE_FORMAT}
                      respclass="col-xl-2 col-md-3 col-sm-6 col-12"
                    />

        <Input
          disabled={!BindResource.IsGSTApplicable === "0"}
          type="number"
          className="form-control required-fields"
          id="mrp"
          lable={t("MRP")}
          placeholder=" "
          value={payload?.mrp}
          respclass="col-xl-2 col-md-3 col-sm-6 col-12"
          name="mrp"
          onChange={handleChange}
        />

        <Input
          type="number"
          className="form-control required-fields"
          id="rate"
        
          lable={t("Rate")}
          placeholder=" "
          required={true}
          value={payload?.rate}
          respclass="col-xl-2 col-md-3 col-sm-6 col-12"
          name="rate"
          onChange={handleChange}
        />
        <div className="col-xl-2 col-md-3 col-sm-6 col-12">
          <div className="d-flex align-items-center ">
            <Input
              type="text"
              className="form-control me-2"
              id="isdeal1"
             
              lable={t("Is Deal1")}
              placeholder=" "
              required={true}
              value={payload?.isdeal1}
              name="isdeal1"
              onChange={handleChange}
            />
            <span className="mx-2">+</span>
            <Input
              type="text"
              className="form-control ms-2"
              id="isdeal2"
              
              lable={t("Is Deal2")}
              placeholder=" "
              required={true}
              value={payload?.isdeal2}
              name="isdeal2"
              onChange={handleChange}
            />
          </div>
        </div>

        <Input
          type="text"
          className="form-control"
          id="currrency"
           
          lable={`${t("Currrency")} (${details?.supplier?.Currency})`}
          placeholder=" "
          required={true}
          value={payload?.currrency?.currencyFactor?.[0]}
          respclass="col-xl-2 col-md-3 col-sm-6 col-12"
          name="currrency"
          onChange={handleChange}
        />
        <Input
          type="text"
          className="form-control"
          id="HSNCode"
          
          lable={t("HSN Code")}
          placeholder=" "
          required={true}
          value={payload?.HSNCode}
          respclass="col-xl-2 col-md-3 col-sm-6 col-12"
          name="HSNCode"
          onChange={handleChange}
        />
        <ReactSelect
          placeholderName={t("Set As Default")}
          searchable={true}
          respclass="col-xl-2 col-md-3 col-sm-6 col-12"
          id={"IsDefault"}
          name={"IsDefault"}
          removeIsClearable={true}
          handleChange={(name, e) => handleReactChange(name, e)}
          dynamicOptions={[
            { label: "Yes", value: "True" },
            { label: "No", value: "False" },
          ]}
          value={payload?.IsDefault?.value}
        />
        <Input
          type="text"
          className="form-control"
          id="DiscountAmount"
          lable={t("Discount Amount")}
          placeholder=" "
          required={true}
          value={payload?.DiscountAmount}
          respclass="col-xl-2 col-md-3 col-sm-6 col-12"
          name="DiscountAmount"
          onChange={handleChange}
        />
        <Input
          type="text"
          className="form-control"
          id="DiscountPercent"
         
          lable={t("Discount Percent")}
          placeholder=""
          required={true}
          value={payload?.DiscountPercent}
          respclass="col-xl-2 col-md-3 col-sm-6 col-12"
          name="DiscountPercent"
          onChange={handleChange}
        />

        <ReactSelect
          placeholderName={t("Tax Calculated On")}
          isDisabled={true}
          searchable={true}
          respclass="col-xl-2 col-md-3 col-sm-6 col-12"
          id={"TaxCalculatedOn"}
          name={"TaxCalculatedOn"}
          removeIsClearable={true}
          handleChange={(name, e) => handleReactChange(name, e)}
          dynamicOptions={[
            { label: "RateAD", value: "RateAD" },
          ]}
          value={payload?.TaxCalculatedOn?.value || ""}
        />

        <ReactSelect
          isDisabled={!BindResource.IsGSTApplicable === "1"}
          placeholderName={t("GST Group" )}
          searchable={true}
          respclass="col-xl-2 col-md-3 col-sm-6 col-12"
          id={"GSTGroup"}
          name={"GSTGroup"}
          requiredClassName={"required-fields"}
          removeIsClearable={true}
          handleChange={(name, e) => handleReactChange(name, e)}
          dynamicOptions={dropDownState?.GetTaxGroup}
          value={payload?.GSTGroup?.value}
        />

        {
          (BindResource.IsGSTApplicable === "0" ? (<Input

            type="number"
            className="form-control required-fields"
            id="VatPersentage"
            // lable="CGST (%)"
            lable={t("Vat (%)" )}
            placeholder=" "
            required={false}
            value={payload?.VatPersentage}
            // value={payload?.CGST}
            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
            name="VatPersentage"
            onChange={handleChange}
          />) : (
            <>
              <Input
                disabled={BindResource.IsGSTApplicable === "1"}
                type="number"
                className="form-control"
                id="CGST"
                // lable="CGST (%)"
                lable={BindResource.IsGSTApplicable === "1" ? `${t( "CGST(%)")}` : `${t( "Vat")}`}
                placeholder=" "
                required={false}
                value={payload?.GSTGroup?.CGSTPer}
                // value={payload?.CGST}
                respclass="col-xl-2 col-md-3 col-sm-6 col-12"
                name="rate"
                onChange={handleChange}
              />
              <Input
                disabled={BindResource.IsGSTApplicable === "1"}
                type="number"
                className="form-control"
                id="CGST"
                lable={BindResource.IsGSTApplicable === "1" ? `${t("SGST(%)")}` :`${t( "Vat")}`}
                placeholder=" "
                required={false}
                value={payload?.GSTGroup?.SGSTPer}
                // value={payload?.CGST}
                respclass="col-xl-2 col-md-3 col-sm-6 col-12"
                name="rate"
                onChange={handleChange}
              />

              {/*            
                 <Input
                 type="number"
                 className="form-control "
                 id="minimumToleranceQty"
                 lable="Tolerance Qty (-)"
                 placeholder=" "
                 required={true}
                 value={payload?.minimumToleranceQty}
                 respclass="col-xl-2 col-md-3 col-sm-6 col-12"
                 name="minimumToleranceQty"
                 onChange={handleChange}
               />
                 <Input
                 type="number"
                 className="form-control "
                 id="maximumToleranceQty"
                 lable="Tolerance Qty (+)"
                 placeholder=" "
                 required={true}
                 value={payload?.maximumToleranceQty}
                 respclass="col-xl-2 col-md-3 col-sm-6 col-12"
                 name="maximumToleranceQty"
                 onChange={handleChange}
               />
                 <Input
                 type="number"
                 className="form-control "
                 id="minimumToleranceRate"
                 lable="Tolerance Rate (-)"
                 placeholder=" "
                 required={true}
                 value={payload?.minimumToleranceRate}
                 respclass="col-xl-2 col-md-3 col-sm-6 col-12"
                 name="minimumToleranceRate"
                 onChange={handleChange}
               />
                 <Input
                 type="number"
                 className="form-control "
                 id="maximumToleranceRate"
                 lable="Tolerance Rate (+)"
                 placeholder=" "
                 required={true}
                 value={payload?.maximumToleranceRate}
                 respclass="col-xl-2 col-md-3 col-sm-6 col-12"
                 name="maximumToleranceRate"
                 onChange={handleChange}
               />
               */}
            </>
          ))
        }




        <TextAreaInput
          type="text"
          className={`form-textarea `}
          id="Remaks"
          name="Remaks"
          rows={2}
          value={payload?.Remaks ? payload?.Remaks : ""}
          onChange={handleChange}
          lable={t("Remaks")}
          placeholder=" "
          respclass=" col-sm-6 col-12"
        />
        <div className="col-xl-2 col-md-3 col-sm-6 col-12">
          <button
            className="btn btn-sm btn-primary mx-1 px-4"
            onClick={handleQuotationAdd}
          >
            {t("Add")}
          </button>
        </div>
      </div>

      {selectItem?.length > 0 && (
        <div className="patient_registration card">
          <div className="row">
            <div className="col-12">
              <Tables
                thead={THEAD}
                tbody={selectItem?.map((val, ind) => ({
                  Sno: ind + 1 || "",
                  SupplierName: val?.vendorName || "",
                  Manufacturer: val?.manufacturer || "",
                  ItemName: val?.itemName || "",
                  Unit: val?.unit || "",
                  fromDate: moment(val?.fromDate).format("YYYY-MMM-DD") || "",
                  toDate: moment(val?.toDate).format("YYYY-MMM-DD") || "",
                  mrp: val?.mrp || "",
                  rate: val?.rate || "",
                  discountAmount: val?.discountAmount ? val?.discountAmount : "0",
                  discountPercent: val?.discountPercent ? val?.discountPercent : "0",
                  gst: val?.totalTaxPercent ? val?.totalTaxPercent : "0",
                  // gstType: val?.TotalGST,
                  GSTGroup:val?.taxGroupName || "",
                  hsnCode: val?.hsnCode || "",
                  GSTAmt: val?.taxAmount ? val?.taxAmount : "0",
                  NetAmt: val?.netAmount || "0",

                  "Tolerance Qty(-)": val?.minimumToleranceQty ? val?.minimumToleranceQty : "0",
                  "Tolerance Qty(+)": val?.maximumToleranceQty ? val?.maximumToleranceQty : "0",
                  "Tolerance Rate(-)": val?.minimumToleranceRate ? val?.minimumToleranceRate : "0",
                  "Tolerance Rate(+)": val?.maximumToleranceRate ? val?.maximumToleranceRate : "0",

                  IsDefault: val?.isActive || "",
                  currency: val?.currencyNotation || "",
                  // c:console.log("first",val),

                  btn: (<AiOutlineClose onClick={() => handleRemove(ind)} />),
                }))}
                tableHeight={"scrollView"}
              />

              <div className="col-xl-2 col-md-3 col-sm-6 col-12 m-2">
                <button
                  className="btn btn-sm btn-primary mx-1 px-4"
                  onClick={handleSaveQuotation}
                >
                  
                  {t("Save")}
                </button>
                <button
                  className="btn btn-sm btn-primary mx-1 px-4"
                  onClick={handleAllClear}
                >
                  
                  {t("Cancel")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PricingDetails;
