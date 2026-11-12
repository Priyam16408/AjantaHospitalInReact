import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next';

import { useSelector } from 'react-redux';
import Heading from '../../../components/UI/Heading';
import MultiSelectComp from '../../../components/formComponent/MultiSelectComp';
import ReactSelect from '../../../components/formComponent/ReactSelect';
import { filterByTypes, notify } from '../../../utils/utils';
import DatePicker from '../../../components/formComponent/DatePicker';
import moment from 'moment';
import TreeViewTable from '../../../components/UI/customTable/TreeViewTable';
import { buildHierarchyTree } from '../../../utils/ustil2';
import { BindReportControlsAPI, GetGLReport } from '../../../networkServices/finance';
import Input from '../../../components/formComponent/Input';
import { AutoComplete } from 'primereact/autocomplete';
import Tables from '../../../components/UI/customTable';
import PayableTablePDF from './PayableTablePDF';
import { ExcelIconSVG, PDFIconSVG } from '../../../components/SvgIcons';
import { exportHtmlToPDFNoPrint, exportToExcel } from '../../../utils/exportLibrary';
import { transformDataInTranslate } from '../../../components/WrapTranslate';

const ReceivableLedger = () => {
    const [t] = useTranslation()
    const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
    const [payloadData, setPayloadData] = useState({
        DisplayNarration: { label: "Yes", value: "1" },
        BranchCentre: { label: "All", value: "0" },
        Currency: { label: "INR", value: "INR" },
        VoucherType: { label: "All", value: "0" },
        FinancialYear: {
            label: "FY : 01-Apr-2024 - 31-Mar-2025",
            value: "1",
            extraColomn: "2024-04-01#2025-03-31"
        },
        fromDate: new Date(),
        toDate: new Date(),
        TransactionType: { label: "All Transaction", value: "0" },
        GroupBy: {
            label: "Voucher Date", value: "Date"
        },
        DisplayOpposite: {
            label: "No", value: "0"
        },
        coType: {
            label: "COA Wise", value: "4"
        },
        coa_wise: {}
    });
    console.log(payloadData);

    const [items, setItems] = useState([]);
    const [showPDF, setShowPDF] = useState([]);

    const [bodyData, setBodyData] = useState([]);
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
        const currency = payloadData?.Currency?.value;
        if (!currency) {

            notify("Please select Currency", "error")
            return
        }
        if (!payloadData?.FinancialYear?.value) {

            notify("Please select Financial Year", "error")
            return
        }
        if (!payloadData?.coa_wise?.value) {

            notify("Please select Chart Of A/C ", "error")
            return
        }
        const payload = {
            "centreID": Number(payloadData?.BranchCentre?.value),
            "currencyCode": String(currency),
            "voucherType": String(payloadData?.VoucherType?.value),
            "acFilterType": Number(payloadData?.coType?.value),
            "acFilterValue": String(payloadData?.coa_wise?.value),
            "fromDate": moment(payloadData?.fromDate).format("DD-MMM-YYYY"),
            "toDate": moment(payloadData?.toDate).format("DD-MMM-YYYY"),
            "transactionType": Number(payloadData?.TransactionType?.value),
            "isNarration": Number(payloadData?.DisplayNarration?.value),
            "isOppositeAC": Number(payloadData?.DisplayOpposite?.value),
            "groupBy": String(payloadData?.GroupBy?.value),
            "fyid": Number(payloadData?.FinancialYear?.value),
            "fyText": String(payloadData?.FinancialYear?.label),
            "fyStartEndDate": String(payloadData?.FinancialYear?.extraColomn),
            "reportType": 1,
            "reportName": "General Ledger"
        }

        try {
            // First API call
            const apiResp = await GetGLReport(payload);


            if (apiResp?.success) {
                // let newResp = [...apiResp?.data]; // Store initial data

                // // Use Promise.all to handle multiple API calls
                // const additionalData = await Promise.all(
                //     apiResp?.data?.map(async (val) => {
                //         let modifiedData = { ...data, ACFilterValue: val.COGCode, GroupBy: 4 }; // Modify ACFilterValue
                //         const apisubResp = await GetTrialBalanceReport(modifiedData);


                //         return apisubResp?.success ? apisubResp.data : null;
                //     })
                // );

                // // Flatten and filter null values
                // newResp = [...newResp, ...additionalData.flat().filter(Boolean)];

                // let hierarchyData = buildHierarchyTree(newResp, []);


                setTableData(apiResp?.data);
            } else {
                notify(apiResp?.message, "error")
                setTableData([]);
            }
        } catch (error) {
            console.error("Error in handleSearch:", error);
            setTableData([]);
        }
    };


    const thead = [
        { width: "1%", name: t("S.No") },
        { name: t("Branch Centre") },
        { name: t("Vch. Date") },
        { name: t("Vch.Type") },
        { name: t("Vch.No.") },
        { name: t("Bill No.") },
        { name: t("Bill Date") },
        { name: t("Narration") },
        { name: t("Ref No.") },
        { name: t("Ref Date") },
        { name: t("Debit") },
        { name: t("Credit") },
        { name: t("Running Bal.") },
        { name: t("Type") },
        // { name: t("Branch") },
    ]



    const search = async (event, name) => {
        if (event?.query?.length > 0) {
            const keyValue = Number(payloadData?.coType?.value || 0); // Ensure a number

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

        if (name === "coa_wise") {
            value.isAccountType = true
            setPayloadData((val) => ({ ...val, ["coa_wise"]: value }))

        } else {


            setPayloadData((val) => ({ ...val, [name]: "" }))
        }
        setBodyData((val) => ([...val, value]))
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

    const totalDebit = tableData.reduce((sum, val) => sum + (Number(val?.Debit) || 0), 0);
    const totalCredit = tableData.reduce((sum, val) => sum + (Number(val?.Credit) || 0), 0);
    const totalRunningBal = tableData.reduce((sum, val) => sum + (Number(val.RunningBal.toString().replace(/[^\d.]/g, "")) || 0), 0);

    const updatedData = [
        ...tableData?.map((val, index) => ({
            "S.No": isGeneratingPDF
                ? (index === 0 ? `COG: COA:\n\n${index + 1}` : `${index + 1}`)
                : (
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
            "BranchCenter": isGeneratingPDF
                ? (index === 0 ? `${val?.COGName}\n${val?.COAName}\n${val.BranchCentre}` : val.BranchCentre) :
                (
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
            Credit: isGeneratingPDF
                ? Number(val?.RunningBal.toString().replace(/[^\d.]/g, "")).toLocaleString()
                : (
                    <>
                        {index === 0 ?
                            Number(val.RunningBal.toString().replace(/[^\d.]/g, "")).toLocaleString()
                            :
                            val?.Credit}
                    </>
                ),
            "Running Bal.": Number(val.RunningBal.toString().replace(/[^\d.]/g, "")).toLocaleString(),
            // "Type": val?.RunningBal?.includes("Cr") || val?.Credit?.includes("Cr") ? "Cr" : "",
            "Type": String(val?.RunningBal).includes("Cr") || String(val?.Credit).includes("Cr") ? "Cr" : "",

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
        let type = updatedData[index].colorcode
        if (type) {
            return type;
        } else {
            return;
        }
    }
    const handleExportPDF = (e) => {

        exportHtmlToPDFNoPrint("printSection", "Receivable Ledger", "1000px", "landscape")
    };
    const handleExportExcel = async (tableData) => {

        // let apiResp = await GetBankChargesUploadExcel();
        if (tableData) {
            exportToExcel(transformDataInTranslate(tableData, t), "Receivable Ledger Report");
        } else {
            notify("no Data Found", "error");
        }
    };

    return (
        <>
            <div className="mt-2 spatient_registration_card">
                <div className="patient_registration card">
                    {/* <Heading isBreadcrumb={false} title={t("Receivable Ledger")} /> */}
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
                                { label: "All", value: "0" },
                                ...(GetEmployeeWiseCenter?.map((ele) => ({
                                    value: ele?.CentreID,
                                    label: ele?.CentreName,
                                })) || [])
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
                            value={payloadData?.VoucherType?.value}
                            removeIsClearable={true}
                            handleChange={(name, value) => setPayloadData((val) => ({ ...val, [name]: value }))}
                            dynamicOptions={[{ label: "All", value: "0" }, ...(filterByTypes(
                                reportControlList,
                                [2],
                                ["TypeID"],
                                "TextField",
                                "ValueField",
                            ))]}
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
                                "TypeCode"
                            )}
                            searchable={true}
                            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
                        />



                        <DatePicker
                            requiredClassName={`required-fields`}

                            className="custom-calendar"
                            placeholder={VITE_DATE_FORMAT}
                            lable={t("From Date")}
                            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
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
                            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
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

                            value={payloadData?.TransactionType?.value}
                            removeIsClearable={true}
                            handleChange={(name, value) => setPayloadData((val) => ({ ...val, [name]: value }))}
                            dynamicOptions={[
                                {
                                    label: "All Transaction", value: "0"
                                },
                                {
                                    label: "Only Verify", value: "1"
                                },
                                {
                                    label: "Only Auth", value: "2"
                                },
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

                            dynamicOptions={[
                                {
                                    label: "Yes", value: "1"
                                },
                                {
                                    label: "No", value: "0"
                                },

                            ]}
                            searchable={true}
                            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
                        /> <ReactSelect
                            placeholderName={t("Group By")}
                            id="GroupBy"
                            name="GroupBy"
                            value={payloadData?.GroupBy?.value}
                            removeIsClearable={true}
                            handleChange={(name, value) => setPayloadData((val) => ({ ...val, [name]: value }))}
                            dynamicOptions={[
                                {
                                    label: "Voucher Date", value: "Date"
                                },
                                {
                                    label: "Verify By", value: "Verify By"
                                },
                                {
                                    label: "Auth By", value: "Auth By"
                                },
                                {
                                    label: "Month", value: "Month Wise"
                                },
                                {
                                    label: "Year", value: "Year Wise"
                                },

                            ]}

                            searchable={true}
                            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
                        /> <ReactSelect
                            placeholderName={t("Display Opposite A/C")}
                            id="DisplayOpposite"
                            name="DisplayOpposite"
                            value={payloadData?.DisplayOpposite?.value}
                            removeIsClearable={true}
                            handleChange={(name, value) => setPayloadData((val) => ({ ...val, [name]: value }))}
                            dynamicOptions={[
                                {
                                    label: "Yes", value: "1"
                                },
                                {
                                    label: "No", value: "0"
                                },

                            ]}

                            searchable={true}
                            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
                        />




                        <div className="col-xl-4 col-md-4 col-sm-6 col-12">

                            <AutoComplete
                                value={payloadData?.coa_wise?.label ? payloadData?.coa_wise?.label : payloadData?.coa_wise}
                                //   value={values?.AccountName?.TextField ? values?.AccountName?.TextField : values?.AccountName}
                                suggestions={items}
                                completeMethod={(e) => { search(e, "coa_wise") }}
                                onChange={(e) => setPayloadData({ ...payloadData, coa_wise: e.value })}
                                className="w-100"
                                onSelect={(e) => validateInvestigation(e, "coa_wise")}
                                id="coa_wise"
                                itemTemplate={itemTemplate}
                            //   onBlur={() => { setPayloadData((prev) => ({ ...prev, coa_wise: "", coa_wise: "" })) }}

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
                        {/* <div className="col-xl-1 col-md-1 col-sm-2 col-3  mb-2">
                            <button className="btn btn-sm btn-primary  w-100   " onClick={handleSearch} type="button" >
                                {t("Print PDF")}
                            </button>
                        </div> */}
                        {/* <div className="col-xl-1 col-md-1 col-sm-2 col-3  mb-2">
                        {tableData.length > 0 &&
                            <button className="btn btn-sm btn-primary  w-100" onClick={handleExportPDF} type="button" >
                                {t("Print PDF")}
                                {showPDF &&
                                    <PayableTablePDF
                                        theadData={thead}
                                        paybleLederData={updatedData}
                                        filename={"Payable Ldeger Report"}
                                        heading={"Payable Ldeger Report"}
                                        onComplete={() => setShowPDF(false)}
                                        autoGenerate={true}
                                    />
                                }
                            </button>
                        }
                    </div> */}

                    </div>
                    {
                        tableData.length > 0 && <div id="printSection">
                            <Heading title={t("RECEIVABLE LEDGER")}
                                secondTitle={
                                    <>
                                        <div onClick={handleExportPDF} className='no-print'>
                                            <PDFIconSVG />
                                        </div>


                                        <span onClick={() => handleExportExcel(tableData)} className='no-print'>
                                            <ExcelIconSVG />{" "}
                                        </span>

                                    </>
                                }
                            />
                            {/* <Heading title={t("")} /> */}
                            <Tables
                                thead={thead}
                                tbody={updatedData}
                                getRowClass={getRowClass}
                            />
                        </div>
                    }


                </div>
            </div>
        </>
    )
}

export default ReceivableLedger;
