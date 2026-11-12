import React from "react";
import Heading from "../../../components/UI/Heading";
import LabeledInput from "../../../components/formComponent/LabeledInput";
import { AMOUNT_REGX, ROUNDOFF_VALUE } from "../../../utils/constant";
import { useTranslation } from "react-i18next";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import DatePicker from "../../../components/formComponent/DatePicker";
import ColorCodingSearch from "../../../components/commonComponents/ColorCodingSearch";
import Input from "../../../components/formComponent/Input";
import Tables from "../../../components/UI/customTable";
import { GetConversionFactor } from "../../../networkServices/PaymentGatewayApi";
import {
  handleCalculateSettlementInvoice,
  handleTableDisdustionData,
} from "../../../utils/utils";
import WrapTranslate from "../../../components/WrapTranslate";
import { notify } from "../../../utils/ustil2";
import { saveInvoiceSettlementApi } from "../../../networkServices/creditControl";
import { useLocalStorage } from "../../../utils/hooks/useLocalStorage";

const THEAD = [
  "S.No.",
  "Invoice No.",
  "Panel Name",
  "Invoice Date",
  "Created By",
  "Panel Payble",
  "Patient Payble",
  "Panel Paid",
  "Patient Paid",
  "Balance Amt",
  "Type",
];

const COLOR_STATUS = {
  0: "#FDE76D",
  1: "#ffb6c1",
  2: "#fa0d0d",
  3: "#e1eeff",
};

const InvoiceSettlementPayment = ({
  patientTableData,
  dropDownState,
  setPatientTableData,
}) => {
  const { VITE_DATE_FORMAT } = import.meta.env;
  const [t] = useTranslation();
  const ip = useLocalStorage("ip", "get");

  // const handleAllChecked = (e) => {
  //   const { name, checked } = e.target;
  //   const data = [...patientTableData?.patientInvoiceData];
  //   data.forEach((item) => {
  //     item[name] = checked;
  //     if (checked) {
  //     } else {
  //       item.ReceiveAmtSpecific = 0;
  //       item.ReceiveAmt = 0;
  //       item.TDSSpecific = 0;
  //       item.TDSAmt = 0;
  //       item.WriteOffAmtSpecific = 0;
  //       item.WriteOffAmt = 0;
  //       item.AcceptableDeductionSpecific = 0;
  //       item.AcceptableDeduction = 0;
  //     }
  //   });

  //   setPatientTableData({
  //     ...patientTableData,
  //     patientInvoiceData: data,
  //   });
  // };
  const handleAllChecked = (e) => {
    const { name, checked } = e.target;

    const updatedInvoiceData = patientTableData?.patientInvoiceData.map((item) => ({
      ...item,
      [name]: checked,
      ReceiveAmtSpecific: checked ? item.ReceiveAmtSpecific : 0,
      ReceiveAmt: checked ? item.ReceiveAmt : 0,
      TDSSpecific: checked ? item.TDSSpecific : 0,
      TDSAmt: checked ? item.TDSAmt : 0,
      WriteOffAmtSpecific: checked ? item.WriteOffAmtSpecific : 0,
      WriteOffAmt: checked ? item.WriteOffAmt : 0,
      AcceptableDeductionSpecific: checked ? item.AcceptableDeductionSpecific : 0,
      AcceptableDeduction: checked ? item.AcceptableDeduction : 0,
    }));

    setPatientTableData({
      ...patientTableData,
      patientInvoiceData: updatedInvoiceData,
    });
  };

  const isMobile = window.innerWidth < 769 ? true : false;

  const THEAD_SECOND = [
    "#",
    {
      name: isMobile ? "Checkbox" : <input
        type="checkbox"
        name={"isChecked"}
        onChange={handleAllChecked}
        checked={patientTableData?.patientInvoiceData?.every(
          (items, _) => items?.isChecked
        )}
      />
    },
    "UHID",
    "Bill Amt.",
    "Panel Payble",
    "Panel Paid",
    "Other Payble",
    "Other Paid",
    "Rec.Amt. (Specific)",
    "Rec.Amt. (Base)",
    "TDS Amt. (Specific)",
    "TDS Amt. (Base)",
    "WriteOff (Specific)",
    "WriteOff (Base)",
    "Deduction (Specific)",
    "Deduction (Base)",
    "Bal.Amt. (Specific)",
    "Bal.Amt. (Base)",
  ];

  const handletableData = (data) => {
    const arr = [];
    const obj = {
      SNo: <div className="p-1">1</div>,
      panelInvoiceNo: data?.panelInvoiceNo,
      PanelName: data?.PanelName,
      InvoiceDate: data?.DATE,
      CreatedBy: data?.InvoiceCreatedBy,
      PanelPayble: <div className="text-right">{data?.PanelPaybleAmt}</div>,
      PatientPaybleAmt: (
        <div className="text-right">{data?.PatientPaybleAmt || "0"}</div>
      ),
      PanelPaidAmt: <div className="text-right">{data?.PanelPaidAmt}</div>,
      PatientPaidAmt: <div className="text-right">{data?.PatientPaidAmt}</div>,
      OutStanding: <div className="text-right">{data?.BalanceAmt}</div>,
      Type: data?.Type,
    };

    arr.push(obj);
    return arr;
  };

  const handleColor = (BalanceAmt, totalAmt) => {
    if (!totalAmt) {
      return 3;
    } else {
      if (Number(BalanceAmt).toFixed(4) < 0.0) return 2;
      else if (Number(BalanceAmt).toFixed(4) === 0.0) return 1;
      else if (Number(BalanceAmt).toFixed(4) > 0.0) return 0;
      else return 3;
    }
  };


  // const handleTableChange = (e, index, secondName, ...rest) => {
  //   const data = [...patientTableData?.patientInvoiceData];
  //   const { name, value } = e?.target;

  //   if (rest?.length > 0 && rest?.some((ele, _) => ele === false)) return;
  //   data[index][name] = value;

  //   data[index][secondName] = parseFloat(
  //     Number(value) * Number(patientTableData?.patientDetails?.currencyFactor)
  //   ).toFixed(ROUNDOFF_VALUE);

  //   setPatientTableData({
  //     ...patientTableData,
  //     patientInvoiceData: data,
  //   });
  // };
  const handleTableChange = (e, index, secondName, ...rest) => {
    const { name, value } = e?.target;
    if (rest?.length > 0 && rest?.some((ele) => ele === false)) return;

    const updatedInvoiceData = patientTableData?.patientInvoiceData.map((item, idx) =>
      idx === index
        ? {
          ...item,
          [name]: value,
          [secondName]: parseFloat(
            Number(value) * Number(patientTableData?.patientDetails?.currencyFactor)
          ).toFixed(ROUNDOFF_VALUE),
        }
        : item
    );

    setPatientTableData({
      ...patientTableData,
      patientInvoiceData: updatedInvoiceData,
    });
  };

  // const handleSingleChecked = (e, index) => {
  //   const { name, checked } = e.target;
  //   const data = [...patientTableData?.patientInvoiceData];
  //   data[index][name] = checked;
  //   if (checked) {
  //   } else {
  //     data[index].ReceiveAmtSpecific = 0;
  //     data[index].ReceiveAmt = 0;
  //     data[index].TDSSpecific = 0;
  //     data[index].TDSAmt = 0;
  //     data[index].WriteOffAmtSpecific = 0;
  //     data[index].WriteOffAmt = 0;
  //     data[index].AcceptableDeductionSpecific = 0;
  //     data[index].AcceptableDeduction = 0;
  //   }
  //   setPatientTableData({
  //     ...patientTableData,
  //     patientInvoiceData: data,
  //   });
  // };
  const handleSingleChecked = (e, index) => {
    const { name, checked } = e.target;

    const updatedInvoiceData = patientTableData?.patientInvoiceData.map((item, idx) => {
      if (idx !== index) return item;

      return {
        ...item,
        [name]: checked,
        ReceiveAmtSpecific: checked ? item.ReceiveAmtSpecific : 0,
        ReceiveAmt: checked ? item.ReceiveAmt : 0,
        TDSSpecific: checked ? item.TDSSpecific : 0,
        TDSAmt: checked ? item.TDSAmt : 0,
        WriteOffAmtSpecific: checked ? item.WriteOffAmtSpecific : 0,
        WriteOffAmt: checked ? item.WriteOffAmt : 0,
        AcceptableDeductionSpecific: checked ? item.AcceptableDeductionSpecific : 0,
        AcceptableDeduction: checked ? item.AcceptableDeduction : 0,
      };
    });

    setPatientTableData({
      ...patientTableData,
      patientInvoiceData: updatedInvoiceData,
    });
  };


  const handlePatientInvoiceData = (tableData) => {

    return tableData?.map((row, index) => {
      const {
        PatientID,
        BillAmount,
        PanelAmount,
        PanelPaidAmt,
        PatientPaidAmt,
        PatientPaybleAmt,
        OutStanding,
        IsSettled,
        ReceiveAmtSpecific,
        ReceiveAmt,
        TDSSpecific,
        TDSAmt,
        WriteOffAmtSpecific,
        WriteOffAmt,
        AcceptableDeductionSpecific,
        AcceptableDeduction,
        isChecked,
      } = row;

      const totalAmt =
        Number(ReceiveAmt) +
        Number(TDSAmt) +
        Number(WriteOffAmt) +
        Number(AcceptableDeduction);

      const BalanceAmt = parseFloat(
        Number(OutStanding) - Number(totalAmt)
      ).toFixed(4);

      return {
        SNo: index + 1,
        input: (
          <input
            type="checkbox"
            name="isChecked"
            checked={isChecked}
            onChange={(e) => handleSingleChecked(e, index)}
          />
        ),
        PatientID: PatientID,
        BillAmount: <div className="text-right">{BillAmount || "0"}</div>,
        PanelAmount: <div className="text-right">{PanelAmount || "0"}</div>,
        PanelPaidAmt: <div className="text-right">{PanelPaidAmt || "0"}</div>,
        PatientPaybleAmt: (
          <div className="text-right">{PatientPaybleAmt || "0"}</div>
        ),
        otherPaid: <div className="text-right">{PatientPaidAmt || "0"}</div>,
        ReceivedAmtSPE: (
          <Input
            className={"table-input"}
            removeFormGroupClass={true}
            disabled={String(IsSettled) === "1" ? true : false}
            value={ReceiveAmtSpecific}
            name={"ReceiveAmtSpecific"}
            onChange={(e) =>
              handleTableChange(
                e,
                index,
                "ReceiveAmt",
                AMOUNT_REGX(9).test(e?.target?.value)
              )
            }
          />
        ),
        ReceivedAmtBASE: (
          <Input
            className={"table-input"}
            removeFormGroupClass={true}
            value={ReceiveAmt}
            disabled={true}
          />
        ),
        TDSAmtSPE: (
          <Input
            className={"table-input"}
            removeFormGroupClass={true}
            disabled={String(IsSettled) === "1" ? true : false}
            value={TDSSpecific}
            name={"TDSSpecific"}
            onChange={(e) =>
              handleTableChange(
                e,
                index,
                "TDSAmt",
                AMOUNT_REGX(9).test(e?.target?.value)
              )
            }
          />
        ),
        TDSAmtBASE: (
          <Input
            className={"table-input"}
            removeFormGroupClass={true}
            disabled={true}
            value={TDSAmt}
          />
        ),
        WriteOffSEC: (
          <Input
            className={"table-input"}
            removeFormGroupClass={true}
            disabled={String(IsSettled) === "1" ? true : false}
            value={WriteOffAmtSpecific}
            name={"WriteOffAmtSpecific"}
            onChange={(e) =>
              handleTableChange(
                e,
                index,
                "WriteOffAmt",
                AMOUNT_REGX(9).test(e?.target?.value)
              )
            }
          />
        ),
        WriteOffBASE: (
          <Input
            className={"table-input"}
            removeFormGroupClass={true}
            disabled={true}
            value={WriteOffAmt}
          />
        ),
        DeductionSPE: (
          <Input
            className={"table-input"}
            removeFormGroupClass={true}
            disabled={String(IsSettled) === "1" ? true : false}
            value={AcceptableDeductionSpecific}
            name={"AcceptableDeductionSpecific"}
            onChange={(e) =>
              handleTableChange(
                e,
                index,
                "AcceptableDeduction",
                AMOUNT_REGX(9).test(e?.target?.value)
              )
            }
          />
        ),
        DeductionBASE: (
          <Input
            className={"table-input"}
            removeFormGroupClass={true}
            disabled={true}
            value={AcceptableDeduction}
          />
        ),
        OutStanding: parseFloat(
          Number(BalanceAmt) /
          Number(patientTableData?.patientDetails?.currencyFactor)
        ).toFixed(4),

        OutStandingBase: (
          <Input
            value={BalanceAmt}
            className={"table-input"}
            removeFormGroupClass={true}
            disabled={true}
          />
        ),

        colorcode: COLOR_STATUS[handleColor(BalanceAmt, totalAmt)],
      };
    });
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

  const handleConversionFactor = async (e) => {
    const currencyFactor = await handleGetConversionFactor({
      CountryID: e?.value,
    });
    return currencyFactor;
  };

  console.log(patientTableData, "tablee data")

  const handleReactChange = async (name, e, apiCall, secondName) => {
    const obj = { ...patientTableData?.patientDetails };
    obj[name] = e;

    if (apiCall) {
      const data = await apiCall(e);
      obj[secondName] = data;
    }

    const { BalanceBase, BalanceSpecific } = handleCalculateSettlementInvoice(
      obj,
      obj?.currencyFactor
    );

    setPatientTableData({
      ...patientTableData,
      patientSearch: [],
      patientDetails: {
        ...obj,
        BalanceBase: BalanceBase,
        BalanceSpecific: BalanceSpecific,
      },
    });
  };

  const handleTotalCurrentAmt = (data) => {
    return [
      {
        label: "Rec.Amt. :",
        value: data?.CurrentReceiveAMt,
      },
      {
        label: "TDS : ",
        value: data?.CurrentTDSAmt,
      },
      {
        label: "Write-Off : ",
        value: data?.CurrentWriteOffAmt,
      },
      {
        label: "Deduction :",
        value: data?.CurrentDeductionAmt,
      },
      {
        label: "Total :",
        value:
          Number(data?.CurrentReceiveAMt) +
          Number(data?.CurrentDeductionAmt) +
          Number(data?.CurrentWriteOffAmt) +
          Number(data?.CurrentTDSAmt),
      },
    ].map((ele, index) => {
      return (
        <label key={index} className="m-0">
          {ele?.label}
          {ele?.value}
        </label>
      );
    });
  };

  const handleChange = (e, ...rest) => {
    const { name, value } = e.target;
    const obj = { ...patientTableData?.patientDetails };
    if (rest?.length > 0 && rest.some((ele, _) => ele === false)) return;
    obj[name] = value;
    const { BalanceBase, BalanceSpecific } = handleCalculateSettlementInvoice(
      obj,
      obj?.currencyFactor
    );

    const data = {
      ...obj,
      BalanceBase: BalanceBase,
      BalanceSpecific: BalanceSpecific,
    };

    const tableData = handleTableDisdustionData(
      patientTableData?.patientInvoiceData,
      patientTableData?.patientDetails?.PanelPaybleAmt,
      patientTableData?.patientDetails?.currencyFactor,
      data
    );

    setPatientTableData({
      ...patientTableData,
      patientSearch: [],
      patientInvoiceData: tableData,
      patientDetails: data,
    });
  };

  const handleSaveInvoiceSettlement = async () => {
    const patientDetails = patientTableData?.patientDetails;
    const invoiceList = patientTableData?.patientInvoiceData || [];

    if (patientDetails?.PaymentMode?.PaymentMode !== "Cash") {
      if (!patientDetails?.bankName?.BankName) {
        notify("Bank is required!", "error")
        return
      }
      if (!patientDetails?.refNo) {
        notify("Ref No is required!", "error")
        return
      }
    }

    const payload = {
      receivedAmount: patientDetails?.CurrentReceiveAMt || 0,
      tdsAmount: patientDetails?.CurrentTDSAmt || 0,
      writeOff: patientDetails?.CurrentWriteOffAmt || 0,
      deducationAmt: patientDetails?.CurrentDeductionAmt || 0,
      type: patientDetails?.Type || "",
      ipAddress: ip,
      invoiceNo: patientDetails?.PanelInvoiceNo || "",
      invoiceDate: patientDetails?.DATE || "",
      panelID: patientDetails?.PanelID || 0,
      patientType: patientDetails?.Type || "",
      balanceAmount: patientDetails?.BalanceAmt || 0,
      invoiceAmount: patientDetails?.InvoiceAmt || 0,
      onAccountVoucharID: 0,
      objectInvoices: invoiceList.map((invoice) => ({
        transactionID: invoice?.TransactionID?.toString() || "",
        ledgertransactionNo: invoice?.LedgertransactionNo?.toString() || "",
        amount: invoice?.ReceiveAmt || 0,
        patientID: invoice?.PatientID || "",
        tdsAmount: invoice?.TDSAmt || 0,
        writeOff: invoice?.WriteOffAmt || 0,
        deducationAmt: invoice?.AcceptableDeduction || 0,
        panelAmount: invoice?.PanelAmount || 0,
        billAmount: invoice?.BillAmount || 0,
        paymentModeID: patientDetails?.PaymentMode?.PaymentModeID?.toString() || "",
        paymentMode: patientDetails?.PaymentMode?.PaymentMode || "",
        bankName: patientDetails?.bankName?.label || "",
        machineName: patientDetails?.machineName?.label || "",
        chequeDate: "", // add if available
        chequeNo: "",   // add if available
        creditCardNo: "", // add if available
        currency: patientDetails?.Currency?.value || "",
        currencyFactor: patientDetails?.currencyFactor?.toString() || "1",
        ipAddress: ip,
      }))
    };

    try {
      const response = await saveInvoiceSettlementApi(payload);
      if (response?.success) {
        notify(response?.message, 'success')
      } else {

        notify(response?.message, "error");
      }
    } catch (error) {
      notify(error?.message);
    }

  }

  return (
    <>
      <div className="mt-2 patient_registration card">
        <Heading
          title={t("searchResult")}
          isBreadcrumb={false}
        />

        <div className="row">
          <div className="col-12">
            <Tables
              thead={THEAD}
              tbody={handletableData(patientTableData?.patientDetails)}
            />
          </div>
        </div>
      </div>

      <div className="patient_registration card mt-2">
        <Heading
          title={t("SearchResult")}
          isBreadcrumb={false}
        />

        <div className="row p-2">
          <LabeledInput
            label={t("InvoiceNo")}
            className={"col-xl-2 col-md-3 col-sm-4 col-12 form-group"}
            value={patientTableData?.patientDetails?.panelInvoiceNo}
          />
          <LabeledInput
            label={t("InvoiceAmtBase")}
            className={"col-xl-2 col-md-3 col-sm-4 col-12 form-group"}
            value={Number(
              patientTableData?.patientDetails?.PanelPaybleAmt
            ).toFixed(ROUNDOFF_VALUE)}
          />
          <LabeledInput
            label={t("PreRecAmtBase")}
            className={"col-xl-2 col-md-3 col-sm-4 col-12 form-group"}
            value={Number(
              patientTableData?.patientDetails?.ReceivedAmount ? patientTableData?.patientDetails?.ReceivedAmount : 0
            ).toFixed(ROUNDOFF_VALUE)}
          />
          <LabeledInput
            label={t("PreTDSAmtBase")}
            className={"col-xl-2 col-md-3 col-sm-4 col-12 form-group"}
            value={Number(
              patientTableData?.patientDetails?.PreTDSAmount ? patientTableData?.patientDetails?.PreTDSAmount : 0
            ).toFixed(ROUNDOFF_VALUE)}
          />
          <LabeledInput
            label={t("PreWriteOffBase")}
            className={"col-xl-2 col-md-3 col-sm-4 col-12 form-group"}
            value={Number(
              patientTableData?.patientDetails?.PreWriteOffAmount ? patientTableData?.patientDetails?.PreWriteOffAmount : 0
            ).toFixed(ROUNDOFF_VALUE)}
          />
          <LabeledInput
            label={t("PreDeductBase")}
            className={"col-xl-2 col-md-3 col-sm-4 col-12 form-group"}
            value={Number(
              patientTableData?.patientDetails?.PrededucationAmt ? patientTableData?.patientDetails?.PrededucationAmt : 0
            ).toFixed(ROUNDOFF_VALUE)}
          />

          <ReactSelect
            className="form-control"
            respclass={"col-xl-2 col-md-3 col-sm-4 col-12"}
            placeholderName={t(
              "Currency"
            )}
            dynamicOptions={dropDownState?.CurrencyDetail}
            removeIsClearable={true}
            value={patientTableData?.patientDetails?.Currency?.value}
            name="Currency"
            id="Currency"
            handleChange={(name, e) =>
              handleReactChange(
                name,
                e,
                handleConversionFactor,
                "currencyFactor"
              )
            }
          />

          <LabeledInput
            label={t("CurrencyFactor")}
            className={"col-xl-2 col-md-3 col-sm-4 col-12"}
            value={Number(
              patientTableData?.patientDetails?.currencyFactor
            ).toFixed(ROUNDOFF_VALUE)}
          />

          <Input
            type="text"
            className="form-control required-fields"
            respclass={"col-xl-2 col-md-3 col-sm-4 col-12"}
            lable={t("RecAmtSpecific")}
            placeholder=""
            id="CurrentReceiveAMt"
            name="CurrentReceiveAMt"
            value={patientTableData?.patientDetails?.CurrentReceiveAMt}
            onChange={(e) =>
              handleChange(
                e,
                AMOUNT_REGX(8).test(e?.target.value),
                "ReceiveAmtSpecific",
                "ReceiveAmt"
              )
            }
          />

          <Input
            type="text"
            className="form-control"
            respclass={"col-xl-2 col-md-3 col-sm-4 col-12"}
            lable={t("TDSAmtSpecific")}
            placeholder=""
            id="CurrentTDSAmt"
            name="CurrentTDSAmt"
            value={patientTableData?.patientDetails?.CurrentTDSAmt}
            onChange={(e) =>
              handleChange(e, AMOUNT_REGX(8).test(e?.target.value))
            }
          />

          <Input
            type="text"
            className="form-control"
            respclass={"col-xl-2 col-md-3 col-sm-4 col-12"}
            lable={t(
              "WriteOffSpecific"
            )}
            placeholder=""
            id="CurrentWriteOffAmt"
            name="CurrentWriteOffAmt"
            value={patientTableData?.patientDetails?.CurrentWriteOffAmt}
            onChange={(e) =>
              handleChange(e, AMOUNT_REGX(8).test(e?.target.value))
            }
          />

          <Input
            type="text"
            className="form-control"
            respclass={"col-xl-2 col-md-3 col-sm-4 col-12"}
            lable={t(
              "DeductionSpecific"
            )}
            placeholder=""
            id="CurrentDeductionAmt"
            name="CurrentDeductionAmt"
            value={patientTableData?.patientDetails?.CurrentDeductionAmt}
            onChange={(e) =>
              handleChange(e, AMOUNT_REGX(8).test(e?.target.value))
            }
          />

          <ReactSelect
            className="form-control"
            respclass={"col-xl-2 col-md-3 col-sm-4 col-12"}
            placeholderName={t(
              "PaymentMode"
            )}
            dynamicOptions={dropDownState?.PaymentMode}
            removeIsClearable={true}
            id="PaymentMode"
            name="PaymentMode"
            value={patientTableData?.patientDetails?.PaymentMode?.value}
            handleChange={handleReactChange}
          />

          <ReactSelect
            respclass={"col-xl-2 col-md-3 col-sm-4 col-12"}
            requiredClassName={`${patientTableData?.patientDetails?.PaymentMode?.PaymentMode !=="Cash"?"required-fields":""}`}

            id={"bankName"}
            placeholderName={t("Bank")}
            dynamicOptions={dropDownState?.BankMaster}
            name="bankName"
            value={patientTableData?.patientDetails?.bankName?.value}
            handleChange={handleReactChange}
            isDisabled={patientTableData?.patientDetails?.PaymentMode?.PaymentMode === "Cash"}
          />
          <Input
            type="text"
            className="form-control required-fields"
            id={"refNo"}
            respclass={"col-xl-2 col-md-3 col-sm-4 col-12"}
            lable={t("RefNo")}
            placeholder=""
            name="refNo"
            value={patientTableData?.patientDetails?.refNo}
            onChange={handleChange}
            disabled={patientTableData?.patientDetails?.PaymentMode?.PaymentMode === "Cash"}
          />


          <DatePicker
            className="custom-calendar"
            id="date"
            placeholder={VITE_DATE_FORMAT}
            lable={t("Date")}
            showTime
            hourFormat="12"
            respclass={"col-xl-2 col-md-3 col-sm-4 col-12"}
            value={patientTableData?.patientDetails?.date}
            name="date"
            handleChange={handleChange}
          />

          <ReactSelect
            className="form-control"
            respclass={"col-xl-2 col-md-3 col-sm-4 col-12"}
            placeholderName={t(
              "Machine"
            )}
            dynamicOptions={dropDownState?.SwipMachine}
            isDisabled={patientTableData?.patientDetails?.PaymentMode?.PaymentMode !== "Card"}
          />

          <div className="col-xl-2 col-md-3 col-sm-4 col-12">
            <div className="row">
              <LabeledInput
                label={t(
                  "BalanceSpecific"
                )}
                className={"col-6 from-group text-right"}
                value={patientTableData?.patientDetails?.BalanceSpecific ? patientTableData?.patientDetails?.BalanceSpecific : 0}
              />

              <LabeledInput
                label={t("BalanceBase")}
                className={"col-6 from-group text-right"}
                value={patientTableData?.patientDetails?.BalanceBase ? patientTableData?.patientDetails?.BalanceBase : 0}
              />
            </div>
          </div>

          <div className="col-12">
            <div
              className="d-flex flex-wrap justify-content-around p-1"
              style={{ backgroundColor: "#fffb7d" }}
            >
              <label className="m-0">Mis-Match Bills Vs Total:</label>
              {handleTotalCurrentAmt(patientTableData?.patientDetails)}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-2 patient_registration card">
        <div className="row p-1">
          <div className="col-12 mb-2">
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center justify-content-between">
                <ColorCodingSearch
                  label={"Partially Settlement"}
                  color={COLOR_STATUS[0]}
                />
                <ColorCodingSearch
                  label={"Fully Settlement"}
                  color={COLOR_STATUS[1]}
                />
                <ColorCodingSearch
                  label={"Wrong Settlement"}
                  color={COLOR_STATUS[2]}
                />
                <ColorCodingSearch
                  label={"No Settlement"}
                  color={COLOR_STATUS[3]}
                />
              </div>

              <div>
                <button className="btn btn-sm btn-primary" onClick={handleSaveInvoiceSettlement}>Save</button>
              </div>
            </div>
          </div>
          <div className="col-12">
            <Tables
              thead={WrapTranslate(THEAD_SECOND)}
              tbody={handlePatientInvoiceData(
                patientTableData?.patientInvoiceData
              )}
            // tbody={[]}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default InvoiceSettlementPayment;
