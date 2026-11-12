import React, { useEffect, useRef, useState } from 'react'
import Heading from '../../../components/UI/Heading'
import MultiSelectComp from '../../../components/formComponent/MultiSelectComp'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { BindReportControlsAPI, GetBalanceSheetReport } from '../../../networkServices/finance'
import ReactSelect from '../../../components/formComponent/ReactSelect'
import { filterByTypes, notify } from '../../../utils/utils'
import { useLocalStorage } from '../../../utils/hooks/useLocalStorage'
import TreeViewTable from '../../../components/UI/customTable/TreeViewTable'
import { buildHierarchyTree, formatAmount } from '../../../utils/ustil2'
import { ExcelIconSVG, PDFIconSVG } from '../../../components/SvgIcons'
import IconsColor from '../../../utils/IconsColor'
import { transformDataInTranslate } from '../../../components/WrapTranslate'
import { exportHtmlToPDF, exportHtmlToPDFNoPrint, exportToExcel } from '../../../utils/exportLibrary'
import html2pdf from "html2pdf.js";
export default function Index() {
    const userData = useLocalStorage("userData", "get")
    const [t] = useTranslation()
    const [payloadData, setPayloadData] = useState({ BranchCentre: [{ code: Number(userData?.defaultCentre ? userData?.defaultCentre : 0), name: userData?.centreName }] });
    const [reportControlList, setReportControlList] = useState([])
    const [tbodyData, setTbodyData] = useState([])
    const { GetEmployeeWiseCenter } = useSelector((state) => state.CommonSlice);
    const getBindReportControls = async () => {
        let apiResp = await BindReportControlsAPI()
        if (apiResp?.success) {
            setReportControlList(apiResp?.data);
        } else {
            setReportControlList([])
        }
    }

    const handleSumCurrentYear = (data, GroupCode, type) => {
        let amount = data?.reduce((initial, item) => {
            if ((item?.GroupCode?.slice(0, -3) === GroupCode) || (item?.GroupCode?.slice(0, -6) === GroupCode)) {
                initial += Number(item[type] ? item[type] : 0);
            }
            return initial;
        }, 0)
        return amount
    }

    function processData(data) {
        let result = []
        let parent = {}
        let CurrentYeartotalAmt = 0
        let LastYeartotalAmt = 0
        let totalCurrentYearEquityLibilitiesAmt = 0
        let totalLastYearEquityLibilitiesAmt = 0
        data.forEach((item, index) => {
            if (!item?.isHideId) {
                CurrentYeartotalAmt += item?.CurrentYearValue
                LastYeartotalAmt += item?.LastYearValue
            }
            if (!item?.isHideId && item?.GroupCode[0] === "5" || item?.GroupCode[0] === "2") {
                totalCurrentYearEquityLibilitiesAmt += item?.CurrentYearValue
                totalLastYearEquityLibilitiesAmt += item?.LastYearValue
            }
            if (index === data?.length - 1) {
                let total = {
                    GroupName: `CHECK/VARIANCE`,
                    GroupCode: eval(item?.GroupCode),
                    LastYearValue: LastYeartotalAmt,
                    isHideId: true,
                    CurrentYearValue: CurrentYeartotalAmt
                }
                let totalEquityLibilities = {
                    GroupName: `TOTAL EQUITY & LIABILITIES`,
                    GroupCode: eval(item?.GroupCode + 1),
                    LastYearValue: totalLastYearEquityLibilitiesAmt,
                    isHideId: true,
                    CurrentYearValue: totalCurrentYearEquityLibilitiesAmt
                }
                result.push(totalEquityLibilities, total)
            }



            if (item?.GroupCode?.length === 1) {
                if (parent?.GroupCode !== undefined && item?.GroupCode !== parent?.parent) {
                    result.push(parent)
                }
                parent = {
                    GroupName: `Total ${item?.GroupName}`,
                    GroupCode: eval(item?.GroupCode + 1),
                    LastYearValue: 0,
                    isHideId: true,
                    CurrentYearValue: 0
                }
            }
            parent.CurrentYearValue += item?.CurrentYearValue
            parent.LastYearValue += item?.LastYearValue


            if (item?.IsLast === 1 && (item?.GroupCode?.slice(0, -3) !== data[index + 1]?.GroupCode?.slice(0, -3))) {
                let findData = data?.find((val) => val?.GroupCode === item?.GroupCode.slice(0, -3))
                let obj = {
                    GroupName: `Total ${findData?.GroupName}`,
                    GroupCode: String(Number(item?.GroupCode) + 1),
                    LastYearValue: handleSumCurrentYear(data, findData?.GroupCode, "LastYearValue"),
                    isHideId: true,
                    CurrentYearValue: handleSumCurrentYear(data, findData?.GroupCode, "CurrentYearValue")
                }
                result.push(item)
                result.push(obj)
            } else {
                result.push(item)
            }
        })
        return result;
    }

    const handleColorUsingLength = (code) => {
        if (code === 1) {
            return "colorlength1"
        } else if (code === 2) {
            return "colorlength1"
        } else if (code === 4 || code === 5) {
            return "colorlength4"
        } else if (code === 7) {
            return "colorlength7"
        } else if (code === 10) {
            return "colorlength10"
        }

    }
    const handleSearch = async () => {
        let centreID = payloadData?.BranchCentre?.map((item) => {
            return item.code
        }).join(",")
        let payload = {
            "centreID": centreID,
            "fyid": Number(FinancialYear?.value ? FinancialYear?.value : 0),
            "fyText": Number(FinancialYear?.label ? FinancialYear?.label : ""),
            // "fyStartEndDate": payloadData?.FinancialYear?.label?.split(":")[1]?.split(" - ").join("#"),
            "fyStartEndDate": payloadData?.FinancialYear?.extraColomn,
            "reportType": 1,
            "reportName": "Balance Sheet"
        }
        let apiResp = await GetBalanceSheetReport(payload)
        if (apiResp?.success) {
            let newData = processData(apiResp?.data)
            let date = {}
            const newResp = newData?.map((val, index) => {
                if (index === 0) {
                    date.LastYearEndDate = val?.LastYearEndDate
                    date.CurrentEndDate = val?.CurrentEndDate
                }
                return {
                    ...val,
                    GroupName: { name: <span className={`${handleColorUsingLength(String(val?.GroupCode)?.length)} `} >{val?.GroupName} </span>, isHideId: val?.isHideId },
                    CurrentYearValue: <span className={`${handleColorUsingLength(String(val?.GroupCode)?.length)} `}>{val?.CurrentYearValue ? formatAmount(val?.CurrentYearValue) : ""}</span>,
                    LastYearValue: <span className={`${handleColorUsingLength(String(val?.GroupCode)?.length)} `}>{val?.LastYearValue ? val?.LastYearValue : "0.00"}</span>
                }
            })
            setPayloadData((val) => ({ ...val, ...date, ReportData: newData }))
            let data = buildHierarchyTree(newResp, ["CurrentYearValue", "LastYearValue"])
            setTbodyData(data)
        } else {
            setTbodyData([])
            notify(apiResp?.message, "error")
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
    const handleExportExcel = () => {
        let reprortData = payloadData?.ReportData?.map((val) => {
            return {
                "COG Code": !val?.isHideId ? val?.GroupCode : "",
                "COG Name": val?.GroupName,
                [payloadData?.CurrentEndDate]: val?.CurrentYearValue,
                [payloadData?.LastYearEndDate]: val?.LastYearValue,
            }
        })
        exportToExcel(transformDataInTranslate(reprortData, t), t("Statement of Financial Position (Balance Sheet)"))
    }

    const handleExportPDF = () => {
        exportHtmlToPDFNoPrint("printSection", "Balance Sheet")
    }
    console.log(GetEmployeeWiseCenter);
    
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
                                "TypeCode"
                            )}
                            searchable={true}
                            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                        />
                        <div className="col-xl-1 col-md-1 col-sm-2 col-3  mb-2">
                            <button className="btn btn-sm btn-primary  w-100   " type="button" onClick={handleSearch}>
                                {t("Search")}
                            </button>
                        </div>
                    </div>
                    {tbodyData?.length > 0 &&
                        <div id="printSection">
                            <Heading isBreadcrumb={false} title={t("Statement of Financial Position (Balance Sheet)")} secondTitle={(<>

                                <span onClick={handleExportPDF} className='no-print'>
                                    <PDFIconSVG />
                                </span>

                                <span
                                    onClick={handleExportExcel}
                                    className='no-print'
                                >
                                    <ExcelIconSVG />{" "}
                                </span>

                            </>)} />

                            <style>

                            </style>

                            <TreeViewTable thead={[t("COG Code"), t("COG Name"), payloadData?.CurrentEndDate, payloadData?.LastYearEndDate]} tbody={[...tbodyData,]} isSNo={false} isTreeOpen={true} isRemoveArrow={false} isShowBorder={true} />
                        </div>
                    }
                </div>
            </div>

        </>
    )
}
