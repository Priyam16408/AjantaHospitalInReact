import React, { useEffect, useRef, useState } from "react";
import ReactSelect from "@app/components/formComponent/ReactSelect";
import Input from "@app/components/formComponent/Input";
import LabeledInput from "@app/components/formComponent/LabeledInput";
import { useTranslation } from "react-i18next";
import UploadImage from "./UploadImage";
import Modal from "../modalComponent/Modal";
import DatePicker from "../../components/formComponent/DatePicker";
import CityModel from "../modalComponent/Utils/CityModel";
import DistrictModel from "../modalComponent/Utils/DistrictModel";
import StateModel from "../modalComponent/Utils/StateModel";
import {
  ageValidation,
  filterByType,
  filterByTypes,
  inputBoxValidation,
  notify,
} from "../../utils/utils";
import {
  AGE_TYPE,
  MOBILE_NUMBER_VALIDATION_REGX,
  VARCHAR_REGX,
} from "../../utils/constant";
import {
  cityInsert,
  districtInsert,
  storeState,
} from "../../store/reducers/common/storeStateDistrictCity";
import { useDispatch } from "react-redux";
import { useLocalStorage } from "../../utils/hooks/useLocalStorage";
import AttachDoumentModal from "../modalComponent/Utils/AttachDoumentModal";
import UploadImageModal from "../modalComponent/Utils/UploadImageModal";
import { Tooltip } from "primereact/tooltip";
import moment from "moment/moment";
import { findAgeByDOB } from "../../networkServices/directPatientReg";
import { CentreWiseCacheByCenterID } from "../../store/reducers/common/CommonExportFunction";
import { useSelector } from "react-redux";
import { Checkbox } from "primereact/checkbox";

export default function PersonalDetails({
  CentreWiseCache,
  handleChange,
  values,
  handleReactSelect,
  handleOldPatientSearch,
  isDisableInputs,
  handleKeyDown,
  setValues,
  documentIds,
  setDocumentIds,
  isUpdate,
  handleDateKeyDown,
}) {
  console.log(values,'sbsb')
  const { VITE_DATE_FORMAT } = import.meta.env;
  const dispatch = useDispatch();
  const { BindResource } = useSelector((state) => state?.CommonSlice);
  const [handleModelData, setHandleModelData] = useState({});
  const [t] = useTranslation();
  const [modalData, setModalData] = useState({});
  const [isuploadDocOpen, setIsuploadDocOpen] = useState(false);
  const localdata = useLocalStorage("userData", "get");
  const ip = useLocalStorage("ip", "get");
  const [preview, setPreview] = useState("l");
  const [isuploadOpen, setIsuploadOpen] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const [checkbox, setCheckbox] = useState(false);
  const videoRef = useRef();
  const canvasRef = useRef();

  const userData = useLocalStorage("userData", "get");
  const handleChangeModel = (data) => {
    setModalData(data);
  };


  const handleStateInsertAPI = async (data) => {
    let insData = await dispatch(storeState(data));
    if (insData?.payload?.status) {
      setModalData({});
      setHandleModelData((val) => ({ ...val, isOpen: false }));
      dispatch(
        CentreWiseCacheByCenterID({
          centreID: localdata?.defaultCentre,
        })
      );
    }
  };
  const handleDistrictInsertAPI = async (data) => {
    let insData = await dispatch(districtInsert(data));
    if (insData?.payload?.status) {
      setModalData({});
      setHandleModelData((val) => ({ ...val, isOpen: false }));
      // dispatch(
      //   CentreWiseCacheByCenterID({
      //     centreID: localdata?.defaultCentre,
      //   })
      // );
    }
  };


  const handleCityInsertAPI = async (data) => {
    let insData = await dispatch(cityInsert(data));
    if (insData?.payload?.status) {
      setModalData({});
      setHandleModelData((val) => ({ ...val, isOpen: false }));
      dispatch(
        CentreWiseCacheByCenterID({
          centreID: localdata?.defaultCentre,
        })
      );
    }
  };

  const handleModel = (
    label,
    width,
    type,
    isOpen,
    Component,
    handleInsertAPI,
    extrabutton
  ) => {
    setHandleModelData({
      label: label,
      width: width,
      type: type,
      isOpen: isOpen,
      Component: Component,
      handleInsertAPI: handleInsertAPI,
      extrabutton: extrabutton ? extrabutton : <></>,
    });
  };

  const handleCheckboxChange = (e) => {
    const checked = e.target.checked;

    setCheckbox(checked);

    if (checked) {
      setValues((prev) => ({
        ...prev,
        parmanentAddress: prev.House_No || "",
      }));
    } else {
      setValues((prev) => ({
        ...prev,
        parmanentAddress: "",
      }));
    }
  };


  useEffect(() => {
    setHandleModelData((val) => ({ ...val, modalData: modalData }));
  }, [modalData]);

  useEffect(() => {
    if (values?.PatientPhoto) {
      setPreview(values?.PatientPhoto);
      // setCameraStream((val) => ({ ...val, active: true }));
    }
  }, [values?.PatientPhoto]);

  const setIsOpen = () => {
    setHandleModelData((val) => ({ ...val, isOpen: false }));
  };

  const closeCameraStream = (status) => {
    if (cameraStream) {
      // cameraStream?.getTracks()?.forEach((track) => track?.stop());
      setCameraStream((val) => ({ ...val, active: false }));
      // setCameraStream(null);
    }
    if (status === "close") {
      setPreview("l");
    }
  };

  const startCamera = async () => {
    try {
      setPreview(null);
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      videoRef.current.play();
    } catch (err) {
      console.error("Error accessing the camera: ", err);
    }
  };

  const takePhoto = (base64Image) => {
    setPreview(base64Image);
    setCameraStream((val) => ({ ...val, active: true }));
  };

  const handleImageChange = (e) => {
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];
    closeCameraStream();
    reader.onloadend = () => {
      // setImage(file);
      setPreview(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };



  const handleAddDocumentIDs = (e) => {
    // console.log("first",values?.documentName?.value?.split('#')[1],e?.target?.value?.length)
    if (e.key === "Enter") {
      let docIDs = documentIds?.find(
        (item) =>
          item?.id === e.target.value ||
          item?.name?.value === values?.documentName?.value
      );

      let validDocLength = parseInt(
        values?.documentName?.value?.split("#")[1]
          ? values?.documentName?.value?.split("#")[1]
          : 0
      );
      if (!values?.documentName?.label) {
        notify("Please Select Document id", "error");
      } else if (!e.target.value) {
        notify("Document Can't Be Empty", "error");
      } else if (docIDs?.id) {
        notify("This Document  Has Already Added", "error");
      } else if (e.target.value?.length !== validDocLength) {
        notify(
          `${values?.documentName?.label} must be ${validDocLength} digit `,
          "error"
        );
      } else {
        setDocumentIds((val) => [
          ...val,
          { name: values?.documentName, id: e.target.value },
        ]);
        let ids = [...documentIds];
        ids.push({ name: values?.documentName, id: e.target.value });
        setValues((val) => ({
          ...val,
          ID_Proof_No: "",
          documentName: "",
          documentIds: ids,
        }));
      }
      handleKeyDown(e);
    }
  };


 

  const handleAddDocumentIDsOnClick = () => {
    const inputValue = values?.ID_Proof_No?.trim(); // Get input value from state

    let docIDs = documentIds?.find(
      (item) =>
        item?.id === inputValue ||
        item?.name?.value === values?.documentName?.value
    );

    let validDocLength = parseInt(
      values?.documentName?.value?.split("#")[1] || 0
    );

    if (!values?.documentName?.label) {
      notify("Please Select Document id", "error");
    } else if (!inputValue) {
      notify("Document Can't Be Empty", "error");
    } else if (docIDs?.id) {
      notify("This Document Has Already Been Added", "error");
    } else if (inputValue.length !== validDocLength) {
      notify(
        `${values?.documentName?.label} must be ${validDocLength} digit`,
        "error"
      );
    } else {
      const newDoc = { name: values?.documentName, id: inputValue };

      setDocumentIds((prev) => [...prev, newDoc]);

      setValues((prev) => ({
        ...prev,
        ID_Proof_No: "",
        documentName: "",
        documentIds: [...documentIds, newDoc],
      }));
    }
  };

  const deleteDocument = (doc) => {
    const docDetail = documentIds?.filter((val) => val.id !== doc?.id);
    setValues((val) => ({ ...val, documentIds: docDetail }));
    setDocumentIds(docDetail);
  };


  const getAgeByDateOfBirth = async (e) => {
    try {
      let dobValue = e.target.value;

      // Ensure valid date input using moment
      if (!moment(dobValue, VITE_DATE_FORMAT, true).isValid()) {
        return;
      }

      let age = await findAgeByDOB(moment(dobValue).format("YYYY-MM-DD"));
      if (age?.success) {
        setValues((val) => ({
          ...val,
          DOB: moment(dobValue).toDate(),
          Age: age?.data?.split(" ")[0] || 0,
          AgeType: age?.data?.split(" ")[1] || "",
        }));
      } else {
        notify(age?.message, "error");
      }
    } catch (error) {
      console.error("Error calculating age:", error);
    }
  };

//  This All UseEffect For hanlde to show or remove the Country,State,City,District value
  useEffect(() => {
    if (typeof (values?.countryID) === "object") {
      setValues((val) => ({ ...val, StateID: null, districtID: null, cityID: null }));
    }
  }, [values?.countryID]);

  useEffect(() => {
    if (typeof (values?.StateID) === "object") {
      setValues((val) => ({ ...val, districtID: null, cityID: null }));
    }
  }, [values?.StateID])

  useEffect(() => {
    if (typeof (values?.districtID) === "object") {
      setValues((val) => ({ ...val, cityID: null }));
    }
  }, [values?.districtID])

  console.log(values,"the values 👍👍💋")
  
 

  return (
    <>
      <div className="row pt-2 pl-2 pr-2">
        <div className="d-md-none">
          {/* <UploadImage /> */}

          <label
            style={{
              position: "absolute",
              zIndex: "1",
              top: "0px",
              right: "100px",
            }}
            id="document-s"
            onClick={() => setIsuploadDocOpen(true)}
          >
            <i className="fa fa-file" aria-hidden="true"></i>
          </label>
          <label
            style={{
              position: "absolute",
              zIndex: "1",
              top: "0px",
              right: "10px",
            }}
            onClick={() => setIsuploadOpen(true)}
          >
            {t("Upload Image")}
          </label>
        </div>
        <div className="col-md-11 col-sm-12 ">
          <div className="row row-cols-lg-5 row-cols-md-2 row-cols-1">
            <Input
              type="text"
              className="form-control "
              id="Barcode"
              name="Barcode"
              value={values?.Barcode ? values?.Barcode : ""}
              readOnly={isUpdate}
              lable={t("BarCode")}
              placeholder=" "
              respclass="col-xl-2.5 col-md-3 col-sm-6 col-12"
              onKeyDown={(e) => {
                handleOldPatientSearch(e);
                handleKeyDown(e);
              }}
              onChange={handleChange}
            // inputRef={inputRef}
            />
            <Input
              type="text"
              className="form-control required-fields"
              id="Mobile"
              name="Mobile"
              value={values?.Mobile ? values?.Mobile : ""}
              onChange={(e) => {
                inputBoxValidation(
                  MOBILE_NUMBER_VALIDATION_REGX,
                  e,
                  handleChange
                );
              }}
              showTooltipCount={true}
              lable={t("Mobile Number")}
              placeholder=" "
              respclass="col-xl-2.5 col-md-3 col-sm-6 col-12"
              onKeyDown={(e) => {
                handleOldPatientSearch(e);
                handleKeyDown(e);
              }}
              disabled={isDisableInputs}
            />

            <div className="col-xl-2.5 col-md-3 col-sm-6 col-12">
              <div className="row">
                <ReactSelect
                  placeholderName={t("Title")}
                  dynamicOptions={filterByTypes(
                    CentreWiseCache,
                    [1],
                    ["TypeID"],
                    "TextField",
                    "ValueField",
                    "Department"
                  )}
                  // id={"Title"}
                  name="Title"
                  // inputClass="required-fields"
                  inputId="Title"
                  value={values?.Title}
                  handleChange={(name, value) => {
                    setValues((val) => ({
                      ...val,
                      [name]: value,
                      Gender:
                        value?.extraColomn !== "UnKnown"
                          ? value?.extraColomn
                          : "",
                    }));
                  }}
                  searchable={true}
                  respclass="col-5 "
                  requiredClassName="required-fields"
                  // onKeyDown={()=>{console.log("Ss")}}
                  //tabIndex="2"
                  isDisabled={isDisableInputs}

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
                  onKeyDown={(e) => {
                    handleOldPatientSearch(e);
                    handleKeyDown(e);
                  }}
                  isUpperCase={true}
                  //tabIndex="3"
                  disabled={isDisableInputs}

                />
              </div>
            </div>

            <Input
              type="text"
              className="form-control"
              id="Last_Name"
              name="PLastName"
              value={values?.PLastName ? values?.PLastName : ""}
              onChange={handleChange}
              lable={t("Last_Name")}
              placeholder=" "
              respclass="col-xl-2.5 col-md-3 col-sm-6 col-12"
              isUpperCase={true}
              disabled={isDisableInputs}

            />

            <div className="col-xl-2.5 col-md-3 col-sm-6 col-12">
              <div className="row">
                <ReactSelect
                  placeholderName={t("Gender")}
                  isDisabled={
                    values?.Gender === "Male" || values?.Gender === "Female" || isDisableInputs
                      ? true
                      : false
                  }
                  // id="Gender"
                  inputId="Gender"
                  dynamicOptions={filterByTypes(
                    CentreWiseCache,
                    [22],
                    ["TypeID"],
                    "TextField",
                    "ValueField"
                  )}
                  name="Gender"
                  value={values?.Gender}
                  handleChange={handleReactSelect}
                  searchable={true}
                  respclass="col-5"
                  requiredClassName={`required-fields ${values?.Gender === "Male" || values?.Gender === "Female" ? "disable-focus" : ""}`}
                  DropdownIndicator={true}

                //tabIndex="4"
                />

                <ReactSelect
                  placeholderName={t("Marital_Status")}
                  id="Marital_Status"
                  dynamicOptions={filterByType(
                    CentreWiseCache,
                    24,
                    "TypeID",
                    "TextField",
                    "ValueField"
                  )}
                  name="MaritalStatus"
                  value={values?.MaritalStatus}
                  handleChange={handleReactSelect}
                  searchable={true}
                  respclass="col-7"
                  isDisabled={isDisableInputs}

                //tabIndex="-1"
                />
              </div>
            </div>
            {/* <DatePicker
              className="custom-calendar"
              respclass="col-xl-2.5 col-md-3 col-sm-6 col-12"
              id="DOB"
              name="DOB"
              value={values?.DOB ? moment(values?.DOB).toDate() : ""}
              maxDate={new Date()}
              // handleChange={handleChange}
              handleChange={(e) => {
                getAgeByDateOfBirth(e, handleChange);
                handleChange(e);
              }}
              lable={t("DOB")}
              placeholder={VITE_DATE_FORMAT}
              handleKeyDown={handleDateKeyDown}
            /> */}
            <DatePicker
              className="custom-calendar"
              respclass="col-xl-2.5 col-md-3 col-sm-6 col-12"
              id="DOB"
              name="DOB"
              value={values?.DOB ? moment(values?.DOB).toDate() : ""}
              maxDate={new Date()}
              handleChange={(e) => {
                // Validate date format here as well when it is being changed
                const dateInput = e.target.value;

                getAgeByDateOfBirth(e); // Calculate Age if the date is valid
                setValues((prev) => ({
                  ...prev,
                  DOB: moment(dateInput).toDate(), // Ensure state updates
                }));
              }}
              lable={t("DOB")}
              placeholder={VITE_DATE_FORMAT}
              disable={isDisableInputs}

            />

            <div className="col-xl-2.5 col-md-3 col-sm-6 col-12">
              <div className="row">
                <Input
                  type="text"
                  className="form-control required-fields"
                  id="Age"
                  name="Age"
                  value={values?.Age ? values?.Age : ""}
                  onChange={(e) => {
                    ageValidation(
                      /^\d{0,2}(\.\d{0,2})?$/,
                      e,
                      handleChange,
                      values?.AgeType?.value
                        ? values?.AgeType?.value
                        : values?.AgeType
                    );
                  }}
                  lable={t("Age")}
                  placeholder=" "
                  respclass="col-5"
                  disabled={isDisableInputs}

                //tabIndex="5"
                />

                <ReactSelect
                  placeholderName={t("Type")}
                  id="Type"
                  name="AgeType"
                  removeIsClearable={true}
                  value={values?.AgeType}
                  handleChange={handleReactSelect}
                  dynamicOptions={AGE_TYPE}
                  searchable={true}
                  respclass="col-7"
                  isDisabled={isDisableInputs}


                //tabIndex="-1"
                />
              </div>
            </div>

            <Input
              type="text"
              className="form-control "
              id="Email_Address"
              name="Email"
              value={values?.Email ? values?.Email : ""}
              onChange={handleChange}
              lable={t("Email")}
              placeholder=" "
              respclass="col-xl-2.5 col-md-3 col-sm-6 col-12"
              disabled={isDisableInputs}

            />

            <div className="col-xl-2.5 col-md-3 col-sm-6 col-12">
              <div className="row">
                <Input
                  type="text"
                  className="form-control"
                  id="Local_Address"
                  name="House_No"
                  value={values?.House_No || ""}
                  onChange={handleChange}
                  lable={t("Local_Address")}
                  placeholder=" "
                  respclass="col-11"
                  disabled={isDisableInputs}

                />

                <div className="col-1 d-flex align-items-center justify-content-center registerion-checkbox">
                  <Checkbox
                    id="checkbox"
                    className=""
                    name="checkbox"
                    onChange={handleCheckboxChange}
                    checked={checkbox}
                    disabled={isDisableInputs}

                  />
                </div>

              </div>
            </div>

            <Input
              type="text"
              className="form-control "
              id="parmanentAddress"
              name="parmanentAddress"
              value={values?.parmanentAddress ? values?.parmanentAddress : ""}
              onChange={handleChange}
              lable={t("Perma_Address")}
              placeholder=" "
              respclass="col-xl-2.5 col-md-3 col-sm-6 col-12"
              disabled={isDisableInputs}

            />

            <ReactSelect
              placeholderName={t("Country")}
              searchable={true}
              id="Country"
              respclass="col-xl-2.5 col-md-3 col-sm-6 col-12"
              dynamicOptions={filterByTypes(
                CentreWiseCache,
                [7],
                ["TypeID"],
                "TextField",
                "ValueField",
                "STD_CODE"
              )}
              name="countryID"
              value={`${values?.countryID}`}
              handleChange={handleReactSelect}
              isDisabled={isDisableInputs}

            //tabIndex="-1"
            />

            <div className="col-xl-2.5 col-md-3 col-sm-6 col-12">
              <div className="d-flex">
                <ReactSelect
                  placeholderName={t("State")}
                  searchable={true}
                  respclass="w-100 pr-2"
                  id="State"
                  dynamicOptions={
                    values?.countryID
                      ? filterByTypes(
                        CentreWiseCache,
                        [
                          8,
                          // `${values?.countryID?.value ? parseInt(values?.countryID?.value) : BindResource?.DefaultCountryID}`,
                          `${values?.countryID?.value ? parseInt(values?.countryID?.value) : values?.countryID}`,
                        ],
                        ["TypeID", "CountryID"],
                        "TextField",
                        "ValueField"
                      )
                      : []
                  }
                  name="StateID"
                  value={`${values?.StateID ? values?.StateID : ""}`}
                  handleChange={handleReactSelect}
                  isDisabled={isDisableInputs}

                //tabIndex="-1"
                />

                <div>
                  <button
                    className="btn btn-sm btn-primary"
                    disabled={values?.countryID && !isDisableInputs ? false : true}
                    onClick={() =>
                      handleModel(
                        "Add_State",
                        "20vw",
                        "State",
                        true,
                        <StateModel
                          handleChangeModel={handleChangeModel}
                          inputData={{
                            countryID: values?.countryID?.value
                              ? values?.countryID?.value
                              : values?.countryID,
                            ipAddress: ip,
                            EntryBy: userData?.employeeID,
                          }}
                        />,
                        handleStateInsertAPI
                      )
                    }
                    type="button"
                  >
                    <i className="fa fa-plus-circle fa-sm new_record_pluse"></i>
                  </button>
                </div>
              </div>
            </div>

            <div className="col-xl-2.5 col-md-3 col-sm-6 col-12">
              <div className="d-flex">
                <ReactSelect
                  placeholderName={t("District")}
                  searchable={true}
                  id="District"
                  dynamicOptions={
                    values?.StateID
                      ? filterByTypes(
                        CentreWiseCache,
                        [
                          9,
                          `${values?.countryID?.value ? values?.countryID?.value : values?.countryID}`,
                          values?.StateID?.value
                            ? parseInt(values?.StateID?.value)
                            : values?.StateID,
                        ],
                        ["TypeID", "CountryID", "StateID"],
                        "TextField",
                        "ValueField"
                      )
                      : []
                  }
                  name="districtID"
                  value={`${values?.districtID ? values?.districtID : ""}`}
                  handleChange={handleReactSelect}
                  respclass="w-100 pr-2"
                  isDisabled={isDisableInputs}

                //tabIndex="-1"
                />
                <div className="box-inner">
                  <button
                    className="btn btn-sm btn-primary"
                    disabled={values?.StateID && !isDisableInputs ? false : true}
                    onClick={() =>
                      handleModel(
                        "Add_District",
                        "20vw",
                        "District",
                        true,
                        <DistrictModel
                          handleChangeModel={handleChangeModel}
                          inputData={{
                            stateID: values?.StateID?.value
                              ? parseInt(values?.StateID?.value)
                              : values?.StateID,
                            countryID: values?.countryID?.value
                              ? parseInt(values?.countryID?.value)
                              : values?.countryID,
                            ipAddress: ip,
                            EntryBy: userData?.employeeID,
                          }}
                        />,
                        handleDistrictInsertAPI
                      )
                    }
                    type="button"
                  >
                    <i className="fa fa-plus-circle fa-sm new_record_pluse"></i>
                  </button>
                </div>
              </div>
            </div>

            <div className="col-xl-2.5 col-md-3 col-sm-6 col-12">
              <div className="d-flex">
                <ReactSelect
                  placeholderName={t("City")}
                  searchable={true}
                  respclass="w-100 pr-2"
                  id="City"
                  dynamicOptions={
                    values?.districtID
                      ? filterByTypes(
                        CentreWiseCache,
                        [
                          10,
                          values?.StateID?.value
                            ? parseInt(values?.StateID?.value)
                            : values?.StateID,
                          values?.districtID?.value
                            ? parseInt(values?.districtID?.value)
                            : values?.districtID,
                        ],
                        ["TypeID", "StateID", "DistrictID"],
                        "TextField",
                        "ValueField"
                      )
                      : []
                  }
                  name="cityID"
                  value={`${values?.cityID ? values?.cityID : ""}`}
                  handleChange={handleReactSelect}
                  isDisabled={isDisableInputs}

                />

                <div className="box-inner">
                  <button
                    className="btn btn-sm btn-primary"
                    disabled={values?.districtID && !isDisableInputs ? false : true}
                    onClick={() =>
                      handleModel(
                        "Add_City",
                        "20vw",
                        "city",
                        true,

                        <CityModel
                          handleChangeModel={handleChangeModel}
                          inputData={{
                            city: "noida",
                            country: `${values?.countryID?.value ? parseInt(values?.countryID?.value) : values?.countryID}`,
                            ipAddress: ip,
                            districtID: values?.districtID?.value
                              ? parseInt(values?.districtID?.value)
                              : values?.districtID,
                            CreatedBy: userData?.employeeID,
                            stateID: values?.StateID?.value
                              ? parseInt(values?.StateID?.value)
                              : values?.StateID,
                          }}

                        />,
                        handleCityInsertAPI
                      )
                    }
                    type="button"
                  >
                    <i className="fa fa-plus-circle fa-sm new_record_pluse"></i>
                  </button>
                </div>
              </div>
            </div>

            <div className="col-xl-2.5 col-md-3 col-sm-6 col-12">
              <div className="row align-items-end g-1">
                {/* ReactSelect */}
                <div className="col-md-4 col-5">
                  <ReactSelect
                    placeholderName={t("ID")}
                    name="documentName"
                    value={`${values?.documentName}`}
                    handleChange={handleReactSelect}
                    searchable={true}
                    id={"ID"}
                    dynamicOptions={filterByType(
                      CentreWiseCache,
                      13,
                      "TypeID",
                      "TextField",
                      "ValueField"
                    )}
                    isDisabled={isDisableInputs}

                  />
                </div>

                {/* Input */}
                <div className="col-md-6 col-6">
                  <Input
                    type="text"
                    className="form-control"
                    id="ID_Proof_No"
                    name="ID_Proof_No"
                    value={values?.ID_Proof_No ? values?.ID_Proof_No : ""}
                    onChange={(e) => {
                      inputBoxValidation(
                        VARCHAR_REGX(
                          values?.documentName?.value?.split("#")[1]
                        ),
                        e,
                        handleChange
                      );
                    }}
                    lable={t("ID_Proof_No")}
                    placeholder=" "
                    showTooltipCount={true}
                    onKeyDown={handleAddDocumentIDs}
                    disabled={isDisableInputs}

                  />
                </div>

                <div className="col-md-2 col-1 d-flex justify-center align items-center mb-1">
                  <button
                    className="btn btn-primary p-2 rounded-circle"
                    type="button"
                    onClick={handleAddDocumentIDsOnClick}
                    disabled={isDisableInputs}
                  >
                    <i className="fa fa-plus-circle fa-sm new_record_pluse "></i>
                  </button>
                </div>
              </div>
            </div>

            <div className="d-flex">
              {documentIds?.map((doc, key) => {
                return (
                  <div className="d-flex ml-2 mb-2" key={key}>
                    <LabeledInput
                      label={doc?.name?.label}
                      value={doc?.id}
                      className={"document_label"}
                    />
                    <button
                      className="btn btn-sm btn-primary "
                      type="button"
                      onClick={() => {
                        deleteDocument(doc);
                      }}
                    >
                      <i className="fa fa-times fa-sm new_record_pluse"></i>
                    </button>
                  </div>
                );
              })}
            </div>

          </div>
        </div>

        <div className="col-1 d-none d-md-block position-relative">
          <div
            style={{
              border: "1px solid grey",
              borderRadius: "5px",
              textAlign: "center",
              width: "67%",
              marginLeft: "10px",
            }}
            className="p-1"
          >
            <img
              height={50}
              // width={116}
              src={values?.PatientPhoto}
              style={{ width: "100%" }}
              // alt="Not found"
              onClick={() => setIsuploadOpen(true)}
            />
          </div>
          <div className="p-1 personalDetailUploadDocument">
            <Tooltip
              target={`#document-s`}
              position="top"
              content={t("Patient Document's")}
              event="hover"
            />
            <button
              className="text-white rounded  position-absolute p-1"
              type="button"
              style={{
                width: "62%",
                fontSize: "11px",
                marginLeft: "5px",
                bottom: "5px",
              }}
              id="document-s"
              onClick={() => setIsuploadDocOpen(true)}
            >
              <i className="fa fa-file" aria-hidden="true"></i>
            </button>
            {/* <button
              className="text-white rounded d-block d-xl-none position-absolute"
              style={{ width: "67%", marginLeft: "3px", bottom: "5px" }}
              id="document-s"
            >
              <i className="fa fa-file" aria-hidden="true"></i>
            </button> */}
          </div>
        </div>

      </div>

      {handleModelData?.isOpen && (
        <Modal
          visible={handleModelData?.isOpen}
          setVisible={setIsOpen}
          modalWidth={handleModelData?.width}
          Header={t(handleModelData?.label)}
          buttonType={"submit"}
          buttons={handleModelData?.extrabutton}
          modalData={handleModelData?.modalData}
          setModalData={setModalData}
          handleAPI={handleModelData?.handleInsertAPI}
        >
          {handleModelData?.Component}
        </Modal>
      )}

      {isuploadDocOpen && (
        <AttachDoumentModal
          isuploadOpen={isuploadDocOpen}
          setIsuploadOpen={setIsuploadDocOpen}
          documentsViewList={values?.documentsList}
          // preview={preview}
          values={values}

          modelHeader={t("Upload Patient Document")}
          handleAPI={(data) => {
            setValues((val) => ({ ...val, documentsList: data }));
            setIsuploadDocOpen(false);
          }}

        // handleImageChange={handleImageChange}
        />
      )}

      {isuploadOpen && (
        <UploadImageModal
          isuploadOpen={isuploadOpen}
          closeCameraStream={closeCameraStream}
          setIsuploadOpen={setIsuploadOpen}
          // preview={preview}
          modalData={{ preview: preview }}
          handleImageChange={handleImageChange}
          startCamera={startCamera}
          videoRef={videoRef}
          cameraStream={cameraStream}
          takePhoto={takePhoto}
          canvasRef={canvasRef}
          // handleAPI={(data) => { console.log("ASdasd",data)}}
          handleAPI={(data) => {
            setValues((val) => ({ ...val, profileImage: data?.preview }));
            setIsuploadOpen(false);
            closeCameraStream();
          }}
        />
      )}

      {/* {getOldPatientData?.length > 0 && (
        <div
          style={{
            position: "absolute",
            zIndex: 9,
            width: "80%",
            top: "63px",
          }}
        >
          <EasyUI
            dataBind={getOldPatientData}
            dataColoum={BIND_TABLE_OLDPATIENTSEARCH_REG}
            onClick={handleClickEasyUI}
          />
        </div>
      )} */}
    </>
  );
}
