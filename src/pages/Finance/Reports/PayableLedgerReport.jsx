import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next';

import { useSelector } from 'react-redux';
import Heading from '../../../components/UI/Heading';
import MultiSelectComp from '../../../components/formComponent/MultiSelectComp';
import ReactSelect from '../../../components/formComponent/ReactSelect';
import { filterByTypes, notify } from '../../../utils/utils';
import DatePicker from '../../../components/formComponent/DatePicker';
import moment from 'moment';
import { BindReportControlsAPI, GetGLReport } from '../../../networkServices/finance';
import Tables from '../../../components/UI/customTable';
import { transformDataInTranslate } from '../../../components/WrapTranslate';
import { exportHtmlToPDFNoPrint, exportToExcel } from '../../../utils/exportLibrary';
import { ExcelIconSVG } from '../../../components/SvgIcons';
import PayableTablePDF from './PayableTablePDF';
import { AutoComplete } from 'primereact/autocomplete';


const PayableLedgerReport = () => {
    const [t] = useTranslation()
    const [payloadData, setPayloadData] = useState({
        fromDate: new Date(),
        toDate: new Date(),
        Currency: { label: "INR", value: "INR" },
        FinancialYear: {
            label: "FY : 01-Apr-2024 - 31-Mar-2025",
            value: "1"
        },
        TransactionType: {
            label: "All", value: "0"
        },
        VoucherType: {
            label: "All", value: "0"
        },
        BranchCentre: {
            label: "All", value: "0"
        },
        DisplayOpposite: {
            label: "All", value: "0"
        },
        DisplayNarration: {
            label: "No", value: "1"
        }
    });

    const thead = [
        { width: "1%", name: t("S.No") },
        { width: "5%", name: t("Branch Center") },
        { width: "5%", name: t("Voucher Date") },
        { width: "2%", name: t("Voucher type") },
        { width: "2%", name: t("Voucher No.") },
        { width: "2%", name: t("Bill No.") },
        { width: "2%", name: t("Bill Date.") },
        { width: "2%", name: t("Narration") },
        { width: "2%", name: t("Ref No.") },
        { width: "2%", name: t("Ref Date.") },
        { width: "2%", name: t("Debit.") },
        { width: "2%", name: t("Cedit.") },
        { width: "2%", name: t("Running Bal.") },
        { width: "2%", name: t("Type") },
    ]

    const [reportControlList, setReportControlList] = useState([])
    const { GetEmployeeWiseCenter } = useSelector((state) => state.CommonSlice);
    const { VITE_DATE_FORMAT } = import.meta.env;
    const [tbodyData, setTbodyData] = useState([])
    const getBindReportControls = async () => {
        let apiResp = await BindReportControlsAPI()
        if (apiResp?.success) {

            setReportControlList(apiResp?.data)
        } else {
            setReportControlList([])
        }
    }
    console.log(GetEmployeeWiseCenter);


    useEffect(() => {
        getBindReportControls()
    }, [])
    // const handleMultiSelectChange = (name, selectedOptions) => {
    //     setPayloadData({
    //         ...payloadData,
    //         [name]: selectedOptions,
    //     });
    // };
    const handleChange = (e) => {
        setPayloadData((val) => ({ ...val, [e.target.name]: e.target.value }))
    }

    const handleSearch = async () => {
        let missingFields = [];

        if (!payloadData?.ChartOfAC?.value) missingFields.push("Chart Of A/C");
        if (!payloadData?.BranchCentre?.value) missingFields.push("Branch Centre");
        if (!payloadData?.Currency?.value) missingFields.push("Currency");
        if (!payloadData?.FinancialYear?.value) missingFields.push("FinancialYear");
        if (!payloadData?.fromDate) missingFields.push("From Date");
        if (!payloadData?.toDate) missingFields.push("To Date");
        if (!payloadData?.TransactionType?.value) missingFields.push("Transaction Type");
        if (!payloadData?.VoucherType?.value) missingFields.push("Voucher Type");

        if (missingFields.length > 0) {
            notify(`${missingFields[0]} is Required`, "error");
            return;
        }
        let data = {
            ACFilterType: 4,
            ACFilterValue: payloadData?.ChartOfAC?.value || '',
            CentreIDs: String(payloadData.BranchCentre ? payloadData?.BranchCentre?.value : ""),
            CurrencyCode: payloadData?.Currency?.value || "",
            FyID: payloadData?.FinancialYear?.value || 1,
            FYText: payloadData?.FinancialYear?.label || "",
            fromDate: moment(payloadData?.fromDate).format("DD-MMM-YYYY"),
            toDate: moment(payloadData?.toDate).format("DD-MMM-YYYY"),
            fyStartEndDate: payloadData?.FinancialYear?.label?.split(":")[1]?.split(" - ").join("#") || "",
            reportType: 0,
            IsNarration: payloadData?.DisplayNarration?.value || 0,
            IsOppositeAC: payloadData?.DisplayOpposite?.value || 0,
            GroupBy: payloadData?.GroupBy?.value || "",
            ReportName: "Payable Ledger",
            ReportType: 1,
            TransactionType: payloadData?.TransactionType?.value || 0,
            VoucherType: payloadData?.VoucherType?.value || "",
        };

        let apiResp = await GetGLReport(data)
        if (apiResp.success) {
            setTbodyData(apiResp.data)
        } else {
            setTbodyData([])
        }
    }

    // const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
    // const [showPDF, setShowPDF] = useState(false);
    const totalDebit = tbodyData.reduce((sum, val) => sum + (Number(val.Debit) || 0), 0);
    const totalCredit = tbodyData.reduce((sum, val) => sum + (Number(val.Credit) || 0), 0);
    const totalRunningBal = tbodyData.reduce((sum, val) => sum + (Number(val.RunningBal.toString().replace(/[^\d.]/g, "")) || 0), 0);


    const updatedTableData = [
        ...tbodyData?.map((val, index) => ({
            "S.No": (
                <>
                    {index === 0 &&

                        <>
                            <strong>COG:</strong>
                            <br />
                            <strong>COA:</strong>
                            <br />
                        </>

                    }
                    <br />
                    {index + 1}
                </>
            ),
            "BranchCenter": (
                <>
                    {index === 0 &&
                        <div>
                            {val?.COGName}
                            <br />
                            {val?.COAName}
                        </div>
                    }
                    <br />
                    {val.BranchCentre}
                </>
            ),
            "Voucher Date": val.VoucherDate,
            "Voucher type": val.VoucherName,
            "Voucher No.": val.VoucherNo,
            "Bill No.": val.BillNo,
            "Bill Date.": val.BillDate,
            "Narration": val.Narations,
            "Ref No.": val.RefNo,
            "Ref Date.": val.RefDate,
            Debit: val.Debit,
            Credit: (
                <>
                    {index === 0 ?
                        Number(val.RunningBal.toString().replace(/[^\d.]/g, "")).toLocaleString()
                        :
                        val.Credit}
                </>
            ),
            "Running Bal.": Number(val.RunningBal.toString().replace(/[^\d.]/g, "")).toLocaleString(),
            "Type": val?.RunningBal?.includes("Cr") || val?.Credit?.includes("Cr") ? "Cr" : "",
        })),
        {
            "S.No": "",
            "BranchCenter": "",
            "Voucher Date": "",
            "Voucher type": "",
            "Voucher No.": "",
            "Bill No.": "",
            "Bill Date.": "",
            "Narration": "",
            "Ref No.": "",
            "Ref Date.": "Total",
            Debit: totalDebit.toLocaleString(),
            Credit: totalCredit.toLocaleString(),
            "Running Bal.": totalRunningBal.toLocaleString(),
            Type: "",
            "colorcode": "color-indicator-5-bg"

        }
    ]

    const getRowClass = (val, index) => {
        let type = updatedTableData[index].colorcode
        if (type) {
            return type;
        } else {
            return;
        }
    }


    const handleExportExcel = async (data) => {
        let result = [];
        console.log(data);
        result.push({
            "S.No": "COG",
            "BranchCenter": data[0].COGName,
            "Voucher Date": "",
            "Voucher type": "",
            "Voucher No.": "",
            "Bill No.": "",
            "Bill Date.": "",
            "Narration": "",
            "Ref No.": "",
            "Ref Date.": "",
            Debit: "",
            Credit: "",
            "Running Bal.": "",
            Type: "",
        },
            {
                "S.No": "COA",
                "BranchCenter": data[0].COAName

            }
        )
        data?.map((val, index) => {

            result.push({
                "S.No": index + 1,
                "BranchCenter": val.BranchCentre,
                "Voucher Date": val.VoucherDate,
                "Voucher type": val.VoucherName,
                "Voucher No.": val.VoucherNo,
                "Bill No.": val.BillNo,
                "Bill Date.": val.BillDate,
                "Narration": val.Narations,
                "Ref No.": val.RefNo,
                "Ref Date.": val.RefDate,
                Debit: val.Debit,
                Credit: index === 0 ? Number(val.RunningBal.toString().replace(/[^\d.]/g, "")).toLocaleString() : val.Credit,
                "Running Bal.": Number(val.RunningBal.toString().replace(/[^\d.]/g, "")).toLocaleString(),
                "Type": val?.RunningBal?.includes("Cr") || val?.Credit?.includes("Cr") ? "Cr" : "",

            })

        })
        result.push(
            {
                "S.No": "",
                "BranchCenter": "",
                "Voucher Date": "",
                "Voucher type": "",
                "Voucher No.": "",
                "Bill No.": "",
                "Bill Date.": "",
                "Narration": "",
                "Ref No.": "",
                "Ref Date.": "Total",
                Debit: totalDebit.toLocaleString(),
                Credit: totalCredit.toLocaleString(),
                "Running Bal.": totalRunningBal.toLocaleString(),
                Type: "",
            }
        )
        console.log(result);

        // let apiResp = await GetBankChargesUploadExcel();
        if (result) {
            exportToExcel(transformDataInTranslate(result, t), "Payable Ledger Report");
        } else {
            notify("no Data Found", "error");
        }
    };

    const handleExportPDF = (e) => {
        exportHtmlToPDFNoPrint("printSection", "Payable Ledger Report", "1000px", "landscape")
        // e.preventDefault();
        // setIsGeneratingPDF(true);
        // setShowPDF(true)
        // setTimeout(() => {
        //     setIsGeneratingPDF(false);
        //     setShowPDF(false); // Hide the PDF component after generation
        // }, 5000);
    };
    const [items, setItems] = useState([]);

    const search = async (event, name) => {
        if (event?.query?.length > 0) {

            const results = filterByTypes(
                reportControlList,
                [4],
                ["TypeID"],
                "TextField",
                "ValueField"
            );



            if (results && results.length > 0) {
                let filterData = results.filter((val) =>
                    val?.label?.toLowerCase().includes(event?.query.toLowerCase())
                );


                setItems(filterData);
            } else {
                setItems([]);
            }
        } else {
            setItems([]);
        }
    };
    const validateInvestigation = async (e, name) => {

        const { value } = e;

        if (name === "ChartOfAC") {
            value.isAccountType = true
            setPayloadData((val) => ({ ...val, ["ChartOfAC"]: value }))

        } else {


            setPayloadData((val) => ({ ...val, [name]: "" }))
        }
    };
    const itemTemplate = (item) => {
        return (
            <div className="p-clearfix"
            >
                <div style={{ float: "left", fontSize: "12px", width: "100%" }}>
                    {item?.label}
                </div>
            </div>
        );
    };

    return (
        <div className="mt-2 spatient_registration_card">
            <div className="patient_registration card">
                {/* <Heading isBreadcrumb={true} /> */}
                <div className="row p-2">
                    <ReactSelect
                        placeholderName={t("Branch Centre")}
                        id="BranchCentre"
                        name="BranchCentre"
                        requiredClassName={`required-fields`}
                        value={payloadData?.BranchCentre?.value}
                        removeIsClearable={true}
                        handleChange={(name, value) => setPayloadData((val) => ({ ...val, [name]: value }))}
                        dynamicOptions={[
                            { value: "0", label: "ALL" },
                            ...GetEmployeeWiseCenter?.map((ele) => ({
                                value: ele?.CentreID,
                                label: ele?.CentreName,
                            }))
                        ]}
                        searchable={true}
                        respclass="col-xl-2 col-md-3 col-sm-6 col-12"
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
                        respclass="col-xl-2 col-md-3 col-sm-6 col-12"
                    />
                    <ReactSelect
                        placeholderName={t("Voucher Type")}
                        id="VoucherType"
                        name="VoucherType"
                        requiredClassName={`required-fields`}
                        value={payloadData?.VoucherType?.value}
                        removeIsClearable={true}
                        handleChange={(name, value) => setPayloadData((val) => ({ ...val, [name]: value }))}
                        dynamicOptions={[
                            { value: "0", label: "ALL" }
                            , ...filterByTypes(
                                reportControlList,
                                [2],
                                ["TypeID"],
                                "TextField",
                                "ValueField",
                            )]}
                        searchable={true}
                        respclass="col-xl-2 col-md-3 col-sm-6 col-12"
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
                        respclass="col-xl-2 col-md-3 col-sm-6 col-12"
                    />



                    <DatePicker
                        requiredClassName={`required-fields`}

                        className="custom-calendar"
                        placeholder={VITE_DATE_FORMAT}
                        lable={t("From Date")}
                        respclass={"col-xl-2 col-md-3 col-sm-6 col-12"}
                        name="fromDate"
                        id="fromDate"
                        maxDate={new Date()}
                        value={payloadData?.fromDate ? moment(payloadData.fromDate).toDate() : new Date}
                        showTime
                        hourFormat="12"
                        handleChange={(date) => handleChange(date, "fromDate")}
                    />
                    <DatePicker
                        requiredClassName={`required-fields`}

                        className="custom-calendar"
                        placeholder={VITE_DATE_FORMAT}
                        lable={t("To Date")}
                        respclass={"col-xl-2 col-md-3 col-sm-6 col-12"}
                        name="toDate"
                        id="toDate"
                        maxDate={new Date()}
                        value={payloadData?.toDate ? moment(payloadData.toDate).toDate() : new Date}
                        showTime
                        hourFormat="12"
                        handleChange={(date) => handleChange(date, "toDate")}
                    />
                    <ReactSelect
                        placeholderName={t("Transaction Type")}
                        id="TransactionType"
                        name="TransactionType"
                        requiredClassName={`required-fields`}

                        value={payloadData?.TransactionType?.value}
                        removeIsClearable={true}
                        handleChange={(name, value) => setPayloadData((val) => ({ ...val, [name]: value }))}
                        dynamicOptions={[
                            { label: "All Transaction.", value: "0" },
                            { label: "Only Verify.", value: "1" },
                            { label: "Only Auth.", value: "2" },
                        ]}
                        searchable={true}
                        respclass="col-xl-2 col-md-3 col-sm-6 col-12"
                    />
                    <ReactSelect
                        placeholderName={t("Display Narration")}
                        id="DisplayNarration"
                        name="DisplayNarration"
                        value={payloadData?.DisplayNarration?.value}
                        removeIsClearable={true}
                        handleChange={(name, value) => setPayloadData((val) => ({ ...val, [name]: value }))}
                        dynamicOptions={
                            [
                                { label: "Yes", value: 1 },
                                { label: "No", value: 0 }

                            ]
                        }
                        searchable={true}
                        respclass="col-xl-2 col-md-3 col-sm-6 col-12"
                    /> <ReactSelect
                        placeholderName={t("Group By")}
                        id="GroupBy"
                        name="GroupBy"
                        value={payloadData?.GroupBy?.value}
                        removeIsClearable={true}
                        handleChange={(name, value) => setPayloadData((val) => ({ ...val, [name]: value }))}
                        dynamicOptions={
                            [
                                { label: "Voucher Date", value: "Date" },
                                { label: "Verify By", value: "Verify By" },
                                { label: "Auth By", value: "Auth. By" },
                                { label: "Month wise", value: "Month" },
                                { label: "Year wise", value: "Year" },
                            ]
                        }
                        searchable={true}
                        respclass="col-xl-2 col-md-3 col-sm-6 col-12"
                    />
                    <ReactSelect
                        placeholderName={t("Display Opposite A/C")}
                        id="DisplayOpposite"
                        name="DisplayOpposite"
                        value={payloadData?.DisplayOpposite?.value}
                        removeIsClearable={true}
                        handleChange={(name, value) => setPayloadData((val) => ({ ...val, [name]: value }))}
                        dynamicOptions={[
                            { label: "Yes", value: "1" },
                            { label: "No", value: "0" }
                        ]}
                        searchable={true}
                        respclass="col-xl-2 col-md-3 col-sm-6 col-12"
                    />
                    {/* <ReactSelect
                        placeholderName={t("Chart Of Account")}
                        id="ChartOfAC"
                        name="ChartOfAC"
                        requiredClassName={`required-fields`}
                        value={payloadData?.ChartOfAC?.value}
                        removeIsClearable={true}
                        handleChange={(name, value) => setPayloadData((val) => ({ ...val, [name]: value }))}
                        dynamicOptions={filterByTypes(
                            reportControlList,
                            [4],
                            ["TypeID"],
                            "TextField",
                            "ValueField",
                        )}
                        searchable={true}
                        respclass="col-xl-2 col-md-3 col-sm-6 col-12"
                    /> */}

                    <div className="col-xl-4 col-md-6 col-sm-6 col-12">

                        <AutoComplete
                            value={payloadData?.ChartOfAC?.label ? payloadData?.ChartOfAC?.label : payloadData?.ChartOfAC}
                            suggestions={items}
                            completeMethod={(e) => { search(e, "ChartOfAC") }}
                            onChange={(e) => setPayloadData({ ...payloadData, ChartOfAC: e.value })}
                            className="w-100"
                            onSelect={(e) => validateInvestigation(e, "ChartOfAC")}
                            id="ChartOfAC"
                            itemTemplate={itemTemplate}
                        //   onBlur={() => { setPayloadData((prev) => ({ ...prev, ChartOfAC: "", ChartOfAC: "" })) }}

                        />
                        <label
                            className="label lable truncate ml-3 p-1"
                            style={{ fontSize: "5px !important" }}
                        >
                            {t("Chart Of A/C")}

                        </label>
                    </div>

                    <div className="col-xl-1 col-md-1 col-sm-2 col-3  mb-2">
                        <button className="btn btn-sm btn-primary  w-100   " onClick={handleSearch} type="button" >
                            {t("Search")}
                        </button>
                    </div>

                    <div className="col-xl-1 col-md-1 col-sm-2 col-3  mb-2" >
                        {tbodyData.length > 0 &&
                            <button className="btn btn-sm btn-primary  w-100 no-print" onClick={handleExportPDF} type="button" >
                                {t("Print PDF")}
                            </button>
                        }
                    </div>

                </div>
                {tbodyData.length > 0 &&

                    <div id='printSection'>
                        <Heading isBreadcrumb={false} title={t("Statement of Payable Ledger")}
                            secondTitle={<>
                                <span onClick={() => handleExportExcel(tbodyData)} className='no-print'>
                                    <ExcelIconSVG />{" "}
                                </span>
                            </>} />
                        <Tables
                            thead={thead}
                            tbody={updatedTableData}
                            getRowClass={getRowClass}
                        />
                    </div>
                }
            </div>
        </div>
    )
}

export default PayableLedgerReport;