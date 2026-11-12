import React, { useEffect, useState } from "react";
import Input from "../../../formComponent/Input";
import {
  BindTerms,
  UpdateVendor,
} from "../../../../networkServices/InventoryApi";
import { useLocalStorage } from "../../../../utils/hooks/useLocalStorage";
import {
  handleReactSelectDropDownOptions,
  inputBoxValidation,
  notify,
} from "../../../../utils/utils";
import ReactSelect from "../../../formComponent/ReactSelect";
import { LoadCurrencyDetail } from "../../../../networkServices/PaymentGatewayApi";
import {
  getBindCountryList,
  getBindStateList,
} from "../../../../networkServices/ReportsAPI";
import Heading from "../../../UI/Heading";
import Tables from "../../../UI/customTable";
import { MOBILE_NUMBER_VALIDATION_REGX } from "../../../../utils/constant";
import { useTranslation } from "react-i18next";

const ViewVendorMasterModal = ({
  handeAdd,
  view,
  setModalData,
  handleSearch,
  payload1,
  errors,
  setErrors,
  termsSelected,
  setTermsSelected,
  setTableData,
}) => {
  // console.log("setTableData", setTableData);
  const [t] = useTranslation();
  const ip = useLocalStorage("ip", "get");
  const [payload, setPayload] = useState(payload1);
  const [TermsCondition, setTermsCondition] = useState([]);
  console.log("Terms&Conditions", TermsCondition);
  const [DropDownState, setDropDownState] = useState({
    SupplierCurrencyData: [],
  });

  const isMobile = window.innerWidth > 1000;
  const [error, setError] = useState("");
  useEffect(() => {
    // console.log("Pyalaload", payload);
  }, [payload]);

  // console.log("SelectedIds from the useEffect:" , selectedIds)
  useEffect(() => {
    if (termsSelected?.length > 0) {
      setSelectedIds(
        termsSelected.map((term) => ({
          termsId: Number(term.TermsID), // Convert ID to number for consistency
          termsName: term.TermsName,
        }))
      );
    }
  }, [termsSelected]); // Runs when `termsSelected` changes

  const [apiData, setApiData] = useState({
    getCountry: [],
    getState: [],
    getDistrict: [],
    getCity: [],
  });
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    fetchCurrencyDetail();
    fetchTermsCondition();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getBindCountryList();
        const dataState = await getBindStateList(14);
        setApiData((prev) => ({
          ...prev,
          getState: handleReactSelectDropDownOptions(
            dataState?.data,
            "StateName",
            "StateID"
          ),
        }));
        const statusOptions = handleReactSelectDropDownOptions(
          dataState?.data,
          "StateName",
          "StateID"
        );
        const countryOptions = handleReactSelectDropDownOptions(
          data?.data,
          "Name",
          "CountryID"
        );

        // Find Default CountryID (14)
        // debugger;
        const defaultCountry =
          countryOptions.find((country) => country.value === 14) || null;
        const defaultStatus =
          statusOptions.length > 0 ? statusOptions[0] : null;
        setApiData((prev) => ({
          ...prev,
          getCountry: countryOptions,
        }));
        // setPayload((prev) => ({
        //   ...prev,
        //   Country: defaultCountry,
        //   State: defaultStatus,
        // }));
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "AccountNo" && value.length > 14) {
      setError("Account number cannot exceed 14 digits.");
      return;
    } else {
      setError("");
    }

    if (name === "City") {
      setPayload((prevPayload) => ({
        ...prevPayload,
        [name]: value,
      }));
    }

    setPayload((prevPayload) => {
      const updatedPayload = {
        ...prevPayload,
        [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
      };

      if (!view) {
        handeAdd(updatedPayload, selectedIds);
      }
      console.log("UpdatedPayload", updatedPayload);
      return updatedPayload;
    });
  };

  console.log("SelectedId's", selectedIds);

  const AddEditItems = () => {
    console.log("view", view, selectedIds);

    const newTableData = {
      Name: view?.VendorName || "",
      SupplierType: view?.VendorType || "",
      Category: view?.VendorCategory || "",
      SupplierCode: view?.VendorCode || "",
      Address1: view?.Address1 || "",
      Address2: view?.Address2 || "",
      Address3: view?.Address3 || "",
      PostalCode: view?.Pin || "",
      City: view?.City || "",
      Country: view?.CountryID || "",
      ContactPerson: view?.ContactPerson || "",
      TelephoneNo: view?.Mobile || "",
      BankName: view?.Bank || "",
      AccountNo: view?.AccountNo || "",
      ShipmentDetail: view?.ShipmentDetail || "",
      TINNo: view?.VATNo || "",
      PanNo: view?.Pan_No || "",
      State: view?.StateID || "",
      CreditDays: view?.creditdays || "",
      EMail: view?.Email || "",
      IsInsuranceProvider: view?.IsInsurance || 0,
      isAssetActive: view?.IsAsset === true ? 1 : 0,
      SupplierCurrency: view?.Currency,
      DLNo: view?.DL_No || "",
      GSTIN: view?.Ven_GSTINNo || "",
      PaymentType: view?.PaymentMode || "",
      termsList: selectedIds,
    };
    console.log("NewTableData", newTableData);

    setPayload(newTableData);
  };
  // console.log("");

  useEffect(() => {
    AddEditItems();
  }, [view]);

  const handleUpdateManufacture = async () => {
    // console.log("payloaded", payload);
    try {
      const Itempayload = {
        Vendor_ID: view.Vendor_ID,
        supplierName: payload.Name,
        storeID: "",
        contactPerson: payload.ContactPerson || "",
        address1: payload.Address1 || "",
        address2: payload.Address2 || "",
        address3: payload.Address3 || "",
        country: "",
        city: payload.City || "",
        area: "",
        pin: payload.PostalCode || "",
        telephone: payload.TelephoneNo || "",
        fax: "",
        mobile: payload.TelephoneNo || "",
        drugLicence: payload.DLNo || "",
        vatNo: payload.TINNo,
        tinNo: payload.TINNo || "",
        vendorCode: payload?.SupplierCode || "",
        vendorType: String(payload?.SupplierType) || "",
        vendorCategory: payload?.Category || "",
        bank: payload.BankName,
        accountNo: payload.AccountNo || "",
        paymentMode: payload.PaymentType || "",
        shipmentDetail: payload.ShipmentDetail || "",
        email: payload?.EMail,
        lastUpdatedBy: "",
        updateDate: new Date().toISOString(),
        ipAddress: "",
        creditDays: payload.CreditDays || "",
        supplierTypeID: 0,
        isActive: 1,
        venGSTINNo: payload.GSTIN,
        deptLedgerNo: "",
        stateID: payload?.State || 0,
        countryID: payload?.Country,
        isAsset: payload?.isAssetActive,
        coA_ID: 0,
        vatType: "",
        currency: payload?.SupplierCurrency,
        isInsurance: payload?.IsInsuranceProvider === 1 ? true : false,
        dlNo: payload.DLNo || "",
        panNo: payload.PanNo || "",
        termsList: selectedIds,
      };

      console.log("Final Payload Before Save:", Itempayload);

      const response = await UpdateVendor(Itempayload);

      if (response?.success) {
        notify(response?.message, "success");
        setModalData(false);
        handleSearch();
        setTableData([]);
      } else {
        notify(response?.message, "error");
      }
    } catch (error) {
      console.error("Something went wrong", error);
    }
  };

  const handleReactSelect = (name, value) => {
    setPayload((val) => ({ ...val, [name]: value?.value || "" }));
    if (name == "Country") {
      GetBindStateList(value?.value);
    }
  };

  console.log("Handle React Select", payload);

  const GetBindStateList = async (value) => {
    try {
      const dataState = await getBindStateList(value);
      setApiData((prev) => ({
        ...prev,
        getState: handleReactSelectDropDownOptions(
          dataState?.data,
          "StateName",
          "StateID"
        ),
      }));
    } catch (error) {
      console.error("Error fetching state list:", error);
    }
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const allTerms = TermsCondition.map((ele) => ({
        termsId: Number(ele.Id),
        termsName: ele.Terms,
      }));
      setSelectedIds(allTerms);
      updatePayload(allTerms);
    } else {
      setSelectedIds([]);
      updatePayload([]);
    }
  };

  const fetchCurrencyDetail = async () => {
    try {
      const response = await LoadCurrencyDetail();
      if (response?.data) {
        const CurrencyDetail = response.data.map((item) => ({
          value: item.CountryID,
          label: item.Currency,
        }));
        setDropDownState((prevState) => ({
          ...prevState,
          SupplierCurrencyData: CurrencyDetail,
        }));
      }
    } catch (error) {
      console.error("Failed to load currency detail:", error);
    }
  };

  const fetchTermsCondition = async () => {
    try {
      const response = await BindTerms();
      if (response?.success) {
        setTermsCondition(response.data);
      } else {
        setTermsCondition([]);
      }
    } catch (error) {
      console.error("Failed to load currency detail:", error);
    }
  };

  const Thead = [
    { name: t("S.No."), width: "3%" },
    // {
    //   name: (
    //     <input
    //       type="checkbox"
    //       onChange={handleSelectAll}
    //       checked={
    //         selectedIds.length === TermsCondition?.length &&
    //         TermsCondition?.length > 0
    //       }
    //     />
    //   ),
    //   width: "3%",
    // },
    {
      name: isMobile ? (
        <input
          type="checkbox"
          onChange={handleSelectAll}
          checked={
            selectedIds.length === TermsCondition?.length &&
            TermsCondition?.length > 0
          }
        />
      ) : (
        "Check"
      ),
    },
    t("Terms And Condition"),
  ];
  console.log("Asdasdasdasdasdas", selectedIds);
  const handleCheckboxChange = (event, item) => {
    setSelectedIds((prevSelected) => {
      let updatedSelection;

      if (event.target.checked) {
        // Add item to selected list
        updatedSelection = [
          ...prevSelected,
          { termsId: Number(item.Id), termsName: item.Terms },
        ];
      } else {
        // Remove item from selected list
        updatedSelection = prevSelected.filter(
          (ele) => Number(ele.termsId) !== Number(item.Id)
        );
      }
      if (!view) {
        handeAdd(payload, updatedSelection);
      }
      updatePayload(updatedSelection); // Sync payload with selected terms
      return updatedSelection;
    });
  };

  // Sync payload with selected terms
  const updatePayload = (updatedSelection) => {
    setPayload((prev) => ({
      ...prev,
      termsList: updatedSelection, // Ensure updated terms are included
    }));
  };

  // console.log("TermsCondition", payload);
  // console.log("selectedmmmmmmmmmmmmmmmmmIds", selectedIds);
  return (
    <>
      <div className="">
        <div className="row">
          <ReactSelect
            placeholderName={t("Supplier Type")}
            id={"SupplierType"}
            searchable={true}
            removeIsClearable={true}
            respclass="col-xl-2 col-md-2 colt-sm-6 col-12"
            dynamicOptions={[
              { label: "GENERAL", value: "GENERAL" },
              { label: "URGENT", value: "URGENT" },
              { label: "ASSET", value: "ASSET" },
            ]}
            name="SupplierType"
            handleChange={handleReactSelect}
            value={payload?.SupplierType}
            requiredClassName="required-fields"
          />
          <ReactSelect
            placeholderName={t("Category")}
            id={"Category"}
            searchable={true}
            removeIsClearable={true}
            respclass="col-xl-2 col-md-2 colt-sm-6 col-12"
            dynamicOptions={[
              { label: "Medical Item", value: "Medical Item" },
              { label: "General Item", value: "General Item" },
            ]}
            name="Category"
            handleChange={handleReactSelect}
            value={payload?.Category}
            requiredClassName="required-fields"
          />
          <Input
            type="text"
            className="form-control required-fields"
            id="SupplierCode"
            name="SupplierCode"
            value={payload?.SupplierCode}
            onChange={handleChange}
            lable={t("Supplier Code")}
            placeholder=" "
            respclass="col-xl-2 col-md-2 colt-sm-6 col-12"
          />
          <Input
            type="text"
            className="form-control required-fields"
            id="Name"
            name="Name"
            value={payload?.Name}
            onChange={handleChange}
            lable={t("Name")}
            placeholder=" "
            respclass="col-xl-2 col-md-2 colt-sm-6 col-12"
          />
          <Input
            type="text"
            className="form-control"
            id="Address1"
            name="Address1"
            value={payload?.Address1}
            onChange={handleChange}
            lable={t("Address1")}
            placeholder=" "
            respclass="col-xl-2 col-md-2 colt-sm-6 col-12"
          />
          <Input
            type="text"
            className="form-control"
            id="Address2"
            name="Address2"
            value={payload?.Address2}
            onChange={handleChange}
            lable={t("Address2")}
            placeholder=" "
            respclass="col-xl-2 col-md-2 colt-sm-6 col-12"
          />
          <Input
            type="text"
            className="form-control"
            id="Address3"
            name="Address3"
            value={payload?.Address3}
            onChange={handleChange}
            lable={t("Address3")}
            placeholder=" "
            respclass="col-xl-2 col-md-2 colt-sm-6 col-12"
          />
          <Input
            type="number"
            className="form-control"
            id="PostalCode"
            name="PostalCode"
            value={payload?.PostalCode}
            onChange={handleChange}
            lable={t("Postal Code")}
            placeholder=" "
            respclass="col-xl-2 col-md-2 colt-sm-6 col-12"
          />
          <Input
            type="text"
            className="form-control required-fields"
            id="City"
            name="City"
            value={payload?.City}
            onChange={handleChange}
            lable={t("City")}
            placeholder=" "
            respclass="col-xl-2 col-md-2 colt-sm-6 col-12"
          />
          <ReactSelect
            placeholderName={t("Country")}
            id={"Country"}
            searchable={true}
            removeIsClearable={true}
            respclass="col-xl-2 col-md-2 colt-sm-6 col-12"
            dynamicOptions={apiData.getCountry}
            name="Country"
            handleChange={handleReactSelect}
            value={payload?.Country}
            requiredClassName="required-fields"
          />
          <ReactSelect
            placeholderName={t("State")}
            id={"State"}
            searchable={true}
            removeIsClearable={true}
            respclass="col-xl-2 col-md-2 colt-sm-6 col-12"
            dynamicOptions={apiData.getState}
            name="State"
            handleChange={handleReactSelect}
            value={payload?.State}
            requiredClassName="required-fields"
          />
          <Input
            type="text"
            id="CreditDays"
            name="CreditDays"
            value={payload?.CreditDays}
            onChange={handleChange}
            lable={t("CreditDays")}
            placeholder=" "
            respclass="col-xl-2 col-md-2 colt-sm-6 col-12"
            className="form-control required-fields"
          />
          <Input
            type="text"
            className="form-control"
            id="ContactPerson"
            name="ContactPerson"
            value={payload?.ContactPerson}
            onChange={handleChange}
            lable={t("Contact Person")}
            placeholder=" "
            respclass="col-xl-2 col-md-2 colt-sm-6 col-12"
          />
          <Input
            type="number"
            // className="form-control"
            className={`form-control required-fields ${errors?.TelephoneNo && "required-fields-active"}`}
            id="TelephoneNo"
            name="TelephoneNo"
            value={payload?.TelephoneNo}
            // onChange={handleChange}
            onChange={(e) => {
              inputBoxValidation(
                MOBILE_NUMBER_VALIDATION_REGX,
                e,
                handleChange
              );
            }}
            lable={t("TelephoneNo")}
            placeholder=" "
            respclass="col-xl-2 col-md-2 colt-sm-6 col-12"
          />
          <Input
            type="text"
            className="form-control"
            id="EMail"
            name="EMail"
            value={payload?.EMail}
            onChange={handleChange}
            lable={t("Email")}
            placeholder=" "
            respclass="col-xl-2 col-md-2 colt-sm-6 col-12"
          />
          <Input
            type="text"
            className="form-control"
            id="BankName"
            name="BankName"
            value={payload?.BankName}
            onChange={handleChange}
            lable={t("BankName")}
            placeholder=" "
            respclass="col-xl-2 col-md-2 colt-sm-6 col-12"
          />{" "}
          <Input
            type="number"
            className="form-control"
            id="AccountNo"
            name="AccountNo"
            value={payload?.AccountNo}
            onChange={handleChange}
            lable={t("AccountNo")}
            placeholder=" "
            respclass="col-xl-2 col-md-2 colt-sm-6 col-12"
          />
          <ReactSelect
            placeholderName={t("Payment Type")}
            id={"PaymentType"}
            searchable={true}
            removeIsClearable={true}
            respclass="col-xl-2 col-md-2 colt-sm-6 col-12"
            dynamicOptions={[
              { label: "CASH", value: "CASH" },
              { label: "CREDIT", value: "CREDIT" },
            ]}
            name="PaymentType"
            handleChange={handleReactSelect}
            value={payload?.PaymentType}
            requiredClassName="required-fields"
          />
          <Input
            type="text"
            className="form-control"
            id="ShipmentDetail"
            name="ShipmentDetail"
            value={payload?.ShipmentDetail}
            onChange={handleChange}
            lable={t("Shipment Detail")}
            placeholder=" "
            respclass="col-xl-2 col-md-2 colt-sm-6 col-12"
          />
          <Input
            type="text"
            className="form-control"
            id="TINNo"
            name="TINNo"
            value={payload?.TINNo}
            onChange={handleChange}
            lable={t("TIN No")}
            placeholder=" "
            respclass="col-xl-2 col-md-2 colt-sm-6 col-12"
          />
          <Input
            type="text"
            className="form-control"
            id="DLNo"
            name="DLNo"
            value={payload?.DLNo}
            onChange={handleChange}
            lable={t("DL No")}
            placeholder=" "
            respclass="col-xl-2 col-md-2 colt-sm-6 col-12"
          />
          <Input
            type="text"
            className="form-control"
            id="PanNo"
            name="PanNo"
            value={payload?.PanNo}
            onChange={handleChange}
            lable={t("Pan No.")}
            placeholder=" "
            respclass="col-xl-2 col-md-2 colt-sm-6 col-12"
          />
          <Input
            type="text"
            className="form-control required-fields"
            id="GSTIN"
            name="GSTIN"
            value={payload?.GSTIN}
            onChange={handleChange}
            lable={t("GSTINNo")}
            placeholder=" "
            respclass="col-xl-2 col-md-2 colt-sm-6 col-12"
          />
          <ReactSelect
            placeholderName={t("Supplier Currency")}
            id={"SupplierCurrency"}
            searchable={true}
            removeIsClearable={true}
            name={"SupplierCurrency"}
            respclass="col-xl-2 col-md-2 col-sm-6 col-12"
            style={{ width: "100px" }}
            dynamicOptions={DropDownState.SupplierCurrencyData} // Ensure you use the correct data for manufacturers
            handleChange={handleReactSelect} //{(val, e) => handleInputChangeCurrency(val, e, 'Currency')} // Pass index here
            value={payload?.SupplierCurrency}
          />
          {/* <Input
          type="text"
          className="form-control"
          id="State"
          name="State"
          value={payload?.State}
          onChange={handleChange}
          lable={"State"}
          placeholder=" "
          respclass="col-xl-2 col-md-2 colt-sm-6 col-12"
        /> */}
          {/* <div className="col-sm-12 d-flex text-right justify-content-end">
          <input
            type="checkbox"
            placeholder=" "
            // className="mt-2"
            name="isAssetActive"
            id={"isAssetActive"}
            onChange={handleChange}
            checked={payload.isAssetActive}
            // respclass="col-md-1 col-1"
          />
          <label className="p-2">Is Asset</label>
          <input
            type="checkbox"
            placeholder=" "
            // className="mt-2"
            name="IsInsuranceProvider"
            id={"IsInsuranceProvider"}
            onChange={handleChange}
            checked={payload?.IsInsuranceProvider}
            // respclass="col-md-1 col-1"
          />
          <label className="p-2">Is Insurance Provider</label>
          {view && (
            <>
              <button
                className="btn btn-sm btn-success mx-2"
                onClick={handleUpdateManufacture}
              >
                Update
              </button>
              <button
                className="btn btn-sm btn-success mx-2"
                // onClick={() => setModalData((val) => ({ ...val, visible: false }))}
              >
                Cancle
              </button>
            </>
          )}
        </div> */}
          <div className="col-sm-12 d-flex justify-content-end align-items-center">
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
                {t("Is Asset")}
              </label>
            </div>

            <div className="form-check d-flex align-items-center me-3">
              <input
                type="checkbox"
                className="form-check-input me-2"
                name="IsInsuranceProvider"
                id="IsInsuranceProvider"
                onChange={handleChange}
                checked={payload?.IsInsuranceProvider}
              />
              <label
                className="form-check-label mx-2"
                style={{ fontWeight: "bold" }}
                htmlFor="IsInsuranceProvider"
              >
                {t("Is Insurance Provider")}
              </label>
            </div>

            {view && (
              <>
                <button
                  className="btn btn-sm btn-success mx-2"
                  onClick={handleUpdateManufacture}
                >
                  {t("Update")}
                </button>
                <button
                  className="btn btn-sm btn-danger mx-2"
                  onClick={() => {
                    setModalData(false);
                    setTableData([]);
                  }}
                >
                  {t("Cancel")}
                </button>
              </>
            )}
          </div>
        </div>
        {TermsCondition.length > 0 && (
          <div className="card mt-3">
            <Heading title={t("Item Details")} />

            <Tables
              thead={Thead}
              tbody={TermsCondition?.map((ele, index) => ({
                SrNo: index + 1,
                Id: (
                  <input
                    type="checkbox"
                    value={ele?.Id}
                    checked={selectedIds.some(
                      (item) => Number(item.termsId) === Number(ele?.Id)
                    )}
                    onChange={(e) => handleCheckboxChange(e, ele)}
                  />
                ),
                Terms: ele?.Terms,
              }))}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default ViewVendorMasterModal;
