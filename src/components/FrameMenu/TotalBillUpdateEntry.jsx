import React from "react";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { getPatientIndentApprovalApi } from "../../networkServices/DietApi";
import { Checkbox } from "primereact/checkbox";
import { notify } from "../../utils/ustil2";
import Heading from "../UI/Heading";
import DatePicker from "../formComponent/DatePicker";
import ColorCodingSearch from "../commonComponents/ColorCodingSearch";
import Input from "../formComponent/Input";
import TextAreaInput from "../formComponent/TextAreaInput";
import Tables from "../UI/customTable";

export default function TotalBillUpdateEntry() {
  const [tbodyData, setTbodyData] = React.useState([]);
  const { t } = useTranslation();
  const { VITE_DATE_FORMAT } = import.meta.env;

  const getRowClass = (val) => {
    let newtbody = tbodyData?.find((item) => item?.Id === val?.idNo);
    if (newtbody?.STATUS === 4) {
      return "color-indicator-11-bg";
    } else if (newtbody?.STATUS == 2) {
      return "color-indicator-21-bg";
    } else {
      return "";
    }
  };

  const THEAD = [
    { name: t("S.No"), width: "1%" },
    { name: t(""), width: "5%" },
    { name: t("CR No"), width: "5%" },
    { name: t("IPD No"), width: "15%" },
    { name: t("Claim ID"), width: "10%" },
    { name: t("Patient Name"), width: "10%" },
    { name: t("Ledger Tnx No"), width: "10%" },
    { name: t("Bill No"), width: "10%" },
    { name: t("Bill Date"), width: "10%" },
    { name: t("Close Date"), width: "10%" },
    { name: t("Bill Type"), width: "10%" },
    { name: t("Ref.No"), width: "15%" },
    { name: t("Panel"), width: "10%" },
    { name: t("Amount"), width: "10%" },
    { name: t("Remarks"), width: "10%" },
  ];
  const [values, setValues] = React.useState({
    Reg_no: "",
    remarks: "",
    fromDate: new Date(),
    toDate: new Date(),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleGetPatientBillList = async () => {
    const payload = {
      patientId: values?.Reg_no || 0,
      status: values?.status?.value || 0,
      fromDate: values?.fromDate
        ? moment(values?.fromDate).format("YYYY-MM-DD")
        : "",
      toDate: values?.toDate ? moment(values?.toDate).format("YYYY-MM-DD") : "",
    };
    try {
      const response = await getPatientIndentApprovalApi(payload);
      if (response?.success) {
        setTbodyData(response?.data);
      } else {
        notify(
          response?.message ? response?.message : "Something went wrong!",
          "error"
        );
      }
    } catch (error) {
      notify(error?.message, "error");
    }
  };

  return (
    <div>
      <Heading title={""} isBreadcrumb={true} />

      <div className="card ">
        <div className="row p-2">
          <Input
            type="text"
            className="form-control"
            lable={t("Registration No")}
            placeholder=" "
            id="Reg_no"
            name="Reg_no"
            onChange={handleChange}
            value={values?.Reg_no || ""}
            required={true}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          />

          <DatePicker
            className="custom-calendar"
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            id="fromDate"
            name="fromDate"
            value={
              values.fromDate
                ? moment(values?.fromDate, "YYYY-MM-DD").toDate()
                : null
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
            value={
              values.toDate
                ? moment(values?.toDate, "YYYY-MM-DD").toDate()
                : null
            }
            handleChange={handleChange}
            lable={t("To Date")}
            placeholder={VITE_DATE_FORMAT}
          />
          <TextAreaInput
            className="form-control"
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            lable="Remarks"
            name="remarks"
            rows={3}
            value={values?.remarks}
            maxLength={500}
            onChange={handleChange}
          />

          <button
            className="btn btn-primary ml-2"
            type="button"
            onClick={handleGetPatientBillList}
          >
            {t("Search")}
          </button>
        </div>
      </div>

      {tbodyData?.length > 0 && (
        <div className="d-flex justify-content-end align-items-center m-2">
          <ColorCodingSearch color={""} label={t("White For Pending")} />
          <ColorCodingSearch
            color={"color-indicator-4-bg"}
            label={t("Yellow For Complete")}
          />
          <ColorCodingSearch
            color={"color-indicator-21-bg"}
            label={t("Rejected Pink")}
          />
        </div>
      )}

      {tbodyData?.length > 0 && (
        <Tables
          thead={THEAD}
          tbody={tbodyData?.map((item, index) => ({
            sno: index + 1,
            checkbox: (
              <Checkbox
                key={index}
                type="checkbox"
                checked={item.IsUploaded}
                // onChange={() => handlePersonalToggle(index)}
              />
            ),
            crNo: item?.crNo || "-",
            IpdNo: item?.IpdNo || "-",
            claimID: item?.claimID || "-",
            patientName: item?.PatientName || "-",
            LedgerTxn: item?.LedgerTxn || "-",
            billNo: item?.BillNo || "-",
            billDate: item?.BillDate
              ? moment(item?.BillDate).format("DD/MM/YYYY hh:mm A")
              : "-",
            close: item?.CloseDate
              ? moment(item?.CloseDate).format("DD/MM/YYYY hh:mm A")
              : "-",
            billType: item?.BillType || "-",
            refNo: item?.RefNo || "-",
            panel: item?.Panel || "-",
            amount: item?.amount || "-",
            remarks: item?.remarks || "-",
          }))}
          getRowClass={getRowClass}
          tableHeight={"scrollView"}
          // style={!isMobile ? { height: "44vh" } : {}}
        />
      )}
    </div>
  );
}
