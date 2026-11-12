import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next';
import { BindReportControlsAPI, PurchaseBillDueReport } from '../../../networkServices/finance';
import { useSelector } from 'react-redux';
import Heading from '../../../components/UI/Heading';
import MultiSelectComp from '../../../components/formComponent/MultiSelectComp';
import ReactSelect from '../../../components/formComponent/ReactSelect';
import { filterByTypes, notify } from '../../../utils/utils';
import DatePicker from '../../../components/formComponent/DatePicker';
import moment from 'moment';
import TreeViewTable from '../../../components/UI/customTable/TreeViewTable';
import Tables from '../../../components/UI/customTable';
import { ExcelIconSVG, PDFIconSVG } from '../../../components/SvgIcons';
import { transformDataInTranslate } from '../../../components/WrapTranslate';
import PayableTablePDF from './PayableTablePDF';
import { exportHtmlToPDFNoPrint, exportToExcel } from '../../../utils/exportLibrary';
import { useLocalStorage } from '../../../utils/hooks/useLocalStorage';

const PurchaseBillDue = () => {
    const userData = useLocalStorage("userData", "get")

    const [t] = useTranslation()
    const [payloadData, setPayloadData] = useState({
        BranchCentre: [{ code: Number(userData?.defaultCentre ? userData?.defaultCentre : 0), name: userData?.centreName }],

        Currency: { label: "INR", value: "INR" },
        FinancialYear: {
            label: "FY : 01-Apr-2024 - 31-Mar-2025",
            value: "1"
        },
        ChartOfAC: {
            label: "All", value: "0"
        }
    });
    const [reportControlList, setReportControlList] = useState([])
    const { GetEmployeeWiseCenter } = useSelector((state) => state.CommonSlice);
    const { VITE_DATE_FORMAT } = import.meta.env;
    const [tableData, setTableData] = useState([]);

    const getBindReportControls = async () => {
        let apiResp = await BindReportControlsAPI()
        if (apiResp?.success) {
            setReportControlList(apiResp?.data)
        } else {
            setReportControlList([])
        }
    }
    useEffect(() => {
        getBindReportControls()
    }, [])
    const handleMultiSelectChange = (name, selectedOptions) => {
        setPayloadData({
            ...payloadData,
            [name]: selectedOptions,
        });
    };
    const handleChange = (e) => {
        setPayloadData((val) => ({ ...val, [e.target.name]: e.target.value }))
    }
    console.log(payloadData);

    const handleSearch = async () => {
        let missingFields = [];
        if (!payloadData?.ChartOfAC?.value) missingFields.push("Chart Of A/C");
        if (!payloadData?.BranchCentre?.[0]?.code) missingFields.push("Branch Centre");

        if (missingFields.length > 0) {
            notify(`${missingFields[0]} is Required`, "error");
            return;
        }
        let data = {
            acFilterType: 4,
            acFilterValue: payloadData?.ChartOfAC?.value || '',
            CentreID: String(payloadData?.BranchCentre ? payloadData?.BranchCentre[0]?.code : ""),
            CurrencyCode: payloadData?.Currency?.value || "",
            fyid: Number(payloadData?.FinancialYear?.value || 1),
            fyText: payloadData?.FinancialYear?.label || "",
            fromDate: moment(payloadData?.fromDate).format("YYYY-MMM-DD") || "",
            toDate: moment(payloadData?.toDate).format("YYYY-MMM-DD") || "",
            fyStartEndDate: payloadData?.FinancialYear?.label?.split(":")[1]?.split(" - ").map(date => moment(date, "DD-MMM-YYYY").format("YYYY-MM-DD")).join("#"),
            reportType: 1,
            reportName: "Purchase Bill Due Report",

        };

        const apiResp = await PurchaseBillDueReport(data);
        console.log("Initial API Response:", apiResp);

        if (apiResp?.success) {

            setTableData(apiResp.data);
        }
        else {
            setTableData([]);
            notify(apiResp.message, "error")
        }
    };


    const thead = [
        { width: "1%", name: t("S.No") },

        { width: "2%", name: t("COA") },
        { width: "2%", name: t("COA Name") },
        { width: "2%", name: t("Currency") },
        { width: "2%", name: t("Type") },
        { width: "2%", name: t("Inv/Bill No") },
        { width: "2%", name: t("Inv/Bill Date") },
        { width: "2%", name: t("Bill/Inv Amt") },
        { width: "2%", name: t("Paid Amount") },
        { width: "2%", name: t("Pending Amount") },
        { width: "2%", name: t("Ex@Rate") },

    ]
    const handleExportExcel = async (tableData) => {
        console.log(tableData);
        let result = [];

        tableData.forEach((val, index) => {
            result.push({
                "S.No": index + 1,
                "COA": val.COAID,
                COAName: val.AccountName,
                Currency: val.CurrencyCode,
                Type: val.BalanceType,
                "Inv/Bill No": val.BillNo,
                "Inv/Bill Date": val.BillDate,
                "Bill/Inv Amt": val.SpecificAmountDisplay,
                "Paid Amount": val.AdjustmentSpecificAmountDisplay,
                "Pending Amount": val.PendingSpecificAmountDispaly,
                "Ex@Rate": val.CF
            })
        })
        console.log(result);

        // let apiResp = await GetBankChargesUploadExcel();
        if (result) {
            exportToExcel(transformDataInTranslate(result, t), "Purchase Bill Due Report");
        } else {
            notify("no Data Found", "error");
        }
    };

    const handleExportPDF = () => {
        exportHtmlToPDFNoPrint("printSection", "Prurchase Bill Due Report", "1000px", "landscape")
    }

    return (
        <>
            <div className="mt-2 spatient_registration_card">
                <div className="patient_registration card">
                    <Heading isBreadcrumb={true} />
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
                            placeholderName={t("Currency")}
                            id="Currency"
                            name="Currency"
                            requiredClassName={`required-fields`}
                            value={payloadData?.Currency?.value}
                            removeIsClearable={true}
                            handleChange={(name, value) => setPayloadData((val) => ({ ...val, [name]: value }))}
                            dynamicOptions={filterByTypes(
                                reportControlList,
                                [1],
                                ["TypeID"],
                                "TextField",
                                "ValueField",
                            )}
                            searchable={true}
                            respclass="col-xl-1 col-md-4 col-sm-6 col-12"
                        />
                        <ReactSelect
                            placeholderName={t("Financial Year")}
                            id="FinancialYear"
                            name="FinancialYear"
                            requiredClassName={`required-fields`}
                            value={payloadData?.FinancialYear?.value}
                            removeIsClearable={true}
                            handleChange={(name, value) => setPayloadData((val) => ({ ...val, [name]: value }))}
                            dynamicOptions={filterByTypes(
                                reportControlList,
                                [5],
                                ["TypeID"],
                                "TextField",
                                "ValueField",
                            )}
                            searchable={true}
                            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                        />

                        <ReactSelect
                            placeholderName={t("Chart Of Account")}
                            id="ChartOfAC"
                            name="ChartOfAC"
                            requiredClassName={`required-fields`}
                            value={payloadData?.ChartOfAC?.value}
                            removeIsClearable={true}
                            handleChange={(name, value) => setPayloadData((val) => ({ ...val, [name]: value }))}
                            dynamicOptions={[
                                { label: "All", value: "0" },
                                ...filterByTypes(
                                    reportControlList,
                                    [4],
                                    ["TypeID"],
                                    "TextField",
                                    "ValueField",
                                )]}
                            searchable={true}
                            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                        />

                        <DatePicker
                            className="custom-calendar"
                            placeholder={VITE_DATE_FORMAT}
                            lable={t("From Date")}
                            respclass={"col-xl-2 col-md-4 col-sm-6 col-12"}
                            name="fromDate"
                            id="fromDate"
                            maxDate={new Date()}
                            value={payloadData?.fromDate ? moment(payloadData.fromDate).toDate() : new Date}
                            showTime
                            hourFormat="12"
                            handleChange={(date) => handleChange(date, "fromDate")}
                        />
                        <DatePicker
                            className="custom-calendar"
                            placeholder={VITE_DATE_FORMAT}
                            lable={t("To Date")}
                            respclass={"col-xl-2 col-md-4 col-sm-6 col-12"}
                            name="toDate"
                            id="toDate"
                            maxDate={new Date()}
                            value={payloadData?.toDate ? moment(payloadData.toDate).toDate() : new Date}
                            showTime
                            hourFormat="12"
                            handleChange={(date) => handleChange(date, "toDate")}
                        />


                        <div className="col-xl-1 col-md-1 col-sm-2 col-3  mb-2">
                            <button className="btn btn-sm btn-primary  w-100   " onClick={handleSearch} type="button" >
                                {t("Search")}
                            </button>
                        </div>

                    </div>
                    {tableData.length > 0 &&
                        <div id="printSection">
                            <Heading title={payloadData.BranchCentre[0].name}
                                secondTitle={(
                                    <>
                                        <span onClick={handleExportPDF} className='no-print'>
                                            <PDFIconSVG />
                                        </span>
                                        {/* <div className="p-8">
                                            <PayableTablePDF
                                                theadData={thead}
                                                payabletableData={tableData}
                                                filename={"Purchase Bill Due Report"}
                                                heading="Purchase Bill Due Report"
                                            />
                                        </div> */}
                                        <span onClick={() => handleExportExcel(tableData)} className='no-print'>
                                            <ExcelIconSVG />{" "}
                                        </span>
                                    </>
                                )} />
                            <Tables
                                thead={thead}
                                tbody={tableData?.map((val, index) => {
                                    return {
                                        "S.No": index + 1,
                                        COA: val.COAID,
                                        COAName: val.AccountName,
                                        Currency: val.CurrencyCode,
                                        Type: val.BalanceType,
                                        "Inv/Bill No": val.BillNo,
                                        "Inv/Bill Date": val.BillDate,
                                        "Bill/Inv Amt": val.SpecificAmountDisplay,
                                        "Paid Amount": val.AdjustmentSpecificAmountDisplay,
                                        "Pending Amount": val.PendingSpecificAmountDispaly,
                                        "Ex@Rate": val.CF
                                    }
                                })}
                            />

                        </div>
                    }
                </div>
            </div>
        </>
    )
}

export default PurchaseBillDue;