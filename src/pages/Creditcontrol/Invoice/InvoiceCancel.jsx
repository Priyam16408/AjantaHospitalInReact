import React, { useState } from "react";
import Heading from "../../../components/UI/Heading";
import { useTranslation } from "react-i18next";
import DatePicker from "../../../components/formComponent/DatePicker";
import Input from "../../../components/formComponent/Input";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import Tables from "../../../components/UI/customTable";
import {
  CreditControlDispatchCancel,
  CreditControldispatchData,
  CreditControlInvoiceSearch,
} from "../../../networkServices/creditControl";
import { notify, reactSelectOptionList } from "../../../utils/utils";
import { useSelector } from "react-redux";
import moment from "moment";

 

const InvoiceCancel = () => {
  const [t] = useTranslation();
  const { VITE_DATE_FORMAT } = import.meta.env;
  const { getBindPanelListData } = useSelector((state) => state?.CommonSlice);

  const THEADPATIENTSEARCH = [ 
    t("Select"),
    t("Panel Invoice No"),
    t("Patient Name"),
    t("UHID"),
    t("Age"),
    t("Sex"),
    t("Date"),
    t("Address"),
    t("Contact No") 
  ];
  
  const THEADPATIENTDETAILS = [
    t("S.No"),
    t("UHID"),
    t("BillNo"),
    t("Type"),
    t("PanelName"),
    t("PanelAmount"),
    t("DispatchDate")
    
  ];
  
  const initialValue = {
    patientID: "",
    pName: "",
    lName: "",
    contactNo: "",
    address: "",
    fromDate: new Date(),
    toDate: new Date(),
    invoiceSettlement: "0",
    panelID: "0",
    panelInvoiceNo: "",
    reason: "",
  };

  const [patientTableData, setPatientTableData] = useState({
    patientSearch: [],
    patientDetails: [],
  });

  const [searchPayload, setSearchPayload] = useState({
    ...initialValue,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchPayload({ ...searchPayload, [name]: value });
  };

  const handleReactChange = (name, e) => {
    setSearchPayload({ ...searchPayload, [name]: e?.value });
  };

  

  const handleCreditControlInvoiceSearch = async () => {
    try {
      const response = await CreditControlInvoiceSearch({
        ...searchPayload,
        fromDate: moment(searchPayload?.fromDate).format("DD-MMM-YYYY"),
        toDate: moment(searchPayload?.toDate).format("DD-MMM-YYYY"),
      });
      if (response?.success) {
        setPatientTableData({
          patientSearch: response?.data,
          patientDetails: [],
        });
      } else {
        notify(response?.message, "error");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCreditControldispatchData = async (InvoiceNo) => {
    try {
      const response = await CreditControldispatchData(InvoiceNo);
      if (response?.success) {
        setPatientTableData({
          ...patientTableData,
          patientDetails: response?.data,
        });
      } else {
        notify(response?.message, "error");
        setPatientTableData({
          ...patientTableData,
          patientDetails: [],
        });
      }
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };

  const handleCreditControlDispatchCancel = async () => {
    try {
      debugger
      const response = await CreditControlDispatchCancel({
        invoiceNo: patientTableData?.patientDetails[0]?.panelinvoiceNo,
        cancelReason: searchPayload?.reason,
        type: patientTableData?.patientDetails[0]?.type,
      });

      if (response?.success) {
        notify(response?.message, "success");
        setPatientTableData({
          patientDetails: [],
          patientSearch: [],
        });
        setSearchPayload({ ...initialValue });
      } else {
        notify(response?.message, "error");
      }
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };

  const settleValue = (item) => {
    const {
      panelInvoiceNo,
      title,
      pFirstName,
      pLastName,
      mrNo,
      age,
      gender,
      date,
      houseNo,
      contactNo,
    } = item;
    const returnData = {
      select: (
        <div
          className="text-primary p-1"
          onClick={() => handleCreditControldispatchData(panelInvoiceNo)}
        >
          Select
        </div>
      ),
      PanelInvoiceNo: String(panelInvoiceNo || "-"),
      PatientName: `${title} ${pFirstName} ${pLastName}`,
      UHID: mrNo,
      Age: age,
      Sex: gender,
      Date: date,
      Address: houseNo ?? "-",
      Contact: contactNo,
    };
    return returnData;
  };

  const handletableData = (tableData, name) => {
    switch (name) {
      case "patientSearch":
        return tableData[name]?.map((items, index) => {
          const {
            select,
            PanelInvoiceNo,
            PatientName,
            UHID,
            Age,
            Sex,
            Date,
            Address,
            Contact,
          } = settleValue(items);
          return {
            select,
            PanelInvoiceNo,
            PatientName,
            UHID,
            Age,
            Sex,
            Date,
            Address,
            Contact,
          };
        });

      case "patientDetails":
        return tableData[name]?.map((items, index) => {
          const {
            patientID,
            billNo,
            type,
            company_Name,
            panelAmount,
            dispatchDate,
          } = items;
          return {
            Sno: <div className="p-1">{index + 1}</div>,
            patientID,
            billNo,
            type,
            company_Name,
            panelAmount,
            dispatchDate: moment(dispatchDate).format("DD-MMM-YYYY"),
          };
        });
    }
  };

 

  return (
    <div className="mt-2 spatient_registration_card">
      <div className="patient_registration card">
        <Heading
          title={t("HeadingName")}
          isBreadcrumb={false}
        />

        <div className="row p-2">
          <Input
            type="text"
            className="form-control"
            name="panelInvoiceNo"
            id="panelInvoiceNo"
            respclass={"col-xl-2 col-md-3 col-sm-4 col-12"}
            lable={t("InvoiceNo")}
            placeholder=""
            value={searchPayload?.panelInvoiceNo}
            onChange={handleChange}
          />

          <Input
            type="text"
            className="form-control"
            name={"patientID"}
            id="patientID"
            respclass={"col-xl-2 col-md-3 col-sm-4 col-12"}
            lable={t("UHID")}
            placeholder=""
            value={searchPayload?.patientID}
            onChange={handleChange}
          />

          <Input
            type="text"
            className="form-control"
            respclass={"col-xl-2 col-md-3 col-sm-4 col-12"}
            lable={t("ContactNo")}
            placeholder=""
            name={"contactNo"}
            id="contactNo"
            value={searchPayload?.contactNo}
            onChange={handleChange}
            maxLength={10}
          />

          <Input
            type="text"
            className="form-control"
            respclass={"col-xl-2 col-md-3 col-sm-4 col-12"}
            lable={t("FirstName")}
            placeholder=""
            name="firstName"
            id="firstName"
            value={searchPayload?.firstName}
            onChange={handleChange}
          />

          <Input
            type="text"
            className="form-control"
            respclass={"col-xl-2 col-md-3 col-sm-4 col-12"}
            lable={t("LastName")}
            placeholder=""
            name="lastName"
            id="lastName"
            value={searchPayload?.lastName}
            onChange={handleChange}
          />

          <Input
            type="text"
            className="form-control"
            respclass={"col-xl-2 col-md-3 col-sm-4 col-12"}
            lable={t("Address")}
            placeholder=""
            name="address"
            id="address"
            value={searchPayload?.address}
            onChange={handleChange}
          />

          <ReactSelect
            className="form-control"
            respclass={"col-xl-2 col-md-3 col-sm-4 col-12"}
            placeholderName={t("Panel")}
            name="panelID"
            id="panelID"
            value={searchPayload?.panelID}
            dynamicOptions={reactSelectOptionList(
              getBindPanelListData,
              "Company_Name",
              "PanelID"
            )}
            onChange={handleReactChange}
          />

          <DatePicker
            className="custom-calendar"
            id="fromDate"
            name="fromDate"
            placeholder={VITE_DATE_FORMAT}
            lable={t("FromDate")}
            showTime
            hourFormat="12"
            respclass={"col-xl-2 col-md-3 col-sm-4 col-12"}
            value={searchPayload?.fromDate}
            // value={payload?.billFromDate}
            handleChange={handleChange}
          />

          <DatePicker
            className="custom-calendar"
            id="toDate"
            name="toDate"
            placeholder={VITE_DATE_FORMAT}
            lable={t("ToDate")}
            showTime
            hourFormat="12"
            respclass={"col-xl-2 col-md-3 col-sm-4 col-12"}
            value={searchPayload?.toDate}
            handleChange={handleChange}
          />

          <div className="col-12 d-flex justify-content-end align-items-center">
            <button
              className="btn btn-sm btn-primary"
              onClick={handleCreditControlInvoiceSearch}
            >
              {t("Search")}
            </button>
          </div>
        </div>
      </div>

      {patientTableData?.patientSearch?.length > 0 && (
        <div className="mt-2 patient_registration card">
          <Heading
            title={t("searchResult")}
            isBreadcrumb={false}
          />

          <div className="row">
            <div className="col-12">
              <Tables
                thead={THEADPATIENTSEARCH}
                tbody={handletableData(patientTableData, "patientSearch")}
              />
            </div>
          </div>
        </div>
      )}

      {patientTableData?.patientDetails?.length > 0 && (
        <div className="mt-2 patient_registration card">
          <div className="row">
            <div className="col-12">
              <Tables
                thead={THEADPATIENTDETAILS}
                tbody={handletableData(patientTableData, "patientDetails")}
              />
            </div>
          </div>
          <div className="row p-2">
            <div className="col-12">
              <div className="d-flex aling-items-center justify-content-end w-100">
                <Input
                  type="text"
                  className="form-control required-fields"
                  name="reason"
                  id="reason"
                  respclass={"w-50 "}
                  lable={t("reason")}
                  placeholder=""
                  value={searchPayload?.reason}
                  onChange={handleChange}
                />

                <button
                  className="btn btn-sm btn-primary ml-2"
                  onClick={handleCreditControlDispatchCancel}
                >
                  Cancel Invoice
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceCancel;
