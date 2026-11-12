import React from 'react'
import moment from 'moment'
import { useTranslation } from "react-i18next";
import { notify } from '../../../utils/ustil2';
import Heading from '../../../components/UI/Heading';
import ReactSelect from '../../../components/formComponent/ReactSelect';
import ColorCodingSearch from '../../../components/commonComponents/ColorCodingSearch';
import Input from '../../../components/formComponent/Input';
import DatePicker from '../../../components/formComponent/DatePicker';
import { getPatientIndentApprovalApi, updatePatientStatusRequisitionApi } from '../../../networkServices/DietApi';
import Tables from '../../../components/UI/customTable';


const statusOptions = [
    { label: "All", value: 0 },
    { label: "Pending", value: 1 },
    { label: "Acknowledged", value: 3 },
    { label: "Rejected", value: 2 },
    { label: "Issued", value: 4 },
    { label: "Received", value: 5 },
];

export default function PatientDietIndentApproval() {
    const [tbodyData, setTbodyData] = React.useState([]);
    const { t } = useTranslation();
    const { VITE_DATE_FORMAT } = import.meta.env;


    const getRowClass = (val) => {
        let newtbody = tbodyData?.find((item) => item?.Id === val?.idNo);
        if (newtbody?.STATUS === 5) {
            return "color-indicator-4-bg";
        } else if (
            newtbody?.STATUS === 2
        ) {
            return "color-indicator-21-bg";
        } else if (newtbody?.STATUS === 3) {
            return "color-indicator-1-bg";
        } else if (newtbody?.STATUS === 4) {
            return "color-indicator-11-bg";
        } else {
            return "color-indicator-22-bg";
        }
    };

    const THEAD = [
        { name: t("S.No"), width: "1%" },
        { name: t("Acknowledge"), width: "10%" },
        { name: t("Reject"), width: "5%" },
        { name: t("Issue"), width: "5%" },
        { name: t("Date"), width: "10%" },
        { name: t("ID No"), width: "15%" },
        { name: t("Indent No"), width: "15%" },
        { name: t("Patient ID"), width: "10%" },
        { name: t("Transaction ID"), width: "10%" },
        { name: t("Patient Name"), width: "10%" },
        { name: t("Ward"), width: "10%" },
        { name: t("Nature of requisition"), width: "10%" },
        { name: t("Diet Des.."), width: "10%" },
        { name: t("Acknowledge By"), width: "15%" },
        { name: t("Acknowledge Date"), width: "10%" },
        { name: t("Rejected By"), width: "10%" },
        { name: t("Issue Req By"), width: "10%" },
        { name: t("Issue By"), width: "10%" },
        { name: t("Issue Date"), width: "10%" },

    ]
    const [values, setValues] = React.useState({
        Reg_no: "",
        status: "",
        fromDate: new Date(),
        toDate: new Date(),
    });
    const handleReactSelectChange = (name, val) => {
        setValues((prev) => ({
            ...prev,
            [name]: val,
        }));
    }
    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues((prev) => ({
            ...prev,
            [name]: value,
        }));
    }
    const handleGetPatientIndentList = async () => {

        const payload = {
            patientId: values?.Reg_no || 0,
            status: values?.status?.value || 0,
            fromDate: values?.fromDate ? moment(values?.fromDate).format("YYYY-MM-DD") : "",
            toDate: values?.toDate ? moment(values?.toDate).format("YYYY-MM-DD") : "",
        }
        try {
            const response = await getPatientIndentApprovalApi(payload);
            if (response?.success) {
                setTbodyData(response?.data);
            } else {
                notify(response?.message ? response?.message : "Something went wrong!", "error");
            }
        } catch (error) {
            notify(error?.message, "error");
        }
    }
    const handleRejectReceiveRequest = async (status, Id) => {
        const payload = {
            Id: Id || 0,
            type: status === "issue" ? 4 : status === "reject" ? 2 : 3,
        }
        try {
            const response = await updatePatientStatusRequisitionApi(payload);
            if (response?.success) {
                notify(response?.message, "success");
                handleGetPatientIndentList();
            } else {
                notify(response?.message || "Something went wrong");
            }
        } catch (error) {
            notify(error?.message, "error");
        }
    }




    return (
        <div>
            <Heading title={""} isBreadcrumb={true} />

            <div className='card '>
                <div className="row p-2">
                    <Input type="text"
                        className="form-control"
                        lable={t("Registration No")}
                        placeholder=" "
                        id="Reg_no"
                        name="Reg_no"
                        onChange={handleChange}
                        value={values?.Reg_no || ""}
                        required={true}
                        respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                    />
                    <ReactSelect
                        placeholderName={t("Status")}
                        name="status"
                        value={`${values?.status}`}
                        handleChange={handleReactSelectChange}
                        dynamicOptions={statusOptions}
                        searchable={true}
                        id={"status"}
                        respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                        removeIsClearable={true}
                    />
                    <DatePicker
                        className="custom-calendar"
                        respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                        id="fromDate"
                        name="fromDate"
                        value={
                            values.fromDate
                                ? moment(values?.fromDate, "YYYY-MM-DD").toDate()
                                : null
                        }
                        handleChange={handleChange}
                        lable={t("From Date")}
                        placeholder={VITE_DATE_FORMAT}
                    />
                    <DatePicker
                        className="custom-calendar"
                        respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                        id="toDate"
                        name="toDate"
                        value={
                            values.toDate
                                ? moment(values?.toDate, "YYYY-MM-DD").toDate()
                                : null
                        }
                        handleChange={handleChange}
                        lable={t("To Date")}
                        placeholder={VITE_DATE_FORMAT}
                    />



                    <button
                        className="btn btn-primary ml-2"
                        type="button"
                        onClick={handleGetPatientIndentList}
                    >
                        {t("Search")}
                    </button>

                </div>
            </div>

            {tbodyData?.length > 0 && (
                <div className='d-flex justify-content-end align-items-center m-2'>
                    <ColorCodingSearch color={"color-indicator-4-bg"} label={t("Yellow For Complete")} />
                    <ColorCodingSearch color={"color-indicator-22-bg"} label={t("Light Blue For Issue Requested")} />
                    <ColorCodingSearch color={"color-indicator-1-bg"} label={t("Acknowledge Light Green")} />
                    <ColorCodingSearch color={"color-indicator-21-bg"} label={t("Rejected Pink")} />
                    <ColorCodingSearch color={"color-indicator-11-bg"} label={t("Issued Pink")} />

                </div>
            )}

            {tbodyData?.length > 0 && (
                <Tables

                    thead={THEAD}
                    tbody={tbodyData?.map((item, index) => ({
                        sno: index + 1,
                        acknowledge: item?.CanAcknowledge === 1 ? (
                            <button
                                className="btn btn-primary"
                                type="button"
                                disabled={item?.CanAcknowledge === 1 ? false : true}
                                onClick={() => {
                                    handleRejectReceiveRequest("acknowledge", item?.Id);
                                }}
                            >
                                <i className='fas fa-check'></i>
                            </button>
                        ) : "-",
                        reject: item?.CanReject === 1 ? (
                            <button
                                className="btn btn-secondary text-danger"
                                disabled={item?.CanReject === 1 ? false : true}
                                type="button"
                                onClick={() => {
                                    handleRejectReceiveRequest("reject", item?.Id);
                                }}
                            >
                                <i className='fas fa-times'></i>
                            </button>
                        ) : "-",
                        issue: item?.CanIssue === 1 ? (
                            <div className='d-flex justify-content-center align-items-center'>
                                <button
                                    className="btn btn-primary"
                                    type="button"
                                    disabled={item?.CanIssue === 1 ? false : true}
                                    onClick={() => {
                                        handleRejectReceiveRequest("issue", item?.Id);
                                    }}
                                >
                                    <i className='fas fa-check'></i>
                                </button>
                            </div>
                        ) : "-",
                        entryDate: item?.EntryDate ? moment(item?.EntryDate).format("DD/MM/YYYY hh:mm A") : "-",
                        idNo: item?.Id || "-",
                        indentNo: item?.IndentNo || "-",
                        patientId: item?.PatientId || "-",
                        transactionId: item?.IpdNo || "-",
                        patientName: item?.PatientName || "-",
                        Ward: item?.WardName || "-",
                        natureOfRequest: item?.NatureOfReqName || "-",
                        dietDescription: item?.Description || "-",
                        acknowledgeBy: item?.AcknowledgeBy || "-",
                        acknowledgeDate: item?.AcknowledgeDate ? moment(item?.AcknowledgeDate).format("DD/MM/YYYY hh:mm A") : "-",
                        rejectedBy: item?.RejectedBy || "-",
                        issueReqBy: item?.IssueRequestedBy || "-",
                        issueBy: item?.IssueBy || "-",
                        IssueDate: item?.IssuedDate ? moment(item?.IssuedDate).format("DD/MM/YYYY hh:mm A") : "-"

                    }))}
                    getRowClass={getRowClass}
                    tableHeight={"scrollView"}
                // style={!isMobile ? { height: "44vh" } : {}}
                />

            )}


        </div>
    )
}
