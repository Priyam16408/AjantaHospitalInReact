import React, { useEffect, useState } from 'react'
import Heading from '../../UI/Heading';
import TextAreaInput from '../../formComponent/TextAreaInput';
import {  bindDoctorCarePlanList, SaveDoctorProgressNoteAPI } from '../../../networkServices/Emergency';
import { notify } from '../../../utils/utils';
import Tables from '../../UI/customTable';
import { useLocalStorage } from '../../../utils/hooks/useLocalStorage';
import { useTranslation } from 'react-i18next';

export default function DoctorProgressNote({ data }) {
    let userData = useLocalStorage("userData", "get")
    const thead = [
        {name:"S.No.",width:"1%"},
        {name:"Date",width:"1%"},
        "Notes",
        {name:"EntryBy",width:"1%"},
        {name:"Edit",width:"1%"},
    ]
    const {t} =useTranslation()
    const [values, setValues] = useState({})
    const [tBody, setTbody] = useState([])
    const handleChange = (e) => {
        const { name, value } = e.target
        setValues((val) => ({ ...val, [name]: value }))
    }
    const getDoctorProgressNoteList = async () => {
        let apiResp = await bindDoctorCarePlanList(data?.PatientID)
        if (apiResp?.success) {
            setTbody(apiResp?.data)
        } else {
            setTbody([])
        }
    }
    useEffect(() => {
        getDoctorProgressNoteList()
    }, [])

    const handleSaveDoctorProgressNote = async () => {
        let payload = {
            "type": values?.ID ? "Update" : "",
            "transactionID": data?.TID,
            "patientID": data?.PatientID,
            "carePlan": values?.CarePlan ? values?.CarePlan : "",
            "userID": userData?.employeeID ? userData?.employeeID : "",
            "id": values?.ID? values?.ID : ""
        }
        let apiResp = await SaveDoctorProgressNoteAPI(payload)
        if (apiResp?.success) {
            setValues({})
            notify(apiResp?.message, "success")
            getDoctorProgressNoteList()
        } else {
            notify(apiResp?.message, "error")
        }
    }

    const handleEdit = (index)=>{
        let data = tBody[index]
        setValues(data)
    }

    return (
        <>
            <div className="card patient_registration border mt-2">
                <div className="card card_background">
                    <Heading title={<div>Doctor Care Plan</div>} />
                    <div className="row p-2">

                        <TextAreaInput
                            lable={"Doctor Care Plan"}
                            className="w-100 required-fields"
                            id="Miscellaneous"
                            rows={2}
                            respclass="col-xl-4 col-md-4 col-sm-6 col-12"
                            name="CarePlan"
                            value={values?.CarePlan ? values?.CarePlan : ""}
                            onChange={handleChange}
                        />


                        <div className="mt-2  text-right pb-1">
                            <button className=" btn-primary btn-sm px-5 ml-1 custom_save_button" type="button"
                                onClick={handleSaveDoctorProgressNote}
                            >
                                {t("Save")}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card patient_registration border mt-2">
                <div className="card card_background">
                    <Heading title={<div>{t("Result")}</div>} />

                    {console.log("tBody", tBody)}
                    <Tables
                        thead={thead}
                        tbody={tBody?.map((val, index) => ({
                            index: index + 1,
                            Date: val?.Date,
                            CarePlan: val?.CarePlan,
                            Name: val?.Name,
                            Edit: <i className="fa fa-edit text-center" aria-hidden="true" onClick={() => { handleEdit(index) }}></i>,
                        }))}
                    />

                </div>
            </div>

        </>
    )
}
