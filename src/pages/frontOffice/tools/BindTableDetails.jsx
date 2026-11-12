import React, { useEffect, useState } from 'react'
import Heading from '../../../components/UI/Heading'
import DatePicker from '../../../components/formComponent/DatePicker'
import moment from "moment";
import Tables from '../../../components/UI/customTable';
import { useTranslation } from "react-i18next";
import { notify } from '../../../utils/utils';
import { BillingToolRemoveChemoPatientDetail, BillingToolSearchChemoHistory } from '../../../networkServices/Tools';
import ReactSelect from '../../../components/formComponent/ReactSelect';

const BindTableDetails = ({ dataLoading }) => {
    const { VITE_DATE_FORMAT } = import.meta.env;
    const [payload, setPayload] = useState({
        sift: { value: "Morning", label: "Morning" },
        // fromDate: new Date(),
        // toDate: new Date(),

        toDate: moment().format("YYYY-MM-DD"),
        fromDate: moment().format("YYYY-MM-DD"),
    })

    const [t] = useTranslation();

    const [tableData, setTableData] = useState([]);
    const OrderGetPOList = async () => {
        let data =
        {

            "fromDate": moment(payload?.fromDate).format("YYYY-MM-DD"),
            "toDate": moment(payload?.toDate).format("YYYY-MM-DD"),
            "shiftType": payload?.sift?.value

        }

        try {

            const response = await BillingToolSearchChemoHistory(data);
            console.log("responseresponse", response)
            if (response?.success) {
                setTableData(response?.data);
            } else {
                setTableData([]);
                notify(response?.message, "error");
            }
        } catch (error) {
            setTableData([]);
            console.log(error, "SomeThing Went Wrong");
        }
    };


    const searchHandleChange = (e) => {
        const { name, value } = e.target;
        setPayload((prevState) => ({
            ...prevState,
            [name]: moment(value).format("YYYY-MM-DD"),
        }));
    };
    useEffect(() => {
        OrderGetPOList();
    }, [dataLoading]);
    const HandleSearch = () => {
        OrderGetPOList();
    }

    const THEAD = [
        { name: t("S No."), width: "2%" },
        { name: t("CR No."), width: "10%" },
        { name: t("Patient Name"), width: "15%" },
        { name: t("Doctor Name"), width: "10%" },
        { name: t("Date"), width: "10%" },
        { name: t("Sift"), width: "10%" },
        { name: t("ID"), width: "10%" },
        { name: t("IPD No."), width: "10%" },
        { name: t("Action"), width: "10%" },

    ];


    const handleDelete = async (val, ind) => {
        const payload = {
            id: val?.ChemoID
        }
        try {
            const response = await BillingToolRemoveChemoPatientDetail(payload);
            if (response?.success) {
                HandleSearch()
                notify(response?.message, "success")
            }
            else {
                notify(response?.message, "error")
            }
        } catch (error) {

        }
    }


    const handleReactSelectDynamicOptions = (name, value) => {
        setPayload((prevData) => {
            return {
                ...prevData,
                [name]: value || "",
            };
        })
    }

    return (
        <div className="patient_registration card">
            <Heading title={t("Search PO Details")} isBreadcrumb={false} />
            <div className="row p-2">

                <ReactSelect
                    respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                    name="sift"
                    id="sift"
                    placeholderName={t("Shift")}
                    dynamicOptions={[ { value: "0", label: "All" },{ value: "Morning", label: "Morning" }, { value: "Evening", label: "Evening" },]}
                    handleChange={handleReactSelectDynamicOptions}
                    value={payload?.sift?.value}
                />
                <DatePicker
                    className="custom-calendar"
                    id="From Data"
                    name="fromDate"
                    lable={t("FromDate")}
                    placeholder={VITE_DATE_FORMAT}
                    respclass="col-xl-2 col-md-3 col-sm-6 col-12"
                    value={
                        payload.fromDate
                            ? moment(payload.fromDate, "YYYY-MM-DD").toDate()
                            : null
                    }
                    maxDate={new Date()}
                    handleChange={searchHandleChange}
                />
                <DatePicker
                    className="custom-calendar"
                    id="DOB"
                    name="toDate"
                    lable={t("To Date")}
                    value={
                        payload.toDate
                            ? moment(payload.toDate, "YYYY-MM-DD").toDate()
                            : null
                    }
                    maxDate={new Date()}
                    handleChange={searchHandleChange}
                    placeholder={VITE_DATE_FORMAT}
                    respclass="col-xl-2 col-md-3 col-sm-6 col-12"
                />
                <div className="col-xl-2 col-md-3 col-sm-6 col-12">
                    <button
                        className="btn btn-sm btn-primary mr-1"
                        onClick={() => HandleSearch()}
                    >
                        {t("Search")}
                    </button>

                </div>
            </div>
            <div className="patient_registration card">
                <div className="row">
                    <div className="col-12">
                        <Tables
                            thead={THEAD}

                            tbody={tableData?.map((val, ind) => ({
                                Sno: ind + 1,
                                PatientID: val?.PatientID,
                                PatientName: val?.PatientName,
                                DoctorName: val?.DoctorName,
                                ChemoDate: val?.ChemoDate,
                                Shift: val?.Shift,
                                ChemoID: val?.ChemoID,
                                IPDNO: val?.IPDNO,
                                btn: (
                                    <i className={`fa fa-trash `}
                                style={{color:"red"}}
                                        onClick={() => handleDelete(val, ind)}
                                    ></i>

                                ),
                            }))}
                            tableHeight={"scrollView"}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BindTableDetails