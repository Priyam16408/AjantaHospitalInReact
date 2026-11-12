
import React, { useState } from 'react'
import moment from 'moment'
import { useTranslation } from "react-i18next";
import { getPatientBloodBankIndentApprovalApi } from '../../networkServices/BloodBank/BloodBank';
import { updatePatientStatusBloodRequisitionApi } from '../../networkServices/DietApi';
import { notify } from '../../utils/ustil2';
import Heading from '../../components/UI/Heading';
import Input from '../../components/formComponent/Input';
import ReactSelect from '../../components/formComponent/ReactSelect';
import DatePicker from '../../components/formComponent/DatePicker';
import ColorCodingSearch from '../../components/commonComponents/ColorCodingSearch';
import Tables from '../../components/UI/customTable';
import { BloodCrossIssueModal } from './BloodCrossIssueModal';
import Modal from '../../components/modalComponent/Modal';


const statusOptions = [
    { label: "All", value: 0 },
    { label: "Pending", value: 1 },
    { label: "Acknowledged", value: 3 },
    { label: "Rejected", value: 2 },
    { label: "Issued", value: 4 },
    { label: "Received", value: 5 },
];

export default function PatientBloodRequireIndentApproval() {
    const [tbodyData, setTbodyData] = useState([]);
    const [handleModelData, setHandleModelData] = useState({});
    const setIsOpen = () => {
        setHandleModelData((val) => ({ ...val, isOpen: false }));
    };
    const { t } = useTranslation();
    const { VITE_DATE_FORMAT } = import.meta.env;


    const getRowClass = (val) => {
        console.log(val,'value')
        
        let newtbody = tbodyData?.find((item) => item?.Id === val?.id);
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
        { name: t("Acknowledge"), width: "10%" },
        { name: t("Reject"), width: "5%" },
        { name: t("Blood Ready"), width: "5%" },
        { name: t("Issue"), width: "5%" },
        { name: t("Id"), width: "5%" },
        { name: t("IPD No"), width: "10%" },
        { name: t("Patient Id"), width: "10%" },
        { name: t("Patient Name"), width: "10%" },
        { name: t("Blood Product Require"), width: "10%" },
        { name: t("Nature of requisition"), width: "10%" },
        { name: t("Cross/Issue"), width: "10%" },
        { name: t("Acknowledge By"), width: "15%" },
        { name: t("Acknowledge Date"), width: "10%" },
        { name: t("Rejected By"), width: "10%" },
        { name: t("Prepared By"), width: "10%" },
        { name: t("Issue Req By"), width: "10%" },
        { name: t("Issue By"), width: "10%" },

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
    const handleGetPatientBloodBankIndentList = async () => {

        const payload = {
            patientId: values?.Reg_no || 0,
            status: values?.status?.value || 0,
            fromDate: values?.fromDate ? moment(values?.fromDate).format("YYYY-MM-DD") : "",
            toDate: values?.toDate ? moment(values?.toDate).format("YYYY-MM-DD") : "",
        }
        try {
            const response = await getPatientBloodBankIndentApprovalApi(payload);
            if (response?.success) {
                setTbodyData(response?.data);
            } else {
                notify(response?.message ? response?.message : "Something went wrong!", "error");
            }
        } catch (error) {
            notify(error?.message, "error");
        }
    }


    const handleIssueRequest = async (data) => {
        if(!data?.CTBNo){
            notify("Please select CTBNo.","warn")
            return;
        }
        const payload = {
            Id: data?.Id || 0,
            type: 6,
            CTBNo: data?.CTBNo,
            CrossIssue: data?.CrossIssue
        }
        try {
            const response = await updatePatientStatusBloodRequisitionApi(payload);
            if (response?.success) {
                notify(response?.message, "success");
                handleGetPatientBloodBankIndentList();
                setIsOpen()
            } else {
                notify(response?.message || "Something went wrong");
            }
        } catch (error) {
            notify(error?.message, "error");
        }
    }


    const handleRejectReceiveRequest = async (status, Id, tid) => {
        debugger
        if (status === "issue") {
            setHandleModelData({
                label: t("Save Issue"),
                buttonName: t(""),
                width: "40vw",
                isOpen: true,
                Component: (
                    <BloodCrossIssueModal
                        handleChangeModal={handleIssueRequest}
                        Id={Id}
                        tid={tid}
                    />
                ),
                // handleInsertAPI: saveDocument,
                extrabutton: <></>,
                footer: <></>,
            });
            return
        }

        const payload = {
            Id: Id || 0,
            type: status === "issue" ? 6 : status === "reject" ? 2 : status === "bloodReady" ? 4 : 3,
        }
        try {
            const response = await updatePatientStatusBloodRequisitionApi(payload);
            if (response?.success) {
                notify(response?.message, "success");
                handleGetPatientBloodBankIndentList();
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
                        onClick={handleGetPatientBloodBankIndentList}
                    >
                        {t("Search")}
                    </button>

                </div>
            </div>

            {tbodyData?.length > 0 && (
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
                                    className="btn text-danger"
                                    disabled={item?.CanReject === 1 ? false : true}
                                    type="button"
                                    onClick={() => {
                                        handleRejectReceiveRequest("reject", item?.Id);
                                    }}
                                >
                                    <i className='fas fa-times'></i>
                                </button>
                            ) : "-",
                            CanBloodPrepared: item?.CanBloodPrepared === 1 ? (
                                <button
                                    className="btn btn-secondary"
                                    disabled={item?.CanBloodPrepared === 1 ? false : true}
                                    type="button"
                                    onClick={() => {
                                        handleRejectReceiveRequest("bloodReady", item?.Id);
                                    }}
                                >
                                    <i className='fas fa-check'></i>
                                </button>
                            ) : "-",
                            issue: item?.CanIssue === 1 ? (
                                <div className='d-flex justify-content-center align-items-center'>
                                    <button
                                        className="btn btn-primary"
                                        type="button"
                                        disabled={item?.CanIssue === 1 ? false : true}
                                        onClick={() => {
                                            handleRejectReceiveRequest("issue", item?.Id, item?.TransactionId);
                                        }}
                                    >
                                        <i className='fas fa-check'></i>
                                    </button>
                                </div>
                            ) : "-",
                            id:item?.Id,
                            IPDNo: item?.IPDNo || "-",
                            PatientId: item?.PatientID || "-",
                            patientName: item?.PatientName || "-",
                            BloodProductRequired: item?.BloodProductRequired || "-",
                            natureOfRequest: item?.NatureOfReqName || "-",
                            crosseIssue: item?.CrosseIssue || "-",
                            acknowledgeBy: item?.AcknowledgeBy || "-",
                            acknowledgeDate: item?.AcknowledgeDate ? moment(item?.AcknowledgeDate).format("DD/MM/YYYY hh:mm A") : "-",
                            rejectedBy: item?.RejectedBy || "-",
                            bloodPrepareBy: item?.BloodPrepareBy || "-",
                            issueReqBy: item?.IssueRequestedBy || "-",
                            issueBy: item?.IssueBy || "-",

                        }))}
                        getRowClass={getRowClass}
                        tableHeight={"scrollView"}
                    // style={!isMobile ? { height: "44vh" } : {}}
                    />
                </div>
            )}

            {handleModelData?.isOpen && (
                <Modal
                    visible={handleModelData?.isOpen}
                    setVisible={setIsOpen}
                    modalWidth={handleModelData?.width}
                    Header={t(handleModelData?.label)}
                    buttonType={"submit"}
                    buttons={handleModelData?.extrabutton}
                    buttonName={handleModelData?.buttonName}
                    //   modalData={modalData}
                    //   setModalData={setModalData}
                    footer={handleModelData?.footer}
                    handleAPI={handleModelData?.handleInsertAPI}
                >
                    {/* //uguiguiguiguig */}
                    {handleModelData?.Component}
                </Modal>
            )}

        </div>
    )
}
