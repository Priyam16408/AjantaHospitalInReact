import React, {
  useImperativeHandle,
  forwardRef,
  useEffect,
  useState,
  useRef,
} from "react";
import Heading from "../../../components/UI/Heading";
import { useTranslation } from "react-i18next";
import Input from "../../../components/formComponent/Input";
import {
  BindDetails,
  CommonAPIGetDoctorIDByEmployeeID,
  getAllVitalMasterApi,
  getDoctorDepartmentLitsApi,
  SaveVitals,
  UpdateVitals,
} from "../../../networkServices/DoctorApi";
import { useFormik } from "formik";
import { useLocalStorage } from "../../../utils/hooks/useLocalStorage";
import { notify } from "../../../utils/utils";
import VitalSignTable from "../../../components/UI/customTable/doctorTable/ViewConsultationtable/VitalSignTable";
import { useDispatch, useSelector } from "react-redux";
import { getBindVital } from "../../../store/reducers/DoctorModule/VitalSign";
import { setLoading as setReloadDoctor } from "../../../store/reducers/DoctorModule/patientDetailsReload";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import { Checkbox } from "primereact/checkbox";
import { AutoComplete } from "primereact/autocomplete";

const VitalSign = forwardRef((props, ref) => {
  console.log("data", props?.patientDetail?.DoctorID);
  const autoCompleteTempRef = useRef([]);
  const autoCompleteBPRef = useRef([]);
  const autoCompletePulseRef = useRef([]);
  const autoCompleteRMSRef = useRef([]);
  const autoCompletespO2Ref = useRef([]);
  const autoCompletePSRef = useRef([]);
  const { patientDetail, setActionType, menuItemData, toggleAction } = props;
  const localData = useLocalStorage("userData", "get");
  const [bmi, setBmi] = useState("");
  const dispatch = useDispatch();
  const { getBindVitalData } = useSelector((state) => state?.vitalSignSlice);
  const reloadDoctor = useSelector((state) => state.reloadDoctor.loading);
  const [doctorDepartment, setDoctorDepartment] = useState([]);
  const [doctorID, setDoctorID] = useState(props?.patientDetail?.DoctorID);

  const [btnValue, setBtnValue] = useState("Save");
  const [status, setStatus] = useState("");
  const [t] = useTranslation();
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");

  const [apiData, setApiData] = useState({
    getBindVitalData: [],
    getBindVitalBP: [],
    getBindVitalPulse: [],
    getBindVitalTemp: [],
    getBindVitalSPO2: [],
    getBindVitalPS: [],
    getBindVitalRMS: [],
  });

  const payload = {
    tid: patientDetail?.currentPatient?.TransactionID,
    pid: patientDetail?.currentPatient?.PatientID,
    IsPregnancy: 0,
    DepartmentID: 0,
    bp: "",
    p: "",
    r: "",
    t: "",
    ht: "",
    wt: "",
    armSpan: "",
    sittingHeight: "",
    bmi: "",
    ibw: "",
    spO2: "",
    bf: "",
    muac: "",
    fbs: "",
    userID: localData?.employeeID,
    tw: "",
    vf: "",
    muscle: "",
    rm: "",
    wfa: "",
    bmifa: "",
    app_ID: patientDetail?.currentPatient?.App_ID,
    cbg: "",
    painScore: "",
    remark: "",
    heightRemarks: "",
    tabID: String(menuItemData?.id),
    menuID: String(menuItemData?.id),
    Hr: "",
    Bsa: "",
    Rr: "",
    FBS: "",
    RMS: "",
    Allergy: "",
  };

  const {
    handleChange,
    values,
    setFieldValue,
    setValues,
    handleSubmit,
    errors,
    touched,
    validateForm,
    resetForm,
  } = useFormik({
    initialValues: payload,
    enableReinitialize: false,

    onSubmit: async (values) => {
      setActionType("VitalSign");
      // const customerrors = ErrorHandling();
      // if (Object.keys(customerrors)?.length > 1) {
      //   if (Object.values(customerrors)[0]) {
      //     notify(Object.values(customerrors)[1], "error");
      //     return;
      //   }
      // }

      const newVlaues = {
        tid: values.tid,
        pid: values.pid,
        bp: values.bp,
        p: String(values.p),
        r: values.r,
        t: values.t,
        ht: values.height,
        wt: values.weight,
        armSpan: values.armSpan,
        sittingHeight: values.sittingHeight,
        bmi: values.bmi,
        ibw: values.ibw,
        spO2: values.spO2,
        RMS: values.RMS,
        bf: values.bf,
        muac: values.muac,
        fbs: values.fbs,
        userID: localData?.employeeID,
        tw: values.tw,
        vf: values.vf,
        muscle: values.muscle,
        rm: values.rm,
        wfa: values.wfa,
        bmifa: values.bmifa,
        app_ID: values.app_ID,
        cbg: values.cbg,
        painScore: values.painScore,
        remark: values.remark,
        heightRemarks: values.heightRemarks,
        tabID: String(menuItemData.id),
        menuID: String(menuItemData.id),
      };
      console.log(values, "aaaaaaaaaaaaasd");
      try {
        // console.log("formimk api cal values",values)
        // let payload = {
        //   ...values,
        //   IsPregnancy: isPregnancy ? 1 : 0,
        // };
        // console.log("payload", payload);
        const response = await SaveVitals(values);
        if (response.success === true) {
          notify(response.message, "success");
          resetForm();

          // ✅ Force UI update to reflect reset state
          setTimeout(() => setFieldValue("IsPregnancy", 0), 0);

          setWeight("");
          setHeight("");
          // setFieldValue("IsPregnancy")
          // setIsPregnancy(false);
          // debugger;
          dispatch(getBindVital(patientDetail.currentPatient.TransactionID));
          dispatch(setReloadDoctor(!reloadDoctor));
        }
      } catch (error) {}
    },
  });

  const handleSlashInputChange = (e) => {
    const { name, value } = e.target;

    let formattedValue = value.replace(/[^0-9/.]/g, ""); // Remove invalid characters

    const parts = formattedValue.split("/");
    if (parts.length > 2) return; // Prevent multiple '/'

    parts.forEach((part, index) => {
      const subParts = part.split(".");
      if (subParts.length > 2) return; // Prevent multiple decimals in a number
      if (subParts[1]) subParts[1] = subParts[1].slice(0, 2); // Keep only 2 decimal places
      parts[index] = subParts.join(".");
    });

    setValues((prevValues) => ({
      ...prevValues,
      [name]: parts.join("/"),
    }));
  };

  const handleDecimalInputChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);

    const regex = /^\d*\.?\d{0,2}$/;
    // console.log(first)
    if (regex.test(value) || value === "") {
      console.log("call");

      setValues((prevValues) => ({
        ...prevValues,
        [name]: value,
      }));
    }
  };
  console.log("wwwwwwwwwwwwwww", values);

  const getCurrentDoctorID = async () => {
    try {
      const response = await CommonAPIGetDoctorIDByEmployeeID();
      console.log("response", response);

      setDoctorID(response?.data[0]?.doctorID);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const handleSelect = (name, value) => {
    setFieldValue("DepartmentID", value?.value);
  };

  useImperativeHandle(ref, () => ({
    callChildFunctionHandleSaveVitals: handleSubmit,
    callChildFunctionHandleUpdateVitals: handleUpdate,
  }));

  const ErrorHandling = () => {
    let errors = {};
    errors.id = [];
    //   if (!values.bp) {
    //     errors.bp = "BP Is Required";
    //     errors.id[errors?.id?.length] = "bp";
    //   }
    //   if (!values.p) {
    //     errors.p = "Pulse Is Required";
    //     errors.id[errors?.id?.length] = "p";
    //   }
    //   return errors;
  };

  // useEffect(() => {
  //   console.log("Render");
  //   if (!weight || !height) {
  //     setBmi(null);
  //     setStatus("");
  //   } else {
  //     const heightInMeters = parseFloat(height) / 100;
  //     const bmiValue = (
  //       parseFloat(weight) /
  //       (heightInMeters * heightInMeters)
  //     ).toFixed(2);
  //     setBmi(bmiValue);
  //     setFieldValue("bmi", bmiValue);
  //     setFieldValue("wt", weight);
  //     setFieldValue("ht", height);
  //     let bmiStatus = "";
  //     if (bmiValue < 18.5) {
  //       bmiStatus = "Underweight";
  //     } else if (bmiValue < 24.9) {
  //       bmiStatus = "Normal weight";
  //     } else if (bmiValue < 29.9) {
  //       bmiStatus = "Overweight";
  //     } else {
  //       bmiStatus = "Obesity";
  //     }
  //     setStatus(bmiStatus);
  //   }
  // }, [weight, height]);

  // const getBindVital = async ()=>{
  //   try {
  //     const res = await BindDetails(patientDetail.currentPatient.TransactionID)
  //     console.log(res);
  //     setApiData((prev)=>({...prev, getBindVitalData:res.data}))
  //   } catch (error) {
  //     console.log(error);

  //   }
  // }
  useEffect(() => {
    console.log("Render");

    // Check if either weight or height is missing
    if (!values.wt || !values.ht) {
      setBmi("N/A"); // Set BMI to N/A if either weight or height is missing
      setStatus(""); // Reset the status
      setFieldValue("bmi", ""); // Set BMI field value to N/A
      setFieldValue("wt", values.wt); // Set weight field value
      setFieldValue("ht", values.ht); // Set height field value
    } else {
      // Proceed with BMI calculation if both weight and height are available
      const heightInMeters = parseFloat(values.ht) / 100; // Convert height to meters
      const bmiValue = (
        parseFloat(values.wt) /
        (heightInMeters * heightInMeters)
      ).toFixed(2); // Calculate BMI

      setBmi(bmiValue); // Set BMI value
      setFieldValue("bmi", bmiValue); // Set BMI field value
      setFieldValue("wt", values.wt); // Set weight field value
      setFieldValue("ht", values.ht); // Set height field value

      let bmiStatus = "";
      if (bmiValue < 18.5) {
        bmiStatus = "Underweight";
      } else if (bmiValue < 24.9) {
        bmiStatus = "Normal weight";
      } else if (bmiValue < 29.9) {
        bmiStatus = "Overweight";
      } else {
        bmiStatus = "Obesity";
      }

      setStatus(bmiStatus); // Set BMI status
    }
  }, [values.wt, values.ht]);

  const fetchVitalData = async (type) => {
    try {
      const response = await getAllVitalMasterApi(type);
      if (response?.success) {
        setApiData((prev) => ({
          ...prev,
          [`getBindVital${type}`]: response?.data || [],
        }));
      } else {
        notify(response?.message, "error");
      }
    } catch (error) {}
  };

  // console.log(patientDetail,"gender..................")
  useEffect(() => {
    // getBindVital()
    const vitalTypes = ["BP", "Pulse", "Temp", "SPO2", "PS", "RMS"];
    vitalTypes.forEach((type) => fetchVitalData(type));
    dispatch(getBindVital(patientDetail?.currentPatient?.TransactionID));
  }, []);
  console.log(values);

  // const [editData, setEditData] = useState({});
  const handleEditVitalSignValue = (item) => {
    toggleAction();
    setBtnValue("Update");
    // // debugger
    setActionType("UpdateVitalSign");
    setValues({
      ...values,
      bp: item.BP,
      p: item.P,
      r: item.R,
      t: item.T,
      ht: item?.ht ? item.ht : item.AdjustedHT,
      wt: item.WT,
      armSpan: item.ArmSpan,
      sittingHeight: item.SHight,
      bmi: item.BMI,
      ibw: item.IBWKg,
      spO2: item.SPO2,
      bf: item.BF,
      muac: item.MUAC,
      fbs: item.FBS,
      tw: item.tw,
      vf: item.vf,
      muscle: item.muscle,
      rm: item.rm,
      wfa: item.WFA,
      bmifa: item.BMIFA,
      id: item.ID,
      cbg: item.CBG,
      painScore: item.PainScore ? item.PainScore : "",
      remark: item.Remarks,
      heightRemarks: item?.HeightRemarks ? item?.HeightRemarks : "",
      app_ID: item.App_ID,
      IsPregnancy: item.IsPregnancy,
      Hr: item.Hr,
      Bsa: item.Bsa,
      Rr: item.Rr,
      FBS: item.FBS,
      RMS: item.RMS,
      Allergy: item.Allergy,
    });

    setHeight(item.AdjustedHT);
    setWeight(item.WT);
  };
  console.log("updated", values);

  const handleUpdate = async () => {
    try {
      const res = await UpdateVitals(values);
      console.log(res);

      if (res.success) {
        notify(res.message, "success");
        dispatch(getBindVital(patientDetail.currentPatient.TransactionID));
        resetForm();
        setWeight("");
        setHeight("");
        setActionType("VitalSign");
        setBtnValue("Save");
        dispatch(setReloadDoctor(!reloadDoctor));
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleGetDoctorDepartments = async () => {
    try {
      const res = await getDoctorDepartmentLitsApi(doctorID);
      setDoctorDepartment(res.data);
      const defaultKey = doctorDepartment?.find((ele) => ele?.IsDefault === 1);
      setFieldValue("DepartmentID", defaultKey?.DepartmentID);
    } catch (error) {
      notify(error.response?.message, "error");
      console.log(error);
    }
  };

  useEffect(() => {
    const defaultKey = doctorDepartment?.find((ele) => ele?.IsDefault === 1);
    setFieldValue("DepartmentID", defaultKey?.DepartmentID);
  }, [doctorDepartment]);
  useEffect(() => {
    // getCurrentDoctorID();
    if (doctorID) {
      handleGetDoctorDepartments();
    }
  }, [props?.patientDetail?.DoctorID]);

  const handleReactSelect = (name, e) => {
    setValues((prevValues) => ({
      ...prevValues,
      [name]: e?.value,
    }));
  };

  const handleChangeCreate = (selectedOption) => {
    setValues((prev) => ({
      ...prev,
      painScore: selectedOption ? selectedOption.value : "",
    }));
  };

  const [filteredData, setFilteredData] = useState();

  const search = (event, type) => {
    const query = (event.query || "").toLowerCase();
    let allValues = "";
    switch (type) {
      case "bp":
        allValues = apiData?.getBindVitalBP?.map((item) => item?.value) || [];
        break;
      case "pulse":
        allValues =
          apiData?.getBindVitalPulse?.map((item) => item?.value) || [];
        break;
      case "temp":
        allValues = apiData?.getBindVitalTemp?.map((item) => item?.value) || [];
        break;
      case "spO2":
        allValues = apiData?.getBindVitalSPO2?.map((item) => item?.value) || [];
        break;
      case "ps":
        allValues = apiData?.getBindVitalPS?.map((item) => item?.value) || [];
        break;
      case "heightRemarks":
        allValues = apiData?.getBindVitalRMS?.map((item) => item?.value) || [];
        break;
      default:
        break;
    }

    const filtered =
      allValues?.length > 0 &&
      allValues?.filter((item) => item?.toLowerCase().includes(query));
    setFilteredData(filtered);
  };

  const handleFocus = (type) => {
    const query = ""; // show full list
    search({ query });
    // setTimeout(() => {

    switch (type) {
      case "temp":
        search({ query, type: "temp" }); // Optional filtering
        autoCompleteTempRef.current?.show();
        break;
      case "bp":
        search({ query, type: "bp" });
        autoCompleteBPRef.current?.show();
        break;
      case "pulse":
        search({ query, type: "pulse" });
        autoCompletePulseRef.current?.show();
        break;
      case "spO2":
        search({ query, type: "spO2" });
        autoCompletespO2Ref.current?.show();
        break;
      case "ps":
        search({ query, type: "ps" });
        autoCompletePSRef.current?.show();
        break;
      case "heightRemarks":
        search({ query, type: "heightRemarks" });
        autoCompleteRMSRef.current?.show();
        break;
      default:
        break;
    }
  };

  const handleSelectBox = (e, name) => {
    const value = name.value;
    setFieldValue(e, name.value);
    // setSelectedObject({ label: value, value }); // store as object
  };
  const handleManualMouseSelect = (item) => {
    console.log("Caa", item);
  };
  const itemTemplate = (item) => {
    return (
      <div
        onClick={() => {
          handleManualMouseSelect({ value: item });
          // setInputValue(item.label);
          // autoCompleteBPRef.current.hide();
        }}
        style={{ padding: "8px", cursor: "pointer" }}
      >
        {item}
      </div>
    );
  };

  return (
    <>
      {/* {console.log("patientDetail?.GenderpatientDetail?.GenderpatientDetail?.Gender",patientDetail?.Sex)} */}
      <div className="">
        {/* <Heading
          title={t("Vital Sign")}
          // isBreadcrumb={true}
        /> */}
        <div className="m-2 spatient_registration_card">
          <div className="patient_registration card">
            <Heading
              title={t("Physical Examination")}
              // isBreadcrumb={true}
            />
            <div className="row g-4 m-2">
              {/* <Input
                type="text"
                className="form-control "
                id="bp"
                lable={t("BP ")}
                placeholder=" "
                required={true}
                respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
                name="bp"
                value={values.bp}
                onChange={handleSlashInputChange}
                // onChange={handleDecimalInputChange}
                placeholderLabel={"mm/Hg"}
              /> */}

              <div className="position-relative d-flex col-xl-2 col-md-4 col-sm-4 col-12">
                <AutoComplete
                  ref={autoCompleteBPRef}
                  value={values?.bp}
                  suggestions={
                    filteredData?.length > 0
                      ? filteredData
                      : apiData?.getBindVitalBP?.map((item) => item?.value)
                  }
                  completeMethod={(e) => search(e, "bp")}
                  placeholder={t("Enter BP")}
                  className="w-100"
                  onFocus={() => handleFocus("bp")}
                  onBlur={() => {
                    setTimeout(() => {
                      autoCompleteBPRef.current?.hide();
                    }, 150);
                  }}
                  name="bp"
                  onChange={(e) => setFieldValue("bp", e.value)}
                  onSelect={(e) => handleSelectBox("bp", e)}
                  itemTemplate={itemTemplate}
                />
                {values?.bp && (
                  <label
                    className="label lable truncate ml-3 p-1"
                    style={{ fontSize: "5px !important" }}
                  >
                    {t("BP")}
                  </label>
                )}
                <span className="text-muted fw-semibold input-box">
                  {t("mm/Hg")}
                </span>
              </div>

              <div className="position-relative d-flex col-xl-2 col-md-4 col-sm-4 col-12">
                <AutoComplete
                  ref={autoCompletePulseRef}
                  value={values?.p}
                  suggestions={
                    filteredData?.length > 0
                      ? filteredData
                      : apiData?.getBindVitalPulse?.map((item) => item?.value)
                  }
                  completeMethod={(e) => search(e, "pulse")}
                  placeholder={t("Pulse")}
                  className="w-100"
                  onFocus={() => handleFocus("pulse")}
                  onBlur={() => {
                    setTimeout(() => {
                      autoCompletePulseRef.current?.hide();
                    }, 150);
                  }}
                  name="p"
                  id="Pulse"
                  onChange={handleDecimalInputChange}
                  // onChange={(e) => setFieldValue("p", e.value)}
                  onSelect={(e) => handleSelectBox("pulse", e)}
                  itemTemplate={itemTemplate}
                />
                {values?.p && (
                  <label
                    className="label lable truncate ml-3 p-1"
                    style={{ fontSize: "5px !important" }}
                  >
                    {t("Pulse")}
                  </label>
                )}
                <span className="text-muted fw-semibold input-box">
                  {t("bpm")}
                </span>
              </div>

              {/* <Input
                type="text"
                className="form-control "
                id="p"
                lable={t("Pulse bpm")}
                placeholder=" "
                required={true}
                respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
                name="p"
                value={String(values.p)}
                onChange={handleDecimalInputChange}
              /> */}

              <div className="position-relative d-flex col-xl-2 col-md-4 col-sm-4 col-12">
                <AutoComplete
                  ref={autoCompleteTempRef}
                  value={values?.t}
                  suggestions={
                    filteredData?.length > 0
                      ? filteredData
                      : apiData?.getBindVitalTemp?.map((item) => item?.value)
                  }
                  completeMethod={(e) => search(e, "temp")}
                  placeholder={t("Enter Temp")}
                  className="w-100"
                  name="t"
                  onFocus={() => handleFocus("temp")}
                  onBlur={() => {
                    setTimeout(() => {
                      autoCompleteTempRef.current?.hide();
                    }, 150);
                  }}
                  onChange={(e) => setFieldValue("t", e.value)}
                  onSelect={(e) => handleSelectBox("temp", e)}
                  itemTemplate={itemTemplate}
                />
                {values?.t && (
                  <label
                    className="label lable truncate ml-3 p-1"
                    style={{ fontSize: "5px !important" }}
                  >
                    {t("Temp")}
                  </label>
                )}
                <span className="text-muted fw-semibold input-box">°F</span>
              </div>
              {/* <Input
                type="text"
                className="form-control"
                id="Temp"
                lable={t("Temp ")}
                placeholder=" "
                required={true}
                respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
                name="t"
                value={values.t}
                onChange={handleDecimalInputChange}
                placeholderLabel={"oC"}
              /> */}

              <Input
                type="text"
                className="form-control"
                id="Height"
                lable={t("Height")}
                placeholder=" "
                required={true}
                respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
                name="ht"
                onChange={handleDecimalInputChange}
                value={values?.ht}
                placeholderLabel={"CM"}
                // value={values.ht}
                // onChange={handleChange}
              />
              {/* <Input
                type="text"
                className="form-control"
                id="heightRemarks"
                lable={t("Heigh Remark")}
                placeholder=" "
                required={true}
                respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
                name="heightRemarks"
                value={values?.heightRemarks}
                onChange={handleChange}
              /> */}
              <div className="position-relative d-flex col-xl-2 col-md-4 col-sm-4 col-12">
                <AutoComplete
                  ref={autoCompleteRMSRef}
                  value={values?.heightRemarks}
                  suggestions={
                    filteredData?.length > 0
                      ? filteredData
                      : apiData?.getBindVitalRMS?.map((item) => item?.value)
                  }
                  completeMethod={(e) => search(e, "heightRemarks")}
                  placeholder={t("Heigh Remark")}
                  className="w-100"
                  name="heightRemarks"
                  onFocus={() => handleFocus("heightRemarks")}
                  onBlur={() => {
                    setTimeout(() => {
                      autoCompleteRMSRef.current?.hide();
                    }, 150);
                  }}
                  onChange={(e) => setFieldValue("heightRemarks", e.value)}
                  onSelect={(e) => handleSelectBox("heightRemarks", e)}
                  itemTemplate={itemTemplate}
                />
                {values?.heightRemarks && (
                  <label
                    className="label lable truncate ml-3 p-1"
                    style={{ fontSize: "5px !important" }}
                  >
                    {t("Heigh Remark")}
                  </label>
                )}
                {/* <span className="text-muted fw-semibold input-box">%</span> */}
              </div>
              <Input
                type="text"
                className="form-control"
                id="Weight"
                lable={t("Weight")}
                placeholder=" "
                required={true}
                respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
                name="wt"
                placeholderLabel={"Kg"}
                // value={values.wt}
                // onChange={handleChange}
                value={values?.wt}
                onChange={handleDecimalInputChange}
              />

              <div className="position-relative d-flex col-xl-2 col-md-4 col-sm-4 col-12">
                <AutoComplete
                  ref={autoCompletespO2Ref}
                  value={values?.spO2}
                  suggestions={
                    filteredData?.length > 0
                      ? filteredData
                      : apiData?.getBindVitalSPO2?.map((item) => item?.value)
                  }
                  completeMethod={(e) => search(e, "spO2")}
                  placeholder={t("Select or Enter spO2")}
                  className="w-100"
                  name="spO2"
                  onFocus={() => handleFocus("spO2")}
                  onBlur={() => {
                    setTimeout(() => {
                      autoCompletespO2Ref.current?.hide();
                    }, 150);
                  }}
                  onChange={(e) => setFieldValue("spO2", e.value)}
                  onSelect={(e) => handleSelectBox("spO2", e)}
                  itemTemplate={itemTemplate}
                />
                {values?.spO2 && (
                  <label
                    className="label lable truncate ml-3 p-1"
                    style={{ fontSize: "5px !important" }}
                  >
                    {t("spO2")}
                  </label>
                )}
                <span className="text-muted fw-semibold input-box">%</span>
              </div>
              {/* <Input
                type="text"
                className="form-control"
                id="SPO2"
                lable={t("SPO2 ")}
                placeholderLabel={"%"}
                placeholder=" "
                required={true}
                respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
                name="spO2"
                value={values.spO2}
                onChange={handleDecimalInputChange}
              /> */}

              {/* <Input
                type="text"
                className="form-control"
                id="PainScore"
                lable={t("Pain Score")}
                placeholder=" "
                required={true}
                respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
                name="painScore"
                value={values.painScore}
                onChange={handleDecimalInputChange}
              /> */}

              <div className="position-relative d-flex col-xl-2 col-md-4 col-sm-4 col-12">
                <AutoComplete
                  ref={autoCompletePSRef}
                  value={values?.painScore}
                  suggestions={
                    filteredData?.length > 0
                      ? filteredData
                      : apiData?.getBindVitalPS?.map((item) => item?.value)
                  }
                  completeMethod={(e) => search(e, "ps")}
                  placeholder={t("Enter Pain Score")}
                  className="w-100"
                  onFocus={() => handleFocus("ps")}
                  onBlur={() => {
                    setTimeout(() => {
                      autoCompletePSRef.current?.hide();
                    }, 150);
                  }}
                  name="painScore"
                  onChange={(e) => setFieldValue("painScore", e.value)}
                  onSelect={(e) => handleSelectBox("ps", e)}
                  itemTemplate={itemTemplate}
                />
                {values.painScore && (
                  <label
                    className="label lable truncate ml-3 p-1"
                    style={{ fontSize: "5px !important" }}
                  >
                    {t("Pain score")}
                  </label>
                )}
                <span className="text-muted fw-semibold input-box">
                  {t("/10")}
                </span>
              </div>
              <Input
                type="text"
                className="form-control"
                id="FBS"
                lable={t("RBS")}
                placeholder=" "
                required={true}
                respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
                name="FBS"
                value={values?.FBS}
                onChange={handleSlashInputChange}
              />
              <Input
                type="text"
                className="form-control"
                id="Remarks"
                lable={t("Remarks")}
                placeholder=" "
                required={true}
                respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
                name="remark"
                value={values?.remark}
                onChange={handleChange}
              />
              <Input
                type="text"
                className="form-control"
                id="Bsa"
                lable={t("BSA")}
                placeholder=" "
                required={true}
                respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
                name="Bsa"
                value={values?.Bsa}
                onChange={handleDecimalInputChange}
              />
              <Input
                type="text"
                className="form-control"
                id="IBW"
                lable={t("IBW ")}
                placeholder=" "
                placeholderLabel={"KG"}
                required={true}
                respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
                name="ibw"
                value={values?.ibw}
                onChange={handleDecimalInputChange}
              />
              <Input
                type="text"
                className="form-control"
                id="CBGmmolL"
                lable={t("CBG ")}
                placeholderLabel={"mmol/L"}
                placeholder=" "
                required={true}
                respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
                name="cbg"
                value={values?.cbg}
                onChange={handleSlashInputChange}
              />
              <Input
                type="text"
                className="form-control"
                id="Hr"
                lable={t("HR ")}
                placeholderLabel={""}
                placeholder=""
                required={true}
                respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
                name="Hr"
                value={values?.Hr}
                onChange={handleDecimalInputChange}
              />
              <Input
                type="text"
                className="form-control"
                id="Resp"
                lable={t("Resp")}
                placeholder=" "
                required={true}
                respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
                name="r"
                value={values?.r}
                onChange={handleDecimalInputChange}
                placeholderLabel={"/min"}
              />
              <Input
                type="text"
                className="form-control"
                id="Rr"
                lable={t("RR")}
                placeholderLabel={""}
                placeholder=" "
                required={true}
                respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
                name="Rr"
                value={values?.Rr}
                onChange={handleDecimalInputChange}
              />
              <Input
                type="text"
                className="form-control"
                id="ArmSpan"
                lable={t("Arm Span")}
                placeholder=" "
                placeholderLabel={"CM"}
                required={true}
                respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
                name="armSpan"
                value={values?.armSpan}
                onChange={handleDecimalInputChange}
              />
              <Input
                type="text"
                className="form-control"
                id="SittingHeight"
                lable={t("Sitting Height ")}
                placeholder=" "
                required={true}
                placeholderLabel={"CM"}
                respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
                name="sittingHeight"
                value={values?.sittingHeight}
                onChange={handleDecimalInputChange}
              />

              <ReactSelect
                dynamicOptions={doctorDepartment?.map((ele) => {
                  return {
                    value: ele?.DepartmentID,
                    label: ele?.DepartmentName,
                  };
                })}
                name={"departmentName"}
                value={values?.DepartmentID}
                handleChange={handleSelect}
                placeholderName={"Doctor Department"}
                id={"Select"}
                respclass={"col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"}
                // value={pageList}
              />
              <Input
                type="text"
                className="form-control"
                id="Allergy"
                lable={t("Allergy")}
                placeholder=" "
                required={true}
                // placeholderLabel={"CM"}
                respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
                name="Allergy"
                value={values?.Allergy}
                onChange={handleChange}
              />
              {/* <Input
                  type="checkbox"
                  placeholder=" "
                  className="mt-2"
                  onChange={handlePregnant}
                  checked={isPregnancy}
                  respclass="col-md-1 col-1 "
                  /> */}

              {(patientDetail?.Gender === "F" ||
                patientDetail?.Sex === "Female") && (
                <div className="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12">
                  <label
                    className="d-flex align-items-center ml-3"
                    style={{ cursor: "pointer" }}
                  >
                    <Checkbox
                      id="is_pregnancy"
                      className="mt-2"
                      onChange={(e) =>
                        setFieldValue("IsPregnancy", e.target.checked ? 1 : 0)
                      }
                      checked={Boolean(values.IsPregnancy)}
                    />
                    {t("IsPregnent")}
                  </label>
                </div>
              )}

              <div className="col-xl-1 col-md-4 col-sm-4 col-sm-4 col-12">
                <button
                  className="btn btn-sm btn-success w-100"
                  onClick={btnValue === "Save" ? handleSubmit : handleUpdate}
                >
                  {btnValue}
                </button>
              </div>

              {bmi && (
                <div className="col-md-3 d-flex align-items-center justify-content-end">
                  <p style={{ color: "red", fontWeight: "bold", margin: "0" }}>
                    BMI Calculate: {bmi}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* <div className="card patient_registration_card my-1 mt-2">
          {tableLogic(selectOPDRadio)}
        </div> */}

      <VitalSignTable
        tbody={getBindVitalData}
        handleEditVitalSignValue={handleEditVitalSignValue}
        isPregnant={Boolean(values.IsPregnancy)}
        patientDetail={patientDetail}
      />
    </>
  );
});

export default VitalSign;
