import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  BindReportControlsAPI,
  GetBankReconciliationReport,
  GetStatementReport,
} from "../../../networkServices/finance";
import { useSelector } from "react-redux";
import Heading from "../../../components/UI/Heading";
import MultiSelectComp from "../../../components/formComponent/MultiSelectComp";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import {
  filterByTypes,
  handleReactSelectDropDownOptions,
  notify,
} from "../../../utils/utils";
import DatePicker from "../../../components/formComponent/DatePicker";
import moment from "moment";
import Tables from "../../../components/UI/customTable";
import PayableTablePDF from "./PayableTablePDF";
import { ExcelIconSVG, PDFIconSVG } from "../../../components/SvgIcons";
import { exportHtmlToPDFNoPrint, exportToExcel } from "../../../utils/exportLibrary";
import { transformDataInTranslate } from "../../../components/WrapTranslate";

const BankReconciliationReport = () => {
  const [t] = useTranslation();
  const [payloadData, setPayloadData] = useState({
    IsOnlyUnpaid: 0,
    IsOnlyPaid: 0,
  });
  const [bankAc, setBankAc] = useState([]);
  const [reportControlList, setReportControlList] = useState([]);
  const { GetEmployeeWiseCenter } = useSelector((state) => state.CommonSlice);
  const { VITE_DATE_FORMAT } = import.meta.env;
  const [tableData, setTableData] = useState([]);

  const getBindReportControls = async () => {
    let apiResp = await BindReportControlsAPI();
    if (apiResp?.success) {
      setReportControlList(apiResp?.data);
      console.log("the apiresponse is", apiResp?.data);
      const bankdata = apiResp?.data?.filter((val) => {
        return val?.TypeID == 4 && val?.GroupCode == "1002004";
      });
      setBankAc(bankdata);
      console.log("the bank data in state is", bankdata);
    } else {
      setReportControlList([]);
    }
  };
  useEffect(() => {
    getBindReportControls();
  }, []);
  const handleMultiSelectChange = (name, selectedOptions) => {
    setPayloadData({
      ...payloadData,
      [name]: selectedOptions,
    });
  };
  const handleChange = (e) => {
    setPayloadData((val) => ({ ...val, [e.target.name]: e.target.value }));
  };
  console.log(payloadData);

  const handleSearchBankReconciliation = async () => {
    const payload = {
      centreID: payloadData?.BranchCentre[0].code,
      coaID: payloadData?.bankAc?.value,
      asOnDate: moment(payloadData?.AsAt).format("DD-MMM-YYYY") || "",
    };
    if (!payload.centreID) {
      notify("plese fill the required fields", "error");
      return;
    }

    try {
      const apiResp = await GetBankReconciliationReport(payload);
      if (apiResp.success) {
        console.log("the apiresposne data is", apiResp);
        setTableData(apiResp?.data);
        notify(`${apiResp?.data?.length} data found`, "success");
      } else {
        notify("No records found", "error");
      }
    } catch (error) {
      console.error("Error while fetching data:", error);
      notify("An error occurred while fetching data", "error");
    }
  };


  const handleExportExcel = async (tableData) => {
    
            // let apiResp = await GetBankChargesUploadExcel();
            if (tableData) {
                exportToExcel(transformDataInTranslate(tableData, t), "Purchase Bill Due");
            } else {
                notify("no Data Found", "error");
            }
        };

        const handleExportPDF = () => {
          exportHtmlToPDFNoPrint("printSection", "Bank Reconciliation Report");
        };
  
  const thead = [
    { width: "5%", name: t("Date") },
    { width: "2%", name: t("Voucher No") },
    { width: "2%", name: t("Description") },
    { width: "2%", name: t("Ref No") },
    { width: "2%", name: t("INR") },
  ];

  return (
    <>
      <div className="mt-2 spatient_registration_card">
        <div className="patient_registration card">
          {/* <Heading isBreadcrumb={true} /> */}
          <div className="row p-2">
            <MultiSelectComp
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              name="BranchCentre"
              id="BranchCentre"
              placeholderName={t("Branch Centre")}
              // dynamicOptions={[]}
              dynamicOptions={GetEmployeeWiseCenter?.map((ele) => ({
                code: ele?.CentreID,
                name: ele?.CentreName,
              }))}
              handleChange={handleMultiSelectChange}
              value={payloadData?.BranchCentre}
              requiredClassName={`required-fields`}
            />

            <ReactSelect
              placeholderName={t("Bank A/C")}
              id="bankAc"
              name="bankAc"
              value={payloadData?.bankAc?.value}
              requiredClassName={`required-fields`}
              removeIsClearable={true}
              handleChange={(name, value) =>
                setPayloadData((val) => ({ ...val, [name]: value }))
              }
              dynamicOptions={[
                ...handleReactSelectDropDownOptions(
                  bankAc,
                  "TextField",
                  "ValueField"
                ),
              ]}
              searchable={true}
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            />

            <DatePicker
              className="custom-calendar"
              placeholder={VITE_DATE_FORMAT}
              lable={t("As At")}
              respclass={"col-xl-2 col-md-4 col-sm-6 col-12"}
              name="AsAt"
              id="AsAt"
              maxDate={new Date()}
              value={
                payloadData?.AsAt
                  ? moment(payloadData.AsAt).toDate()
                  : new Date()
              }
              showTime
              hourFormat="12"
              handleChange={(date) => handleChange(date, "AsAt")}
            />

            <div className="col-xl-1 col-md-1 col-sm-2 col-4  mb-2">
              <button
                className="btn btn-sm btn-primary  w-100   "
                onClick={handleSearchBankReconciliation}
                type="button"
              >
                {t("Search")}
              </button>
            </div>
          </div>
        </div>

        {tableData.length > 0 && (
          <div id="printSection" >
            <Heading
              title={payloadData.BranchCentre[0].name}
              secondTitle={
                <>
                 <span onClick={handleExportPDF} className="no-print">
                      <PDFIconSVG />
                    </span>
                  <span  className="no-print" onClick={() => handleExportExcel(tableData)}>
                    <ExcelIconSVG />{" "}
                  </span>
                </>
              }
            />
            
            <div className="card">
              <Tables
                thead={thead}
                tbody={tableData?.map((val) => ({ 
                  Date: val?.VoucherDate || "",
                  VoucherNo: val.VoucherNo || "",
                  Description: val.Remarks || "",
                  RefNo: val?.RefNo,
                  INR: Number(val?.Amount),
                }))}
                tableHeight={"scrollView"}
                style={{ height: "60vh", padding: "2px" }}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default BankReconciliationReport;
