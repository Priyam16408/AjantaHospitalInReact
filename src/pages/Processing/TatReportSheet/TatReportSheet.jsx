import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Heading from "../../../components/UI/Heading";
import moment from "moment";
import DatePicker from "../../../components/formComponent/DatePicker";
import { ProvisionalTatReport } from "../../../networkServices/resultEntry";
import Tables from "../../../components/UI/customTable";
import { exportToExcel } from "../../../utils/exportLibrary";
import { notify } from "../../../utils/ustil2";
const provitionalTatReportSheet = () => {
    const [t] = useTranslation();
    const [tatData, setTatData] = useState([]);

    const [values, setValues] = useState({
        fromDate: moment(new Date()).toDate(),
        toDate: moment(new Date()).toDate(),
        department: { value: "", label: "ALL" },
        type: { value: "s", label: "On Screen" },
    })
    // const statusType = [
    //     { value: "s", label: "On Screen" },
    //     { value: "excel", label: "Excel" },
    // ];

    const { VITE_DATE_FORMAT } = import.meta.env;
    const handleChange = (e) => {
        setValues((val) => ({ ...val, [e.target.name]: e.target.value }));
    };

    const handlePrintPendingList = async (type) => {
        if (type === "excel") {
            exportToExcel(
                tatData?.map((val, index) => ({
                    sno: index + 1,
                    BarcodeNo: val?.BarcodeNo,
                    UHIDNo: val?.PatientID,
                    PatientName: val?.PName,
                    AgeSex: val?.Age_Gender,
                    BookingCenter: val?.Centre,
                    "Investigation Name": val?.InvestigationName,
                    "Bill Date": val?.BillDate,
                    "Doctor": val?.Doctor,
                    "Sample Collection Date": val?.SampleCollectionDate,
                    "Sample Collection TAT": val?.SampleCollectionTAT,
                    "Sample Receive Date": val?.SampleReceiveDate,
                    "Sample ReceiveTAT": val?.SampleReceiveTAT,
                    "Mark View By": val?.MarkViewBy,
                    "Provisional Date": val?.ProvisionalDate,
                    "Approved Date": val?.ApprovedDate,
                    "Tat Time": val?.TatTime,

                })),
                "Provisional Tat Report",
                "",
                "Provisional Tat Report",
                "Provisional Tat Report"
            );
        }
    }


    const handleSearchTatReport = async () => {
        const data = {
            fromDate: moment(values?.fromDate).format("DD-MMM-YYYY"),
            toDate: moment(values?.toDate).format("DD-MMM-YYYY"),
        }
        try {
            const apiResp = await ProvisionalTatReport(data);
            if (apiResp?.success) {
                setTatData(apiResp?.data)
            } else {
                notify(apiResp?.message, "error");
                setTatData([]);
            }
        } catch (error) {
            notify("An error occurred while fetching data", "error");
            setTatData([]);
        }
    }
    // const ExceldataFormatter = (tatData) => {
    //     const HardCopy = JSON.parse(JSON.stringify(tatData));
    //     const modifiedResponseData = HardCopy?.map((ele, index) => {
    //         delete ele?.TypeID;
    //         delete ele?.TypeName;
    //         delete ele?.DetailID;
    //         delete ele?.ColorCode;
    //         delete ele?.Gender;
    //         delete ele?.isrerun;
    //         delete ele?.ReferLab;
    //         delete ele?.LedgerTransactionNo;
    //         delete ele?.SampleLocation;
    //         delete ele?.CombinationSample;
    //         delete ele?.Centre;
    //         delete ele?.AGE_in_Days;
    //         delete ele?.DATE;
    //         delete ele?.RemarkStatus;
    //         delete ele?.DocumentStatus;
    //         delete ele?.isChecked;
    //         delete ele?.colorcode;
    //         delete ele?.markStatus;
    //         delete ele?.ReferLab;
    //         delete ele?.SampleLocation;
    //         delete ele?.Samplerequestdate;
    //         delete ele?.TATDelay;
    //         delete ele?.TATIntimate;
    //         delete ele?.TatDelayinSecond;
    //         delete ele?.Urgent;
    //         delete ele?.isrerun;
    //         delete ele?.Test_ID;
    //         delete ele?.TimeDiff;
    //         delete ele?.Acutalwithdrawdate;
    //         delete ele?.Admission_Type;
    //         delete ele?.Comments;
    //         delete ele?.DevationTime;
    //         delete ele?.ObservationType_Id;
    //         delete ele?.CombinationSampleDept;
    //         delete ele?.srno;

    //         return { ...ele };
    //     });

    //     return modifiedResponseData;
    // };

    const theadTatReportDetail = [
        { width: "5%", name: t("SNo") },
        { width: "15%", name: t("Barcode No") },
        { width: "15%", name: t("UHID No") },
        { width: "10%", name: t("Patient Name") },
        { width: "10%", name: t("Pannel NAme") },
        { width: "15%", name: t("Age/Sex") },
        { width: "15%", name: t("Booking Center") },
        { width: "15%", name: t("Investigation Name") },
        { width: "15%", name: t("Bill Date") },
        { width: "15%", name: t("Doctor") },
        { width: "15%", name: t("Sample Collection Date") },
        { width: "15%", name: t("Sample Collection TAT") },
        { width: "15%", name: t("Sample Receive Date") },
        { width: "15%", name: t("Sample Receive TAT") },
        { width: "15%", name: t("MarkViewBy") },
        { width: "15%", name: t("Provisional Date") },
        // { width: "15%", name: t("Status") },
        { width: "15%", name: t("Approved Date") },
        { width: "15%", name: t("Tat Time") },

    ]
    const getTatMinutes = (timeStr) => {
        if (!timeStr) return 0;
        const [hours, minutes, seconds] = timeStr?.split(":").map(Number);
        return hours * 60 + minutes + seconds / 60;
    };

    const tatMinutes = getTatMinutes(tatData?.TatTime);
    const tatColor = tatMinutes > 50 ? "text-danger" : "text-warning";
    return (
        <div className="m-2 spatient_registration_card card">
            <Heading title={t("heading")} isBreadcrumb={true} />
            <div className="row row-cols-lg-5 row-cols-md-2 row-cols-1 p-2">

                <DatePicker
                    id="fromDate"
                    className="custom-calendar"
                    name="fromDate"
                    lable={t("FromDate")}
                    value={values?.fromDate || new Date()}
                    handleChange={handleChange}
                    placeholder={VITE_DATE_FORMAT}
                    respclass={"col-xl-2 col-md-4 col-sm-4 col-12"}
                />

                <DatePicker
                    className="custom-calendar"
                    id="toDate"
                    name="toDate"
                    value={values?.toDate || new Date()}
                    handleChange={handleChange}
                    lable={t("ToDate")}
                    placeholder={VITE_DATE_FORMAT}
                    respclass={"col-xl-2 col-md-4 col-sm-4 col-12"}
                />

                {/* <ReactSelect
                    placeholderName={t("type")}
                    id={"type"}
                    searchable={true}
                    removeIsClearable={true}
                    respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                    dynamicOptions={statusType}
                    handleChange={handleSelect}
                    value={`${values?.type?.value}`}
                    name={"type"}
                /> */}

                <div className="d-flex col-xl-2 col-md-4 col-sm-4 col-12">
                    <button
                        className="btn btn-sm btn-success"
                        type="button"
                        onClick={handleSearchTatReport}
                    >
                        {t("Search")}
                    </button>
                    {tatData?.length > 0 && (
                        <button
                            className="btn btn-sm btn-primary ml-2"
                            type="button"
                            onClick={() => handlePrintPendingList("excel")}
                        >
                            {t("Print Excel")}
                        </button>)
                    }
                </div>
            </div>


            <div className="card table-responsive">
                {
                    <Tables
                        thead={theadTatReportDetail}
                        tbody={tatData?.map((val, index) => ({
                            sno: index + 1,
                            BarcodeNo: val?.BarcodeNo,
                            UHIDNo: val?.PatientID,
                            PatientName: val?.PName,
                            PanelName: val?.PanelName,
                            AgeSex: val?.Age_Gender,
                            BookingCenter: val?.Centre,
                            "Investigation Name": val?.InvestigationName,
                            "Bill Date": val?.BillDate,
                            "Doctor": val?.Doctor,
                            SampleCollectionDate: val?.SampleCollectionDate,
                            SampleCollectionTAT: val?.SampleCollectionTAT,
                            SampleReceiveDate: val?.SampleReceiveDate,
                            SampleReceiveTAT: val?.SampleReceiveTAT,
                            "MarkViewBy": val?.MarkViewBy,
                            "Provisional Date": val?.ProvisionalDate,
                            // "Status":val.Status,
                            "Approved Date": val?.ApprovedDate,
                            "Tat Time": (

                                <strong
                                    className={tatColor}
                                >
                                    {val?.TatTime}
                                </strong>
                            )
                        }))
                        }
                        style={{ height: "68vh", padding: "0px" }}
                        tableHeight={"scrollView"}
                    />
                }
            </div>
        </div>
    )
}

export default provitionalTatReportSheet;