import React,{useState,useEffect} from 'react'
import moment from 'moment'
import { useTranslation } from "react-i18next";
import Heading from "../UI/Heading";
import ReactSelect from "../formComponent/ReactSelect";
import TextAreaInput from "../formComponent/TextAreaInput";
import { notify } from '../../utils/ustil2';
import Tables from '../UI/customTable';
import { getPatientRequestListApi, getPatientRequestTypeApi, SavePatientRequestApi, updatePatientStatusRequisitionApi } from '../../networkServices/DietApi';
import ColorCodingSearch from '../commonComponents/ColorCodingSearch';

export default function PatientDietRequest(props) {
    const { patientID, ipdno, transactionID } = props?.data || {};
    const [requestList, setRequestList] = useState([]);
    const [requestType, setRequestType] =useState([]);
    const { t } = useTranslation();

    const getRowClass = (val) => {
        let newtbody = requestList?.find((item) => item?.Id === val?.idNo);
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
        { name: t("ID No"), width: "15%" },
        { name: t("Indent No"), width: "15%" },
        { name: t("Nature of request"), width: "10%" },
        { name: t("Diet Des.."), width: "10%" },
        { name: t("Acknowledge By"), width: "15%" },
        { name: t("Rejected By"), width: "10%" },
        { name: t("Issue Req By"), width: "10%" },
        { name: t("Issue By"), width: "10%" },
        { name: t("Date"), width: "10%" },
        { name: t("Reject"), width: "5%" },
        { name: t("Receiving Click"), width: "5%" },



    ]
    const [values, setValues] = useState({
        requestType: '',
        dietDescription: "",
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
    const handleGetPatientRequestType = async () => {
        try {
            const response = await getPatientRequestTypeApi();
            if (response?.success) {
                setRequestType(response?.data?.map((item) => ({
                    label: item?.Text,
                    value: item?.Value,
                })));
            } else {
                notify(response?.message || "Something went wrong");
            }
        } catch (error) {
            notify(error?.message, "error");
        }
    }
    const handleGetPatientRequestList = async () => {
        try {
            const response = await getPatientRequestListApi(transactionID);
            if (response?.success) {
                setRequestList(response?.data);
            } else {
                notify(response?.message || "Something went wrong");
            }
        } catch (error) {
            notify(error?.message, "error");
        }
    }
    const handleRejectReceiveRequest = async (status, Id) => {
        const payload = {
            Id: Id || 0,
            type: status === "receive" ? 5 : 2,
        }
        try {
            const response = await updatePatientStatusRequisitionApi(payload);
            if (response?.success) {
                notify(response?.message, "success");
                handleGetPatientRequestList();
            } else {
                notify(response?.message || "Something went wrong");
            }
        } catch (error) {
            notify(error?.message, "error");
        }
    }
    const handleSaveRequest = async () => {
        if (!values?.requestType?.value) {
            notify("Request Type is required", "error");
            return;
        }
        if (!values?.dietDescription) {
            notify("Diet Description is required", "error");
            return;
        }
        const payload = {
            transactionID: transactionID || 0,
            patientID: patientID || "string",
            ipdno: ipdno || "string",
            natureOfRequestName: values?.requestType?.label || "",
            natureOfRequestId: values?.requestType?.value || "",
            Description: values?.dietDescription || "",


        }
        try {
            const response = await SavePatientRequestApi(payload);
            if (response?.success) {
                notify(response?.message, "success");
                setValues({
                    requestType: '',
                    dietDescription: "",

                });
                handleGetPatientRequestList();
            } else {
                notify(response?.message || "Something went wrong");
            }
        } catch (error) {
            notify(error?.message, "error");
        }

    }

    useEffect(() => {
        handleGetPatientRequestList();
        handleGetPatientRequestType();
    }, []);


    return (
        <div>
            <Heading title={"Request Lists"} isBreadcrumb={false} />

            <div className='card '>
                <div className="row p-2">
                    <ReactSelect
                        placeholderName={t("Select Request Type")}
                        name="requestType"
                        value={`${values?.requestType}`}
                        handleChange={handleReactSelectChange}
                        dynamicOptions={requestType}
                        searchable={true}
                        id={"requestType"}
                        respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                        removeIsClearable={true}
                    />
                    <TextAreaInput className='form-control' respclass="col-xl-2 col-md-4 col-sm-4 col-12" lable='Description' maxLength={200} name="dietDescription" rows={3} value={values?.dietDescription} onChange={handleChange} />


                    <button
                        className="btn btn-primary ml-2"
                        type="button"
                        onClick={handleSaveRequest}
                    >
                        {t("Save")}
                    </button>

                </div>
            </div>

            {requestList?.length > 0 && (
                <div className='d-flex justify-content-end align-items-center m-2'>
                    <ColorCodingSearch color={"color-indicator-4-bg"} label={t("Yellow For Complete")} />
                    <ColorCodingSearch color={"color-indicator-22-bg"} label={t("Light Blue For Issue Requested")} />
                    <ColorCodingSearch color={"color-indicator-1-bg"} label={t("Acknowledge Light Green")} />
                    <ColorCodingSearch color={"color-indicator-21-bg"} label={t("Rejected Pink")} />
                    <ColorCodingSearch color={"color-indicator-11-bg"} label={t("Issued Pink")} />

                </div>
            )}

            {requestList?.length > 0 && (
                <Tables
                    thead={THEAD}
                    tbody={requestList?.map((item, index) => ({
                        sno: index + 1,
                        idNo: item?.Id || "-",
                        indentNo: item?.IndentNo || "-",
                        natureOfRequest: item?.NatureOfReqName || "-",
                        dietDescription: item?.Description || "-",
                        acknowledgeBy: item?.AcknowledgeBy || "-",
                        rejectedBy: item?.RejectedBy || "-",
                        issueReqBy: item?.IssueRequestedBy || "-",
                        issueBy: item?.IssueBy || "-",

                        date: moment(item?.EntryDate).format("DD/MM/YYYY") || "-",
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
                        ):"-",
                        receivingClick: item?.CanRecived === 1?(
                            <div className='d-flex justify-content-center align-items-center'>
                                <button
                                    className="btn btn-primary"
                                    type="button"
                                    disabled={item?.CanRecived === 1 ? false : true}
                                    onClick={() => {
                                        handleRejectReceiveRequest("receive", item?.Id);
                                    }}
                                >
                                    <i className='fas fa-check'></i>
                                </button>
                            </div>
                        ):"-",

                    }))}
                    getRowClass={getRowClass}
                />

            )}


        </div>
    )
}
