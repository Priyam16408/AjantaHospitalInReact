import React, { useEffect, useState } from 'react'
import Heading from '../UI/Heading'
import { useTranslation } from 'react-i18next'
import DatePicker from '../formComponent/DatePicker';
import TimePicker from "../formComponent/TimePicker";
import Input from '../formComponent/Input';
import ReactSelect from '../formComponent/ReactSelect';
import MultiSelectComp from '../formComponent/MultiSelectComp';
import Tables from '../UI/customTable';
import { BindAvailablenurse, bindOxygenData, bindOxygenRecord, SaveOxygenRecord, UpdateOxygenRecord, validateOxygenRecord } from '../../networkServices/nursingWardAPI';
import { handleReactSelectDropDownOptions, notify, timeFormateDate } from '../../utils/utils';
import moment from 'moment';
import { useLocalStorage } from '../../utils/hooks/useLocalStorage';

export default function ({ data }) {
    const [t] = useTranslation();
    const { VITE_DATE_FORMAT } = import.meta.env;

    const TypeOfTherapy = [];
    for (let i = 1; i <= 12; i++) {
        TypeOfTherapy.push({ label: i.toString(), value: i.toString() });
    }

    const [availableNurse, setAvailableNurse] = useState([])
    const [tbody, setTbody] = useState([])
    let userData = useLocalStorage("userData", "get");
    let iniTialValue = { oxygenID: "", timeOnCreatedBy: userData?.employeeID, patientID: data?.patientID, transactionID: data?.transactionID, type: "save", fillTimeON: 0 }
    const [values, setValues] = useState(iniTialValue)



    const thead = [
        { width: "1%", name: t("SNO") },
        t("DateON"),
        t("TimeON"),
        t("TimeONNurse"),
        t("DateOFF"),
        t("TimeOFF"),
        t("TimeOFFNurse"),
        t("Therapy"),
        { width: "1%", name: t("Edit") },
    ]
    

    const handleEdit = (val) => {
        setValues((item)=>({...iniTialValue,
            type:"edit",
            oxygenDateON: new Date(val?.OxygenDateON),
            timeOn:timeFormateDate(val?.OxygenTimeON),
            nurseTimeOn:val?.NurseTimeON,
            timeOff:timeFormateDate(val?.OxygenTimeOFF),
            nurseTimeOff: val?.NurseTimeOFf,
            dateOff: new Date(val?.OxygenDateOFF),
            typeOfTherapy:val?.TypeOfTherapy,
            isOxygenData:false,
            oxygenID:val?.ID,
        }))
    }

    const SearchOxygenDataAPI = async () => {
        let apiResp = await bindOxygenRecord(data?.transactionID)
        if (apiResp?.success) {
            let data = []
            apiResp?.data?.map((val, i) => {
                let obj = {}
                obj.sno = i + 1
                obj.oxygenDateON = val?.OxygenDateON
                obj.timeOn = val?.OxygenTimeON
                obj.nurseTimeOn = val?.NurseTimeONBy
                obj.dateOff = val?.OxygenDateOFF
                obj.timeOff = val?.OxygenTimeOFF
                obj.nurseTimeOff = val?.NurseTimeOffBy
                obj.typeOfTherapy = val?.TypeOfTherapy
                obj.edit = <i className="fa fa-edit" aria-hidden="true" onClick={() => { handleEdit(val) }}></i>
                data.push(obj);
            })
            setTbody(data);
            setValues((val) => ({ ...val, fillTimeON: val?.fillTimeON }))
        } else {
            setTbody([])
        }
        let bindOxygenDetails = await bindOxygenData(data?.transactionID);
        if (bindOxygenDetails?.success) {
            const time = new Date();
            if (bindOxygenDetails?.data[0]?.OxygenTimeON) {
                const [hours, minutes, period] = bindOxygenDetails?.data[0]?.OxygenTimeON.match(/(\d+):(\d+)\s*(AM|PM)/i).slice(1);
                time.setHours(period === "PM" && hours !== "12" ? +hours + 12 : hours === "12" && period === "AM" ? 0 : +hours);
                time.setMinutes(+minutes);
            }
            setValues((val)=>({...val,
                oxygenDateON: new Date(bindOxygenDetails?.data[0]?.OxygenDateON),
                timeOn:time,
                nurseTimeOn:bindOxygenDetails?.data[0]?.NurseTimeON,
                typeOfTherapy:bindOxygenDetails?.data[0]?.TypeOfTherapy,
                isOxygenData:true,

            }))
        }
        
    }

    const bindNurseList = async()=>{
        let availableNurses = await BindAvailablenurse();
        if (availableNurses?.success) {
            setAvailableNurse(availableNurses?.data)
        }
    }

    useEffect(() => {
        SearchOxygenDataAPI()
        bindNurseList()
    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues((val) => ({ ...val, [name]: value }))
    };


    const ErrorHandling = () => {
        let errors = {};
        errors.id = [];
        if (!values?.oxygenDateON) {
            errors.oxygenDateON = "Oxygen Date ON Field Is Required";
        }
        if (!values?.timeOn) {
            errors.timeOn = "Time On Field Is Required";
        }
        if (!values?.nurseTimeOn) {
            errors.nurseTimeOn = "Nurse Time On Field Is Required";
        }
        if (!values?.nurseTimeOff && values?.fillTimeON) {
            errors.nurseTimeOff = "Nurse Time Off Field Is Required";
        }
        if (!values?.dateOff && values?.fillTimeON) {
            errors.dateOff = "Date Off Field Is Required";
        }
        if (!values?.timeOff && values?.fillTimeON) {
            errors.timeOff = "Time Off Field Is Required";
        }
        if (!values?.typeOfTherapy) {
            errors.typeOfTherapy = "Type Of Therapy Field Is Required";
        }
        return errors;
    };

    const SaveOxygenForm = async (type) => {
        const customerrors = ErrorHandling();
        if (Object.keys(customerrors)?.length > 1) {
            if (Object.values(customerrors)[0]) {
                notify(Object.values(customerrors)[1], "error");
            }
            return false;
        }
        values.oxygenDateON = moment(values.oxygenDateON).format("yyyy-MM-DD")
        values.dateOff = moment(values.dateOff).format("yyyy-MM-DD")
        values.timeOn = moment(values?.timeOn).format("HH:mm")
        values.timeOff = moment(values?.timeOff).format("HH:mm")

        let apiResp
        if (type === "save") {
            let validationOxyResp = await validateOxygenRecord(values);
            if (!validationOxyResp?.success) {
                apiResp = await SaveOxygenRecord(values);
            } else {
                notify(validationOxyResp.message, "error");
            }
        } else {
            apiResp = await UpdateOxygenRecord(values);
        }
        if (apiResp?.success) {
            SearchOxygenDataAPI();
            setValues(iniTialValue);
            notify(apiResp.message, "success");
        } else {
            notify(apiResp.message, "error");
        }


    }

    const handleReactSelect = (name, value) => {
        setValues((val) => ({ ...val, [name]: value }));
    };
    return (
        <>
            <div className="mt-2 spatient_registration_card">
                <form className="patient_registration card">
                    <Heading
                        title={t("Oxygen Usage Recording Sheet")}
                        isBreadcrumb={false} />

                    <div className="row p-2">
                        <div className='col-xl-2 col-md-4 col-sm-6 col-12 d-flex'>

                            <DatePicker
                                className={`custom-calendar `}
                                respclass="vital-sign-date"
                                id="oxygenDateON"
                                name="oxygenDateON"
                                inputClassName={"required-fields"}
                                value={ values?.oxygenDateON ? values?.oxygenDateON : ""}
                                handleChange={handleChange}
                                disable={values?.isOxygenData?true:false}
                                lable={t("DateON")}
                                placeholder={VITE_DATE_FORMAT}
                            />
                            <TimePicker
                                placeholderName={t("TimeON")}
                                lable={t("TimeON")}
                                id="timeOn"
                                respclass="vital-sign-time ml-1"
                                className="required-fields"
                                name="timeOn"
                                value={values?.timeOn ? values?.timeOn : ""}
                                handleChange={handleChange}
                                disable={values?.isOxygenData?true:false}
                            />

                        </div>




                        <ReactSelect
                            placeholderName={t("NurseTimeON")}
                            dynamicOptions={handleReactSelectDropDownOptions(availableNurse, "NAME", "EmployeeID")}
                            name="nurseTimeOn"
                            inputId="nurseTimeOn"
                            requiredClassName={"required-fields"}
                            value={values?.nurseTimeOn ? values?.nurseTimeOn : ""}
                            removeIsClearable={true}
                            handleChange={handleReactSelect}
                            searchable={true}
                            isDisabled={values?.isOxygenData?true:false}
                            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                        />

                        <div className='col-xl-2 col-md-4 col-sm-6 col-12 d-flex'>

                            <DatePicker
                                className={`custom-calendar `}
                                respclass="vital-sign-date"
                                id="dateOff"
                                name="dateOff"
                                inputClassName={"required-fields"}
                                value={values?.dateOff ? values?.dateOff : ""}
                                handleChange={handleChange}
                                lable={t("DateOFF")}
                                placeholder={VITE_DATE_FORMAT}
                            />
                            <TimePicker
                                placeholderName={t("TimeOFF")}
                                lable={t("TimeOFF")}
                                id="timeOff"
                                className="required-fields"
                                respclass="vital-sign-time ml-1"
                                name="timeOff"
                                value={values?.timeOff ? values?.timeOff : ""}
                                handleChange={handleChange}
                            />

                        </div>
                        <ReactSelect
                            placeholderName={t("Nurse Time Off")}
                            name="nurseTimeOff"
                            inputId="nurseTimeOff"
                            requiredClassName={"required-fields"}
                            dynamicOptions={handleReactSelectDropDownOptions(availableNurse, "NAME", "EmployeeID")}
                            value={values?.nurseTimeOff ? values?.nurseTimeOff : ""}
                            handleChange={handleReactSelect}
                            searchable={true}
                            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                        />
                        <ReactSelect
                            placeholderName={t("Type Of Therapy")}
                            dynamicOptions={TypeOfTherapy}
                            name="typeOfTherapy"
                            requiredClassName={"required-fields"}
                            inputId="typeOfTherapy"
                            value={values?.typeOfTherapy ? values?.typeOfTherapy : ""}
                            handleChange={handleReactSelect}
                            searchable={true}
                            removeIsClearable={true}
                            isDisabled={values?.isOxygenData?true:false}
                            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                        />

                        <div className="">
                            {values?.type === "save" ?
                                <button
                                    className="btn btn-sm btn-success"
                                    // style={{float:"right"}}
                                    type="button"
                                    onClick={() => { SaveOxygenForm("save") }}
                                >
                                    {t("save")}
                                </button> :
                                <button
                                    className="btn btn-sm btn-success "
                                    type="button"
                                    onClick={() => { SaveOxygenForm("update") }}
                                >
                                    {t("Update")}
                                </button>
                            }
                        </div>


                        {/* <div className="ml-2 mb-2 d-flex justify-content-end" >
                        <button className="btn btn-sm btn-success mr-2" type="button" >
                            {t("NursingWard.VitalSign.Save")}
                        </button>
                    </div> */}
                    </div>
                </form>
            </div>
            <div className="mt-2 spatient_registration_card card">


                <Tables
                    thead={thead}
                    tbody={tbody}
                />
            </div>
        </>
    )
}
