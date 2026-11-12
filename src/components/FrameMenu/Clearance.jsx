import React, { useEffect, useRef, useState } from "react";
import Heading from "../UI/Heading";
import { useTranslation } from "react-i18next";
import Modal from "../modalComponent/Modal";
import {
  BindCurrencyDetails,
  GetAllAuthorization,
  LoadDetails,
  LoadMedetail,
  SaveClearance,
} from "../../networkServices/BillingsApi";
import DischargeIntimationModal from "../modalComponent/Utils/DischargeIntimationModal";
import { notify } from "../../utils/utils";
import DischargeIntimation from "../modalComponent/Utils/DischargeIntimation";
import BillFreezeModel from "../modalComponent/Utils/BillFreezeModel";
import MedicalClearanceModal from "../modalComponent/Utils/MedicalClearanceModal";
import DischargeModal from "../modalComponent/Utils/DischargeModal";
import BillGenerateModal from "../modalComponent/Utils/BillGenerateModal";
import PatientClearanceModal from "../modalComponent/Utils/PatientClearanceModal";
import NurseClearanceModal from "../modalComponent/Utils/NurseClearanceModal";
import RoomClearanceModal from "../modalComponent/Utils/RoomClearanceModal";
import moment from "moment";
import BillFinalizeModal from "../modalComponent/Utils/BillFinalizeModal";

const Clearance = ({ data }) => {
  const [t] = useTranslation();
  const [handleModelData, setHandleModelData] = useState({});
  const [SecondModal, setSecondModal] = useState({});
  const [modalData, setModalData] = useState({});
  const [secModalData, setSecModalData] = useState([]);
  const [PatientStatus, setPatientStatus] = useState([]);
  console.log("PatientStatus", PatientStatus);
  const [payload, setPayload] = useState({});
  const [auth, setAuth] = useState([]);
  const [MedDetail, setMedDetail] = useState([]);
  const [currencyDetails, setCurrencyDetails] = useState([]);

  const resetForm = () => {
    setPayload({});

    setSecModalData({});
    GetLoadDetails();
  };

  const GetLoadDetails = async () => {
    const TID = data?.transactionID;
    try {
      const datas = await LoadDetails(TID);
      setPatientStatus(datas?.data);
      console.log("aaaaqwswwq", datas);
    } catch (error) {
      console.log(error);
    }
  };

  console.log(MedDetail);
  const GetLoadMedDetail = async () => {
    const TID = data?.transactionID;
    try {
      const datas = await LoadMedetail(TID);
      setMedDetail(datas?.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getBindCurrencyDetails = async () => {
    try {
      const data = await BindCurrencyDetails();
      setCurrencyDetails(data?.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getBindCurrencyDetails();
  }, []);

  const getPayloadData = (data) => {
    setPayload(data);
  };

  const GetBindAuthorization = async () => {
    try {
      const datas = await GetAllAuthorization();
      return datas?.data;
    } catch (error) {
      console.log(error);
    }
  };

  const GetAuthorizationList = async () => {
    try {
      const data = await GetBindAuthorization();
      setAuth(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    GetLoadDetails();
    GetAuthorizationList();
    GetLoadMedDetail();
  }, []);

  const handleModel = (
    label,
    width,
    type,
    isOpen,
    Component,
    handleInsertAPI,
    extrabutton,
    item
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
    setModalData(item);
  };

  const setIsOpen = () => {
    setHandleModelData((val) => ({ ...val, isOpen: false }));
  };
  const setIsOpenClose = () => {
    setSecondModal((val) => ({ ...val, isOpen: false }));
  };

  const handleChangeModel = (data) => {
    console.log("StepStep", data);
    // setModalData(data, item);
    // setSecModalData(data, item);
  };

  const handleCheckRights = (keyName, item) => {
    const [response] = auth;
    if (Number(response[keyName])) {
      handleStateInsertAPI(item);
      // handleModel(
      //   item?.Step,
      //   "20vw",
      //   "State",
      //   true,
      //   <>
      //     <DischargeIntimationModal
      //       handleChangeModel={handleChangeModel}
      //       item={item}
      //     />
      //   </>,
      //   handleStateInsertAPI,
      //   <></>,
      //   item
      // );
    } else {
      notify("You Don't Have Right", "error");
      return;
    }
  };

  const handleInsertSecondModelAPI = async () => {};

  const handleModelComponent = (newData) => {
    console.log(newData);
    if (newData?.newData == "Discharge Intimation") {
      return (
        <DischargeIntimation
          payload={payload}
          setPayload={setPayload}
          getPayloadData={getPayloadData}
          secModalData={secModalData}
        />
      );
    } else if (newData?.newData == "Bill Freeze") {
      return (
        <BillFreezeModel
          data={newData?.newData}
          payload={payload}
          setPayload={setPayload}
          getPayloadData={getPayloadData}
          secModalData={secModalData}
        />
      );
    } else if (newData?.newData == "Medical Clearance") {
      return (
        <MedicalClearanceModal
          data={newData?.newData}
          payload={payload}
          setPayload={setPayload}
          getPayloadData={getPayloadData}
          secModalData={secModalData}
          MedDetail={MedDetail}
        />
      );
    } else if (newData?.newData == "Discharge") {
      return (
        <DischargeModal
          data={newData?.newData}
          payload={payload}
          setPayload={setPayload}
          getPayloadData={getPayloadData}
          secModalData={secModalData}
        />
      );
    } else if (newData?.newData == "Bill Generate") {
      return (
        <BillGenerateModal
          data={newData?.newData}
          payload={payload}
          setPayload={setPayload}
          getPayloadData={getPayloadData}
          secModalData={secModalData}
          currencyDetails={currencyDetails}
        />
      );
    } else if (newData?.newData == "Patient Clearance") {
      return (
        <PatientClearanceModal
          data={newData?.newData}
          payload={payload}
          setPayload={setPayload}
          getPayloadData={getPayloadData}
          secModalData={secModalData}
        />
      );
    } else if (newData?.newData == "Nurse Clearance") {
      return (
        <NurseClearanceModal
          data={newData?.newData}
          payload={payload}
          setPayload={setPayload}
          getPayloadData={getPayloadData}
          secModalData={secModalData}
        />
      );
    } else if (newData?.newData == "Room Clearance") {
      return (
        <RoomClearanceModal
          data={newData?.newData}
          payload={payload}
          setPayload={setPayload}
          getPayloadData={getPayloadData}
          secModalData={secModalData}
        />
      );
    } else if (newData?.newData == "Bill Finalize") {
      return (
        <BillFinalizeModal
          data={newData?.newData}
          payload={payload}
          setPayload={setPayload}
          getPayloadData={getPayloadData}
          secModalData={secModalData}
        />
      );
    }

    return newData; // Make sure to return the data
  };

  const handleStateInsertAPI = async (data) => {
    setHandleModelData({
      isOpen: false,
    });
    // debugger
    setSecondModal({
      label: data?.Step,
      width: "50vw",
      isOpen: true,
      Component: handleModelComponent({ newData: data?.Step }),
      handleInsertAPI: handleInsertSecondModelAPI,
      extrabutton: (
        // data?.Step == "Patient Clearance" ? (
        //   <button className="btn btn-sm btn-success">Print</button>
        // ) : (
        <></>
      ),
      // ),
    });

    setSecModalData(data);
    secModalData((val) => ({ ...val, label: data?.Step }));
  };
  console.log(secModalData);
  console.log(payload);
  const ErrorHandling = () => {
    let errors = {};

    if (payload?.btnDischarge === "") {
      errors.btnDischarge = "Discharge Type Is Required";
    }
    if (payload?.date === null) {
      errors.date = "Date Is Required";
    }
    if (payload?.startTime === null) {
      errors.startTime = "Start Time Is Required";
    }
    if (payload?.entryDateDeath === null) {
      errors.entryDateDeath = "Death Date Is Required";
    }
    if (payload?.entryTimeDeath === null) {
      errors.entryTimeDeath = "Death Time Is Required";
    }
    if (payload?.btnDischarge === "Death" && payload?.causeOfDeath === "") {
      errors.causeOfDeath = "Cause Of Death Is Required";
    }
    if (payload?.btnDischarge === "Death" && payload?.typeOfDeath === "") {
      errors.typeOfDeath = "Type Of Death Is Required";
    }

    if (payload?.BillingType === "") {
      errors.BillingType = "Billing Type Is Required";
    }
    if (payload?.Narration === "") {
      errors.BillingType = "Narration Is Required";
    }

    return errors;
  };
  const handleSecondInsertAPI = async () => {
    const customerrors = ErrorHandling();
    if (Object.keys(customerrors)?.length > 0) {
      if (Object.values(customerrors)[0]) {
        notify(Object.values(customerrors)[0], "error");
      }
      return false;
    }
    try {
      const requestBody = {
        tid: parseInt(data?.transactionID),
        type: parseInt(secModalData?.ID),

        clearanceRemark: payload?.clearanceRemark
          ? payload?.clearanceRemark
          : "",
        startTime: moment(payload?.startTime).format("HH:mm:ss")
          ? moment(payload?.startTime).format("HH:mm:ss")
          : "",
        date: moment(payload?.date).format("YYYY-MM-DD")
          ? moment(payload?.date).format("YYYY-MM-DD")
          : "",
        typeOfDischarge: payload?.btnDischarge ? payload?.btnDischarge : "",
        reason: payload?.reason ? payload?.reason : "",
        entryDateDeath: moment(payload?.entryDateDeath).format("YYYY-MM-DD")
          ? moment(payload?.entryDateDeath).format("YYYY-MM-DD")
          : "",
        entryTimeDeath: moment(payload?.entryTimeDeath).format("HH:mm:ss")
          ? moment(payload?.entryTimeDeath).format("HH:mm:ss")
          : "",
        typeOfDeath: payload?.typeOfDeath ? payload?.typeOfDeath : "",
        causeOfDeath: payload?.causeOfDeath ? payload?.causeOfDeath : "",
        deathover48hrs: true,
        remarks: "",
        ipdCaseTypeID: data?.ipdCaseTypeID ? data?.ipdCaseTypeID : "",
        patientID: data?.patientID ? data?.patientID : "",
        billType: parseInt(payload?.BillingType)
          ? parseInt(payload?.BillingType)
          : 0,
        gsTcharges: "",
        surchargePer: 0,
        serviceCharge: 0,
        serTaxBillAmount: 0,
        billConFactor: parseInt(currencyDetails?.Selling_Specific),
        billNotation: currencyDetails?.S_Notation,
        billCountryId: parseInt(currencyDetails?.S_CountryID),
        roundOff: 0,
        narration: payload?.Narration ? payload?.Narration : "",
        totalBillAmount: 0,
      };
      const response = await SaveClearance(requestBody);

      if (response?.success) {
        notify(response?.message, "success");
        resetForm();
        setSecondModal({ isOpen: false });
      } else {
        notify(response?.message, "error");
        // resetForm();
        // setSecondModal({ isOpen: false });
      }
    } catch (error) {
      console.error("Something went wrong", error);
    }
  };
  return (
    <>
      <div className="patient_registration card mt-2">
        <Heading
          title={<label>{t("Patient Status")}</label>}
          secondTitle={
            <>
              <div
                className="col-sm-3 d-flex align-items-center "
                style={{ gap: "10px" }}
              >
                <div className="StatusDone"></div>
                <label className="text-dark m-0 ">{t("Status Done")}</label>
              </div>
              <div
                className="col-sm-3 d-flex align-items-center "
                style={{ gap: "10px" }}
              >
                <div className="sPending"></div>
                <label className="text-dark m-0">{t("Pending")}</label>
              </div>
              <div
                className="col-sm-3 d-flex align-items-center "
                style={{ gap: "px" }}
              >
                <div className="DischargeD"></div>
                <label className="text-dark m-0">{t("Discharge Delay")}</label>
              </div>
              <div
                className="col-sm-3 d-flex align-items-center"
                style={{ gap: "10px" }}
              >
                <div className="statusNotReached"></div>
                <label className="text-dark m-0">{t("Not Reached")}</label>
              </div>
            </>
          }
          isBreadcrumb={false}
        />
        <div
        // style={{
        //   background: auth?.success ? "" : "rgba(255, 255, 255, 0.5)",
        //   opacity: auth?.success ? 1 : 0.2,
        //   pointerEvents: auth?.success ? "auto" : "none",
        // }}
        >
          <div className="row text-center">
            {
              // Array.isArray(PatientStatus) &&
              PatientStatus.map((item, index) => (
                <>
                  <div
                    className="col-sm-2 m-3 d-flex justify-content-around"
                    key={index}
                    style={{
                      background:
                        item?.nextPending == 1
                          ? ""
                          : "rgba(255, 255, 255, 0.5)",
                      opacity:
                        item?.nextPending == 1
                          ? //  ||
                            // (item?.ID == 9 &&
                            //   item?.nextPending == "0" )
                            1
                          : 0.7,
                      pointerEvents:
                        item?.nextPending == 1
                          ? // ||
                            // (item?.ID == 9 &&
                            //   item?.nextPending == "0" )
                            "auto"
                          : "none",
                    }}
                  >
                    <div
                      className={`card position-relative  ${item?.nextPending == 1 && "blink-box"}`}
                      style={{
                        border: "2px solid #568203",
                        textAlign: "center",
                        width: "150px",
                        borderRadius: "5px",
                      }}
                      onClick={() => handleCheckRights(item?.UserAuth, item)}
                    >
                      <div
                        className="stepcard"
                        style={{
                          background:
                            item?.nextPending == 1
                              ? "linear-gradient(0deg, rgb(187, 53, 4) 10%, rgb(255, 69, 0))"
                              : item.dStatus == 1
                                ? "linear-gradient(0deg, rgb(10, 90, 46) 10%, rgb(46, 139, 87))"
                                : "linear-gradient(0deg, rgb(185, 141, 10) 10%, rgb(255, 191, 0))",
                        }}
                      >
                        <label className="steps">{item?.sequenceNo}</label>
                      </div>
                      <div
                        className="d-flex justify-content-center"
                        style={{
                          paddingTop: "6px",
                          paddingBottom: "2px",
                          background:
                            item?.nextPending == 1
                              ? "#ff4500"
                              : item.dStatus == 1
                                ? "#2e8b57"
                                : "#ffbf00",
                          margin: "5px",
                          borderRadius: "0px 0px 100px 100px ",
                        }}
                      >
                        <>
                          {item?.nextPending == 1 ? (
                            <>
                              <svg
                                fill="#000000"
                                width="70px"
                                height="70px"
                                viewBox="-1.5 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path d="m6.53 8.098.14-.012c.053-.006.101-.025.141-.053l-.001.001c.134.462.298.948.503 1.457.263.666.522 1.213.812 1.741l-.04-.08c-.024.364-.053.738-.091 1.1-.018.223-.062.431-.129.627l.005-.018c-.012.005-.029 2.08-.029 2.08.001 1.353.938 2.486 2.198 2.787l.02.004c.057-.145.195-.246.357-.246h.574c.161.002.299.102.356.243l.001.003c1.283-.302 2.224-1.435 2.229-2.789v-.001s-.035-2.066-.053-2.08c-.055-.175-.099-.381-.122-.593l-.001-.015c-.035-.364-.058-.729-.091-1.1.247-.446.506-.992.734-1.555l.038-.106c.205-.509.364-.994.503-1.457.039.028.087.047.139.053h.001l.141.012c.17.018.32-.122.334-.339l.152-1.931c0-.001 0-.002 0-.002 0-.163-.122-.297-.279-.317h-.002-.017c.039-.281.061-.605.061-.934 0-.718-.106-1.412-.303-2.065l.013.051c-.577-1.266-1.721-2.185-3.099-2.442l-.026-.004c-.296-.061-.641-.102-.993-.112h-.009-.012c-.359.007-.704.047-1.038.118l.036-.006c-1.402.264-2.544 1.183-3.114 2.419l-.011.027c-.186.6-.293 1.29-.293 2.004 0 .333.023.661.068.981l-.004-.037c-.159.018-.282.151-.282.313v.007l.152 1.931c.014.222.166.356.33.338z" />
                                <path d="m21.416 20.878c-.07-3.04-.374-3.728-.538-4.194-.065-.187-.118-1.451-2.206-2.271-1.28-.504-2.932-.514-4.33-1.105v1.644c-.003 1.768-1.269 3.239-2.944 3.56l-.023.004c-.031.182-.187.318-.374.32h-.018v1.24c0 1.212.982 2.194 2.194 2.194s2.194-.982 2.194-2.194v-.866c-.608-.091-1.069-.609-1.069-1.235 0-.689.559-1.248 1.248-1.248s1.248.559 1.248 1.248c0 .546-.351 1.01-.839 1.18l-.009.003v.918.047c0 1.532-1.242 2.774-2.774 2.774s-2.774-1.242-2.774-2.774c0-.017 0-.033 0-.05v.002-1.251c-.178-.012-.322-.146-.35-.318v-.002c-1.69-.329-2.95-1.795-2.954-3.556v-1.657c-1.404.603-3.066.615-4.353 1.12-2.094.819-2.142 2.08-2.206 2.27-.16.468-.468 1.153-.538 4.195-.012.4 0 1.013 1.206 1.549 2.626 1.03 6.009 1.35 9.344 1.58h.32c3.342-.228 6.72-.547 9.344-1.58 1.201-.533 1.212-1.142 1.201-1.546zm-14.681-1.24h-1.246v1.251h-.89v-1.247h-1.246v-.89h1.246v-1.246h.89v1.246h1.246z" />
                                <path d="m16.225 17.965v-.001c0-.372-.301-.673-.673-.673s-.673.301-.673.673.301.673.673.673c.371 0 .672-.301.673-.672z" />
                              </svg>
                            </>
                          ) : (
                            <svg
                              fill="#000000"
                              width="30px"
                              height="30px"
                              viewBox="-1.5 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="m6.53 8.098.14-.012c.053-.006.101-.025.141-.053l-.001.001c.134.462.298.948.503 1.457.263.666.522 1.213.812 1.741l-.04-.08c-.024.364-.053.738-.091 1.1-.018.223-.062.431-.129.627l.005-.018c-.012.005-.029 2.08-.029 2.08.001 1.353.938 2.486 2.198 2.787l.02.004c.057-.145.195-.246.357-.246h.574c.161.002.299.102.356.243l.001.003c1.283-.302 2.224-1.435 2.229-2.789v-.001s-.035-2.066-.053-2.08c-.055-.175-.099-.381-.122-.593l-.001-.015c-.035-.364-.058-.729-.091-1.1.247-.446.506-.992.734-1.555l.038-.106c.205-.509.364-.994.503-1.457.039.028.087.047.139.053h.001l.141.012c.17.018.32-.122.334-.339l.152-1.931c0-.001 0-.002 0-.002 0-.163-.122-.297-.279-.317h-.002-.017c.039-.281.061-.605.061-.934 0-.718-.106-1.412-.303-2.065l.013.051c-.577-1.266-1.721-2.185-3.099-2.442l-.026-.004c-.296-.061-.641-.102-.993-.112h-.009-.012c-.359.007-.704.047-1.038.118l.036-.006c-1.402.264-2.544 1.183-3.114 2.419l-.011.027c-.186.6-.293 1.29-.293 2.004 0 .333.023.661.068.981l-.004-.037c-.159.018-.282.151-.282.313v.007l.152 1.931c.014.222.166.356.33.338z" />
                              <path d="m21.416 20.878c-.07-3.04-.374-3.728-.538-4.194-.065-.187-.118-1.451-2.206-2.271-1.28-.504-2.932-.514-4.33-1.105v1.644c-.003 1.768-1.269 3.239-2.944 3.56l-.023.004c-.031.182-.187.318-.374.32h-.018v1.24c0 1.212.982 2.194 2.194 2.194s2.194-.982 2.194-2.194v-.866c-.608-.091-1.069-.609-1.069-1.235 0-.689.559-1.248 1.248-1.248s1.248.559 1.248 1.248c0 .546-.351 1.01-.839 1.18l-.009.003v.918.047c0 1.532-1.242 2.774-2.774 2.774s-2.774-1.242-2.774-2.774c0-.017 0-.033 0-.05v.002-1.251c-.178-.012-.322-.146-.35-.318v-.002c-1.69-.329-2.95-1.795-2.954-3.556v-1.657c-1.404.603-3.066.615-4.353 1.12-2.094.819-2.142 2.08-2.206 2.27-.16.468-.468 1.153-.538 4.195-.012.4 0 1.013 1.206 1.549 2.626 1.03 6.009 1.35 9.344 1.58h.32c3.342-.228 6.72-.547 9.344-1.58 1.201-.533 1.212-1.142 1.201-1.546zm-14.681-1.24h-1.246v1.251h-.89v-1.247h-1.246v-.89h1.246v-1.246h.89v1.246h1.246z" />
                              <path d="m16.225 17.965v-.001c0-.372-.301-.673-.673-.673s-.673.301-.673.673.301.673.673.673c.371 0 .672-.301.673-.672z" />
                            </svg>
                          )}
                        </>
                      </div>
                      <label
                        className="statusIcon"
                        style={{
                          background:
                            item?.nextPending == 1
                              ? "linear-gradient(0deg, rgb(187, 53, 4) 10%, rgb(255, 69, 0))"
                              : item.dStatus == 1
                                ? "linear-gradient(0deg, rgb(10, 90, 46) 10%, rgb(46, 139, 87))"
                                : "linear-gradient(0deg, rgb(185, 141, 10) 10%, rgb(255, 191, 0))",
                        }}
                      >
                        {t(item?.Step)}
                      </label>
                      <div
                        className="card-body text-center"
                        style={{
                          background:
                            item?.nextPending == 1
                              ? "#ff4500"
                              : item.dStatus == 1
                                ? "#2e8b57"
                                : "#ffbf00",
                          color: "white",
                          padding: "0px",
                          margin: "0px",
                        }}
                      >
                        <p className="card-text text-center m-0">
                          {item?.dDate}
                        </p>
                        <p className="card-text text-center m-0">
                          {item?.BedNo}
                        </p>
                        <p className="card-text text-center m-0">
                          <label>{item.dUser}</label>
                        </p>
                      </div>
                    </div>
                    {index === PatientStatus.length - 1 ? (
                      ""
                    ) : (
                      <div className="d-flex justify-content-center align-items-center">
                        <label className="Clearancearrow"></label>
                      </div>
                    )}
                  </div>
                </>
              ))
            }
          </div>
        </div>
      </div>

      {handleModelData?.isOpen && (
        <Modal
          visible={handleModelData?.isOpen}
          setVisible={setIsOpen}
          modalWidth={handleModelData?.width}
          Header={t(handleModelData?.label)}
          buttonType={"button"}
          buttonName={"Yes"}
          buttons={handleModelData?.extrabutton}
          modalData={modalData}
          setModalData={setModalData}
          handleAPI={handleStateInsertAPI}
        >
          {handleModelData?.Component}
        </Modal>
      )}

      {SecondModal?.isOpen && (
        <Modal
          visible={SecondModal?.isOpen}
          setVisible={setIsOpenClose}
          modalWidth={SecondModal?.width}
          Header={t(SecondModal?.label)}
          buttonType={"button"}
          buttonName={"Save"}
          // buttonName={SecondModal?.label}
          buttons={SecondModal?.extrabutton}
          modalData={secModalData}
          setSecModalData={setSecModalData}
          handleAPI={handleSecondInsertAPI}
        >
          {SecondModal?.Component}
        </Modal>
      )}
    </>
  );
};

export default Clearance;
