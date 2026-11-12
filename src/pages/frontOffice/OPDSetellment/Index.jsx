import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ReactSelect from "@app/components/formComponent/ReactSelect";
import Input from "@app/components/formComponent/Input";
import { Tabfunctionality } from "../../../utils/helpers";
import DatePicker from "../../../components/formComponent/DatePicker";
import Heading from "../../../components/UI/Heading";
import Tables from "../../../components/UI/customTable";
import LabeledInput from "../../../components/formComponent/LabeledInput";
import PaymentGateway from "../../../components/front-office/PaymentGateway";
import {
  calculateBillAmount,
  filterByTypes,
  notify,
  opdSettlementPaymentObj,
  payloadDiscountOPD,
  payloadSettlerForPaymentGateWay,
  PAYMENT_MODE_FLAG_ISREFUND,
} from "../../../utils/utils";
import {
  OPD_SETTLEMENT_DETAILS,
  PAYMENT_OBJECT,
} from "../../../utils/constant";
import { useFormik } from "formik";
import i18n from "@app/utils/i18n";
import { useDispatch, useSelector } from "react-redux";
import {
  CentreWiseCacheByCenterID,
  CentreWisePanelControlCache,
} from "../../../store/reducers/common/CommonExportFunction";
import { useLocalStorage } from "../../../utils/hooks/useLocalStorage";
import {
  bindHashCode,
  SaveOPDSettlement,
  SearchOPDBillsData,
} from "../../../networkServices/opdserviceAPI";
import OPDSettlementTable from "../../../components/UI/customTable/ConfirmationTable/OPDSettlementTable";
import moment from "moment";
import { OpenPDFURL, RedirectURL } from "../../../networkServices/PDFURL";
import { use } from "react";
import { CommonReceiptPdf } from "../../../networkServices/BillingsApi";
export default function Index() {
  const { VITE_DATE_FORMAT } = import.meta.env;
  const [t] = useTranslation();
  const dispatch = useDispatch();
  const [selectedItems, setSelectedItems] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState([]);
  const localdata = useLocalStorage("userData", "get");
  const [paymentControlModeState, setPaymentControlModeState] =
    useState(PAYMENT_OBJECT);
  const {
    CentreWiseCache,
    CentreWisePanelControlCacheList,
    GetEmployeeWiseCenter,
  } = useSelector((state) => state.CommonSlice);

  const SearchOPDBillsCallAPI = async () => {
    debugger
    const newValues = {
      ...values,
      mrNo: values?.mrNo,
      panelID: values?.panelID?.value ? values?.panelID?.value : "",
      fromDate: moment(values?.fromDate).format("DD-MMM-YYYY"),
      toDate: moment(values?.toDate).format("DD-MMM-YYYY"),
      centreId: values?.centreId? values?.centreId: values?.centreId?.value,
      billNo: values?.billNo,
      isPharmacy:0
    };

    try {
      if (newValues?.centreId) {
        const dataRes = await SearchOPDBillsData(newValues);
        if (dataRes.data.length === 0) {
          notify("No Records Found", "error");
        } else {
          // setSelectedItems(false);
          setBodyData((prevState) => ({
            ...prevState,
            SearchOPDBillsData: dataRes.data,
          }));
          // resetForm();
        }
      } else {
        notify("Please select Centre", "error");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const [bodyData, setBodyData] = useState({ SearchOPDBillsData: [] });
  const { handleChange, values, setFieldValue, handleSubmit, setValues } =
    useFormik({
      initialValues: OPD_SETTLEMENT_DETAILS,
      onSubmit: async (values, { resetForm }) => {
        SearchOPDBillsCallAPI();
        setPaymentControlModeState(PAYMENT_OBJECT);
        // resetForm();
        setPaymentMethod([]);
        setSelectedItems(false);
      },
    });

  const handleReactSelect = (name, value) => {
    setFieldValue(name, value);
  };

  useEffect(() => {
    setFieldValue("centreId", localdata?.defaultCentre);
  },[])
  useEffect(() => {
    if (CentreWiseCache?.length === 0) {
      dispatch(
        CentreWiseCacheByCenterID({
          centreID: localdata?.defaultCentre,
        })
      );
    }
    if (CentreWisePanelControlCacheList?.length === 0) {
      dispatch(
        CentreWisePanelControlCache({
          centreID: localdata?.defaultCentre,
        })
      );
    }
  }, [dispatch]);

  const THEAD = [
    t("S.No."),
    t("Centre Name"),
    t("Bill Date"),
    t("Bill No."),
    t("Patient Name"),
    t("UHID"),
    t("Bill Amount"),
    t("Paid Amount"),
    t("Pending Amount"),
    t("Transaction Type"),
    t("Type"),
    t("Panel"),
    t("Select"),
  ];

  const handlePaymentControl = (data) => {
    setSelectedItems(data);
    const modifiedData = opdSettlementPaymentObj(data);

    const setPayment = calculateBillAmount(
      [modifiedData],
      true,
      data?.AdvanceAmount,
      modifiedData?.isRefund,
      0,
      0,
      1,
      1
    );

    setPaymentControlModeState(setPayment);
  };

  const handleSubmitOPDSettlement = async () => {
    try {
      debugger;
      const hashcode = await bindHashCode();
      const data = await SaveOPDSettlement({
        dataPaymentDetail: payloadSettlerForPaymentGateWay(paymentMethod),
        ...payloadDiscountOPD({
          ...paymentControlModeState,
          hashcode: hashcode?.data,
          ...selectedItems,
        }),
      });
      // if (data?.success) {
             
      //          const reportResp = await CommonReceiptPdf({
      //                   ledgerTransactionNo: selectedItems?.LedgerTransactionNo ,
      //                   isBill: 1,
      //                   receiptNo: "",
      //                   duplicate: "",
      //                   type: "OPD",
      //                   supplierID: "",
      //                   billNo: "",
      //                   isEMGBilling: "",
      //                   isOnlinePrint: "",
      //                   isRefound: 0,
      //                 });
      //                 if (reportResp?.success) {
      //                   RedirectURL(reportResp?.data?.pdfUrl);
      //                 }
      //               }
      if (Object.keys(data?.data).length > 0) {
        notify(`${data?.message}`, "success");
        setPaymentControlModeState(PAYMENT_OBJECT);
        setBodyData({ SearchOPDBillsData: [] });
        setPaymentMethod([]);
        setSelectedItems(false);
        const reportResp = await CommonReceiptPdf({
          ledgerTransactionNo: data?.data?.ledgerTranNo,
          isBill: 1,
          receiptNo: "",
          duplicate: "",
          type: "OPD",
          supplierID: "",
          billNo: "",
          isEMGBilling: "",
          isOnlinePrint: "",
          isRefound: 0,
        });
        if (reportResp?.success) {
          RedirectURL(reportResp?.data?.pdfUrl);
        } else {
          notify(reportResp?.data?.message, "error");
        }
        // OpenPDFURL(
        //   "OPDAdvanceReceipt",
        //   data?.data?.ledgerTranNo,
        //   "opd",
        //   data?.data?.receipt_No
        // );
      }
    } catch (error) {
      console.log(error, "Error");
    }
  };

  return (
    <>
      <form className="card patient_registration border">
        <Heading
          title={t("OPDSettlement")}
          isBreadcrumb={true}
          secondTitle={
            <div className="d-flex">
              <div className="EmergencyBills"></div>
              <span className="text-dark ml-2 mt-1 ">{t("Emergency Bills")}</span>
            </div>
          }
        />
        <div className="row p-2">
          <div className="col-12">
            <div className="row">
              <ReactSelect
                placeholderName={t("Centre")}
                dynamicOptions={GetEmployeeWiseCenter?.map((ele) => {
                  return { label: ele.CentreName, value: ele.CentreID };
                })}
                searchable={true}
                removeIsClearable={true}
                name="centreId"
                value={values?.centreId}
                respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                handleChange={handleReactSelect}
                requiredClassName="required-fields"
              />
              <Input
                type="text"
                className="form-control"
                id="Barcode"
                name="mrNo"
                onChange={handleChange}
                value={values?.mrNo}
                lable={t("Barcode/UHID")}
                placeholder=" "
                respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                onKeyDown={Tabfunctionality}
              />
              <Input
                type="text"
                className="form-control"
                id="Bill_No"
                name="billNo"
                onChange={handleChange}
                value={values?.billNo}
                lable={t("Bill_No")}
                placeholder=" "
                respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                onKeyDown={Tabfunctionality}
              />
              <ReactSelect
                placeholderName={i18n.t(
                  "Panel"
                )}
                id="panelID"
                inputId="PanelFocus"
                name="panelID"
                value={`${values?.panelID?.value}`}
                handleChange={handleReactSelect}
                dynamicOptions={filterByTypes(
                  CentreWisePanelControlCacheList,
                  [1],
                  ["TypeID"],
                  "TextField",
                  "ValueField",
                  "ParentID"
                )}
                // requiredClassName={`required-select-fields ${errors?.PanelName && "required-fields-active"}`}
                searchable={true}
                respclass="col-xl-2 col-md-4 col-sm-4 col-12"
              />
              <DatePicker
                className="custom-calendar"
                respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                id="fromDate"
                name="fromDate"
                // value={moment(values?.fromDate).format("DD-MM-YYYY")}
                value={
                  values.fromDate
                    ? moment(values?.fromDate, "DD-MMM-YYYY").toDate()
                    : values?.fromDate
                }
                handleChange={handleChange}
                lable={t("From Date")}
                placeholder={VITE_DATE_FORMAT}
              />
              <DatePicker
                className="custom-calendar"
                respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                id="toDate"
                name="toDate"
                // value={moment(values?.toDate).format("DD-MMm-YYYY")}
                value={
                  values.toDate
                    ? moment(values?.toDate, "DD-MMM-YYYY").toDate()
                    : values?.toDate
                }
                handleChange={handleChange}
                lable={t("To Date")}
                placeholder={VITE_DATE_FORMAT}
              />
            </div>
            <div className="row">
              {/* <div
                className="col-sm-2 d-flex align-items-center ,"
                style={{ gap: "10px" }}
              >
                <div className="statusCanceled"></div>
                <label className="text-dark m-0">
                  {t("EmergencyBills")}
                </label>
              </div> */}
              <div className="col-sm-12 d-flex justify-content-end">
                <button
                  className="btn btn-sm btn-primary"
                  onClick={handleSubmit}
                  type="button"
                >
                  {t("Search")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>

      <>
        {selectedItems.PatientID ? (
          <>
            <div className="card patient_registration border p-2">
              <div className="row">
                <div className="col-xl-2 col-md-4 col-sm-6 col-12 my-1">
                  <LabeledInput
                    label={t("Centre")}
                    value={selectedItems.CentreName}
                  />
                </div>
                <div className="col-xl-2 col-md-4 col-sm-6 col-12 my-1">
                  <LabeledInput
                    label={t("UHID")}
                    value={selectedItems?.PatientID}
                  />
                </div>
                <div className="col-xl-2 col-md-4 col-sm-6 col-12 my-1">
                  <LabeledInput
                    label={t("PatientName")}
                    value={selectedItems.PatientName}
                  />
                </div>
                <div className="col-xl-2 col-md-4 col-sm-6 col-12 my-1">
                  <LabeledInput
                    label={t("Panel")}
                    value={selectedItems.CompanyName}
                  />
                </div>
                <div className="col-xl-2 col-md-4 col-sm-6 col-12 mt-2">
                  <LabeledInput
                    label={t("Bill No")}
                    value={selectedItems.BillNo}
                  />
                </div>
                <div className="col-xl-2 col-md-4 col-sm-6 col-12 my-1">
                  <LabeledInput
                    label={t("BillDate")}
                    value={selectedItems.BillDate}
                  />
                </div>
                <div className="col-xl-2 col-md-4 col-sm-6 col-12 mt-2">
                  <LabeledInput
                    label={t("BillAmount")}
                    value={selectedItems.Amount}
                  />
                </div>
                <div className="col-xl-2 col-md-4 col-sm-6 col-12 mt-2">
                  <LabeledInput
                    label={"Paid Amount"}
                    value={selectedItems.PaidAmt}
                  />
                </div>

                <div className="col-xl-2 col-md-4 col-sm-6 col-12 mt-2">
                  <LabeledInput
                    label={t("Pending Amount")}
                    value={selectedItems.PendingAmt}
                  />
                </div>
                <div className="col-xl-2 col-md-4 col-sm-6 col-12 mt-2">
                  <LabeledInput
                    label={t("Payment Type")}
                    value={selectedItems.SettlementType}
                  />
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="card patient_registration_card my-1 mt-2">
              <OPDSettlementTable
                THEAD={THEAD}
                tbody={bodyData?.SearchOPDBillsData}
                setSelectedItems={setSelectedItems}
                setBodyData={setBodyData}
                handlePaymentControl={handlePaymentControl}
                // handleSelectClick={handleSelectClick}
              />
            </div>
          </>
        )}
      </>

      <PaymentGateway
        screenType={paymentControlModeState}
        setScreenType={setPaymentControlModeState}
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
        button={
          <button className="button" onClick={handleSubmitOPDSettlement}>
            {paymentControlModeState?.refund ===
            PAYMENT_MODE_FLAG_ISREFUND["refund"]
              ? t("Refund")
              : t("Settlement")}
          </button>
        }
      />
    </>
  );
}
