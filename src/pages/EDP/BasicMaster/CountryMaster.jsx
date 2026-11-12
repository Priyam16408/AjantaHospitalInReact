import React, { useEffect, useState } from "react";
import Heading from "../../../components/UI/Heading";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import { useTranslation } from "react-i18next";
import Input from "../../../components/formComponent/Input";
import TextAreaInput from "../../../components/formComponent/TextAreaInput";
import {
  LoadCountry,
  LoadCountryByID,
  SaveCountryMaster,
  UpdateCountryMaster,
} from "../../../networkServices/EDP/pragyaedp";
import { handleReactSelectDropDownOptions, notify } from "../../../utils/utils";

const CountryMaster = ({data}) => {
  const [t] = useTranslation();

  const initialState = {
    Edit: {
      label: "Add",
      value: "1",
    },
    CountryName: "",
    CountryNameSelect: null,
    Currency: "",
    IsBaseCurrency: "",
    Notation: "",
    Status: "",
    CounsellarAddress: "",
    CounsellarPhoneNo: "",
    CounsellarFax: "",
    EmbassyAddress: "",
    EmbassyPhoneNo: "",
    EmbassyFax: "",
  };

  const [values, setValues] = useState({ ...initialState });
  const [tableData, setTableData] = useState([]);
  const [countryNames, setCountryNames] = useState([]);
  const [loading, setLoading] = useState(false);

  const isAddMode = values?.Edit?.value === "1";

  const resetForm = () => {
    const currentMode = values.Edit;
    setValues({
      ...initialState,
      Edit: currentMode,
    });
  };

  const handleSelect = (name, value) => {
    if (name === "Edit") {
      setValues({
        ...initialState,
        Edit: value,
      });
      return;
    }

    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (
      name === "CountryNameSelect" &&
      value &&
      value.value !== "0" &&
      value.value !== "ALL"
    ) {
      fetchCountryDetails(value.value);
    }
  };
  const fetchCountryDetails = async (countryId) => {
    try {
      setLoading(true);
      const apiResp = await LoadCountryByID(countryId);

      if (apiResp.success && apiResp.data && apiResp.data.length > 0) {
        const countryData = apiResp.data[0];

        setValues((prev) => ({
          ...prev,
          CountryName: countryData.NAME || "",
          Currency: countryData.CURRENCY || countryData.Currency || "",
          IsBaseCurrency: countryData.IS_BASE_CURRENCY
            ? { label: "Yes", value: "1" }
            : { label: "No", value: "2" },
          Notation: countryData.NOTATION || countryData.Notation || "",
          Status: countryData.IS_ACTIVE
            ? { label: "Active", value: "1" }
            : { label: "DeActive", value: "2" },
          CounsellarAddress:
            countryData.COUNSELLOR_ADDRESS || countryData.Address || "",
          CounsellarPhoneNo:
            countryData.COUNSELLOR_PHONE || countryData.PhoneNo || "",
          CounsellarFax: countryData.COUNSELLOR_FAX || countryData.FaxNo || "",
          EmbassyAddress:
            countryData.EMBASSY_ADDRESS || countryData.EmbassyAddress || "",
          EmbassyPhoneNo:
            countryData.EMBASSY_PHONE || countryData.EmbassyPhoneNo || "",
          EmbassyFax: countryData.EMBASSY_FAX || countryData.EmbessyFaxNo || "",
        }));
      } else {
        notify("Failed to load country details", "error");
      }
    } catch (error) {
      console.error("Error loading country details:", error);
      notify("An error occurred while loading country details", "error");
    } finally {
      setLoading(false);
    }
  };

  const EditableOptions = [
    { label: "Add", value: "1" },
    { label: "Edit", value: "2" },
  ];

  const CurrencyOptions = [
    { label: "Yes", value: "1" },
    { label: "No", value: "2" },
  ];

  const StatusBar = [
    { label: "Active", value: "1" },
    { label: "DeActive", value: "2" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "CounsellarPhoneNo" || name === "EmbassyPhoneNo") {
      const numericValue = value.replace(/\D/g, "");
      setValues((prev) => ({ ...prev, [name]: numericValue }));
    } else {
      setValues((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSaveMaster = async () => {
    if (!values.CountryName) {
      notify("Country name is required", "warning");
      return;
    }

    let payload = {
      isBaseCurrency: Number(values?.IsBaseCurrency?.value) || 0,
      countryname: values?.CountryName,
      currency: values?.Currency,
      counsellorAddress: values?.CounsellarAddress,
      faxNoCounsellor: values?.CounsellarFax,
      phoneNoCounsellor: values?.CounsellarPhoneNo,
      notation: values?.Notation,
      addressEmbassy: values?.EmbassyAddress,
      phoneNoEmbassy: values?.EmbassyPhoneNo,
      faxNoEmbassy: values?.EmbassyFax,
      isactive: values?.Status?.value === "1" ? 1 : 0,
    };

    try {
      setLoading(true);
      let apiResp = await SaveCountryMaster(payload);
      if (apiResp?.success) {
        notify(apiResp?.message, "success");
        handleLoadCountry();
        resetForm();
      } else {
        console.log(apiResp?.message);
        notify(apiResp?.message || "Save failed", "error");
      }
    } catch (error) {
      console.error("Save error:", error);
      notify("An error occurred during save", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleLoadCountry = async () => {
    try {
      setLoading(true);
      const apiResp = await LoadCountry();
      if (apiResp.success) {
        setCountryNames(apiResp?.data);
      } else {
        notify(apiResp?.message, "error");
        setTableData(apiResp?.data || []);
      }
    } catch (error) {
      console.error("Error loading country data:", error);
      notify("An error occurred while loading country data", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateMaster = async () => {
    if (!values.CountryNameSelect || values.CountryNameSelect.value === "0") {
      notify("Please select a country to update", "warning");
      return;
    }

    if (!values.CountryName) {
      notify("Country name is required", "warning");
      return;
    }

    let payload = {
      isBaseCurrency: Number(values?.IsBaseCurrency?.value) || 0,
      countryname: values?.CountryName,
      currency: values?.Currency,
      counsellorAddress: values?.CounsellarAddress,
      faxNoCounsellor: values?.CounsellarFax,
      phoneNoCounsellor: values?.CounsellarPhoneNo,
      notation: values?.Notation,
      addressEmbassy: values?.EmbassyAddress,
      phoneNoEmbassy: values?.EmbassyPhoneNo,
      faxNoEmbassy: values?.EmbassyFax,
      isactive: values?.Status?.value === "1" ? 1 : 0,
      countryId: values?.CountryNameSelect?.value,
    };

    try {
      setLoading(true);
      let apiResp = await UpdateCountryMaster(payload);
      if (apiResp?.success) {
        notify(apiResp?.message, "success");
        handleLoadCountry();
        resetForm();
      } else {
        console.log(apiResp?.message);
        notify(apiResp?.message || "Update failed", "error");
      }
    } catch (error) {
      console.error("Update error:", error);
      notify("An error occurred during update", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleLoadCountry();
  }, []);

  return (
    <>
      <div className="mt-2 card">
        <Heading
          title={data?.breadcrumb}
            // isMainHeading={{ data: data, FrameMenuID: data?.FrameMenuID }}
        data={data}
          isSlideScreen={true}
          isBreadcrumb={true}
        />
        <div className="row p-2">
          <ReactSelect
            placeholderName={t("Type")}
            removeIsClearable={true}
            name="Edit"
            value={values?.Edit}
            handleChange={handleSelect}
            dynamicOptions={EditableOptions}
            searchable={true}
            respclass="col-xl-2.5 col-md-2 col-sm-4 col-12"
            defaultValue={initialState.Edit}
          />

          {isAddMode ? (
            <Input
              type="text"
              className="form-control required-fields"
              id="CountryName"
              name="CountryName"
              value={values?.CountryName}
              onChange={handleChange}
              lable={t("Country Name")}
              placeholder=" "
              respclass="col-xl-2.5 col-md-2 col-sm-4 col-12"
              style={{ width: "100%" }}
            />
          ) : (
            <ReactSelect
              placeholderName={t("Country Name")}
              id={"CountryNameSelect"}
              searchable={true}
              removeIsClearable={true}
              respclass="col-xl-2.5 col-md-2 col-sm-4 col-12"
              dynamicOptions={[
                { value: "0", label: "Select Country" },
                ...handleReactSelectDropDownOptions(
                  countryNames,
                  "NAME",
                  "CountryID"
                ),
              ]}
              handleChange={handleSelect}
              value={values?.CountryNameSelect}
              name={"CountryNameSelect"}
            />
          )}

          <Input
            type="text"
            className="form-control required-fields w-100"
            id="Currency"
            name="Currency"
            value={values?.Currency}
            onChange={handleChange}
            lable={t("Currency")}
            placeholder=" "
            respclass="col-xl-2.5 col-md-2 col-sm-4 col-12"
            style={{ width: "100%" }}
          />

          <ReactSelect
            placeholderName={t("Is Base Currency")}
            removeIsClearable={true}
            name="IsBaseCurrency"
            value={values?.IsBaseCurrency}
            handleChange={handleSelect}
            dynamicOptions={CurrencyOptions}
            searchable={true}
            respclass="col-xl-2.5 col-md-2 col-sm-4 col-12"
          />

          <Input
            type="text"
            className="form-control required-fields"
            id="Notation"
            name="Notation"
            value={values?.Notation}
            onChange={handleChange}
            lable={t("Notation")}
            placeholder=" "
            respclass="col-xl-2.5 col-md-2 col-sm-4 col-12"
            style={{ width: "100%" }}
          />

          <ReactSelect
            placeholderName={t("Status")}
            removeIsClearable={true}
            name="Status"
            value={values?.Status}
            handleChange={handleSelect}
            dynamicOptions={StatusBar}
            searchable={true}
            respclass="col-xl-2.5 col-md-2 col-sm-4 col-12"
          />

          <TextAreaInput
            type="text"
            className="form-control required-fields"
            id="CounsellarAddress"
            name="CounsellarAddress"
            value={values?.CounsellarAddress}
            onChange={handleChange}
            lable={t("Counsellar Address")}
            placeholder=" "
            respclass="col-xl-2.5 col-md-2 col-sm-4 col-12"
            style={{ width: "100%" }}
          />

          <Input
            type="text"
            className="form-control"
            id="CounsellarPhoneNo"
            name="CounsellarPhoneNo"
            value={values?.CounsellarPhoneNo}
            onChange={handleChange}
            lable={t("Counsellar Phone No.")}
            placeholder=" "
            respclass="col-xl-2.5 col-md-2 col-sm-4 col-12"
            style={{ width: "100%" }}
          />

          <Input
            type="text"
            className="form-control"
            id="CounsellarFax"
            name="CounsellarFax"
            value={values?.CounsellarFax}
            onChange={handleChange}
            lable={t("Counsellar Fax")}
            placeholder=" "
            respclass="col-xl-2.5 col-md-2 col-sm-4 col-12"
            style={{ width: "100%" }}
          />

          <TextAreaInput
            type="text"
            className="form-control required-fields"
            id="EmbassyAddress"
            name="EmbassyAddress"
            value={values?.EmbassyAddress}
            onChange={handleChange}
            lable={t("Embassy Address")}
            placeholder=" "
            respclass="col-xl-2.5 col-md-2 col-sm-4 col-12"
            style={{ width: "100%" }}
          />

          <Input
            type="text"
            className="form-control"
            id="EmbassyPhoneNo"
            name="EmbassyPhoneNo"
            value={values?.EmbassyPhoneNo}
            onChange={handleChange}
            lable={t("Embassy Phone No.")}
            placeholder=" "
            respclass="col-xl-2.5 col-md-2 col-sm-4 col-12"
            style={{ width: "100%" }}
          />

          <Input
            type="text"
            className="form-control"
            id="EmbassyFax"
            name="EmbassyFax"
            value={values?.EmbassyFax || ""}
            onChange={handleChange}
            lable={t("Embassy Fax")}
            placeholder=" "
            respclass="col-xl-2.5 col-md-2 col-sm-4 col-12"
            style={{ width: "100%" }}
          />

          <div className="col-12 d-flex justify-content-end mt-3 gap-2">
            {loading ? (
              <span
                className="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
              ></span>
            ) : isAddMode ? (
              <button
                className="btn btn-sm btn-success py-1 px-2"
                style={{ width: "70px" }}
                onClick={handleSaveMaster}
                disabled={loading}
              >
                {" "}
                {t("Save")}
              </button>
            ) : (
              <button
                className="btn btn-sm btn-success py-1 px-2"
                style={{ width: "70px" }}
                onClick={handleUpdateMaster}
                disabled={loading}
              >
                {t("Update")}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CountryMaster;
