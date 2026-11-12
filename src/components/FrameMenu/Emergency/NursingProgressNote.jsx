import React, { useEffect, useState } from 'react'
import Heading from '../../UI/Heading'
import { useTranslation } from 'react-i18next'
import ReactSelect from '../../formComponent/ReactSelect'
import Tables from '../../UI/customTable'
import DatePicker from '../../formComponent/DatePicker'
import TimePicker from '../../formComponent/TimePicker'
import TextAreaInput from '../../formComponent/TextAreaInput'
import { SaveNursingProgress, SearchNursingProgress, UpdateNursingProgress } from '../../../networkServices/nursingWardAPI'
import moment from 'moment'
import { notify, timeFormateDate } from '../../../utils/utils'
import { OpenPDFURL } from '../../../networkServices/PDFURL'

export default function NursingCarePlanandProgress({ data }) {
    let [t] = useTranslation()
    const { VITE_DATE_FORMAT } = import.meta.env;
    let iniTialValue = { transactionID: data?.transactionID, patientID: data?.patientID, type: "save", NursingPrescription: '', Problems: '', Evaluation: '', date: new Date(), time: new Date() }
    const [tbody, setTbody] = useState([])
    const [values, setValues] = useState(iniTialValue)
    // const [payload, setPayload] = useState({
    //     Date: new Date(),
    //     nextVisit: new Date(),
    //     DisChargeAdvice: "",
    //     IssueItems: "",
    //     PatientComplaint: [],
    //     Evaluation: [],
    //     NursingInterventionAndImplementation: [],
    // });

    const [nursingProgressList, setNursingProgressList] = useState()

    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues((val) => ({ ...val, [name]: value }))
        // setPayload({
        //     ...payload,
        //     [name]: value,
        // });
    };

    const handleIndicator = (state) => {
        return (
            <div className="text-danger">
                (max 1000 Charcter) <span className="text-dark">Remaining : </span>{" "}
                <span className="text-success">{Number(1000 - state?.length)}</span>
            </div>
        );
    };

    const thead = [
        { width: "1%", name: t("SNo") },
        t("Date"),
        t("Time"),
        t("PatientProblem"),
        t("NursingInterventionandImplementation"),
        t("Evaluation"),
        t("EntryBy"),
        { width: "2%", name: t("Edit") },
    ]


    const handleEdit = (val) => {
        setValues({ ...val, ...{ type: "edit", time: timeFormateDate(val?.time),date:new Date(val?.dateTime),Evaluation:val?.evaluation,NursingPrescription:val?.nursingPrescription,Problems:val?.problems } });
    }

    const SearchNursingProgressAPI = async () => {
        let apiResp = await SearchNursingProgress(data?.transactionID)
        if (apiResp?.success) {
            let data = []
            apiResp?.data?.map((val, i) => {
                let obj = {}
                obj.sno = i + 1
                obj.date = val?.dateTime
                obj.time = val?.time
                obj.Problems = val?.problems
                obj.NursingPrescription = val?.nursingPrescription
                obj.Evaluation = val?.evaluation
                obj.EntryBy = val?.entryBy
                obj.edit = <i className="fa fa-edit" aria-hidden="true" onClick={() => { handleEdit(val) }}></i>
                data.push(obj);
            })
            setTbody(data);
        } else {
            setTbody([])
        }
    }
    useEffect(() => {
        SearchNursingProgressAPI()
    }, [])

    const ErrorHandling = () => {
        let errors = {};
        errors.id = [];
        if (!values?.Problems) {
            errors.Temp = "Patient Complaint Is Required";
        }
        if (!values?.NursingPrescription) {
            errors.resp = "Nursing Intervention And Implementation Is Required";
        }
        if (!values?.Evaluation) {
            errors.PanelCardName = "Evaluation Is Required";
        }
        return errors;
    };

    const SaveNursingPrgrees = async (type) => {
        const customerrors = ErrorHandling();
        if (Object.keys(customerrors)?.length > 1) {
            if (Object.values(customerrors)[0]) {
                notify(Object.values(customerrors)[1], "error");
            }
            return false;
        }
        values.date = moment(values.date).format("yyyy-MM-DD")
        values.time = moment(values?.time).format("HH:mm")
        console.log("value", values)
        let apiResp
        if (type === "save") {
        apiResp = await SaveNursingProgress(values);
        } else {
            apiResp = await UpdateNursingProgress(values);
        }
        if (apiResp?.success) {
            SearchNursingProgressAPI();
            setValues(iniTialValue);
            notify(apiResp.message, "success");
        } else {
            notify(apiResp.message, "error");
        }


    }

    const handleNursingProgressPrintOut = async()=>{
        OpenPDFURL("NursingProgressPrintOut", data?.transactionID,0);
      }

    return (
        <>
            <div className="mt-2 spatient_registration_card">
                <div className='card'>
                    <Heading
                        title={t("NursingCarePlanedProgress")}
                        isBreadcrumb={false}
                    />

                    <div className='row m-1'>
                        <div className="col-xl-2 col-md-3 col-sm-4 col-12">
                            <DatePicker
                                className={`custom-calendar `}
                                respclass="col-12"
                                id="date"
                                name="date"
                                // inputClassName={"required-fields"}
                                value={values?.date ? values?.date : new Date()}
                                handleChange={handleChange}
                                lable={t("Date")}
                                placeholder={VITE_DATE_FORMAT}
                            />

                            <TimePicker
                                placeholderName={t("Time")}
                                lable={t("Time")}
                                id="time"
                                respclass="col-12"
                                name="time"
                                value={values?.time ? values?.time : new Date()}
                                handleChange={handleChange}
                            />

                            <div className="my-2">
                                {values?.type === "save" ?
                                    <button
                                        className="btn btn-sm btn-success w-50"
                                        type="button"
                                        onClick={()=>{SaveNursingPrgrees("save")}}
                                    >
                                        {t("Save")}
                                    </button> :
                                    <button
                                        className="btn btn-sm btn-success w-50"
                                        type="button"
                                        onClick={()=>{SaveNursingPrgrees("update")}}
                                    >
                                        {t("Update")}
                                    </button>
                                }
                                <button className="btn btn-sm btn-success w-50 " type="button" 
                                onClick={handleNursingProgressPrintOut}
                                >
                                    {t("PrintNotes")}
                                </button>
                            </div>
                        </div>

                        <div className="col-xl-3 col-md-4 col-sm-4 col-12">
                            <TextAreaInput
                                lable={t("Patient Complaint")}
                                className="w-100 required-fields"
                                id="Problems"
                                rows={4}
                                name="Problems"
                                value={values?.Problems ? values?.Problems : ""}
                                onChange={handleChange}
                                maxLength={1000}
                            />
                            {handleIndicator(values?.Problems)}
                        </div>
                        <div className="col-xl-3 col-md-4 col-sm-4 col-12">
                            <TextAreaInput
                                lable={t("NursingInterventionAndImplementation")}
                                className="w-100 required-fields"
                                id="NursingPrescription"
                                rows={4}
                                name="NursingPrescription"
                                value={values?.NursingPrescription ? values?.NursingPrescription : ""}
                                onChange={handleChange}
                                maxLength={1000}
                            />
                            {handleIndicator(values?.NursingPrescription)}
                        </div>
                        <div className="col-xl-3 col-md-4 col-sm-4 col-12">
                            <TextAreaInput
                                lable={t("Evaluation")}
                                className="w-100 required-fields"
                                id="Evaluation"
                                rows={4}
                                name="Evaluation"
                                value={values?.Evaluation ? values?.Evaluation : ""}
                                onChange={handleChange}
                                maxLength={1000}
                            />
                            {handleIndicator(values?.Evaluation)}
                        </div>
                    </div>
                </div>
            </div>
            <div className='patient_registration card'>
                <Heading
                    title={t("result")}
                    isBreadcrumb={false} />

                <Tables
                    thead={thead}
                    tbody={tbody}
                />
            </div>
        </>
    )
}
