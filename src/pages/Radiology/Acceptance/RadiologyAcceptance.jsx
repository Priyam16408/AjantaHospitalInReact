import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import moment from "moment";
import { BindDepartmentLab } from "../../../networkServices/departmentreceive";

import Heading from "../../../components/UI/Heading";
import Input from "../../../components/formComponent/Input";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import { handleReactSelectDropDownOptions, notify } from "../../../utils/utils";
import DatePicker from "../../../components/formComponent/DatePicker";
import ColorCodingSearch from "../../../components/commonComponents/ColorCodingSearch";
import Tables from "../../../components/UI/customTable";
import {
  BindRadiologybindRoomList,
  RadiologyCallTokens,
  RadiologyRemoveSample,
  RadiologySaveAcceptance,
  RadiologyUnCallTokens,
  SearchRadiologyAcceptance,
} from "../../../networkServices/RadiologyAcceptance";
import RadiologyOutboxModal from "./RadiologyOutboxModal";
import Modal from "../../../components/modalComponent/Modal";
import RadiologyRejectModal from "./RadiologyRejectModal";
import { BindSampleinfo } from "../../../networkServices/resultEntry";

import { FaSearch } from "react-icons/fa";
import { detachClipboardStubFromView } from "@testing-library/user-event/dist/cjs/utils/index.js";
import TimePicker from "../../../components/formComponent/TimePicker";

function DepartmentReceive() {
  const [t] = useTranslation();
  const Type = [
    { value: "0", label: "All" },
    { value: "1", label: "OPD" },
    { value: "2", label: "IPD" },
    { value: "3", label: "EMG" },
  ];

  const Accepted = [
    { value: "SY", label: "No" },
    { value: "Y", label: "Yes" },
    { value: "R", label: "Reject" },
  ];

  const [values, setValues] = useState({
    type: { value: "0", label: "All" },
    department: { value: "0", label: "ALL" },
    roomList: "",
    IpdNo: "",
    UHID: "",

    Accepted: { value: "SY", label: "No" },
    patintName: "",
    fromDate: moment(new Date()).toDate(),
    toDate: moment(new Date()).toDate(),
  });

  const handleHoldModal = (item) => {
    const anyChecked = tbodyPatientDetail.some((item) => item.callInChecked);
    if (!anyChecked) {
      notify("Kindly select at least one sample.", "error");
      return;
    }
    setHandleModelData({
      label: t("Enter Technician Name"),
      buttonName: t("Save"),
      width: "30vw",
      isOpen: true,
      Component: (
        <RadiologyOutboxModal
          inputData={item}
          handleChangeModel={handleChangeModelState}
        />
      ),
      handleInsertAPI: handleUnSaveAcceptance,
      extrabutton: <></>,
    });
  };

  const handleRejectModal = (item) => {
    const anyChecked = tbodyPatientDetail.some((item) => item.callInChecked);
    if (!anyChecked) {
      notify("Kindly select at least one sample.", "error");
      return;
    }
    setHandleModelData({
      label: t("Test Removal Reason"),
      buttonName: t("Save"),
      width: "30vw",
      isOpen: true,
      Component: (
        <RadiologyRejectModal
          inputData={item}
          handleChangeModel={handleChangeModelState}
        />
      ),
      handleInsertAPI: handleRejectTest,
      extrabutton: <></>,
      // footer: <></>,
    });
  };
  //Declaring ALL State
  const [tbodyPatientDetail, setTbodyPatientDetail] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);

  const [pdata, setPdata] = useState([]);
  const [roomLists, setRoomList] = useState([]);


  const [handleModelData, setHandleModelData] = useState({});
  const [modalData, setModalData] = useState({});

  const { VITE_DATE_FORMAT } = import.meta.env;
  const isMobile = window.innerWidth <= 800;
  console.log(handleModelData);
  const handleSelect = (name, value) => {
    setValues((val) => ({ ...val, [name]: value }));
  };

  const handleChange = (e) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  console.log(tbodyPatientDetail);

  const handleSaveChangeCheckbox = (e, index) => {
    const updatedData = [...tbodyPatientDetail];
    updatedData[index].saveChecked = e.target.checked;
    setTbodyPatientDetail(updatedData);
  };

  const handleCallInChangeCheckbox = (e, index) => {
    const updatedData = [...tbodyPatientDetail];
    updatedData[index].callInChecked = e.target.checked;
    setTbodyPatientDetail(updatedData);
  };
  const handleDateTime = (e, name, index) => {
    const { value } = e.target;
    setTbodyPatientDetail((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [name]: value,
      };

      const { inDate, inTime, outDate, outTime } = updated[index];

      if (
        inDate &&
        inTime &&
        moment(inDate).isValid() &&
        moment(inTime).isValid()
      ) {
        const combinedInDateTime = moment(inDate)
          .set({
            hour: moment(inTime).get("hour"),
            minute: moment(inTime).get("minute"),
            second: moment(inTime).get("second"),
          })
          .toISOString();

        updated[index].inDateTime = combinedInDateTime;
      }

      if (
        outDate &&
        outTime &&
        moment(outDate).isValid() &&
        moment(outTime).isValid()
      ) {
        const combinedOutDateTime = moment(outDate)
          .set({
            hour: moment(outTime).get("hour"),
            minute: moment(outTime).get("minute"),
            second: moment(outTime).get("second"),
          })
          .toISOString();

        updated[index].outDateTime = combinedOutDateTime;
      }

      return updated;
    });
  };

  const handleSearchSampleCollection = async (isTost = true) => {
    const payload = {
      roleDept: "",
      sampleType: values?.Accepted?.value,
      departmentId: values?.department?.value?.toString() ?? "0",
      labType: "",
      mrNo: values?.UHID,
      crNo: values?.IpdNo,
      panelId: 0,
      patientName: String(values?.patintName),
      fromDate: String(moment(values?.fromDate).format("DD-MMM-YYYY")),
      roomName: "",
      toDate: String(moment(values?.toDate).format("DD-MMM-YYYY")),
    };

    try {
      const apiResp = await SearchRadiologyAcceptance(payload);
      if (apiResp.success) {
        let data = apiResp?.data?.map((val) => {
          return {
            ...val,
            inDate: val?.P_InDateTime ? new Date(val.P_InDateTime) : new Date(),
            inTime: val?.P_InDateTime ? new Date(val.P_InDateTime) : new Date(),
            outDate: val?.P_OutDateTime
              ? new Date(val.P_OutDateTime)
              : new Date(),
            outTime: val?.P_OutDateTime
              ? new Date(val.P_OutDateTime)
              :new Date(),
          };
        });
        setTbodyPatientDetail(data);
      } else {
        isTost && notify("No records found", "error");
        setTbodyPatientDetail([]);
      }
    } catch (error) {
      console.error("Error while fetching data:", error);
      notify("An error occurred while fetching data", "error");
      setTbodyPatientDetail([]);
    }
  };

  const CheckDepartment = async () => {
    try {
      const response = await BindDepartmentLab();
      if (response.success) {
        console.log("the department data is", response);
        setDepartmentData(response.data);
      } else {
        console.error(
          "API returned success as false or invalid response:",
          response
        );
        setDepartmentData([]);
      }
    } catch (error) {
      console.error("Error fetching department data:", error);
      setDepartmentData([]);
    }
  };

  const BindRoomList = async () => {
    try {
      const response = await BindRadiologybindRoomList();
      if (response.success) {
        console.log("the roomlist data is", response);
        setRoomList(response.data);
      } else {
        console.error(
          "API returned success as false or invalid response:",
          response
        );
        setRoomList([]);
      }
    } catch (error) {
      console.error("Error fetching department data:", error);
      setRoomList([]);
    }
  };

  const handleRadiologyCallTokens = async () => {
    const anyChecked = tbodyPatientDetail.some((item) => item.saveChecked);
    if (!anyChecked) {
      notify("Kindly select at least one sample.", "error");
      return;
    }

    let token = [];
    tbodyPatientDetail?.map((val) => {
      if (val?.saveChecked) {
        let obj = {
          tokenNo: val.TokenNo,
          ledgerTransactionNo: val.LedgerTransactionNo,
          ledgerTnxDetailID: val.LedgerTnxID,
        };
        token.push(obj);
      }
    });
    const payload = {
      roomName: "",
      tokens: token,
    };

    try {
      const ReciveResp = await RadiologyCallTokens(payload);
      if (ReciveResp.success) {
        notify(`${ReciveResp?.message}`, "success");
        handleSearchSampleCollection(false);
      } else {
        notify("No records found", "error");
      }
    } catch (error) {
      notify("Kindly select at least one sample");
    }
  };

  const handleRadiologyUnCallTokens = async () => {
    const anyChecked = tbodyPatientDetail.some((item) => item.saveChecked);
    if (!anyChecked) {
      notify("Kindly select at least one sample", "error");
      return;
    }

    let token = [];
    tbodyPatientDetail?.map((val) => {
      if (val?.saveChecked) {
        let obj = {
          tokenNo: val.TokenNo,
          ledgerTransactionNo: val.LedgerTransactionNo,
          ledgerTnxDetailID: val.LedgerTnxID,
        };
        token.push(obj);
      }
    });
    const payload = {
      roomName: "",
      tokens: token,
    };

    try {
      const ReciveResp = await RadiologyUnCallTokens(payload);
      if (ReciveResp.success) {
        notify(`${ReciveResp?.message}`, "success");
        handleSearchSampleCollection(false);
      } else {
        notify("No records found", "error");
      }
    } catch (error) {
      notify("Kindly select at least one sample");
    }
  };

  const handleSaveAcceptance = async (data) => {
    const anyChecked = tbodyPatientDetail.some((item) => item.callInChecked);
    if (!anyChecked) {
      notify("Kindly select at least one sample", "error");
      return;
    }

    let items = [];
    tbodyPatientDetail?.map((val) => {
      if (val?.callInChecked) {
        let obj = {
          id: val.ID || "",
          entryType: val.EntryType || "",
          testId: val.Test_ID || "",
          tokenNo: val.TokenNo || "",
          ledgerTransactionNo: val.LedgerTransactionNo || "",
          isSampleCollect: true,
          isTransfer: val.isTransfer,
          isPout: val.P_Out,
          transferCentreID: val.sampleTransferCentreID || "",
          P_OutDateTime: val.outDateTime || new Date(),
          P_InDateTime: val.inDateTime || new Date(),
        };
        items.push(obj);
      }
    });

    const payload = {
      items: items,
      empID: "emp001",
      empName: "admin",
      technician: data.Technician,
    };

    try {
      const ReciveResp = await RadiologySaveAcceptance(payload);
      if (ReciveResp.success) {
        notify(`${ReciveResp?.message}`, "success");
        handleSearchSampleCollection(false);
      } else {
        notify(ReciveResp?.message, "error");
      }
    } catch (error) {
      notify(
        "Kindly select at least one sample or maybe the selected sample is already received"
      );
    }
  };

  const handleUnSaveAcceptance = async (data) => {
    const anyChecked = tbodyPatientDetail.some((item) => item.callInChecked);
    if (!anyChecked) {
      notify(
        "Kindly select at least one sample or maybe the selected sample is already received",
        "error"
      );
      return;
    }


    let items = [];
    tbodyPatientDetail?.map((val) => {
      if (val?.callInChecked) {
        let obj = {
          id: val.ID || "",
          entryType: val.EntryType || "",
          testId: val.Test_ID || "",
          tokenNo: val.TokenNo || "",
          ledgerTransactionNo: val.LedgerTransactionNo || "",
          isSampleCollect: false,
          isTransfer: val.isTransfer,
          isPout: true,
          transferCentreID: val.sampleTransferCentreID || "",
          P_OutDateTime: val.outDateTime? val.outDateTime: new Date(),
          P_InDateTime: val.inDateTime? val.inDate: new Date(),
        };
        items.push(obj);
      }
    });

    debugger
    const payload = {
      items: items,
      empID: "emp001",
      empName: "admin",
      technician: data.Technician,
    };

    try {
      const ReciveResp = await RadiologySaveAcceptance(payload);
      if (ReciveResp.success) {
        notify(`${ReciveResp?.message}`, "success");
        setHandleModelData((val) => ({ ...val, isOpen: false }));
        handleSearchSampleCollection(false);

      } else {
        notify("No records found", "error");
      }
    } catch (error) {
      notify(
        "Kindly select at least one sample or maybe the selected sample is already received"
      );
    }
  };

  const handleRejectTest = async (data) => {
    const anyChecked = tbodyPatientDetail.some((item) => item.callInChecked);
    if (!anyChecked) {
      notify(
        "Kindly select at least one sample or maybe the selected sample is already received",
        "error"
      );
      return;
    }

    let samples = [];
    tbodyPatientDetail?.map((val) => {
      if (val?.callInChecked) {
        let obj = {
          id: val.ID || "",
          isSelected: true,
        };
        samples.push(obj);
      }
    });

    const payload = {
      reason: data.rejectRemark,
      samples: samples,
    };

    try {
      const ReciveResp = await RadiologyRemoveSample(payload);
      if (ReciveResp.success) {
        notify(`${ReciveResp?.message}`, "success");
        handleSearchSampleCollection();
        setHandleModelData((val) => ({ ...val, isOpen: false }));
      } else {
        notify("No records found", "error");
      }
    } catch (error) {
      notify(
        "Kindly select at least one sample or maybe the selected sample is already received"
      );
    }
  };

  // RadiologySaveAcceptance

  const handleChangeModelState = (data) => {
    setModalData(data);
  };

  useEffect(() => {
    CheckDepartment();
    BindRoomList();
  }, []);

  const theadPatientDetail = [
    { width: "5%", name: t("SNo") },
    { width: "5%", name: t(".") },
    { width: "15%", name: t("Type") },
    { width: "15%", name: t("UHID") },
    { width: "10%", name: t("IPD No.") },
    { width: "15%", name: t("Bad No") },
    { width: "15%", name: t("Patient Name") },
    { width: "10%", name: t("Age") },
    { width: "10%", name: t("Panel Name") },
    { width: "10%", name: t("Department") },
    { width: "10%", name: t("Investigation") },
    { width: "10%", name: t("Date") },
    { width: "10%", name: t("In") },
    { width: "10%", name: t("Out") },
    { width: "10%", name: t("Consumbales") },
    { width: "5%", name: t("Call/UnCall") },
    { width: "10%", name: t("Centre Transfer") },
    { width: "10%", name: t("Technician Name") },
  ];

  const setIsOpen = () => {
    setHandleModelData((val) => ({ ...val, isOpen: false }));
  };

  const getRowClass = (val, index) => {
    let status = tbodyPatientDetail[index]?.CallStatus;
    console.log("the status value is number", status);
    if (status === 3) {
      return "color-indicator-7-bg";
    } else if (status === 2) {
      return "color-indicator-12-bg";
    } else if (status === 1) {
      return "color-indicator-4-bg";
    } else if (status === 0) {
      return "color-indicator-11-bg";
    }
  };

  // function for bind patient Details

  const handleBindSampleinfo = async (val, index) => {
    // detachClipboardStubFromView
    let data = tbodyPatientDetail[index];
    setPdata(data);
    const payload = {
      LedgerTransactionNo: val.LedgerTransactionNo,
      TestID: val.Test_ID,
    };
    try {
      const apiResp = await BindSampleinfo(payload);
      console.log("the apiResponse is ", apiResp);
      if (apiResp.success) {
        handleSetModalData(apiResp?.data[0]);
      } else {
        notify("Some error occurred", "error");
      }
    } catch (error) {
      notify("An error occurred while fetching data", "error");
    }
  };

  // modal for patient details
  const SampleInfohead = [
    { width: "5%", name: t("Investigation Name") },
    { width: "15%", name: t("Sample Drawn Name") },
    { width: "15%", name: t("Reg. Date") },
    { width: "10%", name: t("Reg. By") },
    { width: "15%", name: t("Collection Date") },
    { width: "10%", name: t("Collected By") },
    { width: "10%", name: t("Received Date") },
    { width: "10%", name: t("Received By") },
    { width: "10%", name: t("Rejected Date") },
    { width: "10%", name: t("Rejected By") },
    { width: "10%", name: t("Reading1") },
    { width: "10%", name: t("Sample Rejected Reason") },
    { width: "10%", name: t("Result Entered Date") },
    { width: "10%", name: t("Result Entered By") },
    { width: "10%", name: t("Approved Date") },
    { width: "10%", name: t("Approved By") },
    { width: "10%", name: t("Hold By") },
    { width: "10%", name: t("Hold Reason") },
  ];


  const handleSetModalData = (data) => {
    setHandleModelData({
      label: t("Sample Information"),
      buttonName: t(""),
      width: "80vw",
      isOpen: true,
      Component: (
        <div>
          <div className="row row-cols-lg-5 row-cols-md-2 row-cols-1 p-2">
            <Input
              type="text"
              className="form-control"
              placeholder=" "
              // value={data?.LedgerTransactionNo || ""}
              lable={t("Barcode No")}
              respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            />

            <Input
              type="text"
              className="form-control"
              placeholder=" "
              value={data?.SampleType || ""}
              lable={t("Sample Type")}
              respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            />

            <Input
              type="text"
              className="form-control"
              placeholder=" "
              value={data?.PName || ""}
              lable={t("Patient Name")}
              respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            />
            <Input
              type="text"
              className="form-control"
              placeholder=" "
              value={data?.Age || ""}
              lable={t("Age/Gender")}
              respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            />
            <Input
              type="text"
              className="form-control"
              placeholder=" "
              value={data?.Mobile || ""}
              lable={t("Phone/Mobile")}
              respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            />
            <Input
              type="text"
              className="form-control"
              placeholder=" "
              value={data?.DepartmentName || ""}
              lable={t("Department")}
              respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            />

            <Input
              type="text"
              className="form-control"
              placeholder=" "
              value={data?.ReferDoctor || ""}
              lable={t("Refer Doctor")}
              respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            />

            <Input
              type="text"
              className="form-control"
              placeholder=" "
              value={data?.Panel_Code || ""}
              lable={t("Panel")}
              respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            />

            <Input
              type="text"
              className="form-control"
              placeholder=" "
              value={data?.BarcodeNo || ""}
              lable={t("Barcode No.")}
              respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            />

            <Input
              type="text"
              className="form-control"
              placeholder=" "
              value={data?.DOB || ""}
              lable={t("DOB")}
              respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            />
          </div>

          <div>
            <Tables
              thead={SampleInfohead}
              tbody={[
                {
                  InvestigationName: data.name || "",
                  SampleDrawnName: data.SampleReceivedBy || "",
                  RegDate: "",
                  RegBy: "",
                  CollectionDate: data.SampleReceiveDate || "",
                  CollectedBy: data.SampleCollector || "",
                  ReceivedDate: data.SampleReceiveDate || "",
                  ReceivedBy: data.SampleReceivedBy || "",
                  RejectedDate: data.RejectDate || "",
                  RejectedBy: data.RejectUser || "",
                  Reading1: "",
                  SampleRejectedReason: data.RejectionReason || "",
                  ResultEnteredDate: data.ResultEnteredDate || "",
                  ResultEnteredBy: data.ResultEnteredName || "",
                  ApprovedDate: data.ApprovedDate || "",
                  ApprovedBy: data.ApprovedName || "",
                  HoldBy: data.holdByName || "",
                  HoldReason: data.Hold_Reason || "",
                },
              ]}
              tableHeight={"scrollView"}
            />
          </div>
        </div>
      ),
      extrabutton: <></>,
      footer: <></>,
    });
  };

  return (
    <>
      {handleModelData?.isOpen && (
        <Modal
          visible={handleModelData?.isOpen}
          setVisible={setIsOpen}
          modalWidth={handleModelData?.width}
          Header={t(handleModelData?.label)}
          buttonType={"submit"}
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
      <div className="m-2 spatient_registration_card card">
        <Heading
          title={t("/Sample Management/Sample Collection")}
          isBreadcrumb={true}
        />

        <div className="row row-cols-lg-5 row-cols-md-2 row-cols-1 p-2">
          <ReactSelect
            placeholderName={t("Status")}
            id={"type"}
            searchable={true}
            removeIsClearable={true}
            respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
            dynamicOptions={Type}
            handleChange={handleSelect}
            value={`${values?.status?.value}`}
            name={"type"}
          />

          <ReactSelect
            placeholderName={t("Department")}
            id={"department"}
            searchable={true}
            removeIsClearable={true}
            respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
            dynamicOptions={[
              { value: "0", label: "ALL" },
              ...handleReactSelectDropDownOptions(
                departmentData,
                "Name",
                "ObservationType_ID"
              ),
            ]}
            handleChange={handleSelect}
            value={`${values?.department?.value}`}
            name={"department"}
          />

          <Input
            type="text"
            className="form-control"
            id="IpdNo"
            placeholder=" "
            name="IpdNo"
            value={values?.IpdNo || ""}
            onChange={handleChange}
            lable={t("IPD No")}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          />

          <Input
            type="text"
            placeholder=""
            className="form-control"
            id="UHID"
            name="UHID"
            value={values?.UHID || ""}
            onChange={handleChange}
            lable={t("UHID")}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          />

          <Input
            type="text"
            className="form-control"
            id="patintName"
            placeholder=" "
            name="patintName"
            value={values?.patintName || ""}
            onChange={handleChange}
            lable={t("Patient Name")}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          />

          <DatePicker
            id="fromDate"
            name="fromDate"
            placeholder={VITE_DATE_FORMAT}
            lable={t("From Date")}
            value={values?.fromDate || new Date()}
            handleChange={handleChange}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          />

          <DatePicker
            id="toDate"
            name="toDate"
            placeholder={VITE_DATE_FORMAT}
            lable={t("To Date")}
            value={values?.toDate || new Date()}
            handleChange={handleChange}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            maxDate={new Date()}
          />

          <ReactSelect
            placeholderName={t("Accepted")}
            id={"Accepted"}
            searchable={true}
            removeIsClearable={true}
            respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
            dynamicOptions={Accepted}
            handleChange={handleSelect}
            value={`${values?.Accepted?.value}`}
            name={"Accepted"}
          />

          <ReactSelect
            placeholderName={t("Room Name")}
            id={"roomList"}
            searchable={true}
            removeIsClearable={true}
            respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
            dynamicOptions={handleReactSelectDropDownOptions(
              roomLists,
              "roomName",
              "id"
            )}
            handleChange={handleSelect}
            value={`${values?.department?.value}`}
            name={"roomList"}
          />

          <div className="d-flex justify-content-between col-sm-6 col-xl-3">
            {values?.Accepted?.value === "Y" ? (
              <div>
                <button
                  className="btn btn-lg btn-success"
                  type="button"
                  onClick={handleSearchSampleCollection}
                >
                  {t("Search")}
                </button>

                <button
                  className="btn btn-md btn-success mx-2 px-4 py-2"
                  type="button"
                  onClick={handleHoldModal}
                >
                  {t("Save Out")}
                </button>
              </div>
            ) : (
              <>
                <button
                  className="btn btn-lg btn-success"
                  type="button"
                  onClick={handleSearchSampleCollection}
                >
                  {t("Search")}
                </button>
                <button
                  className="btn btn-lg btn-success"
                  type="button"
                  onClick={handleRadiologyCallTokens}
                >
                  {t("Call")}
                </button>
                <button
                  className="btn btn-lg btn-success"
                  type="button"
                  onClick={handleRadiologyUnCallTokens}
                >
                  {t("Un-Call")}
                </button>
                <button
                  className="btn btn-lg btn-success"
                  type="button"
                  onClick={handleSaveAcceptance}
                >
                  {t("Save")}
                </button>

                <button
                  className="btn btn-lg btn-success"
                  type="button"
                  onClick={handleRejectModal}
                >
                  {t("Reject Test")}
                </button>
              </>
            )}
          </div>
        </div>

        <Heading
          title=""
          isBreadcrumb={false}
          secondTitle={
            <>
              <ColorCodingSearch
                label={t("New ")}
                color="color-indicator-11-bg"
              />
              <ColorCodingSearch
                label={t("Called ")}
                color="color-indicator-2-bg"
              />
              <ColorCodingSearch
                label={t("Absent")}
                color="color-indicator-8-bg"
              />
              <ColorCodingSearch label={t("IN")} color="color-indicator-4-bg" />
              <ColorCodingSearch
                label={t("Out")}
                color="color-indicator-12-bg"
              />
              <ColorCodingSearch label={t("Reject")} color="#FF0000" />
            </>
          }
        />
        {tbodyPatientDetail.length > 0 && (
          <div className="card">
            <Tables
              thead={theadPatientDetail}
              tbody={tbodyPatientDetail?.map((val, index) => ({
                sno: index + 1,
                PatientSearch: (
                  <FaSearch
                    onClick={() => {
                      handleBindSampleinfo(pdata, index);
                    }}
                  />
                ),
                Type: val.EntryType || "",
                UHID: val.PatientID || "",
                IPDNo: val.LedgerTransactionNo || "",
                BedNo: val.BedNo || "",
                PatientName: val.pname || "",
                Age: val.age || "",
                PanelName: val.Company_Name || "",
                Department: val.ObservationName || "",
                Investigation: val.Name || "",
                Date: val.InDate || "",
                In:
                  val.P_IN === 0 && val.CallStatus === 1 ? (
                    <div
                      style={{ width: "150px", gap: "5px" }}
                      className="d-flex justify-content-start flex-column align-items-start"
                    >
                      <input
                        type="checkbox"
                        checked={val.callInChecked || false}
                        onChange={(e) => handleCallInChangeCheckbox(e, index)}
                      />
                      <DatePicker
                        style={{ maxWidth: "150px !important" }}
                        id="inDate"
                        name="inDate"
                        value={val.inDate}
                        handleChange={(value) =>
                          handleDateTime(value, "inDate", index)
                        }
                      />

                      <TimePicker
                        style={{ maxWidth: "150px !important" }}
                        id="inTime"
                        name="inTime"
                        value={val.inTime}
                        handleChange={(value) =>
                          handleDateTime(value, "inTime", index)
                        }
                      />
                    </div>
                  ) : (
                    val.P_IN == 1 && moment(val.P_InDateTime).format("lll")
                  ),
                Out:
                  val.P_Out == 0 && val.P_IN == 1 ? (
                    <div
                      style={{ width: "150px", gap: "5px" }}
                      className="d-flex justify-content-start flex-column align-items-start"
                    >
                      <input
                        type="checkbox"
                        checked={val.callInChecked}
                        onChange={(e) => handleCallInChangeCheckbox(e, index)}
                      />
                      <DatePicker
                        style={{ maxWidth: "150px !important" }}
                        id="outDate"
                        name="outDate"
                        value={val.outDate}
                        handleChange={(value) =>
                          handleDateTime(value, "outDate", index)
                        }
                      />

                      <TimePicker
                        style={{ maxWidth: "150px !important" }}
                        id="outTime"
                        name="outTime"
                        value={val.outTime}
                        handleChange={(value) =>
                          handleDateTime(value, "outTime", index)
                        }
                      />
                    </div>
                  ) : (
                    val.P_Out == 1 && moment(val.P_OutDateTime).format("lll")
                  ),
                Consumables:
                  val.P_Out == 1 && val.P_IN == 1 && val.CallStatus > 0 ? (
                    <p>+</p>
                  ) : (
                    "" || ""
                  ),
                Check1:
                  val.CallStatus === 0 || val.CallStatus === 1 || val.CallStatus === 2 ? (
                    <input
                      type="checkbox"
                      checked={val.saveChecked || false}
                      onChange={(e) => handleSaveChangeCheckbox(e, index)}
                    />
                  ) : (
                    "" || ""
                  ),
                Check2: (
                  <input
                    type="checkbox"
                    // checked={val.isCheckedt}
                    // onChange={(e) => handleChangeCheckboxTwo(e, index)}
                  />
                ),

                TechnicianName: val.technician || "",
              }))}
              tableHeight={"scrollView"}
              style={{ height: "60vh", padding: "2px" }}
              getRowClass={getRowClass}
            />
          </div>
        )}
      </div>

      {/*   */}
    </>
  );
}

export default DepartmentReceive;