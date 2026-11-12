import React, { useEffect, useState } from "react";
import Heading from "../../../components/UI/Heading";
import { useTranslation } from "react-i18next";
import DatePicker from "../../../components/formComponent/DatePicker";
import Input from "../../../components/formComponent/Input";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import Tables from "../../../components/UI/customTable";
import moment from "moment";
import {
  handleCalculateSettlementInvoice,
  handleReactSelectDropDownOptions,
  notify,
  reactSelectOptionList,
} from "../../../utils/utils";
import { useSelector } from "react-redux";
import {
  CreditControlPanelInvoiceSearch,
  CreditControlInvoiceSearch,
  CreditControlBindInoviceData,
} from "../../../networkServices/creditControl";
import { TableListSVG } from "../../../components/SvgIcons";
import {
  BindPaymentModePanelWise,
  getBankMaster,
  GetConversionFactor,
  LoadCurrencyDetail,
} from "../../../networkServices/PaymentGatewayApi";
import { GetSwipMachine } from "../../../networkServices/opdserviceAPI";
import InvoiceSettlementPayment from "./InvoiceSettlementPayment";

 

 
const initialValue = {
  patientID: "",
  pName: "",
  lName: "",
  contactNo: "",
  address: "",
  fromDate: new Date(),
  toDate: new Date(),
  invoiceSettlement: "1",
  panelID: "0",
  panelInvoiceNo: "",
  reason: "",
};

const InvoiceSettlement = () => {
  const [t] = useTranslation();
  const { VITE_DATE_FORMAT } = import.meta.env;
  const { getBindPanelListData } = useSelector((state) => state?.CommonSlice);
  const [dropDownState, setDropDownState] = useState({
    CurrencyDetail: [],
    PaymentMode: [],
    BankMaster: [],
    SwipMachine: [],
  });

  const THEADPATIENTSEARCH = [
    t("Select"),
    t("Panel Invoice No"),
    t("Patient Name"),
    t("UHID"),
    t("Age"),
    t("Sex"),
    t("Date"),
    t("Address"),
    t("Contact No.")
  ];

  const THEADPATIENTDETAILS = [
    t("S.No."),
    t("Invoice No."),
    t("Panel Name"),
    t("Invoice Date"),
    t("Created By"),
    t("Panel Payble"),
    t("Patient Payble"),
    t("Panel Paid"),
    t("Patient Paid"),
    t("Balance Amt."),
    t("Type"),
    t("")
    
  ];
  

  const [patientTableData, setPatientTableData] = useState({
    patientSearch: [],
    patientDetails: {},
    patientInvoiceData: [],
  });

  const [searchPayload, setSearchPayload] = useState({
    ...initialValue,
  });

  const handleCreditControlInvoiceSearch = async () => {
    try {
      const response = await CreditControlInvoiceSearch({
        ...searchPayload,
        fromDate: moment(searchPayload?.fromDate).format("DD-MMM-YYYY"),
        toDate: moment(searchPayload?.toDate).format("DD-MMM-YYYY"),
      });

      if (response?.data?.length === 0) notify(response?.message, "error");

      setPatientTableData({
        patientSearch: response?.data,
        patientDetails: {},
        patientInvoiceData: [],
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchPayload({ ...searchPayload, [name]: value });
  };

  const handleReactChange = (name, e) => {
    setSearchPayload({ ...searchPayload, [name]: e?.value });
  };

  const handleCreditControlPanelInvoiceSearch = async (InvoiceNo, IPDNo) => {
    
    try {
      const response = await CreditControlPanelInvoiceSearch(InvoiceNo, IPDNo);

      const secondResponse = await CreditControlBindInoviceData(
        InvoiceNo,
        IPDNo
      );

      const apiResponse = await renderAPI(response?.data?.PanelID);

      const currencyFactor = await handleGetConversionFactor({
        CountryID: apiResponse?.CurrencyDetail[0]?.value,
      });



      const { BalanceBase, BalanceSpecific } = handleCalculateSettlementInvoice(
        {
          ...response?.data,
          ReceivedAmount: Number(secondResponse?.data[0]?.ReceiveAmt),
          PreTDSAmount: Number(secondResponse?.data[0]?.PreTDSAmount),
          PreWriteOffAmount: Number(secondResponse?.data[0]?.PreWriteOffAmount),
          PrededucationAmt: Number(secondResponse?.data[0]?.PrededucationAmt),
          CurrentReceiveAMt: 0,
          CurrentTDSAmt: 0,
          CurrentWriteOffAmt: 0,
          CurrentDeductionAmt: 0,
        },
        currencyFactor
      );
      setDropDownState(apiResponse);
      setPatientTableData({
        patientSearch: [],
        patientDetails: {
          ...response?.data,
          Currency: apiResponse?.CurrencyDetail[0],
          PaymentMode: apiResponse?.PaymentMode[0],
          ReceivedAmount: Number(secondResponse?.data[0]?.ReceiveAmt),
          PreTDSAmount: Number(secondResponse?.data[0]?.PreTDSAmount),
          PreWriteOffAmount: Number(secondResponse?.data[0]?.PreWriteOffAmount),
          PrededucationAmt: Number(secondResponse?.data[0]?.PrededucationAmt),
          panelInvoiceNo: InvoiceNo,
          BalanceBase: BalanceBase,
          BalanceSpecific: BalanceSpecific,
          currencyFactor: currencyFactor,
          CurrentReceiveAMt: 0,
          CurrentTDSAmt: 0,
          CurrentWriteOffAmt: 0,
          CurrentDeductionAmt: 0,
          bankName: {},
          machineName: {},
          refNo: "",
          date: "",
        },
        patientInvoiceData: secondResponse?.data?.map((item, _) => {
          return {
            ...item,
            ReceiveAmt: 0,
            TDSAmt: 0,
            WriteOffAmt: 0,
            AcceptableDeduction: 0,
          };
        }),
      });
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };

  const settleValue = (item, index) => {
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
          onClick={() =>
            handleCreditControlPanelInvoiceSearch(panelInvoiceNo, '""')
          }
        >
          <TableListSVG />
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
          } = settleValue(items, index);
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
    }
  };

  const handleGetConversionFactor = async (data) => {
    const { CountryID } = data;
    try {
      const apiResponse = await GetConversionFactor(CountryID);
      return apiResponse?.data;
    } catch (error) {
      console.log(error);
    }
  };

  const fetchPaymentMode = async (panelID) => {
    try {
      const data = await BindPaymentModePanelWise({
        PanelID: panelID,
      });
      return data?.data;
    } catch (error) {
      console.error("Failed to load currency detail:", error);
    }
  };

  const fetchGetBankMaster = async () => {
    try {
      const data = await getBankMaster();
      return data?.data;
    } catch (error) {
      console.error("Failed to load currency detail:", error);
    }
  };

  const fetchGetSwipMachine = async () => {
    try {
      const data = await GetSwipMachine();
      return data?.data;
    } catch (error) {
      console.error("Failed to load currency detail:", error);
    }
  };

  const renderAPI = async (PanelID) => {
    try {
      const [CurrencyDetail, PaymentMode, BankMaster, SwipMachine] =
        await Promise.all([
          LoadCurrencyDetail(),
          fetchPaymentMode(PanelID),
          fetchGetBankMaster(),
          fetchGetSwipMachine(),
        ]);

      const response = {
        CurrencyDetail: handleReactSelectDropDownOptions(
          CurrencyDetail?.data,
          "Currency",
          "CountryID"
        ),
        PaymentMode: handleReactSelectDropDownOptions(
          PaymentMode,
          "PaymentMode",
          "PaymentModeID"
        ),
        BankMaster: handleReactSelectDropDownOptions(
          BankMaster,
          "BankName",
          "Bank_ID"
        ),
        SwipMachine: handleReactSelectDropDownOptions(
          SwipMachine,
          "MachineName",
          "MachineID"
        ),
      };

      return response;
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };

  return (
    <div className="mt-2 spatient_registration_card">
      <div className="patient_registration card">
        <Heading
          title={t("Invoice Cancel After Settlement")}
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
          <div className="col-xl-2 col-md-3 col-sm-4 col-12">

            <button
              className="btn btn-sm btn-primary"
              onClick={handleCreditControlInvoiceSearch}
            >
              Search
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
   
      {Object.keys(patientTableData?.patientDetails)?.length > 0 && (
        <InvoiceSettlementPayment
          patientTableData={patientTableData}
          dropDownState={dropDownState}
          setPatientTableData={setPatientTableData}
        />
      )}
    </div>
  );
};

export default InvoiceSettlement;
