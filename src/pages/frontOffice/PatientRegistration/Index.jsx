import React, { useEffect, useRef, useState } from "react";
import Accordion from "@app/components/UI/Accordion";
import PersonalDetails from "@app/components/front-office/PersonalDetails";
import PanelDetails from "@app/components/front-office/PanelDetails";
import { useTranslation } from "react-i18next";
import OtherDetails from "@app/components/front-office/OtherDetails";
import { useDispatch, useSelector } from "react-redux";
import { useLocalStorage } from "../../../utils/hooks/useLocalStorage";
import { useFormik } from "formik";
import {
  BIND_TABLE_OLDPATIENTSEARCH_REG,
  DIRECT_PATIENT_SEARCH_TYPE,
  PATIENT_DETAILS,
} from "../../../utils/constant";
import Heading from "../../../components/UI/Heading";
import {
  Register_Patient_TypeCasting,
  bindLabelValue,
  filterByTypes,
  handletab,
  notify,
} from "../../../utils/utils";
import {
  CentreWiseCacheByCenterID,
  CentreWisePanelControlCache,
  GetPatientDocument,
} from "../../../store/reducers/common/CommonExportFunction";
import {
  Oldpatientsearch,
  PatientSearchbyBarcode,
  bindPanelByPatientID,
} from "../../../networkServices/opdserviceAPI";
import EasyUI from "../../../components/EasyUI/EasyUI";
import {
  PatientRegistrationAPI,
  PatientUpdateRegistrationAPI,
  ValidateDuplicatePatientEntry,
} from "../../../networkServices/directPatientReg";
import Modal from "../../../components/modalComponent/Modal";
import DuplicatePatientAlertModel from "../../../components/modalComponent/Utils/DuplicatePatientAlertModel";

import * as Yup from "yup";
import moment from "moment";
import Input from "../../../components/formComponent/Input";

// Define the validation schema
const validationSchema = Yup.object().shape({
  // Barcode: Yup.string().required('Barcode is required'),
  // Mobile: Yup.string().required("Mobile is required"),
  // Title: Yup.string().required('Title is required'),
  Mobile: Yup.string()
    .matches(/^[0-9]+$/, "Mobile must be only digits")
    .min(10, "Mobile must be at least 10 digits")
    .required("Mobile number is required"),
  Title: Yup.mixed().required("Title is required"),
  PFirstName: Yup.string()
    .required("First Name is required")
    .min(3, "First Name is At least 3 characters"),
  Gender: Yup.mixed().required("Gender is required"),
  Age: Yup.string()
    .matches(
      /^\d+(\.\d{1,2})?$/,
      "Age must be a number with up to two decimal places"
    )
    .required("Age is required"),
});

export default function Index(props) {
  const localdata = useLocalStorage("userData", "get");
  const [t] = useTranslation();
  const dispatch = useDispatch();
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [panelBodyData, setPanelBodyData] = useState([]);
  const [panelDocumentData, setPanelDocumentData] = useState([]);
  const [isDuplicateModel, setIsDuplicateModel] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [isAfterSaveModel, setIsAfterSaveModel] = useState(false);
  const [getOldPatientData, setGetOldPatientData] = useState([]);
  const [documentIds, setDocumentIds] = useState([]);
  const [isUpdateRegistration, setIsRegistrationUpdate] = useState(false);
  const [relations, setRelations] = useState([]);

  const [patientDetails, setPatientDetail] = useState({
    PanelPatientDetail: [],
    singlePatientData: {},
  });

  const inputRef = useRef(null);
  let tabItems = ["Panel Details", "Other Details"];
  if (props?.PatientID) tabItems = ["Other Details"];

  const formRef = useRef(null);

  const { CentreWiseCache, CentreWisePanelControlCacheList, BindResource } = useSelector(
    (state) => state.CommonSlice
  );

  const ValidateDuplicatePatient = async (value) => {
    
    try {
      const data = await ValidateDuplicatePatientEntry(value, documentIds);

      if (data?.success && !isUpdate) {
        setIsDuplicateModel(true);
        return false;
      }
      if (isUpdate) {
        if (values?.updateReasonRemarks) {
          UpdatePatientDetailAPI();
        } else {
          notify("Update Reason Remarks is required", "error");
          const inputElement = document.getElementById("Update");
          if (inputElement) {
            inputElement.focus();
          }
        }
      } else {
        SaveRegistrationAPI();
      }
    } catch (error) {
      console.error(error);
    }
  };
  const SaveRegistrationAPI = async () => {
    setIsDuplicateModel(false);
    const saveData = Register_Patient_TypeCasting(
      relations,
      values,
      panelBodyData,
      "",
      panelDocumentData
    );
    try {
      let apiResp = await PatientRegistrationAPI(saveData);
      if (apiResp?.success) {
        setDocumentIds([]);
        notify(apiResp?.message, "success");
        if (props?.getRegPatientID)
          props?.getRegPatientID(
            apiResp?.data,
            props?.registrationConfirmData?.App_ID
          );
        // console.log(props?.registrationConfirmData?.App_ID)
        if (props?.bindDetail) {
          props?.setVisible(false);
          props?.bindDetailAPI({ MRNo: apiResp?.data });
        } else {
          // setValues({ UHID: apiResp?.data })
          let countryCode = filterByTypes(
            CentreWiseCache,
            [7, BindResource?.BaseCurrencyID],
            ["TypeID", "ValueField"],
            "TextField",
            "ValueField",
            "STD_CODE"
          );
          let defaultState = filterByTypes(
            CentreWiseCache,
            [8, BindResource?.DefaultStateID],
            ["TypeID", "ValueField"],
            "TextField",
            "ValueField"
          );
          let defaultDistrict = filterByTypes(
            CentreWiseCache,
            [9, BindResource?.DefaultDistrictID],
            ["TypeID", "ValueField"],
            "TextField",
            "ValueField"
          );
          let defaultCity = filterByTypes(
            CentreWiseCache,
            [10, BindResource?.DefaultCityID],
            ["TypeID", "ValueField"],
            "TextField",
            "ValueField"
          );
          setValues({
            countryID: BindResource?.BaseCurrencyID,
            Country: BindResource?.DefaultCountry,
            StateID: parseInt(BindResource?.DefaultStateID),
            districtID: parseInt(BindResource?.DefaultDistrictID),
            cityID: parseInt(BindResource?.DefaultCityID),
            IsInternational: "2",
            ResidentialNumber_STDCODE: countryCode?.length
              ? countryCode[0]?.extraColomn
              : "+91",
            AgeType: "YRS",
            Religion: "Hinduism",
            Relation: "Self",
            District: defaultDistrict?.length > 0 && defaultDistrict[0]?.label,
            State: defaultState?.length > 0 && defaultState[0]?.label,
            City: defaultCity?.length > 0 && defaultCity[0]?.label,
            Phone_STDCODE: countryCode?.length
              ? countryCode[0]?.extraColomn
              : "+91",
            UHID: apiResp?.data,
          });
          setIsAfterSaveModel(true);
        }
        setPanelBodyData([]);
        setRelations([]);
      } else {
        notify(apiResp?.message, "error");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const UpdatePatientDetailAPI = async () => {
    setIsDuplicateModel(false);
    const saveData = Register_Patient_TypeCasting(
      relations,
      values,
      panelBodyData,
      isUpdate,
      panelDocumentData
    );
    try {
      let apiResp = await PatientUpdateRegistrationAPI(saveData);
      if (apiResp?.success) {
        setIsUpdate(false);
        let message = "";
        props?.updateButtonName
          ? (message = t(`panelUpdate`))
          : (message = t(`demographicsUpdate`));
        notify(message, "success");
        // console.log("aaaa", message, props?.updateButtonName)
        props?.setVisible && props?.setVisible(false);

        if (props?.bindDetail) {
          await props?.bindDetailAPI({ MRNo: values?.Barcode });
          await props?.handleBindPanelByPatientID({ MRNo: values?.Barcode });
        } else {
          let countryCode = filterByTypes(
            CentreWiseCache,
            [7, BindResource?.BaseCurrencyID],
            ["TypeID", "ValueField"],
            "TextField",
            "ValueField",
            "STD_CODE"
          );
          let defaultState = filterByTypes(
            CentreWiseCache,
            [8, BindResource?.DefaultStateID],
            ["TypeID", "ValueField"],
            "TextField",
            "ValueField"
          );
          let defaultDistrict = filterByTypes(
            CentreWiseCache,
            [9, BindResource?.DefaultDistrictID],
            ["TypeID", "ValueField"],
            "TextField",
            "ValueField"
          );
          let defaultCity = filterByTypes(
            CentreWiseCache,
            [10, BindResource?.DefaultCityID],
            ["TypeID", "ValueField"],
            "TextField",
            "ValueField"
          );
          setValues({
            countryID: BindResource?.BaseCurrencyID,
            Country: BindResource?.DefaultCountry,
            StateID: parseInt(BindResource?.DefaultStateID),
            districtID: parseInt(BindResource?.DefaultDistrictID),
            cityID: parseInt(BindResource?.DefaultCityID),
            IsInternational: "2",
            ResidentialNumber_STDCODE: countryCode?.length
              ? countryCode[0]?.extraColomn
              : "+91",
            AgeType: "YRS",
            Religion: "Hinduism",
            Relation: "Self",
            District: defaultDistrict?.length > 0 && defaultDistrict[0]?.label,
            State: defaultState?.length > 0 && defaultState[0]?.label,
            City: defaultCity?.length > 0 && defaultCity[0]?.label,
            Phone_STDCODE: countryCode?.length
              ? countryCode[0]?.extraColomn
              : "+91",

            // UHID: apiResp?.data
          });
          setPanelBodyData([]);
        }
      } else {
        notify(apiResp?.message, "error");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const {
    handleChange,
    values,
    setFieldValue,
    setValues,
    handleSubmit: handleFormSubmit,
    errors,
    touched,
    validateForm,
  } = useFormik({
    initialValues: PATIENT_DETAILS,
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      ValidateDuplicatePatient(values);
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (values?.Phone && values?.Mobile && values?.Phone === values?.Mobile) {
      notify("Please provide an additional alternate mobile number.", "warn");
      return;
    }

    let { name } = e.target;
    if (
      name === "ID_Proof_No" ||
      name === "PFirstName" ||
      name === "Mobile" ||
      name === "Barcode"
    ) {
      return 0;
    }
    const errors = await validateForm();
    if (Object.values(errors)[0]) {
      notify(Object.values(errors)[0], "error");
      const inputElement = document.getElementById(
        Object.values(errors)[0].split(" ")[0]
      );
      if (inputElement) {
        inputElement.focus();
      }
    }
    if (Object.keys(errors).length === 0) {
      // handleFormSubmit();
      ValidateDuplicatePatient(values);
    }
  };


  const [propData, setPropData] = useState(props.data);

  const handleReactSelect = (name, value) => {
    if (name === "documentName") {
      setFieldValue("ID_Proof_No", "");
    }
    setFieldValue(name, value);
  };

  const CentreWiseCacheByCenterIDAPI = async () => {
    let data = await dispatch(CentreWiseCacheByCenterID({}));
    if (data?.payload?.success) {
      let countryCode = filterByTypes(
        data?.payload?.data,
        [7, BindResource?.BaseCurrencyID],
        ["TypeID", "ValueField"],
        "TextField",
        "ValueField",
        "STD_CODE"
      );
      let defaultState = filterByTypes(
        data?.payload?.data,
        [8, BindResource?.DefaultStateID],
        ["TypeID", "ValueField"],
        "TextField",
        "ValueField"
      );
      let defaultDistrict = filterByTypes(
        data?.payload?.data,
        [9, BindResource?.DefaultDistrictID],
        ["TypeID", "ValueField"],
        "TextField",
        "ValueField"
      );
      let defaultCity = filterByTypes(
        data?.payload?.data,
        [10, BindResource?.DefaultCityID],
        ["TypeID", "ValueField"],
        "TextField",
        "ValueField"
      );

      setValues((val) => ({
        ...val,
        District: values?.districtID
          ? values?.districtID?.label
          : defaultDistrict?.length > 0 && defaultDistrict[0]?.label,
        State: values?.StateID
          ? values?.StateID?.label
          : defaultState?.length > 0 && defaultState[0]?.label,
        City: values?.cityID
          ? values?.cityID?.label
          : defaultCity?.length > 0 && defaultCity[0]?.label,
        Phone_STDCODE: values?.Phone_STDCODE
          ? values?.Phone_STDCODE
          : countryCode?.length
            ? countryCode[0]?.extraColomn
            : "+91",
      }));
    }
  };
  useEffect(() => {
    if (CentreWiseCache?.length === 0) {
      CentreWiseCacheByCenterIDAPI();
    }
    if (CentreWisePanelControlCacheList?.length === 0) {
      dispatch(
        CentreWisePanelControlCache({
          centreID: localdata?.defaultCentre,
        })
      );
    }
  }, [dispatch]);

  const handleOldPatientSearch = async (e) => {
    if ([13].includes(e.which)) {
      try {
        const data = await Oldpatientsearch(
          e.target.value,
          DIRECT_PATIENT_SEARCH_TYPE[e.target.name]
        );
        // handleGetPatientDocument()

        setIsRegistrationUpdate(
          data?.data[0]?.isUpdateRegistration == 1 ? false : true
        );
        if (data?.data?.length > 0) {
          if (data?.data?.length === 1) {
            handleClickEasyUI(data?.data[0]);
             handleGetPatientDocument(data?.data[0]?.MRNo)
          }
          setGetOldPatientData(data?.data);
        } else {
          notify("Record Not Found", "error");
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleClickEasyUI = (value) => {
    handleSinglePatientData(value);
    setIsUpdate(true);
  };
  console.log("documentIdsdocumentIds", values?.documentIds)
  const handleSinglePatientData = async (patientDetails) => { 
    const { MRNo, PatientRegStatus } = patientDetails;
    try {
      const data = await PatientSearchbyBarcode(MRNo, PatientRegStatus);
    
      if (data?.data) {
        setPatientDetail((val) => ({ ...val, singlePatientData: data?.data }));

        setRelations(
          data?.data?.PatientRelationData
            ? data?.data?.PatientRelationData?.map((ele) => ({
              isPersonal: ele?.IsPersonal == 1 ? true : false,
              RelationName: ele?.RelationName,
              Relation: ele?.RelationOf,
              RelationPhone: ele?.RelationPhoneNo,
            }))
            : []
        );
        if (data?.data?.Age) {
          data.data["AgeType"] = data?.data?.Age
            ? data?.data?.Age?.split(" ")[1]
            : "";
          data.data["Age"] = data?.data?.Age
            ? data?.data?.Age?.split(" ")[0]
            : values?.Age;
          data.data["HospPatientType"] = data?.data?.PatientTypeID;
          data.data["Barcode"] = data?.data?.PatientID;
        }
        let respdata = data?.data;
        respdata["documentIds"] = []
        if (data?.data?.patientIDProofs?.length > 0) {
          const formattedStringIDS = data?.data?.patientIDProofs
            ?.replace(/([a-zA-Z]+):/g, '"$1":')
            .replace(/:([^,}\]]+)/g, ':"$1"');
          const parsedData = JSON.parse(formattedStringIDS);
          let formatedIDs = [];

          if (parsedData?.length > 0) {
            parsedData?.map((val) => {
              let obj = {};
              obj.name = { label: val?.IDProofName, value: val?.IDProofID };
              obj.id = val?.IDProofNumber;
              formatedIDs.push(obj);
            });
            respdata.documentIds=formatedIDs
          } 
          setDocumentIds(formatedIDs);
        }

        respdata.profileImage = respdata?.PatienetPhoto;
        respdata.DOB
          ? (respdata.DOB = moment(respdata.DOB, "DD-MM-YYYY").format(
            "MM-DD-YYYY"
          ))
          : "0001-01-01";
        setValues(respdata);
        let PanelPatientDetail = await bindPanelByPatientID(
          data?.data?.PatientID
        );
        if (PanelPatientDetail?.success) {
          setPatientDetail((val) => ({
            ...val,
            PanelPatientDetail: PanelPatientDetail?.data?.map((val) => {
              val.PolicyExpiry
                ? (val.PolicyExpiry = moment(
                  val.PolicyExpiry,
                  "DD-MMM-YYYY"
                ).format("DD-MM-YYYY"))
                : "0001-01-01";
              return val;
            }),
          }));
        }
        setGetOldPatientData([]);
      }
    } catch (error) {
      console.log(error);
    }
  };

     


     const handleGetPatientDocument = async (patientID) => {  
        try { 
          const response = await GetPatientDocument(patientID);

          if (response.success) {
            console.log("the department data is", response); 
            setValues((val)=>({...val,documentvalue:response?.data}))
          } else {
            console.error(
              "API returned success as false or invalid response:",
              response
            );
             
          }
        } catch (error) {
          console.error("Error fetching department data:", error);
           
        }
      };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }

    if (e.key === "Enter") {
      if (selectedIndex !== null && getOldPatientData[selectedIndex]) {
        handleSinglePatientData(getOldPatientData[selectedIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prevIndex) => {
        const newIndex =
          prevIndex === null
            ? 0
            : Math.min(prevIndex + 1, getOldPatientData.length - 1);
        return newIndex;
      });
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prevIndex) => {
        const newIndex =
          prevIndex === null
            ? getOldPatientData.length - 1
            : Math.max(prevIndex - 1, 0);
        return newIndex;
      });
    }
  };

  useEffect(() => {
    if (props?.PatientID) {
      const data = handleSinglePatientData({
        MRNo: props?.PatientID,
        PatientRegStatus: 1,
      });
      setGetOldPatientData(data?.data);
      setIsUpdate(true);
    } else if (props?.registrationConfirmData) {
      let obj = { ...props?.registrationConfirmData };
      obj.Age = obj?.Age?.split(" ")[0];
      setValues(obj);
    } else {
      let countryCode = filterByTypes(
        CentreWiseCache,
        [7, BindResource?.BaseCurrencyID],
        ["TypeID", "ValueField"],
        "TextField",
        "ValueField",
        "STD_CODE"
      );

      setValues((val) => ({
        ...val,
        countryID: BindResource?.BaseCurrencyID,
        Country: BindResource?.DefaultCountry,
        StateID: parseInt(BindResource?.DefaultStateID),
        districtID: parseInt(BindResource?.DefaultDistrictID),
        cityID: parseInt(BindResource?.DefaultCityID),
        IsInternational: "2",
        ResidentialNumber_STDCODE: countryCode?.length
          ? countryCode[0]?.extraColomn
          : "+91",
        AgeType: "YRS",
        Religion: "Hinduism",
        Relation: "Self",
        // District: defaultDistrict || "",
        // State: defaultState || "",
        // City: defaultCity || "",
      }));
    }
    handletab(formRef);

    // CentreWiseCache?.length    dependecy array value
  }, []);

  useEffect(() => {
    if (!CentreWiseCache?.length) return;
    if (props?.PatientID) {
      const data = handleSinglePatientData({
        MRNo: props?.PatientID,
        PatientRegStatus: 1,
      });
      setGetOldPatientData(data?.data);
      setIsUpdate(true);
    } else if (props?.registrationConfirmData) {
      let obj = { ...props?.registrationConfirmData };
      obj.Age = obj?.Age?.split(" ")[0];
      setValues(obj);
    } else {
      let countryCode = filterByTypes(
        CentreWiseCache,
        [7, BindResource?.BaseCurrencyID],
        ["TypeID", "ValueField"],
        "TextField",
        "ValueField",
        "STD_CODE"
      );

      // Get filtered state list
      const stateList = filterByTypes(
        CentreWiseCache,
        [
          8,
          values?.countryID?.value
            ? parseInt(values.countryID.value)
            : values.countryID,
        ],
        ["TypeID", "CountryID"],
        "TextField",
        "ValueField"
      );

      const defaultState =
        stateList.length > 0
          ? stateList.find(
            (item) => item.value === BindResource?.DefaultStateID
          )?.label
          : "";

      // Get filtered district list
      const districtList = filterByTypes(
        CentreWiseCache,
        [
          9,
          values?.countryID?.value ? values.countryID.value : values.countryID,
          values?.StateID?.value
            ? parseInt(values.StateID.value)
            : values.StateID,
        ],
        ["TypeID", "CountryID", "StateID"],
        "TextField",
        "ValueField"
      );

      const defaultDistrict =
        districtList.length > 0
          ? districtList.find(
            (item) => item.value === BindResource?.DefaultDistrictID
          )?.label
          : "";

      // Get filtered city list
      const cityList = filterByTypes(
        CentreWiseCache,
        [
          10,
          values?.StateID?.value
            ? parseInt(values.StateID.value)
            : values.StateID,
          values?.districtID?.value
            ? parseInt(values.districtID.value)
            : values.districtID,
        ],
        ["TypeID", "StateID", "DistrictID"],
        "TextField",
        "ValueField"
      );

      const defaultCity =
        cityList.length > 0
          ? cityList.find((item) => item.value === BindResource?.DefaultCityID)
            ?.label
          : "";
      setValues((val) => ({
        ...val,
        countryID: BindResource?.BaseCurrencyID,
        Country: BindResource?.DefaultCountry,
        StateID: parseInt(BindResource?.DefaultStateID),
        districtID: parseInt(BindResource?.DefaultDistrictID),
        cityID: parseInt(BindResource?.DefaultCityID),
        IsInternational: "2",
        ResidentialNumber_STDCODE: countryCode?.length
          ? countryCode[0]?.extraColomn
          : "+91",
        AgeType: "YRS",
        Religion: "Hinduism",
        Relation: "Self",
        District: defaultDistrict || BindResource?.DefaultDistrict,
        State: defaultState || BindResource?.DefaultState,
        City: defaultCity || BindResource?.DefaultCity,
      }));
    }
    // 
    handletab(formRef);

    // CentreWiseCache?.length    dependecy array value
  }, [BindResource]);

  useEffect(() => {
    if (patientDetails?.PanelPatientDetail?.length > 0) {
      let panelDetailTableData = [];
      patientDetails?.PanelPatientDetail?.map((obj) => {
        if (obj?.PanelName !== "CASH") {
          let panelItem = {};
          panelItem["PanelGroup"] = bindLabelValue(
            obj?.PanelGroup,
            obj?.PanelGroupID
          );
          panelItem["PanelName"] = bindLabelValue(obj?.PanelName, obj?.PanelID);
          panelItem["ParentPanel"] = bindLabelValue(
            obj?.ParentPanel,
            obj?.ParentPanelID
          );
          panelItem["CorporareName"] = bindLabelValue(
            obj?.CorporareName,
            obj?.PanelCroporateID
          );
          panelItem["PolicyNo"] = obj?.PolicyNo;
          panelItem["PolicyCardNo"] = obj?.PolicyCardNo;
          panelItem["PanelCardName"] = obj?.PanelCardName;
          panelItem["PolicyExpiry"] = obj?.PolicyExpiry;
          panelItem["CardHolder"] = bindLabelValue(
            obj?.CardHolder,
            obj?.CardHolder
          );
          panelItem["ApprovalAmount"] = obj?.ApprovalAmount;
          panelItem["ApprovalRemarks"] = obj?.ApprovalRemarks;
          panelDetailTableData.push(panelItem);
        }
      });
      setPanelBodyData(panelDetailTableData);
    }
  }, [patientDetails?.PanelPatientDetail]);

  const handleDateKeyDown = (event) => {
    if (event.key === "Enter") {
      alert("Enter key pressed");
    }
  };
  

  // useEffect(()=>{
  //   handleGetPatientDocument()
  // },[])

  // const handleKeyDown = (e) => {
  // if (e.key === "Enter") {
  //   if (selectedIndex !== null && getOldPatientData[selectedIndex]) {
  //     onClick(getOldPatientData[selectedIndex]);
  //   }
  // } else if (e.key === "ArrowDown") {
  //   e.preventDefault();
  //   setSelectedIndex((prevIndex) => {
  //     const newIndex =
  //       prevIndex === null
  //         ? 0
  //         : Math.min(prevIndex + 1, getOldPatientData.length - 1);
  //     return newIndex;
  //   });
  // } else if (e.key === "ArrowUp") {
  //   e.preventDefault();
  //   setSelectedIndex((prevIndex) => {
  //     const newIndex =
  //       prevIndex === null
  //         ? getOldPatientData.length - 1
  //         : Math.max(prevIndex - 1, 0);
  //     return newIndex;
  //   });
  // }
  // };

  return (
    <>
      <form
        className="patient_registration position-relative"
        onSubmit={handleSubmit}
        ref={formRef}
      >
        {props?.type !== "panelDetail" && (
          <>
            <Heading isBreadcrumb={true} />
            <Accordion
              // title={t("FrontOffice.OPD.Personal_Details")}
              title={t("Personal_Details")}
              // isBreadcrumb={true}
              defaultValue={true}
            >
              <PersonalDetails
                CentreWiseCache={CentreWiseCache}
                handleChange={handleChange}
                values={values}
                setValues={setValues}
                handleReactSelect={handleReactSelect}
                documentIds={documentIds}
                setDocumentIds={setDocumentIds}
                // propData={propData}
                isDisableInputs={isUpdateRegistration}
                isUpdate={isUpdate}
                handleOldPatientSearch={handleOldPatientSearch}
                errors={errors}
                touched={touched}
                handleKeyDown={handleKeyDown}
                handleDateKeyDown={handleDateKeyDown}
              />
            </Accordion>

            <Accordion title={t("Other Details")} defaultValue={true}>
              <OtherDetails
                CentreWiseCache={CentreWiseCache}
                handleChange={handleChange}
                values={values}
                setValues={setValues}
                handleReactSelect={handleReactSelect}
                propData={propData}
                relations={relations}
                isDisableInputs={isUpdateRegistration}
                setRelations={setRelations}
                handleOldPatientSearch={handleOldPatientSearch}
              />
            </Accordion>
          </>
        )}

        {(!props?.PatientID || props?.type === "panelDetail") && (
          <Accordion title={t("PanelDetails")} defaultValue={true}>
            <PanelDetails
              handleChangePanelDetail={handleChange}
              values={values}
              setFieldValue={setFieldValue}
              setValues={setValues}
              handleReactSelect={handleReactSelect}
              CentreWisePanelControlCacheList={CentreWisePanelControlCacheList}
              PanelPatientDetailList={patientDetails?.PanelPatientDetail}
              panelBodyData={panelBodyData}
              setPanelBodyData={setPanelBodyData}
              setPanelDocumentData={setPanelDocumentData}
              panelDocumentData={panelDocumentData}
            />
          </Accordion>
        )}
        <div className="d-flex">
          <div className="mt-2 w-100 pr-2">
            {isUpdate && (
              <Input
                type="text"
                // className="form-control "
                className={`form-control required-fields`}
                id="Update"
                name="updateReasonRemarks"
                value={
                  values?.updateReasonRemarks ? values?.updateReasonRemarks : ""
                }
                lable={t("Update Reason Remarks")}
                placeholder=" "
                // removeFormGroupClass={true}
                respclass=""
                onKeyDown={(e) => {
                  handleKeyDown(e);
                }}
                onChange={handleChange}
              // inputRef={inputRef}
              />
            )}
          </div>
          <div
            className="mt-2  text-right"
          // className=" formsec1 modify_register_save text-right p-2"
          // style={{ textAlign: "end", float: "right" }}
          >
            {isUpdate || props?.updateButtonName ? (
              <button
                className="btn btn-primary btn-sm px-5 ml-1"
                type="submit"
              >
                {t(
                  `${props?.updateButtonName ? props?.updateButtonName : "Update"}`
                )}
              </button>
            ) : (
              <button
                className=" btn-primary btn-sm px-5 ml-1 custom_save_button required-fields"
                type="submit"
              >
                {t("Patient Registration")}
              </button>
            )}
          </div>
        </div>
        {getOldPatientData?.length > 0 && (
          <div className="panelDetailEasyUI">
            <EasyUI
              dataBind={getOldPatientData}
              dataColoum={BIND_TABLE_OLDPATIENTSEARCH_REG}
              onClick={handleClickEasyUI}
              setDataBind={setGetOldPatientData}
              selectedIndex={selectedIndex}
            />
          </div>
        )}
      </form>

      {isDuplicateModel && (
        <Modal
          visible={isDuplicateModel}
          setVisible={setIsDuplicateModel}
          modalWidth={"25vw"}
          Header={t("DuplicateEntry")}
          buttonType={"button"}
          modalData={{}}
          buttonName={t("Confirm")}
          setModalData={() => { }}
          handleAPI={SaveRegistrationAPI}
        >
          <DuplicatePatientAlertModel
          // handleChangeModel={()=>{}}
          // inputData={{}}
          />
        </Modal>
      )}

      {isAfterSaveModel && (
        <Modal
          visible={isAfterSaveModel}
          setVisible={setIsAfterSaveModel}
          modalWidth={"25vw"}
          Header={t("PatientUHID")}
          buttonType={"button"}
          modalData={{}}
          // buttonName={t("Advance")}
          // buttons={<Button name={t("RegistrationCharges")} type="button" className="text-white" handleClick={() => { }} />}
          footer={<></>}
          setModalData={() => { }}
          handleAPI={() => { }}
        >
          <h1 className="text-center  PatientUHID">
            {" "}
            {t("UHID")} :{" "}
            <span className="text-red PatientUHID"> {values?.UHID} </span>{" "}
          </h1>
        </Modal>
      )}
    </>
  );
}
