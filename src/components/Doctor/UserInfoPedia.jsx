import { Tooltip } from "primereact/tooltip";
import React, { useEffect, useState } from "react";
import LabeledInput from "../formComponent/LabeledInput";
import SendSMSDoctor from "../modalComponent/Utils/SendSMSDoctor";
import SendEmailDoctor from "../modalComponent/Utils/SendEmailDoctor";
import DoctorDetails from "../HelpDesk/DoctorDetails";
import {
  DoctorPrescriptionPrintPDF,
  GetOpdPrintOptionsApi,
  UpdateCall,
  UpdateUncall,
} from "../../networkServices/DoctorApi";
import { notify } from "../../utils/utils";
import { useDispatch, useSelector } from "react-redux";
import { getBindVital } from "../../store/reducers/DoctorModule/VitalSign";
import OverLay from "../modalComponent/OverLay";
import { Link } from "react-router-dom";
import SeeMore from "../UI/SeeMore";
import Modal from "../modalComponent/Modal";
import VideoCallModal from "../modalComponent/VideoCallModal";
import SlideScreen from "../front-office/SlideScreen";
import PrintDesign from "./PrintDesign";
import { OpenPDFURL, RedirectURL } from "../../networkServices/PDFURL";
import noImange from "../../assets/image/avatar.gif";
import DatePicker from "../formComponent/DatePicker";
import { current } from "@reduxjs/toolkit";
import { useLocalStorage } from "../../utils/hooks/useLocalStorage";
import DoctorPrescriptionModalPrint from "../../pages/Purchase/Order/PurchaseOrderApproval/DoctorPrescriptionModalPrint";
import ViewPrescriptionButtonModal from "./ViewPrescriptionButtonModal";
import { FileOpenIcon } from "../SvgIcons";
import { t } from "i18next";

const UserInfoPedia = (props) => {
  const dispatch = useDispatch();
  // const baseurl = import.meta.env.VITE_APP_REACT_APP_BASE_URL;
  const dynamicUrl = import.meta.env.VITE_APP_REACT_APP_DYNAMIC_URL === "true";
  const baseFromEnv = import.meta.env.VITE_APP_REACT_APP_BASE_URL;
  // debugger;
  const baseUrl = dynamicUrl
    ? `${window.location.protocol}//${window.location.hostname}${window.location.port ? `:${window.location.port}` : ''
    }/api/v1`
    : baseFromEnv;
  const baseurl = baseUrl;

  const { employeeID } = useLocalStorage("userData", "get");

  const {
    pregnancyDetails,
    tags,
    setTags,
    items,
    setPregnancyDetails,
    patientDetail,
    handleCallButtonClick,
    handleFileClosed,
    handleFileOpen,
    reverseTableData,
    forwardTableData,
    handleEmailModalOpen,
    handleSMSModalOpen,
    getHoldAPID,
    getOutPatientAPI,
    getUpdateInAPI,
    handleSavePriscciptionForm,
    handleClearForm,
    SearchOPDBillsCallAPI,
    TotaltableData,
    selectedIndex,
    setIsListening,
    handleSavePrescriptionDraft,
    apiData,
    handleGetDataForOLDAppointment,
    getGetDoctor,
    docterError,
    getCall,
    loadSaveData,
    prescription,
    toggleListening,
    isListening,
    type,
    setIsDesktop,
    isDesktop,
    // isListening,
    // stopListening,
    // startListening,
    isPrescriptionButton,
    setIsPrescriptionButton,
    runReport,
    setRunReport,
  } = props;

  const [handleModelData, setHandleModelData] = useState({});
  useEffect(() => {
    dispatch(getBindVital(patientDetail?.currentPatient?.TransactionID));
  }, [dispatch]);
  const [visible, setVisible] = useState(false);
  const [mappedData, setMappedData] = useState({});
  const [isVisibleOldPrescription, setIsVisibleOldPrescription] =
    useState(false);
  function handleConvertFormat(data) {
    const values = data?.valueField.split("#");
    const keys = data?.valueFieldDesc.split("#");

    const keyValueMap = keys.reduce((acc, key, index) => {
      acc[key] = values[index];
      return acc;
    }, {});

    setMappedData(keyValueMap);
    DoctorPrescriptionPrint(keyValueMap);
  }

  const removeTag = (category, indexToRemove, id) => {
    let ID = Number(id) ? id : undefined;
    const singleData = JSON.parse(JSON.stringify([...items[category]]));
    if (ID) {
      const index = singleData.findIndex(
        (itd) => Number(itd?.ID) === Number(ID)
      );
      // debugger
      if (index) {
        singleData[index]["isChecked"] = false;
        setItems({ ...items, [category]: singleData });
      }
    }

    setTags((prevTags) => ({
      ...prevTags,
      [category]: prevTags[category]?.filter(
        (_, index) => index !== indexToRemove
      ),
    }));
  };

  const handleClose = () => {
    setHandleModelData((val) => ({ ...val, isOpen: false }));
  };

  const [openVideoPopup, setOpenVideoPopup] = useState({
    name: "",
    component: "",
    size: "",
    isShow: false,
  });

  const handleVideoPopupOpen = () => {
    setOpenVideoPopup({
      isShow: true,
    });
  };

  const handleClickJoinMetting = () => {
    // window.open(patientDetail.currentPatient.DoctorMeetingUrl)
    const newWindow = window.open(
      patientDetail?.currentPatient?.DoctorMeetingUrl,
      "_blank",
      "width=200,height=200"
    );
    if (newWindow) {
      newWindow.focus();
    }
  };

  useEffect(() => {
    if (openVideoPopup.isShow) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          // Permissions granted
          notify("Camera and microphone access granted.", "success");
        })
        .catch((error) => {
          // Handle the error or inform the user
          console.error("Camera and microphone access denied.", error);
          notify(
            "Please allow camera and microphone access to join the meeting.",
            "error"
          );
        });
    }
  }, [openVideoPopup.isShow]);

  const DoctorPrescriptionPrint = async (data) => {
    // debugger;
    const updatedPrescriptions = prescription.map((item) => ({
      ...item,
      IsChecked: 1,
    }));

    if (updatedPrescriptions?.length === 0) return;
    const patientData = patientDetail?.currentPatient;
    // const patientData = mappedData?.TransactionID
    //   ? mappedData
    //   : patientDetail?.currentPatient;

    try {
      let payload = {
        pid: data ? data?.PatientID : patientData?.PatientID,
        transactionID: data ? data?.TransactionID : patientData?.TransactionID,
        appID: data ? data?.App_ID : patientData?.App_ID,
        previewSetting: updatedPrescriptions?.map((item) => {
          return {
            MasterId: item?.ID,
            IsChecked: 1,
            AccordianName: item?.AccordianName,
          };
        }),
      };

      let apiResp = await DoctorPrescriptionPrintPDF(payload);

      if (apiResp?.success && apiResp?.data) {
        let pdfUrl = apiResp?.data;
        if (pdfUrl?.toLowerCase().endsWith(".html")) {
          window.open(pdfUrl, "_blank");
          return;
        } else if (pdfUrl && pdfUrl.startsWith("https://")) {
          pdfUrl = pdfUrl;
        } else {
          pdfUrl = `${baseurl}/${apiResp?.data}`;
        }

        setHandleModelData({
          isOpen: true,
          width: "100vw",
          label: "Doctor Prescription",
          Component: <DoctorPrescriptionModalPrint url={pdfUrl} />,
        });
      }
    } catch (error) {
      console.log(error);
      notify("Failed to load the preview", "error");
    } finally {
      setIsVisibleOldPrescription(false);
    }
  };
  // useEffect(() => {
  //   if (isPrescriptionButton) {
  //     DoctorPrescriptionPrint();
  //   }
  // }, [isPrescriptionButton]);
  const isMobile = window.innerWidth > 1000;
  // debugger
  useEffect(() => {
    if (runReport) {
      DoctorPrescriptionPrint();
      setRunReport(false);
    }
  }, [runReport]);
  return (
    <>
      <div className="pl-2">
        {handleModelData?.isOpen && (
          <Modal
            visible={handleModelData?.isOpen}
            setVisible={handleClose}
            modalWidth="98vw"
            Header={handleModelData?.label}
            buttonType={"button"}
            footer={<></>}
            style={{ maxHeight: "99% !important", backgroundColor: "red" }}
          >
            {handleModelData?.Component}
          </Modal>
        )}
      </div>

      <div className="card sticky-button-groups">
        <div className="row mt-2">
          {type !== "Emergency" && (
            <div className="col-sm-1">
              <div className="row p-1">
                <div
                  className="col-md-12"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItem: "center",
                  }}
                >
                  <img
                    src={
                      patientDetail?.currentPatient?.PatientPhoto
                        ? patientDetail?.currentPatient?.PatientPhoto
                        : noImange
                    }
                    className="emp-img"
                    alt="Responsive image"
                  />
                </div>
              </div>
            </div>
          )}
          {type !== "Emergency" && (
            <div className="col-sm-11">
              <div className="row px-1">
                <div className="col-xl-2 col-md-4 col-sm-4 col-12">
                  <LabeledInput
                    label={"Patient Name"}
                    value={patientDetail?.currentPatient?.Pname}
                  />
                </div>

                <div className="col-xl-2 col-md-4 col-sm-4 col-12">
                  <LabeledInput
                    label={"Age/Gender"}
                    value={
                      <span>
                        {patientDetail?.currentPatient?.Age}/
                        {patientDetail?.currentPatient?.Gender}
                      </span>
                    }
                  />
                </div>
                <div className="col-xl-2 col-md-4 col-sm-4 col-12">
                  <LabeledInput
                    label={"Mobile"}
                    value={patientDetail?.currentPatient?.ContactNo}
                  />
                </div>
                <div className="col-xl-2 col-md-4 col-sm-4 col-12">
                  <LabeledInput
                    label={"Ref.By"}
                    value={patientDetail?.currentPatient?.DName}
                  />
                </div>

                <div className="col-xl-2 col-md-4 col-sm-4 col-12">
                  <LabeledInput
                    label={"App. Date/No."}
                    value={
                      <span>
                        {patientDetail?.currentPatient?.AppointmentDate}/
                        {patientDetail?.currentPatient?.AppNo}
                      </span>
                    }
                  />
                </div>

                <div className="col-xl-2 col-md-4 col-sm-4 col-12">
                  <LabeledInput
                    label={"Panel"}
                    value={patientDetail?.currentPatient?.PanelName}
                  />
                </div>
              </div>
              {/* <div className="row px-1 mt-2">
                <div className="col-xl-2 col-md-4 col-sm-4 col-12">
                  <DatePicker
                    className="custom-calendar"
                    placeholder=""
                    lable="LMP Date"  // Corrected to "lable"
                    name="LMPDate"
                    id="LMPDate"
                    value={values?.LMPDate}
                    showTime
                    hourFormat="12"
                    handleChange={handleChange}
                  />
                </div>
                <div className="col-xl-2 col-md-4 col-sm-4 col-12">
                  <DatePicker
                    className="custom-calendar"
                    placeholder=""
                    lable="EDD Date"  
                    name="EDDDate"
                    id="EDDDate"
                    value={values?.EDDDate}
                    showTime
                    hourFormat="12"
                    handleChange={handleChange}
                  />
                </div>
                <div className="col-xl-2 col-md-4 col-sm-4 col-12">
                  <DatePicker
                    className="custom-calendar"
                    placeholder=""
                    lable="Current Pregnancy Date"  // Corrected to "lable"
                    name="currentPregnancyDate"
                    id="currentPregnancyDate"
                    value={values?.currentPregnancyDate}
                    showTime
                    hourFormat="12"
                    handleChange={handleChange}
                  />
                </div>
                <div className="col-xl-2 col-md-4 col-sm-4 col-12">
                  <LabeledInput
                    label={"Gestational Age (weeks)"}
                    value={values?.gestationalAge}
                  />
                </div>
                <div className="col-xl-2 col-md-4 col-sm-4 col-12 d-flex align-items-center">
                  <input
                    type="checkbox"
                    // checked={false}
                    checked={values?.isDelivered === 1 ? true : false}
                    onChange={(e) => {
                      // if(e.target.checked){

                      //   setValues((prev)=>{
                      //     return {
                      //       ...prev,
                      //       isDelivered: 0
                      //     }
                      //   })

                      // }
                      // else{

                      //   setValues((prev)=>{
                      //     return {
                      //       ...prev,
                      //       isDelivered: 1
                      //     }
                      //   })
                      // }



                      // console.log(e.target.checked)


                      if (values?.isDelivered) {
                        setValues((prev) => {
                          return {
                            ...prev,
                            isDelivered: 0
                          }
                        })

                      }
                      else {
                        setValues((prev) => {
                          return {
                            ...prev,
                            isDelivered: 1
                          }
                        })
                      }
                    }
                    }
                  // readOnly // Automatically updated
                  />
                  <span className="font-weight-bold ml-2">: Is Delivered</span>
                </div>
              </div> */}

              <div className="row p-1 ">
                <div className="col-lg-5 col-sm-12 main_container">
                  <div className="h-100">
                    {/* <ul className="dddUL">
                      <h4>Current Vitals:</h4>
                      <li>BP:{getBindVitalData[0]?.BP || "N/A"} mm/Hg</li>|
                      <li>Pulse:{getBindVitalData[0]?.P || "N/A"} bpm</li>|
                      <li>
                        Temp:{getBindVitalData[0]?.T || "N/A"} <sup>o</sup>C
                      </li>
                      |<li>Height:{getBindVitalData[0]?.HT || "N/A"} cm</li>|
                      <li>Weight:{getBindVitalData[0]?.WT || "N/A"} Kg</li>|
                      <li>BMI:{getBindVitalData[0]?.BMI || "N/A"}</li>|
                      <li>
                        SPO<sub>2</sub>:{getBindVitalData[0]?.SPO2 || "N/A"} %
                      </li>
                    </ul> */}
                    <ul className="dddUL">
                      {/* <li>
                    {prescription?.filter(
                          (val) =>
                            
                            val.ID == 31 
                        )?.map((item, index) => (
                          <>
                            {tags[item?.AccordianName]?.length > 0 &&
                              <div className="">
                                <div className="p-1 d-flex align-items-center ">
                                <h4 className="mr-2">{item?.DisplayName}: </h4>
                                  {tags[item?.AccordianName]?.map((tag, index) => (
                                    < >
                                      <span
                                        key={index}
                                        className="tag mr-2"
                                        style={{
                                          backgroundColor: tag?.ID ? "#FEFAE0" : "#F5EDED",
                                          display: "inline-table",
                                          color:"red"
                                        }}
                                      >
                                        {tag?.ValueField || tag?.TypeName}
                                        <span
                                          className="tag-close-icon"
                                          onClick={() =>
                                            removeTag(item?.AccordianName, index, tag?.ID)
                                          }
                                        >
                                          <i
                                            className="fa fa-times-circle"
                                            aria-hidden="true"
                                          ></i>
                                        </span>
                                      </span>
                                    </>
                                  ))}
                                </div>
                              </div>
                            }

                          </>
                        ))}

                    </li> */}

                      <li>
                        {prescription
                          ?.filter((val) => val.ID == 32)
                          ?.map((item, index) => (
                            <>
                              {tags[item?.AccordianName]?.length > 0 && (
                                <div className="">
                                  <div className="p-1 d-flex align-items-center ">
                                    <h4 className="mr-2">
                                      {item?.DisplayName}:{" "}
                                    </h4>
                                    {tags[item?.AccordianName]?.map(
                                      (tag, index) => (
                                        <>
                                          <span
                                            key={index}
                                            className="tag mr-2"
                                            style={{
                                              backgroundColor: tag?.ID
                                                ? "#FEFAE0"
                                                : "#F5EDED",
                                              display: "inline-table",
                                              // color:"red"
                                            }}
                                          >
                                            {tag?.ValueField || tag?.TypeName}
                                            <span
                                              className="tag-close-icon"
                                              onClick={() =>
                                                removeTag(
                                                  item?.AccordianName,
                                                  index,
                                                  tag?.ID
                                                )
                                              }
                                            >
                                              <i
                                                className="fa fa-times-circle"
                                                aria-hidden="true"
                                              ></i>
                                            </span>
                                          </span>
                                        </>
                                      )
                                    )}
                                  </div>
                                </div>
                              )}
                            </>
                          ))}
                      </li>

                      <li>
                        {prescription
                          ?.filter((val) => val.ID == 33)
                          ?.map((item, index) => (
                            <>
                              {tags[item?.AccordianName]?.length > 0 && (
                                <div className="">
                                  <div className="p-1 d-flex align-items-center ">
                                    <h4 className="mr-2">
                                      {item?.DisplayName}:{" "}
                                    </h4>
                                    {tags[item?.AccordianName]?.map(
                                      (tag, index) => (
                                        <>
                                          <span
                                            key={index}
                                            className="tag mr-2"
                                            style={{
                                              backgroundColor: tag?.ID
                                                ? "#FEFAE0"
                                                : "#F5EDED",
                                              display: "inline-table",
                                              // color:"red"
                                            }}
                                          >
                                            {tag?.ValueField || tag?.TypeName}
                                            <span
                                              className="tag-close-icon"
                                              onClick={() =>
                                                removeTag(
                                                  item?.AccordianName,
                                                  index,
                                                  tag?.ID
                                                )
                                              }
                                            >
                                              <i
                                                className="fa fa-times-circle"
                                                aria-hidden="true"
                                              ></i>
                                            </span>
                                          </span>
                                        </>
                                      )
                                    )}
                                  </div>
                                </div>
                              )}
                            </>
                          ))}
                      </li>

                      {/* {Number(pregnancyDetails?.ga) > 0 && (
                        <li>
                          <div className="  d-flex align-items-center">
                            <div className="p-1 d-flex align-items-center ">
                              <h4 className="mr-2 font-weight-bold  ">
                                G.Age (weeks):{" "}
                              </h4>
                              <p
                                className="default-font-size"
                                style={{
                                  margin: 0,
                                  padding: 0,
                                }}
                              >
                                {pregnancyDetails?.ga}
                              </p>
                            </div>
                          </div>
                        </li>
                      )} */}

                      {loadSaveData?.vitalSign?.isPregnancy === 1 &&
                        Number(pregnancyDetails?.ga) > 0 && (
                          <li>
                            <div className="d-flex align-items-center">
                              <div className="p-1 d-flex align-items-center">
                                <h4 className="mr-2 font-weight-bold">
                                  G.Age (weeks):
                                </h4>
                                <p
                                  className="default-font-size"
                                  style={{
                                    margin: 0,
                                    padding: 0,
                                  }}
                                >
                                  {pregnancyDetails?.ga}
                                </p>
                              </div>
                            </div>
                          </li>
                        )}
                    </ul>
                  </div>
                </div>

                <div className="col-lg-7 col-md-12">
                  <div className="button_group">
                    {/* Navigation Buttons */}
                    <span
                      onClick={reverseTableData}
                      disabled={patientDetail?.currentPatient?.index === 0}
                    >
                      <i
                        className="pi pi-angle-double-left text-icon-size"
                        style={{ color: "#3d52A0" }}
                      ></i>
                    </span>

                    <span
                      onClick={forwardTableData}
                      disabled={
                        patientDetail?.currentPatient?.index ===
                        patientDetail?.currentPatient?.TotaltableData?.length -
                        1
                      }
                    >
                      <i
                        className="pi pi-angle-double-right text-icon-size"
                        style={{ color: "#7091e6" }}
                      ></i>
                    </span>

                    {/* Save & Preview Button */}
                    <button
                      className="btn btn-sm text-white"
                      onClick={() => {
                        handleSavePriscciptionForm("save");
                        // DoctorPrescriptionPrint();
                      }}
                    >
                      <span className="d-flex align-items-center">
                        {t("Save & Preview")}
                        <i
                          className="bi bi-save ml-2 my-2 text-icon-size"
                          data-pr-tooltip="Save"
                          data-pr-position="top"
                          id="SaveForm"
                        ></i>
                      </span>
                      <Tooltip target="#SaveForm" />
                    </button>

                    {/* Old Prescription Dropdown */}
                    <SeeMore
                      Header={
                        <button className="btn btn-sm text-white ml-1">
                          {t("Old Pres")}
                          <div className="text-center">
                            <i className="pi pi-address-book text-icon-size"></i>
                          </div>
                        </button>
                      }
                      isVisibleOldPrescription={isVisibleOldPrescription}
                    >
                      <ul
                        className={`${handleModelData.isOpen ? "d-none" : ""} list-group upperList`}
                        style={{ whiteSpace: "nowrap" }}
                      >
                        {apiData?.getOldAppointentDataAPI
                          ?.slice()
                          .reverse()
                          .map((e, index) => (
                            <div
                              key={index}
                              className="d-flex align-items-center justify-content-between"
                              style={{
                                border: "1px solid rgba(0, 0, 0, .125)",
                                height: "fit-content",
                              }}
                            >
                              <li
                                className={`${e?.canCopy == 0 ? "disable-reject " : ""}list-group-item p-2`}
                                onClick={() =>
                                  handleGetDataForOLDAppointment(e)
                                }
                                style={{
                                  cursor: "pointer",
                                  display: "flex",
                                  alignItems: "center",
                                  border: "none",
                                  color: e.isCurrent === 1 && "red",
                                }}
                              >
                                {e?.textField}
                              </li>
                              <i
                                className="fa fa-eye pr-1 pointer-cursor"
                                onClick={() => {
                                  // DoctorPrescriptionPrint();
                                  handleConvertFormat(e);
                                }}
                              ></i>
                            </div>
                          ))}
                      </ul>
                    </SeeMore>

                    {/* Print Button */}
                    <button
                      className="btn btn-sm text-white ml-1"
                      onClick={() => DoctorPrescriptionPrint()}
                    >
                      {t("Print")}
                      <span>
                        <i
                          className="bi bi-eye mb-2 ml-1 text-icon-size"
                          data-pr-tooltip="Print"
                          data-pr-position="top"
                          id="Print"
                        ></i>
                        <Tooltip target="#Print" />
                      </span>
                    </button>

                    {/* Copy Button */}
                    <button
                      className="btn btn-sm text-white mx-1"
                      onClick={() => handleSavePriscciptionForm("copy")}
                    >
                      {t("Copy")}
                      <span>
                        <i
                          className="bi bi-copy ml-1 mb-3 text-icon-size"
                          data-pr-tooltip="Copy"
                          data-pr-position="top"
                          id="CopyForm"
                        ></i>
                        <Tooltip target="#CopyForm" />
                      </span>
                    </button>

                    {/* Call Button */}
                    {!(
                      patientDetail.currentPatient?.Isdone === "true" ||
                      patientDetail.currentPatient?.P_Out === 1
                    ) && (
                        <div
                          onClick={() =>
                            handleCallButtonClick(patientDetail?.currentPatient)
                          }
                        >
                          <i
                            className={`bi m-0 text-icon-size ${patientDetail?.currentPatient?.IsCall === 1 ? "bi-telephone-outbound" : "bi-telephone-inbound"}`}
                            data-pr-tooltip={
                              patientDetail?.currentPatient?.IsCall === 1
                                ? "Un Call"
                                : "Call"
                            }
                            data-pr-position="top"
                            id={
                              patientDetail?.currentPatient?.IsCall === 1
                                ? "UnCall"
                                : "Call"
                            }
                            style={{
                              color:
                                patientDetail?.currentPatient?.IsCall === 1
                                  ? "#e64833"
                                  : "green",
                            }}
                          ></i>
                          <Tooltip
                            target={
                              patientDetail?.currentPatient?.IsCall === 1
                                ? "#UnCall"
                                : "#Call"
                            }
                          />
                        </div>
                      )}

                    {/* Patient In/Out */}
                    {patientDetail?.currentPatient?.P_In === 1 &&
                      patientDetail?.currentPatient?.P_Out === 0 ? (
                      <span onClick={getOutPatientAPI}>
                        <i
                          className="bi bi-person-walking m-0 text-icon-size"
                          data-pr-tooltip="Out Patient"
                          data-pr-position="top"
                          id="OutPatient"
                          style={{ color: "#974734" }}
                        ></i>
                        <Tooltip target="#OutPatient" />
                      </span>
                    ) : patientDetail?.currentPatient?.P_In === 0 ? (
                      <span
                        onClick={() =>
                          getUpdateInAPI(patientDetail?.currentPatient)
                        }
                      >
                        <i
                          className="bi bi-person-walking m-0 text-icon-size person-walking-reverse"
                          data-pr-tooltip="In Patient"
                          data-pr-position="top"
                          id="InPatient"
                        ></i>
                        <Tooltip target="#InPatient" />
                      </span>
                    ) : null}

                    {/* Hold Button */}
                    <span onClick={getHoldAPID}>
                      <i
                        className="bi bi-pause m-0 text-icon-size"
                        data-pr-tooltip="Hold"
                        data-pr-position="top"
                        id="hold"
                        style={{ color: "#003135" }}
                      ></i>
                      <Tooltip target="#hold" />
                    </span>

                    {/* Speech to Text */}
                    <span onClick={toggleListening}>
                      <i
                        className={`bi bi-mic-fill text-icon-size ${isListening ? "text-red" : ""}`}
                        data-pr-tooltip="Speech To Text"
                        data-pr-position="top"
                        id="TTS"
                      ></i>
                      <Tooltip target="#TTS" />
                    </span>

                    {/* File Open/Close */}
                    {patientDetail?.currentPatient?.IsFileOpen === 0 ? (
                      <span
                        onClick={() =>
                          handleFileClosed(patientDetail?.currentPatient)
                        }
                      >
                        <i
                          className="bi bi-file-earmark-x m-0 text-icon-size"
                          data-pr-tooltip="File Closed"
                          data-pr-position="top"
                          id="FileClosed"
                          style={{ color: "#3e36ae" }}
                        ></i>
                        <Tooltip target="#FileClosed" />
                      </span>
                    ) : (
                      <span
                        onClick={() =>
                          handleFileOpen(patientDetail?.currentPatient)
                        }
                      >
                        <i
                          className="mr-1 curser-pointer"
                          data-pr-tooltip="File Open"
                          data-pr-position="top"
                          id="FileOpen"
                          style={{ color: "#3e36ae" }}
                        >
                          <FileOpenIcon />
                        </i>
                        <Tooltip target="#FileOpen" />
                      </span>
                    )}

                    {/* Draft Button */}
                    <span onClick={handleSavePrescriptionDraft}>
                      <i
                        className="bi bi-file-earmark-text-fill m-0 text-icon-size"
                        data-pr-tooltip="Draft"
                        data-pr-position="top"
                        id="SaveDraft"
                        style={{ color: "#050a44" }}
                      ></i>
                      <Tooltip target="#SaveDraft" />
                    </span>

                    {/* Clear Form */}
                    <span onClick={handleClearForm}>
                      <i
                        className="bi bi-x-circle m-0 text-icon-size"
                        data-pr-tooltip="Clear"
                        data-pr-position="top"
                        id="ClearForm"
                        style={{ color: "#0A21co" }}
                      ></i>
                      <Tooltip target="#ClearForm" />
                    </span>

                    {/* Email & SMS */}
                    <span onClick={() => handleEmailModalOpen("Send Email")}>
                      <i
                        className="pi pi-envelope text-icon-size"
                        data-pr-tooltip="Send Mail"
                        data-pr-position="top"
                        id="SendMail"
                        style={{ color: "#e43d12" }}
                      ></i>
                      <Tooltip target="#SendMail" />
                    </span>

                    <span onClick={() => handleSMSModalOpen("Send SMS")}>
                      <i
                        className="bi bi-chat-square-text m-0 text-icon-size"
                        data-pr-tooltip="Send Document"
                        data-pr-position="top"
                        id="SendSMS"
                        style={{ color: "#efb11d" }}
                      ></i>
                      <Tooltip target="#SendSMS" />
                    </span>

                    {/* Video Call */}
                    {patientDetail?.currentPatient?.IsTeleconsulation === 1 && (
                      <span onClick={handleVideoPopupOpen}>
                        <i
                          className="bi bi-camera-video m-0 text-icon-size"
                          data-pr-tooltip="Video Call"
                          data-pr-position="top"
                          id="VideoCall"
                          style={{ color: "#5d001e" }}
                        ></i>
                        <Tooltip target="#VideoCall" />
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {type === "Emergency" && (
            <>
              <div className="col"></div>
              <div className="col-auto">
                <div className="px-1 ml-3 d-flex">
                  <span
                  // onClick={handleSavePrescriptionDraft}
                  >
                    {isMobile && (
                      <>
                        <Tooltip
                          target={`#DextopView`}
                          position="top"
                          content={"Is Prescription Preview"}
                          event="focus"
                          className="ToolTipCustom"
                        />
                        <input
                          type="checkbox"
                          name=""
                          className="mt-1 mr-1"
                          id="DextopView"
                          checked={isDesktop}
                          onChange={(e) => {
                            setIsDesktop(e.target.checked);
                          }}
                        />
                      </>
                    )}
                  </span>

                  <span onClick={handleSavePrescriptionDraft}>
                    <i
                      className="bi bi-file-earmark-text-fill m-0 text-icon-size"
                      data-pr-tooltip=" Draft"
                      data-pr-position="top"
                      id="SaveDraft"
                      style={{
                        color: "#050a44",
                      }}
                    ></i>
                    <Tooltip target={"#SaveDraft"} />
                  </span>

                  <span onClick={handleClearForm}>
                    <i
                      className="bi bi-x-circle m-0 text-icon-size"
                      data-pr-tooltip="Clear"
                      data-pr-position="top"
                      id="ClearForm"
                      style={{
                        color: "#0A21co",
                      }}
                    ></i>
                    <Tooltip target={"#ClearForm"} />
                  </span>

                  <span onClick={handleSavePriscciptionForm}>
                    <i
                      className="bi bi-save m-0 text-icon-size "
                      data-pr-tooltip="Save"
                      data-pr-position="top"
                      id="SaveForm"
                      style={{
                        color: "#116466",
                      }}
                    ></i>
                    <Tooltip target={"#SaveForm"} />
                  </span>

                  <span onClick={DoctorPrescriptionPrint}>
                    {" "}
                    <i
                      className="bi bi-eye m-0 text-icon-size"
                      data-pr-tooltip="Preview"
                      data-pr-position="top"
                      id="Preview"
                      style={{
                        color: "#865d36",
                      }}
                    ></i>
                    <Tooltip target={"#Preview"} />
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {openVideoPopup.isShow && (
        <VideoCallModal
          visible={openVideoPopup}
          setVisible={setOpenVideoPopup}
          Header={"Online Meeting URL"}
          modalWidth={"100%"}
          footer={<></>}
        >
          <iframe
            allow="camera; microphone; fullscreen; speaker; display-capture"
            src={`https://projectvedio.yourvideo.live/host/Njc2YWEzZWFjOTBmZGM1ZTg4ODQzNmI1LTY3NmFhMzY1NWZkYzU5ZjM1YjAyNzAzMw==?landing=yes&name=${patientDetail?.currentPatient?.DName}`}
            width="100%"
            // height="100vh"
            frameBorder="0"
            allowFullScreen
            title="Online Meeting"
            style={{ height: "100vh" }}
          ></iframe>
        </VideoCallModal>
      )}

      <SlideScreen
        visible={visible}
        setVisible={() => {
          setVisible(false);
        }}
      >
        <PrintDesign
          loadSaveDataPrisciption={loadSaveData}
          patientDetail={patientDetail?.currentPatient}
          prescription={prescription}
        />
      </SlideScreen>
      {/* {handleModelData.isOpen && (
        <Modal
          visible={handleModelData.isOpen}
          setVisible={() => setIsPrescriptionButton(false)}
          modalWidth="40vw"
          Header={"Confirm Action"}
          buttonType={"button"}
          footer={<></>}
        >
     
          <ViewPrescriptionButtonModal
            closeModal={() => {
              setIsPrescriptionButton(false);
              setIsVisibleOldPrescription(false);
              setMappedData("");
            }}
            prescriptionOptions={prescription}
            patientDetail={
              mappedData?.TransactionID
                ? mappedData
                : patientDetail?.currentPatient
            }
            setHandleModelData={setHandleModelData}
            handleModelData={handleModelData}
          />
        </Modal>
      )} */}
    </>
  );
};

export default UserInfoPedia;
