import React, { useEffect, useState } from "react";
import Heading from "../../../components/UI/Heading";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import { useTranslation } from "react-i18next";
import Input from "../../../components/formComponent/Input";
import {
  getBindCountryList,
  getBindDistrictList,
  getBindStateList,
} from "../../../networkServices/ReportsAPI";
import {
  handleReactSelectDropDownOptions,
  isArrayFunction,
} from "../../../utils/utils";
import {
  EDPCityInsert,
  EDPDeleteCity,
  EDPDeleteDistrict,
  EDPDeleteState,
  EDPDistrictInsert,
  EDPGetCityByCountryStateDistrictID,
  EDPGetDistrictByCountryAndStateID,
  EDPGetStateByCountryID,
  EDPInsertState,
  EDPUpdateCity,
  EDPUpdateDistrict,
  EDPUpdateState,
} from "../../../networkServices/EDP/govindedp";
import Tables from "../../../components/UI/customTable";
import { notify } from "../../../utils/ustil2";

const AddMaster = ({ data }) => {
  const [t] = useTranslation();

  const initialState = {
    IsActive: {
      label: "Active",
      value: "1",
    },
    SelectMaster: {
      label: "State",
      value: "1",
    },
    State: "",
    Country: {
      label: "",
      CountryID: "",
    },
    isEdit: 0,
  };

  const THEAD = [
    { name: t("S.No.") },
    { name: t("State Name") },
    { name: t("Active") },
    { name: t("Edit") },
    { name: t("Delete") },
  ];
  const THEADdata = [
    { name: t("S.No.") },
    { name: t("District Name") },
    { name: t("Active") },
    { name: t("Edit") },
    { name: t("Delete") },
  ];
  const cityTHEAD = [
    { name: t("S.No.") },
    { name: t("City Name") },
    { name: t("Active") },
    { name: t("Edit") },
    { name: t("Delete") },
  ];
  const [apiData, setApiData] = useState({
    getCountry: [],
  });

  const [values, setValues] = useState({ ...initialState });
  const [countryData, setCountryData] = useState([]);
  const [districtData, setDistrictData] = useState([]);
  const [cityTable, setCityTable] = useState([]);

  const handleReactSelect = (label, value) => {
    if (label === "SelectMaster") {
      setValues((val) => ({
        ...val,
        [label]: value,
        State: "",
        Country: { label: "", CountryID: "" },
        isEdit: 0,
      }));
      setDistrictData([]);
      setCityTable([]);
      setCountryData([]);
    }
    setValues((val) => ({ ...val, [label]: value }));
  };

  const handleInputChange = (e, index, label) => {
    const { name, value } = e.target;
    setValues((val) => ({ ...val, [label]: value }));
  };

  const fetchCountry = async () => {
    try {
      const data = await getBindCountryList();
      setApiData((prev) => ({
        ...prev,
        getCountry: handleReactSelectDropDownOptions(
          data?.data,
          "Name",
          "CountryID"
        ),
      }));
    } catch (err) {
      console.log(err);
    }
  };

  const fetchState = async () => {
    try {
      const payload = {
        countryID: values?.Country?.CountryID,
      };
      // ;
      const dataState = await getBindStateList(payload);

      const countryData = await EDPGetStateByCountryID(payload);

      if (countryData?.success) {
        setCountryData(countryData?.data);
      }
      if (dataState?.success) {
        setApiData((prev) => ({
          ...prev,
          getState: handleReactSelectDropDownOptions(
            dataState?.data,
            "StateName",
            "StateID"
          ),
        }));
      }
    } catch (err) {
      console.log(err);
    }
  };

  const fetchDistrict = async () => {
    try {
      const payload = {
        countryId: values?.Country?.CountryID,
        StateId: values?.State?.value,
      };
      const dataDistrict = await getBindDistrictList(payload);
      const districtData = await EDPGetDistrictByCountryAndStateID(payload);
      if (districtData?.success) {
        setDistrictData(districtData?.data);
      }
      //   
      if (dataDistrict?.success) {
        setApiData((prev) => ({
          ...prev,
          getDistrict: handleReactSelectDropDownOptions(
            dataDistrict?.data,
            "District",
            "DistrictID"
          ),
        }));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (ele, name) => {
    // ;
    if (name === "State") {
      const payload = {
        StateID: ele?.StateID,
      };
      const response = await EDPDeleteState(payload?.StateID);

      if (response?.success) {
        notify("State Deleted Successfully", "success");
        fetchState();
      } else {
        notify(response?.message, "error");
      }
    }
    if (name === "District") {
      const payload = {
        DistrictID: ele?.DistrictID,
      };
      // ;
      const response = await EDPDeleteDistrict(payload?.DistrictID);
      if (response?.success) {
        notify(response?.message, "success");
        fetchDistrict();
      }
    }
    if (name === "City") {
      const payload = {
        CityID: ele?.ID,
      };
      const response = await EDPDeleteCity(payload?.CityID);
      if (response?.success) {
        notify("City Deleted", "success");
        fetchCityTableData();
      }
    }
  };

  const handleEdit = (ele, name) => {
    // ;
    console.log("ele", ele);

    if (name === "State") {
      setValues({
        ...values,
        SelectMaster: { label: "State", value: "1" },
        State: ele?.StateName,
        StateID: ele?.StateID,
        IsActive:
          ele?.Active === "Yes"
            ? { label: "Active", value: "1" }
            : { label: "Inactive", value: "0" },
        isEdit: 1,
      });
    }
    if (name === "District") {
      setValues({
        ...values,
        SelectMaster: { label: "District", value: "0" },
        District: ele?.District,
        IsActive:
          ele?.Active === "Yes"
            ? { label: "Active", value: "1" }
            : { label: "Inactive", value: "0" },
        isEdit: 1,
        StateID: ele?.StateID,
        CountryID: ele?.CountryID,
        DistrictID: ele?.DistrictID,
      });
    }
    if (name === "City") {
      setValues({
        ...values,
        SelectMaster: { label: "City", value: "2" },
        City: ele?.City,
        IsActive:
          ele?.Active === "Yes"
            ? { label: "Active", value: "1" }
            : { label: "Inactive", value: "0" },
        isEdit: 1,
        stateID: ele?.stateID,
        ID: ele?.ID,
        CountryID: ele?.Country,
        districtID: ele?.districtID,
      });
    }
  };

  useEffect(() => {
    if (values?.State?.value) {
      fetchDistrict();
    }
  }, [values?.State?.value]);

  useEffect(() => {
    if (values?.Country?.CountryID) {
      fetchState();
    }
  }, [values?.Country?.CountryID]);

  useEffect(() => {
    fetchCountry();
  }, []);

  const handleSave = async (name) => {
    if (name === "State") {
      const payload = {
        countryID: values?.Country?.CountryID,
        stateName: values?.State,
      };

      const response = await EDPInsertState(payload);
      if (response?.success) {
        notify("State Saved Successfully", "success");
        fetchState();
      } else {
        notify(response?.message, "error");
      }
    }

    if (name === "District") {
      if (!values?.Country?.CountryID) {
        notify("Country is Required", "error");
        return;
      }
      if (!values?.State?.value) {
        notify("State is Required", "error");
        return;
      }
      if (!values?.District) {
        notify("District is Required", "error");
        return;
      }
      const payload = {
        district: values?.District,
        countryID: values?.Country?.CountryID,
        stateID: values?.State?.value,
      };
      const response = await EDPDistrictInsert(payload);
      if (response?.success) {
        notify("DistrictSaved Successfully", "success");
        fetchDistrict();
      } else {
        notify(response?.message, "error");
      }
    }

    if (name === "City") {
      if (!values?.Country?.CountryID) {
        notify("Country is Required", "error");
        return;
      }
      if (!values?.State?.value) {
        notify("State is Required", "error");
        return;
      }
      if (!values?.City) {
        notify("City is Required", "error");
        return;
      }
      if (!values?.District?.DistrictID) {
        notify("District is Required", "error");
        return;
      }
      const payload = {
        city: values?.City,
        country: values?.Country?.CountryID,
        districtID: values?.District?.DistrictID,
        stateID: values?.State?.value,
      };
      const response = await EDPCityInsert(payload);
      if (response?.success) {
        notify("City Saved Successfully", "success");
        fetchCity();
      } else {
        notify(response?.message, "error");
      }
    }
  };

  const handleUpdate = async (name) => {
    if (name === "State") {
      const payload = {
        stateID: Number(values?.StateID),
        countryID: Number(values?.Country?.CountryID),
        stateName: String(values?.State),
        active: String(values?.IsActive?.value),
      };

      const response = await EDPUpdateState(payload);

      if (response?.success) {
        notify(response?.message, "success");
        fetchState();
        setValues((val) => ({
          ...val,
          State: "",
          isEdit: 0,
          District: "",
          State: "",
          Country: { label: "", CountryID: "" },
        }));
      } else {
        notify(response?.message, "error");
      }
    }
    if (name === "District") {
      const payload = {
        stateID: values?.StateID,
        countryID: values?.CountryID,
        districtName: values?.District,
        active: values?.IsActive?.value,
        districtID: values?.DistrictID,
      };

      const response = await EDPUpdateDistrict(payload);

      if (response?.success) {
        notify(response?.message, "success");
        fetchDistrict();
      } else {
        notify(response?.message, "error");
      }
    }
    ;
    if (name === "City") {
      const payload = {
        stateID: values?.State?.StateID,
        countryID: values?.CountryID,
        districtID: values?.District?.DistrictID,
        active: values?.IsActive?.value,
        cityName: values?.City,
        cityID: values?.ID,
      };

      const response = await EDPUpdateCity(payload);

      if (response?.success) {
        notify(response?.message, "success");
        fetchCityTableData();
        setValues((val) => ({
          ...val,
          isEdit: 0,
          City: "",
        }));
      } else {
        notify(response?.message, "error");
      }
    }
  };

  const fetchCityTableData = async () => {
    const payload = {
      countryID: values?.Country?.CountryID,
      stateID: values?.State?.value,
      districtID: values?.District?.DistrictID,
    };

    const response = await EDPGetCityByCountryStateDistrictID(payload);

    if (response?.success) {
      setCityTable(response?.data);
    } else {
      notify(response?.message, "error");
    }
  };

  useEffect(() => {
    if (values?.District?.DistrictID) {
      fetchCityTableData();
    }
  }, [values?.District?.DistrictID]);

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
        <ReactSelect
          placeholderName={t("Select Master")}
          name="SelectMaster"
          value={values?.SelectMaster?.value}
          handleChange={(name, e) => handleReactSelect(name, e)}
          dynamicOptions={[
            { label: "State", value: "1" },
            { label: "District", value: "0" },
            { label: "City", value: "2" },
          ]}
          searchable={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <ReactSelect
          placeholderName={t("Country")}
          name="Country"
          value={values?.Country?.value}
          handleChange={(name, e) => handleReactSelect(name, e)}
          dynamicOptions={apiData?.getCountry}
          searchable={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <ReactSelect
          placeholderName={t("Active")}
          name="IsActive"
          value={values?.IsActive?.value}
          handleChange={(name, e) => handleReactSelect(name, e)}
          dynamicOptions={[
            { label: "Active", value: "1" },
            { label: "Inactive", value: "0" },
          ]}
          searchable={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        {values?.SelectMaster?.value == 1 && (
          <Input
            type="text"
            className={"form-control required-fields"}
            lable={t("State Name")}
            placeholder=" "
            //   id="ItemName"
            name="State"
            onChange={(e) => handleInputChange(e, 0, "State")}
            value={values?.State}
            required={true}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          />
        )}
        {values?.SelectMaster?.value == 0 && (
          <>
            <Input
              type="text"
              className={"form-control required-fields"}
              lable={t("District Name")}
              placeholder=" "
              //   id="ItemName"
              name="District"
              onChange={(e) => handleInputChange(e, 0, "District")}
              value={values?.District}
              required={true}
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            />
            <ReactSelect
              placeholderName={t("State")}
              name="State"
              value={values?.State?.value}
              handleChange={(name, e) => handleReactSelect(name, e)}
              dynamicOptions={apiData?.getState}
              searchable={true}
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            />
          </>
        )}
        {values?.SelectMaster?.value == 2 && (
          <>
            <Input
              type="text"
              className={"form-control required-fields"}
              lable={t("City")}
              placeholder=" "
              //   id="ItemName"
              name="City"
              onChange={(e) => handleInputChange(e, 0, "City")}
              value={values?.City}
              required={true}
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            />
            <ReactSelect
              placeholderName={t("State")}
              name="State"
              value={values?.State?.value}
              handleChange={(name, e) => handleReactSelect(name, e)}
              dynamicOptions={apiData?.getState}
              searchable={true}
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            />
            <ReactSelect
              placeholderName={t("District")}
              name="District"
              value={values?.District?.value}
              handleChange={(name, e) => handleReactSelect(name, e)}
              dynamicOptions={apiData?.getDistrict}
              searchable={true}
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            />
          </>
        )}
        {values?.isEdit === 0 && (
          <button
            className=" btn btn-sm btn-success ml-2 px-3"
            onClick={() => {
              if (values?.SelectMaster?.value === "1") {
                handleSave("State");
              } else if (values?.SelectMaster?.value === "0") {
                handleSave("District");
              } else if (values?.SelectMaster?.value === "2") {
                handleSave("City");
              } else {
                // Optional: handle invalid or undefined case
                console.warn("Invalid selection");
              }
            }}
          >
            {t("Save")}
          </button>
        )}

        {values?.isEdit === 1 && (
          <button
            className=" btn btn-sm btn-success ml-2 px-3"
            onClick={() => {
              if (values?.SelectMaster?.value === "1") {
                handleUpdate("State");
              } else if (values?.SelectMaster?.value === "0") {
                handleUpdate("District");
              } else if (values?.SelectMaster?.value === "2") {
                handleUpdate("City");
              } else {
                // Optional: handle invalid or undefined case
                console.warn("Invalid selection");
              }
            }}
          >
            {t("Update")}
          </button>
        )}
        <button
          className=" btn btn-sm btn-success ml-2 px-3"
          onClick={() => {
            setValues(initialState);
            setCountryData([]);
          }}
        >
          {t("Reset")}
        </button>
      </div>
      {countryData?.length > 0 && values?.SelectMaster?.value == 1 && (
        <>
          <Heading isBreadcrumb={false} title={"State List"} />
          <Tables
            thead={THEAD}
            tbody={countryData?.map((ele, index) => ({
              Sno: index + 1,
              StateName: ele?.StateName,
              IsActive: ele?.Active,
              Edit: (
                <i
                  className="fa fa-edit"
                  onClick={() => handleEdit(ele, "State")}
                ></i>
              ),
              Delete: (
                <i
                  className="fa fa-trash"
                  aria-hidden="true"
                  onClick={() => handleDelete(ele, "State")}
                ></i>
              ),
            }))}
            style={{ maxHeight: "65vh" }}
          />
        </>
      )}
      {districtData?.length > 0 && values?.SelectMaster?.value == 0 && (
        <>
          <Heading isBreadcrumb={false} title={"District List"} />
          <Tables
            thead={THEADdata}
            tbody={districtData?.map((ele, index) => ({
              Sno: index + 1,
              districtName: ele?.District,
              IsActive: ele?.Active,
              Edit: (
                <i
                  className="fa fa-edit"
                  onClick={() => handleEdit(ele, "District")}
                ></i>
              ),
              Delete: (
                <i
                  className="fa fa-trash"
                  aria-hidden="true"
                  onClick={() => handleDelete(ele, "District")}
                ></i>
              ),
            }))}
            style={{ maxHeight: "65vh" }}
          />
        </>
      )}
      {cityTable?.length > 0 && values?.SelectMaster?.value == 2 && (
        <>
          <Heading isBreadcrumb={false} title={"District List"} />
          <Tables
            thead={cityTHEAD}
            tbody={cityTable?.map((ele, index) => ({
              Sno: index + 1,
              City: ele?.City,
              Active: ele?.Active,
              Edit: (
                <i
                  className="fa fa-edit"
                  onClick={() => handleEdit(ele, "City")}
                ></i>
              ),
              Delete: (
                <i
                  className="fa fa-trash"
                  aria-hidden="true"
                  onClick={() => handleDelete(ele, "City")}
                ></i>
              ),
            }))}
            style={{ maxHeight: "65vh" }}
          />
        </>
      )}
    </div>
  );
};

export default AddMaster;
