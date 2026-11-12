import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next';
import { BindReportControlsAPI } from '../../../networkServices/finance';
import { useSelector } from 'react-redux';
import Heading from '../../../components/UI/Heading';
import MultiSelectComp from '../../../components/formComponent/MultiSelectComp';
import ReactSelect from '../../../components/formComponent/ReactSelect';
import { filterByTypes } from '../../../utils/utils';
import DatePicker from '../../../components/formComponent/DatePicker';
import moment from 'moment';

import { buildHierarchyTree } from '../../../utils/ustil2';

const AccountReceibleAgingDetails = () => {
    const [t] = useTranslation()
    const [payloadData, setPayloadData] = useState({
        Currency: { label: "INR", value: "INR" }, 
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
    console.log(reportControlList);
    
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
    const handleSearch = async () => {
         let data = {
                    ACFilterType: 3,
                    ACFilterValue: 0,
                    CentreID: String(payloadData?.BranchCentre[0]?.code || ""),
                    CurrencyCode: payloadData?.Currency?.value || "",
                    FYID: Number(payloadData?.FinancialYear?.value || 1),
                    FYText: payloadData?.FinancialYear?.label || "",
                    FromDate: moment(payloadData?.fromDate).format("YYYY-MM-DD") || "",
                    ToDate: moment(payloadData?.toDate).format("YYYY-MM-DD") || "",
                    FYStartEndDate: payloadData?.FinancialYear?.label?.split(":")[1]?.split(" - ").map(date => moment(date, "DD-MMM-YYYY").format("YYYY-MM-DD")).join("#"),
                    // FYStartEndDate: "2024-04-01#2025-03-31",
                    reportType: 1,
                    ReportName: "Trial Balance",
                    GroupBy: 3,
                };
    }
    return (
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
                        id="COA"
                        name="COA"
                        value={payloadData?.COG?.value}
                        removeIsClearable={true}
                        handleChange={(name, value) => setPayloadData((val) => ({ ...val, [name]: value }))}
                        dynamicOptions={filterByTypes(
                            reportControlList
                            .filter(item=>item?.TextField?.includes("Hospital A/C")),
                            [4],
                            ["TypeID"],
                            "TextField",
                            "ValueField",
                        )}
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
            </div>
        </div>
    )
}

export default AccountReceibleAgingDetails;