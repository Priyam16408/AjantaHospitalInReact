import React, { useEffect, useState } from "react";
import Heading from "../../../components/UI/Heading";
import Input from "../../../components/formComponent/Input";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import { useTranslation } from "react-i18next";
import {
  filterByTypes,
  handleReactSelectDropDownOptions,
} from "../../../utils/utils";
import DatePicker from "../../../components/formComponent/DatePicker";
import Tables from "../../../components/UI/customTable";
import CreateCityModal from "./CreateCityModal";
import {
  BinddonorBloodGroup,
  BindQuestions,
  bloodBankSaveData,
  donorBindOrganisation,
  DonorGetCity,
  DonorGetCountry,
  saveDonorCity,
} from "../../../networkServices/blooadbankApi";
import Modal from "../../../components/modalComponent/Modal";
import EstablishDonorModal from "./EstablishDonorModal";
import { notify } from "../../../utils/utils";
import { CentreWiseCacheByCenterID } from "../../../store/reducers/common/CommonExportFunction";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

function DonorRegistration() {
  const [t] = useTranslation();

  const { VITE_DATE_FORMAT } = import.meta.env;
  const [QuestionnaireData, setQuestionnaireData] = useState([]);
  const [values, setValues] = useState({
    PFirstName: "",
    Title: "",
    lastname: "",
    gender: "",
    type: "",
    kinName: "",
    dob: "",
    Organisation: "",
    IPDNO: "",
    age: "",
    relation: "",
    bloodGroup: "",
    Address: "",
    country: "",
    city: "",
    email: "",
    howOften: { value: "0" },
    bp: "",
    weight: "",
    temp: "",
    pulse: "",
    height: "",
    Hemoglobin: { value: "0" },
    GPE: "",
    Fit: { value: "0" },
    platenletCount: "",
    phlebotomySide: { value: "0" },
    bagType: { value: "0" },
    Quantity: { value: "0" },
    remark: "",
    questionRemarks: "",
    questionInput: "",
    contactNo: "",
  });

  const [handleModelData, setHandleModelData] = useState({});

  const [donorCity, setDonorCity] = useState([]);
  const [donorCountry, setDonorCountry] = useState([])
  const { CentreWiseCache } = useSelector((state) => state.CommonSlice);
  const dispatch = useDispatch();


  const [modalData, setModalData] = useState({});
  const gender_type = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
  ];

  const Type = [
    { value: "0", label: "Select" },
    { value: "1", label: "Volunteer" },
    { value: "2", label: "Replacement" },
    { value: "3", label: "Family Donor" },
  ];

  const RelationType = [
    { value: "Self", label: "Self" },
    { value: "Father", label: "Father" },
    { value: "Son", label: "Son" },
    { value: "Wife", label: "Wife" },
    { value: "Daughter", label: "Daughter" },
    { value: "Husband", label: "Husband" },
    { value: "Care", label: "Care" },
    { value: "Mother", label: "Mother" },
    { value: "Brother", label: "Brother" },
    { value: "Uncle", label: "Uncle" },
    { value: "Sister", label: "Sister" },
    { value: "Other", label: "Other" },
  ];

  const handleSelect = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    if (name == "country") {
      handeleGetCity(value?.value);
    }
  };

  const handleChange = (e, type, limit = 9999999999999) => {
    const { name, value } = e.target
    console.log("first", limit, Number(value), isNaN(Number(value)))

    if (type === "number" && ((limit < Number(value)) || isNaN(Number(value)))) {

    } else {
      setValues((prev) => ({ ...prev, [name]: value }));
    }
  };
  const [errors, setErrors] = useState({})

  const validateData = [{ name: "bp", value: 3 }]

  const validateBP = (value) => {
    const parts = value.split('/');
    if (parts.length !== 2) {
      return "Invalid B.P. format. Example: 120/80";
    }
    const systolic = parseInt(parts[0]);
    const diastolic = parseInt(parts[1]);
    if (isNaN(systolic) || isNaN(diastolic) || systolic < 100 || systolic > 140 || diastolic < 60 || diastolic > 90) {
      return 'Invalid B.P. range. Systolic: 100–140, Diastolic: 60–90'
    } else {
      return ""
    }
  }
  const handleBlur = (e) => {
    const { name, value } = e.target;
    if (name === "bp") {
      const error = validateBP(value)
      if (error) {
        setErrors((prev) => ({ ...prev, [name]: error }))
        notify(error, "error")
        return
      }
    } else if (name === "weight" && Number(value) < 49) {
      setErrors((prev) => ({ ...prev, [name]: "Donor is not eligible to donate blood. Minimum required weight is 50 kg" }))
      notify("Donor is not eligible to donate blood. Minimum required weight is 50 kg", "error")
      return
    } else if (name === "temp" && (Number(value) < 36.1 || Number(value) > 37.5)) {
      setErrors((prev) => ({ ...prev, [name]: "Body temperature must be between 36.1°C and 37.5°C for blood donation. " }))
      notify("Body temperature must be between 36.1°C and 37.5°C for blood donation.", "error")
      return
    } else if (name === "pulse" && (Number(value) < 100 || Number(value) > 60)) {
      setErrors((prev) => ({ ...prev, [name]: "Pulse must be between 60–100 bpm for blood donation." }))
      notify("Pulse must be between 60–100 bpm for blood donation.", "error")
      return
    }


  }

  const theadPatientDetail = [
    { width: "50%", name: t("Question") },
    { width: "25%", name: t("Response") },
    { width: "25%", name: t("Remarks") },
  ];

  const handleAddCity = async (data) => {
    const Payload = {
      CityName: data?.newCity,
      CountryID: "0",
    };
    try {
      const Response = await saveDonorCity(Payload);
      if (Response?.success) {
        notify(Response?.message, "success");
        setHandleModelData((val) => ({ ...val, isOpen: false }));
      } else {
        notify(Response?.message, "error");
      }
    } catch (error) {
      notify("Error saving reason", "error");
    }
  };

  const handleChangeRejectModel = (data) => {
    setModalData(data);
  };

  const handleDonorEstablished = async (data) => {
    const Payload = {
      CityName: data?.newCity,
      CountryID: "0",
    };
    try {
      const Response = await saveDonorCity(Payload);
      if (Response?.success) {
        notify(Response?.message, "success");
        setHandleModelData((val) => ({ ...val, isOpen: false }));
      } else {
        notify(Response?.message, "error");
      }
    } catch (error) {
      notify("Error saving reason", "error");
    }
  };

  // handleDonorEstablished

  const handleEstablishedDonor = (item) => {
    setHandleModelData({
      label: t("Select Patient Details"),
      buttonName: t("View"),
      width: "30vw",
      isOpen: true,
      Component: (
        <EstablishDonorModal
          inputData={item}
          handleChangeModel={handleChangeRejectModel}
        />
      ),
      handleInsertAPI: handleDonorEstablished,
      extrabutton: <></>,
      // footer: <></>,
    });
  };

  const hanldeCreateCity = (item) => {
    setHandleModelData({
      label: t("Create City"),
      buttonName: t("Save"),
      width: "30vw",
      isOpen: true,
      Component: (
        <CreateCityModal
          inputData={item}
          handleChangeModel={handleChangeRejectModel}
        />
      ),
      handleInsertAPI: handleAddCity,
      extrabutton: <></>,
      // footer: <></>,
    });
  };

  const setIsOpen = () => {
    setHandleModelData((val) => ({ ...val, isOpen: false }));
  };

  const [questionnaireValues, setQuestionnaireValues] = useState([]);
  useEffect(() => {
    if (QuestionnaireData?.length > 0) {
      const initialValues = QuestionnaireData.map((q) => ({
        questId: q?.ID || "",
        ques: q?.Questions || "",
        type: q?.TYPE || "",
        ans: "",
        rdbAns: "",
        remarks: "",
      }));
      setQuestionnaireValues(initialValues);
    }
  }, [QuestionnaireData]);

  const handleQuestionnaireChange = (
    index,
    field,
    value,
    isCheckbox = false
  ) => {
    setQuestionnaireValues((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
            ...item,
            [field]: isCheckbox ? (value ? "rdbAns1" : "") : value,
          }
          : item
      )
    );
  };

  const handleSave = async () => {
    const Payload = {
      donorId: "",
      firstName: values?.PFirstName,
      lastName: values?.lastname,
      gender: values?.gender?.value,
      kinName: values?.kinName,
      relation: values?.relation?.value,
      age: values?.age,
      yrs: "",
      title: values?.Title,
      type: values?.type?.value,
      dob: values?.dob,
      ipdNo: values?.IPDNO,
      organisation: values?.Organisation?.value,
      bloodGroupId: values?.bloodGroup?.value,
      address: values?.Address,
      nationality: values?.country?.value,
      city: values?.city,
      phoneNo: "",
      email: values?.email,
      bDonate: values?.bagType?.value,
      bp: values?.bp,
      weight: values?.weight,
      pulse: values?.pulse,
      gpe: values?.age,
      height: values?.height,
      temp: values?.temp,
      hemoglobin: values?.Hemoglobin,
      fit: values?.Fit,
      remark: values?.remark,
      bagType: values?.bagType?.value,
      quantity: values?.quantity,
      platelets: values?.platenletCount,
      phlebotomy: values?.phlebotomySide,
      questions: questionnaireValues,
    };
    try {
      const Response = await bloodBankSaveData(Payload);
      if (Response?.success) {
        notify(Response?.message, "success");
      } else {
        notify(Response?.message, "error");
      }
    } catch (error) {
      notify("Error saving reason", "error");
    }
  };

  // BindQuestions
  // donorBindOrganisation

  const [organisationData, setOrganistationData] = useState([]);
  const [bloodBank, setBloodBank] = useState([]);

  const handledonorBindOrganisation = async () => {
    try {
      const response = await donorBindOrganisation();
      if (response.success) {
        setOrganistationData(response?.data);
      } else {
        console.error(
          "API returned success as false or invalid response:",
          response
        );
        setOrganistationData([]);
      }
    } catch (error) {
      console.error("Error fetching department data:", error);
      setOrganistationData([]);
    }
  };

  const handledBinddonorBloodGroup = async () => {
    try {
      const response = await BinddonorBloodGroup();
      if (response.success) {
        setBloodBank(response?.data);
      } else {
        console.error(
          "API returned success as false or invalid response:",
          response
        );
        setBloodBank([]);
      }
    } catch (error) {
      console.error("Error fetching department data:", error);
      setBloodBank([]);
    }
  };

  const handeleGetCountry = async () => {
    try {
      const response = await DonorGetCountry(values?.country?.value);
      if (response?.success) {
        setDonorCountry(response?.data);
      }
      else {
        setDonorCountry([])

      }
    } catch (err) {
      console.log(err);
      setDonorCountry([])

    }
  }
  const handeleGetCity = async (countryId) => {
    const payload = {
      CountryID: countryId
    }
    try {
      const response = await DonorGetCity(payload);
      if (response?.success) {
        setDonorCity(response?.data);
      }
      else {
        setDonorCity([])
      }
    } catch (err) {
      console.log(err);
      setDonorCity([])

    }
  }

  const handleBindQuestions = async () => {
    try {
      const response = await BindQuestions();
      if (response.success) {
        console.log("the department data is", response);
        setQuestionnaireData(response?.data);
      } else {
        console.error(
          "API returned success as false or invalid response:",
          response
        );
        setQuestionnaireData([]);
      }
    } catch (error) {
      console.error("Error fetching department data:", error);
      setQuestionnaireData([]);
    }
  };

  useEffect(() => {
    if (CentreWiseCache?.length === 0) {
      dispatch(CentreWiseCacheByCenterID({}));
    }
    handleBindQuestions();
    handledonorBindOrganisation();
    handledBinddonorBloodGroup();
    handeleGetCountry();
    handeleGetCity();
  }, []);




  return (
    <>
      {handleModelData?.isOpen && (
        <Modal
          visible={handleModelData?.isOpen}
          setVisible={setIsOpen}
          modalWidth={handleModelData?.width}
          Header={t(handleModelData?.label)}
          buttonType={"button"}
          buttons={handleModelData?.extrabutton}
          buttonName={handleModelData?.buttonName}
          modalData={modalData}
          setModalData={setModalData}
          footer={handleModelData?.footer}
          handleAPI={handleModelData?.handleInsertAPI}
        >
          {handleModelData?.Component}
        </Modal>
      )}

      <div className="card p-1">
        <Heading title={t("Donor Detail")} isBreadcrumb={false} />

        <div className="row p-2">
          <Input
            type="text"
            className="form-control"
            id="doctorid"
            name="doctorid"
            value={values?.doctorid ? values?.doctorid : ""}
            onChange={handleChange}
            lable={t("Donor Id")}
            placeholder=" "
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            isUpperCase={true}
          />

          <div className="col-xl-2 col-md-4 col-sm-4 col-12">
            <button
              onClick={handleEstablishedDonor}
              className="btn btn-success w-100"
            >
              {t("Established Donor")}
            </button>
          </div>


          <div className="col-xl-2 col-md-4 col-sm-4 col-12">
            <div className="row d-flex">
              <ReactSelect
                placeholderName={t("Title")}
                removeIsClearable={true}
                dynamicOptions={filterByTypes(
                  CentreWiseCache,
                  [1],
                  ["TypeID"],
                  "TextField",
                  "ValueField",
                  "Department"
                )}
                name="Title"
                inputId="Title"
                value={values?.Title}
                handleChange={(name, value) => {
                  setValues((val) => ({
                    ...val,
                    [name]: value,
                    Gender:
                      value?.extraColomn !== "UnKnown" ? value?.extraColomn : "",
                  }));
                }}
                searchable={true}
                respclass="col-5 "
                requiredClassName="required-fields"
              />
              <Input
                type="text"
                className="form-control required-fields"
                id="First"
                name="PFirstName"
                value={values?.PFirstName ? values?.PFirstName : ""}
                onChange={handleChange}
                lable={t("First_Name")}
                placeholder=" "
                respclass="col-7"
                isUpperCase={true}
              />
            </div>
          </div>

          <Input
            type="text"
            className="form-control"
            id="lastname"
            placeholder=" "
            name="lastname"
            value={values?.lastname || ""}
            onChange={handleChange}
            lable={t("Last Name")}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          />
          <ReactSelect
            placeholderName={t("Gender")}
            id={"gender"}
            searchable={true}
            removeIsClearable={true}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            handleChange={handleSelect}
            dynamicOptions={gender_type}
            value={`${values?.gender?.value}`}
            name={"gender"}
          />

          <ReactSelect
            placeholderName={t("Type")}
            id={"type"}
            searchable={true}
            removeIsClearable={true}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            handleChange={handleSelect}
            dynamicOptions={Type}
            value={`${values?.type?.value}`}
            name={"type"}
          />

          <DatePicker
            id="slotDate"
            name="slotDate"
            placeholder={VITE_DATE_FORMAT}
            lable={t("DOB")}
            className="custom-calendar"
            value={values?.dob}
            handleChange={handleChange}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            maxDate={new Date()}
          />

          {values?.type?.value === "1" ? (
            <ReactSelect
              placeholderName={t("Organisation")}
              id={"Organisation"}
              searchable={true}
              removeIsClearable={true}
              // dynamicOptions={organisationData}
              dynamicOptions={[
                { value: "0", label: "ALL" },
                ...handleReactSelectDropDownOptions(
                  organisationData,
                  "organisaction",
                  "id"
                ),
              ]}
              respclass="col-xl-2 col-md-4 col-sm-4 col-12"
              handleChange={handleSelect}
              value={`${values?.Organisation?.value}`}
              name={"Organisation"}
            />
          ) : (
            <Input
              type="text"
              placeholder=""
              className="form-control"
              id="IPDNO"
              name="IPDNO"
              value={values?.IPDNO || ""}
              onChange={handleChange}
              lable={t("Ipd No")}
              respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            />
          )}

          <Input
            type="text"
            placeholder=""
            className="form-control"
            id="age"
            name="age"
            value={values?.age || ""}
            onChange={handleChange}
            lable={t("Age")}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          />

          {/* Kin Name */}

          <Input
            type="text"
            placeholder=""
            className="form-control"
            id="kinName"
            name="kinName"
            value={values?.kinName || ""}
            onChange={handleChange}
            lable={t("Kin Name ")}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          />

          {/* Relation */}

          <ReactSelect
            placeholderName={t("Relation")}
            id={"relation"}
            searchable={true}
            removeIsClearable={true}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            dynamicOptions={RelationType}
            handleChange={handleSelect}
            value={`${values?.relation?.value}`}
            name={"relation"}
          />

          <ReactSelect
            placeholderName={t("Blood Group")}
            id={"bloodGroup"}
            searchable={true}
            removeIsClearable={true}
            dynamicOptions={[
              { value: "0", label: "ALL" },
              ...handleReactSelectDropDownOptions(
                bloodBank,
                "bloodgroup",
                "id"
              ),
            ]}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            handleChange={handleSelect}
            value={`${values?.bloodGroup?.value}`}
            name={"bloodGroup"}
          />

          <Input
            type="text"
            placeholder=""
            className="form-control"
            id="Address"
            name="Address"
            value={values?.Address || ""}
            onChange={handleChange}
            lable={t("Address")}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          />

          <ReactSelect
            placeholderName={t("Country")}
            id={"country"}
            searchable={true}
            removeIsClearable={true}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            handleChange={handleSelect}
            dynamicOptions={[
              ...handleReactSelectDropDownOptions(
                donorCountry,
                "Name",
                "CountryID"
              ),
            ]}
            value={`${values?.country?.value}`}
            name={"country"}
          />

          <div className="d-flex col-xl-2 col-md-4 col-sm-4 col-12">
            <ReactSelect
              placeholderName={t("City")}
              searchable={true}
              removeIsClearable={true}
              id="city"
              name="city"
              dynamicOptions={[
                ...handleReactSelectDropDownOptions(
                  donorCity,
                  "City",
                  "id"
                ),
              ]}
              value={values?.city?.value}
              handleChange={handleSelect}
              respclass="w-100"
            />

            <div className="box-inner ml-1">
              <button
                className="btn btn-sm btn-primary"
                type="button"
                onClick={hanldeCreateCity}
              >
                <i className="fa fa-plus-circle fa-sm new_record_pluse"></i>
              </button>
            </div>
            {/* <button onClick={hanldeCreateCity} className="btn btn-success">
              <i className="fa fa-plus-circle fa-sm new_record_pluse"></i>
            </button> */}
          </div>

          <Input
            type="text"
            placeholder=""
            className="form-control"
            id="contactNo"
            name="contactNo"
            value={values?.contactNo || ""}
            onChange={handleChange}
            lable={t("Contact No")}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          />

          <Input
            type="text"
            placeholder=""
            className="form-control"
            id="email"
            name="email"
            value={values?.email || ""}
            onChange={handleChange}
            lable={t("Email")}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          />

          <ReactSelect
            placeholderName={t("How Often")}
            id={"howOften"}
            searchable={true}
            removeIsClearable={true}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            handleChange={handleSelect}
            dynamicOptions={[
              { value: "0", label: "Select" },
              { value: "3 Monthly", label: "3 Monthly" },
              { value: "6 Monthly", label: "6 Monthly" },
              { value: "Yearly", label: "Yearly" },
            ]}
            value={`${values?.howOften?.value}`}
            name={"howOften"}
          />
        </div>
        <Heading title={t("Questionnaire")} isBreadcrumb={false} />

        {QuestionnaireData.length > 0 && (
          <div className="card">
            {QuestionnaireData.length > 0 && (
              <div className="card">
                <Tables
                  thead={theadPatientDetail}
                  tbody={QuestionnaireData?.map((val, index) => ({
                    name: val?.Questions,
                    Test_ID:
                      val.TYPE === "r" ? (
                        <Input
                          type="checkbox"
                          className="w-25 table-checkbox"
                          name="questioncheck"
                          checked={
                            questionnaireValues[index]?.rdbAns === "rdbAns1"
                          }
                          onChange={(e) =>
                            handleQuestionnaireChange(
                              index,
                              "rdbAns",
                              e.target.checked,
                              true
                            )
                          }
                        />
                      ) : (
                        <Input
                          type="text"
                          className="table-input"
                          removeFormGroupClass={true}
                          name="questionInput"
                          value={questionnaireValues[index]?.ans || ""}
                          onChange={(e) =>
                            handleQuestionnaireChange(
                              index,
                              "ans",
                              e.target.value
                            )
                          }
                        />
                      ),
                    isChecked: (
                      <Input
                        type="text"
                        className="table-input"
                        removeFormGroupClass={true}
                        name="questionRemarks"
                        value={questionnaireValues[index]?.remarks || ""}
                        onChange={(e) =>
                          handleQuestionnaireChange(
                            index,
                            "remarks",
                            e.target.value
                          )
                        }
                      />
                    ),
                  }))}
                />
              </div>
            )}
          </div>
        )}

        <Heading title={t("Health Status")} isBreadcrumb={false} />
        {/* {console.log("asdasd",errors)} */}
        <div className="row p-2">
          <Input
            type="text"
            className="form-control "
            id="bp"
            placeholder=" "
            name="bp"
            value={values?.bp || ""}
            onChange={handleChange}
            lable={t("B.P.")}
            placeholderLabel={"mm/hg"}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            onBlur={(e) => { handleBlur(e) }}
          />

          <Input
            type="text"
            className="form-control"
            id="weight"
            placeholder=" "
            name="weight"
            value={values?.weight || ""}
            onChange={(e) => { handleChange(e, "number", 300) }}
            lable={t("Weight")}
            placeholderLabel={t("Kg")}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            onBlur={(e) => { handleBlur(e) }}
          />

          <Input
            type="text"
            className="form-control"
            id="temp"
            placeholder=" "
            name="temp"
            value={values?.temp || ""}
            onChange={(e) => { handleChange(e, "number", 100) }}
            lable={t("Temp")}
            placeholderLabel={"0C"}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            onBlur={(e) => { handleBlur(e) }}
          />

          <Input
            type="text"
            className="form-control"
            id="pulse"
            placeholder=" "
            name="pulse"
            value={values?.pulse || ""}
            onChange={(e) => { handleChange(e, "number", 100) }}
            lable={t("Pulse")}
            placeholderLabel={"p-m"}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            onBlur={(e) => { handleBlur(e) }}
          />

          <Input
            type="text"
            className="form-control"
            id="height"
            placeholder=""
            name="height"
            value={values?.height || ""}
            onChange={handleChange}
            lable={t("Height")}
            placeholderLabel={"Height"}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          />

          <ReactSelect
            placeholderName={t("Hemoglobin")}
            id={"Hemoglobin"}
            searchable={true}
            removeIsClearable={true}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            dynamicOptions={[
              { value: "0", label: "Select" },
              { value: "<12.5", label: "<12.5" },
              { value: ">12.5", label: ">12.5" },

            ]}
            handleChange={handleSelect}
            value={`${values?.Hemoglobin?.value}`}
            name={"Hemoglobin"}
          />

          <Input
            type="text"
            className="form-control"
            id="GPE"
            placeholder=""
            name="GPE"
            value={values?.GPE || ""}
            onChange={handleChange}
            lable={t("GPE")}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          />

          <ReactSelect
            placeholderName={t("Fit")}
            id={"Fit"}
            searchable={true}
            removeIsClearable={true}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            dynamicOptions={[{ label: "Yes", value: "1" }, { label: "No", value: "0" }]}
            handleChange={handleSelect}
            value={`${values?.Fit?.value}`}
            name={"Fit"}
          />

          <Input
            type="text"
            className="form-control"
            id="platenletCount"
            placeholder=""
            name="platenletCount"
            value={values?.platenletCount || ""}
            onChange={handleChange}
            lable={t("Platelet Count")}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          />

          <ReactSelect
            placeholderName={t("Phlebotomy Side")}
            id={"phlebotomySide"}
            searchable={true}
            removeIsClearable={true}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            dynamicOptions={[
              { label: "Select", value: "0" },
              { label: "Left", value: "Left" },
              { label: "Right", value: "Right" }
            ]}
            handleChange={handleSelect}
            value={`${values?.phlebotomySide?.value}`}
            name={"phlebotomySide"}
          />

          {values?.Fit?.value === "1" ? (
            <ReactSelect
              placeholderName={t("Bag Type ")}
              id={"bagType"}
              searchable={true}
              removeIsClearable={true}
              respclass="col-xl-2 col-md-4 col-sm-4 col-12"
              dynamicOptions={[
                { label: "Select", value: "0" },
                { label: "Single", value: "1" },
                { label: "Double", value: "2" },
                { label: "Triple", value: "3" },
                { label: "Ok", value: "4" }
              ]}
              handleChange={handleSelect}
              value={`${values?.bagType?.value}`}
              name={"bagType"}
            />
          ) : (
            <Input
              type="text"
              className="form-control"
              id="remark"
              placeholder=""
              name="remark"
              value={values?.remark || ""}
              onChange={handleChange}
              lable={t("Remark")}
              respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            />
          )}

          <ReactSelect
            placeholderName={t("Quantity")}
            id={"Quantity"}
            searchable={true}
            removeIsClearable={true}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            dynamicOptions={[
              { label: "Select", value: "0" },
              { label: "350 ml", value: "1" },
              { label: "450 ml", value: "2" },
            ]}
            handleChange={handleSelect}
            value={`${values?.Quantity?.value}`}
            name={"Quantity"}
          />

          <div className="col-12 text-right">
            <button
              onClick={handleSave}
              className="btn btn-lg btn-success"
              type="button"
            >
              {t("Save")}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default DonorRegistration;
