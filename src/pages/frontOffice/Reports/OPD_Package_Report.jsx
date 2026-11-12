import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ReactSelect from "@app/components/formComponent/ReactSelect";
import DatePicker from "../../../components/formComponent/DatePicker";
import Heading from "../../../components/UI/Heading";
import { useDispatch, useSelector } from "react-redux";
import {
  CentreWiseCacheByCenterID,
  CentreWisePanelControlCache,
} from "../../../store/reducers/common/CommonExportFunction";
import { useLocalStorage } from "../../../utils/hooks/useLocalStorage";
import moment from "moment";
import {RedirectURL } from "../../../networkServices/PDFURL";
import { notify } from "../../../utils/ustil2";
import { BillFinalReport, OPDGetPackageReport, OPDGetPanelReport, OPDOpenandClosePackage, OPDPackageReport, OPDPackageSummaryReport, PackageDetail_report } from "../../../networkServices/edpApi";
import Input from "../../../components/formComponent/Input";
import Tables from "../../../components/UI/customTable";
import { handleReactSelectDropDownOptions } from "../../../utils/utils";
import View_Opd_package_report from "./View_Opd_package_report";
import Modal from "../../../components/modalComponent/Modal";
import { CommonReceiptPdf } from "../../../networkServices/BillingsApi";
export default function OPD_Package_Report() {
  const { VITE_DATE_FORMAT } = import.meta.env;
  const [t] = useTranslation();
  const dispatch = useDispatch();
  const localdata = useLocalStorage("userData", "get");
  const [data, setData] = useState([])
  const {
    CentreWiseCache,
    CentreWisePanelControlCacheList,
  } = useSelector((state) => state.CommonSlice);
  const [modalData, setModalData] = useState({ visible: false })
  const [values, setValues] = useState({
    PackageStatus: { label: "Open", value: "0" },
    Panel: {},
    type: { label: "Opd Package", value: "1" },
    registration: "",
    fromDate: new Date(),
    toDate: new Date(),
  })
  const [dropDownState, setDropDownState] = useState({
    GetPanel: [],
  })

  const handleReactSelect = (name, value) => {
    console.log("value", value)
    if (name === "PackageStatus") {
      handleSearch(value)
    }
    setValues((val) => ({ ...val, [name]: value }))

  };

  const handleChange = (e) => {
    const { name, value } = e.target
    setValues((preV) => ({
      ...preV,
      [name]: value
    }))
  }

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
    t("PatientID"),
    t("Patient Name"),
    t("Address"),
    t("BillNo"),
    t("Date"),
    t("Transcation Type"),
    t("Amount"),
    t("Status"),
    t(`${values?.PackageStatus?.value == "1" ? "Close" : "Open"}`),
    t("Summary"),
    t("ESI OPD Bill"),
    t("Bill Print"),
  ];

  const handleSearch = async (value) => {
    const payload =
    {
      "fromDate": moment(values?.fromDate).format("YYYY-MM-DD"),
      "toDate": moment(values?.toDate).format("YYYY-MM-DD"),
      "pakageType": Number(value?.value ? value?.value : values?.PackageStatus?.value),
      "panelID": String(values?.Panel?.value || ""),
      "patientID": String(values?.registration || ""),
      "type": Number(values?.type?.value || 0),
    }

    try {
      const response = await OPDGetPackageReport(payload)
      if (response?.success) {
        // exportToExcel(response?.data, "Exel");
        setData(response?.data)
      }
      else {
        setData([])
        notify(response?.message, "error")
      }
    } catch (error) {
      console.log("error", error)
    }
  }
  const handlePrint = async (value) => {
    const payload =
    {
      "fromDate": moment(values?.fromDate).format("YYYY-MM-DD"),
      "toDate": moment(values?.toDate).format("YYYY-MM-DD"),
      "pakageType": Number(value?.value ? value?.value : values?.PackageStatus?.value),
      "panelID": String(values?.Panel?.value || ""),
      "patientID": String(values?.registration || ""),
      "type": Number(values?.type?.value || 0),
    }

    try {
      const response = await OPDPackageReport(payload)
      if (response?.success) {
        // exportToExcel(response?.data, "Exel");
        // setData(response?.data)
         RedirectURL(response?.data?.pdfUrl);
      }
      else {
        setData([])
        notify(response?.message, "error")
      }
    } catch (error) {
      console.log("error", error)
    }
  }
  const OpenandClosePackage = async (val) => {
    const payload =
    {
      "isBillClosed": Number(val?.IsBillClosed === "0" ? "1" : "0"),
      "transactionID": Number(val?.TransactionID)
    }


    try {
      const response = await OPDOpenandClosePackage(payload)
      if (response?.success) {
        // exportToExcel(response?.data, "Exel");
        notify(response?.message, "success")
        setData(response?.data)
        handleSearch()
      }
      else {
        notify(response?.message, "error")
      }
    } catch (error) {
      console.log("error", error)
    }
  }

  const getPackageDetail = async (val) => {

const payload={
    "ledgerTransactionNo": Number(val?.LedgerTransactionNo)
}
    try {
      const response = await OPDPackageSummaryReport(payload)
      if (response?.success) {
           RedirectURL(response?.data?.pdfUrl);
        // handleClickView(response?.data)
        // exportToExcel(response?.data, "Exel");
        // notify(response?.message, "success")
        // setData(response?.data)
        // handleSearch()
      }
      else {
        notify(response?.message, "error")
      }
    } catch (error) {
      console.log("error", error)
    }
  }
  const BillFinalReports = async (val) => {
    const payload = {
      tid: val?.TransactionID
    }

    try {
      const response = await BillFinalReport(payload)
      if (response?.success) {
        RedirectURL(response?.data);

        notify(response?.message, "success")

      }
      else {
        notify(response?.message, "error")
      }
    } catch (error) {
      console.log("error", error)
    }
  }
  const CommonReceiptPdfPrint = async (val) => {
    const payload = {
      billNo: "",
      duplicate: 0,
      isBill: 0,
      isEMGBilling: "",
      isOnlinePrint: "",
      isRefound: 0,
      ledgerTransactionNo: val?.LedgerTransactionNo,
      receiptNo: "",
      supplierID: "",
      type: val?.TYPE
    }

    try {
      const response = await CommonReceiptPdf(payload)
      if (response?.success) {
        RedirectURL(response?.data?.pdfUrl);

        notify(response?.message, "success")

      }
      else {
        notify(response?.message, "error")
      }
    } catch (error) {
      console.log("error", error)
    }
  }

  const OPDGetPanel = async (item) => {


    try {
      const response = await OPDGetPanelReport();
      // notify(response?.message, response?.success ? "success" : "error");
      if (response?.success) {

        setDropDownState((prevState) => ({
          ...prevState,
          GetPanel: handleReactSelectDropDownOptions(
            response.data,
            "PanelName",
            "PanelID"
          ),
        }));

      }
      else {
        notify(response?.message, "error");
      }
    } catch (error) {
      // console.log("Error updating invoice:", error);
      notify("Failed to update invoice.", "error");
    }
  };
  useEffect(() => {
    OPDGetPanel()
  }, [])
  const handleClickView = (details) => {

    setModalData({
      visible: true,
      width: "50vw",
      Heading: "60vh",
      label: t("Package Details"),
      footer: <></>,
      Component: <View_Opd_package_report details={details} setModalData={setModalData} />,

    })

  }
  return (
    <>
      {modalData?.visible && (
        <Modal
          visible={modalData?.visible}
          setVisible={() => { setModalData({ visible: false }) }}
          modalData={modalData?.URL}
          modalWidth={modalData?.width}
          Header={modalData?.label}
          buttonType="button"
          footer={modalData?.footer}
        >
          {modalData?.Component}
        </Modal>
      )}

      <form className="card patient_registration border">
        <Heading
          title={t("Feed Back Report")}
          isBreadcrumb={true}

        />
        <div className="row p-2">
          <div className="col-12">
            <div className="row">

              <DatePicker
                className="custom-calendar"
                respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                id="fromDate"
                name="fromDate"
                value={values?.fromDate}
                // value={values.fromDate? moment(values?.fromDate, "DD-MMM-YYYY").toDate():values?.fromDate}
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
              <ReactSelect
                placeholderName={t("Package Status")}
                dynamicOptions={[
                  { label: "Open", value: "0" },
                  { label: "Close", value: "1" }
                ]}

                searchable={true}
                name="PackageStatus"
                value={values?.PackageStatus?.value}
                respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                handleChange={handleReactSelect}
                requiredClassName="required-fields"
              />
              <ReactSelect
                placeholderName={t("Panel")}
                // dynamicOptions={[
                //   { label: "Opd Package", value: "opdpackage" },
                //   { label: "Other", value: "other" }
                // ]}
                dynamicOptions={dropDownState?.GetPanel}

                searchable={true}
                name="Panel"
                value={values?.Panel?.value}
                respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                handleChange={handleReactSelect}
                requiredClassName="required-fields"
              />
              <ReactSelect
                placeholderName={t("Type")}
                dynamicOptions={[
                  { label: "Opd Package", value: "1" },
                  { label: "Other", value: "0" }
                ]}

                searchable={true}
                name="type"
                value={values?.type?.value}
                respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                handleChange={handleReactSelect}
                requiredClassName="required-fields"
              />

              <Input
                type="text"
                className="form-control"
                id="registration"
                name="registration"
                onChange={handleChange}
                value={values?.billNo}
                lable={t("Registration No.")}
                placeholder=" "
                respclass="col-xl-2 col-md-4 col-sm-4 col-12"
              // onKeyDown={Tabfunctionality}
              />


            </div>
            <div className="row d-flex justify-content-end px-2 ">
              <button
                className="btn btn-sm btn-primary mr-2"
                onClick={handleSearch}
                type="button"
              >
                {t("Search")}
              </button>
              <button
                className="btn btn-sm btn-primary"
                onClick={handlePrint}
                type="button"
              >
                {t("Print")}
              </button>
            </div>
          </div>
        </div>
      </form>

      {
        data?.length > 0 &&
        <div className="card patient_registration_card my-1 mt-2">
          <Heading
            title={t("Patient details")}
            isBreadcrumb={false}
          />
          <Tables
            thead={THEAD}
            tbody={data?.map((item, index) => ({
              "#": index + 1,
              PatientID: item?.PatientID,
              PatientName: item?.PatientName,
              Address: item?.Address,
              BillNo: item?.BillNo,
              DATE: item?.DATE,
              TypeOfTnx: item?.TypeOfTnx,
              Amt: item?.Amount,
              IsBillClosed: item?.IsBillClosed==="1"?"Close":"Open",
              isclose: (
                <>
                  <i
                    className="fa fa-check-circle"
                    aria-hidden="true"
                    onClick={() => OpenandClosePackage(item)}
                  ></i>
                </>
              ),
              Summary: (
                <>
                  <i
                    className="fa fa-print"
                    aria-hidden="true"
                    onClick={() => getPackageDetail(item)}
                  ></i>
                </>
              ),
              esi: (
                <>
                  <i
                    className="fa fa-print"
                    aria-hidden="true"
                    onClick={() => BillFinalReports(item)}
                  ></i>
                </>
              ),
              common: (
                <>
                  <i
                    className="fa fa-print"
                    aria-hidden="true"
                    onClick={() => CommonReceiptPdfPrint(item)}
                  ></i>
                </>
              ),
              // esi: item?.esi,

            }))}
            tableHeight={"tableHeight"}
          // getRowClass={getRowClass}
          />
        </div>
      }

    </>
  );
}


