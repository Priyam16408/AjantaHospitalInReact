import React, { useEffect, useState } from "react";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import { useTranslation } from "react-i18next";
import Input from "../../../components/formComponent/Input";
import DatePicker from "../../../components/formComponent/DatePicker";
import moment from "moment";
import Heading from "../../../components/UI/Heading";
import Tables from "../../../components/UI/customTable";
import ColorCodingSearch from "../../../components/commonComponents/ColorCodingSearch";
import {
  BindBloodGroup,
  BloodBankPatientapprove,
  BloodBankSaveCollectionRecordBG,
  BloodBankSaveRecordABO,
  BloodBankSearchBGABO,
  BloodBankSearchBloodCollection,
  BloodBankSearchGroup,
  RemarkData,
} from "../../../networkServices/BloodBank/BloodBank";
import { notify } from "../../../utils/ustil2";
import Modal from "../../../components/modalComponent/Modal";
import BloodGrouping from "./BloodGrouping";

const GroupingApproval = () => {
  const [t] = useTranslation();
  const { VITE_DATE_FORMAT } = import.meta.env;
  const [tableData, setTableData] = useState([]);
  console.log("TableData", tableData);
  const [bindBloodGroup, setBindBloodGroup] = useState([]);

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
    { name: t("Name") },
    { name: t("Age/Sex") },
    { name: t("Date") },
    { name: t("AntiA") },
    { name: t("AntiB") },
    { name: t("AntiAB") },
    { name: t("RH") },
    { name: t("Tested Blood Group") },
    { name: t("Remark") },
    { name: t("Approve") },
    { name: t("Reject") },
  ];
  const [values, setValues] = useState({ ...initialValues });

  const handleInputChange = (e, index, label) => {
    const { name, value } = e.target;
    setValues((val) => ({ ...val, [label]: value }));
  };
  const handleTableInputChange = (e, index, label) => {
    setTableData((val) =>
      val.map((item, i) =>
        i === index ? { ...item, [label]: e.target.value } : item
      )
    );
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
      ipdNo: values?.IPDNo ? values?.IPDNo : "",
      name: values?.PatientName ? values?.PatientName : "",
      uhid: values?.UHID ? values?.UHID : "",
      collectedfrom: moment(values?.fromDate).format("YYYY-MM-DD"),
      collectedTo: moment(values?.toDate).format("YYYY-MM-DD"),
      rbtType: values?.Status?.value ? values?.Status?.value : "ALL",
      bloodGroup: values?.BloodGroup?.value ?? 0,
    };
    const response = await BloodBankSearchGroup(payload);
    if (response?.success) {
      setTableData(response?.data);
    } else {
      notify(response?.message, "error");
      setTableData([]);
    }
  };

  const handleBindBloodGroup = async () => {
    try {
      const apiResp = await BindBloodGroup();
      if (apiResp.success) {
        const mappedOptions = apiResp.data.map((item) => ({
          value: item.id,
          label: item.bloodgroup,
        }));
        setBindBloodGroup(mappedOptions);
      } else notify(apiResp.message, "error");
    } catch (error) {
      notify("Error loading menu name data", "error");
    }
  };

  const handleApprove = async (ele, index) => {
    if (
      tableData[index]?.Remark === "" ||
      tableData[index]?.Remark === null ||
      !tableData[index]?.Remark
    ) {
      notify("Enter remark", "error");
      return;
    }
    const payload = {
      groupingId: ele?.Grouping_Id,
      remark: ele?.Remark,
      patientId: ele?.PatientID,
    };
    const response = await BloodBankPatientapprove(payload);
    if (response?.success) {
      handleSearch();
      notify(response?.message, "success");
    } else {
      notify(response?.message, "error");
    }
  };
  const handleReject = async (ele, index, name) => {
    if (
      tableData[index]?.Remark === "" ||
      tableData[index]?.Remark === null ||
      !tableData[index]?.Remark
    ) {
      notify("Enter remark", "error");
      return;
    }
    const payload = {
      groupingId: ele?.Grouping_Id,
      remark: ele?.Remark,
      hdn2: 2, 
    };
    const response = await RemarkData(payload);
    if (response?.success) {
      notify(response?.message, "success");
      handleSearch();
    } else {
      notify(response?.message, "error");
    }
  };

  useEffect(() => {
    handleBindBloodGroup();
  }, []);

  return (
    <div className="card">
      <Heading title={t("Grouping Approval")} isBreadcrumb={true} />
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
          lable={t("Collect From")}
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
          lable={t("Collect To")}
          placeholder={VITE_DATE_FORMAT}
          inputClassName={""}
        />
        <ReactSelect
          placeholderName={t("Blood Group")}
          name="BloodGroup"
          value={values?.BloodGroup?.value ?? 0}
          handleChange={handleReactSelect}
          dynamicOptions={bindBloodGroup}
          searchable={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <button className="btn btn-sm btn-primary ml-2" onClick={handleSearch}>
          {t("Search")}
        </button>
      </div>

      {tableData?.length > 0 && (
        <div>
          <Heading title={t("Search Results")} />
          <Tables
            thead={thead}
            tbody={tableData?.map((ele, index) => ({
              SrNo: index + 1,
              Name: ele?.Name,
              AgeSex: ele?.AgeSex,
              DATE: ele?.DATE,
              AntiA: ele?.AntiA,
              AntiB: ele?.AntiB,
              AntiAB: ele?.AntiAB,
              RH: ele?.RH,
              BloodTested: ele?.BloodTested,
              Remark: (
                <Input
                  type="text"
                  className={"required-fields table-input"}
                  placeholder=" "
                  name="Remark"
                  onChange={(e) => handleTableInputChange(e, index, "Remark")}
                  value={values?.Remark}
                  required={true}
                  respclass="col-xl-12 col-md-12 col-sm-6 col-12 mt-1"
                />
              ),
              Approve: (
                <i
                  className="fa fa-check"
                  onClick={() => handleApprove(ele, index)}
                >
                  {" "}
                </i>
              ),
              Reject: (
                <i
                  className="fa fa-trash"
                  onClick={() => handleReject(ele, index, "Reject")}
                >
                  {" "}
                </i>
              ),
            }))}
          />
        </div>
      )}
    </div>
  );
};

export default GroupingApproval;
