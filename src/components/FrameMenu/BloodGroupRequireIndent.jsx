import React, { useState, useEffect } from 'react'
import ReactSelect from '../formComponent/ReactSelect';
import Heading from '../UI/Heading';
import Input from '../formComponent/Input';
import { useTranslation } from 'react-i18next';
import { BindBloodGroup, getBloodVolumeOfRequisitionApi, getProductOfRequisitionApi, getBloodNatureOfRequisitionApi, patientBloodRequisitionApi, getBloodRequisitionApi, updatePatientBloodRequisitionStatusApi, getBloodRequisitionIndentReportApi } from '../../networkServices/BillingsApi';
import { handleReactSelectDropDownOptions, notify } from '../../utils/utils';
import ColorCodingSearch from '../commonComponents/ColorCodingSearch';
import Tables from '../UI/customTable';
import moment from 'moment';
import { ReprintSVG } from '../SvgIcons';
import { RedirectURL } from '../../networkServices/PDFURL';

const BloodGroupRequireIndent = (props) => {
    const { patientID, ipdno, transactionID } = props?.data || {};
    const { t } = useTranslation();
    const [values, setValues] = useState({
        clinicalDiagnosis: "",
        bloodGroup: "",
        bloodId: "",
        medicalHistoryOfAnaemia: "",

    });
    const [DropDownState, setDropDownState] = useState({
        bloodGroup: [],
        bloodVolume: [],
        productRequisition: [],
        natuareOfReaction: [],
    });
    const [requestList, setRequestList] = useState([]);

    const getRowClass = (val) => {
        let newtbody = requestList?.find((item) => item?.Id === val?.idNo);
        if (newtbody?.STATUS === 5) {
            return "color-indicator-22-bg";
        } else if (
            newtbody?.STATUS === 2
        ) {
            return "color-indicator-21-bg";

        }
        else if (newtbody?.STATUS === 4) {
            return "color-indicator-1-bg";
        }
        else if (newtbody?.STATUS === 3) {
            return "color-indicator-26-bg";
        }
        else if (newtbody?.STATUS === 6) {
            return "color-indicator-4-bg";
        } else {
            return "";
        }
    };
    const THEAD = [
        { name: t("S.No"), width: "1%" },
        { name: t("Date"), width: "10%" },
        { name: t("ID No"), width: "15%" },
        { name: t("Indent No"), width: "15%" },
        { name: t("Blood Product Required"), width: "15%" },
        { name: t("Nature of request"), width: "10%" },
        { name: t("Cross/Issue"), width: "10%" },
        { name: t("Acknowledge By"), width: "15%" },
        { name: t("Rejected By"), width: "10%" },
        { name: t("Issue Req By"), width: "10%" },
        { name: t("Issue By"), width: "10%" },
        { name: t("Reject"), width: "5%" },
        { name: t("Issue Request"), width: "5%" },
        { name: t("Print Indent"), width: "5%" },
        { name: t("Print Issue"), width: "5%" },
    ]

    const handleReactSelectChange = (name, val) => {
        setValues((prev) => ({
            ...prev,
            [name]: val,
        }));
    }
    const handleChange = (e) => {
        setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    };
    const getBindBloodGroup = async () => {
        try {
            const data = await BindBloodGroup();
            return data?.data;
        } catch (error) {
            console.error(error);
        }
    };
    const getBindBloodRequisition = async () => {
        try {
            const data = await getBloodVolumeOfRequisitionApi();
            return data?.data;
        } catch (error) {
            notify(error?.message, "error")
        }
    }
    const getBindProductRequsition = async () => {
        try {
            const data = await getProductOfRequisitionApi();
            return data?.data;
        } catch (error) {
            notify(error?.message, "error")
        }
    }
    const getBindBloodNatuareOfReaction = async () => {
        try {
            const data = await getBloodNatureOfRequisitionApi();
            return data?.data;
        } catch (error) {
            notify(error?.message, "error")
        }
    }
    const FetchAllDropDown = async () => {
        try {
            const [bloodRequisitionData, bloodGroupData, productRequisition, natuareOfReaction] = await Promise.all([
                getBindBloodRequisition(),
                getBindBloodGroup(),
                getBindProductRequsition(),
                getBindBloodNatuareOfReaction(),
            ]);

            const dropDownData = {
                bloodVolume: handleReactSelectDropDownOptions(
                    bloodRequisitionData,
                    "Text",
                    "Value",
                ),
                bloodGroup: handleReactSelectDropDownOptions(
                    bloodGroupData,
                    "bloodgroup",
                    "id"
                ),
                productRequisition: handleReactSelectDropDownOptions(
                    productRequisition,
                    "Text",
                    "Value",
                ),
                natuareOfReaction: handleReactSelectDropDownOptions(
                    natuareOfReaction,
                    "Text",
                    "Value",
                )


            };

            setDropDownState(dropDownData);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };
    const handleGetPatientRequestList = async () => {
        try {
            const response = await getBloodRequisitionApi(transactionID);
            if (response?.success) {
                setRequestList(response?.data);
            } else {
                notify(response?.message || "Something went wrong");
            }
        } catch (error) {
            notify(error?.message, "error");
        }
    }
    const handleSave = async () => {
        try {
            if (!values?.bloodGroup?.label) {
                notify("Please Select Blood Group", "warn");
                return;
            }
            if (!values?.bloodRequisition?.value) {
                notify("Please Select Blood Requisition", "warn");
                return;
            }
            if (!values?.natuareOfReaction?.value) {
                notify("Please Select Natuare Of Reaction", "warn");
                return;
            }
            if (!values?.productRequisition?.value) {
                notify("Please Select Blood product Requisition", "warn");
                return;
            }
            const payload = {
                patientID: patientID,
                transactionId: transactionID,
                ipdNo: ipdno,
                natureOfReqID: 1,
                natureOfReqName: "",
                clinicalDiagnosis: values?.clinicalDiagnosis,
                bloodGroup: values?.bloodGroup?.label,
                bloodId: values?.bloodGroup?.value,
                medicalHistoryOfAnaemia: values?.medicalHistoryOfAnaemia,
                reasonForBloodTransfusion: values?.reasonForBloodTransfusion,
                anyPreviousTransfusion: values?.anyPreviousTransfusion,
                unfavourableReaction: values?.unfavourableReaction,
                natuareOfReaction: values?.natuareOfReaction?.value,
                natuareOfReactionId: values?.natuareOfReaction?.label,
                bloodProductRequired: values?.productRequisition?.label,
                bloodProductRequiredId: values?.productRequisition?.value,
                volumeRequired: values?.bloodRequisition?.label,
                volumeRequiredId: values?.bloodRequisition?.value,

            }
            const resp = await patientBloodRequisitionApi(payload)
            if (resp?.success) {
                notify(resp?.message, "success");
                handleGetPatientRequestList();
            } else {
                notify(resp?.message, "error");
                setRequestList([])
            }
        } catch (error) {
            notify(error, "error");
        }
    }



    const handleRejectReceiveRequest = async (status, Id) => {
        const payload = {
            Id: Id || 0,
            type: status === "issueRequest" ? 5 : 2,
            remarks: ""
        }
        try {
            const response = await updatePatientBloodRequisitionStatusApi(payload);
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

    const handlePrintReport = async (type, data) => {
        // console.log("call");
        const payload = {
            type: type,
            id: data?.Id
        }
        const response = await getBloodRequisitionIndentReportApi(payload)
        if (response?.success){
            RedirectURL(response?.data);
        } else {
            notify(response?.message || "No Records Found", "error");
        }
    }

    useEffect(() => {
        FetchAllDropDown();
        handleGetPatientRequestList();
    }, []);
    return (
        <div className=''>
            <Heading title={"Blood Require Indent "} isBreadcrumb={true} />
            <div className='card '>
                <div className="row p-2">

                    <Input
                        type="text"
                        className="form-control"
                        lable={t("clinical Diagnosis")}
                        placeholder=" "
                        id="medicalHistoryOfAnaemia"
                        name="medicalHistoryOfAnaemia"
                        onChange={handleChange}
                        value={values?.medicalHistoryOfAnaemia || ""}
                        // maxLength={200}
                        // required={true}
                        respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                    />
                    <ReactSelect
                        placeholderName={t("Blood Group")}
                        name="bloodGroup"
                        value={`${values?.bloodGroup?.value}`}
                        handleChange={handleReactSelectChange}
                        requiredClassName={"required-fields"}
                        dynamicOptions={DropDownState?.bloodGroup}
                        searchable={true}
                        id={"bloodGroup"}
                        respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                        removeIsClearable={true}
                    />
                    <Input
                        type="text"
                        className="form-control"
                        lable={t("Medical History Of Anaemia")}
                        placeholder=" "
                        id="clinicalDiagnosis"
                        name="clinicalDiagnosis"
                        onChange={handleChange}
                        value={values?.clinicalDiagnosis || ""}
                        // maxLength={200}
                        required={true}
                        respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                    />
                    <Input
                        type="text"
                        className="form-control"
                        lable={t("Reason For Blood Transfusion")}
                        placeholder=" "
                        id="reasonForBloodTransfusion"
                        name="reasonForBloodTransfusion"
                        onChange={handleChange}
                        value={values?.reasonForBloodTransfusion || ""}
                        // maxLength={200}
                        required={true}
                        respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                    />
                    <Input
                        type="text"
                        className="form-control"
                        lable={t("Any Previous Transfusion")}
                        placeholder=" "
                        id="anyPreviousTransfusion"
                        name="anyPreviousTransfusion"
                        onChange={handleChange}
                        value={values?.anyPreviousTransfusion || ""}
                        // maxLength={200}
                        required={true}
                        respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                    />
                    <Input
                        type="text"
                        className="form-control"
                        lable={t("Unfavourable Reaction")}
                        placeholder=" "
                        id="unfavourableReaction"
                        name="unfavourableReaction"
                        onChange={handleChange}
                        value={values?.unfavourableReaction || ""}
                        // maxLength={200}
                        // required={true}
                        respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                    />

                    <ReactSelect
                        placeholderName={t("Natuare Of Reaction")}
                        name="natuareOfReaction"
                        value={`${values?.natuareOfReaction?.value}`}
                        handleChange={handleReactSelectChange}
                        dynamicOptions={DropDownState?.natuareOfReaction}
                        requiredClassName={"required-fields"}
                        searchable={true}
                        id={"natuareOfReaction"}
                        respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                        removeIsClearable={true}
                    />
                    <ReactSelect
                        placeholderName={t("Blood Product Required")}
                        name="productRequisition"
                        value={`${values?.productRequisition?.value}`}
                        handleChange={handleReactSelectChange}
                        dynamicOptions={DropDownState?.productRequisition}
                        requiredClassName={"required-fields"}
                        searchable={true}
                        id={"productRequisition"}
                        respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                        removeIsClearable={true}
                    />
                    <ReactSelect
                        placeholderName={t("Blood Requisition")}
                        name="bloodRequisition"
                        value={`${values?.bloodRequisition?.value}`}
                        handleChange={handleReactSelectChange}
                        dynamicOptions={DropDownState?.bloodVolume}
                        searchable={true}
                        id={"bloodRequisition"}
                        requiredClassName={"required-fields"}
                        respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                        removeIsClearable={true}
                    />
                    <button
                        className="btn btn-primary ml-2"
                        type="button"
                        onClick={handleSave}
                    >
                        Save
                    </button>
                </div>
            </div>
            {requestList?.length > 0 && (
                <div className="mt-2 spatient_registration_card">
                    <div className="patient_registration card " style={{ borderRadius: "5px" }}>

                        <Heading title={t("Patient Details")} secondTitle={<>
                            <ColorCodingSearch color={"color-indicator-4-bg"} label={t("Yellow For Complete")} />
                            <ColorCodingSearch color={"color-indicator-22-bg"} label={t("Light Blue For Issue Requested")} />
                            <ColorCodingSearch color={"color-indicator-26-bg"} label={t("Acknowledge Light Gray")} />
                            <ColorCodingSearch color={"color-indicator-1-bg"} label={t("Blood Ready To Issue Green")} />
                            <ColorCodingSearch color={"color-indicator-21-bg"} label={t("Rejected Pink")} />
                            <ColorCodingSearch color={"color-indicator-11-bg"} label={t("Issued Pink")} />
                        </>} />
                        <Tables
                            thead={THEAD}
                            tbody={requestList?.map((item, index) => ({
                                sno: index + 1,
                                date: moment(item?.EntryDate).format("DD/MM/YYYY") || "-",
                                idNo: item?.Id || "-",
                                indentNo: item?.IndentNo || "-",
                                BloodProductRequired: item?.BloodProductRequired || "",
                                natureOfRequest: item?.NatureOfReqName || "-",
                                cross: item?.Cross || "-",
                                acknowledgeBy: item?.AcknowledgeBy || "-",
                                rejectedBy: item?.RejectedBy || "-",
                                issueReqBy: item?.IssueRequestedBy || "-",
                                issueBy: item?.IssueBy || "-",

                                reject: item?.CanReject === 1 ? (
                                    <button
                                        className="btn btn-secondary"
                                        disabled={item?.CanReject === 1 ? false : true}
                                        type="button"
                                        onClick={() => {
                                            handleRejectReceiveRequest("reject", item?.Id);
                                        }}
                                    >
                                        <i className='fas fa-times'></i>
                                    </button>
                                ) : "-",
                                issueRequest: item?.CanDoIssueRequest === 1 ? (
                                    <div className='d-flex justify-content-center align-items-center'>
                                        <button
                                            className="btn btn-primary"
                                            type="button"
                                            disabled={item?.CanDoIssueRequest === 1 ? false : true}
                                            onClick={() => {
                                                handleRejectReceiveRequest("issueRequest", item?.Id);
                                            }}
                                        >
                                            <i className='fas fa-check'></i>
                                        </button>
                                    </div>
                                ) : "-",
                                print: true ? (
                                    <div onClick={() => handlePrintReport(1, item)}>
                                        <ReprintSVG />
                                    </div>
                                ) : "-",
                                printIssue: item?.STATUS >= 5 ? (
                                    <div onClick={() => handlePrintReport(0, item)}>
                                        <ReprintSVG />
                                    </div>
                                ) : "-",
                            }))}
                            getRowClass={getRowClass}
                            tableHeight={"scrollView"}
                        />
                    </div>
                </div>
            )}

        </div >
    )
}

export default BloodGroupRequireIndent;