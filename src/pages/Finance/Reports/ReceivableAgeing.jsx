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
import { BindReportControlsAPI, FinanceReceibleAgingSummary, GetGLReport } from '../../../networkServices/finance';
import Input from '../../../components/formComponent/Input';
import { AutoComplete } from 'primereact/autocomplete';
import Tables from '../../../components/UI/customTable';
import ReportsMultiSelect from '../../../components/ReportCommonComponents/ReportsMultiSelect';

const ReceivableAgeing = () => {
    // debugger
    const [t] = useTranslation()
    const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
    const [payloadData, setPayloadData] = useState({

        BranchCentre: [],
        Currency: {label: "INR", value: "INR" },
        AgeingType: {
            label: "Day Basis", value: "1"
        },
        AsOn: new Date(),


        DateType: {
            label: "Voucher Date", value: "1"
        },
        coa_wise: {},

    });
    const [items, setItems] = useState([]);
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

    const handleChange = (e) => {
        setPayloadData((val) => ({ ...val, [e.target.name]: e.target.value }))
    }
    console.log("firs t payloadData", payloadData)
    const handleSearch = async () => {
        const currency = payloadData?.Currency?.value;
        let centreID = payloadData?.BranchCentre?.map((item) => {
            return item.code
        }).join(",")
        if (!centreID) {

            notify("Please select Branch Centre", "error")
            return
        }
        if (!currency) {

            notify("Please select Currency", "error")
            return
        }
        if (!payloadData?.coa_wise?.value) {

            notify("Please select Chart Of A/C ", "error")
            return
        }



        const payload = {
            "centreID": Number(centreID),
            "branchCentreID": String(centreID),
            "currencyCode": String(currency),
            "acFilterType": 4,
            "acFilterValue": String(payloadData?.coa_wise?.value),
            "reportName": "Receivable Aging Summary",
            "dateFilterType": Number(payloadData?.DateType?.value),
            "ageingType": Number(payloadData?.AgeingType?.value),
            "asOnDate": moment(payloadData?.AsOn).format("DD-MMM-YYYY"),
        }


        try {
            // First API call
            const apiResp = await FinanceReceibleAgingSummary(payload);


            if (apiResp?.success) {
               
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
        t("S.No."),
        { name: t("Branch Centre") },
        { name: t("Vch.Date") },
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
        { name: t("Type")},
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
    const handleMultiSelectChange = (name, selectedOptions) => {
        setPayloadData({
            ...payloadData,
            [name]: selectedOptions,
        });
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
    return (
        <>
            <div className="mt-2 spatient_registration_card">
                <div className="patient_registration card">
                    <Heading isBreadcrumb={false} title={t("Receivable Ageing Summary" )}/>
                    <div className="row p-2">
                        {console.log("GetEmployeeWiseCenter", GetEmployeeWiseCenter)}

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
                            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
                        />

                        <ReactSelect
                            placeholderName={t("Ageing Type")}
                            id="AgeingType"
                            name="AgeingType"

                            value={payloadData?.AgeingType?.value}
                            removeIsClearable={true}
                            handleChange={(name, value) => setPayloadData((val) => ({ ...val, [name]: value }))}
                            dynamicOptions={[
                                {
                                    label: "Day Basis", value: "1"
                                },
                                {
                                    label: "Yearly Basis", value: "2"
                                },

                            ]}

                            searchable={true}
                            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
                        />
                        <ReactSelect
                            placeholderName={t("Date Type")}
                            id="DateType"
                            name="DateType"
                            value={payloadData?.DateType?.value}
                            removeIsClearable={true}
                            handleChange={(name, value) => setPayloadData((val) => ({ ...val, [name]: value }))}

                            dynamicOptions={[
                                {
                                    label: "Voucher Date", value: "1"
                                },
                                {
                                    label: "Bill Date", value: "2"
                                },

                            ]}
                            searchable={true}
                            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
                        />
                        <DatePicker
                            requiredClassName={`required-fields`}

                            className="custom-calendar"
                            placeholder={VITE_DATE_FORMAT}
                            lable={t("As On")}
                            respclass={"col-xl-2 col-md-4 col-sm-6 col-12"}
                            name="AsOn"
                            id="AsOn"
                            maxDate={new Date()}
                            value={payloadData?.AsOn ? moment(payloadData.AsOn).toDate() : new Date}
                            showTime
                            hourFormat="12"
                            handleChange={(date) => handleChange(date, "AsOn")}
                        />


                        <div className="col-xl-4 col-md-8 col-sm-6 col-12">

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

                    </div>
                    {tableData.length > 0 &&
                        <>
                            <Heading title={tableData[0].CentreName} />
                            <Tables
                                thead={thead}
                                tbody={updatedData}
                                getRowClass={getRowClass}
                            />
                              </>
                    }
                </div>
            </div>
        </>
    )
}

export default ReceivableAgeing;
