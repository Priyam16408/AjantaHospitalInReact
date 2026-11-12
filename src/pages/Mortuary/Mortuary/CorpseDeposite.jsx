import React, { useEffect, useState } from "react";
import Heading from "../../../components/UI/Heading";
import { AutoComplete } from "primereact/autocomplete";
import { useTranslation } from "react-i18next";
import Input from "../../../components/formComponent/Input";
import DatePicker from "../../../components/formComponent/DatePicker";
import moment from "moment";
import TimePicker from "../../../components/formComponent/TimePicker";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import { handleReactSelectDropDownOptions } from "../../../utils/utils";
import { getBindCountryList } from "../../../networkServices/ReportsAPI";
import {
  bindFreezerList,
  MortuaryBindPatientType,
  MortuarygetReligion,
} from "../../../networkServices/Mortuary/mourtuaryApi";
import { getGetDoctor } from "../../../networkServices/DoctorApi";

const CorpseDeposite = () => {
  const [t] = useTranslation();

  const { VITE_DATE_FORMAT } = import.meta.env;

  const initialValues = {
    Time: { label: "YRS", value: "1" },
  };

  const [values, setValues] = useState({ ...initialValues });
  const [itemList, setItemList] = useState([]);
  const [searchvalue, setSearchValue] = useState("");
  const [dropDownState, setDropDownState] = useState({
    Country: [],
  });

  const handleSearch = async (event, index) => {
    const query = event.query.trim();
    const items = await API(query); //CALL YOUR API HERE

    const filteredData = items?.map((ele) => ({
      NAME: ele.NAME, // ENTER NAME OF THE FIELD YOU WANT TO DISPLAY
      VALUE: ele.ID, // ENTER ID OF THE FIELD YOU WANT TO DISPLAY
    }));
    setItemList(filteredData);
  };

  const handleSelectRow = (e, index) => {
    const { value } = e;
    setValues((val) => ({
      ...val,
      SelectedItem: {
        NAME: value?.NAME,
        VALUE: value?.VALUE,
      },
    }));
    setSearchValue("");
  };

  const itemTemplate = (item) => {
    return (
      <div className="p-clearfix">
        <div style={{ float: "left", fontSize: "12px", width: "100%" }}>
          {item?.NAME}
        </div>
      </div>
    );
  };

  const handleInputChange = (e, index, label) => {
    const { name, value } = e.target;
    setValues((val) => ({ ...val, [label]: value }));
  };

  const handleReactSelect = (name, value) => {
    setValues((val) => {
      return {
        ...val,
        [name]: value,
      };
    });
  };

  const handleChange = (e) => {
    const { value, name } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  const fetchCountry = async () => {
    try {
      const data = await getBindCountryList();
      setDropDownState((prev) => ({
        ...prev,
        Country: handleReactSelectDropDownOptions(
          data?.data,
          "Name",
          "CountryID"
        ),
      }));
    } catch (err) {
      console.log(err);
    }
  };
  const ReligionData = async () => {
    try {
      const data = await MortuarygetReligion();
      setDropDownState((prev) => ({
        ...prev,
        Religion: handleReactSelectDropDownOptions(
          data?.data,
          "Name",
          "CountryID"
        ),
      }));
    } catch (err) {
      console.log(err);
    }
  };

  const bindDoctor = async () => {
    const apiResp = await api();
    if (apiResp?.success) {
      const data = apiResp?.data;
      const doctorList = handleReactSelectDropDownOptions(
        data,
        "DoctorName",
        "DoctorID"
      );
      setDropDownState((prev) => ({
        ...prev,
        Doctor: doctorList,
      }));
    } else {
      setDropDownState((prev) => ({
        ...prev,
        Doctor: [],
      }));
    }
  };
  const freezerData = async () => {
    const paylaod = {
      status: 0,
      muslim: "0,1",
    };
    const apiResp = await bindFreezerList(paylaod);
    if (apiResp?.success) {
      const data = apiResp?.data;
      const FreezerData = handleReactSelectDropDownOptions(
        data,
        "DoctorName",
        "DoctorID"
      );
      setDropDownState((prev) => ({
        ...prev,
        FreezerData: FreezerData,
      }));
    } else {
      setDropDownState((prev) => ({
        ...prev,
        FreezerData: [],
      }));
    }
  };
  const MortuaryPatientType = async () => {
    const apiResp = await MortuaryBindPatientType();
    if (apiResp?.success) {
      const data = apiResp?.data;
      const PatientType = handleReactSelectDropDownOptions(
        data,
        "PatientType",
        "id"
      );
      setDropDownState((prev) => ({
        ...prev,
        PatientType: PatientType,
      }));
    } else {
      setDropDownState((prev) => ({
        ...prev,
        FreezerData: [],
      }));
    }
  };

  useEffect(() => {
    fetchCountry();
    MortuaryPatientType();
    freezerData();
    // ReligionData();
    // bindDoctor();
  }, []);
  return (
    <div className="card">
      <Heading title={"Corpse Deposite"} isBreadcrumb={false} />
      <div className="row p-2">
        <AutoComplete
          requiredClassName={"required-fields"}
          placeholder={t("Barcode Search")}
          value={searchvalue}
          suggestions={itemList}
          field="BarcodeSearch"
          completeMethod={(e) => handleSearch(e, 0)}
          className="col-xl-2 col-md-4 col-sm-6 col-12"
          onSelect={(e) => handleSelectRow(e, 0)}
          itemTemplate={itemTemplate}
          onChange={(e) => {
            setSearchValue(e?.value);
          }}
        />
        <Input
          type="text"
          className={"form-control required-fields"}
          lable={t("First Name")}
          placeholder=" "
          name="FirstName"
          onChange={(e) => handleInputChange(e, 0, "FirstName")}
          value={values?.FirstName}
          required={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <Input
          type="text"
          className={"form-control required-fields"}
          lable={t("Last Name")}
          placeholder=" "
          name="LastName"
          onChange={(e) => handleInputChange(e, 0, "LastName")}
          value={values?.LastName}
          required={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <Input
          type="text"
          className={"form-control"}
          lable={t("UHID")}
          placeholder=" "
          name="UHID"
          onChange={(e) => handleInputChange(e, 0, "UHID")}
          value={values?.UHID}
          required={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <ReactSelect
          placeholderName={t("Sex")}
          name="sex"
          value={values?.Status?.value}
          handleChange={handleReactSelect}
          dynamicOptions={[
            { label: "Male", value: "1" },
            { label: "Female", value: "0" },
            { label: "Both", value: "2" },
          ]}
          searchable={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        {/* <div className="col-xl-4 col-md-4 col-sm-6 col-12"> */}
        <Input
          type="text"
          className={"form-control required-fields"}
          lable={t("Age")}
          placeholder=" "
          name="Age"
          onChange={(e) => handleInputChange(e, 0, "Age")}
          value={values?.Age}
          required={true}
          respclass="col-xl-1 col-md-4 col-sm-6 col-12"
        />
        <ReactSelect
          placeholderName={t("Time")}
          name="Time"
          value={values?.Time?.value}
          handleChange={handleReactSelect}
          dynamicOptions={[
            { label: "YRS", value: "1" },
            { label: "MONTH(S)", value: "0" },
            { label: "DAY(S)", value: "2" },
          ]}
          searchable={true}
          respclass="col-xl-1 col-md-4 col-sm-6 col-12"
        />
        {/* </div> */}
        <DatePicker
          className={`custom-calendar `}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          id="deathDate"
          name="deathDate"
          value={
            values?.deathDate ? moment(values?.deathDate).toDate() : new Date()
          }
          maxDate={new Date()}
          handleChange={(e) => {
            // Validate date format here as well when it is being changed
            const dateInput = e.target.value;

            setValues((prev) => ({
              ...prev,
              deathDate: moment(dateInput).toDate(), // Ensure state updates
            }));
          }}
          lable={t("From Death Date")}
          placeholder={VITE_DATE_FORMAT}
          inputClassName={"required-fields"}
        />
        <TimePicker
          lable={t("Time of Death")}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          id="timeOfDeath"
          name="timeOfDeath"
          value={values?.timeOfDeath}
          handleChange={handleChange}
          className={"required-fields"}
        />
        <ReactSelect
          placeholderName={t("Nationality")}
          name="Nationality"
          value={values?.Nationality?.value}
          handleChange={handleReactSelect}
          dynamicOptions={[
            { label: "YRS", value: "1" },
            { label: "MONTH(S)", value: "0" },
            { label: "DAY(S)", value: "2" },
          ]}
          searchable={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <div className="col-xl-2 col-md-4 col-sm-6 col-12">
          <div className="row">
            <ReactSelect
              placeholderName={t("Religion")}
              id="Religion"
              searchable={true}
              value={values?.Religion?.value}
              dynamicOptions={dropDownState?.Religion}
              handleChange={handleReactSelect}
              respclass="col-sm-10 col-lg-10 col-md-10 col-lg-10 col-xl-10 col-xxl-10 col-11"
            />
            <button className="btn btn-sm  btn-primary">
              <i className="fa fa-plus-circle fa-sm new_record_pluse "></i>
            </button>
          </div>
        </div>
        <div className="col-xl-2 col-md-4 col-sm-6 col-12">
          <div className="row">
            <ReactSelect
              placeholderName={t("Locality")}
              id="Locality"
              searchable={true}
              value={values?.Locality?.value}
              handleChange={handleReactSelect}
              respclass="col-sm-10 col-lg-10 col-md-10 col-lg-10 col-xl-10 col-xxl-10 col-11"
            />
            <button className="btn btn-sm  btn-primary">
              <i className="fa fa-plus-circle fa-sm new_record_pluse "></i>
            </button>
          </div>
        </div>
        <Input
          type="text"
          className={"form-control required-fields"}
          lable={t("Residential Address")}
          placeholder=" "
          name="ResidentialAddress"
          onChange={(e) => handleInputChange(e, 0, "ResidentialAddress")}
          value={values?.ResidentialAddress}
          required={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <Input
          type="text"
          className={"form-control required-fields"}
          lable={t("Other Address")}
          placeholder=" "
          name="otherAddress"
          onChange={(e) => handleInputChange(e, 0, "otherAddress")}
          value={values?.otherAddress}
          required={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />

        <ReactSelect
          placeholderName={t("Country")}
          name="Country"
          value={values?.Country?.value}
          handleChange={handleReactSelect}
          dynamicOptions={dropDownState?.Country}
          searchable={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
      </div>

      <Heading title={t("Kin Details")} isBreadcrumb={false} />
      <div className="row p-2">
        <Input
          type="text"
          className={"form-control required-fields"}
          lable={t("Name")}
          placeholder=" "
          name="Name"
          onChange={(e) => handleInputChange(e, 0, "Name")}
          value={values?.Name}
          required={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <ReactSelect
          placeholderName={t("RelationShip")}
          name="RelationShip"
          value={values?.RelationShip?.value}
          handleChange={handleReactSelect}
          dynamicOptions={dropDownState?.Relationship}
          searchable={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <Input
          type="text"
          className={"form-control required-fields"}
          lable={t("Address")}
          placeholder=" "
          name="Address"
          onChange={(e) => handleInputChange(e, 0, "Address")}
          value={values?.Address}
          required={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <Input
          type="text"
          className={"form-control required-fields"}
          lable={t("Contact No.")}
          placeholder=" "
          name="ContactNo"
          onChange={(e) => handleInputChange(e, 0, "ContactNo")}
          value={values?.ContactNo}
          required={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <Input
          type="text"
          className={"form-control"}
          lable={t("Email Address")}
          placeholder=" "
          name="EmailAddress"
          onChange={(e) => handleInputChange(e, 0, "EmailAddress")}
          value={values?.EmailAddress}
          required={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
      </div>

      <Heading title={t("Other Details")} isBreadcrumb={false} />
      <div className="row p-2">
        <ReactSelect
          placeholderName={t("Place of Death")}
          name="placeOfDeath"
          value={values?.placeOfDeath?.value}
          handleChange={handleReactSelect}
          dynamicOptions={[
            { label: "Hospital", value: "1" },
            { label: "Home", value: "0" },
            // { label: "Both", value: "2" },
          ]}
          searchable={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <ReactSelect
          placeholderName={t("Patient Type")}
          name="PatientType"
          requiredClassName={"required-fields"}
          value={values?.PatientType?.value}
          handleChange={handleReactSelect}
          dynamicOptions={dropDownState?.PatientType}
          searchable={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <ReactSelect
          placeholderName={t("Freezer")}
          name="Freezer"
          requiredClassName={"required-fields"}
          value={values?.Freezer?.value}
          handleChange={handleReactSelect}
          dynamicOptions={[
            { label: "Hospital", value: "1" },
            { label: "Home", value: "0" },
            // { label: "Both", value: "2" },
          ]}
          searchable={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <Input
          type="text"
          className={"form-control required-fields"}
          lable={t("Brought By")}
          placeholder=" "
          name="BroughtBy"
          onChange={(e) => handleInputChange(e, 0, "BroughtBy")}
          value={values?.BroughtBy}
          required={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <ReactSelect
          placeholderName={t("Medical Officer")}
          name="MedicalOfficer"
          requiredClassName={"required-fields"}
          value={values?.MedicalOfficer?.value}
          handleChange={handleReactSelect}
          dynamicOptions={[
            { label: "Hospital", value: "1" },
            { label: "Home", value: "0" },
            // { label: "Both", value: "2" },
          ]}
          searchable={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <ReactSelect
          placeholderName={t("Authorized By")}
          name="AuthorizedBy"
          requiredClassName={"required-fields"}
          value={values?.AuthorizedBy?.value}
          handleChange={handleReactSelect}
          dynamicOptions={[
            { label: "Hospital", value: "1" },
            { label: "Home", value: "0" },
            // { label: "Both", value: "2" },
          ]}
          searchable={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <Input
          type="text"
          className={"form-control"}
          lable={t("Deposit Remark")}
          placeholder=" "
          name="Depositemark"
          onChange={(e) => handleInputChange(e, 0, "Depositemark")}
          value={values?.Depositemark}
          required={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <button className="btn btn-primary btn-success ml-2">
          {t("Save")}
        </button>
      </div>
    </div>
  );
};

export default CorpseDeposite;
