import React from 'react'
import LabeledInput from '../../../components/formComponent/LabeledInput'
import Heading from '../../../components/UI/Heading'
import { useTranslation } from 'react-i18next'

export default function IPDPatientDetail({ patientDetail }) {
    const [t] = useTranslation()
    return (
        <>
            <div className="mt-2 spatient_registration_card">
                <div className="patient_registration card">
                    <Heading isBreadcrumb={false} title={"Patient Detail"} />
                    <div className="row p-2">
                    <div className='col-xl-2 col-md-2 col-sm-4 col-12 pb-2'>
                            <LabeledInput
                                label={t("IPD No.")}
                                value={patientDetail?.IPNo}
                            />
                        </div>
                        <div className="col-xl-2 col-md-2 col-sm-4 col-12 pb-2">
                            <LabeledInput
                                label={t("UHID")}
                                value={patientDetail?.PatientID}
                            />
                        </div>

                        <div className='col-xl-2 col-md-2 col-sm-4 col-12 pb-2'>
                            <LabeledInput
                                label={t("Patient Name")}
                                value={patientDetail?.PName}
                            />
                        </div>

                        
                        <div className='col-xl-2 col-md-2 col-sm-4 col-12 pb-2'>
                            <LabeledInput
                                label={t("Room No.")}
                                value={patientDetail?.RoomNo}
                            />
                        </div>


                        <div className='col-xl-2 col-md-2 col-sm-4 col-12 pb-2'>
                            <LabeledInput
                                label={t("Doctor Name")}
                                value={patientDetail?.DoctorName}
                            />
                        </div>

                        <div className='col-xl-2 col-md-2 col-sm-4 col-12 pb-2'>
                            <LabeledInput
                                label={t("Admission Date")}
                                value={patientDetail?.AdmissionDate}
                            />
                        </div>
                      

                    </div>
                </div>
            </div>
        </>
    )
}
