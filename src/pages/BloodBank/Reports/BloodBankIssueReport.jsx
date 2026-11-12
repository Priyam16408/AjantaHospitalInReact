import React, { useState } from 'react'
import Heading from '../../../components/UI/Heading';
import { useTranslation } from 'react-i18next';
import { notify } from '../../../utils/ustil2';
import moment from 'moment';
import { exportToExcel } from '../../../utils/exportLibrary';
import DatePicker from '../../../components/formComponent/DatePicker';
import ReactSelect from '../../../components/formComponent/ReactSelect';
import { getBloodRequisitionReportApi } from '../../../networkServices/BloodBank/BloodBank';

const BloodBankIssueReport = () => {
    const { t } = useTranslation();
    const { VITE_DATE_FORMAT } = import.meta.env;
    const Status = [
        { label: "All", value: 0 },
        { label: "Reject", value: "2" },
        { label: "Issues Request", value: "5" },
        { label: "Aknowledge", value: "3" },
        { label: "Blood Prepared", value: "4" },
        { label: "Recieve", value: "7" },
        { label: "Issue", value: "6" },
    ]
    const [values, setValues] = useState({
        toDate: new Date(),
        fromDate: new Date(),
        status: { label: "All", value: "0" }
    })
    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues((val) => ({ ...val, [name]: value }))
    };

    const handleSelect = (name, value) => {
        setValues((prev) => ({ ...prev, [name]: value }));
    };

    // const ExceldataFormatter = (tableData) => {
    //     const HardCopy = JSON.parse(JSON.stringify(tableData));
    //     const modifiedResponseData = HardCopy?.map((ele, index) => {
    //         // delete ele?.TypeID;
    //         delete ele?.canAcknowledge;
    //         delete ele?.canBloodPrepared;
    //         delete ele?.canIssue;
    //         delete ele?.canReject;
    //         delete ele?.status;
    //         delete ele?.img;

    //         return { ...ele };
    //     });

    //     return modifiedResponseData;
    // };
    const ExceldataFormatter = (tableData) => {
        const HardCopy = JSON.parse(JSON.stringify(tableData));

        const modifiedResponseData = HardCopy?.map((ele, index) => {
            // Only include required fields, in a specific order
            return {
                SNo: index + 1,
                IndentNo: ele?.indentNo,
                EntryDate: ele?.entryDate,
                PatientName: ele?.patientName,
                IPDNo: ele?.ipdNo,
                PatientID: ele?.patientID,
                Gender: ele?.gender,
                Age: ele?.age,
                BloodGroup: ele?.bloodGroup,
                RoomDetails: ele?.roomDetails,
                WardName: ele?.wardName,
                DoctorName: ele?.doctorName,
                ClinicalDiagnosis: ele?.clinicalDiagnosis,
                BloodProductRequired: ele?.bloodProductRequired,
                VolumeRequired: ele?.volumeRequired,
                CrossIssue: ele?.crossIssue,
                CTBNo: ele?.ctbNo,
                Location: ele?.location,
                AcknowledgeBy: ele?.acknowledgeBy,
                AcknowledgeDate: ele?.acknowledgeDate,
                BloodPrepareBy: ele?.bloodPrepareBy,
                BloodPrepareDate: ele?.bloodPrepareDate,
                IssueRequestedBy: ele?.issueRequestedBy,
                IssueRequestDate: ele?.issueRequestDate,
                IssueBy: ele?.issueBy,
                IssuedDate: ele?.issuedDate,
                ReceivedBy: ele?.receivedBy,
                RejectedBy: ele?.rejectedBy,
                RejectedDate: ele?.rejectedDate,
                TransactionId: ele?.transactionId,
                MedicalHistoryOfAnaemia: ele?.medicalHistoryOfAnaemia,
                ReasonForBloodTransfusion: ele?.reasonForBloodTransfusion,
                AnyPreviousTransfusion: ele?.anyPreviousTransfusion,
                UnfavourableReaction: ele?.unfavourableReaction,
            };
        });

        return modifiedResponseData;
    };


    const handleSearchReport = async () => {
        try {
            debugger
            if (!values?.status) {
                notify("Status is Required ", "warn")
                return;
            }

            const payload = {
                patientId: "",
                fromDate: moment(values?.fromDate).format("DD-MMM-YYYY") || "",
                toDate: moment(values?.toDate).format("DD-MMM-YYYY") || "",
                status: Number(values?.status?.value)
            }
            const response = await getBloodRequisitionReportApi(payload);
            if (response?.success) {
                exportToExcel(
                    ExceldataFormatter(response?.data),
                    `Blood Bank ${values?.status?.label} Report`,
                    "",
                    `Blood_Bank_${values?.status?.label}_Report`,
                    `Blood_Bank_ ${values?.status?.label}_Report`
                );
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
                <DatePicker
                    className="custom-calendar"
                    id="fromDate"
                    name="fromDate"
                    lable={t("FromDate")}
                    placeholder={VITE_DATE_FORMAT}
                    respclass="col-xl-3 col-md-4 col-sm-4 col-12"
                    value={values?.fromDate ? values?.fromDate : new Date()}
                    maxDate={new Date()}
                    handleChange={handleChange}
                />

                <DatePicker
                    className="custom-calendar"
                    respclass="col-xl-3 col-md-4 col-sm-4 col-12"
                    id="toDate"
                    name="toDate"
                    value={values?.toDate ? values?.toDate : new Date()}
                    handleChange={handleChange}
                    lable={t("ToDate")}
                    maxDate={new Date()}
                    placeholder={VITE_DATE_FORMAT}
                />
                <ReactSelect
                    placeholderName={t("Status")}
                    searchable={true}
                    respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                    id="status"
                    name="status"
                    removeIsClearable={true}
                    requiredClassName={"required-fields"}
                    dynamicOptions={Status}
                    handleChange={handleSelect}
                    value={values?.status?.value}
                />
                <button className="btn btn-sm btn-success ml-2" type="button" onClick={handleSearchReport}>
                    {t("Excel Report")}
                </button>
            </div>
        </div>
    )
}

export default BloodBankIssueReport;