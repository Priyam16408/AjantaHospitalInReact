import React, { useEffect, useState } from "react";
import Input from "../../../components/formComponent/Input";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import { useTranslation } from "react-i18next";
import DatePicker from "../../../components/formComponent/DatePicker";
import moment from "moment";
import Heading from "../../../components/UI/Heading";
import { BindCurrencyDetailsAPI, EDPBindPanelCurrencyAPI, EDPBindPanelGroupAPI, EDPBindPanelsAPI, EDPBindPaymentModeAPI, handlePanelSave } from "../../../networkServices/EDP/edpApi";
import { handleReactSelectDropDownOptions } from "../../../utils/utils";
import MultiSelectComp from "../../../components/formComponent/MultiSelectComp";
import LabeledInput from "../../../components/formComponent/LabeledInput";
import { handlePanelSavePayload, notify } from "../../../utils/ustil2";

const CreatePanel = ({ data }) => {
  const { VITE_DATE_FORMAT } = import.meta.env;
  const [t] = useTranslation();

  const rateType = [
    { code: "SELF (OPD)", name: "SELF (OPD)" },
    { code: "SELF (IPD)", name: "SELF (IPD)" },
  ];

  const CoPaymentOn = [
    { value: "1", label: "On Bill" },
    { value: "0", label: "On Service" },
  ];

  const yesOrNoOption = [
    { value: "1", label: "Yes" },
    { value: "0", label: "No" },
  ];

  const PanelType = [
    { value: "credit", label: "CREDIT" },
    { value: "cash", label: "CASH" },
  ];
  const initialValues = {
    panelName: "",
    showPrintout: { value: "1" },
    fallowrateipd: { value: "1" },
    fallowrateopd: { value: "1" },
    hideRate: { value: "0" },
    coverNote: { value: "0" },
    isctbApplicable: { value: "0" },
    CoPaymentOn: { value: "1" },
    panelType: { value: "credit" },
    groupType: { value: 1 },
    rateType: [],
    contactPerson: "",
    CurrencyConv: "",
    Addressone: "",
    Addresstwo: "",
    contactNo: "",
    phoneNo: "",
    emailId: "",
    faxNo: "",
    validfrom: moment(new Date()),
    validto: moment(new Date()),
  }

  const [values, setValues] = useState(initialValues);

  const handleSelect = (name, value) => {
    if (name === "billCurrency") {
      BindCurrencyDetails(value.value);
    }
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleChange = (e) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleMultiSelectChange = (name, selectedOptions) => {
    setValues((val) => ({ ...val, [name]: selectedOptions }));
  };

  const [dropdownList, setDropdownList] = useState({ PanelGroup: [], paymentMode: [], panelList: [] });
  const FetchAllDropDown = async () => {
    try {
      const [BindPanelGroup, paymentMode, panelList, currencyList] = await Promise.all([
        EDPBindPanelGroupAPI(),
        EDPBindPaymentModeAPI(),
        EDPBindPanelsAPI(),
        EDPBindPanelCurrencyAPI(),

      ]);

      if (BindPanelGroup?.success) {
        setDropdownList((val) => ({ ...val, PanelGroup: handleReactSelectDropDownOptions(BindPanelGroup?.data, "PanelGroup", "PanelGroupID") }));
      }
      if (paymentMode?.success) {
        setDropdownList((val) => ({ ...val, paymentMode: paymentMode?.data?.map((val) => ({ code: val?.PaymentModeID, name: val?.PaymentMode })) }));
      }
      if (panelList?.success) {
        setDropdownList((val) => ({ ...val, panelList: handleReactSelectDropDownOptions(panelList?.data, "Company_Name", "PanelID") }));
      }
      if (currencyList?.success) {
        currencyList?.data?.map((val) => {
          if (val?.IsBaseCurrency === 1) {
            BindCurrencyDetails(val?.CountryID)
            setValues((prev) => ({ ...prev, rateCurrency: { value: val?.CountryID }, billCurrency: { value: val?.CountryID } }))
          }
        })
        setDropdownList((val) => ({ ...val, currencyList: handleReactSelectDropDownOptions(currencyList?.data, "CurrencyName", "CountryID") }));
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const BindCurrencyDetails = async (CountryID) => {
    let apiResp = await BindCurrencyDetailsAPI(CountryID)
    if (apiResp?.success) {
      setValues((prev) => ({ ...prev, CurrencyConv: apiResp?.data?.Selling_Specific }))
    } else {
      setValues((prev) => ({ ...prev, CurrencyConv: "" }))
    }
  }

  console.log("data", data)
  useEffect(() => {
    FetchAllDropDown();
    if (data?.PanelID) {
      setValues((val)=>({...val,

        panelName: data?.Company_Name,
        Addressone: data?.Add1,
        Addresstwo: data?.Add2,
        contactPerson: data?.Contact_Person,
        contactNo: data?.Mobile,
        phoneNo: data?.Phone,
        emailId: data?.EmailID,
        faxNo: data?.Fax_No,
        validfrom: data?.DateFrom,
        validto: data?.DateTo,
        paymentMode:[],
        creditlimits: data?.CreditLimit,
      }))
    }
  }, []);
  console.log("value", values)
  const handleSave = async () => {
    const payload = handlePanelSavePayload(values)
    // let apiResp = await handlePanelSave(payload);
    if (apiResp?.success) {
      notify(apiResp?.message, "success");
    } else {
      notify(apiResp?.message, "error");
    }

  }
  return (
    <div className="card">
      <Heading
        title={data?.breadcrumb}
        // isMainHeading={{ data: data, FrameMenuID: data?.FrameMenuID }}
        data={data}
        isSlideScreen={true}
        isBreadcrumb={true}
      />
      <div className="row p-2">
        <Input
          type="text"
          className="form-control required-fields"
          //id="panelName"
          name="panelName"
          value={values?.panelName}
          onChange={handleChange}
          lable={t("Panel Name")}
          placeholder=""
          respclass="col-xl-2 col-md-4 col-sm-4 col-12"
        />
        <ReactSelect
          placeholderName={t("Group Type")}
          //id={"groupType"}
          searchable={true}
          respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          name="groupType"
          removeIsClearable={true}
          dynamicOptions={dropdownList?.PanelGroup}
          handleChange={handleSelect}
          value={`${values?.groupType?.value}`}
        />
        <Input
          type="text"
          className="form-control"
          //id="contactPerson"
          name="contactPerson"
          value={values?.contactPerson}
          onChange={handleChange}
          lable={t("Contact Person")}
          placeholder=""
          respclass="col-xl-2 col-md-4 col-sm-4 col-12"
        />
        <Input
          type="text"
          className="form-control"
          //id="Addressone"
          name="Addressone"
          value={values?.Addressone}
          onChange={handleChange}
          lable={t("Address1")}
          placeholder=""
          respclass="col-xl-2 col-md-4 col-sm-4 col-12"
        />
        <Input
          type="text"
          className="form-control"
          //id="Addresstwo"
          name="Addresstwo"
          value={values?.Addresstwo}
          onChange={handleChange}
          lable={t("Address2")}
          placeholder=""
          respclass="col-xl-2 col-md-4 col-sm-4 col-12"
        />
        <Input
          type="number"
          className="form-control"
          //id="contactNo"
          name="contactNo"
          value={values?.contactNo}
          onChange={handleChange}
          lable={t("Contact No")}
          placeholder=""
          respclass="col-xl-2 col-md-4 col-sm-4 col-12"
        />

        <Input
          type="number"
          className="form-control"
          //id="phoneNo"
          name="phoneNo"
          value={values?.phoneNo}
          onChange={handleChange}
          lable={t("Phone No")}
          placeholder=""
          respclass="col-xl-2 col-md-4 col-sm-4 col-12"
        />

        <Input
          type="text"
          className="form-control"
          //id="emailId"
          name="emailId"
          value={values?.emailId}
          onChange={handleChange}
          lable={t("Email ID")}
          placeholder=""
          respclass="col-xl-2 col-md-4 col-sm-4 col-12"
        />

        <Input
          type="text"
          className="form-control"
          //id="faxNo"
          name="faxNo"
          value={values?.faxNo}
          onChange={handleChange}
          lable={t("Fax No.")}
          placeholder=""
          respclass="col-xl-2 col-md-4 col-sm-4 col-12"
        />

        <DatePicker
          //id="validfrom"
          name="validfrom"
          className={`custom-calendar `}
          placeholder={VITE_DATE_FORMAT}
          lable={t("Valid From")}
          // value={values?.fromDate || new Date()}
          value={values?.validfrom ? new Date(values?.validfrom) : new Date()}
          handleChange={handleChange}
          respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          maxDate={new Date()}
        />
        <DatePicker
          //id="validto"
          name="validto"
          className={`custom-calendar `}
          placeholder={VITE_DATE_FORMAT}
          lable={t("Valid To")}
          // value={values?.fromDate || new Date()}
          value={values?.validto ? new Date(values?.validto) : new Date()}
          handleChange={handleChange}
          respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          maxDate={new Date()}
        />

        <MultiSelectComp
          respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          requiredClassName={"required-fields"}
          name="paymentMode"
          //id="paymentMode"
          placeholderName={t("Payment Mode")}
          dynamicOptions={dropdownList?.paymentMode}
          handleChange={handleMultiSelectChange}
          value={values?.paymentMode}
        />


        <ReactSelect
          placeholderName={t("Refer Rate(OPD)")}
          //id={"referrateipd"}
          searchable={true}
          removeIsClearable={true}
          respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          dynamicOptions={dropdownList?.panelList}
          handleChange={handleSelect}
          value={`${values?.referrateopd?.value}`}
          name={"referrateipd"}
        />

        <ReactSelect
          placeholderName={t("Refer Rate(IPD)")}
          //id={"referrateipd"}
          searchable={true}
          removeIsClearable={true}
          respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          dynamicOptions={dropdownList?.panelList}
          handleChange={handleSelect}
          value={`${values?.referrateipd?.value}`}
          name={"referrateipd"}
        />

        <Input
          type="text"
          className="form-control"
          //id="creditlimits"
          name="creditlimits"
          value={values?.creditlimits}
          onChange={handleChange}
          lable={t("Credit Limits")}
          placeholder=""
          respclass="col-xl-2 col-md-4 col-sm-4 col-12"
        />

        <MultiSelectComp
          respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          name="rateType"
          //id="rateType"
          placeholderName={t("Rate Type")}
          dynamicOptions={rateType}
          handleChange={handleMultiSelectChange}
          value={values?.rateType}
        />

        <ReactSelect
          placeholderName={t("Show PrintOut")}
          //id={"showPrintout"}
          searchable={true}
          removeIsClearable={true}
          respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          dynamicOptions={yesOrNoOption}
          handleChange={handleSelect}
          value={`${values?.showPrintout?.value}`}
          name={"showPrintout"}
        />

        <ReactSelect
          placeholderName={t("Hide Rate")}
          //id={"hideRate"}
          searchable={true}
          removeIsClearable={true}
          respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          dynamicOptions={yesOrNoOption}
          handleChange={handleSelect}
          value={`${values?.hideRate?.value}`}
          name={"hideRate"}
        />

        <ReactSelect
          placeholderName={t("Co-Payment On")}
          //id={"CoPaymentOn"}
          searchable={true}
          removeIsClearable={true}
          respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          dynamicOptions={CoPaymentOn}
          handleChange={handleSelect}
          value={`${values?.CoPaymentOn?.value}`}
          name={"CoPaymentOn"}
        />

        <Input
          type="text"
          className="form-control"
          //id="copayments"
          name="copayments"
          value={values?.copayments}
          onChange={handleChange}
          lable={t("Co-Payment In %")}
          placeholder=""
          respclass="col-xl-2 col-md-4 col-sm-4 col-12"
        />

        <ReactSelect
          placeholderName={t("Rate Currency")}
          //id={"rateCurrency"}
          searchable={true}
          removeIsClearable={true}
          respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          dynamicOptions={dropdownList?.currencyList}
          handleChange={handleSelect}
          value={values?.rateCurrency?.value}
          name={"rateCurrency"}
        />
        <ReactSelect
          placeholderName={t("Panel Type")}
          //id={"panelType"}
          searchable={true}
          removeIsClearable={true}
          respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          dynamicOptions={PanelType}
          handleChange={handleSelect}
          value={`${values?.panelType?.value}`}
          name={"panelType"}
        />

        <ReactSelect
          placeholderName={t("Bill Currency")}
          //id={"billCurrency"}
          searchable={true}
          removeIsClearable={true}
          respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          dynamicOptions={dropdownList?.currencyList}
          handleChange={handleSelect}
          value={`${values?.billCurrency?.value}`}
          name={"billCurrency"}
        />

        <Input
          type="text"
          className="form-control"
          //id="CurrencyConv"
          name="CurrencyConv"
          value={values?.CurrencyConv}
          onChange={handleChange}
          lable={t("Currency Conversion")}
          placeholder=""
          respclass="col-xl-2 col-md-4 col-sm-4 col-12"
        />

        <ReactSelect
          placeholderName={t("Follow Rate(OPD)")}
          //id={"fallowrateopd"}
          searchable={true}
          removeIsClearable={true}
          respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          dynamicOptions={dropdownList?.panelList}
          handleChange={handleSelect}
          value={`${values?.fallowrateopd?.value}`}
          name={"fallowrateopd"}
        />

        <ReactSelect
          placeholderName={t("Follow Rate(IPD)")}
          //id={"fallowrateopd"}
          searchable={true}
          removeIsClearable={true}
          respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          dynamicOptions={dropdownList?.panelList}
          handleChange={handleSelect}
          value={`${values?.fallowrateipd?.value}`}
          name={"fallowrateipd"}
        />

        <ReactSelect
          placeholderName={t("Cover Note")}
          //id={"coverNote"}
          searchable={true}
          removeIsClearable={true}
          respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          dynamicOptions={yesOrNoOption}
          handleChange={handleSelect}
          value={`${values?.coverNote?.value}`}
          name={"coverNote"}
        />
        <div className="col-xl-2 col-md-4 col-sm-4 col-12 mb-2">
          <LabeledInput label={t("Note")} value={t("CO-Payment Payable By Patient")} />
        </div>

        <Input
          type="text"
          className="form-control"
          //id="creditlimitpercent"
          name="creditlimitpercent"
          value={values?.creditlimitpercent}
          onChange={handleChange}
          lable={t("Credit Limit In %")}
          placeholder=""
          respclass="col-xl-2 col-md-4 col-sm-4 col-12"
        />

        <ReactSelect
          placeholderName={t("IS CTB Applicable")}
          //id={"isctbApplicable"}
          searchable={true}
          removeIsClearable={true}
          respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          dynamicOptions={yesOrNoOption}
          handleChange={handleSelect}
          value={`${values?.isctbApplicable?.value}`}
          name={"isctbApplicable"}
        />

        <div className="col-12 text-right">
          <button className="btn btn-sm btn-success px-4" type="button" onClick={handleSave}>
            {t(data?.PanelID ? "Update" : "Save")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePanel;
