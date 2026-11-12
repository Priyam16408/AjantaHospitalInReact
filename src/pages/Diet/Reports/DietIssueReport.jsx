import React, { useEffect, useState } from 'react'
import Heading from '../../../components/UI/Heading';
import { useTranslation } from 'react-i18next';
import DatePicker from '../../../components/formComponent/DatePicker';
import Input from '../../../components/formComponent/Input';
import ReactSelect from '../../../components/formComponent/ReactSelect';
import { BindWard } from '../../../networkServices/EDP/pragyaedp';
import { dietReportApi } from '../../../networkServices/DietApi';
import moment from 'moment';
import { notify } from '../../../utils/ustil2';
import { RedirectURL } from '../../../networkServices/PDFURL';
import { exportToExcel } from '../../../utils/exportLibrary';
const DietIssueReport = () => {
    const { t } = useTranslation();
    const { VITE_DATE_FORMAT } = import.meta.env;
    const [PateintWard, setPateintWard] = useState();

    const [values, setValues] = useState({
        regNo: "",
        patientID: "",
        ipdNo: "",
        ward: "",
        toDate: new Date(),
        fromDate: new Date(),
        groupBy: "0",
        reportType: "0",
        isDiet: "2",
        formatType: "0"
    })


    const handleGetWards = async () => {
        try {
            const apiResp = await BindWard();
            if (apiResp.success) {
                const mappedOptions = apiResp?.data?.map(item => ({
                    value: item?.IPDCaseTypeID,
                    label: item?.Name
                }));
                setPateintWard(mappedOptions);
            } else notify(apiResp.message, "error");
        } catch (error) {
            notify(error?.message || "Something went wrong!", "error");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues((val) => ({ ...val, [name]: value }))
    };

    const handleSelect = (name, value) => {
        setValues((prev) => ({ ...prev, [name]: value }));
    };

    useEffect(() => {
        handleGetWards()
    }, [])

    const handleSearchReport = async () => {
        try {
            // if (!values?.groupBy) {
            //     notify("Please select group type", "warn")
            //     return;
            // }
            // if (!values?.reportType) {
            //     notify("Please select Report type", "warn")
            //     return;
            // }
            // if (!values?.isDiet) {
            //     notify("Please select isDiet type", "warn")
            //     return;
            // }
            // if (!values?.formatType) {
            //     notify("Please select format type", "warn")
            //     return;
            // }
            const payload = {
                patientID: values?.regNo ? values?.regNo : "",
                patientName: values?.patientName ? values?.patientName : "",
                ipdno: values?.ipdNo ? values?.ipdNo : "",
                wardId: values?.ward?.value ? values?.ward?.value : "",
                fromDate: moment(values?.fromDate).format("DD-MMM-YYYY"),
                toDate: moment(values?.toDate).format("DD-MMM-YYYY"),
                groupBy: Number(values?.groupBy?.value ?? values?.groupBy ?? null),
                reportType: Number(values?.reportType?.value ?? values?.reportType ?? null),
                isDiet: Number(values?.isDiet?.value ?? values?.isDiet ?? null),
                format: Number(values?.formatType?.value ?? values?.formatType ?? null),
            }
            const response = await dietReportApi(payload);
            if (response?.success) {
                if (values?.formatType?.value == 0 || values?.formatType == 0) {
                    RedirectURL(response?.data);
                } else {

                    exportToExcel(
                        response?.data,
                        response?.message,
                        "",
                        "Diet_Issue_Report",
                        "Diet_Issue_Report"
                    );
                }
            } else {
                notify(response?.message, "error")
            }
        } catch (error) {
            notify(error?.message);
        }
    }
    return (
        <div className="mt-2 card">
            <Heading isBreadcrumb={true} />
            <div className="row p-2">
                <Input
                    type="text"
                    className="form-control"
                    lable={t("UHID")}
                    placeholder=""
                    name="regNo"
                    id="regNo"
                    value={values?.regNo}
                    respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                    onChange={handleChange}
                />
                <Input
                    type="text"
                    className="form-control"
                    lable={t("Patient Name")}
                    placeholder=""
                    name="patientName"
                    id="patientName"
                    value={values?.patientName}
                    respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                    onChange={handleChange}
                />
                <Input
                    type="text"
                    className="form-control"
                    lable={t("Ipd No")}
                    placeholder=""
                    name="ipdNo"
                    id="ipdNo"
                    value={values?.ipdNo}
                    respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                    onChange={handleChange}
                />
                <ReactSelect
                    placeholderName={t("Room Ward")}
                    searchable={true}
                    respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                    id="ward"
                    name="ward"
                    removeIsClearable={false}
                    dynamicOptions={PateintWard}
                    handleChange={handleSelect}
                    value={values?.ward}
                />

                <DatePicker
                    className="custom-calendar"
                    id="fromDate"
                    name="fromDate"
                    lable={t("From Date")}
                    placeholder={VITE_DATE_FORMAT}
                    respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                    value={values?.fromDate ? values?.fromDate : new Date()}
                    maxDate={new Date()}
                    handleChange={handleChange}
                />

                <DatePicker
                    className="custom-calendar"
                    respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                    id="toDate"
                    name="toDate"
                    value={values?.toDate ? values?.toDate : new Date()}
                    handleChange={handleChange}
                    lable={t("To Date")}
                    maxDate={new Date()}
                    placeholder={VITE_DATE_FORMAT}
                />

                <ReactSelect
                    placeholderName={t("Group By")}
                    searchable={true}
                    respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                    id="GroupBy"
                    name="groupBy"
                    removeIsClearable={true}
                    dynamicOptions={[
                        { label: "Room Wise", value: "0" },
                        { label: "Type Of Diet Wise", value: "1" }
                    ]}
                    handleChange={handleSelect}
                    value={values?.groupBy}
                />

                <ReactSelect
                    placeholderName={t("report Type")}
                    searchable={true}
                    respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                    id="reportType"
                    name="reportType"
                    removeIsClearable={true}
                    dynamicOptions={[
                        { label: "Summary Report", value: "0" },
                        { label: "Detail Report", value: "1" }
                    ]}
                    handleChange={handleSelect}
                    value={values?.reportType}
                />
                <ReactSelect
                    placeholderName={t("Is Diet")}
                    searchable={true}
                    respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                    id="isDiet"
                    name="isDiet"
                    removeIsClearable={true}
                    dynamicOptions={[
                        { label: "Include No Diet", value: "2" },
                        { label: "No Diet Patient", value: "1" },
                        { label: "Exclude No Diet Patient", value: "0" },
                    ]}
                    handleChange={handleSelect}
                    value={values?.isDiet}
                />

                <ReactSelect
                    placeholderName={t("Format Type")}
                    searchable={true}
                    respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                    id="formatType"
                    name="formatType"
                    removeIsClearable={true}
                    dynamicOptions={[
                        { label: "PDF", value: "0" },
                        { label: "EXCEL", value: "1" },
                    ]}
                    handleChange={handleSelect}
                    value={values?.formatType}
                />
                <div className="text-right">
                    <button className="btn btn-sm btn-success ml-2" type="button" onClick={handleSearchReport}>
                        {t("Report")}
                    </button>
                </div>

            </div>
        </div>
    )
}

export default DietIssueReport;