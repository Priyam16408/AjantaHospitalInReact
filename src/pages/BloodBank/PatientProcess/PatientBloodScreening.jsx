import React, { useEffect, useState } from "react";
import Heading from "../../../components/UI/Heading";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import { useTranslation } from "react-i18next";
import DatePicker from "../../../components/formComponent/DatePicker";
import moment from "moment";
import Input from "../../../components/formComponent/Input";
import {
  BindBloodGroup,
  BloodBankSaveScreening,
  BloodBankSearchPatient,
  BloodBankUpdateScreening,
} from "../../../networkServices/BloodBank/BloodBank";
import Tables from "../../../components/UI/customTable";
import BloodGrouping from "./BloodGrouping";
import SetScreening from "./SetScreening";
import Modal from "../../../components/modalComponent/Modal";
import { notify } from "../../../utils/ustil2";

const PatientBloodScreening = () => {
  const [t] = useTranslation();
  const { VITE_DATE_FORMAT } = import.meta.env;
  const [bindBloodGroup, setBindBloodGroup] = useState([]);
  const initialValues = {
    UHID: "",
    IPDNo: "",
    PatientName: "",
    fromDate: new Date(),
    toDate: new Date(),
    Status: { label: "ALL", value: "ALL" },
    Screening: { label: "No", value: "0" },
    isEdit: 0,
  };
  const [tableData, setTableData] = useState([]);
  const thead = [
    { name: t("SNo") },
    { name: t("Type") },
    { name: t("UHID") },
    { name: t("IPD No") },
    { name: t("Patient Name") },
    { name: t("Age/Sex") },
    { name: t("Room") },
    { name: t("Component") },
    { name: t("Quantity") },
    { name: t("Blood Group") },
    { name: t("Select") },
  ];
  const [values, setValues] = useState({ ...initialValues });

  useEffect(() => {
    console.log("values", values);
  }, [values]);

  const handleReactSelect = (name, value) => {
    setValues((val) => {
      return {
        ...val,
        [name]: value,
      };
    });
  };
  const [modalState, setModalState] = useState({
    show: false,
    name: null,
    component: null,
    size: null,
    footer: null,
  });

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
  const handleSave = async (data) => {
    const payload = {
      patientID: data.PatientID,
      transactionID: data.TransactionID.toString(),
      component: data.Type,
      bg: data.BloodGroup,
      itemID: data.ItemID.toString(),
      ltNo: data.LedgerTransactionNo.toString(),
      bcid: data.BloodCollection_Id,
      groupID: data.Grouping_Id,
      cellI: data.CellI.value,
      cellII: data.CellII.value,
      cellIII: data.CellIII.value,
      result: data.overAllResult.value,
      remarks: data.remark,
      screenID: data.ID || "0",
    };

    const response = await BloodBankSaveScreening(payload);
    if (response?.success) {
      notify(response?.message, "success");
      await handleSearch();
      setModalState((val) => ({ ...val, show: false }));
    } else {
      notify(response?.message, "error");
    }
  };

  const handleUpdate = async (data) => {
    console.log("data", data);
    const payload = {
      patientID: data.PatientID,
      transactionID: data.TransactionID.toString(),
      component: data.Type,
      bg: data.BloodGroup,
      itemID: data.ItemID.toString(),
      ltNo: data.LedgerTransactionNo.toString(),
      bcid: data.BloodCollection_Id,
      groupID: data.Grouping_Id,
      cellI: data.CellI.value,
      cellII: data.CellII.value,
      cellIII: data.CellIII.value,
      result: data.overAllResult.value,
      remarks: data.remark,
      screenID: data.ID || 0,
    };
    const response = await BloodBankUpdateScreening(payload);
    if (response?.success) {
      notify(response?.data?.message, "success");
      await handleSearch();
      setModalState((val) => ({ ...val, show: false }));
    } else {
      notify(response?.message, "error");
    }
  };

  const handleSelect = async (ele) => {
    setModalState({
      show: true,
      name: t("Processing"),
      component: (
        <SetScreening
          ele={ele}
          setPayload={setValues}
          setModalState={setModalState}
          modalData={modalState}
        />
      ),
      size: "50vw",
      footer: null,
      buttonName: values?.Screening?.value === "1" ? "Update" : "Save",
      handleAPI: values?.Screening?.value === "1" ? handleUpdate : handleSave,
    });
  };

  const handleModalState = (show, name, component, size, footer) => {
    setModalState({
      show: show,
      name: name,
      component: component,
      size: size,
      footer: footer,
    });
  };

  const handleSearch = async () => {
    const payload = {
      pType: values?.Status?.value,
      patientID: values?.UHID,
      ipdNo: values?.IPDNo,
      pName: values?.PatientName,
      bloodGroup: values?.BloodGroup?.label ?? "Select",
      fromDate: moment(values?.fromDate).format("YYYY-MM-DD"),
      toDate: moment(values?.toDate).format("YYYY-MM-DD"),
      isScreen: values?.Screening?.value,
    };

    const response = await BloodBankSearchPatient(payload);
    if (response?.success) {
      setTableData(response?.data);
    } else {
      notify(response?.message, "error");
      setTableData([]);
    }
  };
  useEffect(() => {
    handleBindBloodGroup();
  }, []);
  return (
    <div className="card">
      <Heading title={""} isBreadcrumb={true} />
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
          placeholderName={t("Blood Group")}
          name="BloodGroup"
          value={values?.BloodGroup?.value ?? 0}
          handleChange={handleReactSelect}
          dynamicOptions={bindBloodGroup}
          searchable={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <ReactSelect
          placeholderName={t("Screening")}
          name="Screening"
          value={values?.Screening?.value}
          handleChange={handleReactSelect}
          dynamicOptions={[
            { label: "Yes", value: "1" },
            { label: "No", value: "0" },
          ]}
          searchable={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <button className="btn btn-success ml-2" onClick={() => handleSearch()}>
          {t("Search")}
        </button>
        {tableData?.length > 0 && (
          <div>
            <Heading title={t("Search Results")} />
            <Tables
              thead={thead}
              tbody={tableData?.map((ele, index) => ({
                SrNo: index + 1,
                Type: ele?.Type,
                UHID: ele?.PatientID,
                IPD: ele?.IPDNo,
                Pname: ele?.Pname,
                AgeSex: ele?.AgeSex,
                Room: ele?.ward,
                BloodComponent: ele?.["Blood Component"],
                Quantity: ele?.Quantity,
                BloodGroup: ele?.BloodGroup,
                Select: (
                  <i
                    className="fa fa-search"
                    onClick={() => handleSelect(ele, index)}
                  ></i>
                ),
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
          buttonName={modalState?.buttonName}
          footer={modalState?.footer}
          modalData={modalState?.modalData}
          handleAPI={modalState?.handleAPI}
        >
          {modalState?.component}
        </Modal>
      </div>
    </div>
  );
};

export default PatientBloodScreening;
