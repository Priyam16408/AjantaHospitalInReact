import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next';
import { BindReportControlsAPI, GetStatementReport } from '../../../networkServices/finance';
import { useSelector } from 'react-redux';
import Heading from '../../../components/UI/Heading';
import MultiSelectComp from '../../../components/formComponent/MultiSelectComp';
import ReactSelect from '../../../components/formComponent/ReactSelect';
import { filterByTypes, notify } from '../../../utils/utils';
import DatePicker from '../../../components/formComponent/DatePicker';
import moment from 'moment';
import { AutoComplete } from 'primereact/autocomplete';
import { exportHtmlToPDFNoPrint } from '../../../utils/exportLibrary';
import { ExcelIconSVG, PDFIconSVG } from '../../../components/SvgIcons';
import Tables from '../../../components/UI/customTable';
import { useLocalStorage } from '../../../utils/hooks/useLocalStorage';

const PayableStatement = () => {
    const userData = useLocalStorage("userData", "get")

    const [t] = useTranslation()
    const [payloadData, setPayloadData] = useState({
        BranchCentre: [{ code: Number(userData?.defaultCentre ? userData?.defaultCentre : 0), name: userData?.centreName }],

        Currency: { label: "INR", value: "INR" },
        FinancialYear: {
            label: "FY : 01-Apr-2024 - 31-Mar-2025",
            value: "1"
        },
        IsOnlyUnpaid: 0,

        IsOnlyPaid: 0,
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
    const handleChange = (e) => {
        setPayloadData((val) => ({ ...val, [e.target.name]: e.target.value }))
    }
    console.log(payloadData);

    const handleSearch = async () => {
        let missingFields = [];
        if (!payloadData?.ChartOfAC?.value) missingFields.push("Chart Of A/C");
        if (!payloadData?.BranchCentre?.[0]?.code) missingFields.push("Branch Centre");

        if (missingFields.length > 0) {
            notify(`${missingFields[0]} is required`, "error");
            return;
        }
        let data = {
            ACCType: 0,
            DateFilterType: 1,
            ACCOAID: Number(payloadData?.ChartOfAC?.value || 0),
            CentreID: String(payloadData?.BranchCentre ? payloadData?.BranchCentre[0]?.code : ""),
            CurrencyCode: payloadData?.Currency?.value || "",
            fyid: Number(payloadData?.FinancialYear?.value || 1),
            fyText: payloadData?.FinancialYear?.label || "",
            fromDate: moment(payloadData?.fromDate).format("DD-MMM-YYYY") || "",
            toDate: moment(payloadData?.toDate).format("DD-MMM-YYYY") || "",
            fyStartEndDate: payloadData?.FinancialYear?.label?.split(":")[1]?.split(" - ").map(date => moment(date, "DD-MMM-YYYY").format("YYYY-MM-DD")).join("#"),
            reportType: 0,
            IsOnlyUnpaid: payloadData.IsOnlyUnpaid === true ? 1 : 0,
            reportName: "Supplier Statement",

        };

        const apiResp = await GetStatementReport(data);
        if (apiResp?.success) {

            setTableData(apiResp.data);
        }
        else {
            notify(apiResp.message, "error");
            setTableData([]);
        }
    };



    const thead = [
        { width: "1%", name: t("S.No") },
        { width: "5%", name: t("Date") },
        { width: "5%", name: t("Type") },
        { width: "5%", name: t("GRN No.") },
        { width: "5%", name: t("Inv. Date") },
        { width: "5%", name: t("Supplier Inv. No") },
        { width: "5%", name: t("Voucher No") },
        { width: "5%", name: t("Cheque No") },
        { width: "5%", name: t("Debit") },
        { width: "5%", name: t("Credit") },
        { width: "5%", name: t("Balance") },

    ]

    const handleExportExcel = async (tableData) => {

    }
    const handleExportPDF = () => {
        exportHtmlToPDFNoPrint("printSection", "Payable Statement Report", "1000px", "landscape")
    }

    const totalDebit = tableData.reduce((sum, val) => sum + (Number(val.Debit) || 0), 0).toFixed(2);
    const totalCredit = tableData.reduce((sum, val) => sum + (Number(val.Credit) || 0), 0).toFixed(2);
    const totalRunningBal = tableData.reduce((sum, val) => sum + (Number(val.Balance.toString().replace(/[^\d.]/g, "")) || 0), 0);

    const updatedTableData = [...tableData?.map((val, index) => {
        return {
            "S.No": index + 1,
            "Date": val?.Date,
            "Type": val?.Type,
            "GRN No.": val?.GRNNO,
            "Inv. Date": val?.Date,
            "Supplier Inv. No": val?.Supplier_Inv_No,
            "Voucher No": val?.VoucherNo,
            "Cheque No": val?.ChequeNo,
            "Debit": val?.Debit.toFixed(2),
            "Credit": val?.Credit.toFixed(2),
            "Balance": val?.Balance.toFixed(2),
        }
    }), {
        "S.No": "",
        "Date": "",
        "Type": "",
        "GRN No.": "",
        "Inv. Date": "",
        "Supplier Inv. No": "",
        "Voucher No": "",
        "Cheque No": (t("Total")),
        "Debit": totalDebit,
        "Credit": totalCredit,
        "Balance": totalRunningBal,
        "colorcode": "color-indicator-5-bg"

    }]
    const getRowClass = (val, index) => {
        let type = updatedTableData[index].colorcode
        if (type) {
          return type;
        } else {
          return;
        }
      }
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
                            placeholderName={t("Currency")}
                            id="Currency"
                            name="Currency"
                            value={payloadData?.Currency?.value}
                            requiredClassName={`required-fields`}
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
                            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                        />
                        <ReactSelect
                            placeholderName={t("Financial Year")}
                            id="FinancialYear"
                            name="FinancialYear"
                            value={payloadData?.FinancialYear?.value}
                            removeIsClearable={true}
                            requiredClassName={`required-fields`}
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
                        <div className="col-xl-2 col-md-4 col-sm-6 col-4  d-flex align-items-center">

                            <input
                                type="checkbox"
                                checked={payloadData.IsOnlyPaid}
                                onChange={() =>
                                    setPayloadData({ ...payloadData, IsOnlyPaid: !payloadData.IsOnlyPaid })
                                }
                                className='mr-1'
                            />
                            <span>{t("Payment Only")}</span>
                        </div>
                        <div className="col-xl-2 col-md-4 col-sm-6 col-4  d-flex align-items-center">

                            <input
                                type="checkbox"
                                checked={payloadData.IsOnlyUnpaid}
                                onChange={() =>
                                    setPayloadData({ ...payloadData, IsOnlyUnpaid: !payloadData.IsOnlyUnpaid })
                                }
                                className='mr-1'
                            />
                            <span>{t("Only un-paid")}</span>
                        </div>


                        <div className="col-xl-1 col-md-1 col-sm-2 col-4  mb-2">
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
                                        <span onClick={() => handleExportExcel(tableData)} className='no-print'>
                                            <ExcelIconSVG />{" "}
                                        </span>
                                    </>
                                )}
                            />
                            {console.log(tableData)}
                            <Tables
                                thead={thead}
                                tbody={updatedTableData}
                                getRowClass={getRowClass}
                            />
                        </div>
                    }
                </div>
            </div>
        </>
    )
}

export default PayableStatement