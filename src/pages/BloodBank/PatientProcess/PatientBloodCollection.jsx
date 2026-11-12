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
  BloodBankSearchBloodCollection,
} from "../../../networkServices/BloodBank/BloodBank";
import { notify } from "../../../utils/ustil2";

const PatientBloodCollection = () => {
  const [t] = useTranslation();
  const { VITE_DATE_FORMAT } = import.meta.env;
  const [tableData, setTableData] = useState([]);
  console.log("TableData", tableData);
  const [selectedRows, setSelectedRows] = useState([]);

  const initialValues = {
    UHID: "",
    IPDNo: "",
    PatientName: "",
    fromDate: new Date(),
    toDate: new Date(),
    Status: { label: "ALL", value: "ALL" },
    SampleCollected: { label: "No", value: "0" },
  };

  const thead = [
    { name: t("SNo") },
    { name: t("Type") },
    { name: t("UHID") },
    { name: t("IPD No.") },
    { name: t("Patient Name") },
    { name: t("Age/Sex") },
    { name: t("BloodGroup") },
    { name: t("Room") },
    { name: t("Reg. Date") },
    { name: t("Action") },
  ];
  const [values, setValues] = useState({ ...initialValues });
  console.log("Values", values);

  const handleInputChange = (e, index, label) => {
    const { name, value } = e.target;
    setValues((val) => ({ ...val, [label]: value }));
  };

  const handleReactSelect = (name, value) => {
    if (name === "SampleCollected") {
      setValues((val) => {
        return {
          ...val,
          [name]: value?.value,
        };
      });
      setTableData([]);
    }
    setValues((val) => {
      return {
        ...val,
        [name]: value,
      };
    });
  };

  const handleSearch = async () => {
    const payload = {
      ipdNo: values?.IPDNo ? values?.IPDNo : "",
      patientId: values?.UHID ? values?.UHID : "",
      name: values?.PatientName ? values?.PatientName : "",
      rdbType: values?.Status?.value ? values?.Status?.value : "ALL",
      rbtSampleType: values?.SampleCollected?.value
        ? values?.SampleCollected?.value
        : "0",
      datefrom: moment(values?.fromDate).format(VITE_DATE_FORMAT),
      dateTo: moment(values?.toDate).format(VITE_DATE_FORMAT),
    };
    const response = await BloodBankSearchBloodCollection(payload);
    if (response?.success) {
      setTableData(response?.data);
    } else {
      notify(response?.message, "error");
      setTableData([]);
    }
  };

  const handleCheckbox = async (e, index) => {
    const data = tableData.map((val, i) => {
      if (i === index) {
        val.isChecked = e?.target?.checked;
      }
      return val;
    });
    setTableData(data);
  };

  const handleCollect = async () => {
    const selectedData = tableData?.filter((val) => val?.isChecked === true);
    if (selectedData?.length === 0) {
      notify("Kindly select at least one Checkbox", "error");
      return;
    }
    const payload = selectedData?.map((item) => {
      return {
        isCollected: 1,
        patientId: item?.PatientID,
        chkSelect: 1,
        transactionID: item?.TransactionID,
        ledgerTransactionNo: item?.LedgerTransactionNo,
      };
    });
    const response = await BloodBankSaveCollectionRecordBG(payload);
    if (response?.success) {
      notify(response?.message, "success");
      handleSearch();
    } else {
      notify(response?.message, "error");
    }
  };

  const getRowClass = (ele, index) => {
    const data = tableData[index];
    if (data?.isCollected === 0) {
      return "color-indicator-2-bg";
    } else {
      return "color-indicator-14-bg";
    }
  };

  return (
    <div className="card">
      <Heading title={t("Patient Blood Collection")} isBreadcrumb={true} />
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
          placeholderName={t("Sample Collected")}
          name="SampleCollected"
          value={values?.SampleCollected?.value ?? 0}
          handleChange={handleReactSelect}
          dynamicOptions={[
            { label: "No", value: "0" },
            { label: "Yes", value: "1" },
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
              UHID: ele?.PatientID,
              ipdNo: ele?.IPDNo,
              Pname: ele?.Pname,
              AgeSex: ele?.AgeSex,
              BloodGroup: ele?.BloodGroup,
              Room: ele?.ward,
              RegDate: ele?.dtEntry,
              select: ele?.isCollected === 0 && (
                <input
                  type="checkbox"
                  onChange={(e) => handleCheckbox(e, index)}
                  checked={ele?.isChecked}
                />
              ),
            }))}
            getRowClass={getRowClass}
          />
          {values?.SampleCollected?.label === "No" && (
            <div className="d-flex justify-content-end">
              <button
                className="btn btn-sm btn-primary m-2"
                onClick={handleCollect}
              >
                {t("Collect")}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PatientBloodCollection;
