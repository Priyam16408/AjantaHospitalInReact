import React, { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next';
import { BindReportControlsAPI, GetTrialBalanceReport } from '../../../networkServices/finance';
import { useSelector } from 'react-redux';
import Heading from '../../../components/UI/Heading';
import MultiSelectComp from '../../../components/formComponent/MultiSelectComp';
import ReactSelect from '../../../components/formComponent/ReactSelect';
import { filterByTypes, notify } from '../../../utils/utils';
import DatePicker from '../../../components/formComponent/DatePicker';
import moment from 'moment';
import TreeViewTable from '../../../components/UI/customTable/TreeViewTable';
import { buildHierarchyTree } from '../../../utils/ustil2';
import { AutoComplete } from 'primereact/autocomplete';

import { ExcelIconSVG, PDFIconSVG } from '../../../components/SvgIcons';
import { exportHtmlToPDFNoPrint, exportToExcel } from '../../../utils/exportLibrary';
import { transformDataInTranslate } from '../../../components/WrapTranslate';
import { useLocalStorage } from '../../../utils/hooks/useLocalStorage';

const TrialBalanceReport = () => {
    const userData = useLocalStorage("userData", "get")

    const [t] = useTranslation()
    const [payloadData, setPayloadData] = useState({
        BranchCentre: [{ code: Number(userData?.defaultCentre ? userData?.defaultCentre : 0), name: userData?.centreName }],
        Currency: { label: "INR", value: "INR" },
        FinancialYear: {
            label: "FY : 01-Apr-2024 - 31-Mar-2025",
            value: "1"
        },
        fromDate: new Date(),
        toDate: new Date(),
    });

    const [reportControlList, setReportControlList] = useState([])
    const { GetEmployeeWiseCenter } = useSelector((state) => state.CommonSlice);
    const { VITE_DATE_FORMAT } = import.meta.env;
    const [tableData, setTableData] = useState([]);
    const [exportData, setExportData] = useState([]);
    console.log(GetEmployeeWiseCenter);

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
    const [payload, setPayload] = useState({})
    const handleSearch = async () => {
        setTableData([])
        let missingFields = [];

        if (!payloadData?.BranchCentre?.[0]?.name) {
            missingFields.push("Branch Centre");
        }

        if (missingFields.length > 0) {
            notify(` ${missingFields[0]} is Required`, "error");
            return;
        }
        let data = {
            branchCentreIDs: String(payloadData?.BranchCentre[0]?.code || ""),
            acFilterType: 3,
            acFilterValue: Number(payloadData?.COG?.value) || 0,
            CurrencyCode: payloadData?.Currency?.value || "",
            fyid: Number(payloadData?.FinancialYear?.value || 1),
            fyText: payloadData?.FinancialYear?.label || "",
            fromDate: moment(payloadData?.fromDate).format("YYYY-MM-DD") || "",
            toDate: moment(payloadData?.toDate).format("YYYY-MM-DD") || "",
            fyStartEndDate: payloadData?.FinancialYear?.label?.split(":")[1]?.split(" - ").map(date => moment(date, "DD-MMM-YYYY").format("YYYY-MM-DD")).join("#"),
            reportType: 1,
            reportName: "Trial Balance",
            groupBy: 3,
        };
        setPayload(data)

        try {
            let newResp = []
            // First API call
            const apiResp = await GetTrialBalanceReport(data);
            console.log("Initial API Response:", apiResp);
            if (apiResp?.success) {

                const formatted = apiResp.data.map(item => ({
                    ...item,
                    GroupName: item.COGName, // Add COGName as 
                    GroupCode: item.COGCode, // Add COGCode as groupCode
                }));
                newResp = [...formatted]; // Store initial data


                //     // Function to process additional data using a callback
                //     const fetchAdditionalData = async (dataList, callback) => {
                //         let additionalData = [];
                //         for (let val of dataList) {
                //             let modifiedData = { ...data, acFilterValue: val.COGCode, groupBy: 4 }; // Modify ACFilterValue
                //             const apisubResp = await GetTrialBalanceReport(modifiedData);
                //             if (apisubResp?.success) {
                //                 const formattedData = apisubResp.data.map(item => ({
                //                     ...item,
                //                     GroupName: <span>{item.COGName}</span>, // Add COGName as groupName
                //                     GroupCode: item.COGCode, // Add COGCode as groupCode
                //                 }));
                //                 additionalData.push(...formattedData);
                //             }
                //         }
                //         callback(additionalData);
                //     };

                //     // Fetch additional data with a callback
                //     fetchAdditionalData(apiResp.data, (additionalData) => {
                //         console.log("Additional Data:", additionalData);

                //         // Merge the initial and additional responses
                //         newResp = [...newResp, ...additionalData];

                //         // Process hierarchy tree
                let hierarchyData = buildHierarchyTree(newResp, ["Opening", "TotalDebit", "TotalCredit", "Closing"]);
                setExportData([...hierarchyData, {
                    "S.No": "",
                    COGCode: "",
                    "Chart Of Group": "Total",
                    "Opening Balance": hierarchyData?.reduce((sum, val) => sum + (Number(val.Opening) || 0), 0).toFixed(2),
                    "Total Debit": hierarchyData?.reduce((sum, val) => sum + (Number(val.TotalDebit) || 0), 0).toFixed(2),
                    "Total Credit": hierarchyData.reduce((sum, val) => sum + (Number(val.TotalCredit) || 0), 0).toFixed(2),
                    "Running Balance": hierarchyData.reduce((sum, val) => sum + (Number(val.Closing) || 0), 0).toFixed(2),
                }]);

                setTableData([...hierarchyData, {
                    "S.No": "",
                    COGCode: "",
                    "Chart Of Group": "Total",
                    "Opening Balance": hierarchyData?.reduce((sum, val) => sum + (Number(val.Opening) || 0), 0).toFixed(2),
                    "Total Debit": hierarchyData?.reduce((sum, val) => sum + (Number(val.TotalDebit) || 0), 0).toFixed(2),
                    "Total Credit": hierarchyData.reduce((sum, val) => sum + (Number(val.TotalCredit) || 0), 0).toFixed(2),
                    "Running Balance": hierarchyData.reduce((sum, val) => sum + (Number(val.Closing) || 0), 0).toFixed(2),
                }])
            } else {
                notify(apiResp.message, "error")
                setTableData([]);
            }
        } catch (error) {

            setTableData([]);
        }
    };

    // 🏆 **Recursive Function for Toggle Open/Close**
    const toggleChildren = (data, parentId, payload) => {

        return data.map((item) => {
            if (item.id == parentId) {
                if (item?.children?.length > 0) {

                    // 🛑 Already Open → Close it
                    return { ...item, children: [] };
                } else {

                    // ✅ Closed → Fetch Data and Open it
                    return fetchChildrenData(item, payload);
                }
            } else if (item?.children?.length > 0) {
                return { ...item, children: toggleChildren(item.children, parentId, payload) };
            }
            return item;
        });
    };

    // 📡 **Function to Fetch Children from API**
    const fetchChildrenData = (item, payload) => {
        GetTrialBalanceReport(payload).then((apiResp) => {
            if (apiResp?.success) {

                let newChildren = apiResp?.data?.map((value, index) =>
                ({

                    tableDisplay: {
                        "S.No": (<span className='ml-3'>{index + 1}.</span>),
                        subId: value?.COAID,
                        name: value?.COAName,
                        Opening: (
                            <span style={{ color: value.Opening < 0 ? "red" : "green" }}>
                                {value?.Opening.toFixed(2)}
                            </span>
                        ),
                        TotalDebit: (
                            <span style={{ color: value.TotalDebit < 0 ? "red" : "blue" }}>
                                {value?.TotalDebit.toFixed(2)}
                            </span>
                        ),
                        TotalCredit: (
                            <span style={{ color: value.TotalCredit < 0 ? "red" : "blue" }}>
                                {value?.TotalCredit.toFixed(2)}
                            </span>
                        ),
                        Closing: (
                            <span style={{ color: value.Closing < 0 ? "red" : "green" }}>
                                {value?.Closing.toFixed(2)}
                            </span>
                        ),
                    },

                    exportData: {
                        "S.No": <span className='ml-3'>{index + 1}.</span>,
                        subId: value?.COAID,
                        name: value?.COAName,
                        Opening: value?.Opening,
                        TotalDebit: value?.TotalDebit.toFixed(2),
                        TotalCredit: value?.TotalCredit.toFixed(2),
                        Closing: value?.Closing.toFixed(2)
                    }
                    // Amount: value?.Amount,
                    // children: []
                }))

                setTableData((prevData) => updateChildren(prevData, item.id, newChildren.map(d => d.tableDisplay)));

                setExportData((prevData) => updateChildren(prevData, item.id, newChildren.map(d => d.exportData)));

                // setExportData((prevData) => [...prevData, ...newChildren.map(d => d.exportData)]);


            } else {
                notify(apiResp?.message, "error");
            }
        });

        return {
            ...item,
            children: [{ loading: true }] //  Show loading indicator before fetching data
        };
    };

    // 🔄 **Recursive Function to Update Fetched Children**
    const updateChildren = (data, parentId, newChildren) => {
        return data.map((item) => {
            if (item.id == parentId) {
                console.log("caa");

                return { ...item, children: newChildren };
            } else if (item?.children?.length > 0) {
                console.log("ccq");

                return { ...item, children: updateChildren(item.children, parentId, newChildren) };
            }
            return item;
        });
    };



    const handleClick = async (val, type, ind) => {

        if (type === "close" || type === "open") {
            let CenterID = payloadData?.BranchCentre?.map((val) => val.code).join(",");

            if (!CenterID) {
                notify("Branch Center is Required", "error");
                return;
            }
            // Create a new updated payload
            const updatedPayload = {
                ...payload,  // Keep existing values
                acFilterValue: val.id, // Update only acFilterValue
                groupBy: 4,
            };

            // Update state with the new payload
            setPayload(updatedPayload);


            let newBodyData = toggleChildren(tableData, val.id, updatedPayload);
            setExportData(newBodyData)
            setTableData(newBodyData)

        }
    }

    const thead = [
        { width: "10%", name: t("S.No.") },
        { name: t("COGCode"), width: "10%" },
        { name: t("Chart Of Group"), width: "20%" },
        { name: t("Opening Balance"), width: "20%" },
        { name: t("Total Debit"), width: "5%" },
        { name: t("Total Credit"), width: "5%" },
        { name: t("Running Balance"), width: "5%" },
    ]

    const [items, setItems] = useState([]);

    const search = async (event, name) => {
        if (event?.query?.length > 0) {
            const results = filterByTypes(
                reportControlList,
                [3],
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

        if (name === "COG") {
            value.isAccountType = true
            setPayloadData((val) => ({ ...val, ["COG"]: value }))

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

    const handleExportPDF = () => {
        exportHtmlToPDFNoPrint("printSection", "Trail Balance")
    }

    const handleExportExcel = async (exportdata) => {
        console.log(exportData);

        const flattenData = (data, parentSNo = "") => {
            let result = [];

            data?.forEach((val, index) => {
                let isLastRow = index === data.length - 1; // Check if it's the last row

                // let currentSNo = isLastRow ? "" : (parentSNo ? `${parentSNo}.${index + 1}` : String(index + 1)); // Remove index for total row
                // console.log(currentSNo);
                // let isLastRow = val === data.at(-1);

                let hasSingleChild = Array.isArray(val.children) && val.children.length === 1;

                let currentSNo = isLastRow && !parentSNo
                    ? "" // Hide index for last row at the root level
                    : (parentSNo ? `${parentSNo}.${index + 1}` : String(index + 1));
                // Add parent entry
                result.push({
                    "S.No": hasSingleChild ? index + 1 : currentSNo,
                    "COG Code": String(val?.id || val?.subId || ""),
                    "Chart Of Group": String(val?.groupName || val.name || "Total"),
                    "Opening": val?.Opening !== undefined ? Number(val.Opening).toFixed(2) : Number(val["Opening Balance"]).toFixed(2),
                    "Total Debit": val?.TotalDebit !== undefined ? Number(val.TotalDebit) : Number(val["Total Debit"]),
                    "Total Credit": val?.TotalCredit !== undefined ? Number(val.TotalCredit) : Number(val["Total Credit"]),
                    "Closing": val?.Closing !== undefined ? Number(val.Closing) : Number(val["Running Balance"]),

                });

                // If the current entry has children, process them recursively
                if (Array.isArray(val.children) && val.children.length > 0) {

                    result = result.concat(flattenData(val.children, currentSNo)); // Recursive call
                }
            });

            return result;
        };


        let modifyExcel = flattenData(exportdata);
        console.log(modifyExcel);

        exportToExcel(transformDataInTranslate(modifyExcel, t), "Trial Balance Report");

    };
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

                        <div className="col-xl-4 col-md-4 col-sm-6 col-12">
                            <AutoComplete
                                value={payloadData?.COG?.label ? payloadData?.COG?.label : payloadData?.COG}
                                suggestions={items}
                                completeMethod={(e) => { search(e, "COG") }}
                                onChange={(e) => setPayloadData({ ...payloadData, COG: e.value })}
                                className="w-100"
                                onSelect={(e) => validateInvestigation(e, "COG")}
                                id="COG"
                                itemTemplate={itemTemplate}
                            />
                            <label
                                className="label lable truncate ml-3 p-1"
                                style={{ fontSize: "5px !important" }}
                            >
                                {t("Chart Of Group")}

                            </label>
                        </div>
                        {/* <ReactSelect
                            placeholderName={t("Chart Of Group")}
                            id="COG"
                            name="COG"
                            value={payloadData?.COG?.value}
                            removeIsClearable={true}
                            handleChange={(name, value) => setPayloadData((val) => ({ ...val, [name]: value }))}
                            dynamicOptions={filterByTypes(
                                reportControlList,
                                [3],
                                ["TypeID"],
                                "TextField",
                                "ValueField",
                            )}
                            searchable={true}
                            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                        /> */}

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
                            <Heading title={payloadData?.BranchCentre[0] ? payloadData?.BranchCentre[0].name : ""}
                                secondTitle={
                                    <>
                                        <span onClick={handleExportPDF} className='no-print'>
                                            <PDFIconSVG />
                                        </span>

                                        <span onClick={() => handleExportExcel(exportData)} className='no-print'>
                                            <ExcelIconSVG />{" "}
                                        </span>

                                    </>
                                }
                            />
                            <TreeViewTable thead={thead} tbody={tableData} isSNo={true} isTreeOpen={false} handleClick={handleClick} isShowBorder={true} isRemoveArrow={false} />

                        </div>
                    }
                </div>
            </div>
        </>
    )
}

export default TrialBalanceReport;