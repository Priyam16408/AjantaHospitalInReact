import React, { useEffect, useState } from 'react'
import Input from '../formComponent/Input'
import ReactSelect from '../formComponent/ReactSelect'
import TextAreaInput from '../formComponent/TextAreaInput'
import { useTranslation } from 'react-i18next'
import { notify } from '../../utils/ustil2'
import { getPatientBloodDetailsApi } from '../../networkServices/resultEntry'

export const BloodGroupFeeding = ({ bloodGroupData, handleChangeModal, PatientID }) => {
    const { t } = useTranslation()
    const [patientBloodDetails, setPatientBloodDetails] = useState({})
    const [values, setValues] = useState({
        bloodGroup: patientBloodDetails?.bloodgroup,
        remarks: patientBloodDetails?.BloodGroupRemark
    })


    console.log(patientBloodDetails, 'SUGCSKJ')
    const handleGetPatientBloodDetails = async () => {
        try {
            const response = await getPatientBloodDetailsApi(PatientID);
            if (response?.success) {
                notify(response?.message, "success");
                setValues({
                    bloodGroup: response?.data?.bloodgroup,
                    remarks: response?.data?.BloodGroupRemark
                })
            } else {
                notify(response?.message, "error");
                return;
            }
        } catch (error) {
            notify(error?.message, "error");
            return;
        }
    }

    const handleReactSelectChange = (name, val) => {
        setValues((prev) => ({
            ...prev,
            [name]: val.value,
        }));
    }
    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    const handleSubmit = () => {
        handleChangeModal(values);
    };

    useEffect(() => {
        if (PatientID) {
            handleGetPatientBloodDetails()
        }
    }, [])

    return (
        <>
            <div className="d-flex justify-content-start align-items-center col-xl-12 col-md-12 col-sm-12 col-12 " style={{ gap: "5px" }}>
                <Input
                    type="text"
                    className="form-control"
                    lable={t("Patient ID")}
                    value={PatientID || ""}
                    disabled={true}
                    respclass="col-xl-6 col-md-6 col-sm-12 p-0"
                />
                <ReactSelect
                    placeholderName={t("Blood Group")}
                    name="bloodGroup"
                    value={`${values?.bloodGroup}`}
                    handleChange={handleReactSelectChange}
                    dynamicOptions={bloodGroupData}
                    searchable={true}
                    id={"bloodGroup"}
                    respclass="col-xl-6 col-md-6 col-sm-12 "
                    removeIsClearable={true}
                />

            </div>
            <TextAreaInput className="min-h-70"
                respclass="col-xl-12 col-md-12 col-sm-12 col-12" lable='Remarks' name="remarks" rows={3} value={values?.remarks} maxLength={500} onChange={handleChange} />
            <div className='d-flex justify-content-end'>

                <button className='btn tn-primary' onClick={handleSubmit} >Save</button>
            </div>
        </>
    )
}
