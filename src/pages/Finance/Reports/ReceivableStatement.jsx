import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next';
import { BindReportControlsAPI } from '../../../networkServices/finance';
import { useSelector } from 'react-redux';
import Heading from '../../../components/UI/Heading';
import MultiSelectComp from '../../../components/formComponent/MultiSelectComp';
import ReactSelect from '../../../components/formComponent/ReactSelect';
import { filterByTypes, notify } from '../../../utils/utils';
import DatePicker from '../../../components/formComponent/DatePicker';
import moment from 'moment';

const ReceivableStatement = () => {
    const [t] = useTranslation()
    const [payloadData, setPayloadData] = useState({
        fromDate: new Date,
        toDate: new Date,
    });
    const [reportControlList, setReportControlList] = useState([])
    const { GetEmployeeWiseCenter } = useSelector((state) => state.CommonSlice);
    const { VITE_DATE_FORMAT } = import.meta.env;
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
    const handleSearch = () => {
        console.log(payloadData);
        if (!payloadData?.FinancialYear?.label) {
            notify("fill the required fields", "error")
        }
    }
    return (
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
                        placeholderName={t("Insurance")}
                        id="Insurance"
                        name="Insurance"
                        value={payloadData?.Insurance?.value}
                        removeIsClearable={true}
                        handleChange={(name, value) => setPayloadData((val) => ({ ...val, [name]: value }))}
                        // dynamicOptions={filterByTypes(
                        //     reportControlList,
                        //     [1],
                        //     ["TypeID"],
                        //     "TextField",
                        //     "ValueField",
                        // )}
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

export default ReceivableStatement;