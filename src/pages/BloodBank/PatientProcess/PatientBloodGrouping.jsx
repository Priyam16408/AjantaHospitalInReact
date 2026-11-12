import React, { useState } from "react";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import { useTranslation } from "react-i18next";
import Input from "../../../components/formComponent/Input";
import DatePicker from "../../../components/formComponent/DatePicker";
import moment from "moment";
import Heading from "../../../components/UI/Heading";
import Tables from "../../../components/UI/customTable";
import ColorCodingSearch from "../../../components/commonComponents/ColorCodingSearch";
import {
  BloodBankSaveCollectionRecordBG,
  BloodBankSaveRecordABO,
  BloodBankSearchBGABO,
  BloodBankSearchBloodCollection,
} from "../../../networkServices/BloodBank/BloodBank";
import { notify } from "../../../utils/ustil2";
import Modal from "../../../components/modalComponent/Modal";
import BloodGrouping from "./BloodGrouping";

const PatientBloodGrouping = () => {
  const [t] = useTranslation();
  const { VITE_DATE_FORMAT } = import.meta.env;
  const [tableData, setTableData] = useState([]);
  const [saveTableData, setSaveTableData] = useState([]);
  const [modalState, setModalState] = useState({
    show: false,
    name: null,
    component: null,
    size: null,
    footer: null,
  });
  const handleModalState = (show, name, component, size, footer) => {
    setModalState({
      show: show,
      name: name,
      component: component,
      size: size,
      footer: footer,
    });
  };

  const initialValues = {
    UHID: "",
    IPDNo: "",
    PatientName: "",
    fromDate: new Date(),
    toDate: new Date(),
    Status: { label: "ALL", value: "ALL" },
    Grouping: { label: "No", value: "1" },
  };

  const thead = [
    { name: t("SNo") },
    { name: t("Type") },
    { name: t("Collection ID") },
    { name: t("Name") },
    { name: t("Age/Sex") },
    { name: t("UHID") },
    { name: t("Blood Component") },
    { name: t("Blood Group") },
    { name: t("Room") },
    { name: t("Select") },
  ];
  const theadResult = [
    { name: t("SNo") },
    { name: t("Collection ID") },
    { name: t("Date") },
    { name: t("AntiA") },
    { name: t("AntiB") },
    { name: t("AntiAB") },
    { name: t("RH") },
    { name: t("Testing BG") },
    { name: t("Matched") },
    { name: t("ACell") },
    { name: t("BCell") },
    { name: t("OCell") },
    { name: t("Serium's BG") },
  ];
  const [values, setValues] = useState({ ...initialValues });
  // console.log("firstfirstfirstfirst", values);

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

  const handleSearch = async () => {
    const payload = {
      rbtType: values?.Status?.value ? values?.Status?.value : "ALL",
      name: values?.PatientName ? values?.PatientName : "",
      uhid: values?.UHID ? values?.UHID : "",
      ipdNo: values?.IPDNo ? values?.IPDNo : "",
      donationfrom: moment(values?.fromDate).format("YYYY-MM-DD"),
      donationTo: moment(values?.toDate).format("YYYY-MM-DD"),
      grouping: values?.Grouping?.value ? values?.Grouping?.value : "0",
    };
    const response = await BloodBankSearchBGABO(payload);
    if (response?.success) {
      setTableData(response?.data);
    } else {
      notify(response?.message, "error");
      setTableData([]);
    }
  };

  const handleSave = async (data) => {
    const payload = {
      antiA: data?.antiA?.value,
      antiB: data?.antiB?.value,
      antiAB: data?.AntiAB?.value,
      rh: data?.rh?.value,
      aCell: data?.Acell?.value,
      bCell: data?.Bcell?.value,
      oCell: data?.Ocell?.value,
      group: data?.BloodGroup,
      collectionID: data?.CollectionID,
      patientID: data?.PatientID,
      transactionID: String(data?.TransactionID),
      ledgerTransaction: String(data?.LedgerTransactionNo),
      itemID: String(data?.ItemID),
    };
    const response = await BloodBankSaveRecordABO(payload);
    if (response?.success) {
      setSaveTableData(response?.data);
      setModalState((val) => ({ ...val, show: false }));
      notify(response?.message, "success");
    } else {
      notify(response?.message, "error");
    }
  };

  const handleModalSelect = async (ele) => {
    console.log("ele", ele);
    setModalState({
      show: true,
      name: t("Processing"),
      component: (
        <BloodGrouping
          ele={ele}
          setPayload={setValues}
          setModalState={setModalState}
          modalData={modalState}
        />
      ),
      size: " 70vw",
      footer: null,
      handleAPI: handleSave,
    });
  };

  return (
    <div className="card">
      <Heading title={t("Patient Blood Grouping")} isBreadcrumb={true} />
      <div className="row p-2">
        <ReactSelect
          placeholderName={t("Type")}
          name="Status"
          value={values?.Status?.value}
          handleChange={handleReactSelect}
          dynamicOptions={[
            { label: "OPD", value: "OPD" },
            { label: "IPD", value: "IPD" },
            { label: "EMG", value: "EMG" },
            { label: "ALL", value: "ALL" },
          ]}
          searchable={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <Input
          type="text"
          className={"form-control "}
          lable={t("UHID")}
          placeholder=" "
          name="UHID"
          onChange={(e) => handleInputChange(e, 0, "UHID")}
          value={values?.UHID}
          required={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <Input
          type="text"
          className={"form-control "}
          lable={t("IPD No")}
          placeholder=" "
          name="IPDNo"
          onChange={(e) => handleInputChange(e, 0, "IPDNo")}
          value={values?.IPDNo}
          required={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <Input
          type="text"
          className={"form-control "}
          lable={t("Patient Name")}
          placeholder=" "
          name="PatientName"
          onChange={(e) => handleInputChange(e, 0, "PatientName")}
          value={values?.PatientName}
          required={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <DatePicker
          className={`custom-calendar `}
          respclass="vital-sign-date col-xl-2 col-md-4 col-sm-6 col-12"
          id="fromDate"
          name="fromDate"
          value={values?.fromDate ? values?.fromDate : new Date()}
          maxDate={new Date()}
          handleChange={(e) => {
            // Validate date format here as well when it is being changed
            const dateInput = e.target.value;

            setValues((prev) => ({
              ...prev,
              fromDate: moment(dateInput).toDate(), // Ensure state updates
            }));
          }}
          lable={t("From Date")}
          placeholder={VITE_DATE_FORMAT}
          inputClassName={""}
        />
        <DatePicker
          className={`custom-calendar `}
          respclass="vital-sign-date col-xl-2 col-md-4 col-sm-6 col-12"
          id="toDate"
          name="toDate"
          value={values?.toDate ? values?.toDate : new Date()}
          maxDate={new Date()}
          handleChange={(e) => {
            // Validate date format here as well when it is being changed
            const dateInput = e.target.value;

            setValues((prev) => ({
              ...prev,
              toDate: moment(dateInput).toDate(), // Ensure state updates
            }));
          }}
          lable={t("To Date")}
          placeholder={VITE_DATE_FORMAT}
          inputClassName={""}
        />
        <ReactSelect
          placeholderName={t("Grouping")}
          name="Grouping"
          value={values?.Grouping?.value ?? 0}
          handleChange={handleReactSelect}
          dynamicOptions={[
            { label: "No", value: "1" },
            { label: "Yes", value: "0" },
          ]}
          searchable={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <button className="btn btn-sm btn-primary ml-2" onClick={handleSearch}>
          {t("Search")}
        </button>
      </div>

      {tableData?.length > 0 && (
        <div>
          <Heading
            title={t("Search Results")}
            secondTitle={
              <>
                <ColorCodingSearch
                  color={"color-indicator-25-bg"}
                  label={t("Not Collected")}
                />
                <ColorCodingSearch
                  color={"color-indicator-24-bg"}
                  label={t("Collected")}
                />
              </>
            }
          />
          <Tables
            thead={thead}
            tbody={tableData?.map((ele, index) => ({
              SrNo: index + 1,
              Type: ele?.Type,
              CollectionId: ele?.CollectionID,
              Pname: ele?.PName,
              AgeSex: ele?.AgeSex,
              UHID: ele?.PatientID,
              BloodComponent: ele?.["Blood Component"],
              BloodGroup: ele?.BloodGroup,
              Room: ele?.ward,
              select: (
                <i
                  className="fa fa-search"
                  onClick={() => handleModalSelect(ele)}
                >
                  {" "}
                </i>
              ),
            }))}
          />
          <Tables
            thead={theadResult}
            tbody={saveTableData?.map((ele, index) => ({
              SrNo: index + 1,
              CollectionId: ele?.BloodCollection_Id,
              Date: ele?.CreatedDate,
              AnitA: ele?.AntiA,
              AnitB: ele?.AntiB,
              AnitAB: ele?.AntiAB,
              Rh: ele?.RH,
              TestedBG: ele?.BloodTested,
              Matched: ele?.IsSame,
              Acell: ele?.ACell,
              Bcell: ele?.BCell,
              Ocell: ele?.OCell,
              SerumsBg: ele?.BloodGroupAlloted,
            }))}
          />
        </div>
      )}
      <Modal
        Header={modalState?.name}
        modalWidth={modalState?.size}
        visible={modalState?.show}
        setVisible={() => {
          handleModalState(false, null, null, null, <></>);
        }}
        footer={modalState?.footer}
        modalData={modalState?.modalData}
        handleAPI={modalState?.handleAPI}
      >
        {modalState?.component}
      </Modal>
    </div>
  );
};

export default PatientBloodGrouping;
